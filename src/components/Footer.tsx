import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3F2928] text-[#FFF8EA] border-t-4 border-[#7A302F] py-6 md:py-8 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6">
        
        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src={logoImg}
              alt="DR. DOC Logo"
              className="w-8 h-8 rounded-full object-cover border border-[#FFF8EA] shrink-0"
            />
            <div>
              <div className="font-heading text-xl font-bold tracking-wider text-white leading-none">
                DR. DOC
              </div>
              <div className="font-mono text-[9px] font-semibold text-[#E8B9B8] tracking-widest uppercase mt-0.5">
                DOCUMENT INTELLIGENCE
              </div>
            </div>
          </div>
          <p className="font-mono text-[11px] text-[#A58B7B] leading-relaxed mb-3">
            DOCUMENT INTELLIGENCE & VERIFICATION PLATFORM.
            EXAMINE, CLASSIFY & VERIFY CASE FILES BEFORE SUBMISSION.
          </p>
          <div className="inline-block px-2 py-0.5 bg-[#3F2928]/80 border border-[#D47794] font-mono text-[10px] text-[#D47794] uppercase font-bold">
            SYSTEM STATUS: OPERATIONAL
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="font-heading text-xs text-[#E8B9B8] mb-2 tracking-wider">
            WORKSPACES
          </div>
          <ul className="space-y-1.5 font-mono text-xs text-[#F3E4C8]">
            <li><Link to="/verify" className="hover:text-[#D47794] transition-colors">Verify Setup</Link></li>
            <li><Link to="/documents" className="hover:text-[#D47794] transition-colors">Document Inbox</Link></li>
            <li><Link to="/ocr" className="hover:text-[#D47794] transition-colors">OCR & Extraction</Link></li>
            <li><Link to="/quality" className="hover:text-[#D47794] transition-colors">Quality Inspection</Link></li>
            <li><Link to="/cross-check" className="hover:text-[#D47794] transition-colors">Cross-Check Matrix</Link></li>
          </ul>
        </div>

        {/* Tools & Services */}
        <div>
          <div className="font-heading text-xs text-[#E8B9B8] mb-2 tracking-wider">
            DOCUMENT TOOLS
          </div>
          <ul className="space-y-1.5 font-mono text-xs text-[#F3E4C8]">
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">Compress PDF</Link></li>
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">Image to PDF Converter</Link></li>
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">Merge Application Bundle</Link></li>
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">Readability Enhancer</Link></li>
            <li><Link to="/help-nearby" className="hover:text-[#D47794] transition-colors">Nearby Assistance Locator</Link></li>
          </ul>
        </div>

        {/* Forensic Philosophy */}
        <div>
          <div className="font-heading text-xs text-[#E8B9B8] mb-2 tracking-wider">
            CORE PHILOSOPHY
          </div>
          <div className="font-mono text-xs text-[#A58B7B] space-y-1">
            <div className="text-[#FFF8EA] font-bold text-[11px]">DETECT → UNDERSTAND → VERIFY</div>
            <div className="text-[#FFF8EA] font-bold text-[11px]">EXPLAIN → FIX → RECHECK → READY</div>
            <p className="mt-2 text-[10px] leading-tight text-[#A58B7B]">
              Built for high-stakes paperwork verification, government portals, and legal compliance.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-[#7A302F]/40 flex flex-col sm:flex-row justify-between items-center font-mono text-[11px] text-[#A58B7B] gap-2">
        <div>
          © 2026 DR. DOC. ALL RIGHTS RESERVED.
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-[10px]">
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

