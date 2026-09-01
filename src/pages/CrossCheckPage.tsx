import React, { useState, useRef } from 'react';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
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
  const { t } = useLanguage();

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

    if (doc.fileObj) {
      if (slot === 1) {
        setFile1(doc.fileObj);
        setFile1Preview(doc.previewUrl);
      } else {
        setFile2(doc.fileObj);
        setFile2Preview(doc.previewUrl);
      }
      setResult(null);
      setErrorMessage(null);
      return;
    }

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
        const blob = new Blob([doc.rawOcrText || 'Document content'], { type: doc.mimeType || 'text/plain' });
        const file = new File([blob], doc.filename, { type: doc.mimeType || 'text/plain' });
        if (slot === 1) { setFile1(file); setFile1Preview(doc.previewUrl); } else { setFile2(file); setFile2Preview(doc.previewUrl); }
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
      if (res && res.data) {
        setResult(res.data);
      } else {
        throw new Error(res?.message || 'Failed to complete cross-check');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while running cross-check analysis.');
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
        
        {/* Page Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928]">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
            PHASE 06 // {t.crossCheck.tag}
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
            {t.crossCheck.title}
          </h1>
          <p className="font-body text-sm text-[#3F2928] mt-1">
            {t.crossCheck.subtitle}
          </p>
        </div>

        {/* Upload Slots Section */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-6 shadow-[6px_6px_0px_#3F2928] mb-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#3F2928] pb-3 mb-6 font-mono text-xs font-bold">
            <span className="text-[#3F2928] flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-[#7A302F]" />
              {t.crossCheck.matrixTitle}
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
                    <span className="font-mono text-xs font-bold text-[#3F2928]">{t.common.upload} FIRST DOCUMENT</span>
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
                    <span className="font-mono text-xs font-bold text-[#3F2928]">{t.common.upload} SECOND DOCUMENT</span>
                    <span className="font-mono text-[10px] text-[#A58B7B]">Aadhaar, Utility Bill, Bank Statement (PDF/JPG/PNG)</span>
                  </button>
                )}
              </div>

              {/* Quick Pick From Inbox */}
              {documents.length > 1 && !file2 && (
                <div className="mt-3 pt-2 border-t border-[#3F2928]/30 font-mono text-[10px]">
                  <span className="text-[#A58B7B] block mb-1">Or pick from Case Inbox:</span>
                  <div className="flex flex-wrap gap-1">
                    {documents.slice(1, 4).map((d, idx) => (
                      <button
                        key={d.id}
                        onClick={() => handlePickFromInbox(idx + 1, 2)}
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

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-[#3F2928] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-mono text-xs text-[#A58B7B]">
              Gemini Vision AI extracts names, DOBs, ID numbers, gender, and addresses to detect cross-document discrepancies.
            </div>

            <button
              onClick={handleRunCrossCheck}
              disabled={!file1 || !file2 || isProcessing}
              className="w-full sm:w-auto bg-[#7A302F] hover:bg-[#5c2322] disabled:opacity-50 text-[#FFF8EA] font-heading text-lg font-bold px-8 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  ANALYZING BOTH DOCUMENTS...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  RUN CROSS-CHECK ANALYSIS
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 bg-[#E8B9B8] border border-[#7A302F] font-mono text-xs text-[#7A302F] font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            
            {/* Overall Verdict Banner */}
            <div
              className={`p-5 sm:p-6 border-2 shadow-[6px_6px_0px_#3F2928] bg-[#FFF8EA] ${
                result.overallMatch ? 'border-[#3F2928]' : 'border-[#7A302F]'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#3F2928] pb-4 mb-4">
                <div>
                  <div className="font-mono text-xs font-bold text-[#A58B7B] uppercase mb-1">
                    OVERALL CONSISTENCY VERDICT
                  </div>
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-[#3F2928] flex items-center gap-2">
                    {result.overallMatch ? (
                      <><CheckCircle2 className="w-6 h-6 text-green-700" /> {t.crossCheck.allMatch}</>
                    ) : (
                      <><ShieldAlert className="w-6 h-6 text-[#7A302F]" /> {t.crossCheck.mismatchDetected}</>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <div className="text-[10px] text-[#A58B7B]">{t.crossCheck.consistencyScore}</div>
                    <div className="text-2xl font-bold text-[#7A302F]">{result.matchScore}%</div>
                  </div>
                  <span className={`stamp text-xs ${result.overallMatch ? 'stamp-verified' : 'stamp-critical'}`}>
                    {result.overallMatch ? 'MATCH ✓' : 'MISMATCH ✕'}
                  </span>
                </div>
              </div>

              {/* Forensic Explanation */}
              <p className="font-body text-sm sm:text-base text-[#3F2928] leading-relaxed">
                {result.explanation}
              </p>
            </div>

            {/* Field Comparison Table */}
            <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-6 shadow-[4px_4px_0px_#3F2928]">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#3F2928] mb-4 border-b border-[#3F2928] pb-2">
                {t.crossCheck.fieldComparison}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-[#3F2928] text-[#FFF8EA]">
                      <th className="p-2.5 border border-[#3F2928]">FIELD NAME</th>
                      <th className="p-2.5 border border-[#3F2928]">DOCUMENT 1 VALUE</th>
                      <th className="p-2.5 border border-[#3F2928]">DOCUMENT 2 VALUE</th>
                      <th className="p-2.5 border border-[#3F2928]">VERDICT</th>
                      <th className="p-2.5 border border-[#3F2928]">FORENSIC NOTE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.fields || {}).map(([key, item]: [string, any]) => {
                      const isMatch = item.match === true;
                      const isMismatch = item.match === false;

                      return (
                        <tr key={key} className="border-b border-[#3F2928] hover:bg-[#F3E4C8] text-[#3F2928]">
                          <td className="p-2.5 border border-[#3F2928] font-bold capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </td>
                          <td className="p-2.5 border border-[#3F2928] max-w-[150px] truncate font-medium">
                            {item.document1 || 'Not detected'}
                          </td>
                          <td className="p-2.5 border border-[#3F2928] max-w-[150px] truncate font-medium">
                            {item.document2 || 'Not detected'}
                          </td>
                          <td className="p-2.5 border border-[#3F2928] font-bold">
                            {isMatch ? (
                              <span className="text-green-800 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> MATCH
                              </span>
                            ) : isMismatch ? (
                              <span className="text-[#7A302F] flex items-center gap-1 font-bold">
                                <AlertTriangle className="w-3.5 h-3.5" /> MISMATCH
                              </span>
                            ) : (
                              <span className="text-[#A58B7B] flex items-center gap-1">
                                <HelpCircle className="w-3.5 h-3.5" /> UNABLE TO VERIFY
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 border border-[#3F2928] text-[11px] text-[#3F2928]">
                            {item.notes || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
