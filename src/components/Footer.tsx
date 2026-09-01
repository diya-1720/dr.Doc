import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import logoImg from '../assets/logo.jpg';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#3F2928] text-[#FFF8EA] border-t-4 border-[#7A302F] py-6 md:py-8 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6">
        
        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src={logoImg}
              alt="DR. DOC Logo"
              className="h-9 w-auto object-contain shrink-0"
            />
            <div>
              <div className="font-heading text-xl font-bold tracking-wider text-white leading-none">
                {t.header.tagline}
              </div>
              <div className="font-mono text-[9px] font-semibold text-[#E8B9B8] tracking-widest uppercase mt-0.5">
                {t.header.descriptor}
              </div>
            </div>
          </div>
          <p className="font-mono text-[11px] text-[#A58B7B] leading-relaxed mb-3">
            {t.footer.tagline}
          </p>
          <div className="inline-block px-2 py-0.5 bg-[#3F2928]/80 border border-[#D47794] font-mono text-[10px] text-[#D47794] uppercase font-bold">
            {t.footer.systemStatus}: {t.footer.allSystemsOperational}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="font-heading text-xs text-[#E8B9B8] mb-2 tracking-wider">
            {t.nav.verify} & {t.nav.documents}
          </div>
          <ul className="space-y-1.5 font-mono text-xs text-[#F3E4C8]">
            <li><Link to="/verify" className="hover:text-[#D47794] transition-colors">{t.nav.verify}</Link></li>
            <li><Link to="/documents" className="hover:text-[#D47794] transition-colors">{t.nav.documents}</Link></li>
            <li><Link to="/ocr" className="hover:text-[#D47794] transition-colors">{t.nav.ocr}</Link></li>
            <li><Link to="/quality" className="hover:text-[#D47794] transition-colors">{t.nav.quality}</Link></li>
            <li><Link to="/cross-check" className="hover:text-[#D47794] transition-colors">{t.nav.crossCheck}</Link></li>
          </ul>
        </div>

        {/* Tools & Services */}
        <div>
          <div className="font-heading text-xs text-[#E8B9B8] mb-2 tracking-wider">
            {t.nav.tools} & {t.nav.help}
          </div>
          <ul className="space-y-1.5 font-mono text-xs text-[#F3E4C8]">
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">{t.tools.compressorTitle}</Link></li>
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">{t.tools.converterTitle}</Link></li>
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">{t.tools.sharpenerTitle}</Link></li>
            <li><Link to="/help-nearby" className="hover:text-[#D47794] transition-colors">{t.nav.help}</Link></li>
            <li><Link to="/report" className="hover:text-[#D47794] transition-colors">{t.nav.report}</Link></li>
          </ul>
        </div>

        {/* Forensic Philosophy */}
        <div>
          <div className="font-heading text-xs text-[#E8B9B8] mb-2 tracking-wider uppercase">
            {t.footer.philosophyTitle}
          </div>
          <div className="font-mono text-xs text-[#A58B7B] space-y-1">
            <div className="text-[#FFF8EA] font-bold text-[11px]">DETECT → UNDERSTAND → VERIFY</div>
            <div className="text-[#FFF8EA] font-bold text-[11px]">EXPLAIN → FIX → RECHECK → READY</div>
            <p className="mt-2 text-[10px] leading-tight text-[#A58B7B]">
              {t.footer.philosophyText}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-[#7A302F]/40 flex flex-col sm:flex-row justify-between items-center font-mono text-[11px] text-[#A58B7B] gap-2">
        <div>
          {t.footer.copyright}
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-[10px]">
          <span>{t.footer.privacy}</span>
          <span>•</span>
          <span>{t.footer.terms}</span>
          <span>•</span>
          <span>{t.footer.security}</span>
        </div>
      </div>
    </footer>
  );
};
