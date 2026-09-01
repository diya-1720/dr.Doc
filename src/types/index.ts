export type DocumentCategory = 'IDENTITY' | 'ADDRESS' | 'BUSINESS' | 'PERSONAL' | 'UNKNOWN';

export type DocumentType = 
  | 'PAN Card' 
  | 'Aadhaar Card' 
  | 'Passport' 
  | 'Electricity Bill' 
  | 'Bank Statement' 
  | 'GST Certificate' 
  | 'Photograph' 
  | 'Unidentified Document';

export type QualityStatus = 'GOOD' | 'NEEDS ATTENTION' | 'POOR';

export type VerificationStatus = 'VERIFIED' | 'NEEDS REVIEW' | 'REJECTED' | 'UNIDENTIFIED' | 'MISSING';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  w: number; // percentage 0-100
  h: number; // percentage 0-100
}

export interface ExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: number; // 0-100
  box?: BoundingBox;
}

export interface DocumentQuality {
  sharpness: number; // 0-100
  textVisibility: number; // 0-100
  lighting: number; // 0-100
  cropping: number; // 0-100
  overallScore: number; // 0-100
  status: QualityStatus;
  feedbackLines: string[];
}

export interface DocItem {
  id: string;
  filename: string;
  originalFilename: string;
  fileSizeMB: number;
  mimeType: string;
  previewUrl: string;
  category: DocumentCategory;
  documentType: DocumentType;
  confidence: number; // 0-100
  quality: DocumentQuality;
  extractedFields: ExtractedField[];
  rawOcrText: string;
  verificationStatus: VerificationStatus;
  issues: string[];
  uploadedAt: string;
  metadata: {
    pageCount?: number;
    dimensions?: string;
    format?: string;
  };
}

export interface ApplicationRequirement {
  id: string;
  name: string;
  code: string;
  description: string;
  requiredDocuments: DocumentType[];
  portalMaxFileSizeMB: number;
}

export interface IssueItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'NEEDS REVIEW' | 'INFORMATION';
  affectedDocumentId?: string;
  affectedDocumentName?: string;
  whyFlagged: string;
  recommendedAction: string;
  fixActionType?: 'compress' | 'rename' | 'reupload' | 'convert' | 'nearby';
  resolved: boolean;
}

export interface CrossCheckField {
  id: string;
  fieldName: string; // e.g. "Full Name", "Date of Birth", "Address", "Tax ID"
  status: 'MATCHED' | 'MISMATCH' | 'WARNING';
  sources: {
    documentId: string;
    documentType: string;
    documentName: string;
    extractedValue: string;
  }[];
  analysisNote: string;
}

export interface VerificationReport {
  caseId: string;
  applicationName: string;
  timestamp: string;
  readinessScore: number;
  totalDocuments: number;
  verifiedCount: number;
  reviewCount: number;
  missingCount: number;
  issues: IssueItem[];
  crossChecks: CrossCheckField[];
  analystHash: string;
}

export interface NearbyServiceCenter {
  id: string;
  name: string;
  type: string; // e.g. "Aadhaar Seva Kendra", "CSC Digital Seva", "Cyber Cafe & Document Center", "PAN Service Provider"
  address: string;
  distanceKm: number;
  phone: string;
  rating: number;
  status: 'OPEN' | 'CLOSED';
  hours: string;
  services: string[];
  latitude: number;
  longitude: number;
}
