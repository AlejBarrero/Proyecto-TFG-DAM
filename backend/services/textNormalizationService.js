/**
 * Normaliza y sanitiza el texto extraído de un PDF
 * - Elimina caracteres de control y no imprimibles
 * - Colapsa espacios múltiples y líneas vacías consecutivas
 * - Elimina guiones de separación de línea propios del PDF
 * - Recorta espacios al inicio/fin
 * @param {string} rawText
 * @returns {string}
 */
export const normalizeText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText;

  // Eliminar caracteres de control (excepto saltos de linea y tabulaciones)
  // eslint-disable-next-line no-control-regex
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Unir palabras cortadas con guión al final de línea (ej: "auto-\nmático" → "automático")
  text = text.replace(/-\n(\s*)/g, '');

  // Reemplazar tabulaciones por espacio
  text = text.replace(/\t/g, ' ');

  // Colapsar múltiples espacios en uno solo
  text = text.replace(/ {2,}/g, ' ');

  // Colapsar más de dos saltos de línea consecutivos en dos
  text = text.replace(/\n{3,}/g, '\n\n');

  // Eliminar espacios al inicio y al final de cada línea
  text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

  // Recortar el texto completo
  return text.trim();
};

/**
 * Verifica si el texto tiene suficiente contenido para ser procesado
 * @param {string} text - Texto normalizado
 * @param {number} minLength - Longitud mínima requerida (por defecto 50 caracteres)
 * @returns {boolean}
 */
export const hasEnoughContent = (text, minLength = 50) => {
  return text && text.trim().length >= minLength;
};
