import fs from 'fs';
import fetch from 'node-fetch';
import googleTTS from 'google-tts-api';

/**
 * Divide el texto en fragmentos respetando palabras completas
 * para no cortar palabras a la mitad (límite de google-tts-api: aprox. 200 caracteres)
 */
const splitTextIntoChunks = (text, maxLength = 190) => {
  const words = text.split(' ');
  const chunks = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxLength) {
      if (current) chunks.push(current.trim());
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) chunks.push(current.trim());

  return chunks;
};

/**
 * Convierte texto largo a audio en un archivo MP3
 * @param {string} text - Texto completo
 * @param {string} languageCode - Código ISO 639-1, ej. 'es'
 * @param {string} outputPath - Ruta de salida del MP3
 */
export const textToSpeech = async (text, languageCode, outputPath) => {
  const chunks = splitTextIntoChunks(text);
  const buffers = [];

  for (const chunk of chunks) {
    if (!chunk.trim()) continue;

    const url = googleTTS.getAudioUrl(chunk, {
      lang: languageCode,
      slow: false,
      host: 'https://translate.google.com',
    });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error al obtener audio de Google TTS: ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    buffers.push(Buffer.from(arrayBuffer));
  }

  fs.writeFileSync(outputPath, Buffer.concat(buffers));
};
