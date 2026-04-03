const MAX_SIZE_MB = 10;

export function validatePdfFile(selectedFile) {
  if (!selectedFile) return 'No se seleccionó ningún archivo.';
  if (selectedFile.type !== 'application/pdf') {
    return 'Solo se permiten archivos PDF (.pdf).';
  }
  if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
    return `El archivo supera el límite de ${MAX_SIZE_MB} MB.`;
  }
  return null;
}
