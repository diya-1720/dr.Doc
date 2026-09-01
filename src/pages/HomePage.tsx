import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  ShieldAlert, 
  ArrowRight, 
  FileWarning, 
  Layers, 
  GitCompare, 
  Play
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { loadDemoMode, documents, readinessScore, issues, currentApplication, caseId } = useForensics();
  const { t } = useLanguage();

  const unresolvedIssues = issues.filter(i => !i.resolved);
  const verifiedDocsCount = documents.filter(d => d.verificationStatus === 'VERIFIED').length;
  const isEvaluated = documents.length > 0;

  const handleStartCheckup = () => {
    navigate('/verify');
  };

  const handleTryDemo = () => {
    loadDemoMode();
    navigate('/documents');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3E4C8]">
      
      {/* HERO SECTION */}
      <section className="relative pt-8 md:pt-12 pb-12 md:pb-20 px-4 md:px-8 border-b-2 border-[#3F2928] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 z-10">
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3F2928] text-[#FFF8EA] font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6 border border-[#3F2928] shadow-[2px_2px_0px_#7A302F]">
              <span className="w-2 h-2 rounded-full bg-[#D47794] animate-pulse" />
              {isEvaluated ? `CASE ${caseId} ACTIVE (${documents.length}/5 DOCS)` : t.home.heroTag}
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#3F2928] leading-none mb-4 md:mb-6">
              {t.home.heroTitleLine1}<br />
              <span className="text-[#7A302F]">{t.home.heroTitleLine2}</span>
            </h1>

            {/* Subheadline */}
            <p className="font-body text-base sm:text-lg lg:text-xl text-[#3F2928] leading-relaxed mb-6 md:mb-8 max-w-xl">
              {t.home.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              <button
                onClick={handleStartCheckup}
                className="w-full sm:w-auto font-heading text-lg sm:text-xl font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-6 sm:px-8 py-3.5 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] hover:shadow-[6px_6px_0px_#3F2928] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3"
              >
                {isEvaluated ? 'RESUME CASE VERIFICATION' : t.home.startCheckupBtn}
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFF8EA]" />
              </button>

              <button
                onClick={handleTryDemo}
                className="w-full sm:w-auto font-mono text-xs sm:text-sm uppercase font-bold bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928] px-5 sm:px-6 py-3.5 sm:py-4 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-[#7A302F]" fill="#7A302F" />
                {t.home.exploreDemoBtn}
              </button>
            </div>

            {/* Micro Stats */}
            <div className="mt-8 md:mt-10 pt-4 sm:pt-6 border-t border-[#3F2928]/20 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-[#3F2928]">
              <div>
                <span className="block font-bold text-sm sm:text-base text-[#3F2928]">
                  {isEvaluated ? `${documents.length} OF 5 DOCS` : t.home.stat1Title}
                </span>
                <span className="text-[#A58B7B] text-[11px]">
                  {isEvaluated ? `${verifiedDocsCount} Verified Compliant` : t.home.stat1Desc}
                </span>
              </div>
              <div>
                <span className="block font-bold text-sm sm:text-base text-[#7A302F]">
                  {isEvaluated ? `${readinessScore} / 100` : t.home.stat2Title}
                </span>
                <span className="text-[#A58B7B] text-[11px]">
                  {isEvaluated ? currentApplication.name : t.home.stat2Desc}
                </span>
              </div>
              <div>
                <span className="block font-bold text-sm sm:text-base text-[#7A302F]">
                  {isEvaluated ? `${unresolvedIssues.length} ISSUES` : t.home.stat3Title}
                </span>
                <span className="text-[#A58B7B] text-[11px]">
                  {isEvaluated ? (unresolvedIssues.length === 0 ? 'All Checks Passed' : 'Action Required') : t.home.stat3Desc}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Visual Desk Scene */}
          <div className="lg:col-span-6 relative w-full flex justify-center items-center lg:-mt-6">
            
            {/* Investigation Desk Board Background */}
            <div className="relative w-full max-w-lg bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-5 shadow-[6px_6px_0px_#3F2928] md:shadow-[8px_8px_0px_#3F2928] flex flex-col justify-between overflow-hidden">
              
              {/* Top Desk Header */}
              <div className="flex justify-between items-center font-mono text-xs font-bold border-b-2 border-[#3F2928] pb-2 text-[#3F2928]">
                <span>EVIDENCE DESK // {caseId}</span>
                <span className="text-[#7A302F]">{isEvaluated ? 'CASE IN PROGRESS' : 'LIVE ANALYSIS BOARD'}</span>
              </div>

              {/* Physical Document Sheets Stacked */}
              <div className="relative my-3 sm:my-4 h-[250px] sm:h-[280px]">
                
                {/* Document 1: (Rotated Left) */}
                <div className="absolute top-1 sm:top-2 left-1 sm:left-3 w-44 sm:w-52 p-3 bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[4px_4px_0px_rgba(63,41,40,0.15)] transform -rotate-3 transition-transform hover:rotate-0 duration-300 z-10">
                  <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] text-[#A58B7B] border-b border-[#3F2928] pb-1 mb-1 sm:mb-1.5">
                    <span>{documents[0]?.category || 'GOVT IDENTITY'}</span>
                    <span className="text-[#7A302F] font-bold">{documents[0]?.verificationStatus === 'VERIFIED' ? 'VERIFIED ✓' : 'EXAMINED'}</span>
                  </div>
                  <div className="font-heading text-xs sm:text-sm font-bold text-[#3F2928] truncate">
                    {documents[0]?.documentType || 'AADHAAR CARD'}
                  </div>
                  <div className="font-mono text-[10px] sm:text-xs text-[#3F2928] mt-0.5 truncate">
                    Name: <span className="font-bold underline decoration-[#7A302F]">{documents[0]?.extractedFields?.find(f => f.key.includes('name'))?.value || 'Rahul Kumar'}</span>
                  </div>
                  <div className="font-mono text-[9px] text-[#A58B7B] mt-0.5 truncate">
                    {documents[0]?.extractedFields?.find(f => f.key.includes('number') || f.key.includes('id'))?.value || 'UID: •••• •••• 4912'}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="evidence-tag text-[9px]">CONFIDENCE {documents[0]?.confidence || 97}%</span>
                    <span className="stamp stamp-verified text-[8px]">EXAMINED</span>
                  </div>
                </div>

                {/* Document 2: (Rotated Right) */}
                <div className="absolute top-6 sm:top-8 right-1 sm:right-3 w-48 sm:w-56 p-3 bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[6px_6px_0px_rgba(63,41,40,0.2)] transform rotate-2 z-20 transition-transform hover:rotate-0 duration-300">
                  <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] text-[#A58B7B] border-b border-[#3F2928] pb-1 mb-1 sm:mb-1.5">
                    <span>{documents[1]?.category || 'TAX RECORD'}</span>
                    <span className="text-[#7A302F] font-bold">{documents[1]?.verificationStatus === 'VERIFIED' ? 'VERIFIED ✓' : 'EXAMINED'}</span>
                  </div>
                  <div className="font-heading text-xs sm:text-sm font-bold text-[#3F2928] truncate">
                    {documents[1]?.documentType || 'PAN CARD'}
                  </div>
                  <div className="font-mono text-[10px] sm:text-xs text-[#3F2928] mt-0.5 truncate">
                    Name: <span className="font-bold underline decoration-[#7A302F]">{documents[1]?.extractedFields?.find(f => f.key.includes('name'))?.value || 'Rahul Kumar'}</span>
                  </div>
                  <div className="font-mono text-[9px] text-[#A58B7B] mt-0.5 truncate">
                    {documents[1]?.extractedFields?.find(f => f.key.includes('number') || f.key.includes('id'))?.value || 'PAN: ABCDE1234F'}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="evidence-tag text-[9px]">CONFIDENCE {documents[1]?.confidence || 99}%</span>
                    <span className="stamp stamp-verified text-[8px]">MATCHED</span>
                  </div>
                </div>

                {/* Document 3 / Flagged Item */}
                <div className="absolute top-20 sm:top-24 left-4 sm:left-10 w-52 sm:w-60 p-3 bg-[#FFF8EA] border-2 border-[#7A302F] shadow-[8px_8px_0px_rgba(122,48,47,0.25)] transform -rotate-1 z-30 transition-transform hover:rotate-0 duration-300">
                  <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] text-[#7A302F] font-bold border-b border-[#7A302F] pb-1 mb-1 sm:mb-1.5">
                    <span>{documents[2]?.category || 'ADDRESS PROOF'}</span>
                    <span className="stamp stamp-critical text-[8px] py-0">
                      {unresolvedIssues.length > 0 ? 'FLAGGED ✕' : 'COMPLIANT ✓'}
                    </span>
                  </div>
                  <div className="font-heading text-xs sm:text-sm font-bold text-[#3F2928] truncate">
                    {documents[2]?.documentType || 'BANK STATEMENT'}
                  </div>
                  <div className="font-mono text-[10px] sm:text-xs text-[#3F2928] mt-0.5 truncate">
                    Name: <span className="font-bold text-[#7A302F] bg-[#E8B9B8] px-1">{documents[2]?.extractedFields?.find(f => f.key.includes('name'))?.value || 'R. Kumar'}</span>
                  </div>
                  <div className="font-mono text-[9px] text-[#7A302F] mt-0.5 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    {unresolvedIssues.length > 0 ? unresolvedIssues[0].title : 'ALL CHECKS PASSED'}
                  </div>
                  <div className="mt-1 text-[9px] font-mono text-[#A58B7B]">
                    Size: {documents[2]?.fileSizeMB || '14.8'} MB
                  </div>
                </div>

                {/* Red String Overlay SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-40">
                  <line x1="70" y1="45" x2="200" y2="65" stroke="#7A302F" strokeWidth="2" strokeDasharray="4,4" />
                  <line x1="200" y1="65" x2="130" y2="150" stroke="#7A302F" strokeWidth="2" strokeDasharray="3,3" />
                  <circle cx="200" cy="65" r="4" fill="#7A302F" />
                  <circle cx="130" cy="150" r="4" fill="#7A302F" />
                </svg>

                {/* Floating Mismatch Tag Annotation */}
                <div className="absolute bottom-0 right-0 sm:right-1 bg-[#3F2928] text-[#E8B9B8] px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold border border-[#E8B9B8] shadow-md z-50">
                  {isEvaluated ? `${readinessScore}% READINESS` : 'CROSS-DOCUMENT MATCH FAIL'}
                </div>
              </div>

              {/* Desk Footer bar */}
              <div className="flex justify-between items-center font-mono text-[10px] sm:text-[11px] text-[#3F2928] pt-2 border-t border-[#3F2928]">
                <span>READINESS SCORE: <strong className="text-[#7A302F]">{isEvaluated ? readinessScore : 78} / 100</strong></span>
                <span className="font-bold text-[#7A302F]">{isEvaluated && readinessScore >= 85 ? 'READY FOR SUBMISSION ✓' : 'ACTION REQUIRED'}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* MARQUEE SCROLLING TICKER */}
      <section className="bg-[#3F2928] text-[#FFF8EA] border-b-2 border-[#3F2928] py-2.5 md:py-3 overflow-hidden">
        <div className="animate-marquee font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap flex gap-6 sm:gap-8">
          <span>DOCUMENT INTELLIGENCE</span>
          <span className="text-[#D47794]">•</span>
          <span>OCR ANALYSIS</span>
          <span className="text-[#D47794]">•</span>
          <span>DOCUMENT CLASSIFICATION</span>
          <span className="text-[#D47794]">•</span>
          <span>CROSS-DOCUMENT VERIFICATION</span>
          <span className="text-[#D47794]">•</span>
          <span>QUALITY CHECK</span>
          <span className="text-[#D47794]">•</span>
          <span>APPLICATION READINESS</span>
          <span className="text-[#D47794]">•</span>
          <span>EVIDENCE REVIEW</span>
          <span className="text-[#D47794]">•</span>
          <span>DOCUMENT PREPARATION</span>
          <span className="text-[#D47794]">•</span>
          <span>RECHECK</span>
          <span className="text-[#D47794]">•</span>
          {/* Duplicate set for seamless infinite marquee loop */}
          <span>DOCUMENT INTELLIGENCE</span>
          <span className="text-[#D47794]">•</span>
          <span>OCR ANALYSIS</span>
          <span className="text-[#D47794]">•</span>
          <span>DOCUMENT CLASSIFICATION</span>
          <span className="text-[#D47794]">•</span>
          <span>CROSS-DOCUMENT VERIFICATION</span>
          <span className="text-[#D47794]">•</span>
          <span>QUALITY CHECK</span>
        </div>
      </section>

      {/* SECTION 1: THE PROBLEM */}
      <section className="py-12 md:py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#FFF8EA]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            SECTION 01 // CASE STUDY
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#3F2928] mb-8 md:mb-12">
            PAPERWORK SHOULD NOT BE THE REASON AN APPLICATION FAILS.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="case-card p-5 sm:p-6 border-2 border-[#3F2928] relative">
              <div className="evidence-tag mb-4 inline-block">EVIDENCE #01</div>
              <div className="w-12 h-12 bg-[#E8B9B8] text-[#7A302F] border border-[#7A302F] flex items-center justify-center font-bold mb-4">
                <FileWarning className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#3F2928] mb-2">
                MISSING DOCUMENT
              </h3>
              <p className="font-body text-sm text-[#3F2928] leading-relaxed">
                Portals reject applications instantly when a single required PDF or GST certificate is forgotten. Dr. Doc checks completeness against exact application profiles.
              </p>
            </div>

            {/* Card 2 */}
            <div className="case-card p-5 sm:p-6 border-2 border-[#3F2928] relative">
              <div className="evidence-tag mb-4 inline-block">EVIDENCE #02</div>
              <div className="w-12 h-12 bg-[#E8B9B8] text-[#7A302F] border border-[#7A302F] flex items-center justify-center font-bold mb-4">
                <GitCompare className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#3F2928] mb-2">
                NAME MISMATCH
              </h3>
              <p className="font-body text-sm text-[#3F2928] leading-relaxed">
                "Rahul Kumar" vs "R. Kumar" across PAN and Bank statements cause silent delays and manual rejections. Dr. Doc flags cross-document inconsistencies before submission.
              </p>
            </div>

            {/* Card 3 */}
            <div className="case-card p-5 sm:p-6 border-2 border-[#3F2928] relative">
              <div className="evidence-tag mb-4 inline-block">EVIDENCE #03</div>
              <div className="w-12 h-12 bg-[#E8B9B8] text-[#7A302F] border border-[#7A302F] flex items-center justify-center font-bold mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#3F2928] mb-2">
                WRONG / LOW-QUALITY FILE
              </h3>
              <p className="font-body text-sm text-[#3F2928] leading-relaxed">
                Blurry scans, incorrect PNG formats, or files exceeding strict 10MB portal size limits. Dr. Doc inspects text visibility and provides instant built-in tools to fix them.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: HOW DR. DOC WORKS */}
      <section className="py-12 md:py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#F3E4C8]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            SECTION 02 // EXAMINATION METHODOLOGY
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#3F2928] mb-8 md:mb-12">
            HOW DR. DOC WORKS
          </h2>

          {/* Workflow Sequence */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-xs">
            {[
              { num: '01', title: 'UPLOAD', desc: 'Drag 15 random files' },
              { num: '02', title: 'CLASSIFY', desc: 'Detect doc types' },
              { num: '03', title: 'EXTRACT', desc: 'OCR key fields' },
              { num: '04', title: 'VERIFY', desc: 'Quality & rules' },
              { num: '05', title: 'CROSS-CHECK', desc: 'Compare names' },
              { num: '06', title: 'FIX', desc: 'Compress/replace' },
              { num: '07', title: 'RECHECK', desc: 'Re-eval score' },
              { num: '08', title: 'READY', desc: 'Final case report' },
            ].map((step) => (
              <div
                key={step.num}
                className="bg-[#FFF8EA] p-3 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] flex flex-col justify-between h-28 sm:h-32"
              >
                <div className="font-heading text-xl sm:text-2xl font-bold text-[#7A302F]">
                  {step.num}
                </div>
                <div>
                  <div className="font-bold text-[#3F2928] uppercase tracking-wider text-[11px] sm:text-xs">{step.title}</div>
                  <div className="text-[10px] text-[#A58B7B] mt-0.5">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: SMART DOCUMENT CLASSIFICATION */}
      <section className="py-12 md:py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#FFF8EA]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            SECTION 03 // AUTOMATED INGESTION
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#3F2928] mb-8 md:mb-12">
            SMART DOCUMENT CLASSIFICATION
          </h2>

          {/* Before vs After Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Before */}
            <div className="lg:col-span-5 bg-[#F3E4C8] p-4 sm:p-6 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928]">
              <div className="font-mono text-xs font-bold text-[#7A302F] mb-3 sm:mb-4">
                BEFORE: 15 UNORGANIZED FILES
              </div>
              <div className="font-mono text-xs space-y-2 text-[#3F2928]">
                {['IMG_2837.png', 'scan001.pdf', 'document_final.pdf', 'photo.jpg', 'aadhaar_new.pdf', 'bank_statement.pdf'].map(fn => (
                  <div key={fn} className="bg-[#FFF8EA] p-2 border border-[#3F2928] flex justify-between text-[11px] sm:text-xs">
                    <span className="truncate max-w-[180px]">{fn}</span>
                    <span className="text-[#A58B7B] shrink-0">UNCLASSIFIED</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Examination Arrow */}
            <div className="lg:col-span-2 text-center py-2 lg:py-4">
              <div className="inline-block px-4 py-2 bg-[#3F2928] text-[#FFF8EA] font-mono text-xs font-bold border border-[#3F2928] shadow-[2px_2px_0px_#7A302F]">
                ↓ AI EXAMINATION ↓
              </div>
            </div>

            {/* After */}
            <div className="lg:col-span-5 bg-[#FFF8EA] p-4 sm:p-6 border-2 border-[#7A302F] shadow-[4px_4px_0px_#7A302F]">
              <div className="font-mono text-xs font-bold text-[#7A302F] mb-3 sm:mb-4">
                AFTER: AUTOMATIC CASE CATEGORIZATION
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-2 sm:p-3 border border-[#3F2928] bg-[#F3E4C8]">
                  <div className="font-bold text-[#3F2928]">IDENTITY CATEGORY</div>
                  <div className="text-[11px] text-[#A58B7B]">Aadhaar Card • PAN Card • Passport</div>
                </div>
                <div className="p-2 sm:p-3 border border-[#3F2928] bg-[#F3E4C8]">
                  <div className="font-bold text-[#3F2928]">ADDRESS PROOF</div>
                  <div className="text-[11px] text-[#A58B7B]">Electricity Bill • Bank Statement</div>
                </div>
                <div className="p-2 sm:p-3 border border-[#3F2928] bg-[#F3E4C8]">
                  <div className="font-bold text-[#3F2928]">BUSINESS & PERSONAL</div>
                  <div className="text-[11px] text-[#A58B7B]">GST Certificate • Passport Photograph</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: CROSS-DOCUMENT INTELLIGENCE */}
      <section className="py-12 md:py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#F3E4C8]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            SECTION 04 // CROSS-DOCUMENT REASONING
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#3F2928] mb-8 md:mb-12">
            CROSS-DOCUMENT INTELLIGENCE
          </h2>

          <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-5 sm:p-8 shadow-[6px_6px_0px_#3F2928]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 font-mono text-xs mb-6 sm:mb-8">
              <div className="p-4 border border-[#3F2928] bg-[#F3E4C8]">
                <span className="text-[#A58B7B] block text-[10px]">DOCUMENT: PAN CARD</span>
                <span className="font-bold text-sm text-[#3F2928]">Rahul Kumar</span>
              </div>
              <div className="p-4 border border-[#3F2928] bg-[#F3E4C8]">
                <span className="text-[#A58B7B] block text-[10px]">DOCUMENT: AADHAAR</span>
                <span className="font-bold text-sm text-[#3F2928]">Rahul Kumar</span>
              </div>
              <div className="p-4 border-2 border-[#7A302F] bg-[#E8B9B8]">
                <span className="text-[#7A302F] block text-[10px] font-bold">DOCUMENT: ADDRESS PROOF</span>
                <span className="font-bold text-sm text-[#7A302F]">R. Kumar</span>
              </div>
            </div>

            <div className="bg-[#3F2928] text-[#FFF8EA] p-4 border border-[#3F2928] font-mono text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#E8B9B8] shrink-0" />
                <span>CASE FINDING: <strong>POSSIBLE NAME MISMATCH</strong></span>
              </div>
              <Link to="/cross-check" className="text-[#D47794] underline hover:text-[#FFF8EA]">
                VIEW RELATIONSHIP MATRIX →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: FIX, DON'T JUST FLAG */}
      <section className="py-12 md:py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#FFF8EA]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            SECTION 05 // INTEGRATED RESOLUTION
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#3F2928] mb-8 md:mb-12">
            FIX, DON'T JUST FLAG.
          </h2>

          {/* Action Resolution Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 font-mono text-xs text-center">
            
            <div className="p-4 bg-[#F3E4C8] border border-[#3F2928]">
              <div className="text-[#7A302F] font-bold mb-1">01 DETECT</div>
              <div>File size 14.8 MB exceeds limit</div>
            </div>

            <div className="p-4 bg-[#F3E4C8] border border-[#3F2928]">
              <div className="text-[#3F2928] font-bold mb-1">02 WHY?</div>
              <div>Portal caps attachments at 10 MB</div>
            </div>

            <div className="p-4 bg-[#F3E4C8] border border-[#3F2928]">
              <div className="text-[#7A302F] font-bold mb-1">03 ACTION</div>
              <div>Compress PDF below limit</div>
            </div>

            <div className="p-4 bg-[#3F2928] text-[#FFF8EA] border border-[#3F2928]">
              <div className="text-[#D47794] font-bold mb-1">04 TOOL</div>
              <div>Click "COMPRESS NOW"</div>
            </div>

            <div className="p-4 bg-[#7A302F] text-[#FFF8EA] border border-[#3F2928] sm:col-span-2 md:col-span-1">
              <div className="font-bold mb-1">05 RECHECK</div>
              <div>Ready for Submission ✓</div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA CHECKPOINT */}
      <section className="py-10 md:py-14 px-4 md:px-8 bg-[#FFF8EA] border-t-2 border-b-2 border-[#3F2928] relative overflow-hidden">
        
        {/* Subtle grid line accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3F292808_1px,transparent_1px),linear-gradient(to_bottom,#3F292808_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          <div className="inline-block px-3 py-1 bg-[#F3E4C8] border border-[#3F2928] font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-3">
            {t.home.ctaEyebrow}
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-[#3F2928] mb-3 sm:mb-4">
            {t.home.ctaTitle}
          </h2>

          <p className="font-body text-base sm:text-lg text-[#3F2928] mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
            {t.home.ctaSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 font-mono">
            <button
              onClick={handleStartCheckup}
              className="w-full sm:w-auto font-heading text-lg sm:text-xl font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-8 py-3.5 sm:py-4 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] hover:shadow-[6px_6px_0px_#3F2928] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {t.home.startVerificationBtn}
              <ArrowRight className="w-5 h-5 text-[#FFF8EA]" />
            </button>

            <button
              onClick={handleTryDemo}
              className="w-full sm:w-auto font-mono text-xs sm:text-sm uppercase font-bold bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928] px-6 py-3.5 sm:py-4 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-[#7A302F]" fill="#7A302F" />
              {t.home.launchDemoBtn}
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

