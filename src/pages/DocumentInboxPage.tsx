import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { Sidebar } from '../components/Sidebar';
import type { DocumentCategory } from '../types';
import { 
  Upload, 
  Trash2, 
  Eye, 
  Search, 
  Loader2,
  ShieldAlert,
  Play
} from 'lucide-react';

export const DocumentInboxPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    documents, 
    uploadFiles, 
    isAnalyzing, 
    processingProgress, 
    deleteDocument, 
    setActiveDocument,
    loadDemoMode,
    isDemoMode
  } = useForensics();

  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      uploadFiles(filesArray);
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

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full">
        
        {/* Page Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
              PHASE 02 // MULTI-DOCUMENT INGESTION & CLASSIFICATION
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
              DOCUMENT INBOX
            </h1>
            <p className="font-body text-sm text-[#3F2928] mt-1">
              Upload multiple documents simultaneously. AI engine will automatically classify, check quality, and run OCR extraction.
            </p>
          </div>

          {documents.length === 0 && (
            <button
              onClick={loadDemoMode}
              className="font-mono text-xs font-bold bg-[#E8B9B8] hover:bg-[#D47794] text-[#7A302F] hover:text-[#FFF8EA] px-4 py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] flex items-center justify-center gap-2 self-stretch sm:self-start transition-colors"
            >
              <Play className="w-4 h-4" fill="currentColor" />
              LOAD DEMO CASE (5 DOCS)
            </button>
          )}
        </div>

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
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />

          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#3F2928] text-[#FFF8EA] border border-[#3F2928] flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_#7A302F]">
            <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928] mb-1">
            DROP YOUR DOCUMENTS HERE
          </h3>
          <p className="font-mono text-xs text-[#A58B7B] mb-4">
            PDF • PNG • JPG • MULTIPLE FILES AT ONCE
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="w-full sm:w-auto font-heading text-base font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-8 py-3 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            CHOOSE FILES
          </button>
        </div>

        {/* Processing State Loader */}
        {isAnalyzing && (
          <div className="bg-[#3F2928] text-[#FFF8EA] p-4 sm:p-6 border-2 border-[#3F2928] shadow-[4px_4px_0px_#7A302F] mb-8 font-mono">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-6 h-6 text-[#D47794] animate-spin shrink-0" />
              <div>
                <span className="font-heading text-lg sm:text-xl font-bold text-white tracking-wider">
                  EXAMINING DOCUMENTS...
                </span>
                <span className="block text-xs text-[#E8B9B8]">
                  Reading file {processingProgress.current} / {processingProgress.total}
                </span>
              </div>
            </div>
            <div className="text-xs text-[#F3E4C8] mb-2">{processingProgress.stage}</div>
            <div className="w-full bg-[#3F2928] h-2 border border-[#FFF8EA]/20">
              <div
                className="bg-[#7A302F] h-full transition-all duration-300"
                style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Ingestion Overview & Classification Tabs */}
        {documents.length > 0 && (
          <div>
            
            {/* Status Summary Banner */}
            <div className="bg-[#F3E4C8] border-2 border-[#3F2928] p-3 sm:p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 font-mono text-xs shadow-[2px_2px_0px_#3F2928]">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span>TOTAL UPLOADED: <strong>{documents.length}</strong></span>
                <span className="text-[#7A302F] font-bold">VERIFIED: {documents.filter(d => d.verificationStatus === 'VERIFIED').length}</span>
                <span className="text-[#7A302F] font-bold">REVIEW: {documents.filter(d => d.verificationStatus !== 'VERIFIED').length}</span>
              </div>

              {isDemoMode && (
                <span className="evidence-tag bg-[#E8B9B8] text-[#7A302F] self-start sm:self-auto">
                  DEMO CASE LOADED
                </span>
              )}
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-1 font-mono text-xs w-full md:w-auto">
                {(['ALL', 'IDENTITY', 'ADDRESS', 'BUSINESS', 'PERSONAL', 'UNKNOWN'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 border font-semibold transition-all text-[11px] sm:text-xs ${
                      selectedCategory === cat
                        ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928] shadow-[2px_2px_0px_#D47794]'
                        : 'bg-[#FFF8EA] text-[#3F2928] border-[#3F2928] hover:bg-[#F3E4C8]'
                    }`}
                  >
                    {cat} ({categoriesCount[cat]})
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

            {/* Documents Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className={`case-card p-4 relative flex flex-col justify-between ${
                    doc.verificationStatus === 'NEEDS REVIEW'
                      ? 'border-[#7A302F]'
                      : 'border-[#3F2928]'
                  }`}
                >
                  
                  {/* Top Bar: Category Tag & Status Stamp */}
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="evidence-tag">{doc.category}</span>
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

                    {/* Thumbnail Preview & Filename */}
                    <div
                      onClick={() => handleCardClick(doc.id)}
                      className="cursor-pointer group relative bg-[#3F2928]/5 border border-[#3F2928] mb-3 overflow-hidden h-36 flex items-center justify-center"
                    >
                      <img
                        src={doc.previewUrl}
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

                    {/* Document Title & Metadata */}
                    <h4 className="font-heading text-base sm:text-lg font-bold text-[#3F2928] line-clamp-1">
                      {doc.documentType}
                    </h4>
                    <div className="font-mono text-xs text-[#A58B7B] truncate mb-2">
                      {doc.filename}
                    </div>

                    {/* Confidence & Quality Meters */}
                    <div className="space-y-1 font-mono text-[11px] bg-[#F3E4C8] p-2 border border-[#3F2928] mb-3">
                      <div className="flex justify-between">
                        <span>CONFIDENCE:</span>
                        <strong className="text-[#7A302F]">{doc.confidence}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>QUALITY:</span>
                        <strong className="text-[#7A302F]">
                          {doc.quality.status} ({doc.quality.overallScore}%)
                        </strong>
                      </div>
                      <div className="flex justify-between text-[#A58B7B]">
                        <span>FILE SIZE:</span>
                        <span>{doc.fileSizeMB} MB</span>
                      </div>
                    </div>

                    {/* Issues line if any */}
                    {doc.issues.length > 0 && (
                      <div className="text-[10px] font-mono text-[#7A302F] font-bold bg-[#E8B9B8] p-1.5 border border-[#7A302F] mb-3 leading-tight flex items-start gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{doc.issues[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#3F2928]/20 font-mono text-xs">
                    <button
                      onClick={() => handleCardClick(doc.id)}
                      className="text-[#7A302F] hover:underline font-bold flex items-center gap-1"
                    >
                      VIEW OCR →
                    </button>

                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="text-[#A58B7B] hover:text-[#7A302F] transition-colors p-1.5"
                      title="Remove file from case"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

