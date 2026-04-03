import { useState } from 'react';
import { validatePdfFile } from '../utils/validatePdfFile';
import { uploadPdf } from '../../../shared/api/pdfApi';

export function usePdfUpload() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    try {
      const data = await uploadPdf(formData);
      setResponse(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResponse(null);
    setError(null);
  };

  return {
    file,
    response,
    loading,
    error,
    selectFile,
    upload,
    reset,
  };
}
