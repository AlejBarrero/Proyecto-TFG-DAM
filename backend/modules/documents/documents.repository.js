import fs from 'fs-extra';
import path from 'path';
import {
  AUDIO_RETENTION_MS,
  DOCUMENTS_UPLOAD_DIR,
  GUEST_AUDIO_SUBDIR,
  PRIVATE_AUDIO_SUBDIR,
  STORAGE_DIR,
} from './documents.constants.js';
import { sanitizePdfFileName } from './documents.validator.js';


// Crea la carpeta uploads si no existe
export const ensureUploadsDir = () => {
  fs.ensureDirSync(DOCUMENTS_UPLOAD_DIR);
  fs.ensureDirSync(path.join(DOCUMENTS_UPLOAD_DIR, GUEST_AUDIO_SUBDIR));
  fs.ensureDirSync(path.join(STORAGE_DIR, PRIVATE_AUDIO_SUBDIR));
};

export const removeFileIfExists = async (filePath) => {
  if (!filePath) return;
  const exists = await fs.pathExists(filePath);
  if (exists) {
    await fs.remove(filePath);
  }
};

export const buildStoredPdfFileName = (originalName) => {
  const safeName = sanitizePdfFileName(originalName);
  return `${Date.now()}-${safeName}`;
};

export const buildStoredPdfPath = (fileName) => {
  return path.join(DOCUMENTS_UPLOAD_DIR, fileName);
};

// Elimina audios de mas de 1 hora de antiguedad
export const cleanOldAudioFiles = async () => {
  try {
    const guestAudioDir = path.join(DOCUMENTS_UPLOAD_DIR, GUEST_AUDIO_SUBDIR);
    const files = await fs.readdir(guestAudioDir);
    const now = Date.now();

    for (const file of files) {
      if (!file.endsWith('.mp3')) continue;

      const filePath = path.join(guestAudioDir, file);
      const { mtimeMs } = await fs.stat(filePath);

      if (now - mtimeMs > AUDIO_RETENTION_MS) {
        await fs.remove(filePath);
        console.log(`Audio eliminado por antiguedad: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error limpiando audios antiguos:', error.message);
  }
};
