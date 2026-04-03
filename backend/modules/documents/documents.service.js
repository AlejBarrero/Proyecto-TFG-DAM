import { detectLanguage } from '../../services/languageService.js';
import {
  normalizeText,
  hasEnoughContent,
} from '../../services/textNormalizationService.js';
import { translateToSpanish } from '../../services/translationService.js';
import { textToSpeech } from '../../services/ttsService.js';
import { extractTextFromPdf } from './pdfExtractor.js';
import {
  BASE_URL,
  buildAudioFileName,
  buildAudioPath,
} from './documents.constants.js';
import {
  cleanOldAudioFiles,
  removeFileIfExists,
} from './documents.repository.js';

const validateUploadedFile = (file) => {
  if (!file) {
    const error = new Error('No se subio ningun archivo PDF.');
    error.statusCode = 400;
    throw error;
  }
};

const extractDocumentText = async (filePath) => {
  try {
    return await extractTextFromPdf(filePath);
  } catch (error) {
    await removeFileIfExists(filePath);

    const extractError = new Error(
      'No se pudo leer el archivo PDF. Asegurate de que no esta dañado.'
    );
    extractError.statusCode = 422;
    extractError.causeMessage = error.message;
    throw extractError;
  }
};

const normalizeAndValidateText = async (rawText, filePath) => {
  const text = normalizeText(rawText);

  if (!hasEnoughContent(text)) {
    await removeFileIfExists(filePath);

    const contentError = new Error(
      'El PDF no contiene suficiente texto digital. El sistema no soporta PDFs escaneados (imagenes de texto).'
    );
    contentError.statusCode = 422;
    throw contentError;
  }

  return text;
};

const detectDocumentLanguage = async (text, filePath) => {
  try {
    return detectLanguage(text);
  } catch (error) {
    await removeFileIfExists(filePath);
    error.statusCode = 422;
    throw error;
  }
};

const translateIfNeeded = async (text, langCode, filePath) => {
  if (langCode !== 'eng') {
    return {
      finalText: text,
      translated: false,
    };
  }

  try {
    const finalText = await translateToSpanish(text);

    return {
      finalText,
      translated: true,
    };
  } catch (error) {
    await removeFileIfExists(filePath);

    const translationError = new Error(
      'Traduccion no disponible en este momento. Por favor, intentalo de nuevo mas tarde.'
    );
    translationError.statusCode = 502;
    translationError.causeMessage = error.message;
    throw translationError;
  }
};

const generateAudioFromText = async (finalText, filePath) => {
  const audioFileName = buildAudioFileName();
  const audioPath = buildAudioPath(audioFileName);

  try {
    await textToSpeech(finalText, 'es', audioPath);

    return {
      audioFileName,
      audioPath,
    };
  } catch (error) {
    await removeFileIfExists(filePath);

    const ttsError = new Error(
      'Error al generar el audio. Por favor, intentalo de nuevo.'
    );
    ttsError.statusCode = 502;
    ttsError.causeMessage = error.message;
    throw ttsError;
  }
};

const buildSuccessResponse = (
  finalText,
  langLabel,
  translated,
  audioFileName
) => ({
  message: 'PDF convertido a audio correctamente.',
  detectedLanguage: langLabel,
  translated,
  preview: `${finalText.split(' ').slice(0, 60).join(' ')}...`,
  audioUrl: `${BASE_URL}/uploads/${audioFileName}`,
});

export const processUploadedDocument = async (file) => {
  validateUploadedFile(file);

  try {
    const rawText = await extractDocumentText(file.path);
    const text = await normalizeAndValidateText(rawText, file.path);
    const langResult = await detectDocumentLanguage(text, file.path);
    const { finalText, translated } = await translateIfNeeded(
      text,
      langResult.code,
      file.path
    );
    const { audioFileName } = await generateAudioFromText(finalText, file.path);

    cleanOldAudioFiles();
    await removeFileIfExists(file.path);

    return buildSuccessResponse(
      finalText,
      langResult.label,
      translated,
      audioFileName
    );
  } catch (error) {
    if (file?.path) {
      await removeFileIfExists(file.path).catch(() => {});
    }

    throw error;
  }
};
