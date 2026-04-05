import multer from 'multer';
import {
  DOCUMENTS_FIELD_NAME,
  DOCUMENTS_UPLOAD_DIR,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from './documents.constants.js';
import {
  buildStoredPdfFileName,
  ensureUploadsDir,
} from './documents.repository.js';

ensureUploadsDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, DOCUMENTS_UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, buildStoredPdfFileName(file.originalname)),
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
    return;
  }

  cb(new Error('Solo se permiten archivos PDF'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

export const uploadDocumentMiddleware = (req, res, next) => {
  upload.single(DOCUMENTS_FIELD_NAME)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: `El archivo supera el limite de ${MAX_FILE_SIZE_MB} MB`,
        });
      }

      return res.status(400).json({ message: err.message });
    }

    if (err) {
      return res.status(400).json({ message: err.message });
    }

    next();
  });
};
