import fetch from 'node-fetch';

const DEFAULT_TIMEOUT_MS = 10000;
const DEFAULT_RETRY_DELAY_MS = 800;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  if (error.name === 'AbortError') {
    return true;
  }

  if (error.retryable === true) {
    return true;
  }

  return false;
};

export const fetchWithTimeout = async (
  url,
  options = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Tiempo de espera agotado en la solicitud externa.');
      timeoutError.name = 'AbortError';
      timeoutError.retryable = true;
      throw timeoutError;
    }

    error.retryable = true;
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const retryAsync = async (
  operation,
  {
    retries = 2,
    delayMs = DEFAULT_RETRY_DELAY_MS,
  } = {}
) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const shouldRetry = attempt < retries && isRetryableError(error);

      if (!shouldRetry) {
        throw error;
      }

      await delay(delayMs * (attempt + 1));
    }
  }

  throw lastError;
};
