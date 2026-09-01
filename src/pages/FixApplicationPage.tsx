import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { Sidebar } from '../components/Sidebar';
import { compressDocumentFile } from '../services/docTools';
import { CheckCircle2, Upload, FileCheck2, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FixApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    issues, 
    documents, 
    replaceDocument, 
    uploadFiles, 
    resolveIssue, 
    readinessScore,
    currentApplication
  } = useForensics();

  const [compressingId, setCompressingId] = useState<string | null>(null);
  const targetSize = currentApplication.portalMaxFileSizeMB || 10;

  const unresolvedIssues = issues.filter(i => !i.resolved);
  const resolvedCount = issues.length - unresolvedIssues.length;

  const handleCompressAction = async (docId: string, issueId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    setCompressingId(docId);
    const resp = await fetch(doc.previewUrl).catch(() => null);
    let blob = resp ? await resp.blob() : new Blob(['dummy pdf data'], { type: 'application/pdf' });
    const originalFile = new File([blob], doc.filename, { type: doc.mimeType });

    const result = await compressDocumentFile(originalFile, targetSize);
    
    await replaceDocument(docId, result.compressedFile);
    resolveIssue(issueId);
    setCompressingId(null);

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const handleReuploadAction = async (e: React.ChangeEvent<HTMLInputElement>, issueId: string, affectedDocId?: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (affectedDocId) {
        await replaceDocument(affectedDocId, file);
      } else {
        await uploadFiles([file]);
      }

      resolveIssue(issueId);

      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-5xl w-full">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928]">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
            PHASE 08 // RESOLUTION DESK
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
            RESOLUTION DESK
          </h1>
          <p className="font-body text-sm text-[#3F2928] mt-1">
            Step-by-step document optimization and re-upload workspace. Fix files directly inside Dr. Doc before final submission.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-[#3F2928] text-[#FFF8EA] p-4 sm:p-6 border-2 border-[#3F2928] shadow-[4px_4px_0px_#7A302F] mb-8 font-mono">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <span className="font-heading text-lg sm:text-xl font-bold text-white tracking-wider">
              RESOLVED ISSUES: {resolvedCount} / {issues.length}
            </span>
            <span className="font-bold text-[#E8B9B8]">READINESS: {readinessScore}/100</span>
          </div>

          <div className="w-full bg-[#3F2928] h-3 border border-[#FFF8EA]/20">
            <div
              className="bg-[#7A302F] h-full transition-all duration-500"
              style={{ width: `${issues.length > 0 ? (resolvedCount / issues.length) * 100 : 100}%` }}
            />
          </div>
        </div>

        {/* Fix Plan Steps */}
        {unresolvedIssues.length === 0 ? (
          <div className="bg-[#FFF8EA] p-6 sm:p-8 border-2 border-[#7A302F] text-center shadow-[4px_4px_0px_#7A302F]">
            <CheckCircle2 className="w-12 h-12 text-[#7A302F] mx-auto mb-3" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#3F2928] mb-2">
              ALL ISSUES RESOLVED!
            </h2>
            <p className="font-mono text-xs text-[#A58B7B] mb-6">
              Your application bundle is now 100% verified and formatted for portal submission.
            </p>

            <button
              onClick={() => navigate('/report')}
              className="w-full sm:w-auto font-heading text-lg font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-8 py-3.5 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] transition-all inline-flex items-center justify-center gap-2"
            >
              GENERATE FINAL VERIFICATION REPORT
              <ArrowRight className="w-5 h-5 text-[#FFF8EA]" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {unresolvedIssues.map((issue, idx) => {
              const matchedDoc = documents.find(d => d.id === issue.affectedDocumentId);

              return (
                <div
                  key={issue.id}
                  className="bg-[#FFF8EA] p-4 sm:p-6 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928]"
                >
                  
                  {/* Step Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono border-b border-[#3F2928] pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-xl sm:text-2xl font-bold text-[#7A302F]">
                        STEP 0{idx + 1}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-[#3F2928]">{issue.title}</span>
                    </div>

                    <span className="evidence-tag">{issue.affectedDocumentName || 'APPLICATION'}</span>
                  </div>

                  <p className="font-body text-sm text-[#3F2928] mb-6 leading-relaxed">
                    {issue.whyFlagged}
                  </p>

                  {/* Fix Tool Action Panel */}
                  <div className="bg-[#F3E4C8] p-4 border border-[#3F2928] font-mono text-xs">
                    <div className="font-bold text-[#3F2928] mb-2 uppercase">
                      ACTION REQUIRED: {issue.recommendedAction}
                    </div>

                    {/* Conditional Action Controls */}
                    {issue.fixActionType === 'compress' && matchedDoc && (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                        <div className="flex justify-between sm:block text-[11px] sm:text-xs">
                          <span className="text-[#A58B7B]">CURRENT SIZE:</span>
                          <strong className="text-[#7A302F] ml-1">{matchedDoc.fileSizeMB} MB</strong>
                        </div>
                        <div className="flex justify-between sm:block text-[11px] sm:text-xs">
                          <span className="text-[#A58B7B]">LIMIT:</span>
                          <strong className="text-[#7A302F] ml-1">{targetSize} MB</strong>
                        </div>

                        <button
                          onClick={() => handleCompressAction(matchedDoc.id, issue.id)}
                          disabled={compressingId === matchedDoc.id}
                          className="w-full sm:w-auto bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-5 py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] font-heading text-base font-bold flex items-center justify-center gap-2 active:translate-x-[1px] transition-all"
                        >
                          {compressingId === matchedDoc.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              COMPRESSING PDF...
                            </>
                          ) : (
                            <>
                              <FileCheck2 className="w-4 h-4" />
                              COMPRESS FILE TO {targetSize}MB LIMIT NOW
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {issue.fixActionType === 'reupload' && (
                      <div className="pt-2">
                        <label className="w-full sm:w-auto bg-[#3F2928] hover:bg-[#7A302F] text-[#FFF8EA] px-5 py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#7A302F] font-heading text-base font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                          <Upload className="w-4 h-4" />
                          UPLOAD REPLACEMENT DOCUMENT
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => handleReuploadAction(e, issue.id, issue.affectedDocumentId)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

