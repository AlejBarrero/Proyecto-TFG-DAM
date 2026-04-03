import { extractTextFromPdf } from '../services/pdfService.js';
import { detectLanguage } from '../services/languageService.js';
import { normalizeText, hasEnoughContent } from '../services/textNormalizationService.js';
import { translateToSpanish } from '../services/translationService.js';
import { textToSpeech } from '../services/ttsService.js';
import fs from 'fs-extra';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Elimina archivos MP3 en uploads/ con más de 1 hora de antigüedad
const cleanOldAudioFiles = async () => {
  try {
    const uploadsDir = 'uploads';
    const files = await fs.readdir(uploadsDir);
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    for (const file of files) {
      if (!file.endsWith('.mp3')) continue;
      const filePath = path.join(uploadsDir, file);
      const { mtimeMs } = await fs.stat(filePath);
      if (now - mtimeMs > ONE_HOUR) {
        await fs.remove(filePath);
        console.log(`Audio eliminado por antigüedad: ${file}`);
      }
    }
  } catch (err) {
    console.error('Error limpiando audios antiguos:', err.message);
  }
};

export const handlePdfUpload = async (req, res) => {
  const file = req.file;

  try {
    if (!file) {
      return res.status(400).json({ message: 'No se subió ningún archivo PDF.' });
    }

    // ── PASO 1: Extraer texto del PDF ────────────────────────────────────
    let rawText;
    try {
      rawText = await extractTextFromPdf(file.path);
    } catch (err) {
      await fs.remove(file.path);
      return res.status(422).json({
        message: 'No se pudo leer el archivo PDF. Asegúrate de que no está dañado.',
        error: err.message,
      });
    }

    // ── PASO 2: Normalizar y sanitizar el texto ───────────────────────────
    const text = normalizeText(rawText);

    if (!hasEnoughContent(text)) {
      await fs.remove(file.path);
      return res.status(422).json({
        message:
          'El PDF no contiene suficiente texto digital. ' +
          'El sistema no soporta PDFs escaneados (imágenes de texto).',
      });
    }

    // ── PASO 3: Detectar idioma (solo EN o ES) ───────────────────────────
    let langResult;
    try {
      langResult = detectLanguage(text);
    } catch (err) {
      await fs.remove(file.path);
      return res.status(422).json({ message: err.message });
    }

    const { code: langCode, label: langLabel } = langResult;

    // ── PASO 4: Traducción condicional EN → ES ───────────────────────────
    let finalText = text;
    let translated = false;

    if (langCode === 'eng') {
      try {
        console.log(`Traduciendo documento de inglés a español...`);
        finalText = await translateToSpanish(text);
        translated = true;
        console.log(`Traducción completada.`);
      } catch (err) {
        await fs.remove(file.path);
        return res.status(502).json({
          message:
            'Traducción no disponible en este momento. Por favor, inténtalo de nuevo más tarde.',
          error: err.message,
        });
      }
    }
    // Si langCode === 'spa', se omite la traducción y se usa el texto original directamente

    // ── PASO 5: Generar audio TTS en español ─────────────────────────────
    const audioFileName = `${Date.now()}.mp3`;
    const audioPath = path.join('uploads', audioFileName);

    try {
      await textToSpeech(finalText, 'es', audioPath);
    } catch (err) {
      await fs.remove(file.path);
      return res.status(502).json({
        message: 'Error al generar el audio. Por favor, inténtalo de nuevo.',
        error: err.message,
      });
    }

    // ── Limpiar archivos antiguos en segundo plano ───────────────────────
    cleanOldAudioFiles();

    // ── PASO 6: Responder al cliente ─────────────────────────────────────
    res.json({
      message: 'PDF convertido a audio correctamente.',
      detectedLanguage: langLabel,
      translated,
      preview: finalText.split(' ').slice(0, 60).join(' ') + '...',
      audioUrl: `${BASE_URL}/uploads/${audioFileName}`,
    });

    // Eliminar el PDF original (después de responder para no bloquear)
    await fs.remove(file.path);
  } catch (err) {
    // Captura cualquier error inesperado
    console.error('Error inesperado en handlePdfUpload:', err);
    if (file?.path) await fs.remove(file.path).catch(() => {});
    res.status(500).json({
      message: 'Error interno del servidor. Por favor, inténtalo de nuevo.',
      error: err.message,
    });
  }
};
