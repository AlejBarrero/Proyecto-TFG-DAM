import { useEffect, useState } from 'react';
import { getMe, login, register } from '../../../shared/api/authApi';
import { clearSession, readStoredSession, saveSession } from '../../../shared/api/authStorage';

export function useAuthSession() {
  const stored = readStoredSession();
  const [user, setUser] = useState(stored.user);
  const [token, setToken] = useState(stored.token);
  const [loading, setLoading] = useState(Boolean(stored.token));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stored.token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const profile = await getMe();

        if (!cancelled) {
          setUser(profile);
          saveSession({ token: stored.token, user: profile });
        }
      } catch {
        if (!cancelled) {
          clearSession();
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [stored.token]);

  const applySession = (result) => {
    setToken(result.token);
    setUser(result.user);
    saveSession(result);
    return result;
  };

  const signIn = async (credentials) => {
    setError(null);

    try {
      const result = await login(credentials);
      return applySession(result);
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo iniciar sesión.';
      setError(message);
      throw err;
    }
  };

  const signUp = async (payload) => {
    setError(null);

    try {
      const result = await register(payload);
      return applySession(result);
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo crear la cuenta.';
      setError(message);
      throw err;
    }
  };

  const signOut = () => {
    clearSession();
    setToken(null);
    setUser(null);
    setError(null);
  };

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated: Boolean(token && user),
    signIn,
    signUp,
    signOut,
  };
}
