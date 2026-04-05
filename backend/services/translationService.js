import { fetchWithTimeout, retryAsync } from './httpClient.js';

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';
const CHUNK_SIZE = 400;
const TRANSLATION_TIMEOUT_MS = parseInt(process.env.TRANSLATION_TIMEOUT_MS || '10000', 10);
const TRANSLATION_RETRIES = parseInt(process.env.TRANSLATION_RETRIES || '2', 10);

/**
 * Divide el texto en trozos más pequeños respetando frases completas
 * para que la traducción sea más coherente
 */
const pushIfNotEmpty = (chunks, value) => {
  if (value.trim()) {
    chunks.push(value.trim());
  }
};

const splitLongSentenceByWords = (sentence, maxLength) => {
  const chunks = [];
  const words = sentence.split(' ');
  let current = '';

  for (const word of words) {
    const nextChunk = current ? `${current} ${word}` : word;

    if (nextChunk.length > maxLength) {
      pushIfNotEmpty(chunks, current);
      current = word;
      continue;
    }

    current = nextChunk;
  }

  pushIfNotEmpty(chunks, current);
  return chunks;
};

const splitIntoSentenceChunks = (text, maxLength = CHUNK_SIZE) => {
  const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];
  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    const nextChunk = current + sentence;

    if (nextChunk.length <= maxLength) {
      current = nextChunk;
      continue;
    }

    pushIfNotEmpty(chunks, current);

    if (sentence.length > maxLength) {
      chunks.push(...splitLongSentenceByWords(sentence, maxLength));
      current = '';
      continue;
    }

    current = sentence;
  }

  pushIfNotEmpty(chunks, current);
  return chunks;
};

const fetchTranslationResponse = async (text) => {
  const params = new URLSearchParams({
    q: text,
    langpair: 'en|es',
  });

  const response = await fetchWithTimeout(
    `${MYMEMORY_URL}?${params.toString()}`,
    {},
    TRANSLATION_TIMEOUT_MS
  );

  if (!response.ok) {
    const error = new Error(`Error en MyMemory API: ${response.statusText}`);
    error.retryable = response.status >= 500;
    throw error;
  }

  return response;
};

/**
 * Traduce un fragmento de texto de inglés a español usando MyMemory API
 */
const translateChunk = async (text) => {
  const response = await retryAsync(
    () => fetchTranslationResponse(text),
    { retries: TRANSLATION_RETRIES }
  );

  const data = await response.json();

  if (data.responseStatus !== 200) {
    throw new Error(
      `MyMemory devolvio error: ${data.responseDetails || data.responseStatus}`
    );
  }

  return data.responseData.translatedText;
};

/**
 * Traduce texto completo de inglés a español
 * Divide en fragmentos para respetar el límite de la API
 * @param {string} text - Texto en inglés
 * @returns {Promise<string>} - Texto traducido al español
 */
export const translateToSpanish = async (text) => {
  const chunks = splitIntoSentenceChunks(text);
  const translatedChunks = [];

  for (const chunk of chunks) {
    if (!chunk.trim()) continue;
    const translated = await translateChunk(chunk);
    translatedChunks.push(translated);
  }

  return translatedChunks.join(' ');
};
