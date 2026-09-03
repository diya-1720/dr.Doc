import QRCode from 'qrcode';
import type { DocItem, ApplicationRequirement, CrossCheckResult } from '../types';
import { mergeSelectedDocsIntoPdf } from './docTools';

export interface ShareableFileItem {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  category: 'BUNDLE' | 'ORIGINAL' | 'PROCESSED' | 'REPORT' | 'OCR';
  base64Data?: string;
  downloadUrl?: string;
}

export interface ShareSessionMetadata {
  token: string;
  caseId: string;
  applicationName: string;
  createdAt: string;
  expiresAt: string;
  files: ShareableFileItem[];
}

/**
 * Generate a styled QR Code Data URL matching DR. DOC branding
 */
export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#3F2928',  // DR. DOC deep brown
        light: '#FFF8EA', // DR. DOC warm card background
      },
    });
  } catch (err) {
    console.error('QR code generation error:', err);
    throw err;
  }
}

/**
 * Convert a File/Blob to Base64 data URL
 */
function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

/**
 * Package current case documents into shareable file items
 */
export async function prepareCaseFilesForShare(
  documents: DocItem[],
  caseId: string,
  currentApp: ApplicationRequirement,
  crossCheckResult?: CrossCheckResult | null
): Promise<ShareableFileItem[]> {
  const files: ShareableFileItem[] = [];

  // 1. Consolidated Master Application PDF
  if (documents.length > 0) {
    try {
      const bundlePdf = await mergeSelectedDocsIntoPdf(documents, `CONSOLIDATED_APPLICATION_${caseId}.pdf`);
      const base64 = await fileToBase64(bundlePdf);
      files.push({
        id: `bundle_pdf_${caseId}`,
        name: `CONSOLIDATED_APPLICATION_${caseId}.pdf`,
        mimeType: 'application/pdf',
        sizeBytes: bundlePdf.size,
        category: 'BUNDLE',
        base64Data: base64,
      });
    } catch (err) {
      console.warn('Could not generate consolidated bundle for share:', err);
    }
  }

  // 2. Individual Uploaded & Processed Documents
  for (const doc of documents) {
    // If original fileObj is present
    if (doc.fileObj) {
      try {
        const base64 = await fileToBase64(doc.fileObj);
        const safeDocTypeName = doc.documentType.toUpperCase().replace(/\s+/g, '_');
        const ext = doc.filename.split('.').pop() || 'pdf';
        const docName = `${safeDocTypeName}_${caseId}.${ext}`;
        
        files.push({
          id: `orig_${doc.id}`,
          name: docName,
          mimeType: doc.mimeType || 'application/octet-stream',
          sizeBytes: doc.fileObj.size,
          category: 'ORIGINAL',
          base64Data: base64,
        });
      } catch (err) {
        console.warn(`Could not encode document ${doc.id}:`, err);
      }
    }

    // 3. OCR Text Export
    if (doc.extractedFields && doc.extractedFields.length > 0) {
      try {
        const textContent = [
          `DR. DOC // VERIFIED OCR DATA EXPORT`,
          `CASE ID: ${caseId}`,
          `DOCUMENT TYPE: ${doc.documentType}`,
          `FILENAME: ${doc.filename}`,
          `EXPORT DATE: ${new Date().toISOString()}`,
          `----------------------------------------`,
          ...doc.extractedFields.map((f) => `${f.label || f.key.toUpperCase()}: ${f.value}`),
        ].join('\n');

        const textBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const base64 = await fileToBase64(textBlob);
        const safeDocTypeName = doc.documentType.toUpperCase().replace(/\s+/g, '_');

        files.push({
          id: `ocr_${doc.id}`,
          name: `OCR_${safeDocTypeName}_${caseId}.txt`,
          mimeType: 'text/plain',
          sizeBytes: textBlob.size,
          category: 'OCR',
          base64Data: base64,
        });
      } catch (err) {
        console.warn(`Could not generate OCR text export for ${doc.id}:`, err);
      }
    }
  }

  // 4. Cross-Check Verification Summary Report
  if (crossCheckResult && crossCheckResult.fields) {
    try {
      const fieldLines = Object.entries(crossCheckResult.fields)
        .filter(([_, f]) => Boolean(f))
        .map(([key, f]) => {
          if (!f) return '';
          return `[${f.match === true ? 'MATCHED' : f.match === false ? 'MISMATCH' : 'INCOMPLETE'}] ${key.toUpperCase()}: ${f.notes || ''} (Doc 1: "${f.document1}" | Doc 2: "${f.document2}")`;
        })
        .filter(Boolean);

      const reportContent = [
        `DR. DOC // FORENSIC CROSS-CHECK REPORT`,
        `CASE ID: ${caseId}`,
        `APPLICATION: ${currentApp.name}`,
        `OVERALL COMPATIBILITY SCORE: ${crossCheckResult.matchScore ?? 'N/A'}%`,
        `STATUS: ${crossCheckResult.overallMatch ? 'VERIFIED_COMPATIBLE' : 'DISCREPANCY_DETECTED'}`,
        `REPORT GENERATED: ${new Date().toISOString()}`,
        `========================================`,
        `FIELD BY FIELD AUDIT:`,
        ...fieldLines,
      ].join('\n');

      const reportBlob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const base64 = await fileToBase64(reportBlob);

      files.push({
        id: `crosscheck_report_${caseId}`,
        name: `CROSS_CHECK_REPORT_${caseId}.txt`,
        mimeType: 'text/plain',
        sizeBytes: reportBlob.size,
        category: 'REPORT',
        base64Data: base64,
      });
    } catch (err) {
      console.warn('Could not generate cross-check report for share:', err);
    }
  }

  return files;
}

/**
 * Creates a secure share session and registers it on backend and local cache
 */
export async function createCaseShareSession(
  caseId: string,
  applicationName: string,
  files: ShareableFileItem[],
  expiryHours: number = 24
): Promise<{ token: string; expiresAt: string; shareUrl: string }> {
  let token = '';
  let expiresAt = '';

  // 1. Try Backend API
  try {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseId,
        applicationName,
        expiryHours,
        files: files.map((f) => ({
          id: f.id,
          name: f.name,
          mimeType: f.mimeType,
          sizeBytes: f.sizeBytes,
          category: f.category,
          base64Data: f.base64Data,
        })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        token = data.token;
        expiresAt = data.expiresAt;
      }
    }
  } catch (backendErr) {
    console.warn('Backend share creation offline or failed, falling back to local session store:', backendErr);
  }

  // 2. Local Fallback Token if backend was unreachable
  if (!token) {
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    token = randomHex;
    expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
  }

  // 3. Always cache locally so /share/:token works offline/demo too
  const sessionData: ShareSessionMetadata = {
    token,
    caseId,
    applicationName,
    createdAt: new Date().toISOString(),
    expiresAt,
    files,
  };

  try {
    localStorage.setItem(`dr_doc_share_${token}`, JSON.stringify(sessionData));
  } catch (storageErr) {
    console.warn('localStorage quota warning when storing share session:', storageErr);
  }

  const shareUrl = `${window.location.origin}/share/${token}`;

  return {
    token,
    expiresAt,
    shareUrl,
  };
}

/**
 * Fetch share session metadata by token
 */
export async function fetchShareSession(token: string): Promise<ShareSessionMetadata> {
  // 1. Try Backend API
  try {
    const res = await fetch(`/api/share/${token}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        // If local cache has the actual base64Data, attach it
        const localCached = localStorage.getItem(`dr_doc_share_${token}`);
        if (localCached) {
          try {
            const parsed = JSON.parse(localCached) as ShareSessionMetadata;
            const fileMap = new Map(parsed.files.map((f) => [f.id, f]));
            json.data.files = json.data.files.map((f: ShareableFileItem) => ({
              ...f,
              base64Data: fileMap.get(f.id)?.base64Data || f.base64Data,
            }));
          } catch (_) {}
        }
        return json.data;
      }
    } else if (res.status === 410) {
      throw new Error('SHARE_EXPIRED');
    }
  } catch (err: any) {
    if (err.message === 'SHARE_EXPIRED') throw err;
    console.warn('Backend share fetch error, checking local session cache:', err);
  }

  // 2. Check Local Cache
  const localCached = localStorage.getItem(`dr_doc_share_${token}`);
  if (localCached) {
    try {
      const parsed = JSON.parse(localCached) as ShareSessionMetadata;
      if (parsed.expiresAt && Date.now() > new Date(parsed.expiresAt).getTime()) {
        localStorage.removeItem(`dr_doc_share_${token}`);
        throw new Error('SHARE_EXPIRED');
      }
      return parsed;
    } catch (e: any) {
      if (e.message === 'SHARE_EXPIRED') throw e;
    }
  }

  throw new Error('SHARE_NOT_FOUND');
}
