import { listAllDocuments, listAllUsers } from './admin.service.js';

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
