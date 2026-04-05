import path from 'path';

export const DOCUMENTS_UPLOAD_DIR = 'uploads';
export const GUEST_AUDIO_SUBDIR = 'guest-audio';
export const STORAGE_DIR = 'storage';
export const PRIVATE_AUDIO_SUBDIR = 'audio';
export const DOCUMENTS_FIELD_NAME = 'pdf';
export const AUDIO_EXTENSION = '.mp3';

export const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const AUDIO_RETENTION_MS = 60 * 60 * 1000;

export const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

export const buildAudioFileName = () => `${Date.now()}${AUDIO_EXTENSION}`;

export const buildGuestAudioPath = (fileName) =>
  path.join(DOCUMENTS_UPLOAD_DIR, GUEST_AUDIO_SUBDIR, fileName);

export const buildPrivateAudioPath = (fileName) =>
  path.join(STORAGE_DIR, PRIVATE_AUDIO_SUBDIR, fileName);

export const buildGuestAudioUrl = (fileName) =>
  `${BASE_URL}/uploads/${GUEST_AUDIO_SUBDIR}/${fileName}`;
