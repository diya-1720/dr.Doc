import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
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
  const { loadDemoMode } = useForensics();

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
      <section className="relative pt-12 pb-20 px-4 md:px-8 border-b-2 border-[#3F2928] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 z-10">
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3F2928] text-[#FFF8EA] font-mono text-xs font-bold uppercase tracking-widest mb-6 border border-[#3F2928] shadow-[2px_2px_0px_#7A302F]">
              <span className="w-2 h-2 rounded-full bg-[#D47794] animate-pulse" />
              DR. DOC • DOCUMENT FORENSICS LAB
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-[#3F2928] leading-none mb-6">
              YOUR DOCUMENTS.<br />
              <span className="text-[#7A302F]">UNDER EXAMINATION.</span>
            </h1>

            {/* Subheadline */}
            <p className="font-body text-lg md:text-xl text-[#3F2928] leading-relaxed mb-8 max-w-xl">
              Upload your documents. Dr. Doc identifies, extracts, verifies and cross-checks them before submission. No rejected applications due to missing files or name mismatches.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleStartCheckup}
                className="font-heading text-xl font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-8 py-3.5 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] hover:shadow-[6px_6px_0px_#3F2928] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-3"
              >
                START A DOCUMENT CHECKUP
                <ArrowRight className="w-6 h-6 text-[#FFF8EA]" />
              </button>

              <button
                onClick={handleTryDemo}
                className="font-mono text-sm uppercase font-bold bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928] px-6 py-4 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-[#7A302F]" fill="#7A302F" />
                EXPLORE HOW IT WORKS
              </button>
            </div>

            {/* Micro Stats */}
            <div className="mt-10 pt-6 border-t border-[#3F2928]/20 grid grid-cols-3 gap-4 font-mono text-xs text-[#3F2928]">
              <div>
                <span className="block font-bold text-base text-[#3F2928]">100% AUTOMATED</span>
                <span className="text-[#A58B7B]">Multi-Doc Classification</span>
              </div>
              <div>
                <span className="block font-bold text-base text-[#7A302F]">CROSS-DOCUMENT</span>
                <span className="text-[#A58B7B]">Inconsistency Detection</span>
              </div>
              <div>
                <span className="block font-bold text-base text-[#7A302F]">IN-LINE FIX</span>
                <span className="text-[#A58B7B]">Compression & Tools</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Desk Scene */}
          <div className="lg:col-span-6 relative">
            
            {/* Investigation Desk Board Background */}
            <div className="relative bg-[#FFF8EA] border-2 border-[#3F2928] p-6 shadow-[8px_8px_0px_#3F2928] min-h-[420px] flex flex-col justify-between overflow-hidden">
              
              {/* Top Desk Header */}
              <div className="flex justify-between items-center font-mono text-xs font-bold border-b-2 border-[#3F2928] pb-2 text-[#3F2928]">
                <span>EVIDENCE DESK #0142</span>
                <span className="text-[#7A302F]">LIVE ANALYSIS BOARD</span>
              </div>

              {/* Physical Document Sheets Stacked */}
              <div className="relative my-6 h-[300px]">
                
                {/* Document 1: Aadhaar (Rotated) */}
                <div className="absolute top-2 left-4 w-56 p-4 bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[4px_4px_0px_rgba(63,41,40,0.15)] transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                  <div className="flex justify-between items-center font-mono text-[10px] text-[#A58B7B] border-b border-[#3F2928] pb-1 mb-2">
                    <span>GOVT IDENTITY</span>
                    <span className="text-[#7A302F] font-bold">VERIFIED ✓</span>
                  </div>
                  <div className="font-heading text-sm font-bold text-[#3F2928]">AADHAAR CARD</div>
                  <div className="font-mono text-xs text-[#3F2928] mt-1">Name: <span className="font-bold underline decoration-[#7A302F]">Rahul Kumar</span></div>
                  <div className="font-mono text-[10px] text-[#A58B7B] mt-0.5">UID: •••• •••• 4912</div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="evidence-tag">CONFIDENCE 97%</span>
                    <span className="stamp stamp-verified text-[9px]">EXAMINED</span>
                  </div>
                </div>

                {/* Document 2: PAN Card (Rotated right) */}
                <div className="absolute top-12 left-36 w-60 p-4 bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[6px_6px_0px_rgba(63,41,40,0.2)] transform rotate-2 z-10 transition-transform hover:rotate-0 duration-300">
                  <div className="flex justify-between items-center font-mono text-[10px] text-[#A58B7B] border-b border-[#3F2928] pb-1 mb-2">
                    <span>TAX RECORD</span>
                    <span className="text-[#7A302F] font-bold">VERIFIED ✓</span>
                  </div>
                  <div className="font-heading text-sm font-bold text-[#3F2928]">PAN CARD</div>
                  <div className="font-mono text-xs text-[#3F2928] mt-1">Name: <span className="font-bold underline decoration-[#7A302F]">Rahul Kumar</span></div>
                  <div className="font-mono text-[10px] text-[#A58B7B] mt-0.5">PAN: ABCDE1234F</div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="evidence-tag">CONFIDENCE 99%</span>
                    <span className="stamp stamp-verified text-[9px]">MATCHED</span>
                  </div>
                </div>

                {/* Document 3: Bank Statement (Flagged) */}
                <div className="absolute top-28 left-20 w-64 p-4 bg-[#FFF8EA] border-2 border-[#7A302F] shadow-[8px_8px_0px_rgba(122,48,47,0.25)] transform -rotate-1 z-20 transition-transform hover:rotate-0 duration-300">
                  <div className="flex justify-between items-center font-mono text-[10px] text-[#7A302F] font-bold border-b border-[#7A302F] pb-1 mb-2">
                    <span>ADDRESS PROOF</span>
                    <span className="stamp stamp-critical text-[8px] py-0">FLAGGED ✕</span>
                  </div>
                  <div className="font-heading text-sm font-bold text-[#3F2928]">BANK STATEMENT</div>
                  <div className="font-mono text-xs text-[#3F2928] mt-1">Name: <span className="font-bold text-[#7A302F] bg-[#E8B9B8] px-1">R. Kumar</span></div>
                  <div className="font-mono text-[10px] text-[#7A302F] mt-1 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    NAME MISMATCH vs AADHAAR
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-[#A58B7B]">Size: 14.8 MB (Over 10MB Limit)</div>
                </div>

                {/* Red String Overlay SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                  <line x1="80" y1="60" x2="220" y2="100" stroke="#7A302F" strokeWidth="2.5" strokeDasharray="5,5" />
                  <line x1="220" y1="100" x2="160" y2="170" stroke="#7A302F" strokeWidth="2.5" strokeDasharray="3,3" />
                  <circle cx="220" cy="100" r="5" fill="#7A302F" />
                  <circle cx="160" cy="170" r="5" fill="#7A302F" />
                </svg>

                {/* Floating Forensic Tag Annotation */}
                <div className="absolute bottom-2 right-2 bg-[#3F2928] text-[#E8B9B8] px-3 py-1 font-mono text-[11px] font-bold border border-[#E8B9B8] shadow-md z-40">
                  CROSS-DOCUMENT MATCH FAIL
                </div>
              </div>

              {/* Desk Footer bar */}
              <div className="flex justify-between items-center font-mono text-[11px] text-[#3F2928] pt-2 border-t border-[#3F2928]">
                <span>READINESS SCORE: <strong className="text-[#7A302F]">78 / 100</strong></span>
                <span className="font-bold text-[#7A302F]">ACTION REQUIRED</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MARQUEE SCROLLING TICKER */}
      <section className="bg-[#3F2928] text-[#FFF8EA] border-b-2 border-[#3F2928] py-3 overflow-hidden">
        <div className="animate-marquee font-mono text-xs font-bold uppercase tracking-widest whitespace-nowrap flex gap-8">
          <span>DOCUMENT FORENSICS</span>
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
          <span>DOCUMENT FORENSICS</span>
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
      <section className="py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#FFF8EA]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            SECTION 01 // CASE STUDY
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#3F2928] mb-12">
            PAPERWORK SHOULD NOT BE THE REASON AN APPLICATION FAILS.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="case-card p-6 border-2 border-[#3F2928] relative">
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
            <div className="case-card p-6 border-2 border-[#3F2928] relative">
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
            <div className="case-card p-6 border-2 border-[#3F2928] relative">
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
      <section className="py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#F3E4C8]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            SECTION 02 // FORENSIC METHODOLOGY
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#3F2928] mb-12">
            HOW DR. DOC WORKS
          </h2>

          {/* Workflow Sequence */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-xs">
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
                className="bg-[#FFF8EA] p-3 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] flex flex-col justify-between h-32"
              >
                <div className="font-heading text-2xl font-bold text-[#7A302F]">
                  {step.num}
                </div>
                <div>
                  <div className="font-bold text-[#3F2928] uppercase tracking-wider">{step.title}</div>
                  <div className="text-[10px] text-[#A58B7B] mt-1">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: SMART DOCUMENT CLASSIFICATION */}
      <section className="py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#FFF8EA]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            SECTION 03 // AUTOMATED INGESTION
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#3F2928] mb-12">
            SMART DOCUMENT CLASSIFICATION
          </h2>

          {/* Before vs After Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Before */}
            <div className="lg:col-span-5 bg-[#F3E4C8] p-6 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928]">
              <div className="font-mono text-xs font-bold text-[#7A302F] mb-4">
                BEFORE: 15 UNORGANIZED FILES
              </div>
              <div className="font-mono text-xs space-y-2 text-[#3F2928]">
                {['IMG_2837.png', 'scan001.pdf', 'document_final.pdf', 'photo.jpg', 'aadhaar_new.pdf', 'bank_statement.pdf'].map(fn => (
                  <div key={fn} className="bg-[#FFF8EA] p-2 border border-[#3F2928] flex justify-between">
                    <span>{fn}</span>
                    <span className="text-[#A58B7B]">UNCLASSIFIED</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Examination Arrow */}
            <div className="lg:col-span-2 text-center py-4">
              <div className="inline-block px-4 py-2 bg-[#3F2928] text-[#FFF8EA] font-mono text-xs font-bold border border-[#3F2928] shadow-[2px_2px_0px_#7A302F]">
                ↓ AI EXAMINATION ↓
              </div>
            </div>

            {/* After */}
            <div className="lg:col-span-5 bg-[#FFF8EA] p-6 border-2 border-[#7A302F] shadow-[4px_4px_0px_#7A302F]">
              <div className="font-mono text-xs font-bold text-[#7A302F] mb-4">
                AFTER: AUTOMATIC CASE CATEGORIZATION
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-2 border border-[#3F2928] bg-[#F3E4C8]">
                  <div className="font-bold text-[#3F2928]">IDENTITY CATEGORY</div>
                  <div className="text-[11px] text-[#A58B7B]">Aadhaar Card • PAN Card • Passport</div>
                </div>
                <div className="p-2 border border-[#3F2928] bg-[#F3E4C8]">
                  <div className="font-bold text-[#3F2928]">ADDRESS PROOF</div>
                  <div className="text-[11px] text-[#A58B7B]">Electricity Bill • Bank Statement</div>
                </div>
                <div className="p-2 border border-[#3F2928] bg-[#F3E4C8]">
                  <div className="font-bold text-[#3F2928]">BUSINESS & PERSONAL</div>
                  <div className="text-[11px] text-[#A58B7B]">GST Certificate • Passport Photograph</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: CROSS-DOCUMENT INTELLIGENCE */}
      <section className="py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#F3E4C8]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            SECTION 04 // CROSS-DOCUMENT REASONING
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#3F2928] mb-12">
            CROSS-DOCUMENT INTELLIGENCE
          </h2>

          <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-8 shadow-[6px_6px_0px_#3F2928]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs mb-8">
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

            <div className="bg-[#3F2928] text-[#FFF8EA] p-4 border border-[#3F2928] font-mono text-xs flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#E8B9B8]" />
                <span>FORENSIC FINDING: <strong>POSSIBLE NAME MISMATCH</strong></span>
              </div>
              <Link to="/cross-check" className="text-[#D47794] underline hover:text-[#FFF8EA]">
                VIEW RELATIONSHIP MATRIX →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: FIX, DON'T JUST FLAG */}
      <section className="py-16 px-4 md:px-8 border-b-2 border-[#3F2928] bg-[#FFF8EA]">
        <div className="max-w-7xl mx-auto">
          
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            SECTION 05 // INTEGRATED RESOLUTION
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#3F2928] mb-12">
            FIX, DON'T JUST FLAG.
          </h2>

          {/* Action Resolution Flow */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-mono text-xs text-center">
            
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

            <div className="p-4 bg-[#7A302F] text-[#FFF8EA] border border-[#3F2928]">
              <div className="font-bold mb-1">05 RECHECK</div>
              <div>Ready for Submission ✓</div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className="py-20 px-4 md:px-8 bg-[#3F2928] text-[#FFF8EA]">
        <div className="max-w-4xl mx-auto text-center">
          
          <div className="font-mono text-xs font-bold text-[#D47794] uppercase tracking-widest mb-4">
            CONFIDENT APPLICATION SUBMISSION
          </div>

          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
            READY BEFORE YOU SUBMIT.
          </h2>

          <p className="font-body text-lg text-[#F3E4C8] mb-8 max-w-xl mx-auto">
            Avoid costly delays, rejected business registrations, and manual document re-submissions. Perform a forensic checkup right now.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleStartCheckup}
              className="font-heading text-xl font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-8 py-4 border-2 border-[#FFF8EA] shadow-[4px_4px_0px_#D47794] hover:shadow-[6px_6px_0px_#D47794] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              START VERIFICATION
            </button>
            <button
              onClick={handleTryDemo}
              className="font-mono text-sm uppercase font-bold bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928] px-6 py-4 border-2 border-[#FFF8EA] shadow-[4px_4px_0px_#FFF8EA] transition-all"
            >
              LAUNCH DEMO CASE
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
