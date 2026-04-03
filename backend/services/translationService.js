import fetch from 'node-fetch';

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';
const CHUNK_SIZE = 400; // La API MyMemory acepta hasta 500 caracteres por petición, usamos 400 parte tener más margen

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
  // Dividir por oraciones (punto, interrogación, exclamación seguidos de espacio o fin)
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

/**
 * Traduce un fragmento de texto de inglés a español usando MyMemory API
 */
const translateChunk = async (text) => {
  const params = new URLSearchParams({
    q: text,
    langpair: 'en|es',
  });

  const res = await fetch(`${MYMEMORY_URL}?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Error en MyMemory API: ${res.statusText}`);
  }

  const data = await res.json();

  if (data.responseStatus !== 200) {
    throw new Error(`MyMemory devolvió error: ${data.responseDetails || data.responseStatus}`);
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
