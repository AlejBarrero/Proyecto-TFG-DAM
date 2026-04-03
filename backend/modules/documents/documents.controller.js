import { processUploadedDocument } from './documents.service.js';

export const uploadDocumentController = async (req, res) => {
  try {
    const result = await processUploadedDocument(req.file);
    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    if (statusCode === 500) {
      console.error('Error inesperado en uploadDocumentController:', error);
    }

    return res.status(statusCode).json({
      message: error.message || 'Error interno del servidor. Por favor, intentalo de nuevo.',
      ...(error.causeMessage ? { error: error.causeMessage } : {}),
    });
  }
};
