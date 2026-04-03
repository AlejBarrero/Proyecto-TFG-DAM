import httpClient from './httpClient';

export async function uploadPdf(formData) {
  const response = await httpClient.post('/api/pdf/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
