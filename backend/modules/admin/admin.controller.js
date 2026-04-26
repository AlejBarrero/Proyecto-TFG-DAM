import { listAllDocuments, listAllUsers, updateUserRole, deleteUser, deleteAdminDocument } from './admin.service.js';

export const listUsersController = async (_req, res) => {
  try {
    const result = await listAllUsers();
    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      message: error.message || 'Error interno del servidor.',
    });
  }
};

export const listDocumentsController = async (_req, res) => {
  try {
    const result = await listAllDocuments();
    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      message: error.message || 'Error interno del servidor.',
    });
  }
};

export const updateUserRoleController = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const { role } = req.body;

    const result = await updateUserRole(userId, role);
    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      message: error.message || 'Error interno del servidor.',
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const result = await deleteUser(userId, req.user.id);

    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      message: error.message || 'Error interno del servidor.',
    });
  }
};

export const deleteAdminDocumentController = async (req, res) => {
  try {
    const documentId = Number(req.params.documentId);
    const result = await deleteAdminDocument(documentId);

    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      message: error.message || 'Error interno del servidor.',
    });
  }
};

