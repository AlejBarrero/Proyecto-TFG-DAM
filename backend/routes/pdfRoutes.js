import express from 'express';
import multer from 'multer';
import { handlePdfUpload } from '../controllers/pdfController.js';
import fs from 'fs-extra';

// Crea la carpeta uploads si no existe
fs.ensureDirSync('uploads');

const router = express.Router();

const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '10');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Solo se permiten archivos PDF'), false);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});

// Middleware para errores de Multer
const uploadMiddleware = (req, res, next) => {
    upload.single('pdf')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: `El archivo supera el límite de ${MAX_SIZE_MB} MB` });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

router.post('/upload', uploadMiddleware, handlePdfUpload);

export default router;
