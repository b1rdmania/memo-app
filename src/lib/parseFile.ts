import mammoth from 'mammoth/mammoth.browser';
import * as pdfjs from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export async function parseFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return parsePdf(file);
  if (name.endsWith('.docx')) return parseDocx(file);
  if (name.endsWith('.txt') || name.endsWith('.md')) return await file.text();
  throw new Error('Unsupported file type — paste the text instead, or upload .pdf / .docx / .txt');
}

async function parsePdf(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((it: any) => it.str)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (pageText) parts.push(pageText);
  }
  return parts.join('\n\n');
}

async function parseDocx(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buf });
  return result.value;
}
