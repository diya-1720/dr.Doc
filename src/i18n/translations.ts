export type Language = 'en' | 'hi' | 'mr';

export interface TranslationDictionary {
  // Navigation & General
  nav: {
    home: string;
    verify: string;
    documents: string;
    ocr: string;
    quality: string;
    verification: string;
    crossCheck: string;
    issues: string;
    fix: string;
    tools: string;
    help: string;
    report: string;
    tryDemo: string;
    startCheckup: string;
    activeApplication: string;
    selectLanguage: string;
    menu: string;
    closeMenu: string;
  };

  // Header & Footer
  header: {
    tagline: string;
    descriptor: string;
    case: string;
    readiness: string;
    inbox: string;
  };
  footer: {
    tagline: string;
    philosophyTitle: string;
    philosophyText: string;
    systemStatus: string;
    allSystemsOperational: string;
    copyright: string;
    privacy: string;
    terms: string;
    security: string;
    workspaces: string;
    stationInfo: string;
    terminal: string;
    build: string;
    session: string;
    active: string;
  };

  // Common UI & Statuses
  common: {
    verified: string;
    needsReview: string;
    missing: string;
    critical: string;
    actionRequired: string;
    readyForSubmission: string;
    notEvaluated: string;
    upload: string;
    view: string;
    download: string;
    delete: string;
    fix: string;
    cancel: string;
    save: string;
    confirm: string;
    back: string;
    next: string;
    search: string;
    filter: string;
    all: string;
    loading: string;
    error: string;
    success: string;
    allChecksPassed: string;
  };

  // Document Card UI Elements & Badges
  docCard: {
    viewOcr: string;
    autoRename: string;
    export: string;
    audit: string;
    compare: string;
    tools: string;
    orientation: string;
    autoCorrected: string;
    horizontal: string;
    vertical: string;
    upright: string;
    aiClassified: string;
    name: string;
    father: string;
    idNo: string;
    dobAge: string;
    bloodGroup: string;
    addr: string;
    quality: string;
    photoAgeVerified: string;
    photoAgeMismatch: string;
    verifiedCurrent: string;
    confidence: string;
    years: string;
  };

  // Categories
  categories: {
    all: string;
    identity: string;
    address: string;
    business: string;
    personal: string;
    unknown: string;
  };

  // Document Types
  docTypes: {
    drivingLicense: string;
    aadhaarCard: string;
    panCard: string;
    passport: string;
    voterId: string;
    electricityBill: string;
    bankStatement: string;
    gstCertificate: string;
    photograph: string;
    unidentified: string;
  };

  // Inbox Direct Tour Steps
  inboxTour: {
    ocr: string;
    quality: string;
    verify: string;
    crossCheck: string;
    maxFilesBadge: string;
  };

  // Cross-Check Matrix UI & Statuses
  crossCheckMatrix: {
    mismatchBanner: string;
    openDesk: string;
    statusMatch: string;
    statusMismatch: string;
    statusCompatible: string;
    statusSingleDoc: string;
    statusDifferingTypes: string;
    overallConsistent: string;
    overallDiscrepancy: string;
    fieldName: string;
    doc1Value: string;
    doc2Value: string;
    verdict: string;
    confidence: string;
    crossCheckReport: string;
    runRecheck: string;
    coPresenceRule: string;
  };

  // Applications
  applications: {
    universal: { name: string; description: string; };
    bizReg: { name: string; description: string; };
    kycBank: { name: string; description: string; };
    loanGrant: { name: string; description: string; };
    collegeAdm: { name: string; description: string; };
  };

  // HomePage
  home: {
    heroTag: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroSubtitle: string;
    startCheckupBtn: string;
    exploreDemoBtn: string;
    resumeCaseVerification: string;
    openInboxBtn: string;
    ofDocs: string;
    stat1Title: string;
    stat1Desc: string;
    stat2Title: string;
    stat2Desc: string;
    stat3Title: string;
    stat3Desc: string;
    evidenceDesk: string;
    liveAnalysisBoard: string;
    caseInProgress: string;
    readinessScore: string;
    
    marquee: string[];

    sec1Tag: string;
    sec1Title: string;
    evidence1Title: string;
    evidence1Desc: string;
    evidence2Title: string;
    evidence2Desc: string;
    evidence3Title: string;
    evidence3Desc: string;

    sec2Tag: string;
    sec2Title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    step6Title: string;
    step6Desc: string;
    step7Title: string;
    step7Desc: string;
    step8Title: string;
    step8Desc: string;

    sec3Tag: string;
    sec3Title: string;
    beforeLabel: string;
    afterLabel: string;
    aiExamination: string;
    afterCat1: string;
    afterCat1Docs: string;
    afterCat2: string;
    afterCat2Docs: string;
    afterCat3: string;
    afterCat3Docs: string;

    sec4Tag: string;
    sec4Title: string;
    caseFinding: string;
    viewMatrix: string;

    sec5Tag: string;
    sec5Title: string;
    stepDetect: string;
    stepDetectDesc: string;
    stepWhy: string;
    stepWhyDesc: string;
    stepAction: string;
    stepActionDesc: string;
    stepTool: string;
    stepToolDesc: string;
    stepRecheck: string;
    stepRecheckDesc: string;

    ctaEyebrow: string;
    ctaTitle: string;
    ctaSubtitle: string;
    startVerificationBtn: string;
    launchDemoBtn: string;
  };

  // Verification Setup Page
  setup: {
    tag: string;
    title: string;
    subtitle: string;
    selectPrompt: string;
    requiredDocsLabel: string;
    startCheckup: string;
    customProfile: string;
    defaultForensics: string;
    selected: string;
    portalMaxLimit: string;
    activeProfileChecklist: string;
    requirements: string;
    mandatory: string;
  };

  // Document Inbox Page
  inbox: {
    tag: string;
    title: string;
    subtitle: string;
    uploadBoxTitle: string;
    uploadBoxSubtitle: string;
    uploadedDocsTitle: string;
    noDocsMessage: string;
    filterAll: string;
    filterIdentity: string;
    filterAddress: string;
    filterBusiness: string;
    selectAll: string;
    clearSelection: string;
    mergeSelected: string;
    downloadBundle: string;
    formatModalTitle: string;
    selectFormat: string;
  };

  // OCR Workspace Page
  ocr: {
    tag: string;
    title: string;
    subtitle: string;
    selectDocPrompt: string;
    extractedFields: string;
    confidenceScore: string;
    rawText: string;
    copyText: string;
    copied: string;
    photoAgingAudit: string;
    estimatedPhotoAge: string;
    dobCalculatedAge: string;
  };

  // Document Quality Page
  quality: {
    tag: string;
    title: string;
    subtitle: string;
    overallQuality: string;
    clarityScore: string;
    resolutionScore: string;
    fileSizeCheck: string;
    legibility: string;
    fixQualityBtn: string;
    qualityCompliant: string;
    sharpness: string;
    textVisibility: string;
    lighting: string;
    cropping: string;
    forensicRecommendation: string;
    passAllThresholds: string;
  };

  // Verification / Readiness Page
  verification: {
    tag: string;
    title: string;
    subtitlePrefix: string;
    readinessScoreLabel: string;
    notEvaluatedText: string;
    uploadDocsPrompt: string;
    analyzedDocsCount: string;
    verifiedCount: string;
    reviewCount: string;
    missingCount: string;
    requiredDocsTitle: string;
    docsProvidedCount: string;
    summaryTitle: string;
    validityMeter: string;
    qualityMeter: string;
    consistencyMeter: string;
    completenessMeter: string;
    issuesTitle: string;
    noIssuesFound: string;
    noIssuesDesc: string;
    reviewIssuesBtn: string;
    goFixWorkflowBtn: string;
    viewReportBtn: string;
  };

  // Cross-Check Page
  crossCheck: {
    tag: string;
    title: string;
    subtitle: string;
    matrixTitle: string;
    consistencyScore: string;
    mismatchDetected: string;
    allMatch: string;
    fieldComparison: string;
  };

  // Issues Page
  issues: {
    tag: string;
    title: string;
    subtitle: string;
    criticalTab: string;
    reviewTab: string;
    resolvedTab: string;
    noIssuesTitle: string;
    resolveBtn: string;
    resolvedStatus: string;
    whyFlagged: string;
    suggestedFix: string;
  };

  // Fix Application Page
  fix: {
    tag: string;
    title: string;
    subtitle: string;
    step: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    compressPdfTool: string;
    replaceDocTool: string;
    resolveIssuesBtn: string;
    reEvaluateBtn: string;
  };

  // Tools Page
  tools: {
    tag: string;
    title: string;
    subtitle: string;
    compressorTitle: string;
    compressorDesc: string;
    sharpenerTitle: string;
    sharpenerDesc: string;
    converterTitle: string;
    converterDesc: string;
    launchTool: string;
    compressTab: string;
    convertTab: string;
    formatTab: string;
    txtPdfTab: string;
    mergeTab: string;
    enhanceTab: string;
    renameTab: string;
    pickFromInbox: string;
    selectFiles: string;
    clickToSelect: string;
    compressThreshold: string;
    limit: string;
    compressBtn: string;
    compressSuccess: string;
    beforeSize: string;
    afterSize: string;
    reduction: string;
    smaller: string;
    readyForSub: string;
    downloadCompressed: string;
    updateInCase: string;
    updatedInCase: string;
    convertDesc: string;
    convertBtn: string;
    formatDesc: string;
    formatBtn: string;
    txtPdfTxtToPdf: string;
    txtPdfPdfToTxt: string;
    txtPdfBtn: string;
    extractedTextOutput: string;
    mergeDesc: string;
    mergeBtn: string;
    enhanceDesc: string;
    enhanceBtn: string;
    renameDesc: string;
    newFilename: string;
    renameBtn: string;
  };

  // Nearby Help Page
  help: {
    tag: string;
    title: string;
    subtitle: string;
    cscTitle: string;
    cscDesc: string;
    cafeTitle: string;
    cafeDesc: string;
    notaryTitle: string;
    notaryDesc: string;
    findNearestBtn: string;
    distance: string;
    directions: string;
    useGps: string;
    locating: string;
    servicesOffered: string;
  };

  // Verification Report Page
  report: {
    tag: string;
    title: string;
    subtitle: string;
    printReportBtn: string;
    exportPdfBtn: string;
    auditSummary: string;
    decisionStatus: string;
    finalStatement: string;
    tableType: string;
    tableCredentials: string;
    tablePhotoAudit: string;
    tableQuality: string;
    tableStatus: string;
    submissionPackage: string;
    consolidatedPdfTitle: string;
    consolidatedPdfDesc: string;
    downloadConsolidatedPdf: string;
    individualExportsTitle: string;
    individualExportsDesc: string;
    exportAsFormat: string;
    chooseExportFormat: string;
    downloadAs: string;
    authorizedSignature: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      home: 'HOME',
      verify: 'VERIFY',
      documents: 'DOCUMENTS',
      ocr: 'OCR',
      quality: 'QUALITY CHECK',
      verification: 'VERIFICATION',
      crossCheck: 'CROSS-CHECK',
      issues: 'ISSUES',
      fix: 'FIX APPLICATION',
      tools: 'TOOLS',
      help: 'NEARBY HELP',
      report: 'FINAL REPORT',
      tryDemo: 'TRY DEMO',
      startCheckup: 'START CHECKUP',
      activeApplication: 'ACTIVE APPLICATION',
      selectLanguage: 'Language',
      menu: 'MENU',
      closeMenu: 'CLOSE',
    },
    header: {
      tagline: 'DR. DOC',
      descriptor: 'DOCUMENT INTELLIGENCE',
      case: 'CASE',
      readiness: 'READINESS',
      inbox: 'INBOX',
    },
    footer: {
      tagline: 'DR. DOC — Intelligent Document Verification Platform',
      philosophyTitle: 'OUR PHILOSOPHY',
      philosophyText: 'Paperwork should never be the reason an application fails. Dr. Doc checks, verifies, and fixes document issues before official submission.',
      systemStatus: 'SYSTEM STATUS',
      allSystemsOperational: 'All verification engines operational',
      copyright: '© 2026 DR. DOC. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      security: 'Security Architecture',
      workspaces: 'WORKSPACES',
      stationInfo: 'STATION INFO',
      terminal: 'TERMINAL',
      build: 'BUILD',
      session: 'SESSION',
      active: 'ACTIVE',
    },
    common: {
      verified: 'VERIFIED',
      needsReview: 'NEEDS REVIEW',
      missing: 'MISSING',
      critical: 'CRITICAL',
      actionRequired: 'ACTION REQUIRED',
      readyForSubmission: 'READY FOR SUBMISSION',
      notEvaluated: 'NOT EVALUATED',
      upload: 'Upload',
      view: 'View',
      download: 'Download',
      delete: 'Delete',
      fix: 'Fix',
      cancel: 'Cancel',
      save: 'Save',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      search: 'Search...',
      filter: 'Filter',
      all: 'All',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      allChecksPassed: 'All Checks Passed',
    },
    docCard: {
      viewOcr: 'VIEW OCR',
      autoRename: 'AUTO-RENAME',
      export: 'EXPORT',
      audit: 'Audit',
      compare: 'Compare',
      tools: 'Tools',
      orientation: 'ORIENTATION',
      autoCorrected: 'AUTO-CORRECTED',
      horizontal: 'HORIZONTAL',
      vertical: 'VERTICAL',
      upright: 'HORIZONTAL UPRIGHT',
      aiClassified: 'AI CLASSIFIED DOCUMENT:',
      name: 'NAME:',
      father: 'FATHER:',
      idNo: 'ID NO:',
      dobAge: 'DOB / AGE:',
      bloodGroup: 'BLOOD GROUP:',
      addr: 'ADDR:',
      quality: 'QUALITY:',
      photoAgeVerified: 'PHOTO AGE VERIFIED ✓',
      photoAgeMismatch: 'PHOTO AGE OUTDATED ⚠',
      verifiedCurrent: 'Photo is verified and current',
      confidence: 'Confidence',
      years: 'yrs',
    },
    categories: {
      all: 'ALL',
      identity: 'IDENTITY',
      address: 'ADDRESS',
      business: 'BUSINESS',
      personal: 'PERSONAL',
      unknown: 'UNKNOWN',
    },
    docTypes: {
      drivingLicense: 'Driving License',
      aadhaarCard: 'Aadhaar Card',
      panCard: 'PAN Card',
      passport: 'Passport',
      voterId: 'Voter ID',
      electricityBill: 'Electricity Bill',
      bankStatement: 'Bank Statement',
      gstCertificate: 'GST Certificate',
      photograph: 'Photograph',
      unidentified: 'Unidentified Document',
    },
    inboxTour: {
      ocr: '03. OCR ➔',
      quality: '04. Quality ➔',
      verify: '05. Verify ➔',
      crossCheck: '06. Cross-Check ➔',
      maxFilesBadge: '20 MAX',
    },
    crossCheckMatrix: {
      mismatchBanner: 'CROSS-DOCUMENT MISMATCH FLAGGED',
      openDesk: 'OPEN CROSS-CHECK DESK →',
      statusMatch: 'MATCH ✓',
      statusMismatch: 'MISMATCH ✕',
      statusCompatible: 'COMPATIBLE (Middle Name) ✓',
      statusSingleDoc: 'SINGLE DOCUMENT (Excluded)',
      statusDifferingTypes: 'DIFFERING DOC TYPES (Excluded)',
      overallConsistent: 'CONSISTENT ✓',
      overallDiscrepancy: 'DISCREPANCIES FOUND',
      fieldName: 'FIELD PARAMETER',
      doc1Value: 'DOCUMENT 1 VALUE',
      doc2Value: 'DOCUMENT 2 VALUE',
      verdict: 'VERIFICATION STATUS',
      confidence: 'CONFIDENCE',
      crossCheckReport: 'Cross-Check Verification Matrix',
      runRecheck: 'Run Deep Matrix Audit',
      coPresenceRule: 'Only comparing fields present across both documents. Single-sided fields are safely excluded.',
    },
    applications: {
      universal: {
        name: 'Default: Universal Document Forensics & Ingestion',
        description: 'Universal multi-document intake & deep audit pipeline. Ingest up to 20 documents of any category with automated classification, deep OCR, photo-aging audit, cross-check mismatch detection, and standardized renaming.'
      },
      bizReg: {
        name: 'Business Registration (GST / MSME)',
        description: 'Standard document bundle for registering a new business entity or GST registration.'
      },
      kycBank: {
        name: 'Bank Account & KYC Verification',
        description: 'Comprehensive identity and address verification for financial banking & credit.'
      },
      loanGrant: {
        name: 'Commercial Loan Application',
        description: 'High-level financial verification bundle including identity, address, and bank statements.'
      },
      collegeAdm: {
        name: 'University & Higher Ed Admission',
        description: 'Official student identity verification, passport details, and residence proofs.'
      }
    },
    home: {
      heroTag: 'DR. DOC • DOCUMENT INTELLIGENCE',
      heroTitleLine1: 'YOUR DOCUMENTS.',
      heroTitleLine2: 'UNDER EXAMINATION.',
      heroSubtitle: 'Upload your documents. Dr. Doc identifies, extracts, verifies and cross-checks them before submission. No rejected applications due to missing files or name mismatches.',
      startCheckupBtn: 'START A DOCUMENT CHECKUP',
      exploreDemoBtn: 'EXPLORE HOW IT WORKS',
      resumeCaseVerification: 'RESUME CASE VERIFICATION',
      openInboxBtn: 'OPEN DOCUMENT INBOX',
      ofDocs: 'OF 20 DOCS',
      stat1Title: '100% AUTOMATED',
      stat1Desc: 'Multi-Doc Classification',
      stat2Title: 'CROSS-DOCUMENT',
      stat2Desc: 'Inconsistency Detection',
      stat3Title: 'IN-LINE FIX',
      stat3Desc: 'Compression & Tools',
      evidenceDesk: 'EVIDENCE DESK',
      liveAnalysisBoard: 'LIVE ANALYSIS BOARD',
      caseInProgress: 'CASE IN PROGRESS',
      readinessScore: 'READINESS SCORE',
      
      marquee: [
        'DOCUMENT INTELLIGENCE',
        'OCR ANALYSIS',
        'DOCUMENT CLASSIFICATION',
        'CROSS-DOCUMENT VERIFICATION',
        'QUALITY CHECK',
        'APPLICATION READINESS',
        'EVIDENCE REVIEW',
        'DOCUMENT PREPARATION',
        'RECHECK'
      ],

      sec1Tag: 'SECTION 01 // CASE STUDY',
      sec1Title: 'PAPERWORK SHOULD NOT BE THE REASON AN APPLICATION FAILS.',
      evidence1Title: 'MISSING DOCUMENT',
      evidence1Desc: 'Portals reject applications instantly when a single required PDF or GST certificate is forgotten. Dr. Doc checks completeness against exact application profiles.',
      evidence2Title: 'NAME MISMATCH',
      evidence2Desc: '"Rahul Kumar" vs "R. Kumar" across PAN and Bank statements cause silent delays and manual rejections. Dr. Doc flags cross-document inconsistencies before submission.',
      evidence3Title: 'WRONG / LOW-QUALITY FILE',
      evidence3Desc: 'Blurry scans, incorrect PNG formats, or files exceeding strict 10MB portal size limits. Dr. Doc inspects text visibility and provides instant built-in tools to fix them.',

      sec2Tag: 'SECTION 02 // EXAMINATION METHODOLOGY',
      sec2Title: 'HOW DR. DOC WORKS',
      step1Title: 'UPLOAD',
      step1Desc: 'Drag multiple files',
      step2Title: 'CLASSIFY',
      step2Desc: 'Detect doc types',
      step3Title: 'EXTRACT',
      step3Desc: 'OCR key fields',
      step4Title: 'VERIFY',
      step4Desc: 'Quality & rules',
      step5Title: 'CROSS-CHECK',
      step5Desc: 'Compare names',
      step6Title: 'FIX',
      step6Desc: 'Compress/replace',
      step7Title: 'RECHECK',
      step7Desc: 'Re-eval score',
      step8Title: 'READY',
      step8Desc: 'Final case report',

      sec3Tag: 'SECTION 03 // AUTOMATED INGESTION',
      sec3Title: 'SMART DOCUMENT CLASSIFICATION',
      beforeLabel: 'BEFORE: UNORGANIZED FILES',
      afterLabel: 'AFTER: AUTOMATIC CASE CATEGORIZATION',
      aiExamination: '↓ AI EXAMINATION ↓',
      afterCat1: 'IDENTITY CATEGORY',
      afterCat1Docs: 'Aadhaar Card • PAN Card • Passport',
      afterCat2: 'ADDRESS PROOF',
      afterCat2Docs: 'Electricity Bill • Bank Statement',
      afterCat3: 'BUSINESS & PERSONAL',
      afterCat3Docs: 'GST Certificate • Passport Photograph',

      sec4Tag: 'SECTION 04 // CROSS-DOCUMENT REASONING',
      sec4Title: 'CROSS-DOCUMENT INTELLIGENCE',
      caseFinding: 'CASE FINDING: POTENTIAL NAME MISMATCH DETECTED',
      viewMatrix: 'VIEW RELATIONSHIP MATRIX →',

      sec5Tag: 'SECTION 05 // INTEGRATED RESOLUTION',
      sec5Title: 'FIX, DON\'T JUST FLAG.',
      stepDetect: '01 DETECT',
      stepDetectDesc: 'File size exceeds portal limit',
      stepWhy: '02 WHY?',
      stepWhyDesc: 'Portal caps attachments at 10 MB',
      stepAction: '03 ACTION',
      stepActionDesc: 'Compress PDF below limit',
      stepTool: '04 TOOL',
      stepToolDesc: 'Click "COMPRESS NOW"',
      stepRecheck: '05 RECHECK',
      stepRecheckDesc: 'Ready for Submission ✓',

      ctaEyebrow: 'SUBMIT WITH CONFIDENCE',
      ctaTitle: 'GET READY BEFORE YOU SUBMIT.',
      ctaSubtitle: 'Avoid unnecessary delays and rejected applications. Check your document bundle now.',
      startVerificationBtn: 'START VERIFICATION',
      launchDemoBtn: 'LAUNCH DEMO',
    },
    setup: {
      tag: 'APPLICATION PROFILE SELECTION',
      title: 'SELECT APPLICATION TYPE',
      subtitle: 'Choose the official application you are preparing. Dr. Doc will load the exact compliance rules and required document checklist.',
      selectPrompt: 'AVAILABLE APPLICATION PROFILES',
      requiredDocsLabel: 'REQUIRED DOCUMENT BUNDLE:',
      startCheckup: 'START CHECKUP FOR THIS APPLICATION →',
      customProfile: 'Generic Document Audit (Universal Rules)',
      defaultForensics: 'DEFAULT FORENSICS',
      selected: 'SELECTED',
      portalMaxLimit: 'PORTAL MAX FILE LIMIT',
      activeProfileChecklist: 'ACTIVE PROFILE CHECKLIST',
      requirements: 'REQUIREMENTS',
      mandatory: 'MANDATORY',
    },
    inbox: {
      tag: 'DOCUMENT INTAKE DESK',
      title: 'DOCUMENT INBOX',
      subtitle: 'Upload all documents required for your application. Dr. Doc automatically analyzes, classifies, and verifies each file.',
      uploadBoxTitle: 'Drag & Drop your files here',
      uploadBoxSubtitle: 'Supports PDF, PNG, JPG, WEBP files up to 25MB each (up to 20 files simultaneously)',
      uploadedDocsTitle: 'Uploaded Case Documents',
      noDocsMessage: 'No documents uploaded yet. Drag and drop files or click to upload.',
      filterAll: 'All Documents',
      filterIdentity: 'Identity Proof',
      filterAddress: 'Address Proof',
      filterBusiness: 'Business & Other',
      selectAll: 'SELECT ALL',
      clearSelection: 'CLEAR ALL',
      mergeSelected: 'MERGE SELECTED TO 1 PDF',
      downloadBundle: 'DOWNLOAD CONSOLIDATED PDF',
      formatModalTitle: 'DOWNLOAD DOCUMENT',
      selectFormat: 'Choose Export Format',
    },
    ocr: {
      tag: 'OPTICAL CHARACTER RECOGNITION',
      title: 'OCR & FIELD EXTRACTION',
      subtitle: 'Inspect raw OCR text and structured fields extracted across your uploaded credentials.',
      selectDocPrompt: 'Select a document above to examine its OCR extraction stream',
      extractedFields: 'EXTRACTED FIELDS',
      confidenceScore: 'CONFIDENCE SCORE',
      rawText: 'RAW OCR TEXT STREAM',
      copyText: 'Copy Text',
      copied: 'COPIED TO CLIPBOARD ✓',
      photoAgingAudit: 'PHOTO & AGING AUDIT',
      estimatedPhotoAge: 'Estimated Photo Age:',
      dobCalculatedAge: 'DOB Calculated Age:',
    },
    quality: {
      tag: 'DOCUMENT INTEGRITY & QUALITY',
      title: 'QUALITY AUDIT',
      subtitle: 'Audit image resolution, clarity, portal size constraints, and text legibility.',
      overallQuality: 'OVERALL QUALITY SCORE',
      clarityScore: 'Text Sharpness Score',
      resolutionScore: 'DPI & Resolution Check',
      fileSizeCheck: 'File Size Threshold Check',
      legibility: 'Legibility Status',
      fixQualityBtn: 'FIX IN TOOLS →',
      qualityCompliant: 'QUALITY COMPLIANT',
      sharpness: 'SHARPNESS',
      textVisibility: 'TEXT VISIBILITY',
      lighting: 'LIGHTING',
      cropping: 'CROPPING & ALIGNMENT',
      forensicRecommendation: 'FORENSIC RECOMMENDATION:',
      passAllThresholds: 'All forensic quality metrics pass verification thresholds.',
    },
    verification: {
      tag: 'DOCUMENT AUDIT & COMPLIANCE',
      title: 'APPLICATION READINESS',
      subtitlePrefix: 'Application:',
      readinessScoreLabel: 'READINESS SCORE',
      notEvaluatedText: 'NOT EVALUATED',
      uploadDocsPrompt: 'Upload required documents to evaluate application readiness.',
      analyzedDocsCount: 'Documents Analyzed',
      verifiedCount: 'Verified',
      reviewCount: 'Needs Review',
      missingCount: 'Missing',
      requiredDocsTitle: 'REQUIRED DOCUMENTS CHECKLIST',
      docsProvidedCount: 'DOCS PROVIDED',
      summaryTitle: 'VERIFICATION SUMMARY',
      validityMeter: 'DOCUMENT VALIDITY',
      qualityMeter: 'DOCUMENT QUALITY',
      consistencyMeter: 'INFORMATION CONSISTENCY',
      completenessMeter: 'COMPLETENESS',
      issuesTitle: 'ISSUES REQUIRING ATTENTION',
      noIssuesFound: '✓ NO ISSUES FLAGGED',
      noIssuesDesc: 'All uploaded documents are fully compliant with application requirements.',
      reviewIssuesBtn: 'REVIEW ISSUES',
      goFixWorkflowBtn: 'GO TO FIX WORKFLOW',
      viewReportBtn: 'VIEW FINAL REPORT →',
    },
    crossCheck: {
      tag: 'CROSS-DOCUMENT FORENSIC REASONING',
      title: 'CROSS-DOCUMENT COMPARISON',
      subtitle: 'Compare name, address, ID numbers, and DOB across all credentials to prevent silent portal rejections.',
      matrixTitle: 'CROSS-DOCUMENT FIELD MATRIX',
      consistencyScore: 'CONSISTENCY SCORE',
      mismatchDetected: 'MISMATCH DETECTED ⚠',
      allMatch: 'ALL FIELDS MATCH ✓',
      fieldComparison: 'Field Comparison Matrix',
    },
    issues: {
      tag: 'DOCUMENT AUDIT FINDINGS',
      title: 'CASE ISSUES',
      subtitle: 'Review and resolve all flagged discrepancies before submitting your application.',
      criticalTab: 'CRITICAL',
      reviewTab: 'NEEDS REVIEW',
      resolvedTab: 'RESOLVED',
      noIssuesTitle: 'No issues found in this category',
      resolveBtn: 'MARK RESOLVED ✓',
      resolvedStatus: 'RESOLVED',
      whyFlagged: 'WHY FLAGGED:',
      suggestedFix: 'SUGGESTED ACTION:',
    },
    fix: {
      tag: 'INTEGRATED RESOLUTION DESK',
      title: 'FIX APPLICATION',
      subtitle: 'Compress large PDFs, replace mismatched documents, and re-evaluate readiness in one click.',
      step: 'STEP',
      step1Title: '1. Select Issue to Fix',
      step2Title: '2. Apply Built-in Fix',
      step3Title: '3. Re-Evaluate Readiness',
      compressPdfTool: 'COMPRESS PDF TOOL',
      replaceDocTool: 'REPLACE DOCUMENT',
      resolveIssuesBtn: 'APPLY FIX & RE-EVALUATE',
      reEvaluateBtn: 'RE-EVALUATE READINESS SCORE →',
    },
    tools: {
      tag: 'UTILITY SUITE',
      title: 'DOCUMENT TOOLS',
      subtitle: 'Compress PDFs, sharpen low-quality scans, convert image formats, merge documents, and more.',
      compressorTitle: 'PDF & Image Compressor',
      compressorDesc: 'Reduce file sizes below strict portal limits (10MB) without losing readability.',
      sharpenerTitle: 'Image Readability Enhancer',
      sharpenerDesc: 'Apply high-contrast binarization to enhance faint text.',
      converterTitle: 'Image to PDF Converter',
      converterDesc: 'Bundle photos into a standardized multi-page A4 PDF.',
      launchTool: 'OPEN TOOL →',
      compressTab: 'COMPRESS PDF / IMAGE',
      convertTab: 'JPG / PNG → PDF',
      formatTab: 'IMAGE FORMAT (WEBP/JPG/PNG)',
      txtPdfTab: 'TXT ↔ PDF',
      mergeTab: 'MERGE PDFs',
      enhanceTab: 'IMPROVE READABILITY',
      renameTab: 'RENAME FILE',
      pickFromInbox: 'OR PICK FROM CURRENT CASE INBOX',
      selectFiles: 'SELECT FILE(S) TO PROCESS (MAX 20 FILES):',
      clickToSelect: 'CLICK TO SELECT FILE FROM YOUR COMPUTER',
      compressThreshold: 'TARGET PORTAL FILE SIZE THRESHOLD (MB):',
      limit: 'LIMIT',
      compressBtn: 'COMPRESS FILE BELOW',
      compressSuccess: 'COMPRESSION SUCCESSFUL!',
      beforeSize: 'BEFORE SIZE:',
      afterSize: 'AFTER SIZE:',
      reduction: 'REDUCTION:',
      smaller: 'SMALLER',
      readyForSub: '✓ READY FOR SUBMISSION',
      downloadCompressed: 'DOWNLOAD COMPRESSED FILE',
      updateInCase: 'REPLACE IN CURRENT CASE FILE',
      updatedInCase: 'UPDATED IN CASE FILE ✓',
      convertDesc: 'Select PNG/JPG/WEBP photos. The backend sharp + pdf-lib engine bundles them into a multi-page A4 PDF document.',
      convertBtn: 'CONVERT TO PDF & DOWNLOAD',
      formatDesc: 'TARGET IMAGE FORMAT:',
      formatBtn: 'CONVERT FORMAT & DOWNLOAD',
      txtPdfTxtToPdf: 'TXT → PDF (PDFKIT LAYOUT)',
      txtPdfPdfToTxt: 'PDF → TXT (PDF-PARSE EXTRACTION)',
      txtPdfBtn: 'GENERATE PAGINATED PDF',
      extractedTextOutput: 'EXTRACTED TEXT OUTPUT:',
      mergeDesc: 'Select PDF files to concatenate into a single master submission PDF.',
      mergeBtn: 'MERGE PDFs & DOWNLOAD',
      enhanceDesc: 'Applies high-contrast grayscale binarization to remove dark shadows and enhance faint document text.',
      enhanceBtn: 'ENHANCE TEXT CONTRAST & DOWNLOAD',
      renameDesc: 'NEW FILENAME:',
      newFilename: 'NEW FILENAME:',
      renameBtn: 'DOWNLOAD RENAMED FILE',
    },
    help: {
      tag: 'FACILITATION DESK',
      title: 'NEARBY HELP CENTERS',
      subtitle: 'Locate authorized CSC centers, cyber cafes, and legal notaries near you for scanning, affidavits, and document verification.',
      cscTitle: 'Aaple Sarkar / CSC Centers',
      cscDesc: 'Government-authorized assistance centers for citizen application filing and document verification.',
      cafeTitle: 'Verified Cyber Cafes',
      cafeDesc: 'High-speed document scanning, printing, and file preparation centers.',
      notaryTitle: 'Notary & Legal Advocates',
      notaryDesc: 'Affidavits, stamp paper execution, and certified document true-copies.',
      findNearestBtn: 'Find Centers Near Me',
      distance: 'Distance',
      directions: 'GET DIRECTIONS',
      useGps: 'USE CURRENT GPS LOCATION',
      locating: 'LOCATING...',
      servicesOffered: 'SERVICES OFFERED:',
    },
    report: {
      tag: 'OFFICIAL SUMMARY DOSSIER',
      title: 'FINAL VERIFICATION REPORT',
      subtitle: 'Comprehensive audit dossier and digital certificate of application compliance.',
      printReportBtn: 'PRINT CERTIFICATE',
      exportPdfBtn: 'EXPORT CONSOLIDATED PDF',
      auditSummary: 'DOCUMENT AUDIT SUMMARY',
      decisionStatus: 'APPLICATION DECISION',
      finalStatement: 'Final Compliance Statement',
      tableType: 'CLASSIFIED TYPE',
      tableCredentials: 'EXTRACTED CREDENTIALS',
      tablePhotoAudit: 'PHOTO AUDIT',
      tableQuality: 'QUALITY',
      tableStatus: 'STATUS',
      submissionPackage: 'COMPLETE SUBMISSION PACKAGE',
      consolidatedPdfTitle: 'CONSOLIDATED MASTER APPLICATION PDF',
      consolidatedPdfDesc: 'Bundles all verified case documents into one unified, paginated A4 master submission PDF.',
      downloadConsolidatedPdf: 'DOWNLOAD CONSOLIDATED PDF BUNDLE',
      individualExportsTitle: 'INDIVIDUAL CLASSIFIED DOCUMENT EXPORTS',
      individualExportsDesc: 'Download individual documents with standardized classified filenames in your choice of format (PDF, PNG, JPG, WEBP).',
      exportAsFormat: 'EXPORT AS FORMAT',
      chooseExportFormat: 'CHOOSE EXPORT FORMAT:',
      downloadAs: 'DOWNLOAD AS',
      authorizedSignature: 'AUTHORIZED DIGITAL SIGNATURE',
    },
  },

  hi: {
    nav: {
      home: 'होम',
      verify: 'सत्यापन',
      documents: 'दस्तावेज़',
      ocr: 'ओसीआर',
      quality: 'गुणवत्ता जांच',
      verification: 'सत्यापन',
      crossCheck: 'क्रॉस-चेक',
      issues: 'त्रुटियां',
      fix: 'आवेदन सुधार',
      tools: 'उपकरण',
      help: 'निकटतम सहायता',
      report: 'अंतिम रिपोर्ट',
      tryDemo: 'डेमो देखें',
      startCheckup: 'जांच शुरू करें',
      activeApplication: 'सक्रिय आवेदन',
      selectLanguage: 'भाषा चुनें',
      menu: 'मेनू',
      closeMenu: 'बंद करें',
    },
    header: {
      tagline: 'डॉ. डॉक',
      descriptor: 'दस्तावेज़ बुद्धिमत्ता',
      case: 'केस',
      readiness: 'तैयारी',
      inbox: 'इनबॉक्स',
    },
    footer: {
      tagline: 'डॉ. डॉक — बुद्धिमान दस्तावेज़ सत्यापन प्लेटफ़ॉर्म',
      philosophyTitle: 'हमारा दृष्टिकोण',
      philosophyText: 'कागजी कार्रवाई की वजह से कभी भी कोई आवेदन खारिज नहीं होना चाहिए। डॉ. डॉक आधिकारिक सबमिशन से पहले सभी दस्तावेजों की जांच, सत्यापन और सुधार करता है।',
      systemStatus: 'सिस्टम स्थिति',
      allSystemsOperational: 'सभी सत्यापन इंजन सक्रिय हैं',
      copyright: '© 2026 डॉ. डॉक. सर्वाधिकार सुरक्षित।',
      privacy: 'गोपनीयता नीति',
      terms: 'सेवा की शर्तें',
      security: 'सुरक्षा वास्तुकला',
      workspaces: 'कार्यक्षेत्र',
      stationInfo: 'स्टेशन जानकारी',
      terminal: 'टर्मिनल',
      build: 'बिल्ड',
      session: 'सत्र',
      active: 'सक्रिय',
    },
    common: {
      verified: 'सत्यापित',
      needsReview: 'समीक्षा आवश्यक',
      missing: 'अनुपलब्ध',
      critical: 'गंभीर',
      actionRequired: 'कार्रवाई आवश्यक',
      readyForSubmission: 'प्रस्तुत करने के लिए तैयार',
      notEvaluated: 'मूल्यांकन नहीं हुआ',
      upload: 'अपलोड करें',
      view: 'देखें',
      download: 'डाउनलोड करें',
      delete: 'हटाएं',
      fix: 'सुधारें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      confirm: 'पुष्टि करें',
      back: 'पीछे',
      next: 'आगे',
      search: 'खोजें...',
      filter: 'फ़िल्टर',
      all: 'सभी',
      loading: 'लोड हो रहा है...',
      error: 'एक त्रुटि हुई',
      success: 'सफलता',
      allChecksPassed: 'सभी जांच सफल',
    },
    docCard: {
      viewOcr: 'ओसीआर देखें',
      autoRename: 'स्वतः नाम बदलें',
      export: 'निर्यात करें',
      audit: 'ऑडिट',
      compare: 'तुलना',
      tools: 'उपकरण',
      orientation: 'दिशा / ओरिएंटेशन',
      autoCorrected: 'स्वतः सुधारा गया',
      horizontal: 'क्षैतिज',
      vertical: 'लंबवत',
      upright: 'क्षैतिज सीधा',
      aiClassified: 'AI वर्गीकृत दस्तावेज़:',
      name: 'नाम:',
      father: 'पिता का नाम:',
      idNo: 'आईडी संख्या:',
      dobAge: 'जन्म तिथि / आयु:',
      bloodGroup: 'रक्त समूह:',
      addr: 'पता:',
      quality: 'गुणवत्ता:',
      photoAgeVerified: 'फोटो आयु सत्यापित ✓',
      photoAgeMismatch: 'फोटो पुरानी पाई गई ⚠',
      verifiedCurrent: 'फोटो सत्यापित और वर्तमान है',
      confidence: 'सटीकता',
      years: 'वर्ष',
    },
    categories: {
      all: 'सभी',
      identity: 'पहचान',
      address: 'पता',
      business: 'व्यवसाय',
      personal: 'व्यक्तिगत',
      unknown: 'अज्ञात',
    },
    docTypes: {
      drivingLicense: 'ड्राइविंग लाइसेंस',
      aadhaarCard: 'आधार कार्ड',
      panCard: 'पैन कार्ड',
      passport: 'पासपोर्ट',
      voterId: 'मतदाता पहचान पत्र',
      electricityBill: 'बिजली बिल',
      bankStatement: 'बैंक विवरण',
      gstCertificate: 'जीएसटी प्रमाणपत्र',
      photograph: 'पासपोर्ट फोटो',
      unidentified: 'अज्ञात दस्तावेज़',
    },
    inboxTour: {
      ocr: '03. ओसीआर ➔',
      quality: '04. गुणवत्ता ➔',
      verify: '05. सत्यापन ➔',
      crossCheck: '06. क्रॉस-चेक ➔',
      maxFilesBadge: '20 अधिकतम',
    },
    crossCheckMatrix: {
      mismatchBanner: 'दस्तावेज़ों में विसंगति पाई गई',
      openDesk: 'क्रॉस-चेक डेस्क खोलें →',
      statusMatch: 'समान ✓',
      statusMismatch: 'असंगत ✕',
      statusCompatible: 'सुसंगत (मध्य नाम) ✓',
      statusSingleDoc: 'केवल एक दस्तावेज़ (वंचित)',
      statusDifferingTypes: 'भिन्न दस्तावेज़ प्रकार (वंचित)',
      overallConsistent: 'सुसंगत ✓ (100%)',
      overallDiscrepancy: 'विसंगतियाँ पाई गईं',
      fieldName: 'मापदंड घटक',
      doc1Value: 'दस्तावेज़ 1 का मान',
      doc2Value: 'दस्तावेज़ 2 का मान',
      verdict: 'सत्यापन स्थिति',
      confidence: 'सटीकता',
      crossCheckReport: 'क्रॉस-चेक सत्यापन मैट्रिक्स',
      runRecheck: 'गहन ऑडिट पुनः चलाएं',
      coPresenceRule: 'केवल दोनों दस्तावेज़ों में मौजूद जानकारी की तुलना की जा रही है। एकतरफा फ़ील्ड सुरक्षित रूप से छोड़ दिए गए हैं।',
    },
    applications: {
      universal: {
        name: 'डिफ़ॉल्ट: सार्वभौमिक दस्तावेज़ फोरेंसिक और ऑडिट',
        description: 'सार्वभौमिक बहु-दस्तावेज़ इनटेक पाइपलाइन। किसी भी श्रेणी के 20 दस्तावेज़ों तक स्वचालित वर्गीकरण, गहन ओसीआर, फोटो-आयु ऑडिट और मानकीकृत नामकरण।'
      },
      bizReg: {
        name: 'व्यापार पंजीकरण (GST / MSME)',
        description: 'नए व्यवसाय पंजीकरण या जीएसटी पंजीकरण के लिए आवश्यक दस्तावेज़ पैकेज।'
      },
      kycBank: {
        name: 'बैंक खाता और केवाईसी सत्यापन',
        description: 'बैंकिंग और क्रेडिट के लिए पहचान और पते का व्यापक सत्यापन।'
      },
      loanGrant: {
        name: 'व्यावसायिक ऋण आवेदन (Commercial Loan)',
        description: 'पहचान, पते और बैंक स्टेटमेंट सहित उच्च-स्तरीय वित्तीय सत्यापन पैकेज।'
      },
      collegeAdm: {
        name: 'विश्वविद्यालय और उच्च शिक्षा प्रवेश',
        description: 'आधिकारिक छात्र पहचान सत्यापन, पासपोर्ट विवरण और निवास प्रमाण।'
      }
    },
    home: {
      heroTag: 'डॉ. डॉक • दस्तावेज़ बुद्धिमत्ता',
      heroTitleLine1: 'आपके दस्तावेज़।',
      heroTitleLine2: 'सटीक जांच के तहत।',
      heroSubtitle: 'अपने दस्तावेज़ अपलोड करें। डॉ. डॉक सबमिशन से पहले उनकी पहचान करता है, विवरण निकालता है, जांचता है और तुलना करता है। अब नाम में अंतर या छूटी हुई फाइलों के कारण आवेदन खारिज नहीं होंगे।',
      startCheckupBtn: 'दस्तावेज़ जांच शुरू करें',
      exploreDemoBtn: 'देखें यह कैसे काम करता है',
      resumeCaseVerification: 'केस सत्यापन जारी रखें',
      openInboxBtn: 'दस्तावेज़ इनबॉक्स खोलें',
      ofDocs: 'में से 20 दस्तावेज़',
      stat1Title: '100% स्वचालित',
      stat1Desc: 'बहु-दस्तावेज़ वर्गीकरण',
      stat2Title: 'क्रॉस-डॉक्यूमेंट',
      stat2Desc: 'विसंगति पहचान प्रणाली',
      stat3Title: 'इन-लाइन सुधार',
      stat3Desc: 'संपीड़न और उपकरण',
      evidenceDesk: 'साक्ष्य डेस्क',
      liveAnalysisBoard: 'लाइव विश्लेषण बोर्ड',
      caseInProgress: 'केस प्रगति पर है',
      readinessScore: 'तैयारी स्कोर',
      
      marquee: [
        'दस्तावेज़ बुद्धिमत्ता',
        'ओसीआर विश्लेषण',
        'दस्तावेज़ वर्गीकरण',
        'क्रॉस-डॉक्यूमेंट सत्यापन',
        'गुणवत्ता जांच',
        'आवेदन तत्परता',
        'साक्ष्य समीक्षा',
        'दस्तावेज़ तैयारी',
        'पुनः जांच'
      ],

      sec1Tag: 'अनुभाग 01 // केस स्टडी',
      sec1Title: 'कागजी कार्रवाई की वजह से आवेदन कभी खारिज नहीं होना चाहिए।',
      evidence1Title: 'छूटा हुआ दस्तावेज़',
      evidence1Desc: 'आवश्यक पीडीएफ या जीएसटी प्रमाणपत्र छूट जाने पर पोर्टल तुरंत आवेदन अस्वीकार कर देते हैं। डॉ. डॉक नियमों के अनुसार पूर्णता की जांच करता है।',
      evidence2Title: 'नाम में अंतर',
      evidence2Desc: 'पैन और बैंक स्टेटमेंट में "Rahul Kumar" बनाम "R. Kumar" देरी और अस्वीकृति का कारण बनता है। डॉ. डॉक सबमिशन से पहले इसे उजागर करता है।',
      evidence3Title: 'खराब / कम गुणवत्ता वाली फाइल',
      evidence3Desc: 'धुंधले स्कैन या 10MB से बड़ी फाइलें। डॉ. डॉक टेक्स्ट की स्पष्टता की जांच करता है और इन-बिल्ट टूल्स से उन्हें ठीक करता है।',

      sec2Tag: 'अनुभाग 02 // परीक्षण पद्धति',
      sec2Title: 'डॉ. डॉक कैसे काम करता है',
      step1Title: 'अपलोड',
      step1Desc: 'फाइलें ड्रैग करें',
      step2Title: 'वर्गीकरण',
      step2Desc: 'प्रकार पहचानें',
      step3Title: 'निष्कर्षण',
      step3Desc: 'ओसीआर विवरण',
      step4Title: 'सत्यापन',
      step4Desc: 'गुणवत्ता और नियम',
      step5Title: 'क्रॉस-चेक',
      step5Desc: 'नाम की तुलना',
      step6Title: 'सुधार',
      step6Desc: 'छोटा/बदलें',
      step7Title: 'पुनः जांच',
      step7Desc: 'स्कोर पुनः मापें',
      step8Title: 'तैयार',
      step8Desc: 'अंतिम केस रिपोर्ट',

      sec3Tag: 'अनुभाग 03 // स्वचालित अंतर्ग्रहण',
      sec3Title: 'स्मार्ट दस्तावेज़ वर्गीकरण',
      beforeLabel: 'पहले: अव्यवस्थित फाइलें',
      afterLabel: 'बाद में: स्वचालित वर्गीकरण',
      aiExamination: '↓ AI विश्लेषण ↓',
      afterCat1: 'पहचान श्रेणी',
      afterCat1Docs: 'आधार कार्ड • पैन कार्ड • पासपोर्ट',
      afterCat2: 'पता प्रमाण',
      afterCat2Docs: 'बिजली बिल • बैंक स्टेटमेंट',
      afterCat3: 'व्यापार और व्यक्तिगत',
      afterCat3Docs: 'जीएसटी प्रमाणपत्र • पासपोर्ट फोटो',

      sec4Tag: 'अनुभाग 04 // क्रॉस-डॉक्यूमेंट तर्क',
      sec4Title: 'दस्तावेज़ों की परस्पर तुलना',
      caseFinding: 'केस निष्कर्ष: नाम में संभावित विसंगति',
      viewMatrix: 'संबंध मैट्रिक्स देखें →',

      sec5Tag: 'अनुभाग 05 // एकीकृत निवारण',
      sec5Title: 'सिर्फ गलतियां न दिखाएं, उन्हें ठीक करें।',
      stepDetect: '01 पता लगाएं',
      stepDetectDesc: 'फाइल का आकार सीमा से अधिक है',
      stepWhy: '02 क्यों?',
      stepWhyDesc: 'पोर्टल 10 MB तक सीमित करता है',
      stepAction: '03 कार्रवाई',
      stepActionDesc: 'पीडीएफ को संपीड़ित करें',
      stepTool: '04 उपकरण',
      stepToolDesc: '"COMPRESS NOW" पर क्लिक करें',
      stepRecheck: '05 पुनः जांच',
      stepRecheckDesc: 'प्रस्तुत करने के लिए तैयार ✓',

      ctaEyebrow: 'आत्मविश्वास से सबमिट करें',
      ctaTitle: 'सबमिट करने से पहले पूरी तैयारी करें।',
      ctaSubtitle: 'अनावश्यक देरी और खारिज आवेदनों से बचें। अभी अपने दस्तावेज़ों की जांच करें।',
      startVerificationBtn: 'सत्यापन शुरू करें',
      launchDemoBtn: 'डेमो शुरू करें',
    },
    setup: {
      tag: 'आवेदन प्रोफाइल चयन',
      title: 'आवेदन प्रकार चुनें',
      subtitle: 'आप जिस आधिकारिक आवेदन की तैयारी कर रहे हैं उसे चुनें। डॉ. डॉक सटीक नियम और आवश्यक दस्तावेज़ सूची लोड करेगा।',
      selectPrompt: 'उपलब्ध आवेदन प्रोफाइल',
      requiredDocsLabel: 'आवश्यक दस्तावेज़ पैकेज:',
      startCheckup: 'इस आवेदन के लिए जांच शुरू करें →',
      customProfile: 'सामान्य दस्तावेज़ ऑडिट (सार्वभौमिक नियम)',
      defaultForensics: 'डिफ़ॉल्ट फोरेंसिक',
      selected: 'चयनित',
      portalMaxLimit: 'पोर्टल अधिकतम फ़ाइल सीमा',
      activeProfileChecklist: 'सक्रिय प्रोफ़ाइल चेकलिस्ट',
      requirements: 'आवश्यकताएं',
      mandatory: 'अनिवार्य',
    },
    inbox: {
      tag: 'दस्तावेज़ अंतर्ग्रहण डेस्क',
      title: 'दस्तावेज़ इनबॉक्स',
      subtitle: 'आवेदन के लिए आवश्यक सभी दस्तावेज़ अपलोड करें। डॉ. डॉक प्रत्येक फ़ाइल का स्वचालित विश्लेषण करता है।',
      uploadBoxTitle: 'अपनी फाइलें यहां खींचें और छोड़ें',
      uploadBoxSubtitle: 'प्रत्येक 25MB तक की PDF, PNG, JPG फाइलों का समर्थन करता है (20 फाइलों तक)',
      uploadedDocsTitle: 'अपलोड किए गए दस्तावेज़',
      noDocsMessage: 'अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया है। फाइलें ड्रैग करें या चुनने के लिए क्लिक करें।',
      filterAll: 'सभी दस्तावेज़',
      filterIdentity: 'पहचान प्रमाण',
      filterAddress: 'पता प्रमाण',
      filterBusiness: 'व्यवसाय व अन्य',
      selectAll: 'सभी चुनें',
      clearSelection: 'चयन साफ़ करें',
      mergeSelected: 'चयनित फाइलों को 1 PDF में जोड़ें',
      downloadBundle: 'संयुक्त PDF डाउनलोड करें',
      formatModalTitle: 'दस्तावेज़ डाउनलोड करें',
      selectFormat: 'निर्यात प्रारूप चुनें',
    },
    ocr: {
      tag: 'ऑप्टिकल कैरेक्टर रिकग्निशन',
      title: 'ओसीआर और विवरण निष्कर्षण',
      subtitle: 'अपलोड किए गए दस्तावेज़ों से निकाले गए विवरण और टेक्स्ट की जांच करें।',
      selectDocPrompt: 'ओसीआर देखने के लिए ऊपर एक दस्तावेज़ चुनें',
      extractedFields: 'निकाली गई महत्वपूर्ण जानकारी',
      confidenceScore: 'ओसीआर सटीकता स्कोर',
      rawText: 'मूल ओसीआर टेक्स्ट सामग्री',
      copyText: 'टेक्स्ट कॉपी करें',
      copied: 'क्लिपबोर्ड पर कॉपी किया गया ✓',
      photoAgingAudit: 'फोटो और आयु ऑडिट',
      estimatedPhotoAge: 'अनुमानित फोटो आयु:',
      dobCalculatedAge: 'जन्म तिथि से गणना की गई आयु:',
    },
    quality: {
      tag: 'दस्तावेज़ अखंडता और गुणवत्ता',
      title: 'गुणवत्ता ऑडिट',
      subtitle: 'छवि रिज़ॉल्यूशन, स्पष्टता, फ़ाइल आकार सीमा और पठनीयता की जांच करें।',
      overallQuality: 'समग्र गुणवत्ता स्कोर',
      clarityScore: 'टेक्स्ट स्पष्टता स्कोर',
      resolutionScore: 'डीपीआई और रिज़ॉल्यूशन जांच',
      fileSizeCheck: 'फ़ाइल आकार सीमा जांच',
      legibility: 'पठनीयता स्थिति',
      fixQualityBtn: 'उपकरणों में ठीक करें →',
      qualityCompliant: 'गुणवत्ता अनुरूप',
      sharpness: 'तीक्ष्णता / स्पष्टता',
      textVisibility: 'टेक्स्ट दृश्यता',
      lighting: 'प्रकाश / लाइटिंग',
      cropping: 'क्रॉपिंग और संरेखण',
      forensicRecommendation: 'फोरेंसिक सिफारिश:',
      passAllThresholds: 'सभी फोरेंसिक गुणवत्ता मानक सत्यापन सीमा को पार करते हैं।',
    },
    verification: {
      tag: 'दस्तावेज़ ऑडिट और अनुपालन',
      title: 'आवेदन तत्परता',
      subtitlePrefix: 'आवेदन:',
      readinessScoreLabel: 'तैयारी स्कोर',
      notEvaluatedText: 'मूल्यांकन नहीं हुआ',
      uploadDocsPrompt: 'तैयारी स्कोर प्राप्त करने के लिए आवश्यक दस्तावेज़ अपलोड करें।',
      analyzedDocsCount: 'दस्तावेज़ों का विश्लेषण किया गया',
      verifiedCount: 'सत्यापित',
      reviewCount: 'समीक्षा आवश्यक',
      missingCount: 'अनुपलब्ध',
      requiredDocsTitle: 'आवश्यक दस्तावेज़ चेकलिस्ट',
      docsProvidedCount: 'दस्तावेज़ उपलब्ध',
      summaryTitle: 'सत्यापन सारांश',
      validityMeter: 'दस्तावेज़ वैधता',
      qualityMeter: 'दस्तावेज़ गुणवत्ता',
      consistencyMeter: 'जानकारी की निरंतरता',
      completenessMeter: 'पूर्णता',
      issuesTitle: 'ध्यान देने योग्य समस्याएं',
      noIssuesFound: '✓ कोई समस्या नहीं पाई गई',
      noIssuesDesc: 'सभी अपलोड किए गए दस्तावेज़ आवेदन की आवश्यकताओं के अनुसार हैं।',
      reviewIssuesBtn: 'समस्याओं की समीक्षा करें',
      goFixWorkflowBtn: 'सुधार प्रक्रिया पर जाएं',
      viewReportBtn: 'अंतिम सत्यापन रिपोर्ट देखें →',
    },
    crossCheck: {
      tag: 'क्रॉस-डॉक्यूमेंट फोरेंसिक विश्लेषण',
      title: 'दस्तावेज़ तुलना',
      subtitle: 'सभी दस्तावेज़ों में नाम, पता, आईडी और जन्मतिथि की जांच करें ताकि पोर्टल अस्वीकृति से बचा जा सके।',
      matrixTitle: 'क्रॉस-डॉक्यूमेंट फील्ड मैट्रिक्स',
      consistencyScore: 'जानकारी निरंतरता स्कोर',
      mismatchDetected: 'असंगति पाई गई ⚠',
      allMatch: 'सभी जानकारी मेल खाती है ✓',
      fieldComparison: 'फ़ील्ड तुलना विवरण',
    },
    issues: {
      tag: 'दस्तावेज़ ऑडिट निष्कर्ष',
      title: 'केस समस्याएं',
      subtitle: 'आवेदन जमा करने से पहले सभी विसंगतियों और नाम के अंतरों की समीक्षा करें।',
      criticalTab: 'गंभीर',
      reviewTab: 'समीक्षा आवश्यक',
      resolvedTab: 'हल की गई',
      noIssuesTitle: 'इस श्रेणी में कोई समस्या नहीं है',
      resolveBtn: 'हल किया गया चिह्नित करें ✓',
      resolvedStatus: 'हल किया गया',
      whyFlagged: 'कारण:',
      suggestedFix: 'सुझाया गया समाधान:',
    },
    fix: {
      tag: 'एकीकृत समाधान डेस्क',
      title: 'आवेदन सुधारें',
      subtitle: 'पीडीएफ को संपीड़ित करें, संशोधित दस्तावेज़ अपलोड करें और तैयारी की पुनः जांच करें।',
      step: 'चरण',
      step1Title: '1. सुधारने योग्य समस्या चुनें',
      step2Title: '2. समाधान उपकरण का उपयोग करें',
      step3Title: '3. तैयारी की पुनः जांच करें',
      compressPdfTool: 'पीडीएफ संपीड़न उपकरण',
      replaceDocTool: 'दस्तावेज़ बदलें',
      resolveIssuesBtn: 'सुधार लागू करें और पुनः जांचें',
      reEvaluateBtn: 'तैयारी स्कोर की पुनः जांच करें →',
    },
    tools: {
      tag: 'उपयोगिता पैकेज',
      title: 'दस्तावेज़ उपकरण',
      subtitle: 'पीडीएफ कंप्रेसर, इमेज शार्पनर और फॉर्मेट कन्वर्टर टूल्स।',
      compressorTitle: 'पीडीएफ और इमेज कंप्रेसर',
      compressorDesc: 'पठनीयता खोए बिना फ़ाइल का आकार पोर्टल सीमा (10MB) से कम करें।',
      sharpenerTitle: 'इमेज स्पष्टता सुधारक',
      sharpenerDesc: 'धुंधले टेक्स्ट को स्पष्ट बनाने के लिए उच्च-कंट्रास्ट लागू करें।',
      converterTitle: 'इमेज से पीडीएफ कनवर्टर',
      converterDesc: 'फ़ोटो को साफ़ A4 पीडीएफ फाइलों में बदलें।',
      launchTool: 'टूल खोलें →',
      compressTab: 'पीडीएफ / इमेज संपीड़ित करें',
      convertTab: 'JPG / PNG → PDF',
      formatTab: 'इमेज फॉर्मेट (WEBP/JPG/PNG)',
      txtPdfTab: 'TXT ↔ PDF',
      mergeTab: 'पीडीएफ जोड़ें (Merge)',
      enhanceTab: 'स्पष्टता सुधारें',
      renameTab: 'फ़ाइल का नाम बदलें',
      pickFromInbox: 'या वर्तमान केस इनबॉक्स से चुनें',
      selectFiles: 'संसाधित करने के लिए फ़ाइलें चुनें (अधिकतम 20 फ़ाइलें):',
      clickToSelect: 'अपने कंप्यूटर से फ़ाइल चुनने के लिए क्लिक करें',
      compressThreshold: 'लक्षित पोर्टल फ़ाइल आकार सीमा (MB):',
      limit: 'सीमा',
      compressBtn: 'फ़ाइल को छोटा करें',
      compressSuccess: 'संपीड़न सफल रहा!',
      beforeSize: 'पहले का आकार:',
      afterSize: 'बाद का आकार:',
      reduction: 'कमी:',
      smaller: 'छोटा',
      readyForSub: '✓ प्रस्तुत करने के लिए तैयार',
      downloadCompressed: 'संपीड़ित फ़ाइल डाउनलोड करें',
      updateInCase: 'वर्तमान केस फ़ाइल में बदलें',
      updatedInCase: 'केस फ़ाइल में अपडेट किया गया ✓',
      convertDesc: 'PNG/JPG/WEBP फ़ोटो चुनें। बैकएंड इंजन उन्हें बहु-पृष्ठ A4 पीडीएफ में बदल देता है।',
      convertBtn: 'PDF में बदलें और डाउनलोड करें',
      formatDesc: 'लक्षित इमेज प्रारूप:',
      formatBtn: 'प्रारूप बदलें और डाउनलोड करें',
      txtPdfTxtToPdf: 'TXT → PDF (लेआउट निर्माण)',
      txtPdfPdfToTxt: 'PDF → TXT (टेक्स्ट निष्कर्षण)',
      txtPdfBtn: 'पीडीएफ उत्पन्न करें',
      extractedTextOutput: 'निकाला गया टेक्स्ट आउटपुट:',
      mergeDesc: 'एकल मास्टर सबमिशन पीडीएफ में जोड़ने के लिए पीडीएफ फाइलें चुनें।',
      mergeBtn: 'पीडीएफ जोड़ें और डाउनलोड करें',
      enhanceDesc: 'काले घेरे हटाने और हल्के टेक्स्ट को उभारने के लिए उच्च-कंट्रास्ट लागू करता है।',
      enhanceBtn: 'कंट्रास्ट सुधारें और डाउनलोड करें',
      renameDesc: 'नया फ़ाइल नाम:',
      newFilename: 'नया फ़ाइल नाम:',
      renameBtn: 'पुनर्नामित फ़ाइल डाउनलोड करें',
    },
    help: {
      tag: 'सहायता केंद्र खोजक',
      title: 'निकटतम सहायता केंद्र',
      subtitle: 'स्कैनिंग, हलफनामे और सत्यापन के लिए अपने नजदीकी सीएससी केंद्र और साइबर कैफे खोजें।',
      cscTitle: 'आपले सरकार / सीएससी केंद्र (CSC)',
      cscDesc: 'सरकारी आवेदन दाखिल करने और दस्तावेज़ सत्यापन के लिए अधिकृत केंद्र।',
      cafeTitle: 'सत्यापित साइबर कैफे',
      cafeDesc: 'हाई-स्पीड स्कैनिंग, प्रिंटिंग और फ़ाइल तैयारी केंद्र।',
      notaryTitle: 'नोटरी और कानूनी सलाहकार',
      notaryDesc: 'स्टाम्प पेपर, शपथ पत्र और प्रमाणित प्रतियां।',
      findNearestBtn: 'निकटतम केंद्र खोजें',
      distance: 'दूरी',
      directions: 'दिशा-निर्देश प्राप्त करें',
      useGps: 'वर्तमान जीपीएस स्थान का उपयोग करें',
      locating: 'स्थान खोजा जा रहा है...',
      servicesOffered: 'प्रदान की जाने वाली सेवाएं:',
    },
    report: {
      tag: 'आधिकारिक सारांश विवरण',
      title: 'अंतिम सत्यापन रिपोर्ट',
      subtitle: 'आपके आवेदन के लिए व्यापक ऑडिट रिपोर्ट और डिजिटल प्रमाणपत्र।',
      printReportBtn: 'प्रमाणपत्र प्रिंट करें',
      exportPdfBtn: 'संयुक्त पीडीएफ निर्यात करें',
      auditSummary: 'दस्तावेज़ ऑडिट सारांश',
      decisionStatus: 'आवेदन निर्णय स्थिति',
      finalStatement: 'अंतिम अनुपालन वक्तव्य',
      tableType: 'वर्गीकृत प्रकार',
      tableCredentials: 'निकाले गए विवरण',
      tablePhotoAudit: 'फोटो ऑडिट',
      tableQuality: 'गुणवत्ता',
      tableStatus: 'स्थिति',
      submissionPackage: 'पूर्ण सबमिशन पैकेज',
      consolidatedPdfTitle: 'समेकित मास्टर आवेदन पीडीएफ',
      consolidatedPdfDesc: 'सभी सत्यापित केस दस्तावेज़ों को एक एकीकृत, क्रमांकित A4 मास्टर पीडीएफ में जोड़ता है।',
      downloadConsolidatedPdf: 'समेकित पीडीएफ बंडल डाउनलोड करें',
      individualExportsTitle: 'व्यक्तिगत वर्गीकृत दस्तावेज़ निर्यात',
      individualExportsDesc: 'अपने चुने हुए प्रारूप (PDF, PNG, JPG, WEBP) में मानकीकृत फ़ाइल नामों के साथ व्यक्तिगत दस्तावेज़ डाउनलोड करें।',
      exportAsFormat: 'इस प्रारूप में निर्यात करें',
      chooseExportFormat: 'निर्यात प्रारूप चुनें:',
      downloadAs: 'डाउनलोड करें इस रूप में:',
      authorizedSignature: 'अधिकृत डिजिटल हस्ताक्षर',
    },
  },

  mr: {
    nav: {
      home: 'मुख्यपृष्ठ',
      verify: 'पडताळणी',
      documents: 'दस्तऐवज',
      ocr: 'ओसीआर',
      quality: 'गुणवत्ता तपासणी',
      verification: 'सत्यापन',
      crossCheck: 'क्रॉस-चेक',
      issues: 'त्रुटी',
      fix: 'अर्ज दुरुस्ती',
      tools: 'टूल्स',
      help: 'जवळची मदत',
      report: 'अंतिम अहवाल',
      tryDemo: 'डेमो पहा',
      startCheckup: 'तपासणी सुरू करा',
      activeApplication: 'सक्रिय अर्ज',
      selectLanguage: 'भाषा निवडा',
      menu: 'मेनू',
      closeMenu: 'बंद करा',
    },
    header: {
      tagline: 'डॉ. डॉक',
      descriptor: 'दस्तऐवज बुद्धिमत्ता',
      case: 'केस',
      readiness: 'तयारी',
      inbox: 'इनबॉक्स',
    },
    footer: {
      tagline: 'डॉ. डॉक — प्रगत दस्तऐवज पडताळणी प्लॅटफॉर्म',
      philosophyTitle: 'आमचा दृष्टिकोन',
      philosophyText: 'कागदपत्रांच्या त्रुटींमुळे कोणताही अर्ज नाकारला जाऊ नये. डॉ. डॉक अधिकृत सादरीकरणापूर्वी सर्व दस्तऐवजांची तपासणी, पडताळणी आणि दुरुस्ती करतो.',
      systemStatus: 'सिस्टम स्थिती',
      allSystemsOperational: 'सर्व पडताळणी इंजिन सक्रिय आहेत',
      copyright: '© 2026 डॉ. डॉक. सर्व हक्क राखीव.',
      privacy: 'गोपनीयता धोरण',
      terms: 'सेवा अटी',
      security: 'सुरक्षा वास्तुकला',
      workspaces: 'कार्यक्षेत्र',
      stationInfo: 'स्टेशन माहिती',
      terminal: 'टर्मिनल',
      build: 'बिल्ड',
      session: 'सत्र',
      active: 'सक्रिय',
    },
    common: {
      verified: 'पडताळणी पूर्ण',
      needsReview: 'पुनरावलोकन आवश्यक',
      missing: 'अनुपलब्ध',
      critical: 'गंभीर',
      actionRequired: 'कार्रवाई आवश्यक',
      readyForSubmission: 'सादर करण्यासाठी सज्ज',
      notEvaluated: 'मूल्यांकन झाले नाही',
      upload: 'अपलोड करा',
      view: 'पहा',
      download: 'डाउनलोड करा',
      delete: 'हटवा',
      fix: 'दुरुस्त करा',
      cancel: 'रद्द करा',
      save: 'जतन करा',
      confirm: 'पुष्टी करा',
      back: 'मागे',
      next: 'पुढे',
      search: 'शोधा...',
      filter: 'फिल्टर',
      all: 'सर्व',
      loading: 'लोड होत आहे...',
      error: 'एक त्रुटी आली',
      success: 'यशस्वी',
      allChecksPassed: 'सर्व तपासण्या यशस्वी',
    },
    docCard: {
      viewOcr: 'ओसीआर पहा',
      autoRename: 'नाव स्वयंचलित बदला',
      export: 'निर्यात करा',
      audit: 'ऑडिट',
      compare: 'तुलना',
      tools: 'टूल्स',
      orientation: 'दिशा / ओरिएंटेशन',
      autoCorrected: 'स्वयं सुधारित',
      horizontal: 'आडवे',
      vertical: 'उभे',
      upright: 'आडवे सरळ',
      aiClassified: 'AI वर्गीकृत दस्तऐवज:',
      name: 'नाव:',
      father: 'वडिलांचे नाव:',
      idNo: 'ओळख क्रमांक:',
      dobAge: 'जन्मतारीख / वय:',
      bloodGroup: 'रक्तगट:',
      addr: 'पत्ता:',
      quality: 'गुणवत्ता:',
      photoAgeVerified: 'फोटो वय सत्यापित ✓',
      photoAgeMismatch: 'फोटो जुना आढळला ⚠',
      verifiedCurrent: 'फोटो सत्यापित आणि चालू आहे',
      confidence: 'अचूकता',
      years: 'वर्षे',
    },
    categories: {
      all: 'सर्व',
      identity: 'ओळख',
      address: 'पत्ता',
      business: 'व्यवसाय',
      personal: 'वैयक्तिक',
      unknown: 'अज्ञात',
    },
    docTypes: {
      drivingLicense: 'वाहन चालक परवाना (Driving License)',
      aadhaarCard: 'आधार कार्ड',
      panCard: 'पॅन कार्ड',
      passport: 'पासपोर्ट',
      voterId: 'मतदार ओळखपत्र',
      electricityBill: 'वीज बिल',
      bankStatement: 'बँक स्टेटमेंट',
      gstCertificate: 'जीएसटी प्रमाणपत्र',
      photograph: 'पासपोर्ट फोटो',
      unidentified: 'अनामित दस्तऐवज',
    },
    inboxTour: {
      ocr: '03. ओसीआर ➔',
      quality: '04. गुणवत्ता ➔',
      verify: '05. पडताळणी ➔',
      crossCheck: '06. क्रॉस-चेक ➔',
      maxFilesBadge: '20 कमाल',
    },
    crossCheckMatrix: {
      mismatchBanner: 'दस्तऐवजांमध्ये विसंगती आढळली',
      openDesk: 'क्रॉस-चेक डेस्क उघडा →',
      statusMatch: 'समान ✓',
      statusMismatch: 'विसंगत ✕',
      statusCompatible: 'सुसंगत (मधले नाव) ✓',
      statusSingleDoc: 'एकच दस्तऐवज (वगळले)',
      statusDifferingTypes: 'भिन्न दस्तऐवज प्रकार (वगळले)',
      overallConsistent: 'सुसंगत ✓ (100%)',
      overallDiscrepancy: 'विसंगती आढळल्या',
      fieldName: 'माहिती घटक',
      doc1Value: 'दस्तऐवज 1 मधील माहिती',
      doc2Value: 'दस्तऐवज 2 मधील माहिती',
      verdict: 'पडताळणी स्थिती',
      confidence: 'अचूकता',
      crossCheckReport: 'क्रॉस-चेक पडताळणी मॅट्रिक्स',
      runRecheck: 'सखोल ऑडिट पुन्हा चालवा',
      coPresenceRule: 'केवळ दोन्ही दस्तऐवजांमध्ये उपलब्ध माहितीची तुलना केली जात आहे. एकाच दस्तऐवजातील माहिती सुरक्षितपणे वगळली आहे.',
    },
    applications: {
      universal: {
        name: 'डिफॉल्ट: सार्वत्रिक दस्तऐवज फॉरेन्सिक्स व ऑडिट',
        description: 'सार्वत्रिक बहु-दस्तऐवज इनटेक प्रणाली. कोणत्याही श्रेणीतील 20 दस्तऐवजांपर्यंत स्वयंचलित वर्गीकरण, सखोल ओसीआर, फोटो-वय ऑडिट आणि प्रमाणित नावकरण.'
      },
      bizReg: {
        name: 'व्यवसाय नोंदणी (GST / MSME)',
        description: 'नवीन व्यवसाय नोंदणी किंवा जीएसटी नोंदणीसाठी आवश्यक दस्तऐवज संच.'
      },
      kycBank: {
        name: 'बँक खाते व केवायसी पडताळणी',
        description: 'बँकिंग आणि क्रेडिटसाठी ओळख व पत्त्याची सर्वसमावेशक पडताळणी.'
      },
      loanGrant: {
        name: 'व्यावसायिक कर्ज अर्ज (Commercial Loan)',
        description: 'ओळख, पत्ता आणि बँक स्टेटमेंटसह उच्च-स्तरीय आर्थिक पडताळणी संच.'
      },
      collegeAdm: {
        name: 'विद्यापीठ व उच्च शिक्षण प्रवेश',
        description: 'अधिकृत विद्यार्थी ओळख पडताळणी, पासपोर्ट तपशील आणि निवास पुरावा.'
      }
    },
    home: {
      heroTag: 'डॉ. डॉक • दस्तऐवज बुद्धिमत्ता',
      heroTitleLine1: 'तुमचे दस्तऐवज।',
      heroTitleLine2: 'सखोल तपासणीखाली।',
      heroSubtitle: 'तुमचे दस्तऐवज अपलोड करा. डॉ. डॉक सबमिशनपूर्वी त्यांची ओळख पटवतो, विश्लेषण करतो, पडताळतो आणि तुलना करतो. आता नाव फरक किंवा गहाळ फाइल्समुळे अर्ज नाकारला जाणार नाही.',
      startCheckupBtn: 'दस्तऐवज तपासणी सुरू करा',
      exploreDemoBtn: 'हे कसे कार्य करते ते पहा',
      resumeCaseVerification: 'केस पडताळणी पुढे चालू ठेवा',
      openInboxBtn: 'दस्तऐवज इनबॉक्स उघडा',
      ofDocs: 'पैकी 20 दस्तऐवज',
      stat1Title: '100% स्वयंचलित',
      stat1Desc: 'बहु-दस्तऐवज वर्गीकरण',
      stat2Title: 'क्रॉस-डॉक्युमेंट',
      stat2Desc: 'विसंगती ओळख प्रणाली',
      stat3Title: 'इन-लाईन दुरुस्ती',
      stat3Desc: 'कॉम्प्रेशन आणि टूल्स',
      evidenceDesk: 'पुरावा डेस्क',
      liveAnalysisBoard: 'थेट विश्लेषण बोर्ड',
      caseInProgress: 'केस प्रगतीपथावर आहे',
      readinessScore: 'तयारी गुण',
      
      marquee: [
        'दस्तऐवज बुद्धिमत्ता',
        'ओसीआर विश्लेषण',
        'दस्तऐवज वर्गीकरण',
        'क्रॉस-डॉक्युमेंट पडताळणी',
        'गुणवत्ता तपासणी',
        'अर्ज तयारी',
        'पुरावा पुनरावलोकन',
        'दस्तऐवज तयारी',
        'पुनः तपासणी'
      ],

      sec1Tag: 'विभाग 01 // केस स्टडी',
      sec1Title: 'कागदपत्रांमधील त्रुटींमुळे अर्ज नाकारला जाऊ नये.',
      evidence1Title: 'अनुपलब्ध दस्तऐवज',
      evidence1Desc: 'आवश्यक पीडीएफ किंवा जीएसटी प्रमाणपत्र राहिल्यास पोर्टल अर्ज लगेच नाकारतात. डॉ. डॉक अर्जाच्या नियमांनुसार पूर्णता तपासतो.',
      evidence2Title: 'नावातील तफावत',
      evidence2Desc: 'पॅन व बँक स्टेटमेंटमधील "Rahul Kumar" विरुद्ध "R. Kumar" मुळे विलंब होतो. डॉ. डॉक सादर करण्यापूर्वी ही तफावत दर्शवतो.',
      evidence3Title: 'खराब / कमी दर्जाची फाईल',
      evidence3Desc: 'अस्पष्ट स्कॅन किंवा 10MB पेक्षा मोठ्या फाइल्स. डॉ. डॉक मजकूर स्पष्टता तपासतो आणि त्या दुरुस्त करण्यासाठी इन-बिल्ट टूल्स देतो.',

      sec2Tag: 'विभाग 02 // तपासणी पद्धत',
      sec2Title: 'डॉ. डॉक कसे कार्य करते',
      step1Title: 'अपलोड',
      step1Desc: 'फाइल्स ड्रॅग करा',
      step2Title: 'वर्गीकरण',
      step2Desc: 'प्रकार ओळखा',
      step3Title: 'निष्कर्षण',
      step3Desc: 'ओसीआर माहिती',
      step4Title: 'पडताळणी',
      step4Desc: 'गुणवत्ता व नियम',
      step5Title: 'क्रॉस-चेक',
      step5Desc: 'नावाची तुलना',
      step6Title: 'दुरुस्ती',
      step6Desc: 'लहान/बदला',
      step7Title: 'पुनः तपासणी',
      step7Desc: 'गुण पुन्हा मोजा',
      step8Title: 'सज्ज',
      step8Desc: 'अंतिम केस अहवाल',

      sec3Tag: 'विभाग 03 // स्वयंचलित इनजेशन',
      sec3Title: 'स्मार्ट दस्तऐवज वर्गीकरण',
      beforeLabel: 'पूर्वी: असंघटित फाइल्स',
      afterLabel: 'नंतर: स्वयंचलित वर्गीकरण',
      aiExamination: '↓ AI विश्लेषण ↓',
      afterCat1: 'ओळख श्रेणी',
      afterCat1Docs: 'आधार कार्ड • पॅन कार्ड • पासपोर्ट',
      afterCat2: 'पत्ता पुरावा',
      afterCat2Docs: 'वीज बिल • बँक स्टेटमेंट',
      afterCat3: 'व्यवसाय व वैयक्तिक',
      afterCat3Docs: 'जीएसटी प्रमाणपत्र • पासपोर्ट फोटो',

      sec4Tag: 'विभाग 04 // क्रॉस-डॉक्युमेंट विश्लेषण',
      sec4Title: 'दस्तऐवजांची परस्पर तुलना',
      caseFinding: 'केस निष्कर्ष: नावामध्ये संभाव्य तफावत',
      viewMatrix: 'मॅट्रिक्स पहा →',

      sec5Tag: 'विभाग 05 // एकात्मिक निवारण',
      sec5Title: 'फक्त त्रुटी दाखवू नका, दुरुस्त करा.',
      stepDetect: '01 ओळखा',
      stepDetectDesc: 'फाईल आकार मर्यादेपेक्षा जास्त आहे',
      stepWhy: '02 का?',
      stepWhyDesc: 'पोर्टल 10 MB पर्यंत मर्यादा ठेवते',
      stepAction: '03 कृती',
      stepActionDesc: 'पीडीएफ कॉम्प्रेस करा',
      stepTool: '04 टूल',
      stepToolDesc: '"COMPRESS NOW" वर क्लिक करा',
      stepRecheck: '05 पुनः तपासणी',
      stepRecheckDesc: 'सादर करण्यासाठी सज्ज ✓',

      ctaEyebrow: 'आत्मविश्वासाने अर्ज सादर करा',
      ctaTitle: 'अर्ज सादर करण्यापूर्वी खात्री करा.',
      ctaSubtitle: 'अनावश्यक विलंब आणि नाकारलेले अर्ज टाळा. आताच तुमच्या दस्तऐवजांची तपासणी करा.',
      startVerificationBtn: 'सत्यापन सुरू करा',
      launchDemoBtn: 'डेमो सुरू करा',
    },
    setup: {
      tag: 'अर्ज प्रोफाइल निवड',
      title: 'अर्जाचा प्रकार निवडा',
      subtitle: 'आपण सादर करणार असलेला अधिकृत अर्ज निवडा. डॉ. डॉक योग्य नियम आणि निकष लोड करेल.',
      selectPrompt: 'उपलब्ध अर्ज प्रोफाइल',
      requiredDocsLabel: 'आवश्यक दस्तऐवज संच:',
      startCheckup: 'या अर्जासाठी तपासणी सुरू करा →',
      customProfile: 'सामान्य दस्तऐवज ऑडिट (सामान्य नियम)',
      defaultForensics: 'डिफॉल्ट फॉरेन्सिक्स',
      selected: 'निवडले',
      portalMaxLimit: 'पोर्टल कमाल फाईल मर्यादा',
      activeProfileChecklist: 'सक्रिय प्रोफाइल चेकलिस्ट',
      requirements: 'आवश्यकता',
      mandatory: 'अनिवार्य',
    },
    inbox: {
      tag: 'दस्तऐवज संकलन डेस्क',
      title: 'दस्तऐवज इनबॉक्स',
      subtitle: 'अर्जासाठीचे सर्व दस्तऐवज अपलोड करा. डॉ. डॉक प्रत्येक फाईलचे स्वयंचलित विश्लेषण करतो.',
      uploadBoxTitle: 'तुमच्या फाइल्स येथे ड्रॅग आणि ड्रॉप करा',
      uploadBoxSubtitle: 'प्रत्येक 25MB पर्यंत PDF, PNG, JPG फाइल्सना सपोर्ट करते (20 फाइल्सपर्यंत)',
      uploadedDocsTitle: 'अपलोड केलेले दस्तऐवज',
      noDocsMessage: 'अद्याप कोणतेही दस्तऐवज अपलोड केलेले नाहीत. फाइल्स ड्रॅग करा किंवा निवडण्यासाठी क्लिक करा.',
      filterAll: 'सर्व दस्तऐवज',
      filterIdentity: 'ओळख पुरावा',
      filterAddress: 'पत्ता पुरावा',
      filterBusiness: 'व्यवसाय व इतर',
      selectAll: 'सर्व निवडा',
      clearSelection: 'निवड साफ़ करा',
      mergeSelected: 'निवडलेल्या फाइल्स PDF मध्ये एकत्र करा',
      downloadBundle: 'एकत्रित PDF डाउनलोड करा',
      formatModalTitle: 'दस्तऐवज डाउनलोड करा',
      selectFormat: 'निर्यात स्वरूप निवडा',
    },
    ocr: {
      tag: 'ऑप्टिकल कॅरेक्टर रिकग्निशन',
      title: 'ओसीआर आणि मजकूर काढणे',
      subtitle: 'अपलोड केलेल्या कागदपत्रांमधून काढलेल्या माहितीची पाहणी करा.',
      selectDocPrompt: 'ओसीआर पाहण्यासाठी दस्तऐवज निवडा',
      extractedFields: 'काढलेली महत्त्वाची माहिती',
      confidenceScore: 'ओसीआर अचूकता गुण',
      rawText: 'मूळ मजकूर सामग्री',
      copyText: 'मजकूर कॉपी करा',
      copied: 'क्लिपबोर्डवर कॉपी झाले ✓',
      photoAgingAudit: 'फोटो आणि वय ऑडिट',
      estimatedPhotoAge: 'अंदाजे फोटो वय:',
      dobCalculatedAge: 'जन्मतारखेनुसार वय:',
    },
    quality: {
      tag: 'दस्तऐवज अखंडता व गुणवत्ता',
      title: 'गुणवत्ता तपासणी',
      subtitle: 'इमेज रिझोल्यूशन, स्पष्टता, फाईल आकार मर्यादा आणि वाचनीयतेची तपासणी.',
      overallQuality: 'एकूण गुणवत्ता गुण',
      clarityScore: 'मजकूर वाचनीयता गुण',
      resolutionScore: 'डीपीआय आणि रिझोल्यूशन तपासणी',
      fileSizeCheck: 'फाईल आकार मर्यादा तपासणी',
      legibility: 'वाचनीयता स्थिती',
      fixQualityBtn: 'टूल्समध्ये दुरुस्त करा →',
      qualityCompliant: 'गुणवत्ता सुसंगत',
      sharpness: 'स्पष्टता (Sharpness)',
      textVisibility: 'मजकूर दृश्यमानता',
      lighting: 'प्रकाश / प्रकाशयोजना',
      cropping: 'क्रॉपिंग आणि संरेखन',
      forensicRecommendation: 'फॉरेन्सिक शिफारस:',
      passAllThresholds: 'सर्व फॉरेन्सिक गुणवत्ता निकष पडताळणी मर्यादा पूर्ण करतात.',
    },
    verification: {
      tag: 'दस्तऐवज पडताळणी व अनुपालन',
      title: 'अर्ज पूर्णता स्थिती',
      subtitlePrefix: 'अर्ज:',
      readinessScoreLabel: 'अर्ज पूर्णता गुण',
      notEvaluatedText: 'मूल्यांकन झालेले नाही',
      uploadDocsPrompt: 'पूर्णता गुण मिळवण्यासाठी आवश्यक दस्तऐवज अपलोड करा.',
      analyzedDocsCount: 'कागदपत्रांचे विश्लेषण केले',
      verifiedCount: 'सत्यापित',
      reviewCount: 'पुनरावलोकन आवश्यक',
      missingCount: 'अनुपलब्ध',
      requiredDocsTitle: 'आवश्यक दस्तऐवज चेकलिस्ट',
      docsProvidedCount: 'दस्तऐवज उपलब्ध',
      summaryTitle: 'पडताळणी सारांश',
      validityMeter: 'दस्तऐवज वैधता',
      qualityMeter: 'दस्तऐवज गुणवत्ता',
      consistencyMeter: 'माहितीची सुसंगतता',
      completenessMeter: 'पूर्णता',
      issuesTitle: 'लक्ष देण्यासारख्या त्रुटी',
      noIssuesFound: '✓ कोणतीही त्रुटी आढळली नाही',
      noIssuesDesc: 'सर्व अपलोड केलेले दस्तऐवज अर्जाच्या नियमांनुसार आहेत.',
      reviewIssuesBtn: 'त्रुटींचे पुनरावलोकन करा',
      goFixWorkflowBtn: 'दुरुस्ती प्रक्रियेवर जा',
      viewReportBtn: 'पूर्ण सत्यापन अहवाल पहा →',
    },
    crossCheck: {
      tag: 'क्रॉस-डॉक्युमेंट फॉरेन्सिक विश्लेषण',
      title: 'दस्तऐवज तुलना',
      subtitle: 'सर्व कागदपत्रांमधील नाव, पत्ता, आयडी आणि तारखांची सुसंगतता तपासा.',
      matrixTitle: 'क्रॉस-डॉक्युमेंट फील्ड मॅट्रिक्स',
      consistencyScore: 'माहिती सुसंगतता गुण',
      mismatchDetected: 'तफावत आढळली ⚠',
      allMatch: 'सर्व माहिती जुळते ✓',
      fieldComparison: 'माहिती तुलना तपशील',
    },
    issues: {
      tag: 'दस्तऐवज ऑडिट निष्कर्ष',
      title: 'अर्जातील त्रुटी',
      subtitle: 'सादर करण्यापूर्वी सर्व त्रुटी आणि नावातील तफावत तपासा.',
      criticalTab: 'गंभीर',
      reviewTab: 'पुनरावलोकन आवश्यक',
      resolvedTab: 'दुरुस्त केलेल्या त्रुटी',
      noIssuesTitle: 'या विभागात कोणतीही त्रुटी नाही',
      resolveBtn: 'दुरुस्त झाल्याचे चिन्हांकित करा ✓',
      resolvedStatus: 'दुरुस्त झाले',
      whyFlagged: 'त्रुटीचे कारण:',
      suggestedFix: 'सुचवलेला उपाय:',
    },
    fix: {
      tag: 'एकात्मिक निवारण डेस्क',
      title: 'अर्ज दुरुस्त करा',
      subtitle: 'पीडीएफ कॉम्प्रेस करा, सुधारित दस्तऐवज अपलोड करा आणि तयारीची पुनरतपासणी करा.',
      step: 'पायरी',
      step1Title: '1. दुरुस्त करायची त्रुटी निवडा',
      step2Title: '2. टूल वापरून दुरुस्ती करा',
      step3Title: '3. अर्जाच्या पूर्णतेची पुनरतपासणी करा',
      compressPdfTool: 'पीडीएफ कॉम्प्रेस टूल',
      replaceDocTool: 'दस्तऐवज बदला',
      resolveIssuesBtn: 'दुरुस्ती लागू करा व पुनरतपासा',
      reEvaluateBtn: 'पूर्णता गुणांची पुनरतपासणी करा →',
    },
    tools: {
      tag: 'उपयुक्तता संच',
      title: 'दस्तऐवज टूल्स',
      subtitle: 'पीडीएफ कॉम्प्रेसर, इमेज शार्पनर आणि फॉरमॅट कन्व्हर्टर टूल्स.',
      compressorTitle: 'पीडीएफ फाईल कॉम्प्रेसर',
      compressorDesc: 'मोठ्या पीडीएफ फाइल्स पोर्टल मर्यादेनुसार (10MB पेक्षा कमी) लहान करा.',
      sharpenerTitle: 'इमेज स्पष्टता सुधारक',
      sharpenerDesc: 'अस्पष्ट स्कॅनसाठी स्पष्टता वाढवा.',
      converterTitle: 'इमेज टू पीडीएफ कन्व्हर्टर',
      converterDesc: 'फोटो स्कॅन स्वच्छ पीडीएफ फाइल्समध्ये बदला.',
      launchTool: 'टूल उघडा →',
      compressTab: 'पीडीएफ / इमेज कॉम्प्रेस करा',
      convertTab: 'JPG / PNG → PDF',
      formatTab: 'इमेज फॉरमॅट (WEBP/JPG/PNG)',
      txtPdfTab: 'TXT ↔ PDF',
      mergeTab: 'पीडीएफ एकत्र करा (Merge)',
      enhanceTab: 'वाचनीयता सुधारा',
      renameTab: 'फाईलचे नाव बदला',
      pickFromInbox: 'किंवा चालू केस इनबॉक्समधून निवडा',
      selectFiles: 'प्रक्रियेसाठी फाईल निवडा (कमाल 20 फाइल्स):',
      clickToSelect: 'तुमच्या कॉम्प्युटरवरून फाईल निवडण्यासाठी क्लिक करा',
      compressThreshold: 'लक्षित पोर्टल फाईल आकार मर्यादा (MB):',
      limit: 'मर्यादा',
      compressBtn: 'फाईल कॉम्प्रेस करा',
      compressSuccess: 'कॉम्प्रेशन यशस्वी!',
      beforeSize: 'आधीचा आकार:',
      afterSize: 'नंतरचा आकार:',
      reduction: 'कमी झाले:',
      smaller: 'लहान',
      readyForSub: '✓ सादर करण्यासाठी सज्ज',
      downloadCompressed: 'कॉम्प्रेस केलेली फाईल डाउनलोड करा',
      updateInCase: 'चालू केस फाईलमध्ये बदला',
      updatedInCase: 'केस फाईलमध्ये अपडेट केले ✓',
      convertDesc: 'PNG/JPG/WEBP फोटो निवडा. बॅकएंड इंजिन त्यांना बहु-पृष्ठ A4 पीडीएफमध्ये रूपांतरित करते.',
      convertBtn: 'PDF मध्ये बदला आणि डाउनलोड करा',
      formatDesc: 'लक्षित इमेज फॉरमॅट:',
      formatBtn: 'फॉरमॅट बदला आणि डाउनलोड करा',
      txtPdfTxtToPdf: 'TXT → PDF (मांडणी निर्मिती)',
      txtPdfPdfToTxt: 'PDF → TXT (मजकूर काढणे)',
      txtPdfBtn: 'पीडीएफ तयार करा',
      extractedTextOutput: 'काढलेला मजकूर आउटपुट:',
      mergeDesc: 'एकत्रित सादरीकरण पीडीएफ तयार करण्यासाठी पीडीएफ फाइल्स निवडा.',
      mergeBtn: 'पीडीएफ एकत्र करा आणि डाउनलोड करा',
      enhanceDesc: 'काळे डाग काढून अस्पष्ट मजकूर स्पष्ट करण्यासाठी हाय-कॉन्ट्रास्ट लागू करते.',
      enhanceBtn: 'कॉन्ट्रास्ट सुधारा आणि डाउनलोड करा',
      renameDesc: 'नवीन फाईल नाव:',
      newFilename: 'नवीन फाईल नाव:',
      renameBtn: 'पुनर्नामित फाईल डाउनलोड करा',
    },
    help: {
      tag: 'मदत केंद्र शोधक',
      title: 'जवळील मदत केंद्रे',
      subtitle: 'स्कॅनिंग आणि प्रतिज्ञापत्रासाठी तुमच्या जवळील अधिकृत सीएससी केंद्रे आणि सायबर कॅफे शोधा.',
      cscTitle: 'आपले सरकार / सीएससी केंद्रे (CSC)',
      cscDesc: 'शासकीय अर्ज सादरीकरण आणि दस्तऐवज सत्यापनासाठी अधिकृत केंद्रे.',
      cafeTitle: 'सत्यापित सायबर कॅफे',
      cafeDesc: 'हाय-स्पीड स्कॅनिंग आणि प्रिंटिंग केंद्रे.',
      notaryTitle: 'नोटरी व कायदेशीर सल्लागार',
      notaryDesc: 'स्टॅम्प पेपर, प्रतिज्ञापत्र आणि नोटरी सेवा.',
      findNearestBtn: 'जवळची केंद्रे शोधा',
      distance: 'अंतर',
      directions: 'मार्ग शोधा',
      useGps: 'सध्याचे जीपीएस स्थान वापरा',
      locating: 'स्थान शोधत आहे...',
      servicesOffered: 'प्रदान केलेल्या सेवा:',
    },
    report: {
      tag: 'अधिकृत सारांश विवरण',
      title: 'अंतिम पडताळणी अहवाल',
      subtitle: 'तुमच्या अर्जासाठी सर्वसमावेशक ऑडिट अहवाल आणि डिजिटल प्रमाणपत्र.',
      printReportBtn: 'प्रमाणपत्र प्रिंट करा',
      exportPdfBtn: 'एकत्रित पीडीएफ निर्यात करा',
      auditSummary: 'दस्तऐवज ऑडिट सारांश',
      decisionStatus: 'अर्ज निर्णय स्थिती',
      finalStatement: 'अंतिम मूल्यमापन विधान',
      tableType: 'वर्गीकृत प्रकार',
      tableCredentials: 'काढलेले तपशील',
      tablePhotoAudit: 'फोटो ऑडिट',
      tableQuality: 'गुणवत्ता',
      tableStatus: 'स्थिती',
      submissionPackage: 'पूर्ण सबमिशन संच',
      consolidatedPdfTitle: 'एकत्रित मुख्य अर्ज पीडीएफ (Master PDF)',
      consolidatedPdfDesc: 'सर्व सत्यापित केस दस्तऐवज एका एकीकृत, पृष्ठक्रमांकित A4 मास्टर पीडीएफमध्ये जोडतो.',
      downloadConsolidatedPdf: 'एकत्रित पीडीएफ बंडल डाउनलोड करा',
      individualExportsTitle: 'वैयक्तिक वर्गीकृत दस्तऐवज निर्यात',
      individualExportsDesc: 'तुमच्या आवडीच्या फॉरमॅटमध्ये (PDF, PNG, JPG, WEBP) मानकीकृत फाईल नावासह वैयक्तिक दस्तऐवज डाउनलोड करा.',
      exportAsFormat: 'या फॉरमॅटमध्ये निर्यात करा',
      chooseExportFormat: 'निर्यात फॉरमॅट निवडा:',
      downloadAs: 'या स्वरूपात डाउनलोड करा:',
      authorizedSignature: 'अधिकृत डिजिटल स्वाक्षरी',
    },
  },
};
