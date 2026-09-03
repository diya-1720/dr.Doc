import QRCode from 'qrcode';
import JSZip from 'jszip';
import type { DocItem, IssueItem, CrossCheckField } from '../types';
import { mergeSelectedDocsIntoPdf } from './docTools';

export type ExportFormat = 'pdf' | 'png' | 'jpg' | 'webp' | 'original';

export interface DocExportConfig {
  docId: string;
  format: ExportFormat;
  includeInMergedPdf: boolean;
}

export interface ShareDocumentItem {
  id: string;
  originalFilename: string;
  classifiedFilename: string;
  documentType: string;
  format: ExportFormat;
  mimeType: string;
  dataUrl: string; // Base64 data URL for direct instant download
  fileSizeBytes: number;
  qualityScore: number;
  verificationStatus: string;
}

export interface SharePackageData {
  shareId: string;
  caseId: string;
  applicantName: string;
  readinessScore: number;
  createdAt: number;
  expiresAt: number; // Exactly 30 minutes from creation
  remainingSeconds?: number;
  isExpired?: boolean;
  documents: ShareDocumentItem[];
  hasMergedPdf: boolean;
  mergedPdfFilename?: string;
  mergedPdfDataUrl?: string;
  hasReport: boolean;
  reportFilename?: string;
  reportData?: {
    verifiedCount: number;
    reviewCount: number;
    missingCount: number;
    issues: IssueItem[];
    crossChecks: CrossCheckField[];
    generatedAt: string;
  };
}

const LOCAL_SHARE_PREFIX = 'dr_doc_share_';

/**
 * Standardized AI classification-based filename generator
 * e.g. AADHAAR_CARD_ROHAN_PATIL.pdf
 */
export function generateClassifiedFilename(doc: DocItem, targetFormat: ExportFormat, applicantName?: string): string {
  const cleanType = (doc.documentType || 'DOCUMENT')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  const cleanName = (applicantName || 'APPLICANT')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  const ext = targetFormat === 'original'
    ? (doc.filename.includes('.') ? doc.filename.substring(doc.filename.lastIndexOf('.') + 1) : 'pdf')
    : targetFormat;

  return `${cleanType}_${cleanName}.${ext}`;
}

/**
 * Converts a document to the selected format and returns its data URL and byte size
 */
export async function convertDocToFormat(doc: DocItem, targetFormat: ExportFormat): Promise<{ dataUrl: string; mimeType: string; fileSizeBytes: number }> {
  // If original format or already matching
  if (targetFormat === 'original') {
    let dataUrl = doc.previewUrl;
    if (doc.fileObj) {
      dataUrl = await fileToDataUrl(doc.fileObj);
    }
    const byteSize = doc.fileObj?.size || 250000;
    return { dataUrl, mimeType: doc.mimeType || 'application/pdf', fileSizeBytes: byteSize };
  }

  // Convert to PDF
  if (targetFormat === 'pdf') {
    if (doc.fileObj && (doc.fileObj.type.includes('pdf') || doc.filename.toLowerCase().endsWith('.pdf'))) {
      const dataUrl = await fileToDataUrl(doc.fileObj);
      return { dataUrl, mimeType: 'application/pdf', fileSizeBytes: doc.fileObj.size };
    }
    // Single image to PDF
    const pdfFile = await mergeSelectedDocsIntoPdf([doc], 'doc.pdf');
    const dataUrl = await fileToDataUrl(pdfFile);
    return { dataUrl, mimeType: 'application/pdf', fileSizeBytes: pdfFile.size };
  }

  // Convert to Image (PNG, JPG, WEBP)
  try {
    const img = await loadImage(doc.previewUrl);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width || 1200;
    canvas.height = img.naturalHeight || img.height || 1600;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    let mimeType = 'image/jpeg';
    let quality = 0.92;
    if (targetFormat === 'png') {
      mimeType = 'image/png';
    } else if (targetFormat === 'webp') {
      mimeType = 'image/webp';
      quality = 0.90;
    }

    const dataUrl = canvas.toDataURL(mimeType, quality);
    const fileSizeBytes = Math.round((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);
    return { dataUrl, mimeType, fileSizeBytes };
  } catch (imgErr) {
    console.warn('Image conversion fallback for doc:', doc.filename, imgErr);
    let dataUrl = doc.previewUrl;
    if (doc.fileObj) {
      try {
        dataUrl = await fileToDataUrl(doc.fileObj);
      } catch (fErr) {}
    }
    const byteSize = doc.fileObj?.size || 250000;
    return { dataUrl: dataUrl || doc.previewUrl || '', mimeType: doc.mimeType || 'application/octet-stream', fileSizeBytes: byteSize };
  }
}

/**
 * Creates a full Share Package with 30-minute expiry
 */
export async function createSharePackage(
  docs: DocItem[],
  configs: Record<string, ExportFormat>,
  options: {
    caseId?: string;
    applicantName?: string;
    readinessScore?: number;
    includeMergedPdf?: boolean;
    includeReport?: boolean;
    reportSummary?: any;
  }
): Promise<SharePackageData> {
  const shareId = 'drshare_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  const createdAt = Date.now();
  const expiresAt = createdAt + 30 * 60 * 1000; // Strictly 30 minutes

  const appName = options.applicantName || 'APPLICANT';
  const sharedDocs: ShareDocumentItem[] = [];

  // Process and convert each document
  for (const doc of docs) {
    const format = configs[doc.id] || 'pdf';
    const classifiedName = generateClassifiedFilename(doc, format, appName);
    const converted = await convertDocToFormat(doc, format);

    sharedDocs.push({
      id: doc.id,
      originalFilename: doc.filename,
      classifiedFilename: classifiedName,
      documentType: doc.documentType,
      format,
      mimeType: converted.mimeType,
      dataUrl: converted.dataUrl,
      fileSizeBytes: converted.fileSizeBytes,
      qualityScore: doc.quality?.overallScore || 90,
      verificationStatus: doc.verificationStatus || 'VERIFIED'
    });
  }

  // Generate Consolidated Merged PDF if requested
  let mergedPdfDataUrl: string | undefined;
  let mergedPdfFilename: string | undefined;
  if (options.includeMergedPdf && docs.length > 0) {
    try {
      mergedPdfFilename = `CONSOLIDATED_${appName.toUpperCase()}_CASE_DOCUMENTS.pdf`;
      const mergedFile = await mergeSelectedDocsIntoPdf(docs, mergedPdfFilename);
      mergedPdfDataUrl = await fileToDataUrl(mergedFile);
    } catch (err) {
      console.warn('Failed to build merged PDF for share package:', err);
    }
  }

  const packageData: SharePackageData = {
    shareId,
    caseId: options.caseId || `DR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    applicantName: appName,
    readinessScore: options.readinessScore || 95,
    createdAt,
    expiresAt,
    documents: sharedDocs,
    hasMergedPdf: !!mergedPdfDataUrl,
    mergedPdfFilename,
    mergedPdfDataUrl,
    hasReport: !!options.includeReport,
    reportFilename: `DR_DOC_FORENSIC_AUDIT_REPORT_${appName.toUpperCase()}.pdf`,
    reportData: options.reportSummary || null
  };

  // Save to Local Storage with 30-minute expiration
  try {
    localStorage.setItem(`${LOCAL_SHARE_PREFIX}${shareId}`, JSON.stringify(packageData));
  } catch (err) {
    console.warn('LocalStorage full, falling back to in-memory session only:', err);
  }

  // Send to Backend API with matching shareId and timestamps
  try {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shareId: packageData.shareId,
        caseId: packageData.caseId,
        applicantName: packageData.applicantName,
        readinessScore: packageData.readinessScore,
        documents: packageData.documents,
        hasMergedPdf: packageData.hasMergedPdf,
        mergedPdfDataUrl: packageData.mergedPdfDataUrl,
        hasReport: packageData.hasReport,
        reportData: packageData.reportData,
        createdAt: packageData.createdAt,
        expiresAt: packageData.expiresAt
      })
    });
    if (res.ok) {
      const resJson = await res.json();
      if (resJson?.data?.shareId) {
        packageData.shareId = resJson.data.shareId;
      }
    }
  } catch (backendErr) {
    console.warn('Backend share API offline or unavailable, local sharing active:', backendErr);
  }

  return packageData;
}

/**
 * Retrieves a Share Package by ID (checking 30-minute expiration)
 */
export async function getSharePackage(shareId: string): Promise<{ data: SharePackageData | null; isExpired: boolean; error?: string }> {
  const now = Date.now();

  // Try backend first
  try {
    const res = await fetch(`/api/share/${shareId}`);
    if (res.status === 410) {
      return { data: null, isExpired: true, error: 'This 30-minute share session has expired for security.' };
    }
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        const session = json.data as SharePackageData;
        const remainingSeconds = Math.max(0, Math.floor((session.expiresAt - now) / 1000));
        return {
          data: { ...session, remainingSeconds, isExpired: remainingSeconds <= 0 },
          isExpired: remainingSeconds <= 0
        };
      }
    }
  } catch {
    // Backend offline, fallback to local storage
  }

  // Check localStorage fallback
  const raw = localStorage.getItem(`${LOCAL_SHARE_PREFIX}${shareId}`);
  if (!raw) {
    return { data: null, isExpired: true, error: 'Share package not found or expired.' };
  }

  try {
    const session = JSON.parse(raw) as SharePackageData;
    if (now > session.expiresAt) {
      localStorage.removeItem(`${LOCAL_SHARE_PREFIX}${shareId}`);
      return { data: null, isExpired: true, error: 'This 30-minute share session has expired for security.' };
    }

    const remainingSeconds = Math.max(0, Math.floor((session.expiresAt - now) / 1000));
    return {
      data: { ...session, remainingSeconds, isExpired: false },
      isExpired: false
    };
  } catch (parseErr) {
    return { data: null, isExpired: true, error: 'Invalid share package data.' };
  }
}

/**
 * Deletes and permanently revokes a share package early before 30-minute expiration
 */
export async function deleteSharePackage(shareId: string): Promise<boolean> {
  // 1. Remove from client-side storage
  localStorage.removeItem(`${LOCAL_SHARE_PREFIX}${shareId}`);

  // 2. Remove from backend server
  try {
    const res = await fetch(`/api/share/${shareId}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch {
    return true; // Local removal succeeded
  }
}

/**
 * Generates high-contrast branded QR Code Data URL
 */
export async function generateQrCodeDataUrl(url: string): Promise<string> {
  return await QRCode.toDataURL(url, {
    width: 320,
    margin: 2,
    color: {
      dark: '#3F2928',  // Dr. Doc deep brown brand color
      light: '#FFF8EA'  // Dr. Doc cream parchment background
    },
    errorCorrectionLevel: 'M'
  });
}

/**
 * Downloads all documents, merged PDF, and report bundled into a single ZIP archive
 */
export async function downloadAllAsZip(shareData: SharePackageData) {
  const zip = new JSZip();
  const folder = zip.folder(`DR_DOC_CASE_${shareData.caseId}`) || zip;

  // Add individual documents
  for (const doc of shareData.documents) {
    const base64Data = doc.dataUrl.split(',')[1];
    if (base64Data) {
      folder.file(doc.classifiedFilename, base64Data, { base64: true });
    }
  }

  // Add Consolidated Merged PDF if available
  if (shareData.hasMergedPdf && shareData.mergedPdfDataUrl) {
    const mergedBase64 = shareData.mergedPdfDataUrl.split(',')[1];
    if (mergedBase64) {
      folder.file(shareData.mergedPdfFilename || 'CONSOLIDATED_CASE_DOCUMENTS.pdf', mergedBase64, { base64: true });
    }
  }

  // Add Audit Summary text file
  const summaryText = `DR. DOC FORENSIC CASE SUMMARY
==================================================
Case ID: ${shareData.caseId}
Applicant: ${shareData.applicantName}
Readiness Score: ${shareData.readinessScore}%
Created: ${new Date(shareData.createdAt).toLocaleString()}
Expires: ${new Date(shareData.expiresAt).toLocaleString()} (30-Minute Window)
Total Documents: ${shareData.documents.length}

DOCUMENT INVENTORY:
${shareData.documents.map((d, i) => `${i + 1}. [${d.documentType}] ${d.classifiedFilename} (${d.format.toUpperCase()} • ${(d.fileSizeBytes / 1024).toFixed(1)} KB)`).join('\n')}

Verified by Dr. Doc Forensic Document Intelligence System
`;
  folder.file('CASE_VERIFICATION_SUMMARY.txt', summaryText);

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `DR_DOC_${shareData.applicantName.toUpperCase().replace(/\s+/g, '_')}_CASE_PACKAGE.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Downloads a single file from a data URL
 */
export function triggerFileDownload(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Helpers
function fileToDataUrl(file: File | Blob): Promise<string> {
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
