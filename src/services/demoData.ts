import type { DocItem, ApplicationRequirement, IssueItem, CrossCheckField, NearbyServiceCenter } from '../types';

export const DEFAULT_APPLICATIONS: ApplicationRequirement[] = [
  {
    id: 'app-default-universal',
    name: 'Default: Universal Document Forensics & Ingestion',
    code: 'UNIVERSAL_FORENSICS_v1',
    description: 'Universal multi-document intake & deep audit pipeline. Ingest up to 20 documents of any category with automated classification, deep OCR, photo-aging audit, cross-check mismatch detection, and standardized renaming.',
    requiredDocuments: ['Identity Proof (PAN / Aadhaar / Passport)', 'Address Proof (Electricity Bill / Statement)', 'Photograph / Photo ID'],
    portalMaxFileSizeMB: 25
  },
  {
    id: 'app-biz-reg',
    name: 'Business Registration (GST / MSME)',
    code: 'BIZ_REG_2026',
    description: 'Standard document bundle for registering a new business entity or GST registration.',
    requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Bank Statement', 'GST Certificate', 'Photograph'],
    portalMaxFileSizeMB: 10
  },
  {
    id: 'app-kyc-bank',
    name: 'Bank Account & KYC Verification',
    code: 'KYC_BANK_v2',
    description: 'Comprehensive identity and address verification for financial banking & credit.',
    requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Passport', 'Electricity Bill', 'Photograph'],
    portalMaxFileSizeMB: 5
  },
  {
    id: 'app-loan-grant',
    name: 'Commercial Loan Application',
    code: 'LOAN_COMM_101',
    description: 'High-level financial verification bundle including identity, address, and bank statements.',
    requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Bank Statement', 'GST Certificate'],
    portalMaxFileSizeMB: 15
  },
  {
    id: 'app-college-adm',
    name: 'University & Higher Ed Admission',
    code: 'EDU_ADM_2026',
    description: 'Official student identity verification, passport details, and residence proofs.',
    requiredDocuments: ['Aadhaar Card', 'Passport', 'Photograph', 'Electricity Bill'],
    portalMaxFileSizeMB: 8
  }
];

export const DEMO_DOCUMENTS: DocItem[] = [
  {
    id: 'doc-aadhaar-01',
    filename: 'aadhaar_new.pdf',
    originalFilename: 'IMG_2837_scanned.pdf',
    fileSizeMB: 2.4,
    mimeType: 'application/pdf',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    category: 'IDENTITY',
    documentType: 'Aadhaar Card',
    confidence: 97,
    quality: {
      sharpness: 94,
      textVisibility: 91,
      lighting: 88,
      cropping: 96,
      overallScore: 92,
      status: 'GOOD',
      feedbackLines: ['Clean border alignment', 'High contrast text readability', 'Official UIDAI hologram detected']
    },
    extractedFields: [
      { key: 'full_name', label: 'Full Name', value: 'Rahul Kumar', confidence: 98, box: { x: 20, y: 25, w: 55, h: 10 } },
      { key: 'dob', label: 'Date of Birth', value: '12 Apr 2005', confidence: 96, box: { x: 20, y: 40, w: 40, h: 8 } },
      { key: 'aadhaar_number', label: 'Aadhaar Number', value: '•••• •••• 4912', confidence: 99, box: { x: 20, y: 55, w: 60, h: 10 } },
      { key: 'address', label: 'Residential Address', value: 'Plot 42, Green Park, Pune, Maharashtra - 411001', confidence: 94, box: { x: 20, y: 70, w: 75, h: 18 } }
    ],
    rawOcrText: 'GOVERNMENT OF INDIA\nUNIQUE IDENTIFICATION AUTHORITY OF INDIA\nName: Rahul Kumar\nDOB: 12/04/2005\nGender: Male\nAadhaar No: XXXX XXXX 4912\nAddress: Plot 42, Green Park, Pune, Maharashtra 411001',
    verificationStatus: 'VERIFIED',
    issues: [],
    uploadedAt: '2026-09-01T10:00:00Z',
    metadata: { pageCount: 1, dimensions: 'A4 format', format: 'PDF' }
  },
  {
    id: 'doc-pan-02',
    filename: 'document_final.pdf',
    originalFilename: 'document_final.pdf',
    fileSizeMB: 1.8,
    mimeType: 'application/pdf',
    previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    category: 'IDENTITY',
    documentType: 'PAN Card',
    confidence: 99,
    quality: {
      sharpness: 96,
      textVisibility: 95,
      lighting: 92,
      cropping: 98,
      overallScore: 95,
      status: 'GOOD',
      feedbackLines: ['Sharp text edges', 'Income Tax Department seal verified', 'QR Code readable']
    },
    extractedFields: [
      { key: 'full_name', label: 'Full Name', value: 'Rahul Kumar', confidence: 99, box: { x: 15, y: 30, w: 60, h: 12 } },
      { key: 'father_name', label: "Father's Name", value: 'Suresh Kumar', confidence: 97, box: { x: 15, y: 48, w: 55, h: 10 } },
      { key: 'dob', label: 'Date of Birth', value: '12 Apr 2005', confidence: 98, box: { x: 15, y: 62, w: 40, h: 9 } },
      { key: 'pan_number', label: 'PAN Number', value: 'ABCDE1234F', confidence: 99, box: { x: 15, y: 76, w: 50, h: 12 } }
    ],
    rawOcrText: 'INCOME TAX DEPARTMENT\nGOVT. OF INDIA\nName: RAHUL KUMAR\nFather\'s Name: SURESH KUMAR\nDate of Birth: 12/04/2005\nPermanent Account Number: ABCDE1234F',
    verificationStatus: 'VERIFIED',
    issues: [],
    uploadedAt: '2026-09-01T10:01:00Z',
    metadata: { pageCount: 1, dimensions: 'CR80 Card', format: 'PDF' }
  },
  {
    id: 'doc-bank-03',
    filename: 'bank_statement.pdf',
    originalFilename: 'bank_statement.pdf',
    fileSizeMB: 14.8,
    mimeType: 'application/pdf',
    previewUrl: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=600&q=80',
    category: 'ADDRESS',
    documentType: 'Bank Statement',
    confidence: 91,
    quality: {
      sharpness: 82,
      textVisibility: 84,
      lighting: 80,
      cropping: 88,
      overallScore: 84,
      status: 'GOOD',
      feedbackLines: ['Bank stamp present', 'Account number visible', 'File size exceeds standard 10MB portal threshold']
    },
    extractedFields: [
      { key: 'account_holder', label: 'Account Holder Name', value: 'R. Kumar', confidence: 92, box: { x: 10, y: 15, w: 50, h: 8 } },
      { key: 'bank_name', label: 'Bank Name', value: 'State Bank of India', confidence: 97, box: { x: 10, y: 5, w: 60, h: 8 } },
      { key: 'account_number', label: 'Account Number', value: '••••••••3891', confidence: 95, box: { x: 10, y: 25, w: 45, h: 8 } },
      { key: 'address', label: 'Statement Address', value: 'Plot 42, Green Park, Pune, MH', confidence: 89, box: { x: 10, y: 35, w: 70, h: 12 } }
    ],
    rawOcrText: 'STATE BANK OF INDIA\nAccount Statement\nCustomer Name: R. Kumar\nAddress: Plot 42, Green Park, Pune, MH\nAccount No: XXXX3891\nPeriod: 01/01/2026 to 31/08/2026',
    verificationStatus: 'NEEDS REVIEW',
    issues: [
      'Name Mismatch: "R. Kumar" on Bank Statement does not match full name "Rahul Kumar" on PAN / Aadhaar Card.',
      'File Size Exceeded: File size is 14.8 MB, exceeding the 10 MB portal limit for Business Registration.'
    ],
    uploadedAt: '2026-09-01T10:02:00Z',
    metadata: { pageCount: 6, dimensions: 'A4 Multi-page', format: 'PDF' }
  },
  {
    id: 'doc-photo-04',
    filename: 'photo.jpg',
    originalFilename: 'photo.jpg',
    fileSizeMB: 0.9,
    mimeType: 'image/jpeg',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    category: 'PERSONAL',
    documentType: 'Photograph',
    confidence: 98,
    quality: {
      sharpness: 92,
      textVisibility: 100,
      lighting: 90,
      cropping: 94,
      overallScore: 94,
      status: 'GOOD',
      feedbackLines: ['White background compliant', 'Face centered and clear', 'No glare detected']
    },
    extractedFields: [
      { key: 'photo_spec', label: 'Photo Dimensions', value: '3.5cm x 4.5cm Passport Size', confidence: 99 },
      { key: 'face_match', label: 'Biometric Face Quality', value: 'High Confidence (Pass)', confidence: 97 }
    ],
    rawOcrText: '[BIOMETRIC PHOTOGRAPH - PASSPORT STYLE PHOTO DETECTED]',
    verificationStatus: 'VERIFIED',
    issues: [],
    uploadedAt: '2026-09-01T10:03:00Z',
    metadata: { dimensions: '600x800 px', format: 'JPEG' }
  },
  {
    id: 'doc-scan-05',
    filename: 'scan001.pdf',
    originalFilename: 'scan001.pdf',
    fileSizeMB: 3.1,
    mimeType: 'application/pdf',
    previewUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    category: 'UNKNOWN',
    documentType: 'Unidentified Document',
    confidence: 64,
    quality: {
      sharpness: 58,
      textVisibility: 61,
      lighting: 52,
      cropping: 70,
      overallScore: 60,
      status: 'NEEDS ATTENTION',
      feedbackLines: ['Low lighting contrast', 'Text edges blurry', 'Unrecognized header layout']
    },
    extractedFields: [
      { key: 'unclear_header', label: 'Detected Text Header', value: 'MEMORANDUM / UTILITY NOTIFICATION', confidence: 62 },
      { key: 'date_stamp', label: 'Faint Timestamp', value: '2025-11-14', confidence: 65 }
    ],
    rawOcrText: 'UNCLEAR SCAN... Memorandum of understanding... Section 4...\nDate: 14/11/2025...\n[Text illegible in lower left corner]',
    verificationStatus: 'UNIDENTIFIED',
    issues: [
      'Document Unidentified: Classification confidence is 64%. Could not map to required checklist.',
      'Low Quality: Text visibility is 61% due to dark shadows.'
    ],
    uploadedAt: '2026-09-01T10:04:00Z',
    metadata: { pageCount: 1, format: 'PDF' }
  }
];

export const DEMO_ISSUES: IssueItem[] = [
  {
    id: 'issue-01',
    title: 'NAME MISMATCH IN ADDRESS PROOF',
    severity: 'CRITICAL',
    affectedDocumentId: 'doc-bank-03',
    affectedDocumentName: 'bank_statement.pdf',
    whyFlagged: 'The name detected on the Bank Statement is "R. Kumar", whereas identity documents (PAN Card and Aadhaar Card) state "Rahul Kumar". Government application portals often reject initial abbreviative mismatches.',
    recommendedAction: 'Upload another accepted address proof (such as Electricity Bill or updated Bank Statement) with matching full name "Rahul Kumar", or provide an official Name Affidavit.',
    fixActionType: 'reupload',
    resolved: false
  },
  {
    id: 'issue-02',
    title: 'FILE SIZE EXCEEDS PORTAL LIMIT',
    severity: 'NEEDS REVIEW',
    affectedDocumentId: 'doc-bank-03',
    affectedDocumentName: 'bank_statement.pdf',
    whyFlagged: 'Current file size is 14.8 MB. The target application portal (Business Registration) mandates a maximum threshold of 10 MB per document attachment.',
    recommendedAction: 'Compress this PDF file below 10 MB using the built-in Dr. Doc PDF Compression tool.',
    fixActionType: 'compress',
    resolved: false
  },
  {
    id: 'issue-03',
    title: 'MISSING GST CERTIFICATE',
    severity: 'CRITICAL',
    affectedDocumentId: undefined,
    affectedDocumentName: 'GST Certificate',
    whyFlagged: 'The chosen application profile (Business Registration) requires a valid GST Registration Certificate or Provisional GSTIN document, which was not found in the uploaded bundle.',
    recommendedAction: 'Obtain and upload your official GST registration certificate (Form REG-06) or provisional ID document.',
    fixActionType: 'reupload',
    resolved: false
  }
];

export const DEMO_CROSS_CHECKS: CrossCheckField[] = [
  {
    id: 'cross-name',
    fieldName: 'Applicant Full Name',
    status: 'MISMATCH',
    analysisNote: 'Inconsistency detected: "R. Kumar" on Bank Statement vs "Rahul Kumar" on PAN & Aadhaar.',
    sources: [
      { documentId: 'doc-pan-02', documentType: 'PAN Card', documentName: 'document_final.pdf', extractedValue: 'Rahul Kumar' },
      { documentId: 'doc-aadhaar-01', documentType: 'Aadhaar Card', documentName: 'aadhaar_new.pdf', extractedValue: 'Rahul Kumar' },
      { documentId: 'doc-bank-03', documentType: 'Bank Statement', documentName: 'bank_statement.pdf', extractedValue: 'R. Kumar' }
    ]
  },
  {
    id: 'cross-dob',
    fieldName: 'Date of Birth',
    status: 'MATCHED',
    analysisNote: 'Exact match across all identity documents (12 Apr 2005).',
    sources: [
      { documentId: 'doc-pan-02', documentType: 'PAN Card', documentName: 'document_final.pdf', extractedValue: '12 Apr 2005' },
      { documentId: 'doc-aadhaar-01', documentType: 'Aadhaar Card', documentName: 'aadhaar_new.pdf', extractedValue: '12 Apr 2005' }
    ]
  },
  {
    id: 'cross-address',
    fieldName: 'Residential Address',
    status: 'MATCHED',
    analysisNote: 'Address on Aadhaar Card and Bank Statement point to the same location in Pune.',
    sources: [
      { documentId: 'doc-aadhaar-01', documentType: 'Aadhaar Card', documentName: 'aadhaar_new.pdf', extractedValue: 'Plot 42, Green Park, Pune, Maharashtra - 411001' },
      { documentId: 'doc-bank-03', documentType: 'Bank Statement', documentName: 'bank_statement.pdf', extractedValue: 'Plot 42, Green Park, Pune, MH' }
    ]
  }
];

export const DEMO_NEARBY_CENTERS: NearbyServiceCenter[] = [
  {
    id: 'center-01',
    name: 'Aadhaar Seva Kendra & Document Facilitation Center',
    type: 'Official UIDAI & Document Center',
    address: 'Shop 14, Commercial Complex, MG Road, Camp, Pune, Maharashtra 411001',
    distanceKm: 0.8,
    phone: '+91 20 2612 3940',
    rating: 4.7,
    status: 'OPEN',
    hours: '09:00 AM - 06:30 PM',
    services: ['Aadhaar Name & Address Correction', 'Biometric Update', 'Official Printouts'],
    latitude: 18.5204,
    longitude: 73.8567
  },
  {
    id: 'center-02',
    name: 'CSC Digital Seva Kendra (Common Service Centre)',
    type: 'Government E-Services Center',
    address: 'Gate 2, Tehsil Office Compound, Shivajinagar, Pune, Maharashtra 411005',
    distanceKm: 1.4,
    phone: '+91 20 2553 1120',
    rating: 4.5,
    status: 'OPEN',
    hours: '09:30 AM - 07:00 PM',
    services: ['GST Registration Help', 'PAN Correction Affidavit', 'Document Scanning & Compression'],
    latitude: 18.5308,
    longitude: 73.8474
  },
  {
    id: 'center-03',
    name: 'Apex Cyber Cafe & Legal Documentation',
    type: 'Private Document & Scan Desk',
    address: 'Opposite District Court, FC Road, Pune, Maharashtra 411004',
    distanceKm: 2.1,
    phone: '+91 98220 14892',
    rating: 4.8,
    status: 'OPEN',
    hours: '08:30 AM - 09:00 PM',
    services: ['High-Res Scan', 'PDF Merge & Compression', 'Notary Attestation'],
    latitude: 18.5218,
    longitude: 73.8415
  }
];
