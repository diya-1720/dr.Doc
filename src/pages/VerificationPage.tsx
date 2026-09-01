import React from 'react';
import { Link } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { Sidebar } from '../components/Sidebar';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight
} from 'lucide-react';

export const VerificationPage: React.FC = () => {
  const { readinessScore, currentApplication, documents, issues, crossChecks, caseId } = useForensics();

  const isReady = readinessScore >= 85 && issues.filter(i => i.severity === 'CRITICAL' && !i.resolved).length === 0;

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-6xl">
        
        {/* Header */}
        <div className="mb-8 pb-4 border-b-2 border-[#3F2928]">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
            PHASE 05 // APPLICATION AUDIT & READINESS EVALUATION
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-[#3F2928]">
            APPLICATION CHECKUP SUMMARY
          </h1>
          <p className="font-body text-base text-[#3F2928] mt-1">
            Target Application Profile: <strong>{currentApplication.name}</strong> | CASE ID: <strong>{caseId}</strong>
          </p>
        </div>

        {/* Big Readiness Score Hero Banner */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-8 shadow-[6px_6px_0px_#3F2928] mb-8 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div>
              <div className="font-mono text-xs font-bold text-[#A58B7B] uppercase mb-1">
                OVERALL APPLICATION READINESS SCORE
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-6xl md:text-7xl font-bold text-[#7A302F]">
                  {readinessScore}
                </span>
                <span className="font-heading text-3xl font-bold text-[#A58B7B]">/ 100</span>
              </div>
              <div className="mt-2">
                <span
                  className={`stamp ${
                    isReady ? 'stamp-verified' : 'stamp-critical'
                  }`}
                >
                  {isReady ? 'READY FOR SUBMISSION' : 'ACTION REQUIRED BEFORE SUBMISSION'}
                </span>
              </div>
            </div>

            {/* CTA to Fix or Report */}
            <div className="flex flex-col gap-3">
              <Link
                to="/fix"
                className="font-heading text-lg font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
              >
                GO TO FIX APPLICATION WORKFLOW
                <ArrowRight className="w-5 h-5 text-[#FFF8EA]" />
              </Link>
              <Link
                to="/report"
                className="font-mono text-xs uppercase font-bold bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928] px-4 py-2 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] text-center"
              >
                VIEW FULL FORENSIC REPORT →
              </Link>
            </div>

          </div>

          {/* Score Progress Bar */}
          <div className="w-full bg-[#F3E4C8] h-3 border border-[#3F2928] mt-6">
            <div
              className="bg-[#7A302F] h-full transition-all duration-700"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        {/* Document Requirement Status Checklist Grid */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-6 shadow-[4px_4px_0px_#3F2928] mb-8">
          <div className="font-mono text-xs font-bold text-[#3F2928] uppercase tracking-widest mb-4">
            REQUIRED DOCUMENT BUNDLE STATUS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {currentApplication.requiredDocuments.map((reqType) => {
              const matchedDoc = documents.find(d => d.documentType === reqType);
              const isVerified = matchedDoc?.verificationStatus === 'VERIFIED';
              const isReview = matchedDoc?.verificationStatus === 'NEEDS REVIEW';
              const isMissing = !matchedDoc;

              return (
                <div
                  key={reqType}
                  className={`p-4 border flex items-center justify-between ${
                    isVerified
                      ? 'bg-[#FFF8EA] border-[#7A302F]'
                      : 'bg-[#E8B9B8] border-[#7A302F]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isVerified && <CheckCircle2 className="w-5 h-5 text-[#7A302F]" />}
                    {isReview && <AlertTriangle className="w-5 h-5 text-[#7A302F]" />}
                    {isMissing && <XCircle className="w-5 h-5 text-[#7A302F]" />}
                    
                    <div>
                      <div className="font-bold text-sm text-[#3F2928]">{reqType}</div>
                      <div className="text-[10px] text-[#A58B7B]">
                        {matchedDoc ? matchedDoc.filename : 'MISSING FILE'}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-bold text-[10px] uppercase px-2 py-0.5 border ${
                      isVerified
                        ? 'bg-[#FFF8EA] text-[#7A302F] border-[#7A302F]'
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

        {/* 6 Verification Categories Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          
          <div className="p-4 bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928]">
            <div className="text-[#A58B7B] font-bold mb-1">01 COMPLETENESS</div>
            <div className="font-bold text-sm mb-2 text-[#3F2928]">
              {documents.length} / {currentApplication.requiredDocuments.length} Uploaded
            </div>
            <div className="text-[11px] text-[#A58B7B]">
              Checks mandatory document count against target application checklist.
            </div>
          </div>

          <div className="p-4 bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928]">
            <div className="text-[#A58B7B] font-bold mb-1">02 VALIDITY & RULES</div>
            <div className="font-bold text-sm mb-2 text-[#3F2928]">
              File Size & Limits Checked
            </div>
            <div className="text-[11px] text-[#A58B7B]">
              Verifies compliance with maximum portal attachment size limits (e.g. 10MB).
            </div>
          </div>

          <div className="p-4 bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928]">
            <div className="text-[#A58B7B] font-bold mb-1">03 CONSISTENCY</div>
            <div className="font-bold text-sm mb-2 text-[#7A302F]">
              {crossChecks.filter(c => c.status === 'MISMATCH').length} Inconsistency Found
            </div>
            <div className="text-[11px] text-[#A58B7B]">
              Cross-checks applicant names, date of birth, and addresses across all files.
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
