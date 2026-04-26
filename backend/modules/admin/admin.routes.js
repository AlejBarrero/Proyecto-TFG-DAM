import express from 'express';
import { requireAuth, requireAdmin } from '../auth/auth.middleware.js';
import {
  listDocumentsController,
  listUsersController,
  updateUserRoleController,
  deleteUserController,
  deleteAdminDocumentController,
} from './admin.controller.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/users', listUsersController);
router.get('/documents', listDocumentsController);

router.patch('/users/:userId/role', updateUserRoleController);
router.delete('/users/:userId', deleteUserController);

router.delete('/documents/:documentId', deleteAdminDocumentController);

export default router;
