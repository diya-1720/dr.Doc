import React, { createContext, useContext, useState, useEffect } from 'react';
import type { DocItem, ApplicationRequirement, IssueItem, CrossCheckField, DocumentType } from '../types';
import { DEFAULT_APPLICATIONS, DEMO_DOCUMENTS, DEMO_ISSUES, DEMO_CROSS_CHECKS } from '../services/demoData';
import { analyzeUploadedFile, calculateApplicationScore } from '../services/aiEngine';

interface ForensicsContextType {
  applications: ApplicationRequirement[];
  currentApplication: ApplicationRequirement;
  documents: DocItem[];
  issues: IssueItem[];
  crossChecks: CrossCheckField[];
  readinessScore: number;
  isAnalyzing: boolean;
  processingProgress: { current: number; total: number; stage: string };
  activeDocumentId: string | null;
  caseId: string;
  isDemoMode: boolean;
  uploadWarning: string | null;
  
  // Handlers
  setApplication: (appId: string) => void;
  uploadFiles: (files: File[]) => Promise<void>;
  loadDemoMode: () => void;
  deleteDocument: (id: string) => void;
  replaceDocument: (id: string, file: File) => Promise<void>;
  resolveIssue: (issueId: string) => void;
  setActiveDocument: (id: string | null) => void;
  resetCase: () => void;
  updateDocumentType: (id: string, type: DocumentType) => void;
  getDocumentById: (id: string) => DocItem | undefined;
  dismissWarning: () => void;
}

const ForensicsContext = createContext<ForensicsContextType | undefined>(undefined);

export const ForensicsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications] = useState<ApplicationRequirement[]>(DEFAULT_APPLICATIONS);
  const [currentApplication, setCurrentApplication] = useState<ApplicationRequirement>(DEFAULT_APPLICATIONS[0]);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [crossChecks, setCrossChecks] = useState<CrossCheckField[]>([]);
  const [readinessScore, setReadinessScore] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState({ current: 0, total: 0, stage: '' });
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string>('DR-2026-00142');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);

  // Recalculate evaluation state whenever documents or current application changes
  useEffect(() => {
    if (documents.length === 0 && !isDemoMode) {
      setReadinessScore(0);
      setIssues([]);
      setCrossChecks([]);
      return;
    }

    const required = currentApplication.requiredDocuments;
    const computed = calculateApplicationScore(documents, required);

    // If in demo mode and no custom uploads made, merge demo issues
    if (isDemoMode && documents.length === DEMO_DOCUMENTS.length) {
      setReadinessScore(78);
      setIssues(DEMO_ISSUES);
      setCrossChecks(DEMO_CROSS_CHECKS);
    } else {
      setReadinessScore(computed.score);
      setIssues(computed.issues);
      setCrossChecks(computed.crossChecks);
    }
  }, [documents, currentApplication, isDemoMode]);

  const setApplication = (appId: string) => {
    const found = applications.find(a => a.id === appId);
    if (found) {
      setCurrentApplication(found);
    }
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setUploadWarning(null);

    // Strict 5 files limit enforcement
    let filesToProcess = files;
    if (files.length > 5) {
      setUploadWarning(`Maximum 5 files allowed per upload batch. Ingesting first 5 files.`);
      filesToProcess = files.slice(0, 5);
    }

    const maxAllowedRemaining = Math.max(0, 5 - documents.length);
    if (documents.length + filesToProcess.length > 5) {
      if (maxAllowedRemaining === 0) {
        setUploadWarning('Case document capacity reached (maximum 5 files). Delete an existing document to upload new files.');
        return;
      }
      setUploadWarning(`Case capacity is 5 files. Ingesting ${maxAllowedRemaining} document(s).`);
      filesToProcess = filesToProcess.slice(0, maxAllowedRemaining);
    }

    if (filesToProcess.length === 0) return;

    setIsAnalyzing(true);
    setIsDemoMode(false);
    setProcessingProgress({ current: 0, total: filesToProcess.length, stage: 'Initiating document intake' });

    const newDocs: DocItem[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      setProcessingProgress({
        current: i + 1,
        total: filesToProcess.length,
        stage: `Analyzing ${file.name} (Classification, OCR & Quality Audit)...`
      });

      try {
        const analyzedDoc = await analyzeUploadedFile(file);
        newDocs.push(analyzedDoc);
      } catch (err: any) {
        console.error(`Error analyzing file ${file.name}:`, err);
        // Partial failure safety: preserve file record with error state
        const fallbackDoc: DocItem = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          filename: file.name,
          originalFilename: file.name,
          fileSizeMB: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
          mimeType: file.type || 'application/octet-stream',
          previewUrl: URL.createObjectURL(file),
          fileObj: file,
          status: 'error',
          errorMessage: err.message || 'Analysis encountered an error',
          category: 'UNKNOWN',
          documentType: 'Unidentified Document',
          confidence: 50,
          quality: {
            sharpness: 70, textVisibility: 70, lighting: 70, cropping: 70, overallScore: 70,
            status: 'NEEDS ATTENTION', feedbackLines: ['Document uploaded, manual review needed']
          },
          extractedFields: [],
          rawOcrText: '',
          verificationStatus: 'NEEDS REVIEW',
          issues: ['Automated OCR extraction failed. Please review manually or retry.'],
          uploadedAt: new Date().toISOString(),
          metadata: { format: file.name.split('.').pop()?.toUpperCase() || 'FILE' }
        };
        newDocs.push(fallbackDoc);
      }
    }

    setDocuments(prev => [...prev, ...newDocs]);
    if (newDocs.length > 0 && !activeDocumentId) {
      setActiveDocumentId(newDocs[0].id);
    }

    setIsAnalyzing(false);
    setProcessingProgress({ current: 0, total: 0, stage: '' });
  };

  const loadDemoMode = () => {
    setIsDemoMode(true);
    setDocuments(DEMO_DOCUMENTS);
    setIssues(DEMO_ISSUES);
    setCrossChecks(DEMO_CROSS_CHECKS);
    setReadinessScore(78);
    setActiveDocumentId(DEMO_DOCUMENTS[0].id);
    setCaseId('DR-2026-00142');
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (activeDocumentId === id) {
      const remaining = documents.filter(d => d.id !== id);
      setActiveDocumentId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const replaceDocument = async (id: string, newFile: File) => {
    setIsAnalyzing(true);
    setProcessingProgress({ current: 1, total: 1, stage: `Re-analyzing updated ${newFile.name}...` });

    try {
      const updatedDoc = await analyzeUploadedFile(newFile);
      updatedDoc.id = id; // preserve same ID for workflow continuity
      updatedDoc.fileObj = newFile;

      setDocuments(prev => prev.map(d => (d.id === id ? updatedDoc : d)));

      // Clear resolved issues connected to this document
      setIssues(prev => prev.map(iss => (iss.affectedDocumentId === id ? { ...iss, resolved: true } : iss)));
    } catch (err: any) {
      console.error('Error replacing document:', err);
    } finally {
      setIsAnalyzing(false);
      setProcessingProgress({ current: 0, total: 0, stage: '' });
    }
  };

  const resolveIssue = (issueId: string) => {
    setIssues(prev => prev.map(i => (i.id === issueId ? { ...i, resolved: true } : i)));
  };

  const setActiveDocument = (id: string | null) => {
    setActiveDocumentId(id);
  };

  const updateDocumentType = (id: string, type: DocumentType) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        let cat = d.category;
        if (['PAN Card', 'Aadhaar Card', 'Passport'].includes(type)) cat = 'IDENTITY';
        else if (['Electricity Bill', 'Bank Statement'].includes(type)) cat = 'ADDRESS';
        else if (type === 'GST Certificate') cat = 'BUSINESS';
        else if (type === 'Photograph') cat = 'PERSONAL';

        return { ...d, documentType: type, category: cat, confidence: 100 };
      }
      return d;
    }));
  };

  const getDocumentById = (id: string): DocItem | undefined => {
    return documents.find(d => d.id === id);
  };

  const dismissWarning = () => {
    setUploadWarning(null);
  };

  const resetCase = () => {
    setDocuments([]);
    setIssues([]);
    setCrossChecks([]);
    setReadinessScore(0);
    setActiveDocumentId(null);
    setIsDemoMode(false);
    setUploadWarning(null);
    setCaseId(`DR-2026-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  return (
    <ForensicsContext.Provider
      value={{
        applications,
        currentApplication,
        documents,
        issues,
        crossChecks,
        readinessScore,
        isAnalyzing,
        processingProgress,
        activeDocumentId,
        caseId,
        isDemoMode,
        uploadWarning,
        setApplication,
        uploadFiles,
        loadDemoMode,
        deleteDocument,
        replaceDocument,
        resolveIssue,
        setActiveDocument,
        resetCase,
        updateDocumentType,
        getDocumentById,
        dismissWarning
      }}
    >
      {children}
    </ForensicsContext.Provider>
  );
};

export const useForensics = () => {
  const ctx = useContext(ForensicsContext);
  if (!ctx) throw new Error('useForensics must be used within a ForensicsProvider');
  return ctx;
};
