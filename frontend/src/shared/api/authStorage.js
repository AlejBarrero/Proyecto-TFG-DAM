const AUTH_STORAGE_KEY = 'pdf2voice.auth';

export function readStoredSession() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return { token: null, user: null };
  }

  try {
    const parsed = JSON.parse(raw);

    return {
      token: parsed.token || null,
      user: parsed.user || null,
    };
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { token: null, user: null };
  }
}

export function saveSession(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
