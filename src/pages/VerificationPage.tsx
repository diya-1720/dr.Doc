import React from 'react';
import { Link } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { Sidebar } from '../components/Sidebar';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Upload
} from 'lucide-react';

export const VerificationPage: React.FC = () => {
  const { readinessScore, currentApplication, documents, issues, crossChecks } = useForensics();

  const isEvaluated = documents.length > 0;
  const verifiedCount = documents.filter(d => d.verificationStatus === 'VERIFIED').length;
  const reviewCount = documents.filter(d => d.verificationStatus === 'NEEDS REVIEW').length;
  
  // Required documents count calculation
  const requiredList = currentApplication.requiredDocuments;
  const providedCount = requiredList.filter(reqType => 
    documents.some(d => d.documentType === reqType || (d.category as string) === reqType)
  ).length;
  const missingCount = Math.max(0, requiredList.length - providedCount);

  const isReady = isEvaluated && readinessScore >= 85 && issues.filter(i => i.severity === 'CRITICAL' && !i.resolved).length === 0;
  const unresolvedIssues = issues.filter(i => !i.resolved);

  // Verification Summary Meters
  const validityScore = isEvaluated ? Math.min(98, Math.max(60, Math.round((verifiedCount / documents.length) * 100))) : 0;
  const qualityScore = isEvaluated 
    ? Math.round(documents.reduce((acc, d) => acc + d.quality.overallScore, 0) / documents.length) 
    : 0;
  const consistencyScore = isEvaluated && crossChecks.length > 0
    ? Math.round(((crossChecks.length - crossChecks.filter(c => c.status === 'MISMATCH').length) / crossChecks.length) * 100)
    : (isEvaluated ? 100 : 0);
  const completenessScore = Math.round((providedCount / requiredList.length) * 100);

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8 pb-4 border-b-2 border-[#3F2928]">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
            DOCUMENT VERIFICATION
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
            APPLICATION READINESS
          </h1>
          <p className="font-body text-sm sm:text-base text-[#3F2928] mt-1">
            Application: <strong className="font-bold text-[#7A302F]">{currentApplication.name}</strong>
          </p>
        </div>

        {/* 1. Readiness Score Card */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-5 sm:p-8 shadow-[6px_6px_0px_#3F2928] mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div>
              <div className="font-mono text-xs font-bold text-[#A58B7B] uppercase mb-1 tracking-wider">
                APPLICATION READINESS SCORE
              </div>

              {!isEvaluated ? (
                <div>
                  <div className="font-heading text-3xl sm:text-4xl font-bold text-[#A58B7B] uppercase tracking-wider my-2">
                    NOT EVALUATED
                  </div>
                  <p className="font-mono text-xs text-[#7A302F]">
                    Upload your required documents to calculate application readiness.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-[#7A302F]">
                      {readinessScore}
                    </span>
                    <span className="font-heading text-2xl sm:text-3xl font-bold text-[#A58B7B]">/ 100</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`stamp text-xs sm:text-sm ${
                        isReady ? 'stamp-verified' : 'stamp-critical'
                      }`}
                    >
                      {isReady ? 'READY FOR SUBMISSION ✓' : 'ACTION REQUIRED'}
                    </span>
                  </div>

                  {/* Analyzed Documents Micro Stats Breakdown */}
                  <div className="mt-4 pt-3 border-t border-[#3F2928]/20 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-[#3F2928]">
                    <span><strong className="text-[#3F2928]">{documents.length}</strong> documents analyzed</span>
                    <span className="text-[#A58B7B]">•</span>
                    <span><strong className="text-[#7A302F]">{verifiedCount}</strong> verified</span>
                    <span className="text-[#A58B7B]">•</span>
                    <span><strong className="text-[#7A302F]">{reviewCount}</strong> needs review</span>
                    <span className="text-[#A58B7B]">•</span>
                    <span><strong className="text-[#7A302F]">{missingCount}</strong> missing</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
              {!isEvaluated ? (
                <Link
                  to="/documents"
                  className="font-heading text-base sm:text-lg font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-6 py-3.5 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Upload className="w-5 h-5 text-[#FFF8EA]" />
                  UPLOAD DOCUMENTS TO START
                </Link>
              ) : (
                <>
                  <Link
                    to="/fix"
                    className="font-heading text-base sm:text-lg font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 text-center"
                  >
                    GO TO FIX APPLICATION WORKFLOW
                    <ArrowRight className="w-5 h-5 text-[#FFF8EA]" />
                  </Link>
                  <Link
                    to="/report"
                    className="font-mono text-xs uppercase font-bold bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928] px-4 py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] text-center"
                  >
                    VIEW FULL VERIFICATION REPORT →
                  </Link>
                </>
              )}
            </div>

          </div>

          {/* Progress Bar */}
          {isEvaluated && (
            <div className="w-full bg-[#F3E4C8] h-3 border border-[#3F2928] mt-6">
              <div
                className="bg-[#7A302F] h-full transition-all duration-700"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          )}
        </div>

        {/* 2. Required Documents Checklist */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-6 shadow-[4px_4px_0px_#3F2928] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3F2928] pb-3 mb-4">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928]">
              REQUIRED DOCUMENTS
            </h2>
            <div className="font-mono text-xs font-bold text-[#7A302F] bg-[#F3E4C8] px-3 py-1 border border-[#3F2928]">
              {providedCount} / {requiredList.length} DOCUMENTS PROVIDED
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 font-mono text-xs">
            {requiredList.map((reqType) => {
              const matchedDoc = documents.find(d => d.documentType === reqType || (d.category as string) === reqType);
              const isVerified = matchedDoc?.verificationStatus === 'VERIFIED';
              const isReview = matchedDoc?.verificationStatus === 'NEEDS REVIEW';
              const isMissing = !matchedDoc;

              return (
                <div
                  key={reqType}
                  className={`p-3.5 sm:p-4 border-2 flex items-center justify-between transition-all ${
                    isVerified
                      ? 'bg-[#FFF8EA] border-[#3F2928]'
                      : isReview
                      ? 'bg-[#F3E4C8] border-[#7A302F]'
                      : 'bg-[#E8B9B8]/40 border-[#7A302F]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isVerified && <CheckCircle2 className="w-5 h-5 text-[#7A302F] shrink-0" />}
                    {isReview && <AlertTriangle className="w-5 h-5 text-[#7A302F] shrink-0" />}
                    {isMissing && <XCircle className="w-5 h-5 text-[#7A302F] shrink-0" />}
                    
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#3F2928]">
                        {isVerified ? `✓ ${reqType}` : isReview ? `⚠ ${reqType}` : `○ ${reqType}`}
                      </div>
                      <div className="text-[10px] text-[#A58B7B] truncate max-w-[160px] sm:max-w-[220px] mt-0.5">
                        {matchedDoc ? matchedDoc.filename : 'NOT PROVIDED YET'}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-bold text-[10px] uppercase px-2.5 py-1 border shrink-0 ${
                      isVerified
                        ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928]'
                        : isReview
                        ? 'bg-[#7A302F] text-[#FFF8EA] border-[#7A302F]'
                        : 'bg-[#E8B9B8] text-[#7A302F] border-[#7A302F]'
                    }`}
                  >
                    {isVerified ? 'VERIFIED ✓' : isReview ? 'NEEDS REVIEW ⚠' : 'MISSING ✕'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Verification Summary & 4. Issue Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Verification Summary Meters (Left / 7 cols) */}
          <div className="lg:col-span-7 bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-6 shadow-[4px_4px_0px_#3F2928]">
            <div className="font-mono text-xs font-bold text-[#3F2928] uppercase tracking-widest mb-4 border-b border-[#3F2928] pb-2">
              VERIFICATION SUMMARY
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              
              {/* Meter 1: Document Validity */}
              <div className="p-3 bg-[#F3E4C8] border border-[#3F2928]">
                <div className="text-[#A58B7B] text-[10px] font-bold uppercase">Document Validity</div>
                <div className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928] my-1">
                  {validityScore}%
                </div>
                <div className="w-full h-1.5 bg-[#FFF8EA] border border-[#3F2928]">
                  <div className="bg-[#7A302F] h-full" style={{ width: `${validityScore}%` }} />
                </div>
              </div>

              {/* Meter 2: Document Quality */}
              <div className="p-3 bg-[#F3E4C8] border border-[#3F2928]">
                <div className="text-[#A58B7B] text-[10px] font-bold uppercase">Document Quality</div>
                <div className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928] my-1">
                  {qualityScore}%
                </div>
                <div className="w-full h-1.5 bg-[#FFF8EA] border border-[#3F2928]">
                  <div className="bg-[#7A302F] h-full" style={{ width: `${qualityScore}%` }} />
                </div>
              </div>

              {/* Meter 3: Information Consistency */}
              <div className="p-3 bg-[#F3E4C8] border border-[#3F2928]">
                <div className="text-[#A58B7B] text-[10px] font-bold uppercase">Info Consistency</div>
                <div className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928] my-1">
                  {consistencyScore}%
                </div>
                <div className="w-full h-1.5 bg-[#FFF8EA] border border-[#3F2928]">
                  <div className="bg-[#7A302F] h-full" style={{ width: `${consistencyScore}%` }} />
                </div>
              </div>

              {/* Meter 4: Completeness */}
              <div className="p-3 bg-[#F3E4C8] border border-[#3F2928]">
                <div className="text-[#A58B7B] text-[10px] font-bold uppercase">Completeness</div>
                <div className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928] my-1">
                  {completenessScore}%
                </div>
                <div className="w-full h-1.5 bg-[#FFF8EA] border border-[#3F2928]">
                  <div className="bg-[#7A302F] h-full" style={{ width: `${completenessScore}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* Issue Summary Section (Right / 5 cols) */}
          <div className="lg:col-span-5 bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-6 shadow-[4px_4px_0px_#3F2928] flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-4 border-b border-[#3F2928] pb-2 flex items-center justify-between">
                <span>ISSUES REQUIRING ATTENTION</span>
                {unresolvedIssues.length > 0 && (
                  <span className="bg-[#7A302F] text-[#FFF8EA] px-1.5 py-0.2 text-[10px]">
                    {unresolvedIssues.length}
                  </span>
                )}
              </div>

              {unresolvedIssues.length === 0 ? (
                <div className="p-4 bg-[#F3E4C8] border border-[#3F2928] text-center font-mono text-xs my-auto py-6">
                  <CheckCircle2 className="w-8 h-8 text-[#7A302F] mx-auto mb-2" />
                  <div className="font-bold text-sm text-[#3F2928] mb-1">✓ NO ISSUES FOUND</div>
                  <div className="text-[11px] text-[#A58B7B]">
                    {isEvaluated 
                      ? 'All uploaded documents comply with application rules and requirements.'
                      : 'Upload files to check for potential mismatches or errors.'}
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 font-mono text-xs mb-4">
                  {unresolvedIssues.slice(0, 3).map((issue) => (
                    <div
                      key={issue.id}
                      className="p-2.5 bg-[#E8B9B8]/40 border border-[#7A302F] flex items-start gap-2 text-[#3F2928]"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#7A302F] shrink-0 mt-0.5" />
                      <div className="line-clamp-2 leading-tight">
                        <strong className="text-[#7A302F]">{issue.title}:</strong> {issue.whyFlagged}
                      </div>
                    </div>
                  ))}
                  {unresolvedIssues.length > 3 && (
                    <div className="text-[10px] font-mono text-[#A58B7B] text-center">
                      + {unresolvedIssues.length - 3} more issue(s) flagged
                    </div>
                  )}
                </div>
              )}
            </div>

            {unresolvedIssues.length > 0 && (
              <Link
                to="/issues"
                className="mt-4 font-mono text-xs uppercase font-bold bg-[#3F2928] hover:bg-[#7A302F] text-[#FFF8EA] py-2.5 px-4 border border-[#3F2928] shadow-[2px_2px_0px_#7A302F] text-center transition-colors block"
              >
                REVIEW ISSUES ({unresolvedIssues.length}) →
              </Link>
            )}
          </div>

        </div>

      </main>
    </div>
  );
};
