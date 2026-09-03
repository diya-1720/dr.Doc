import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Sidebar } from '../components/Sidebar';
import { QrShareModal } from '../components/QrShareModal';
import type { DocumentCategory, DocItem } from '../types';
import { mergeSelectedDocsIntoPdf, downloadDocInFormat } from '../services/docTools';
import { 
  Upload, 
  Trash2, 
  Eye, 
  Search, 
  Loader2,
  ShieldAlert,
  Wrench,
  ArrowRightLeft,
  Sliders,
  AlertTriangle,
  X,
  Download,
  CheckSquare,
  Square,
  FileCheck2,
  Layers,
  Sparkles,
  UserCheck,
  UserX,
  RotateCw,
  QrCode
} from 'lucide-react';

export const DocumentInboxPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { 
    documents, 
    uploadFiles, 
    isAnalyzing, 
    processingProgress, 
    deleteDocument, 
    setActiveDocument,
    renameDocument,
    applySuggestedFilenames,
    uploadWarning,
    dismissWarning,
    crossChecks,
    caseId,
    currentApplication
  } = useForensics();

  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Checkbox multi-select state for consolidated PDF bundle
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isMergingBundle, setIsMergingBundle] = useState(false);
  const [mergeMessage, setMergeMessage] = useState<string | null>(null);

  // Download format modal / popup per document
  const [downloadModalDoc, setDownloadModalDoc] = useState<DocItem | null>(null);
  const [chosenFormat, setChosenFormat] = useState<'pdf' | 'png' | 'jpg' | 'webp'>('pdf');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      uploadFiles(filesArray);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      uploadFiles(filesArray);
    }
  };

  const handleCardClick = (docId: string) => {
    setActiveDocument(docId);
    navigate('/ocr');
  };

  const toggleSelectDoc = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDocIds(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map(d => d.id));
    }
  };

  const handleMergeSelectedPdf = async () => {
    const docsToMerge = documents.filter(d => selectedDocIds.includes(d.id));
    if (docsToMerge.length === 0) return;

    setIsMergingBundle(true);
    setMergeMessage(null);
    try {
      const mergedPdf = await mergeSelectedDocsIntoPdf(docsToMerge, 'CONSOLIDATED_APPLICATION_BUNDLE.pdf');
      const url = URL.createObjectURL(mergedPdf);
      const a = document.createElement('a');
      a.href = url;
      a.download = mergedPdf.name;
      a.click();
      URL.revokeObjectURL(url);
      setMergeMessage(`Successfully merged ${docsToMerge.length} documents into CONSOLIDATED_APPLICATION_BUNDLE.pdf!`);
      setTimeout(() => setMergeMessage(null), 5000);
    } catch (err: any) {
      setMergeMessage(`Merge failed: ${err.message || 'Error creating PDF bundle'}`);
    } finally {
      setIsMergingBundle(false);
    }
  };

  const handleDownloadSingle = (doc: DocItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadModalDoc(doc);
    setChosenFormat(doc.mimeType.includes('pdf') ? 'pdf' : 'png');
  };

  const executeDownload = async () => {
    if (!downloadModalDoc) return;
    try {
      await downloadDocInFormat(downloadModalDoc, chosenFormat);
      setDownloadModalDoc(null);
    } catch (err: any) {
      alert(`Download failed: ${err.message || 'Error converting format'}`);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoriesCount = {
    ALL: documents.length,
    IDENTITY: documents.filter(d => d.category === 'IDENTITY').length,
    ADDRESS: documents.filter(d => d.category === 'ADDRESS').length,
    BUSINESS: documents.filter(d => d.category === 'BUSINESS').length,
    PERSONAL: documents.filter(d => d.category === 'PERSONAL').length,
    UNKNOWN: documents.filter(d => d.category === 'UNKNOWN').length,
  };

  // Check for active cross-document discrepancies
  const mismatchChecks = crossChecks.filter(c => c.status === 'MISMATCH');

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full">
        
        {/* Page Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span>PHASE 02 // {t.inbox.tag}</span>
              <span className="bg-[#FFF8EA] text-[#7A302F] px-1.5 py-0.2 border border-[#7A302F] text-[10px]">
                20 MAX
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
              {t.inbox.title}
            </h1>
            <p className="font-body text-sm text-[#3F2928] mt-1">
              {t.inbox.subtitle}
            </p>
          </div>

          {/* Step-by-Step Direct Tour Navigation Toolbar */}
          {documents.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                onClick={() => navigate('/ocr')}
                className="px-3 py-1.5 bg-[#FFF8EA] hover:bg-[#3F2928] hover:text-[#FFF8EA] text-[#3F2928] border border-[#3F2928] font-bold flex items-center gap-1 shadow-[2px_2px_0px_#3F2928] transition-all"
              >
                {t.inboxTour.ocr}
              </button>
              <button
                onClick={() => navigate('/quality')}
                className="px-3 py-1.5 bg-[#FFF8EA] hover:bg-[#3F2928] hover:text-[#FFF8EA] text-[#3F2928] border border-[#3F2928] font-bold flex items-center gap-1 shadow-[2px_2px_0px_#3F2928] transition-all"
              >
                {t.inboxTour.quality}
              </button>
              <button
                onClick={() => navigate('/verification')}
                className="px-3 py-1.5 bg-[#FFF8EA] hover:bg-[#3F2928] hover:text-[#FFF8EA] text-[#3F2928] border border-[#3F2928] font-bold flex items-center gap-1 shadow-[2px_2px_0px_#3F2928] transition-all"
              >
                {t.inboxTour.verify}
              </button>
              <button
                onClick={() => navigate('/cross-check')}
                className="px-3 py-1.5 bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] border border-[#3F2928] font-bold flex items-center gap-1 shadow-[2px_2px_0px_#3F2928] transition-all"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> {t.inboxTour.crossCheck}
              </button>
            </div>
          )}
        </div>

        {/* Warning / Notification Banner if upload limits exceeded */}
        {uploadWarning && (
          <div className="bg-[#FFF8EA] border-2 border-[#7A302F] p-3.5 mb-6 shadow-[3px_3px_0px_#7A302F] flex items-center justify-between gap-3 font-mono text-xs text-[#7A302F]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#7A302F]" />
              <span>{uploadWarning}</span>
            </div>
            <button
              onClick={dismissWarning}
              className="text-[#3F2928] hover:text-[#7A302F] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Cross-Document Mismatch Alert Banner */}
        {mismatchChecks.length > 0 && (
          <div className="bg-[#FFF8EA] border-2 border-[#7A302F] p-4 mb-6 shadow-[4px_4px_0px_#7A302F]">
            <div className="font-heading text-base font-bold text-[#7A302F] flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-[#7A302F]" />
              {t.crossCheckMatrix.mismatchBanner} ({mismatchChecks.length})
            </div>
            <div className="space-y-1.5 font-mono text-xs text-[#3F2928]">
              {mismatchChecks.map((chk, idx) => (
                <div key={idx} className="p-2 bg-[#E8B9B8]/40 border border-[#7A302F]">
                  <span className="font-bold text-[#7A302F]">{chk.fieldName}:</span> {chk.analysisNote}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => navigate('/cross-check')}
                className="font-mono text-xs font-bold bg-[#7A302F] text-[#FFF8EA] px-3 py-1.5 border border-[#3F2928] hover:bg-[#5c2322] shadow-[2px_2px_0px_#3F2928]"
              >
                {t.crossCheckMatrix.openDesk}
              </button>
              <button
                onClick={() => navigate('/issues')}
                className="font-mono text-xs font-bold bg-[#FFF8EA] text-[#7A302F] px-3 py-1.5 border border-[#7A302F] hover:bg-[#F3E4C8]"
              >
                {t.verification.reviewIssuesBtn} →
              </button>
            </div>
          </div>
        )}

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`p-5 sm:p-8 border-2 border-dashed text-center transition-all mb-8 relative ${
            isDragOver 
              ? 'bg-[#F3E4C8] border-[#7A302F] shadow-[4px_4px_0px_#7A302F]' 
              : 'bg-[#FFF8EA] border-[#3F2928] shadow-[4px_4px_0px_#3F2928]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            className="hidden"
          />

          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#3F2928] text-[#FFF8EA] border border-[#3F2928] flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_#7A302F]">
            <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928] mb-1">
            {t.inbox.uploadBoxTitle}
          </h3>
          <p className="font-mono text-xs text-[#A58B7B] mb-4">
            Upload up to 20 documents simultaneously (PDF, PNG, JPG, WEBP). Auto-classifies and audits immediately.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing || documents.length >= 20}
              className="w-full sm:w-auto font-heading text-base font-bold bg-[#7A302F] hover:bg-[#5c2322] disabled:opacity-50 text-[#FFF8EA] px-8 py-3 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              {documents.length >= 20 ? 'CASE CAPACITY REACHED (20/20)' : `${t.common.upload} (MAX 20)`}
            </button>
          </div>
        </div>

        {/* Processing State Loader */}
        {isAnalyzing && (
          <div className="bg-[#3F2928] text-[#FFF8EA] p-4 sm:p-6 border-2 border-[#3F2928] shadow-[4px_4px_0px_#7A302F] mb-8 font-mono">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-6 h-6 text-[#D47794] animate-spin shrink-0" />
              <div>
                <span className="font-heading text-lg sm:text-xl font-bold text-white tracking-wider">
                  CLASSIFYING & AUDITING DOCUMENTS...
                </span>
                <span className="block text-xs text-[#E8B9B8]">
                  Processing {processingProgress.current} / {processingProgress.total}
                </span>
              </div>
            </div>
            <div className="text-xs text-[#F3E4C8] mb-2">{processingProgress.stage}</div>
            <div className="w-full bg-[#3F2928] h-2 border border-[#FFF8EA]/20">
              <div
                className="bg-[#7A302F] h-full transition-all duration-300"
                style={{ width: `${(processingProgress.current / Math.max(1, processingProgress.total)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Ingestion Overview & Classification Tabs */}
        {documents.length > 0 && (
          <div>
            
            {/* Status Summary & Multi-Doc Collaboration Bar */}
            <div className="bg-[#F3E4C8] border-2 border-[#3F2928] p-3 sm:p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-xs shadow-[2px_2px_0px_#3F2928]">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span>CASE DOCUMENTS: <strong>{documents.length} / 20</strong></span>
                <span className="text-[#7A302F] font-bold">VERIFIED: {documents.filter(d => d.verificationStatus === 'VERIFIED').length}</span>
                <span className="text-[#7A302F] font-bold">NEEDS REVIEW: {documents.filter(d => d.verificationStatus !== 'VERIFIED').length}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="px-3 py-1 bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] border border-[#3F2928] font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_#3F2928] text-[11px] transition-all"
                  title={t.qr.shareViaQr}
                >
                  <QrCode className="w-3.5 h-3.5 text-[#FFF8EA]" /> {t.qr.shareViaQr}
                </button>

                <button
                  onClick={applySuggestedFilenames}
                  className="px-3 py-1 bg-[#3F2928] hover:bg-[#7A302F] text-[#FFF8EA] border border-[#3F2928] font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_#7A302F] text-[11px] transition-all"
                  title="Automatically rename all documents based on AI classification and applicant name"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E8B9B8]" /> {t.docCard.autoRename}
                </button>

                <button
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 bg-[#FFF8EA] hover:bg-[#E8B9B8] border border-[#3F2928] font-bold flex items-center gap-1 text-[11px]"
                >
                  {selectedDocIds.length === documents.length ? (
                    <><CheckSquare className="w-3.5 h-3.5 text-[#7A302F]" /> {t.inbox.clearSelection}</>
                  ) : (
                    <><Square className="w-3.5 h-3.5 text-[#7A302F]" /> {t.inbox.selectAll} ({documents.length})</>
                  )}
                </button>

                {selectedDocIds.length > 0 && (
                  <button
                    onClick={handleMergeSelectedPdf}
                    disabled={isMergingBundle}
                    className="px-3 py-1 bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] border border-[#3F2928] font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_#3F2928] text-[11px] disabled:opacity-50"
                  >
                    {isMergingBundle ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {t.common.loading}</>
                    ) : (
                      <><Layers className="w-3.5 h-3.5" /> {t.inbox.mergeSelected} ({selectedDocIds.length})</>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Merge Success Alert */}
            {mergeMessage && (
              <div className="p-3 mb-4 bg-[#FFF8EA] border-2 border-[#7A302F] text-[#7A302F] font-mono text-xs font-bold flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#7A302F]" />
                <span>{mergeMessage}</span>
              </div>
            )}

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-1 font-mono text-xs w-full md:w-auto">
                {[
                  { key: 'ALL' as const, label: t.categories.all },
                  { key: 'IDENTITY' as const, label: t.categories.identity },
                  { key: 'ADDRESS' as const, label: t.categories.address },
                  { key: 'BUSINESS' as const, label: t.categories.business },
                  { key: 'PERSONAL' as const, label: t.categories.personal },
                  { key: 'UNKNOWN' as const, label: t.categories.unknown },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-1.5 border font-semibold transition-all text-[11px] sm:text-xs ${
                      selectedCategory === key
                        ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928] shadow-[2px_2px_0px_#D47794]'
                        : 'bg-[#FFF8EA] text-[#3F2928] border-[#3F2928] hover:bg-[#F3E4C8]'
                    }`}
                  >
                    {label} ({categoriesCount[key]})
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A58B7B]" />
                <input
                  type="text"
                  placeholder="Search document name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#FFF8EA] border border-[#3F2928] pl-9 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#7A302F]"
                />
              </div>

            </div>

            {/* Documents Grid with Classification & Photo Audit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredDocs.map((doc) => {
                const isSelected = selectedDocIds.includes(doc.id);
                const applicantName = doc.extractedFields.find(f => f.key.toLowerCase().includes('name') || f.key === 'applicantName')?.value;
                const docNumber = doc.extractedFields.find(f => f.key.toLowerCase().includes('number') || f.key === 'documentNumber')?.value;
                const dob = doc.extractedFields.find(f => f.key.toLowerCase().includes('dob'))?.value;
                const bloodGroup = doc.extractedFields.find(f => f.key === 'bloodGroup')?.value;
                const validity = doc.extractedFields.find(f => f.key === 'validity')?.value;
                const fatherName = doc.extractedFields.find(f => f.key === 'fatherName')?.value;
                const vid = doc.extractedFields.find(f => f.key === 'vid')?.value;
                const gender = doc.extractedFields.find(f => f.key === 'gender')?.value;
                const address = doc.extractedFields.find(f => f.key === 'address')?.value;

                return (
                  <div
                    key={doc.id}
                    className={`case-card p-4 relative flex flex-col justify-between transition-all ${
                      isSelected ? 'ring-2 ring-[#7A302F] bg-[#FFF8EA]' : ''
                    } ${
                      doc.verificationStatus === 'NEEDS REVIEW'
                        ? 'border-[#7A302F]'
                        : 'border-[#3F2928]'
                    }`}
                  >
                    
                    {/* Top Bar: Select Checkbox, Classification Category & Status Stamp */}
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => toggleSelectDoc(doc.id, e)}
                            className="text-[#7A302F] hover:scale-110 transition-transform p-0.5"
                            title="Select document to merge into single PDF"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-[#7A302F]" fill="#F3E4C8" />
                            ) : (
                              <Square className="w-5 h-5 text-[#3F2928]" />
                            )}
                          </button>
                          <span className="evidence-tag">{doc.category}</span>
                        </div>

                        <span
                          className={`stamp text-[9px] ${
                            doc.verificationStatus === 'VERIFIED'
                              ? 'stamp-verified'
                              : 'stamp-critical'
                          }`}
                        >
                          {doc.verificationStatus}
                        </span>
                      </div>

                      {/* Thumbnail Preview */}
                      <div
                        onClick={() => handleCardClick(doc.id)}
                        className="cursor-pointer group relative bg-[#3F2928]/5 border border-[#3F2928] mb-2 overflow-hidden h-36 flex items-center justify-center"
                      >
                        <img
                          src={doc.correctedPreviewUrl || doc.previewUrl}
                          alt={doc.filename}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-[#3F2928]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-mono text-xs font-bold gap-1">
                          <Eye className="w-4 h-4" /> EXAMINE OCR
                        </div>
                      </div>

                      {/* Orientation Detection & Auto-Correction Status Pill */}
                      <div className={`mb-2 px-2 py-1 border font-mono text-[9px] flex items-center justify-between ${
                        doc.detectedOrientation && doc.detectedOrientation !== 'UPRIGHT'
                          ? 'bg-[#D4E8B8] border-[#3F2928] text-[#3F2928] font-bold'
                          : 'bg-[#FFF8EA] border-[#3F2928] text-[#A58B7B]'
                      }`}>
                        <span className="flex items-center gap-1">
                          <RotateCw className="w-3 h-3 text-[#7A302F]" />
                          {doc.detectedOrientation && doc.detectedOrientation !== 'UPRIGHT'
                            ? `${t.docCard.orientation}: 90° ➔ ${t.docCard.autoCorrected} ${t.docCard.horizontal} ✓`
                            : `${t.docCard.orientation}: ${t.docCard.upright}`}
                        </span>
                        <span className="text-[8px] bg-[#3F2928] text-white px-1 py-0.2">
                          {doc.metadata?.dimensions || 'A4 / Standard'}
                        </span>
                      </div>

                      {/* AI Classified Document Type Header */}
                      <div className="mb-2">
                        <div className="font-mono text-[10px] font-bold text-[#7A302F] uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#7A302F]" />
                          {t.docCard.aiClassified}
                        </div>
                        <h4 className="font-heading text-lg font-bold text-[#3F2928] line-clamp-1">
                          {doc.documentType}
                        </h4>
                        <div className="font-mono text-xs text-[#A58B7B] truncate">
                          {doc.filename}
                        </div>
                      </div>

                      {/* Extracted Credential Badges with Document-Specific Attributes */}
                      <div className="space-y-1 font-mono text-[11px] bg-[#F3E4C8] p-2.5 border border-[#3F2928] mb-3">
                        {applicantName && (
                          <div className="flex justify-between truncate">
                            <span className="text-[#A58B7B]">{t.docCard.name}</span>
                            <strong className="text-[#3F2928] truncate ml-1">{applicantName}</strong>
                          </div>
                        )}
                        {fatherName && (
                          <div className="flex justify-between truncate">
                            <span className="text-[#A58B7B]">FATHER:</span>
                            <strong className="text-[#3F2928] truncate ml-1">{fatherName}</strong>
                          </div>
                        )}
                        {docNumber && (
                          <div className="flex justify-between truncate">
                            <span className="text-[#A58B7B]">{t.docCard.idNo}</span>
                            <strong className="text-[#7A302F] truncate ml-1">{docNumber}</strong>
                          </div>
                        )}
                        {dob && (
                          <div className="flex justify-between">
                            <span className="text-[#A58B7B]">{t.docCard.dobAge}</span>
                            <strong className="text-[#3F2928]">
                              {dob.includes('(') ? dob : (doc.calculatedAge ? `${dob} (${doc.calculatedAge} ${t.docCard.years})` : dob)}
                            </strong>
                          </div>
                        )}
                        {bloodGroup && (
                          <div className="flex justify-between">
                            <span className="text-[#A58B7B]">{t.docCard.bloodGroup}</span>
                            <strong className="text-[#7A302F] font-bold">{bloodGroup}</strong>
                          </div>
                        )}
                        {validity && (
                          <div className="flex justify-between truncate">
                            <span className="text-[#A58B7B]">VALIDITY:</span>
                            <strong className="text-[#3F2928] truncate ml-1">{validity}</strong>
                          </div>
                        )}
                        {vid && (
                          <div className="flex justify-between truncate">
                            <span className="text-[#A58B7B]">VID:</span>
                            <strong className="text-[#3F2928] truncate ml-1">{vid}</strong>
                          </div>
                        )}
                        {gender && gender !== 'Not detected' && (
                          <div className="flex justify-between">
                            <span className="text-[#A58B7B]">GENDER:</span>
                            <strong className="text-[#3F2928]">{gender}</strong>
                          </div>
                        )}
                        {address && address !== 'Not detected' && (
                          <div className="text-[10px] text-[#A58B7B] pt-1 border-t border-[#3F2928]/10 line-clamp-1" title={address}>
                            <span>{t.docCard.addr} </span>
                            <span className="text-[#3F2928] font-bold">{address}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-1 border-t border-[#3F2928]/20">
                          <span>{t.docCard.quality}</span>
                          <strong className="text-[#7A302F]">
                            {doc.quality.status} ({doc.quality.overallScore}%)
                          </strong>
                        </div>
                      </div>

                      {/* Photo Aging & Consistency Indicator */}
                      {doc.photoAudit && doc.photoAudit.hasPhoto && (
                        <div className={`p-2 border mb-3 font-mono text-[10px] leading-tight flex items-start gap-1.5 ${
                          doc.photoAudit.photoStatus === 'OUTDATED_RECOMMEND_UPDATE' || !doc.photoAudit.ageMatch
                            ? 'bg-[#E8B9B8] border-[#7A302F] text-[#7A302F] font-bold'
                            : 'bg-[#FFF8EA] border-[#3F2928] text-[#3F2928]'
                        }`}>
                          {doc.photoAudit.photoStatus === 'OUTDATED_RECOMMEND_UPDATE' || !doc.photoAudit.ageMatch ? (
                            <>
                              <UserX className="w-3.5 h-3.5 text-[#7A302F] shrink-0 mt-0.5" />
                              <div>
                                <span className="block font-bold">{t.docCard.photoAgeMismatch}</span>
                                <span>{doc.photoAudit.photoFeedback || 'Photo appears outdated relative to calculated age. Recommend updating.'}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5 text-green-700 shrink-0 mt-0.5" />
                              <div>
                                <span className="block font-bold text-green-800">{t.docCard.photoAgeVerified}</span>
                                <span>{doc.photoAudit.photoFeedback || t.docCard.verifiedCurrent}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Issues line if any */}
                      {doc.issues.length > 0 && (
                        <div className="text-[10px] font-mono text-[#7A302F] font-bold bg-[#E8B9B8] p-1.5 border border-[#7A302F] mb-3 leading-tight flex items-start gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{doc.issues[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Actions & Smart Renamed Download */}
                    <div className="pt-3 border-t border-[#3F2928]/20 font-mono text-[11px] space-y-2">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleCardClick(doc.id)}
                          className="text-[#7A302F] hover:underline font-bold flex items-center gap-1"
                        >
                          {t.docCard.viewOcr} →
                        </button>

                        <div className="flex items-center gap-1.5">
                          {doc.suggestedFilename && doc.filename !== doc.suggestedFilename && (
                            <button
                              onClick={() => renameDocument(doc.id, doc.suggestedFilename!)}
                              className="bg-[#3F2928] text-[#FFF8EA] px-2 py-0.5 text-[10px] font-bold hover:bg-[#7A302F]"
                              title={`Apply AI suggested name: ${doc.suggestedFilename}`}
                            >
                              {t.docCard.autoRename}
                            </button>
                          )}

                          <button
                            onClick={(e) => handleDownloadSingle(doc, e)}
                            className="bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#7A302F] border border-[#3F2928] px-2 py-0.5 text-[10px] font-bold flex items-center gap-1"
                            title="Download classified file with custom format"
                          >
                            <Download className="w-3 h-3" /> {t.docCard.export}
                          </button>

                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="text-[#A58B7B] hover:text-[#7A302F] transition-colors p-1"
                            title="Remove file from case"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-[#3F2928]/10 text-[10px] text-[#A58B7B]">
                        <button
                          onClick={() => { setActiveDocument(doc.id); navigate('/quality'); }}
                          className="hover:text-[#7A302F] flex items-center gap-0.5"
                        >
                          <Sliders className="w-3 h-3" /> {t.docCard.audit}
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => navigate('/cross-check')}
                          className="hover:text-[#7A302F] flex items-center gap-0.5"
                        >
                          <ArrowRightLeft className="w-3 h-3" /> {t.docCard.compare}
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => navigate('/tools')}
                          className="hover:text-[#7A302F] flex items-center gap-0.5"
                        >
                          <Wrench className="w-3 h-3" /> {t.docCard.tools}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Smart Download & Format Selector Modal */}
        {downloadModalDoc && (
          <div className="fixed inset-0 bg-[#3F2928]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFF8EA] border-4 border-[#3F2928] shadow-[8px_8px_0px_#3F2928] max-w-md w-full p-6 font-mono">
              
              <div className="flex justify-between items-start mb-4 border-b-2 border-[#3F2928] pb-2">
                <div>
                  <span className="text-[10px] text-[#7A302F] font-bold uppercase">CLASSIFIED EXPORT</span>
                  <h3 className="font-heading text-xl font-bold text-[#3F2928]">
                    DOWNLOAD DOCUMENT
                  </h3>
                </div>
                <button
                  onClick={() => setDownloadModalDoc(null)}
                  className="text-[#3F2928] hover:text-[#7A302F] p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs mb-6">
                <div>
                  <span className="text-[#A58B7B] block mb-1">CLASSIFIED FILENAME:</span>
                  <div className="p-2 bg-[#F3E4C8] border border-[#3F2928] font-bold text-[#7A302F] truncate">
                    {downloadModalDoc.suggestedFilename || `${downloadModalDoc.documentType.toUpperCase().replace(/\s+/g, '_')}_${downloadModalDoc.filename}`}
                  </div>
                </div>

                <div>
                  <label className="text-[#3F2928] font-bold block mb-2">CHOOSE EXPORT FORMAT:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['pdf', 'png', 'jpg', 'webp'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setChosenFormat(fmt)}
                        className={`py-2 border font-bold uppercase text-center transition-all ${
                          chosenFormat === fmt
                            ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928] shadow-[2px_2px_0px_#7A302F]'
                            : 'bg-[#FFF8EA] text-[#3F2928] border-[#3F2928] hover:bg-[#F3E4C8]'
                        }`}
                      >
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={executeDownload}
                  className="flex-1 bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] py-2.5 font-heading text-base font-bold border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  DOWNLOAD AS {chosenFormat.toUpperCase()}
                </button>
                <button
                  onClick={() => setDownloadModalDoc(null)}
                  className="px-4 py-2.5 bg-[#FFF8EA] hover:bg-[#F3E4C8] text-[#3F2928] border border-[#3F2928] font-bold text-xs"
                >
                  CANCEL
                </button>
              </div>

            </div>
          </div>
        )}

        {/* QR Share Modal */}
        <QrShareModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          documents={documents}
          caseId={caseId}
          currentApp={currentApplication}
          crossCheckResult={null}
        />

      </main>
    </div>
  );
};
