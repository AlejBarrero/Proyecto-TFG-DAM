import { act, renderHook, waitFor } from '@testing-library/react';
import { useAuthSession } from '../hooks/useAuthSession';
import { getMe, login, register } from '../../../shared/api/authApi';
import {
  clearSession,
  readStoredSession,
  saveSession,
} from '../../../shared/api/authStorage';

jest.mock('../../../shared/api/authApi', () => ({
  getMe: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
}));

jest.mock('../../../shared/api/authStorage', () => ({
  clearSession: jest.fn(),
  readStoredSession: jest.fn(),
  saveSession: jest.fn(),
}));

describe('useAuthSession integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    readStoredSession.mockReturnValue({ token: null, user: null });
  });

  test('inicia sin sesion almacenada', () => {
    const { result } = renderHook(() => useAuthSession());

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(getMe).not.toHaveBeenCalled();
  });

  test('recupera el perfil cuando hay token guardado', async () => {
    const profile = { id: 1, email: 'ana@example.com', role: 'user' };

    readStoredSession.mockReturnValue({ token: 'token-123', user: null });
    getMe.mockResolvedValue(profile);

    const { result } = renderHook(() => useAuthSession());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(profile);
    expect(result.current.token).toBe('token-123');
    expect(result.current.isAuthenticated).toBe(true);
    expect(saveSession).toHaveBeenCalledWith({
      token: 'token-123',
      user: profile,
    });
  });

  test('limpia la sesion si getMe falla con un token guardado', async () => {
    readStoredSession.mockReturnValue({ token: 'token-roto', user: null });
    getMe.mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuthSession());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(clearSession).toHaveBeenCalledTimes(1);
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('signIn guarda la sesion cuando login responde correctamente', async () => {
    const credentials = {
      email: 'ana@example.com',
      password: 'secreta123',
    };

    const session = {
      token: 'token-login',
      user: { id: 2, email: 'ana@example.com', role: 'user' },
    };

    login.mockResolvedValue(session);

    const { result } = renderHook(() => useAuthSession());

    await act(async () => {
      await result.current.signIn(credentials);
    });

    expect(login).toHaveBeenCalledWith(credentials);
    expect(saveSession).toHaveBeenCalledWith(session);
    expect(result.current.token).toBe('token-login');
    expect(result.current.user).toEqual(session.user);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('signUp guarda el mensaje de error si register falla', async () => {
    const payload = {
      userName: 'ana_dev',
      email: 'ana@example.com',
      password: 'secreta123',
    };

    const apiError = {
      response: {
        data: {
          message: 'Ese email ya existe.',
        },
      },
    };

    register.mockRejectedValue(apiError);

    const { result } = renderHook(() => useAuthSession());

    await act(async () => {
      try {
        await result.current.signUp(payload);
      } catch {}
    });

    expect(register).toHaveBeenCalledWith(payload);
    expect(result.current.error).toBe('Ese email ya existe.');
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('signOut elimina la sesion actual', async () => {
    const session = {
      token: 'token-login',
      user: { id: 2, email: 'ana@example.com', role: 'user' },
    };

    login.mockResolvedValue(session);

    const { result } = renderHook(() => useAuthSession());

    await act(async () => {
      await result.current.signIn({
        email: 'ana@example.com',
        password: 'secreta123',
      });
    });

    act(() => {
      result.current.signOut();
    });

    expect(clearSession).toHaveBeenCalledTimes(1);
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
