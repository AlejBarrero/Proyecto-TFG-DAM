import fs from 'fs/promises';
import path from 'path';

const PDF_EXTENSION = '.pdf';
const PDF_SIGNATURE = '%PDF-';

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

export const isPdfSignature = async (filePath) => {
  const fileHandle = await fs.open(filePath, 'r');

  try {
    const buffer = Buffer.alloc(PDF_SIGNATURE.length);
    await fileHandle.read(buffer, 0, PDF_SIGNATURE.length, 0);
    return buffer.toString('utf8') === PDF_SIGNATURE;
  } finally {
    await fileHandle.close();
  }
};

export const assertValidPdfFile = async (filePath) => {
  const isValidPdf = await isPdfSignature(filePath);

  if (!isValidPdf) {
    const error = new Error('El archivo subido no es un PDF valido.');
    error.statusCode = 422;
    throw error;
  }
};
