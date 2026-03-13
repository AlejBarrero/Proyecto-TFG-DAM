import fetch from 'node-fetch';

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';
const CHUNK_SIZE = 400; // La API MyMemory acepta hasta 500 caracteres por petición, usamos 400 parte tener más margen

/**
 * Divide el texto en trozos más pequeños respetando frases completas
 * para que la traducción sea más coherente
 */
const splitIntoSentenceChunks = (text, maxLength = CHUNK_SIZE) => {
    // Dividir por oraciones (punto, interrogación, exclamación seguidos de espacio o fin)
    const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];
    const chunks = [];
    let current = '';

    for (const sentence of sentences) {
        if ((current + sentence).length > maxLength) {
            if (current.trim()) chunks.push(current.trim());
            // Si la oración individual es demasiado larga, dividir por palabras
            if (sentence.length > maxLength) {
                const words = sentence.split(' ');
                let wordChunk = '';
                for (const word of words) {
                    if ((wordChunk + ' ' + word).trim().length > maxLength) {
                        if (wordChunk.trim()) chunks.push(wordChunk.trim());
                        wordChunk = word;
                    } else {
                        wordChunk = wordChunk ? wordChunk + ' ' + word : word;
                    }
                }
                if (wordChunk.trim()) chunks.push(wordChunk.trim());
                current = '';
            } else {
                current = sentence;
            }
        } else {
            current += sentence;
        }
    }
    if (current.trim()) chunks.push(current.trim());
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
