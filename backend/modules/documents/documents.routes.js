import express from 'express';
import { requireAuth } from '../auth/auth.middleware.js';
import {
  deleteDocumentController,
  getDocumentAudioController,
  getDocumentByIdController,
  listUserDocumentsController,
  updateDocumentController,
  uploadDocumentController,
  uploadGuestDocumentController,
} from './documents.controller.js';
import { uploadDocumentMiddleware } from './documents.upload.middleware.js';

const router = express.Router();

router.post('/guest-upload', uploadDocumentMiddleware, uploadGuestDocumentController);

router.use(requireAuth);

router.get('/', listUserDocumentsController);
router.get('/:id', getDocumentByIdController);
router.get('/:id/audio', getDocumentAudioController);
router.patch('/:id', updateDocumentController);
router.delete('/:id', deleteDocumentController);
router.post('/upload', uploadDocumentMiddleware, uploadDocumentController);

export default router;
