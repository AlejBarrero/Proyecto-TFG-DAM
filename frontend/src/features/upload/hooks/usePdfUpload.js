import { useEffect, useState } from 'react';
import { validatePdfFile } from '../utils/validatePdfFile';
import {
  getDocumentAudioBlob,
  uploadDocument,
  uploadGuestDocument,
} from '../../../shared/api/documentsApi';

const initialMetadata = {
  title: '',
  author: '',
  genre: '',
  textType: '',
  isPublic: false,
};

export function usePdfUpload({ isAuthenticated, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (response?.audioUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(response.audioUrl);
      }
    };
  }, [response]);

  const selectFile = (selectedFile) => {
    setError(null);
    setResponse(null);

    const err = validatePdfFile(selectedFile);

    if (err) {
      setError(err);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const updateMetadata = (field, value) => {
    setMetadata((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const upload = async () => {
    if (!file) {
      setError('Selecciona un archivo PDF antes de continuar.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', metadata.title);
    formData.append('author', metadata.author);
    formData.append('genre', metadata.genre);
    formData.append('textType', metadata.textType);
    formData.append('isPublic', String(metadata.isPublic));

    try {
      if (isAuthenticated) {
        const document = await uploadDocument(formData);
        const audioBlob = await getDocumentAudioBlob(document.id);
        const audioUrl = URL.createObjectURL(audioBlob);

        const nextResponse = {
          ...document,
          audioUrl,
          translated: Boolean(document.translatedText),
        };

        setResponse(nextResponse);
        await onUploadSuccess?.(document);
      } else {
        const guestResult = await uploadGuestDocument(formData);
        setResponse(guestResult);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    if (response?.audioUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(response.audioUrl);
    }

    setFile(null);
    setMetadata(initialMetadata);
    setResponse(null);
    setError(null);
  };

  return {
    file,
    metadata,
    response,
    loading,
    error,
    selectFile,
    updateMetadata,
    upload,
    reset,
  };
}
