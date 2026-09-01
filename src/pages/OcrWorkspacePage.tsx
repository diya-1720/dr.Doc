import React, { useState } from 'react';
import { useForensics } from '../context/ForensicsContext';
import { Sidebar } from '../components/Sidebar';
import { Copy, Download, Check, Scan } from 'lucide-react';

export const OcrWorkspacePage: React.FC = () => {
  const { documents, activeDocumentId, setActiveDocument } = useForensics();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentDoc = documents.find(d => d.id === activeDocumentId) || documents[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportJson = () => {
    if (!currentDoc) return;
    const jsonStr = JSON.stringify(currentDoc.extractedFields, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDoc.filename}_ocr_extracted.json`;
    a.click();
  };

  if (documents.length === 0) {
    return (
      <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 text-center">
          <div className="max-w-md mx-auto py-12 md:py-16">
            <Scan className="w-12 h-12 text-[#A58B7B] mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold mb-2 text-[#3F2928]">NO DOCUMENTS IN CASE</h2>
            <p className="font-body text-sm text-[#A58B7B] mb-6">
              Upload documents in the Inbox first to examine OCR extractions.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
              PHASE 03 // OCR & FORENSIC FIELD EXTRACTION
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
              OCR EXTRACTION WORKSPACE
            </h1>
          </div>

          {/* Document Selector Pills */}
          <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto max-w-full">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDocument(doc.id)}
                className={`px-3 py-1.5 border font-semibold transition-all whitespace-nowrap shrink-0 ${
                  currentDoc?.id === doc.id
                    ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928] shadow-[2px_2px_0px_#D47794]'
                    : 'bg-[#FFF8EA] text-[#3F2928] border-[#3F2928] hover:bg-[#F3E4C8]'
                }`}
              >
                {doc.documentType}
              </button>
            ))}
          </div>
        </div>

        {/* OCR Split / Stacked View */}
        {currentDoc && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Column / Top Section: Interactive Document Preview with Bounding Box Annotations */}
            <div className="lg:col-span-6 bg-[#FFF8EA] border-2 border-[#3F2928] p-4 shadow-[4px_4px_0px_#3F2928] relative">
              <div className="flex justify-between items-center font-mono text-xs border-b border-[#3F2928] pb-2 mb-4">
                <span className="font-bold text-[#3F2928] truncate max-w-[200px]">{currentDoc.filename}</span>
                <span className="evidence-tag">{currentDoc.category}</span>
              </div>

              {/* Document Image & Callout Bounding Boxes */}
              <div className="relative border border-[#3F2928] bg-[#3F2928]/5 overflow-hidden min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
                <img
                  src={currentDoc.previewUrl}
                  alt={currentDoc.filename}
                  className="w-full h-auto object-contain max-h-[500px]"
                />

                {/* Overlaid Forensic Bounding Boxes */}
                {currentDoc.extractedFields.map((field, idx) => {
                  if (!field.box) return null;
                  return (
                    <div
                      key={idx}
                      className="absolute border-2 border-[#7A302F] bg-[#7A302F]/15 group cursor-pointer transition-all hover:bg-[#7A302F]/30"
                      style={{
                        left: `${field.box.x}%`,
                        top: `${field.box.y}%`,
                        width: `${field.box.w}%`,
                        height: `${field.box.h}%`
                      }}
                      title={`${field.label}: ${field.value} (${field.confidence}%)`}
                    >
                      <span className="absolute -top-4 left-0 bg-[#7A302F] text-[#FFF8EA] text-[9px] font-mono px-1 opacity-80 group-hover:opacity-100">
                        {field.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex justify-between items-center font-mono text-[11px] text-[#A58B7B]">
                <span>ANNOTATED FIELDS: {currentDoc.extractedFields.length}</span>
                <span>CONFIDENCE: <strong className="text-[#7A302F]">{currentDoc.confidence}%</strong></span>
              </div>
            </div>

            {/* Right Column / Bottom Section: Structured Extracted Fields Table */}
            <div className="lg:col-span-6 bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-6 shadow-[4px_4px_0px_#3F2928]">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#3F2928]">
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#3F2928]">
                    EXTRACTED INFORMATION
                  </h3>
                  <div className="font-mono text-[11px] sm:text-xs text-[#A58B7B]">
                    STRUCTURED JSON PARSED BY GEMINI / FORENSIC ENGINE
                  </div>
                </div>

                <button
                  onClick={handleExportJson}
                  className="font-mono text-xs font-bold bg-[#3F2928] text-[#FFF8EA] px-3 py-1.5 border border-[#3F2928] shadow-[2px_2px_0px_#7A302F] flex items-center justify-center gap-1.5 hover:bg-[#7A302F] transition-colors self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  EXPORT DATA
                </button>
              </div>

              {/* Field Rows */}
              <div className="space-y-3 font-mono text-xs">
                {currentDoc.extractedFields.map((field) => (
                  <div
                    key={field.key}
                    className="p-3 bg-[#F3E4C8] border border-[#3F2928] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-[10px] text-[#A58B7B] font-bold uppercase">
                        {field.label}
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-[#3F2928] mt-0.5 select-all break-all sm:break-normal">
                        {field.value}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span className="text-[10px] font-bold text-[#7A302F] bg-[#FFF8EA] px-1.5 py-0.5 border border-[#7A302F]">
                        {field.confidence}% CONFIDENCE
                      </span>

                      <button
                        onClick={() => handleCopy(field.value, field.key)}
                        className="p-1.5 hover:bg-[#E8B9B8] border border-[#3F2928] text-[#3F2928] transition-colors"
                        title="Copy field text"
                      >
                        {copiedKey === field.key ? (
                          <Check className="w-3.5 h-3.5 text-[#7A302F]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Raw Text Output Stream */}
              <div className="mt-6 pt-4 border-t border-[#3F2928]">
                <div className="font-mono text-xs font-bold text-[#3F2928] mb-2">
                  RAW UNSTRUCTURED OCR STREAM
                </div>
                <pre className="bg-[#3F2928] text-[#FFF8EA] p-3 sm:p-4 font-mono text-[10px] sm:text-[11px] leading-relaxed border border-[#3F2928] max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {currentDoc.rawOcrText}
                </pre>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};

