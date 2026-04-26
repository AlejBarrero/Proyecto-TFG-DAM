import httpClient from './httpClient';

export async function getAdminUsers() {
  const response = await httpClient.get('/api/admin/users');
  return response.data;
}

export async function getAdminDocuments() {
  const response = await httpClient.get('/api/admin/documents');
  return response.data;
}

export async function updateAdminUserRole(userId, role) {
  const response = await httpClient.patch(`/api/admin/users/${userId}/role`, { role });
  return response.data;
}

export async function deleteAdminUser(userId) {
  const response = await httpClient.delete(`/api/admin/users/${userId}`);
  return response.data;
}
