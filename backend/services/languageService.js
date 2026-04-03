import * as franc from 'franc';

// Idiomas soportados por el sistema (según anteproyecto: solo EN y ES en MVP)
const SUPPORTED_LANGUAGES = ['eng', 'spa'];

// Mínimo de caracteres para una detección fiable
const MIN_TEXT_LENGTH = 100;

// Mapa de códigos franc → etiquetas legibles para mensajes de error
const LANG_LABELS = {
  eng: 'inglés',
  spa: 'español',
};

/**
 * Detecta el idioma del texto y valida que sea EN o ES.
 * @param {string} text - Texto a analizar
 * @returns {{ code: string, label: string }} - Código franc ('eng' | 'spa') y etiqueta
 * @throws {Error} Si el idioma no es soportado, es ambiguo o el texto es insuficiente
 */
export const detectLanguage = (text) => {
  if (!text || text.trim().length < MIN_TEXT_LENGTH) {
    throw new Error(
      'El texto es demasiado corto para determinar el idioma con fiabilidad. ' +
        `Se necesitan al menos ${MIN_TEXT_LENGTH} caracteres.`
    );
  }

  // franc devuelve el top 3 con puntuaciones; usamos la versión all para ver confianza
  const results = franc.francAll(text, { minLength: 10 });

  if (!results || results.length === 0) {
    throw new Error('No se pudo determinar el idioma del documento.');
  }

  const [topCode, topScore] = results[0];

  // Si la puntuación es muy baja o el idioma es "und" (undetermined), rechazar
  if (topCode === 'und' || topScore < 0.5) {
    throw new Error(
      'No se pudo determinar el idioma del documento con suficiente confianza. ' +
        'Asegúrate de que el PDF contiene texto legible en inglés o español.'
    );
  }

  // Solo aceptamos inglés o español
  if (!SUPPORTED_LANGUAGES.includes(topCode)) {
    throw new Error(
      `Idioma detectado no soportado. El sistema solo procesa documentos en inglés o español. ` +
        `Idioma detectado: ${topCode}.`
    );
  }

  return {
    code: topCode, // 'eng' | 'spa'
    label: LANG_LABELS[topCode], // 'inglés' | 'español'
  };
};
