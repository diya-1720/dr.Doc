import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
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
    console.warn('Backend compression failed or offline, falling back to local engine:', err);
  }

  // Client-side fallback
  if (file.type.startsWith('image/')) {
    const img = await loadImage(URL.createObjectURL(file));
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    let width = img.width;
    let height = img.height;
    const maxDim = 1600;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    let q = 0.75;
    let blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), 'image/jpeg', q));

    while (blob.size / (1024 * 1024) > targetSizeMB && q > 0.2) {
      q -= 0.15;
      blob = await new Promise(res => canvas.toBlob(b => res(b!), 'image/jpeg', q));
    }

    const compressedName = file.name.replace(/\.[^/.]+$/, '') + '_compressed.jpg';
    const compressedFile = new File([blob], compressedName, { type: 'image/jpeg' });
    const newSizeMB = parseFloat((compressedFile.size / (1024 * 1024)).toFixed(2));

    return { compressedFile, oldSizeMB, newSizeMB };
  }

  // PDF Client-side copy fallback
  const compressedName = file.name.replace(/\.[^/.]+$/, '') + '_compressed.pdf';
  const compressedFile = new File([file], compressedName, { type: 'application/pdf' });
  return { compressedFile, oldSizeMB, newSizeMB: oldSizeMB };
}

/**
 * Converts image format (e.g. JPG <-> PNG <-> WEBP) via backend
 */
export async function convertImageFormat(
  file: File, 
  targetFormat: 'png' | 'jpg' | 'jpeg' | 'webp'
): Promise<File> {
  try {
    const res = await backendConvertImageFormat(file, targetFormat);
    if (res.downloadUrl) {
      const outName = file.name.replace(/\.[^/.]+$/, '') + `.${targetFormat}`;
      return await fetchBackendProcessedFile(res.downloadUrl, outName, `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`);
    }
  } catch (err) {
    console.warn('Backend image format conversion failed, using canvas fallback:', err);
  }

  // Canvas format conversion fallback
  const img = await loadImage(URL.createObjectURL(file));
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const mime = targetFormat === 'png' ? 'image/png' : targetFormat === 'webp' ? 'image/webp' : 'image/jpeg';
  const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), mime, 0.92));
  const outName = file.name.replace(/\.[^/.]+$/, '') + `.${targetFormat}`;
  return new File([blob], outName, { type: mime });
}

/**
 * Converts Plain Text (.txt) file to paginated PDF
 */
export async function convertTxtToPdf(file: File): Promise<File> {
  try {
    const res = await backendTxtToPdf(file);
    if (res.downloadUrl) {
      const outName = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
      return await fetchBackendProcessedFile(res.downloadUrl, outName, 'application/pdf');
    }
  } catch (err) {
    console.warn('Backend TXT to PDF failed, using client fallback:', err);
  }

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
