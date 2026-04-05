import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import { prisma } from '../../lib/prisma.js';

const registerTestUser = async () => {
  const timestamp = Date.now();

  const response = await request(app)
    .post('/api/auth/register')
    .send({
      userName: `testuser_${timestamp}`,
      email: `test_${timestamp}@example.com`,
      password: '123456',
    });

  return response.body.token;
};

const getAuthorized = (token, path) => {
  return request(app)
    .get(path)
    .set('Authorization', `Bearer ${token}`);
};

const patchAuthorized = (token, path, body) => {
  return request(app)
    .patch(path)
    .set('Authorization', `Bearer ${token}`)
    .send(body);
};

const deleteAuthorized = (token, path) => {
  return request(app)
    .delete(path)
    .set('Authorization', `Bearer ${token}`);
};

describe('Documents protected routes', () => {
  let token;
  let consoleErrorSpy;

  beforeAll(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    token = await registerTestUser();
  });

  afterAll(async () => {
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
    }

    await prisma.$disconnect();
  });

  it('should reject listing documents without token', async () => {
    const response = await request(app).get('/api/documents');

    expect(response.statusCode).toBe(401);
  });

  it('should list user documents with token', async () => {
    const response = await getAuthorized(token, '/api/documents');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 404 for non existing document detail', async () => {
    const response = await getAuthorized(token, '/api/documents/999999');

    expect(response.statusCode).toBe(404);
  });

  it('should return 404 for non existing audio', async () => {
    const response = await getAuthorized(token, '/api/documents/999999/audio');

    expect(response.statusCode).toBe(404);
  });

  it('should return 400 or 404 when updating title', async () => {
    const response = await patchAuthorized(token, '/api/documents/1', {});

    expect([400, 404]).toContain(response.statusCode);
  });

  it('should return 404 when deleting non existing document', async () => {
    const response = await deleteAuthorized(token, '/api/documents/999999');

    expect(response.statusCode).toBe(404);
  });
});
