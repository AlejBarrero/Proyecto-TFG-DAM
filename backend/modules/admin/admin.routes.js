import express from 'express';
import { requireAuth, requireAdmin } from '../auth/auth.middleware.js';
import {
  listDocumentsController,
  listUsersController,
} from './admin.controller.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/users', listUsersController);
router.get('/documents', listDocumentsController);

export default router;
