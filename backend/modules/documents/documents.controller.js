import {
  deleteDocument,
  getDocumentAudioFile,
  getDocumentById,
  listUserDocuments,
  processUploadedDocument,
  updateDocument,
} from './documents.service.js';

export const uploadDocumentController = async (req, res) => {
  try {
    const result = await processUploadedDocument(req.file, req.user.id, req.body);
    return res.status(201).json(result);
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

export const listUserDocumentsController = async (req, res) => {
  try {
    const result = await listUserDocuments(req.user.id);
    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      message: error.message || 'Error interno del servidor.',
    });
  }
};

export const getDocumentByIdController = async (req, res) => {
  try {
    const result = await getDocumentById(req.user.id, req.params.id);
    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      message: error.message || 'Error interno del servidor.',
    });
  }
};

export const getDocumentAudioController = async (req, res) => {
  try {
    const { document, audioPath } = await getDocumentAudioFile(req.user.id, req.params.id);

    return res.download(audioPath, document.audioFileName);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      message: error.message || 'Error interno del servidor.',
    });
  }
};

export const updateDocumentController = async (req, res) => {
  try {
    const result = await updateDocument(req.user.id, req.params.id, req.body);
    return res.json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      message: error.message || 'Error interno del servidor.',
    });
  }
};

export const deleteDocumentController = async (req, res) => {
  try {
    await deleteDocument(req.user.id, req.params.id);

    return res.status(204).send();
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      message: error.message || 'Error interno del servidor.',
    });
  }
};
