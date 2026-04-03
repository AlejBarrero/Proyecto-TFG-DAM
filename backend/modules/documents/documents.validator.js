import path from 'path';

const PDF_EXTENSION = '.pdf';

const normalizeSpaces = (value) => {
  return value.replace(/\s+/g, '-');
};

const removeUnsafeCharacters = (value) => {
  return value.replace(/[^a-zA-Z0-9._-]/g, '');
};

const ensurePdfExtension = (value) => {
  if (value.toLowerCase().endsWith(PDF_EXTENSION)) {
    return value.slice(0, -PDF_EXTENSION.length) + PDF_EXTENSION;
  }

  return `${value}${PDF_EXTENSION}`;
};

export const sanitizePdfFileName = (originalName) => {
  const baseName = path.basename(originalName, path.extname(originalName));
  const normalizedName = normalizeSpaces(baseName);
  const safeName = removeUnsafeCharacters(normalizedName);

  const finalBaseName = safeName || 'document';

  return ensurePdfExtension(finalBaseName);
};
