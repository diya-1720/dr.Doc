/**
 * Dr. Doc - Backend API Client
 * Connects frontend components to the backend processing & Gemini proxy services.
 */

// In production on Vercel, API_BASE defaults to '' (same-origin relative paths)
// In local dev, vite.config.ts proxies /api and /downloads to localhost:5000,
// or VITE_API_URL can be set explicitly.
export const API_BASE = import.meta.env.VITE_API_URL || '';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  filename?: string;
  downloadUrl?: string;
  data?: T;
  text?: string;
  originalSize?: number;
  compressedSize?: number;
  originalSizeBytes?: number;
  compressedSizeBytes?: number;
  bytesSaved?: number;
  percentageReduction?: number;
  reductionPercent?: number;
  imageCount?: number;
  error?: { message: string };
  [key: string]: any;
}

async function parseResponse<T = any>(res: Response): Promise<ApiResponse<T>> {
  let body: ApiResponse<T>;
  try {
    body = await res.json();
  } catch {
    throw new Error(`Server returned non-JSON response (status ${res.status})`);
  }
  if (!res.ok || body.success === false) {
    throw new Error(body.error?.message || body.message || `Request failed with status ${res.status}`);
  }
  return body;
}

/**
 * Health check endpoint
 */
export async function checkBackendHealth(): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/api/health`);
  return parseResponse(res);
}

/**
 * Privacy info endpoint
 */
export async function getPrivacyInfo(): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/api/privacy`);
  return parseResponse(res);
}

/**
 * Compress PDF file via backend
 */
export async function backendCompressPdf(
  file: File,
  level: 'low' | 'medium' | 'high' = 'medium'
): Promise<ApiResponse> {
  const form = new FormData();
  form.append('file', file);
  form.append('level', level);

  const res = await fetch(`${API_BASE}/api/compress/pdf`, {
    method: 'POST',
    body: form,
  });
  return parseResponse(res);
}

/**
 * Compress Image file via backend (sharp quality 1-100)
 */
export async function backendCompressImage(
  file: File,
  quality: number = 80
): Promise<ApiResponse> {
  const form = new FormData();
  form.append('file', file);
  form.append('quality', quality.toString());

  const res = await fetch(`${API_BASE}/api/compress/image`, {
    method: 'POST',
    body: form,
  });
  return parseResponse(res);
}

/**
 * Convert a single image to PDF
 */
export async function backendImageToPdf(file: File): Promise<ApiResponse> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_BASE}/api/convert/image-to-pdf`, {
    method: 'POST',
    body: form,
  });
  return parseResponse(res);
}

/**
 * Combine multiple images into a single PDF
 */
export async function backendImagesToPdf(files: File[]): Promise<ApiResponse> {
  const form = new FormData();
  files.forEach((file) => form.append('files', file));

  const res = await fetch(`${API_BASE}/api/convert/images-to-pdf`, {
    method: 'POST',
    body: form,
  });
  return parseResponse(res);
}

/**
 * Convert Plain Text to formatted PDF
 */
export async function backendTxtToPdf(file: File): Promise<ApiResponse> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_BASE}/api/convert/txt-to-pdf`, {
    method: 'POST',
    body: form,
  });
  return parseResponse(res);
}

/**
 * Extract text from PDF
 */
export async function backendPdfToTxt(file: File): Promise<ApiResponse> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_BASE}/api/convert/pdf-to-txt`, {
    method: 'POST',
    body: form,
  });
  return parseResponse(res);
}

/**
 * Convert Image between PNG / JPG / JPEG / WEBP formats
 */
export async function backendConvertImageFormat(
  file: File,
  format: 'png' | 'jpg' | 'jpeg' | 'webp'
): Promise<ApiResponse> {
  const form = new FormData();
  form.append('file', file);
  form.append('format', format);

  const res = await fetch(`${API_BASE}/api/convert/image-format`, {
    method: 'POST',
    body: form,
  });
  return parseResponse(res);
}

/**
 * Analyze document forensics & OCR via backend
 */
export async function backendAnalyzeDocument(file: File): Promise<ApiResponse> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    body: form,
  });
  return parseResponse(res);
}

/**
 * Cross-check two documents via Gemini forensics backend
 */
export async function backendCrossCheck(
  file1: File,
  file2: File
): Promise<ApiResponse<any>> {
  const form = new FormData();
  form.append('file1', file1);
  form.append('file2', file2);

  const res = await fetch(`${API_BASE}/api/cross-check`, {
    method: 'POST',
    body: form,
  });
  return parseResponse(res);
}

/**
 * Call Gemini classifier / proxy via SDK backend
 */
export async function backendClassify(payload: {
  apiKey?: string;
  model?: string;
  systemInstruction?: string;
  contents: any;
  generationConfig?: any;
}): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/api/classify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
}

/**
 * Get full download URL from backend output path
 */
export function getBackendDownloadUrl(downloadUrl: string): string {
  if (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://')) {
    return downloadUrl;
  }
  const cleanUrl = downloadUrl.startsWith('/') ? downloadUrl : `/${downloadUrl}`;
  return API_BASE ? `${API_BASE}${cleanUrl}` : cleanUrl;
}

/**
 * Download processed file from backend as a File object
 */
export async function fetchBackendProcessedFile(
  downloadUrl: string,
  filename: string,
  mimeType: string = 'application/octet-stream'
): Promise<File> {
  const fullUrl = getBackendDownloadUrl(downloadUrl);
  const res = await fetch(fullUrl);
  if (!res.ok) {
    throw new Error(`Failed to download processed file (status ${res.status})`);
  }
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType });
}

/**
 * Download file directly from Blob / File in browser
 */
export function downloadFileDirect(file: File | Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}

/**
 * Fetch processed file from server and trigger browser download with designated filename
 */
export async function downloadRenamed(downloadUrl: string, filename: string): Promise<void> {
  const res = await fetch(getBackendDownloadUrl(downloadUrl));
  if (!res.ok) throw new Error(`Could not fetch the file to download (status ${res.status})`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}
