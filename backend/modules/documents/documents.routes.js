import express from 'express';
import { uploadDocumentMiddleware } from './documents.upload.middleware.js';
import { uploadDocumentController } from './documents.controller.js';

const router = express.Router();

router.post('/upload', uploadDocumentMiddleware, uploadDocumentController);

export default router;
