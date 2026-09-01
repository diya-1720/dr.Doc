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
  };

  // HomePage
  home: {
    heroTag: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroSubtitle: string;
    startCheckupBtn: string;
    exploreDemoBtn: string;
    stat1Title: string;
    stat1Desc: string;
    stat2Title: string;
    stat2Desc: string;
    stat3Title: string;
    stat3Desc: string;
    evidenceDesk: string;
    liveAnalysisBoard: string;
    readinessScore: string;
    
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

    sec3Tag: string;
    sec3Title: string;
    beforeLabel: string;
    afterLabel: string;

    sec4Tag: string;
    sec4Title: string;
    caseFinding: string;
    viewMatrix: string;

    sec5Tag: string;
    sec5Title: string;

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
    },
    home: {
      heroTag: 'DR. DOC • DOCUMENT INTELLIGENCE',
      heroTitleLine1: 'YOUR DOCUMENTS.',
      heroTitleLine2: 'UNDER EXAMINATION.',
      heroSubtitle: 'Upload your documents. Dr. Doc identifies, extracts, verifies and cross-checks them before submission. No rejected applications due to missing files or name mismatches.',
      startCheckupBtn: 'START A DOCUMENT CHECKUP',
      exploreDemoBtn: 'EXPLORE HOW IT WORKS',
      stat1Title: '100% AUTOMATED',
      stat1Desc: 'Multi-Doc Classification',
      stat2Title: 'CROSS-DOCUMENT',
      stat2Desc: 'Inconsistency Detection',
      stat3Title: 'IN-LINE FIX',
      stat3Desc: 'Compression & Tools',
      evidenceDesk: 'EVIDENCE DESK',
      liveAnalysisBoard: 'LIVE ANALYSIS BOARD',
      readinessScore: 'READINESS SCORE',
      
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

      sec3Tag: 'SECTION 03 // AUTOMATED INGESTION',
      sec3Title: 'SMART DOCUMENT CLASSIFICATION',
      beforeLabel: 'BEFORE: UNORGANIZED FILES',
      afterLabel: 'AFTER: AUTOMATIC CATEGORIZATION',

      sec4Tag: 'SECTION 04 // CROSS-DOCUMENT REASONING',
      sec4Title: 'CROSS-DOCUMENT INTELLIGENCE',
      caseFinding: 'CASE FINDING: POSSIBLE NAME MISMATCH',
      viewMatrix: 'VIEW RELATIONSHIP MATRIX →',

      sec5Tag: 'SECTION 05 // INTEGRATED RESOLUTION',
      sec5Title: "FIX, DON'T JUST FLAG.",

      ctaEyebrow: 'CONFIDENT APPLICATION SUBMISSION',
      ctaTitle: 'READY BEFORE YOU SUBMIT.',
      ctaSubtitle: 'Avoid costly delays, rejected business registrations, and manual document re-submissions. Perform a document checkup right now.',
      startVerificationBtn: 'START VERIFICATION',
      launchDemoBtn: 'LAUNCH DEMO',
    },
    setup: {
      tag: 'APPLICATION PROFILE SELECTION',
      title: 'SELECT APPLICATION TYPE',
      subtitle: 'Choose the official application you are preparing to submit. Dr. Doc will load the exact document rules and verification criteria.',
      selectPrompt: 'AVAILABLE APPLICATION PROFILES',
      requiredDocsLabel: 'REQUIRED DOCUMENTS BUNDLE:',
      startCheckup: 'START CHECKUP FOR THIS APPLICATION →',
      customProfile: 'General Document Audit (Default Rules)',
    },
    inbox: {
      tag: 'DOCUMENT INGESTION DESK',
      title: 'DOCUMENT INBOX',
      subtitle: 'Upload all documents for your application. Dr. Doc automatically classifies and analyzes each file.',
      uploadBoxTitle: 'DRAG & DROP APPLICATION FILES HERE',
      uploadBoxSubtitle: 'Supports PDF, PNG, JPG files up to 25MB each',
      uploadedDocsTitle: 'INGESTED DOCUMENTS',
      noDocsMessage: 'No documents uploaded yet. Drag files above or click to select.',
      filterAll: 'ALL DOCUMENTS',
      filterIdentity: 'IDENTITY PROOF',
      filterAddress: 'ADDRESS PROOF',
      filterBusiness: 'BUSINESS & OTHER',
    },
    ocr: {
      tag: 'OPTICAL CHARACTER RECOGNITION',
      title: 'OCR & TEXT EXTRACTION',
      subtitle: 'Review extracted structured key fields and text parsed from your uploaded documents.',
      selectDocPrompt: 'Select a document to inspect OCR extraction',
      extractedFields: 'EXTRACTED KEY-VALUE FIELDS',
      confidenceScore: 'OCR CONFIDENCE SCORE',
      rawText: 'RAW PARSED TEXT CONTENT',
      copyText: 'COPY EXTRACTED TEXT',
      copied: 'COPIED TO CLIPBOARD ✓',
    },
    quality: {
      tag: 'DOCUMENT INTEGRITY & QUALITY',
      title: 'QUALITY CHECK',
      subtitle: 'Inspection of image resolution, clarity, file size limits, and document legibility.',
      overallQuality: 'OVERALL QUALITY SCORE',
      clarityScore: 'Text Readability Score',
      resolutionScore: 'DPI & Resolution Check',
      fileSizeCheck: 'File Size Limit Check',
      legibility: 'Legibility Status',
      fixQualityBtn: 'FIX IN QUALITY TOOLS →',
    },
    verification: {
      tag: 'DOCUMENT VERIFICATION',
      title: 'APPLICATION READINESS',
      subtitlePrefix: 'Application:',
      readinessScoreLabel: 'APPLICATION READINESS SCORE',
      notEvaluatedText: 'NOT EVALUATED',
      uploadDocsPrompt: 'Upload your required documents to calculate application readiness.',
      analyzedDocsCount: 'documents analyzed',
      verifiedCount: 'verified',
      reviewCount: 'needs review',
      missingCount: 'missing',
      requiredDocsTitle: 'REQUIRED DOCUMENTS',
      docsProvidedCount: 'DOCUMENTS PROVIDED',
      summaryTitle: 'VERIFICATION SUMMARY',
      validityMeter: 'Document Validity',
      qualityMeter: 'Document Quality',
      consistencyMeter: 'Info Consistency',
      completenessMeter: 'Completeness',
      issuesTitle: 'ISSUES REQUIRING ATTENTION',
      noIssuesFound: '✓ NO ISSUES FOUND',
      noIssuesDesc: 'All uploaded documents comply with application rules and requirements.',
      reviewIssuesBtn: 'REVIEW ISSUES',
      goFixWorkflowBtn: 'GO TO FIX APPLICATION WORKFLOW',
      viewReportBtn: 'VIEW FULL VERIFICATION REPORT →',
    },
    crossCheck: {
      tag: 'CROSS-DOCUMENT ANALYSIS',
      title: 'EVIDENCE CROSS-CHECK',
      subtitle: 'Comparative matrix validating consistency across names, addresses, IDs, and dates across all uploaded documents.',
      matrixTitle: 'CROSS-DOCUMENT FIELD MATRIX',
      consistencyScore: 'FIELD CONSISTENCY SCORE',
      mismatchDetected: 'INCONSISTENCY DETECTED ⚠',
      allMatch: 'ALL KEY FIELDS MATCH ✓',
      fieldComparison: 'FIELD COMPARISON DETAILS',
    },
    issues: {
      tag: 'DOCUMENT AUDIT FINDINGS',
      title: 'APPLICATION ISSUES',
      subtitle: 'Review all flagged errors, missing requirements, and name mismatches before submission.',
      criticalTab: 'CRITICAL ERRORS',
      reviewTab: 'NEEDS REVIEW',
      resolvedTab: 'RESOLVED ISSUES',
      noIssuesTitle: 'NO ISSUES IN THIS CATEGORY',
      resolveBtn: 'MARK AS RESOLVED ✓',
      resolvedStatus: 'RESOLVED',
      whyFlagged: 'Why Flagged:',
      suggestedFix: 'Suggested Fix:',
    },
    fix: {
      tag: 'INTEGRATED RESOLUTION DESK',
      title: 'FIX APPLICATION',
      subtitle: 'In-line tools to compress oversized PDFs, re-upload corrected documents, and re-evaluate readiness.',
      step1Title: '1. SELECT ISSUE TO RESOLVE',
      step2Title: '2. APPLY BUILT-IN FIX TOOL',
      step3Title: '3. RE-EVALUATE APPLICATION READINESS',
      compressPdfTool: 'COMPRESS PDF TOOL',
      replaceDocTool: 'REPLACE CORRUPTED DOCUMENT',
      resolveIssuesBtn: 'APPLY FIX & RECHECK',
      reEvaluateBtn: 'RE-EVALUATE READINESS SCORE →',
    },
    tools: {
      tag: 'UTILITY SUITE',
      title: 'DOCUMENT TOOLS',
      subtitle: 'Standalone client-side document processing tools: PDF compressor, image sharpener, format converter.',
      compressorTitle: 'PDF FILE COMPRESSOR',
      compressorDesc: 'Reduce large PDF files below portal size limits (e.g. < 10MB) directly in browser.',
      sharpenerTitle: 'IMAGE CLARITY ENHANCER',
      sharpenerDesc: 'Enhance contrast and sharpness for blurry scan uploads.',
      converterTitle: 'IMAGE TO PDF CONVERTER',
      converterDesc: 'Convert JPG / PNG photo scans into clean, formatted single-page PDF files.',
      launchTool: 'OPEN TOOL →',
    },
    help: {
      tag: 'PHYSICAL ASSISTANCE LOCATOR',
      title: 'NEARBY HELP CENTERS',
      subtitle: 'Find authorized CSC Seva Kendras, cyber cafes, and notary offices near you for scanning & affidavit support.',
      cscTitle: 'Common Service Centers (CSC)',
      cscDesc: 'Government authorized Kendras for portal submissions and document verification.',
      cafeTitle: 'Verified Cyber Cafes',
      cafeDesc: 'Local high-speed scanning and printing hubs.',
      notaryTitle: 'Notary & Legal Advocates',
      notaryDesc: 'Stamp paper, affidavits, and notary attestation services.',
      findNearestBtn: 'FIND NEAREST CENTERS',
      distance: 'Distance',
      directions: 'Get Directions',
    },
    report: {
      tag: 'OFFICIAL SUMMARY STATEMENT',
      title: 'FINAL VERIFICATION REPORT',
      subtitle: 'Comprehensive readiness audit report for your application package.',
      printReportBtn: 'PRINT AUDIT REPORT',
      exportPdfBtn: 'EXPORT AS PDF',
      auditSummary: 'AUDIT SUMMARY FINDINGS',
      decisionStatus: 'APPLICATION READINESS DECISION',
      finalStatement: 'FINAL EVALUATION STATEMENT',
    },
  },
  hi: {
    nav: {
      home: 'मुख्य पृष्ठ',
      verify: 'जाँच करें',
      documents: 'दस्तावेज़',
      ocr: 'ओसीआर',
      quality: 'गुणवत्ता जाँच',
      verification: 'सत्यापन',
      crossCheck: 'क्रॉस-चेक',
      issues: 'समस्याएं',
      fix: 'आवेदन ठीक करें',
      tools: 'टूल्स',
      help: 'नजदीकी सहायता',
      report: 'अंतिम रिपोर्ट',
      tryDemo: 'डेमो देखें',
      startCheckup: 'जाँच शुरू करें',
      activeApplication: 'सक्रिय आवेदन',
      selectLanguage: 'भाषा',
      menu: 'मेनू',
      closeMenu: 'बंद करें',
    },
    header: {
      tagline: 'डॉ. डॉक',
      descriptor: 'दस्तावेज़ बुद्धिमत्ता',
    },
    footer: {
      tagline: 'डॉ. डॉक — बुद्धिमान दस्तावेज़ सत्यापन प्लेटफ़ॉर्म',
      philosophyTitle: 'हमारा सिद्धांत',
      philosophyText: 'कागज़ी कार्रवाई कभी भी आवेदन खारिज होने का कारण नहीं बननी चाहिए। डॉ. डॉक सबमिशन से पहले दस्तावेज़ों की जाँच, सत्यापन और सुधार करता है।',
      systemStatus: 'सिस्टम स्थिति',
      allSystemsOperational: 'सभी सत्यापन इंजन सक्रिय हैं',
      copyright: '© 2026 डॉ. डॉक। सर्वाधिकार सुरक्षित।',
      privacy: 'गोपनीयता नीति',
      terms: 'सेवा की शर्तें',
      security: 'सुरक्षा वास्तुकला',
    },
    common: {
      verified: 'सत्यापित',
      needsReview: 'समीक्षा आवश्यक',
      missing: 'अनुपलब्ध',
      critical: 'गंभीर त्रुटि',
      actionRequired: 'कार्रवाई आवश्यक',
      readyForSubmission: 'सबमिशन के लिए तैयार',
      notEvaluated: 'मूल्यांकन नहीं हुआ',
      upload: 'अपलोड करें',
      view: 'देखें',
      download: 'डाउनलोड',
      delete: 'हटाएं',
      fix: 'ठीक करें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      confirm: 'पुष्टि करें',
      back: 'पीछे',
      next: 'आगे',
      search: 'खोजें...',
      filter: 'फ़िल्टर',
      all: 'सभी',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि हुई',
      success: 'सफल',
    },
    home: {
      heroTag: 'डॉ. डॉक • दस्तावेज़ बुद्धिमत्ता',
      heroTitleLine1: 'आपके दस्तावेज़।',
      heroTitleLine2: 'सघन जाँच के अधीन।',
      heroSubtitle: 'अपने दस्तावेज़ अपलोड करें। डॉ. डॉक सबमिशन से पहले उन्हें पहचानता है, निकालता है, सत्यापित करता है और तुलना करता है। अब नाम में अंतर या लापता फाइलों के कारण आवेदन खारिज नहीं होगा।',
      startCheckupBtn: 'दस्तावेज़ की जाँच शुरू करें',
      exploreDemoBtn: 'यह कैसे काम करता है देखें',
      stat1Title: '100% स्वचालित',
      stat1Desc: 'बहु-दस्तावेज़ वर्गीकरण',
      stat2Title: 'क्रॉस-डॉक्यूमेंट',
      stat2Desc: 'असंगति पहचान तंत्र',
      stat3Title: 'इन-लाइन सुधार',
      stat3Desc: 'कम्प्रेशन और टूल्स',
      evidenceDesk: 'साक्ष्य डेस्क',
      liveAnalysisBoard: 'लाइव विश्लेषण बोर्ड',
      readinessScore: 'तैयारी स्कोर',
      
      sec1Tag: 'अनुभाग 01 // केस स्टडी',
      sec1Title: 'कागज़ी कार्रवाई के कारण आवेदन खारिज नहीं होना चाहिए।',
      evidence1Title: 'लापता दस्तावेज़',
      evidence1Desc: 'जब एक आवश्यक पीडीएफ या जीएसटी प्रमाणपत्र छूट जाता है तो पोर्टल तुरंत आवेदन खारिज कर देते हैं। डॉ. डॉक सटीक आवेदन प्रोफाइल के आधार पर पूर्णता की जाँच करता है।',
      evidence2Title: 'नाम में असंगति',
      evidence2Desc: 'पैन और बैंक स्टेटमेंट में "Rahul Kumar" बनाम "R. Kumar" के कारण देरी और अस्वीकृति होती है। डॉ. डॉक सबमिशन से पहले इस असंगति को चिन्हित करता है।',
      evidence3Title: 'खराब / निम्न-गुणवत्ता फ़ाइल',
      evidence3Desc: 'धुंधले स्कैन या 10MB सीमा से बड़ी फाइलें। डॉ. डॉक टेक्स्ट दृश्यता की जाँच करता है और उन्हें तुरंत ठीक करने के लिए इन-बिल्ट टूल प्रदान करता है।',

      sec2Tag: 'अनुभाग 02 // परीक्षण कार्यप्रणाली',
      sec2Title: 'डॉ. डॉक कैसे काम करता है',

      sec3Tag: 'अनुभाग 03 // स्वचालित इनजेशन',
      sec3Title: 'स्मार्ट दस्तावेज़ वर्गीकरण',
      beforeLabel: 'पहले: असंगठित फाइलें',
      afterLabel: 'बाद में: स्वचालित श्रेणीबद्धता',

      sec4Tag: 'अनुभाग 04 // क्रॉस-डॉक्यूमेंट विश्लेषण',
      sec4Title: 'दस्तावेज़ों की परस्पर तुलना',
      caseFinding: 'केस निष्कर्ष: नाम में संभावित असंगति',
      viewMatrix: 'संबद्धता मैट्रिक्स देखें →',

      sec5Tag: 'अनुभाग 05 // एकीकृत समाधान',
      sec5Title: 'केवल फ्लैग न करें, ठीक भी करें।',

      ctaEyebrow: 'विश्वसनीय आवेदन सबमिशन',
      ctaTitle: 'सबमिट करने से पहले आश्वस्त रहें।',
      ctaSubtitle: 'महंगे विलंब और खारिज आवेदनों से बचें। अभी अपने दस्तावेज़ों की जाँच करें।',
      startVerificationBtn: 'सत्यापन शुरू करें',
      launchDemoBtn: 'डेमो चलाएं',
    },
    setup: {
      tag: 'आवेदन प्रोफ़ाइल चयन',
      title: 'आवेदन का प्रकार चुनें',
      subtitle: 'वह आधिकारिक आवेदन चुनें जिसे आप जमा करने की तैयारी कर रहे हैं। डॉ. डॉक सटीक नियम लोड करेगा।',
      selectPrompt: 'उपलब्ध आवेदन प्रोफ़ाइल',
      requiredDocsLabel: 'आवश्यक दस्तावेज़ बंडल:',
      startCheckup: 'इस आवेदन की जाँच शुरू करें →',
      customProfile: 'सामान्य दस्तावेज़ ऑडिट (सामान्य नियम)',
    },
    inbox: {
      tag: 'दस्तावेज़ प्राप्ति डेस्क',
      title: 'दस्तावेज़ इनबॉक्स',
      subtitle: 'अपने आवेदन के सभी दस्तावेज़ अपलोड करें। डॉ. डॉक स्वचालित रूप से प्रत्येक फ़ाइल का विश्लेषण करता है।',
      uploadBoxTitle: 'अपनी फ़ाइलें यहाँ ड्रैग और ड्रॉप करें',
      uploadBoxSubtitle: 'प्रत्येक 25MB तक पीडीएफ, पीएनजी, जेपीजी फाइलों का समर्थन करता है',
      uploadedDocsTitle: 'अपलोड किए गए दस्तावेज़',
      noDocsMessage: 'अभी तक कोई दस्तावेज़ अपलोड नहीं हुआ है। फ़ाइलें ड्रैग करें या चुनने के लिए क्लिक करें।',
      filterAll: 'सभी दस्तावेज़',
      filterIdentity: 'पहचान पत्र',
      filterAddress: 'पता प्रमाण',
      filterBusiness: 'व्यवसाय व अन्य',
    },
    ocr: {
      tag: 'ऑप्टिकल कैरेक्टर रिकॉग्निशन',
      title: 'ओसीआर और टेक्स्ट निष्कर्षण',
      subtitle: 'अपलोड किए गए दस्तावेज़ों से निकाले गए टेक्स्ट और फ़ील्ड्स की समीक्षा करें।',
      selectDocPrompt: 'ओसीआर देखने के लिए एक दस्तावेज़ चुनें',
      extractedFields: 'निकाले गए मुख्य फ़ील्ड्स',
      confidenceScore: 'ओसीआर सटीकता स्कोर',
      rawText: 'मूल टेक्स्ट सामग्री',
      copyText: 'टेक्स्ट कॉपी करें',
      copied: 'क्लिपबोर्ड पर कॉपी हो गया ✓',
    },
    quality: {
      tag: 'दस्तावेज़ अखंडता व गुणवत्ता',
      title: 'गुणवत्ता जाँच',
      subtitle: 'छवि रिज़ॉल्यूशन, स्पष्टता, फ़ाइल आकार सीमा और पठनीयता की जाँच।',
      overallQuality: 'कुल गुणवत्ता स्कोर',
      clarityScore: 'पाठ पठनीयता स्कोर',
      resolutionScore: 'डीपीआई और रिज़ॉल्यूशन जाँच',
      fileSizeCheck: 'फ़ाइल आकार सीमा जाँच',
      legibility: 'पठनीयता स्थिति',
      fixQualityBtn: 'क्वालिटी टूल्स में ठीक करें →',
    },
    verification: {
      tag: 'दस्तावेज़ सत्यापन',
      title: 'आवेदन तत्परता',
      subtitlePrefix: 'आवेदन:',
      readinessScoreLabel: 'आवेदन तत्परता स्कोर',
      notEvaluatedText: 'मूल्यांकन नहीं हुआ',
      uploadDocsPrompt: 'आवेदन तत्परता की गणना करने के लिए अपने आवश्यक दस्तावेज़ अपलोड करें।',
      analyzedDocsCount: 'दस्तावेज़ों का विश्लेषण हुआ',
      verifiedCount: 'सत्यापित',
      reviewCount: 'समीक्षा आवश्यक',
      missingCount: 'अनुपलब्ध',
      requiredDocsTitle: 'आवश्यक दस्तावेज़',
      docsProvidedCount: 'दस्तावेज़ उपलब्ध कराए गए',
      summaryTitle: 'सत्यापन सारांश',
      validityMeter: 'दस्तावेज़ वैधता',
      qualityMeter: 'दस्तावेज़ गुणवत्ता',
      consistencyMeter: 'जानकारी की सुसंगतता',
      completenessMeter: 'पूर्णता',
      issuesTitle: 'ध्यान देने योग्य समस्याएं',
      noIssuesFound: '✓ कोई समस्या नहीं मिली',
      noIssuesDesc: 'सभी अपलोड किए गए दस्तावेज़ आवेदन के नियमों का अनुपालन करते हैं।',
      reviewIssuesBtn: 'समस्याओं की समीक्षा करें',
      goFixWorkflowBtn: 'सुधार कार्यप्रवाह पर जाएं',
      viewReportBtn: 'पूर्ण सत्यापन रिपोर्ट देखें →',
    },
    crossCheck: {
      tag: 'क्रॉस-डॉक्यूमेंट विश्लेषण',
      title: 'दस्तावेज़ों की परस्पर तुलना',
      subtitle: 'सभी दस्तावेज़ों के बीच नाम, पते, आईडी और तिथियों की सुसंगतता जाँचें।',
      matrixTitle: 'क्रॉस-डॉक्यूमेंट फ़ील्ड मैट्रिक्स',
      consistencyScore: 'फ़ील्ड सुसंगतता स्कोर',
      mismatchDetected: 'असंगति पाई गई ⚠',
      allMatch: 'सभी मुख्य फ़ील्ड्स मेल खाते हैं ✓',
      fieldComparison: 'फ़ील्ड तुलना विवरण',
    },
    issues: {
      tag: 'दस्तावेज़ ऑडिट निष्कर्ष',
      title: 'आवेदन की समस्याएं',
      subtitle: 'सबमिशन से पहले सभी त्रुटियों, लापता आवश्यकताओं और नाम की असंगतियों की समीक्षा करें।',
      criticalTab: 'गंभीर त्रुटियां',
      reviewTab: 'समीक्षा आवश्यक',
      resolvedTab: 'हल की गई समस्याएं',
      noIssuesTitle: 'इस श्रेणी में कोई समस्या नहीं है',
      resolveBtn: 'हल किया गया चिह्नित करें ✓',
      resolvedStatus: 'हल किया गया',
      whyFlagged: 'अस्वीकृति का कारण:',
      suggestedFix: 'सुझाया गया समाधान:',
    },
    fix: {
      tag: 'एकीकृत समाधान डेस्क',
      title: 'आवेदन ठीक करें',
      subtitle: 'बड़ी पीडीएफ को कम्प्रेस करने, संशोधित दस्तावेज़ अपलोड करने और तैयारी का पुनर्मूल्यांकन करने के टूल्स।',
      step1Title: '1. हल की जाने वाली समस्या चुनें',
      step2Title: '2. इन-बिल्ट सुधार टूल लागू करें',
      step3Title: '3. आवेदन तत्परता का पुनर्मूल्यांकन करें',
      compressPdfTool: 'पीडीएफ कम्प्रेस टूल',
      replaceDocTool: 'दस्तावेज़ बदलें',
      resolveIssuesBtn: 'सुधार लागू करें व पुन: जाँचें',
      reEvaluateBtn: 'तत्परता स्कोर का पुनर्मूल्यांकन करें →',
    },
    tools: {
      tag: 'उपयोगिता सूट',
      title: 'दस्तावेज़ टूल्स',
      subtitle: 'पीडीएफ कम्प्रेसर, इमेज शार्पनर और फॉरमैट कनवर्टर जैसे स्वतंत्र टूल्स।',
      compressorTitle: 'पीडीएफ फ़ाइल कम्प्रेसर',
      compressorDesc: 'बड़ी पीडीएफ फाइलों को पोर्टल सीमा (10MB से कम) के नीचे लाएं।',
      sharpenerTitle: 'छवि स्पष्टता सुधारक',
      sharpenerDesc: 'धुंधले स्कैन के लिए कंट्रास्ट और स्पष्टता बढ़ाएं।',
      converterTitle: 'छवि से पीडीएफ कनवर्टर',
      converterDesc: 'फोटो स्कैन को साफ पीडीएफ फाइलों में बदलें।',
      launchTool: 'टूल खोलें →',
    },
    help: {
      tag: 'भौतिक सहायता केंद्र',
      title: 'नजदीकी सहायता केंद्र',
      subtitle: 'स्कैनिंग और हलफनामा सहायता के लिए अपने निकटतम अधिकृत सीएससी केंद्र और साइबर कैफे खोजें।',
      cscTitle: 'जन सेवा केंद्र (CSC)',
      cscDesc: 'सरकारी सबमिशन और दस्तावेज़ सत्यापन के लिए अधिकृत केंद्र।',
      cafeTitle: 'सत्यापित साइबर कैफे',
      cafeDesc: 'हाई-स्पीड स्कैनिंग और प्रिंटिंग केंद्र।',
      notaryTitle: 'नोटरी व कानूनी सलाहकार',
      notaryDesc: 'स्टाम्प पेपर, हलफनामा और नोटरी सत्यापन सेवाएं।',
      findNearestBtn: 'निकटतम केंद्र खोजें',
      distance: 'दूरी',
      directions: 'दिशा-निर्देश प्राप्त करें',
    },
    report: {
      tag: 'आधिकारिक सारांश विवरण',
      title: 'अंतिम सत्यापन रिपोर्ट',
      subtitle: 'आपके आवेदन पैकेज के लिए व्यापक ऑडिट रिपोर्ट।',
      printReportBtn: 'रिपोर्ट प्रिंट करें',
      exportPdfBtn: 'पीडीएफ निर्यात करें',
      auditSummary: 'ऑडिट सारांश निष्कर्ष',
      decisionStatus: 'आवेदन तत्परता निर्णय',
      finalStatement: 'अंतिम मूल्यांकन विवरण',
    },
  },
  mr: {
    nav: {
      home: 'मुख्यपृष्ठ',
      verify: 'तपासा',
      documents: 'दस्तऐवज',
      ocr: 'ओसीआर',
      quality: 'गुणवत्ता तपासणी',
      verification: 'सत्यापन',
      crossCheck: 'क्रॉस-चेक',
      issues: 'त्रुटी',
      fix: 'अर्ज दुरुस्त करा',
      tools: 'टूल्स',
      help: 'जवळील मदत',
      report: 'अंतिम अहवाल',
      tryDemo: 'डेमो पहा',
      startCheckup: 'तपासणी सुरू करा',
      activeApplication: 'सक्रिय अर्ज',
      selectLanguage: 'भाषा',
      menu: 'मेन्यू',
      closeMenu: 'बंद करा',
    },
    header: {
      tagline: 'डॉ. डॉक',
      descriptor: 'दस्तऐवज बुद्धिमत्ता',
    },
    footer: {
      tagline: 'डॉ. डॉक — बुद्धिमान दस्तऐवज सत्यापन प्लॅटफॉर्म',
      philosophyTitle: 'आमचे तत्त्वज्ञान',
      philosophyText: 'कागदपत्र त्रुटींमुळे अर्ज नाकारला जाऊ नये. डॉ. डॉक सादर करण्यापूर्वी कागदपत्रांची तपासणी, सत्यापन आणि दुरुस्ती करतो.',
      systemStatus: 'सिस्टम स्थिती',
      allSystemsOperational: 'सर्व सत्यापन प्रणाली कार्यरत आहेत',
      copyright: '© 2026 डॉ. डॉक. सर्व हक्क राखीव.',
      privacy: 'गोपनीयता धोरण',
      terms: 'सेवा अटी',
      security: 'सुरक्षा रचना',
    },
    common: {
      verified: 'सत्यापित',
      needsReview: 'पुनरावलोकन आवश्यक',
      missing: 'अनुपलब्ध',
      critical: 'गंभीर त्रुटी',
      actionRequired: 'कार्रवाई आवश्यक',
      readyForSubmission: 'सादरीकरणासाठी तयार',
      notEvaluated: 'मूल्यमापन झालेले नाही',
      upload: 'अपलोड करा',
      view: 'पहा',
      download: 'डाउनलोड',
      delete: 'हटवा',
      fix: 'दुरुस्त करा',
      cancel: 'रद्द करा',
      save: 'जतन करा',
      confirm: 'खात्री करा',
      back: 'मागे',
      next: 'पुढे',
      search: 'शोधा...',
      filter: 'फिल्टर',
      all: 'सर्व',
      loading: 'लोड होत आहे...',
      error: 'त्रुटी झाली',
      success: 'यशस्वी',
    },
    home: {
      heroTag: 'डॉ. डॉक • दस्तऐवज बुद्धिमत्ता',
      heroTitleLine1: 'तुमचे दस्तऐवज।',
      heroTitleLine2: 'सखोल तपासणीखाली।',
      heroSubtitle: 'तुमचे दस्तऐवज अपलोड करा. डॉ. डॉक सबमिशनपूर्वी त्यांची ओळख पटवतो, विश्लेषण करतो, पडताळतो आणि तुलना करतो. आता नाव फरक किंवा गहाळ फाइल्समुळे अर्ज नाकारला जाणार नाही.',
      startCheckupBtn: 'दस्तऐवज तपासणी सुरू करा',
      exploreDemoBtn: 'हे कसे कार्य करते ते पहा',
      stat1Title: '100% स्वयंचलित',
      stat1Desc: 'बहु-दस्तऐवज वर्गीकरण',
      stat2Title: 'क्रॉस-डॉक्युमेंट',
      stat2Desc: 'विसंगती ओळख प्रणाली',
      stat3Title: 'इन-लाईन दुरुस्ती',
      stat3Desc: 'कॉम्प्रेशन आणि टूल्स',
      evidenceDesk: 'पुरावा डेस्क',
      liveAnalysisBoard: 'थेट विश्लेषण बोर्ड',
      readinessScore: 'तयारी गुण',
      
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

      sec3Tag: 'विभाग 03 // स्वयंचलित इनजेशन',
      sec3Title: 'स्मार्ट दस्तऐवज वर्गीकरण',
      beforeLabel: 'पूर्वी: असंघटित फाइल्स',
      afterLabel: 'नंतर: स्वयंचलित वर्गीकरण',

      sec4Tag: 'विभाग 04 // क्रॉस-डॉक्युमेंट विश्लेषण',
      sec4Title: 'दस्तऐवजांची परस्पर तुलना',
      caseFinding: 'केस निष्कर्ष: नावामध्ये संभाव्य तफावत',
      viewMatrix: 'मॅट्रिक्स पहा →',

      sec5Tag: 'विभाग 05 // एकात्मिक निवारण',
      sec5Title: 'फक्त त्रुटी दाखवू नका, दुरुस्त करा.',

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
    },
    inbox: {
      tag: 'दस्तऐवज संकलन डेस्क',
      title: 'दस्तऐवज इनबॉक्स',
      subtitle: 'अर्जासाठीचे सर्व दस्तऐवज अपलोड करा. डॉ. डॉक प्रत्येक फाईलचे स्वयंचलित विश्लेषण करतो.',
      uploadBoxTitle: 'तुमच्या फाइल्स येथे ड्रॅग आणि ड्रॉप करा',
      uploadBoxSubtitle: 'प्रत्येक 25MB पर्यंत PDF, PNG, JPG फाइल्सना सपोर्ट करते',
      uploadedDocsTitle: 'अपलोड केलेले दस्तऐवज',
      noDocsMessage: 'अद्याप कोणतेही दस्तऐवज अपलोड केलेले नाहीत. फाइल्स ड्रॅग करा किंवा निवडण्यासाठी क्लिक करा.',
      filterAll: 'सर्व दस्तऐवज',
      filterIdentity: 'ओळख पुरावा',
      filterAddress: 'पत्ता पुरावा',
      filterBusiness: 'व्यवसाय व इतर',
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
    },
    verification: {
      tag: 'दस्तऐवज सत्यापन',
      title: 'अर्ज पूर्णता स्थिती',
      subtitlePrefix: 'अर्ज:',
      readinessScoreLabel: 'अर्ज पूर्णता गुण',
      notEvaluatedText: 'मूल्यमापन झालेले नाही',
      uploadDocsPrompt: 'पूर्णता गुण मिळवण्यासाठी आवश्यक दस्तऐवज अपलोड करा.',
      analyzedDocsCount: 'कागदपत्रांचे विश्लेषण केले',
      verifiedCount: 'सत्यापित',
      reviewCount: 'पुनरावलोकन आवश्यक',
      missingCount: 'अनुपलब्ध',
      requiredDocsTitle: 'आवश्यक दस्तऐवज',
      docsProvidedCount: 'दस्तऐवज उपलब्ध',
      summaryTitle: 'सत्यापन सारांश',
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
      tag: 'क्रॉस-डॉक्युमेंट विश्लेषण',
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
      criticalTab: 'गंभीर त्रुटी',
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
    },
    report: {
      tag: 'अधिकृत सारांश विवरण',
      title: 'अंतिम सत्यापन अहवाल',
      subtitle: 'तुमच्या अर्जासाठी सर्वसमावेशक ऑडिट अहवाल.',
      printReportBtn: 'अहवाल प्रिंट करा',
      exportPdfBtn: 'पीडीएफ निर्यात करा',
      auditSummary: 'ऑडिट सारांश निष्कर्ष',
      decisionStatus: 'अर्ज पूर्णता निर्णय',
      finalStatement: 'अंतिम मूल्यमापन विधान',
    },
  },
};
