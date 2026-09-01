import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
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
  const { t } = useLanguage();

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
            PHASE 08 // {t.fix.tag}
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
            {t.fix.title}
          </h1>
          <p className="font-body text-sm text-[#3F2928] mt-1">
            {t.fix.subtitle}
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-[#3F2928] text-[#FFF8EA] p-4 sm:p-6 border-2 border-[#3F2928] shadow-[4px_4px_0px_#7A302F] mb-8 font-mono">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <span className="font-heading text-lg sm:text-xl font-bold text-white tracking-wider">
              {t.issues.resolvedTab}: {resolvedCount} / {issues.length}
            </span>
            <span className="font-bold text-[#E8B9B8]">{t.home.readinessScore}: {readinessScore}/100</span>
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
              {t.verification.noIssuesFound}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#3F2928] mb-6 max-w-lg mx-auto">
              {t.verification.noIssuesDesc}
            </p>

            <button
              onClick={() => navigate('/report')}
              className="bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] font-heading text-lg font-bold px-8 py-3.5 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] inline-flex items-center gap-2"
            >
              {t.verification.viewReportBtn}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {unresolvedIssues.map((issue, idx) => (
              <div
                key={issue.id}
                className="bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-6 shadow-[4px_4px_0px_#3F2928] relative"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#3F2928] pb-3 mb-4 font-mono text-xs">
                  <span className="font-bold text-[#7A302F] uppercase">
                    STEP {idx + 1}: {issue.severity}
                  </span>
                  <span className="evidence-tag">{issue.affectedDocumentName || 'APPLICATION GENERAL'}</span>
                </div>

                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928] mb-2">
                  {issue.title}
                </h3>
                <p className="font-mono text-xs text-[#3F2928] mb-4">
                  {issue.whyFlagged}
                </p>

                {/* Built-in Fix Actions */}
                <div className="bg-[#F3E4C8] p-4 border border-[#3F2928] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-mono text-xs">
                  <div>
                    <span className="text-[#A58B7B] block text-[10px] uppercase font-bold">
                      {t.issues.suggestedFix}
                    </span>
                    <strong className="text-[#7A302F] block mt-0.5">{issue.recommendedAction}</strong>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {issue.fixActionType === 'compress' && issue.affectedDocumentId ? (
                      <button
                        onClick={() => handleCompressAction(issue.affectedDocumentId!, issue.id)}
                        disabled={compressingId === issue.affectedDocumentId}
                        className="bg-[#7A302F] hover:bg-[#5c2322] disabled:opacity-50 text-[#FFF8EA] px-5 py-2.5 border border-[#3F2928] font-bold text-xs shadow-[2px_2px_0px_#3F2928] flex items-center gap-2"
                      >
                        {compressingId === issue.affectedDocumentId ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> COMPRESSING...</>
                        ) : (
                          <><FileCheck2 className="w-4 h-4" /> {t.fix.compressPdfTool}</>
                        )}
                      </button>
                    ) : (
                      <label className="cursor-pointer bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-5 py-2.5 border border-[#3F2928] font-bold text-xs shadow-[2px_2px_0px_#3F2928] flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>{t.fix.replaceDocTool}</span>
                        <input
                          type="file"
                          onChange={(e) => handleReuploadAction(e, issue.id, issue.affectedDocumentId)}
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          className="hidden"
                        />
                      </label>
                    )}

                    <button
                      onClick={() => resolveIssue(issue.id)}
                      className="bg-[#FFF8EA] hover:bg-[#F3E4C8] text-[#3F2928] px-3 py-2.5 border border-[#3F2928] font-bold text-xs"
                      title="Dismiss/Resolve manually"
                    >
                      {t.common.confirm}
                    </button>
                  </div>
                </div>

              </div>
            ))}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => navigate('/verification')}
                className="font-heading text-lg font-bold bg-[#3F2928] text-[#FFF8EA] hover:bg-[#7A302F] px-8 py-3.5 border border-[#3F2928] shadow-[3px_3px_0px_#7A302F] transition-colors"
              >
                {t.fix.reEvaluateBtn}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
