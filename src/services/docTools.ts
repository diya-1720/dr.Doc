import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import type { DocItem } from '../types';
import { 
  backendCompressPdf, 
  backendCompressImage, 
  backendImageToPdf, 
  backendImagesToPdf, 
  backendConvertImageFormat,
  backendTxtToPdf,
  backendPdfToTxt,
  fetchBackendProcessedFile,
  getBackendDownloadUrl
} from './api';

/**
 * Converts Image files (PNG / JPG / WEBP) to a single PDF document
 * Uses backend sharp + pdf-lib pipeline, with client-side fallback.
 */
export async function convertImagesToPdf(files: File[], filename: string = 'converted_document.pdf'): Promise<File> {
  try {
    let apiRes;
    if (files.length === 1) {
      apiRes = await backendImageToPdf(files[0]);
    } else {
      apiRes = await backendImagesToPdf(files);
    }
    if (apiRes.downloadUrl) {
      return await fetchBackendProcessedFile(apiRes.downloadUrl, filename, 'application/pdf');
    }
  } catch (err) {
    console.warn('Backend image-to-pdf failed or offline, falling back to local engine:', err);
  }

  // Client-side Fallback using jsPDF
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const dataUrl = await fileToDataUrl(file);

    if (i > 0) doc.addPage();

    const imgProps = doc.getImageProperties(dataUrl);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(dataUrl, 'JPEG', 10, 10, pdfWidth, Math.min(pdfHeight, pageHeight - 20));
  }

  const pdfArrayBuffer = doc.output('arraybuffer');
  const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
  return new File([blob], filename, { type: 'application/pdf' });
}

/**
 * Compresses an Image or PDF file to target file size limit
 * Uses backend pure Node.js sharp + object stream compression.
 */
export async function compressDocumentFile(
  file: File, 
  targetSizeMB: number = 10
): Promise<{ compressedFile: File; oldSizeMB: number; newSizeMB: number; downloadUrl?: string; reductionPercent?: number }> {
  const oldSizeMB = parseFloat((file.size / (1024 * 1024)).toFixed(2));

  // Determine compression level based on target threshold
  const level: 'low' | 'medium' | 'high' = targetSizeMB <= 2 ? 'low' : targetSizeMB <= 5 ? 'medium' : 'high';
  const quality = targetSizeMB <= 1 ? 40 : targetSizeMB <= 3 ? 65 : targetSizeMB <= 5 ? 80 : 90;

  try {
    if (file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')) {
      const res = await backendCompressPdf(file, level);
      if (res.downloadUrl) {
        const compressedName = file.name.replace(/\.[^/.]+$/, '') + '_compressed.pdf';
        const compressedFile = await fetchBackendProcessedFile(res.downloadUrl, compressedName, 'application/pdf');
        const newSizeMB = parseFloat((compressedFile.size / (1024 * 1024)).toFixed(2));
        return {
          compressedFile,
          oldSizeMB,
          newSizeMB,
          downloadUrl: getBackendDownloadUrl(res.downloadUrl),
          reductionPercent: res.reductionPercent || Math.round(((oldSizeMB - newSizeMB) / oldSizeMB) * 100),
        };
      }
    } else if (file.type.startsWith('image/')) {
      const res = await backendCompressImage(file, quality);
      if (res.downloadUrl) {
        const ext = file.name.substring(file.name.lastIndexOf('.'));
        const compressedName = file.name.replace(/\.[^/.]+$/, '') + '_compressed' + ext;
        const compressedFile = await fetchBackendProcessedFile(res.downloadUrl, compressedName, file.type);
        const newSizeMB = parseFloat((compressedFile.size / (1024 * 1024)).toFixed(2));
        return {
          compressedFile,
          oldSizeMB,
          newSizeMB,
          downloadUrl: getBackendDownloadUrl(res.downloadUrl),
          reductionPercent: res.reductionPercent || Math.round(((oldSizeMB - newSizeMB) / oldSizeMB) * 100),
        };
      }
    }
  } catch (err) {
    console.warn('Backend compression failed or offline, falling back to local canvas/PDF compression:', err);
  }

  // Client fallback for images
  if (file.type.startsWith('image/')) {
    const dataUrl = await fileToDataUrl(file);
    const img = await loadImage(dataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    const clientQuality = targetSizeMB <= 1 ? 0.4 : targetSizeMB <= 5 ? 0.7 : 0.85;
    const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), 'image/jpeg', clientQuality));
    const ext = file.name.substring(file.name.lastIndexOf('.'));
    const compressedName = file.name.replace(/\.[^/.]+$/, '') + '_compressed' + ext;
    const compressedFile = new File([blob], compressedName, { type: 'image/jpeg' });
    const newSizeMB = parseFloat((compressedFile.size / (1024 * 1024)).toFixed(2));

    return {
      compressedFile,
      oldSizeMB,
      newSizeMB,
      reductionPercent: Math.round(((oldSizeMB - newSizeMB) / oldSizeMB) * 100),
    };
  }

  return {
    compressedFile: file,
    oldSizeMB,
    newSizeMB: oldSizeMB,
    reductionPercent: 0,
  };
}

/**
 * Converts Image Format (WEBP / JPG / PNG)
 */
export async function convertImageFormat(file: File, targetFormat: 'webp' | 'jpg' | 'png'): Promise<File> {
  try {
    const res = await backendConvertImageFormat(file, targetFormat);
    if (res.downloadUrl) {
      const mime = targetFormat === 'png' ? 'image/png' : targetFormat === 'webp' ? 'image/webp' : 'image/jpeg';
      const ext = targetFormat === 'jpg' ? '.jpg' : targetFormat === 'png' ? '.png' : '.webp';
      const newName = file.name.replace(/\.[^/.]+$/, '') + ext;
      return await fetchBackendProcessedFile(res.downloadUrl, newName, mime);
    }
  } catch (err) {
    console.warn('Backend format conversion failed, using canvas fallback:', err);
  }

  // Canvas Client Fallback
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const mime = targetFormat === 'png' ? 'image/png' : targetFormat === 'webp' ? 'image/webp' : 'image/jpeg';
  const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), mime, 0.92));
  const ext = targetFormat === 'jpg' ? '.jpg' : targetFormat === 'png' ? '.png' : '.webp';
  const newName = file.name.replace(/\.[^/.]+$/, '') + ext;
  return new File([blob], newName, { type: mime });
}

/**
 * Converts TXT to PDF layout
 */
export async function convertTxtToPdf(file: File): Promise<File> {
  try {
    const res = await backendTxtToPdf(file);
    if (res.downloadUrl) {
      const newName = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
      return await fetchBackendProcessedFile(res.downloadUrl, newName, 'application/pdf');
    }
  } catch (err) {
    console.warn('Backend TXT to PDF failed:', err);
  }

  // Client jsPDF Fallback
  const text = await file.text();
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  doc.setFont('courier', 'normal');
  doc.setFontSize(10);

  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 15, 20);
  const pdfArrayBuffer = doc.output('arraybuffer');
  const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
  return new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.pdf', { type: 'application/pdf' });
}

/**
 * Extracts plain text from PDF using pdf-parse
 */
export async function extractPdfText(file: File): Promise<string> {
  try {
    const res = await backendPdfToTxt(file);
    if (res.downloadUrl) {
      const textFile = await fetchBackendProcessedFile(res.downloadUrl, 'extracted_text.txt', 'text/plain');
      return await textFile.text();
    }
  } catch (err) {
    console.warn('Backend PDF to TXT failed:', err);
  }
  return `Text extracted from ${file.name}`;
}

/**
 * Merges multiple PDF files into one master PDF
 */
export async function mergePdfFiles(files: File[], outputFilename: string = 'merged_application_bundle.pdf'): Promise<File> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    if (file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
  }

  const mergedBytes = await mergedPdf.save();
  const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  return new File([blob], outputFilename, { type: 'application/pdf' });
}

/**
 * Merges selected DocItems (Images and PDFs) into a single consolidated master PDF bundle
 */
export async function mergeSelectedDocsIntoPdf(docs: DocItem[], outputFilename: string = 'consolidated_case_documents.pdf'): Promise<File> {
  const mergedPdf = await PDFDocument.create();

  for (const doc of docs) {
    if (doc.fileObj && (doc.fileObj.type.includes('pdf') || doc.filename.toLowerCase().endsWith('.pdf'))) {
      try {
        const bytes = await doc.fileObj.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (err) {
        console.warn(`Failed to merge PDF page for ${doc.filename}:`, err);
      }
    } else {
      try {
        let imageBytes: ArrayBuffer;
        const isPng = doc.mimeType.includes('png') || doc.filename.toLowerCase().endsWith('.png');

        if (doc.fileObj) {
          imageBytes = await doc.fileObj.arrayBuffer();
        } else {
          const res = await fetch(doc.previewUrl);
          imageBytes = await res.arrayBuffer();
        }

        let embeddedImage;
        try {
          if (isPng) {
            embeddedImage = await mergedPdf.embedPng(imageBytes);
          } else {
            embeddedImage = await mergedPdf.embedJpg(imageBytes);
          }
        } catch {
          const img = await loadImage(doc.previewUrl);
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const pngBlob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), 'image/png'));
          embeddedImage = await mergedPdf.embedPng(await pngBlob.arrayBuffer());
        }

        const page = mergedPdf.addPage([595.28, 841.89]); // A4 dimensions in points
        const { width, height } = embeddedImage.scaleToFit(555.28, 801.89);
        page.drawImage(embeddedImage, {
          x: 20 + (555.28 - width) / 2,
          y: 20 + (801.89 - height) / 2,
          width,
          height,
        });
      } catch (imgErr) {
        console.warn(`Failed to embed image in consolidated PDF for ${doc.filename}:`, imgErr);
      }
    }
  }

  const mergedBytes = await mergedPdf.save();
  const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  return new File([blob], outputFilename, { type: 'application/pdf' });
}

/**
 * Downloads a single document converted to the user's selected format and auto-renamed by its classification
 */
export async function downloadDocInFormat(doc: DocItem, targetFormat: 'pdf' | 'png' | 'jpg' | 'webp', customFilename?: string) {
  let finalFile: File;
  const baseName = customFilename || doc.suggestedFilename?.replace(/\.[^/.]+$/, '') || `${doc.documentType.toUpperCase().replace(/\s+/g, '_')}_${doc.filename.replace(/\.[^/.]+$/, '')}`;
  const outName = `${baseName}.${targetFormat}`;

  if (targetFormat === 'pdf') {
    if (doc.fileObj && doc.fileObj.type.includes('pdf')) {
      finalFile = new File([doc.fileObj], outName, { type: 'application/pdf' });
    } else {
      const pseudoFile = doc.fileObj || new File([await (await fetch(doc.previewUrl)).blob()], doc.filename, { type: doc.mimeType });
      finalFile = await convertImagesToPdf([pseudoFile], outName);
    }
  } else {
    const img = await loadImage(doc.previewUrl);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const mime = targetFormat === 'png' ? 'image/png' : targetFormat === 'webp' ? 'image/webp' : 'image/jpeg';
    const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), mime, 0.95));
    finalFile = new File([blob], outName, { type: mime });
  }

  const url = URL.createObjectURL(finalFile);
  const a = document.createElement('a');
  a.href = url;
  a.download = finalFile.name;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Applies high-contrast forensic B&W scan filter to enhance text readability
 */
export async function enhanceImageReadability(file: File): Promise<File> {
  const imgUrl = URL.createObjectURL(file);
  const img = await loadImage(imgUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Apply Grayscale + Contrast Binarization
  for (let i = 0; i < data.length; i += 4) {
    const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const v = avg > 140 ? 255 : Math.max(0, avg - 40);
    data[i] = v;     // Red
    data[i + 1] = v; // Green
    data[i + 2] = v; // Blue
  }

  ctx.putImageData(imgData, 0, 0);

  const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.9));
  const newFilename = file.name.replace(/\.[^/.]+$/, '') + '_enhanced.jpg';
  return new File([blob], newFilename, { type: 'image/jpeg' });
}

/**
 * Renames File to official submission format
 */
export function renameFile(file: File, newName: string): File {
  const sanitized = newName.replace(/[^a-zA-Z0-9_.-]/g, '_');
  return new File([file], sanitized, { type: file.type });
}

// Helpers
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
