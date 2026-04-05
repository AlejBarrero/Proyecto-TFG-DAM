import fs from 'fs/promises';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const readPdfFile = async (filePath) => {
  const fileBuffer = await fs.readFile(filePath);
  return new Uint8Array(fileBuffer);
};

const extractPageText = async (pdf, pageNumber) => {
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();
  const strings = content.items.map((item) => item.str);

  return strings.join(' ');
};

export const extractTextFromPdf = async (filePath) => {
  const data = await readPdfFile(filePath);
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let text = '';

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const pageText = await extractPageText(pdf, pageNumber);
    text += `${pageText}\n`;
  }

  return text;
};
