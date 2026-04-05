import path from 'path';

export const DOCUMENTS_UPLOAD_DIR = 'uploads';
export const DOCUMENTS_FIELD_NAME = 'pdf';
export const AUDIO_EXTENSION = '.mp3';

export const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10);
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const AUDIO_RETENTION_MS = 60 * 60 * 1000;

export const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

export const buildAudioFileName = () => `${Date.now()}${AUDIO_EXTENSION}`;

export const buildAudioPath = (fileName) => path.join(DOCUMENTS_UPLOAD_DIR, fileName);
