import axios from 'axios';
import { readStoredSession } from './authStorage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const httpClient = axios.create({
  baseURL: API_URL,
});

httpClient.interceptors.request.use((config) => {
  const { token } = readStoredSession();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default httpClient;
