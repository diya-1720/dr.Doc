import React, { useState, useRef } from 'react';
import { useForensics } from '../context/ForensicsContext';
import { Sidebar } from '../components/Sidebar';
import { backendCrossCheck } from '../services/api';
import type { CrossCheckResult } from '../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  FileText, 
  ArrowRightLeft, 
  HelpCircle, 
  Sparkles, 
  X, 
  RefreshCw
} from 'lucide-react';

export const CrossCheckPage: React.FC = () => {
  const { documents } = useForensics();

  // Dual File State
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file1Preview, setFile1Preview] = useState<string | null>(null);
  const [file2Preview, setFile2Preview] = useState<string | null>(null);

  // Execution & Loading State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<CrossCheckResult | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handleSelectFile1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile1(file);
      setFile1Preview(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
      setResult(null);
      setErrorMessage(null);
    }
  };

  const handleSelectFile2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile2(file);
      setFile2Preview(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
      setResult(null);
      setErrorMessage(null);
    }
  };

  const handlePickFromInbox = (docIndex: number, slot: 1 | 2) => {
    const doc = documents[docIndex];
    if (!doc) return;

    // Convert doc preview to a pseudo-File if needed
    fetch(doc.previewUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], doc.filename, { type: doc.mimeType });
        if (slot === 1) {
          setFile1(file);
          setFile1Preview(doc.previewUrl);
        } else {
          setFile2(file);
          setFile2Preview(doc.previewUrl);
        }
        setResult(null);
        setErrorMessage(null);
      })
      .catch(() => {
        // Fallback placeholder file
        const blob = new Blob([doc.rawOcrText], { type: 'text/plain' });
        const file = new File([blob], doc.filename, { type: 'text/plain' });
        if (slot === 1) { setFile1(file); } else { setFile2(file); }
      });
  };

  const handleRunCrossCheck = async () => {
    if (!file1 || !file2) {
      setErrorMessage('Please select both Document 1 and Document 2 to cross-check.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await backendCrossCheck(file1, file2);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        throw new Error(res.message || 'Cross-check failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Cross-check request failed. Please check backend connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile1(null);
    setFile2(null);
    setFile1Preview(null);
    setFile2Preview(null);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928]">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span>PHASE 06 // EVIDENCE CROSS-CHECK</span>
            <span className="bg-[#FFF8EA] border border-[#7A302F] px-1.5 py-0.5 text-[10px] text-[#7A302F]">
              GEMINI AI COMPARISON
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
            EVIDENCE CROSS-CHECK
          </h1>
          <p className="font-body text-sm text-[#3F2928] mt-1">
            Upload two documents (ID proofs, utility bills, or certificates) to automatically extract and cross-verify matching applicant identity fields via Gemini AI.
          </p>
        </div>

        {/* Upload Slots Section */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-6 shadow-[6px_6px_0px_#3F2928] mb-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#3F2928] pb-3 mb-6 font-mono text-xs font-bold">
            <span className="text-[#3F2928] flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-[#7A302F]" />
              SELECT TWO DOCUMENTS FOR COMPARISON
            </span>
            {(file1 || file2 || result) && (
              <button
                onClick={handleReset}
                className="text-[#7A302F] hover:underline flex items-center gap-1 text-[11px]"
              >
                <RefreshCw className="w-3 h-3" /> RESET SELECTION
              </button>
            )}
          </div>

          {/* Dual Upload Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            
            {/* DOCUMENT 1 */}
            <div className="p-4 bg-[#F3E4C8] border-2 border-[#3F2928] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-bold text-[#7A302F] uppercase">
                    DOCUMENT 1 (PRIMARY ID)
                  </span>
                  {file1 && (
                    <button
                      onClick={() => { setFile1(null); setFile1Preview(null); setResult(null); }}
                      className="text-[#7A302F] hover:text-[#3F2928]"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef1}
                  onChange={handleSelectFile1}
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                />

                {file1 ? (
                  <div className="bg-[#FFF8EA] border border-[#3F2928] p-3 text-center">
                    {file1Preview ? (
                      <img
                        src={file1Preview}
                        alt="Doc 1 Preview"
                        className="max-h-32 mx-auto mb-2 object-contain border border-[#3F2928]"
                      />
                    ) : (
                      <FileText className="w-10 h-10 text-[#7A302F] mx-auto mb-2" />
                    )}
                    <div className="font-mono text-xs font-bold text-[#3F2928] truncate">{file1.name}</div>
                    <div className="font-mono text-[10px] text-[#A58B7B]">
                      {(file1.size / (1024 * 1024)).toFixed(2)} MB • {file1.type || 'Document'}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef1.current?.click()}
                    className="w-full py-8 px-4 bg-[#FFF8EA] hover:bg-[#FFF] border-2 border-dashed border-[#3F2928] text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Upload className="w-6 h-6 text-[#7A302F]" />
                    <span className="font-mono text-xs font-bold text-[#3F2928]">UPLOAD FIRST DOCUMENT</span>
                    <span className="font-mono text-[10px] text-[#A58B7B]">PAN, Passport, Aadhaar, Bill (PDF/JPG/PNG)</span>
                  </button>
                )}
              </div>

              {/* Quick Pick From Inbox */}
              {documents.length > 0 && !file1 && (
                <div className="mt-3 pt-2 border-t border-[#3F2928]/30 font-mono text-[10px]">
                  <span className="text-[#A58B7B] block mb-1">Or pick from Case Inbox:</span>
                  <div className="flex flex-wrap gap-1">
                    {documents.slice(0, 3).map((d, idx) => (
                      <button
                        key={d.id}
                        onClick={() => handlePickFromInbox(idx, 1)}
                        className="px-2 py-1 bg-[#FFF8EA] border border-[#3F2928] text-[#3F2928] hover:bg-[#3F2928] hover:text-[#FFF8EA] transition-colors truncate max-w-[140px]"
                      >
                        {d.documentType}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DOCUMENT 2 */}
            <div className="p-4 bg-[#F3E4C8] border-2 border-[#3F2928] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-bold text-[#7A302F] uppercase">
                    DOCUMENT 2 (SECONDARY ID / PROOF)
                  </span>
                  {file2 && (
                    <button
                      onClick={() => { setFile2(null); setFile2Preview(null); setResult(null); }}
                      className="text-[#7A302F] hover:text-[#3F2928]"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef2}
                  onChange={handleSelectFile2}
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                />

                {file2 ? (
                  <div className="bg-[#FFF8EA] border border-[#3F2928] p-3 text-center">
                    {file2Preview ? (
                      <img
                        src={file2Preview}
                        alt="Doc 2 Preview"
                        className="max-h-32 mx-auto mb-2 object-contain border border-[#3F2928]"
                      />
                    ) : (
                      <FileText className="w-10 h-10 text-[#7A302F] mx-auto mb-2" />
                    )}
                    <div className="font-mono text-xs font-bold text-[#3F2928] truncate">{file2.name}</div>
                    <div className="font-mono text-[10px] text-[#A58B7B]">
                      {(file2.size / (1024 * 1024)).toFixed(2)} MB • {file2.type || 'Document'}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef2.current?.click()}
                    className="w-full py-8 px-4 bg-[#FFF8EA] hover:bg-[#FFF] border-2 border-dashed border-[#3F2928] text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Upload className="w-6 h-6 text-[#7A302F]" />
                    <span className="font-mono text-xs font-bold text-[#3F2928]">UPLOAD SECOND DOCUMENT</span>
                    <span className="font-mono text-[10px] text-[#A58B7B]">Aadhaar, Utility Bill, Bank Passbook</span>
                  </button>
                )}
              </div>

              {/* Quick Pick From Inbox */}
              {documents.length > 0 && !file2 && (
                <div className="mt-3 pt-2 border-t border-[#3F2928]/30 font-mono text-[10px]">
                  <span className="text-[#A58B7B] block mb-1">Or pick from Case Inbox:</span>
                  <div className="flex flex-wrap gap-1">
                    {documents.slice(0, 3).map((d, idx) => (
                      <button
                        key={d.id}
                        onClick={() => handlePickFromInbox(idx, 2)}
                        className="px-2 py-1 bg-[#FFF8EA] border border-[#3F2928] text-[#3F2928] hover:bg-[#3F2928] hover:text-[#FFF8EA] transition-colors truncate max-w-[140px]"
                      >
                        {d.documentType}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {errorMessage && (
            <div className="mt-4 p-3 bg-[#E8B9B8] border-2 border-[#7A302F] text-[#7A302F] font-mono text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleRunCrossCheck}
              disabled={!file1 || !file2 || isProcessing}
              className="bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-8 py-3.5 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] font-heading text-base sm:text-lg font-bold disabled:opacity-50 inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>ANALYZING & CROSS-CHECKING VIA GEMINI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>CROSS-CHECK WITH GEMINI FORENSICS</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Cross-Check Results Display */}
        {result && (
          <div className="space-y-6">
            
            {/* Verdict Banner */}
            <div className={`p-4 sm:p-6 border-2 border-[#3F2928] shadow-[6px_6px_0px_#3F2928] ${
              result.overallMatch ? 'bg-[#FFF8EA]' : 'bg-[#E8B9B8]'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#3F2928] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  {result.overallMatch ? (
                    <div className="w-8 h-8 rounded-full bg-[#7A302F] text-white flex items-center justify-center font-bold">
                      ✓
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#7A302F] text-white flex items-center justify-center font-bold">
                      ✕
                    </div>
                  )}
                  <div>
                    <span className="font-mono text-[10px] font-bold text-[#7A302F] uppercase block">
                      CROSS-CHECK VERDICT
                    </span>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#3F2928]">
                      {result.overallMatch ? 'IDENTITY DETAILS CONSISTENT' : 'CRITICAL DISCREPANCY DETECTED'}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-[#7A302F] block">MATCH SCORE</span>
                  <span className="font-heading text-3xl sm:text-4xl font-bold text-[#3F2928]">
                    {result.matchScore}%
                  </span>
                </div>
              </div>

              {/* Explanation Note */}
              <div className="p-3 bg-[#F3E4C8] border border-[#3F2928] font-mono text-xs text-[#3F2928] leading-relaxed">
                <strong className="text-[#7A302F]">FORENSIC EXPLANATION:</strong> {result.explanation}
              </div>

              <div className="mt-3 font-mono text-[10px] text-[#7A302F] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Notice: This cross-check evaluates consistency between the two submitted documents and does not declare legal authenticity.</span>
              </div>
            </div>

            {/* Field-by-Field Matrix Card */}
            <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-6 shadow-[6px_6px_0px_#3F2928]">
              <div className="font-mono text-xs font-bold text-[#3F2928] uppercase tracking-widest mb-4 flex justify-between items-center">
                <span>FIELD-BY-FIELD COMPARISON BREAKDOWN</span>
                <span className="text-[10px] text-[#7A302F]">
                  {result.document1Type || file1?.name} ↔ {result.document2Type || file2?.name}
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {result.fields && Object.entries(result.fields).map(([fieldKey, comp]) => {
                  if (!comp) return null;
                  const isMatch = comp.match === true;
                  const isMismatch = comp.match === false;
                  const isUnverified = comp.match === 'Unable to verify' || comp.match === 'UNABLE_TO_VERIFY';

                  const fieldLabels: Record<string, string> = {
                    name: 'Full Applicant Name',
                    dateOfBirth: 'Date of Birth (DOB)',
                    documentNumber: 'Document / ID Number',
                    gender: 'Gender',
                    address: 'Residential Address',
                    fatherOrSpouseName: "Father's / Spouse's Name",
                  };

                  const label = fieldLabels[fieldKey] || fieldKey.replace(/([A-Z])/g, ' $1').toUpperCase();

                  return (
                    <div
                      key={fieldKey}
                      className={`p-3.5 sm:p-4 border-2 ${
                        isMismatch 
                          ? 'border-[#7A302F] bg-[#E8B9B8]' 
                          : isMatch 
                          ? 'border-[#3F2928] bg-[#F3E4C8]' 
                          : 'border-[#3F2928] bg-[#FFF8EA]'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3F2928] pb-2 mb-3">
                        <div className="font-heading text-base font-bold text-[#3F2928]">
                          {label}
                        </div>

                        {/* Status Badge */}
                        <div className="self-start sm:self-auto">
                          {isMatch && (
                            <span className="inline-flex items-center gap-1 bg-[#3F2928] text-[#FFF8EA] px-2 py-0.5 font-mono text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-green-400" /> MATCH ✓
                            </span>
                          )}
                          {isMismatch && (
                            <span className="inline-flex items-center gap-1 bg-[#7A302F] text-[#FFF8EA] px-2 py-0.5 font-mono text-[10px] font-bold">
                              <AlertTriangle className="w-3 h-3 text-white" /> MISMATCH ✕
                            </span>
                          )}
                          {isUnverified && (
                            <span className="inline-flex items-center gap-1 bg-[#A58B7B] text-[#FFF8EA] px-2 py-0.5 font-mono text-[10px] font-bold">
                              <HelpCircle className="w-3 h-3 text-white" /> UNABLE TO VERIFY
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Values Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                        <div className="p-2.5 bg-[#FFF8EA] border border-[#3F2928]">
                          <div className="text-[10px] text-[#A58B7B] font-bold uppercase mb-0.5">
                            DOCUMENT 1 ({result.document1Type || 'Doc 1'}):
                          </div>
                          <div className="font-bold text-xs sm:text-sm text-[#3F2928] break-words select-all">
                            {comp.document1 || 'Not detected'}
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#FFF8EA] border border-[#3F2928]">
                          <div className="text-[10px] text-[#A58B7B] font-bold uppercase mb-0.5">
                            DOCUMENT 2 ({result.document2Type || 'Doc 2'}):
                          </div>
                          <div className="font-bold text-xs sm:text-sm text-[#3F2928] break-words select-all">
                            {comp.document2 || 'Not detected'}
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {comp.notes && (
                        <div className="text-[11px] text-[#7A302F] font-semibold flex items-center gap-1 mt-1">
                          <span>Forensic Note: {comp.notes}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
