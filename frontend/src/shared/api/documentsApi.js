import httpClient from './httpClient';

export async function uploadGuestDocument(formData) {
  const response = await httpClient.post('/api/documents/guest-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function uploadDocument(formData) {
  const response = await httpClient.post('/api/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function listUserDocuments() {
  const response = await httpClient.get('/api/documents');
  return response.data;
}

export async function getDocumentById(documentId) {
  const response = await httpClient.get(`/api/documents/${documentId}`);
  return response.data;
}

export async function updateDocument(documentId, payload) {
  const response = await httpClient.patch(`/api/documents/${documentId}`, payload);
  return response.data;
}

export async function deleteDocument(documentId) {
  await httpClient.delete(`/api/documents/${documentId}`);
}

export async function getDocumentAudioBlob(documentId) {
  const response = await httpClient.get(`/api/documents/${documentId}/audio`, {
    responseType: 'blob',
  });

  return response.data;
}
