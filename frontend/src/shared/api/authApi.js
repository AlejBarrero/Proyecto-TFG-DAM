import httpClient from './httpClient';

export async function login(credentials) {
  const response = await httpClient.post('/api/auth/login', credentials);
  return response.data;
}

export async function register(payload) {
  const response = await httpClient.post('/api/auth/register', payload);
  return response.data;
}

export async function getMe() {
  const response = await httpClient.get('/api/auth/me');
  return response.data;
}
