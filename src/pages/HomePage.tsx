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
  FolderOpen
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, readinessScore, issues, currentApplication, caseId } = useForensics();
  const { t } = useLanguage();

  const unresolvedIssues = issues.filter(i => !i.resolved);
  const verifiedDocsCount = documents.filter(d => d.verificationStatus === 'VERIFIED').length;
  const isEvaluated = documents.length > 0;

  const handleStartCheckup = () => {
    navigate('/verify');
  };

  const handleGoToInbox = () => {
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
              {isEvaluated ? `${t.header.case} ${caseId} (${documents.length}/20 ${t.nav.documents})` : t.home.heroTag}
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
                {isEvaluated ? t.home.resumeCaseVerification : t.home.startCheckupBtn}
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFF8EA]" />
              </button>

              <button
                onClick={handleGoToInbox}
                className="w-full sm:w-auto font-mono text-xs sm:text-sm uppercase font-bold bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928] px-5 sm:px-6 py-3.5 sm:py-4 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <FolderOpen className="w-4 h-4 text-[#7A302F]" />
                {t.header.inbox} ({documents.length}/20)
              </button>
            </div>

            {/* Micro Stats */}
            <div className="mt-8 md:mt-10 pt-4 sm:pt-6 border-t border-[#3F2928]/20 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-[#3F2928]">
              <div>
                <span className="block font-bold text-sm sm:text-base text-[#3F2928]">
                  {isEvaluated ? `${documents.length} ${t.home.ofDocs}` : t.home.stat1Title}
                </span>
                <span className="text-[#A58B7B] text-[11px]">
                  {isEvaluated ? `${verifiedDocsCount} ${t.common.verified}` : t.home.stat1Desc}
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
                  {isEvaluated ? `${unresolvedIssues.length} ${t.verification.issuesTitle}` : t.home.stat3Title}
                </span>
                <span className="text-[#A58B7B] text-[11px]">
                  {isEvaluated ? (unresolvedIssues.length === 0 ? t.common.allChecksPassed : t.common.actionRequired) : t.home.stat3Desc}
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
                <span>{t.home.evidenceDesk} // {caseId}</span>
                <span className="text-[#7A302F]">{isEvaluated ? t.home.caseInProgress : t.home.liveAnalysisBoard}</span>
              </div>

              {/* Physical Document Sheets Stacked */}
              <div className="relative my-3 sm:my-4 h-[250px] sm:h-[280px]">
                
                {/* Document 1: (Rotated Left) */}
                <div className="absolute top-1 sm:top-2 left-1 sm:left-3 w-44 sm:w-52 p-3 bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[4px_4px_0px_rgba(63,41,40,0.15)] transform -rotate-3 transition-transform hover:rotate-0 duration-300 z-10">
                  <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] text-[#A58B7B] border-b border-[#3F2928] pb-1 mb-1 sm:mb-1.5">
                    <span>{documents[0]?.category || t.categories.identity}</span>
                    <span className="text-[#7A302F] font-bold">{documents[0]?.verificationStatus === 'VERIFIED' ? `${t.common.verified} ✓` : t.common.verified}</span>
                  </div>
                  <div className="font-heading text-xs sm:text-sm font-bold text-[#3F2928] truncate">
                    {documents[0]?.documentType || t.docTypes.aadhaarCard}
                  </div>
                  <div className="font-mono text-[10px] sm:text-xs text-[#3F2928] mt-0.5 truncate">
                    {t.docCard.name} <span className="font-bold underline decoration-[#7A302F]">{documents[0]?.extractedFields?.find(f => f.key.includes('name'))?.value || 'Ved Gharat'}</span>
                  </div>
                  <div className="font-mono text-[9px] text-[#A58B7B] mt-0.5 truncate">
                    {documents[0]?.extractedFields?.find(f => f.key.includes('number') || f.key.includes('id'))?.value || 'UID: •••• •••• 4912'}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="evidence-tag text-[9px]">{t.docCard.confidence} {documents[0]?.confidence || 97}%</span>
                    <span className="stamp stamp-verified text-[8px]">{t.common.verified}</span>
                  </div>
                </div>

                {/* Document 2: (Rotated Right) */}
                <div className="absolute top-6 sm:top-8 right-1 sm:right-3 w-48 sm:w-56 p-3 bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[6px_6px_0px_rgba(63,41,40,0.2)] transform rotate-2 z-20 transition-transform hover:rotate-0 duration-300">
                  <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] text-[#A58B7B] border-b border-[#3F2928] pb-1 mb-1 sm:mb-1.5">
                    <span>{documents[1]?.category || t.categories.identity}</span>
                    <span className="text-[#7A302F] font-bold">{documents[1]?.verificationStatus === 'VERIFIED' ? `${t.common.verified} ✓` : t.common.verified}</span>
                  </div>
                  <div className="font-heading text-xs sm:text-sm font-bold text-[#3F2928] truncate">
                    {documents[1]?.documentType || t.docTypes.drivingLicense}
                  </div>
                  <div className="font-mono text-[10px] sm:text-xs text-[#3F2928] mt-0.5 truncate">
                    {t.docCard.name} <span className="font-bold underline decoration-[#7A302F]">{documents[1]?.extractedFields?.find(f => f.key.includes('name'))?.value || 'Ved Gharat'}</span>
                  </div>
                  <div className="font-mono text-[9px] text-[#A58B7B] mt-0.5 truncate">
                    {documents[1]?.extractedFields?.find(f => f.key.includes('number') || f.key.includes('id'))?.value || 'DL: MH48 20260023357'}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="evidence-tag text-[9px]">{t.docCard.confidence} {documents[1]?.confidence || 99}%</span>
                    <span className="stamp stamp-verified text-[8px]">{t.crossCheckMatrix.statusMatch}</span>
                  </div>
                </div>

                {/* Document 3 / Flagged Item */}
                <div className="absolute top-20 sm:top-24 left-4 sm:left-10 w-52 sm:w-60 p-3 bg-[#FFF8EA] border-2 border-[#7A302F] shadow-[8px_8px_0px_rgba(122,48,47,0.25)] transform -rotate-1 z-30 transition-transform hover:rotate-0 duration-300">
                  <div className="flex justify-between items-center font-mono text-[9px] sm:text-[10px] text-[#7A302F] font-bold border-b border-[#7A302F] pb-1 mb-1 sm:mb-1.5">
                    <span>{documents[2]?.category || t.categories.address}</span>
                    <span className="stamp stamp-critical text-[8px] py-0">
                      {unresolvedIssues.length > 0 ? `${t.common.actionRequired} ✕` : `${t.common.readyForSubmission} ✓`}
                    </span>
                  </div>
                  <div className="font-heading text-xs sm:text-sm font-bold text-[#3F2928] truncate">
                    {documents[2]?.documentType || t.docTypes.bankStatement}
                  </div>
                  <div className="font-mono text-[10px] sm:text-xs text-[#3F2928] mt-0.5 truncate">
                    {t.docCard.name} <span className="font-bold text-[#7A302F] bg-[#E8B9B8] px-1">{documents[2]?.extractedFields?.find(f => f.key.includes('name'))?.value || 'Ved Gharat'}</span>
                  </div>
                  <div className="font-mono text-[9px] text-[#7A302F] mt-0.5 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    {unresolvedIssues.length > 0 ? unresolvedIssues[0].title : t.common.allChecksPassed}
                  </div>
                  <div className="mt-1 text-[9px] font-mono text-[#A58B7B]">
                    {documents[2]?.fileSizeMB || '2.4'} MB
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
                  {isEvaluated ? `${readinessScore}% ${t.header.readiness}` : t.crossCheckMatrix.statusCompatible}
                </div>
              </div>

              {/* Desk Footer bar */}
              <div className="flex justify-between items-center font-mono text-[10px] sm:text-[11px] text-[#3F2928] pt-2 border-t border-[#3F2928]">
                <span>{t.home.readinessScore}: <strong className="text-[#7A302F]">{isEvaluated ? readinessScore : 100} / 100</strong></span>
                <span className="font-bold text-[#7A302F]">{isEvaluated && readinessScore >= 85 ? `${t.common.readyForSubmission} ✓` : t.common.readyForSubmission}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* MARQUEE SCROLLING TICKER */}
      <section className="bg-[#3F2928] text-[#FFF8EA] border-b-2 border-[#3F2928] py-2.5 md:py-3 overflow-hidden">
        <div className="animate-marquee font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap flex gap-6 sm:gap-8">
          {(t.home.marquee || []).map((word, idx) => (
            <React.Fragment key={idx}>
              <span>{word}</span>
              <span className="text-[#D47794]">•</span>
            </React.Fragment>
          ))}
          {/* Duplicate set for seamless infinite marquee loop */}
          {(t.home.marquee || []).map((word, idx) => (
            <React.Fragment key={`dup-${idx}`}>
              <span>{word}</span>
              <span className="text-[#D47794]">•</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* SECTION 1: THE PROBLEM */}
      <section className="py-12 md:py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#FFF8EA]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            {t.home.sec1Tag}
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#3F2928] mb-8 md:mb-12">
            {t.home.sec1Title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="case-card p-5 sm:p-6 border-2 border-[#3F2928] relative">
              <div className="evidence-tag mb-4 inline-block">01</div>
              <div className="w-12 h-12 bg-[#E8B9B8] text-[#7A302F] border border-[#7A302F] flex items-center justify-center font-bold mb-4">
                <FileWarning className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#3F2928] mb-2">
                {t.home.evidence1Title}
              </h3>
              <p className="font-body text-sm text-[#3F2928] leading-relaxed">
                {t.home.evidence1Desc}
              </p>
            </div>

            {/* Card 2 */}
            <div className="case-card p-5 sm:p-6 border-2 border-[#3F2928] relative">
              <div className="evidence-tag mb-4 inline-block">02</div>
              <div className="w-12 h-12 bg-[#E8B9B8] text-[#7A302F] border border-[#7A302F] flex items-center justify-center font-bold mb-4">
                <GitCompare className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#3F2928] mb-2">
                {t.home.evidence2Title}
              </h3>
              <p className="font-body text-sm text-[#3F2928] leading-relaxed">
                {t.home.evidence2Desc}
              </p>
            </div>

            {/* Card 3 */}
            <div className="case-card p-5 sm:p-6 border-2 border-[#3F2928] relative">
              <div className="evidence-tag mb-4 inline-block">03</div>
              <div className="w-12 h-12 bg-[#E8B9B8] text-[#7A302F] border border-[#7A302F] flex items-center justify-center font-bold mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#3F2928] mb-2">
                {t.home.evidence3Title}
              </h3>
              <p className="font-body text-sm text-[#3F2928] leading-relaxed">
                {t.home.evidence3Desc}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: HOW DR. DOC WORKS */}
      <section className="py-12 md:py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#F3E4C8]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            {t.home.sec2Tag}
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#3F2928] mb-8 md:mb-12">
            {t.home.sec2Title}
          </h2>

          {/* Workflow Sequence */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-xs">
            {[
              { num: '01', title: t.home.step1Title, desc: t.home.step1Desc },
              { num: '02', title: t.home.step2Title, desc: t.home.step2Desc },
              { num: '03', title: t.home.step3Title, desc: t.home.step3Desc },
              { num: '04', title: t.home.step4Title, desc: t.home.step4Desc },
              { num: '05', title: t.home.step5Title, desc: t.home.step5Desc },
              { num: '06', title: t.home.step6Title, desc: t.home.step6Desc },
              { num: '07', title: t.home.step7Title, desc: t.home.step7Desc },
              { num: '08', title: t.home.step8Title, desc: t.home.step8Desc },
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
            {t.home.sec3Tag}
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#3F2928] mb-8 md:mb-12">
            {t.home.sec3Title}
          </h2>

          {/* Before vs After Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Before */}
            <div className="lg:col-span-5 bg-[#F3E4C8] p-4 sm:p-6 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928]">
              <div className="font-mono text-xs font-bold text-[#7A302F] mb-3 sm:mb-4">
                {t.home.beforeLabel}
              </div>
              <div className="font-mono text-xs space-y-2 text-[#3F2928]">
                {['IMG_2837.png', 'scan001.pdf', 'document_final.pdf', 'photo.jpg', 'aadhaar_new.pdf', 'bank_statement.pdf'].map(fn => (
                  <div key={fn} className="bg-[#FFF8EA] p-2 border border-[#3F2928] flex justify-between text-[11px] sm:text-xs">
                    <span className="truncate max-w-[180px]">{fn}</span>
                    <span className="text-[#A58B7B] shrink-0">{t.categories.unknown}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Examination Arrow */}
            <div className="lg:col-span-2 text-center py-2 lg:py-4">
              <div className="inline-block px-4 py-2 bg-[#3F2928] text-[#FFF8EA] font-mono text-xs font-bold border border-[#3F2928] shadow-[2px_2px_0px_#7A302F]">
                {t.home.aiExamination}
              </div>
            </div>

            {/* After */}
            <div className="lg:col-span-5 bg-[#FFF8EA] p-4 sm:p-6 border-2 border-[#7A302F] shadow-[4px_4px_0px_#7A302F]">
              <div className="font-mono text-xs font-bold text-[#7A302F] mb-3 sm:mb-4">
                {t.home.afterLabel}
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-2 sm:p-3 border border-[#3F2928] bg-[#F3E4C8]">
                  <div className="font-bold text-[#3F2928]">{t.home.afterCat1}</div>
                  <div className="text-[11px] text-[#A58B7B]">{t.home.afterCat1Docs}</div>
                </div>
                <div className="p-2 sm:p-3 border border-[#3F2928] bg-[#F3E4C8]">
                  <div className="font-bold text-[#3F2928]">{t.home.afterCat2}</div>
                  <div className="text-[11px] text-[#A58B7B]">{t.home.afterCat2Docs}</div>
                </div>
                <div className="p-2 sm:p-3 border border-[#3F2928] bg-[#F3E4C8]">
                  <div className="font-bold text-[#3F2928]">{t.home.afterCat3}</div>
                  <div className="text-[11px] text-[#A58B7B]">{t.home.afterCat3Docs}</div>
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
            {t.home.sec4Tag}
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#3F2928] mb-8 md:mb-12">
            {t.home.sec4Title}
          </h2>

          <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-5 sm:p-8 shadow-[6px_6px_0px_#3F2928]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 font-mono text-xs mb-6 sm:mb-8">
              <div className="p-4 border border-[#3F2928] bg-[#F3E4C8]">
                <span className="text-[#A58B7B] block text-[10px]">{t.docTypes.panCard}</span>
                <span className="font-bold text-sm text-[#3F2928]">Ved Gharat</span>
              </div>
              <div className="p-4 border border-[#3F2928] bg-[#F3E4C8]">
                <span className="text-[#A58B7B] block text-[10px]">{t.docTypes.aadhaarCard}</span>
                <span className="font-bold text-sm text-[#3F2928]">Ved Nishad Gharat</span>
              </div>
              <div className="p-4 border-2 border-[#7A302F] bg-[#D4E8B8]">
                <span className="text-[#3F2928] block text-[10px] font-bold">{t.docTypes.drivingLicense}</span>
                <span className="font-bold text-sm text-[#3F2928]">Ved Gharat</span>
              </div>
            </div>

            <div className="bg-[#3F2928] text-[#FFF8EA] p-4 border border-[#3F2928] font-mono text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#E8B9B8] shrink-0" />
                <span>{t.home.caseFinding}: <strong>{t.crossCheckMatrix.statusCompatible}</strong></span>
              </div>
              <Link to="/cross-check" className="text-[#D47794] underline hover:text-[#FFF8EA]">
                {t.home.viewMatrix}
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: FIX, DON'T JUST FLAG */}
      <section className="py-12 md:py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#FFF8EA]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            {t.home.sec5Tag}
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#3F2928] mb-8 md:mb-12">
            {t.home.sec5Title}
          </h2>

          {/* Action Resolution Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 font-mono text-xs text-center">
            
            <div className="p-4 bg-[#F3E4C8] border border-[#3F2928]">
              <div className="text-[#7A302F] font-bold mb-1">{t.home.stepDetect}</div>
              <div>{t.home.stepDetectDesc}</div>
            </div>

            <div className="p-4 bg-[#F3E4C8] border border-[#3F2928]">
              <div className="text-[#3F2928] font-bold mb-1">{t.home.stepWhy}</div>
              <div>{t.home.stepWhyDesc}</div>
            </div>

            <div className="p-4 bg-[#F3E4C8] border border-[#3F2928]">
              <div className="text-[#7A302F] font-bold mb-1">{t.home.stepAction}</div>
              <div>{t.home.stepActionDesc}</div>
            </div>

            <div className="p-4 bg-[#3F2928] text-[#FFF8EA] border border-[#3F2928]">
              <div className="text-[#D47794] font-bold mb-1">{t.home.stepTool}</div>
              <div>{t.home.stepToolDesc}</div>
            </div>

            <div className="p-4 bg-[#7A302F] text-[#FFF8EA] border border-[#3F2928] sm:col-span-2 md:col-span-1">
              <div className="font-bold mb-1">{t.home.stepRecheck}</div>
              <div>{t.home.stepRecheckDesc}</div>
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
              onClick={handleGoToInbox}
              className="w-full sm:w-auto font-mono text-xs sm:text-sm uppercase font-bold bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928] px-6 py-3.5 sm:py-4 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <FolderOpen className="w-4 h-4 text-[#7A302F]" />
              {t.home.openInboxBtn}
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

