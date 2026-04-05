import httpClient from './httpClient';

export async function getAdminUsers() {
  const response = await httpClient.get('/api/admin/users');
  return response.data;
}

export async function getAdminDocuments() {
  const response = await httpClient.get('/api/admin/documents');
  return response.data;
}
