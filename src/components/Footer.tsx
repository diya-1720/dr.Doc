import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3F2928] text-[#FFF8EA] border-t-4 border-[#7A302F] py-12 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Column */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#7A302F] text-[#FFF8EA] flex items-center justify-center font-heading text-lg font-bold border border-[#FFF8EA]">
              DR
            </div>
            <div className="font-heading text-2xl font-bold tracking-wider text-white">
              DR. DOC
            </div>
          </div>
          <p className="font-mono text-xs text-[#A58B7B] leading-relaxed mb-4">
            AI-POWERED DOCUMENT FORENSICS AND VERIFICATION PLATFORM.
            EXAMINE, CLASSIFY, VERIFY & PREPARE CASE FILES BEFORE SUBMISSION.
          </p>
          <div className="inline-block px-2 py-1 bg-[#3F2928]/80 border border-[#D47794] font-mono text-[10px] text-[#D47794] uppercase font-bold">
            SYSTEM STATUS: OPERATIONAL
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="font-heading text-sm text-[#E8B9B8] mb-4 tracking-wider">
            FORENSIC WORKSPACE
          </div>
          <ul className="space-y-2 font-mono text-xs text-[#F3E4C8]">
            <li><Link to="/verify" className="hover:text-[#D47794] transition-colors">Verify Setup</Link></li>
            <li><Link to="/documents" className="hover:text-[#D47794] transition-colors">Document Inbox</Link></li>
            <li><Link to="/ocr" className="hover:text-[#D47794] transition-colors">OCR & Extraction</Link></li>
            <li><Link to="/quality" className="hover:text-[#D47794] transition-colors">Quality Inspection</Link></li>
            <li><Link to="/cross-check" className="hover:text-[#D47794] transition-colors">Cross-Check Matrix</Link></li>
          </ul>
        </div>

        {/* Tools & Services */}
        <div>
          <div className="font-heading text-sm text-[#E8B9B8] mb-4 tracking-wider">
            DOCUMENT TOOLS
          </div>
          <ul className="space-y-2 font-mono text-xs text-[#F3E4C8]">
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">Compress PDF (Limit Threshold)</Link></li>
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">Image to PDF Converter</Link></li>
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">Merge Application Bundle</Link></li>
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">Readability Enhancer</Link></li>
            <li><Link to="/help-nearby" className="hover:text-[#D47794] transition-colors">Nearby Assistance Locator</Link></li>
          </ul>
        </div>

        {/* Forensic Philosophy */}
        <div>
          <div className="font-heading text-sm text-[#E8B9B8] mb-4 tracking-wider">
            CORE PHILOSOPHY
          </div>
          <div className="font-mono text-xs text-[#A58B7B] space-y-1">
            <div className="text-[#FFF8EA] font-bold">DETECT → UNDERSTAND → VERIFY</div>
            <div className="text-[#FFF8EA] font-bold">EXPLAIN → FIX → RECHECK → READY</div>
            <p className="mt-3 text-[11px] leading-normal">
              Built for high-stakes paperwork verification, government portals, business onboarding, and legal compliance.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[#7A302F]/40 flex flex-col md:flex-row justify-between items-center font-mono text-xs text-[#A58B7B]">
        <div>
          © 2026 DR. DOC FORENSICS LAB. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-4 mt-2 md:mt-0 text-[11px]">
          <span>EVIDENCE SECURED</span>
          <span>•</span>
          <span>PRIVACY COMPLIANT</span>
          <span>•</span>
          <span>STRICT LOCAL ENGINE</span>
        </div>
      </div>
    </footer>
  );
};
