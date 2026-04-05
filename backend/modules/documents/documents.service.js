import path from 'path';
import fs from 'fs-extra';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { detectLanguage } from '../../services/languageService.js';
import { normalizeText, hasEnoughContent } from '../../services/textNormalizationService.js';
import { translateToSpanish } from '../../services/translationService.js';
import { textToSpeech } from '../../services/ttsService.js';
import { extractTextFromPdf } from './pdfExtractor.js';
import { assertValidPdfFile } from './documents.validator.js';
import {
  buildAudioFileName,
  buildGuestAudioPath,
  buildGuestAudioUrl,
  buildPrivateAudioPath,
} from './documents.constants.js';
import { removeFileIfExists } from './documents.repository.js';


const validateUploadedFile = (file) => {
  if (!file) {
    const error = new Error('No se subio ningun archivo PDF.');
    error.statusCode = 400;
    throw error;
  }
};

const validateStoredPdfFile = async (filePath) => {
  try {
    await assertValidPdfFile(filePath);
  } catch (error) {
    await removeFileIfExists(filePath);

    const pdfValidationError = new Error('El archivo subido no es un PDF valido.');
    pdfValidationError.statusCode = error.statusCode || 422;
    throw pdfValidationError;
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

const translateIfNeeded = async (originalText, languageCode, filePath) => {
  if (languageCode !== 'eng') {
    return null;
  }

  try {
    return await translateToSpanish(originalText);
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

const generateAudioFromText = async (textForAudio, filePath, buildAudioDestinationPath) => {
  const audioFileName = buildAudioFileName();
  const audioPath = buildAudioDestinationPath(audioFileName);

  try {
    await fs.ensureDir(path.dirname(audioPath));
    await textToSpeech(textForAudio, 'es', audioPath);

    return {
      audioFileName,
      audioPath,
    };
  } catch (error) {
    await removeFileIfExists(filePath);

    const ttsError = new Error('Error al generar el audio. Por favor, intentalo de nuevo.');
    ttsError.statusCode = 502;
    ttsError.causeMessage = error.message;
    throw ttsError;
  }
};

const processDocumentCore = async (file, metadata = {}, buildAudioDestinationPath) => {
  const normalizedMetadata = normalizeDocumentMetadata(metadata);

  validateUploadedFile(file);
  await validateStoredPdfFile(file.path);

  try {
    const rawText = await extractDocumentText(file.path);
    const originalText = await normalizeAndValidateText(rawText, file.path);
    const langResult = await detectDocumentLanguage(originalText, file.path);
    const translatedText = await translateIfNeeded(originalText, langResult.code, file.path);
    const textForAudio = translatedText ?? originalText;

    const { audioFileName, audioPath } = await generateAudioFromText(
      textForAudio,
      file.path,
      buildAudioDestinationPath
    );

    await removeFileIfExists(file.path);

    return {
      normalizedMetadata,
      fileName: file.originalname,
      languageCode: langResult.code,
      originalText,
      translatedText,
      audioFileName,
      audioPath,
      translated: Boolean(translatedText),
    };
  } catch (error) {
    if (file?.path) {
      await removeFileIfExists(file.path).catch(() => {});
    }

    throw error;
  }
};

const normalizeDocumentMetadata = (metadata = {}) => {
  const {
    title = null,
    author = null,
    genre = null,
    textType = null,
    isPublic = false,
  } = metadata;

  return {
    title: title?.trim() || null,
    author: author?.trim() || null,
    genre: genre?.trim() || null,
    textType: textType?.trim() || null,
    isPublic: isPublic === true || isPublic === 'true',
  };
};

const createDocumentRecord = async ({
  userId,
  file,
  metadata,
  languageCode,
  originalText,
  translatedText,
  audioPath,
  audioFileName,
}) => {
  return prisma.document.create({
    data: {
      userId,
      fileName: file.originalname,
      title: metadata.title,
      author: metadata.author,
      genre: metadata.genre,
      textType: metadata.textType,
      isPublic: metadata.isPublic,
      languageCode,
      originalText,
      translatedText,
      audioPath,
      audioFileName,
    },
  });
};

const updateDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El titulo no puede estar vacio.')
    .max(255, 'El titulo no puede superar los 255 caracteres.')
    .optional(),
  author: z.string().trim().max(255, 'El autor no puede superar los 255 caracteres.').optional(),
  genre: z.string().trim().max(255, 'El genero no puede superar los 255 caracteres.').optional(),
  textType: z
    .string()
    .trim()
    .max(255, 'El tipo de texto no puede superar los 255 caracteres.')
    .optional(),
  isPublic: z.boolean().optional(),
});

const parseDocumentId = (documentId) => {
  const parsedId = Number(documentId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    const error = new Error('ID de documento invalido.');
    error.statusCode = 400;
    throw error;
  }

  return parsedId;
};

const ensureDocumentOwnership = async (userId, documentId) => {
  const parsedId = parseDocumentId(documentId);

  const document = await prisma.document.findFirst({
    where: {
      id: parsedId,
      userId,
    },
  });

  if (!document) {
    const error = new Error('Documento no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return document;
};

export const processUploadedDocument = async (file, userId, metadata = {}) => {
  const processed = await processDocumentCore(file, metadata, buildPrivateAudioPath);

  return createDocumentRecord({
    userId,
    file: { originalname: processed.fileName },
    metadata: processed.normalizedMetadata,
    languageCode: processed.languageCode,
    originalText: processed.originalText,
    translatedText: processed.translatedText,
    audioPath: processed.audioPath,
    audioFileName: processed.audioFileName,
  });
};

export const processGuestUploadedDocument = async (file, metadata = {}) => {
  const processed = await processDocumentCore(file, metadata, buildGuestAudioPath);

  return {
    fileName: processed.fileName,
    title: processed.normalizedMetadata.title || processed.fileName,
    languageCode: processed.languageCode,
    translated: processed.translated,
    translatedText: processed.translatedText,
    audioUrl: buildGuestAudioUrl(processed.audioFileName),
  };
};

export const listUserDocuments = async (userId) => {
  return prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fileName: true,
      title: true,
      author: true,
      genre: true,
      textType: true,
      isPublic: true,
      languageCode: true,
      createdAt: true,
    },
  });
};

export const getDocumentById = async (userId, documentId) => {
  const document = await ensureDocumentOwnership(userId, documentId);

  return {
    id: document.id,
    fileName: document.fileName,
    title: document.title,
    author: document.author,
    genre: document.genre,
    textType: document.textType,
    isPublic: document.isPublic,
    languageCode: document.languageCode,
    originalText: document.originalText,
    translatedText: document.translatedText,
    audioFileName: document.audioFileName,
    createdAt: document.createdAt,
  };
};

export const getDocumentAudioFile = async (userId, documentId) => {
  const document = await ensureDocumentOwnership(userId, documentId);

  const fileExists = await fs.pathExists(document.audioPath);

  if (!fileExists) {
    const error = new Error('El archivo de audio no existe.');
    error.statusCode = 404;
    throw error;
  }

  return {
    document,
    audioPath: document.audioPath,
  };
};

export const updateDocument = async (userId, documentId, payload) => {
  const parsedId = parseDocumentId(documentId);
  const existingDocument = await ensureDocumentOwnership(userId, parsedId);

  const result = updateDocumentSchema.safeParse(payload);

  if (!result.success) {
    const error = new Error(result.error.issues[0]?.message || 'Datos no validos.');
    error.statusCode = 400;
    throw error;
  }

  if (Object.keys(result.data).length === 0) {
    const error = new Error(
      'Debes enviar al menos uno de estos campos: title, author, genre, textType o isPublic.'
    );
    error.statusCode = 400;
    throw error;
  }

  const normalizedData = {
    ...(typeof result.data.title !== 'undefined' ? { title: result.data.title || null } : {}),
    ...(typeof result.data.author !== 'undefined' ? { author: result.data.author || null } : {}),
    ...(typeof result.data.genre !== 'undefined' ? { genre: result.data.genre || null } : {}),
    ...(typeof result.data.textType !== 'undefined'
      ? { textType: result.data.textType || null }
      : {}),
    ...(typeof result.data.isPublic !== 'undefined' ? { isPublic: result.data.isPublic } : {}),
  };

  return prisma.document.update({
    where: { id: existingDocument.id },
    data: normalizedData,
    select: {
      id: true,
      fileName: true,
      title: true,
      author: true,
      genre: true,
      textType: true,
      isPublic: true,
      languageCode: true,
      createdAt: true,
    },
  });
};

export const deleteDocument = async (userId, documentId) => {
  const document = await ensureDocumentOwnership(userId, documentId);

  await prisma.document.delete({
    where: { id: document.id },
  });

  await removeFileIfExists(document.audioPath);
};
