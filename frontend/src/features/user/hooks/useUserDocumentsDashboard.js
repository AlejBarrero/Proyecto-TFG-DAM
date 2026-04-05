import { useEffect, useState } from 'react';
import {
  deleteDocument,
  getDocumentAudioBlob,
  getDocumentById,
  listUserDocuments,
  updateDocument,
} from '../../../shared/api/documentsApi';

const createEditableState = (document) => ({
  title: document?.title || '',
  author: document?.author || '',
  genre: document?.genre || '',
  textType: document?.textType || '',
  isPublic: Boolean(document?.isPublic),
});

export function useUserDocumentsDashboard() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editableDocument, setEditableDocument] = useState(createEditableState(null));
  const [audioUrl, setAudioUrl] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadDocuments = async () => {
    setLoadingList(true);
    setError(null);

    try {
      const result = await listUserDocuments();
      setDocuments(result);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cargar la lista de documentos.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleSelectDocument = async (documentId) => {
    setLoadingDetail(true);
    setError(null);

    try {
      const detail = await getDocumentById(documentId);
      const blob = await getDocumentAudioBlob(documentId);
      const nextAudioUrl = URL.createObjectURL(blob);

      if (audioUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }

      setSelectedDocument(detail);
      setEditableDocument(createEditableState(detail));
      setAudioUrl(nextAudioUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cargar el detalle del documento.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditableDocument((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedDocument) return;

    setSaving(true);
    setError(null);

    try {
      const updated = await updateDocument(selectedDocument.id, editableDocument);
      setSelectedDocument((current) => ({
        ...current,
        ...updated,
      }));
      setEditableDocument(createEditableState(updated));
      setDocuments((current) =>
        current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar el documento.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;

    setError(null);

    try {
      await deleteDocument(selectedDocument.id);
      setDocuments((current) => current.filter((item) => item.id !== selectedDocument.id));
      setSelectedDocument(null);
      setEditableDocument(createEditableState(null));

      if (audioUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioUrl(null);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo borrar el documento.');
    }
  };

  return {
    documents,
    selectedDocument,
    editableDocument,
    audioUrl,
    loadingList,
    loadingDetail,
    saving,
    error,
    loadDocuments,
    handleSelectDocument,
    handleFieldChange,
    handleSave,
    handleDelete,
  };
}
