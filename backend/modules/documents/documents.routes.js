import express from 'express';
import { requireAuth } from '../auth/auth.middleware.js';
import {
  deleteDocumentController,
  getDocumentAudioController,
  getDocumentByIdController,
  listUserDocumentsController,
  updateDocumentController,
  uploadDocumentController,
} from './documents.controller.js';
import { uploadDocumentMiddleware } from './documents.upload.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', listUserDocumentsController);
router.get('/:id', getDocumentByIdController);
router.get('/:id/audio', getDocumentAudioController);
router.patch('/:id', updateDocumentController);
router.delete('/:id', deleteDocumentController);
router.post('/upload', uploadDocumentMiddleware, uploadDocumentController);

export default router;
