import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import logoImg from '../assets/logo.png';
import { checkBackendHealth } from '../services/api';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking');

  useEffect(() => {
    let active = true;
    checkBackendHealth()
      .then(() => active && setBackendStatus('connected'))
      .catch(() => active && setBackendStatus('offline'));
    return () => { active = false; };
  }, []);

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
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#3F2928]/80 border border-[#D47794] font-mono text-[10px] text-[#D47794] uppercase font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'connected' ? 'bg-green-400' : 'bg-[#D47794]'} animate-pulse`} />
            {backendStatus === 'connected' ? `${t.footer.systemStatus}: BACKEND ONLINE` : `${t.footer.systemStatus}: ${t.footer.allSystemsOperational}`}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="font-heading text-xs text-[#E8B9B8] mb-2 tracking-wider">
            {t.footer.workspaces}
          </div>
          <ul className="space-y-1.5 font-mono text-xs text-[#F3E4C8]">
            <li><Link to="/verify" className="hover:text-[#D47794] transition-colors">{t.nav.verifySetup}</Link></li>
            <li><Link to="/documents" className="hover:text-[#D47794] transition-colors">{t.nav.documentInbox}</Link></li>
            <li><Link to="/ocr" className="hover:text-[#D47794] transition-colors">{t.nav.ocrExtraction}</Link></li>
            <li><Link to="/quality" className="hover:text-[#D47794] transition-colors">{t.nav.qualityInspection}</Link></li>
            <li><Link to="/tools" className="hover:text-[#D47794] transition-colors">{t.nav.documentPreparation}</Link></li>
            <li><Link to="/cross-check" className="hover:text-[#D47794] transition-colors">{t.nav.evidenceCrossCheck}</Link></li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div>
          <div className="font-heading text-xs text-[#E8B9B8] mb-2 tracking-wider">
            {t.footer.compliance}
          </div>
          <ul className="space-y-1.5 font-mono text-xs text-[#F3E4C8]">
            <li><span className="text-[#A58B7B]">{t.footer.auditTrail}</span></li>
            <li><span className="text-[#A58B7B]">{t.footer.ephemeralProcessing}</span></li>
            <li><span className="text-[#A58B7B]">{t.footer.forensicIntegrity}</span></li>
            <li><span className="text-[#A58B7B]">{t.footer.isoStandard}</span></li>
          </ul>
        </div>

        {/* Case File Info */}
        <div>
          <div className="font-heading text-xs text-[#E8B9B8] mb-2 tracking-wider">
            {t.footer.stationInfo}
          </div>
          <div className="font-mono text-xs text-[#F3E4C8] space-y-1">
            <div>{t.footer.terminal} <span className="text-[#E8B9B8]">DOC-SEC-01</span></div>
            <div>{t.footer.build} <span className="text-[#E8B9B8]">2026.08.31-PROD</span></div>
            <div>{t.footer.session} <span className="text-[#E8B9B8]">ACTIVE</span></div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-[#3F2928] pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 font-mono text-[10px] text-[#A58B7B]">
        <div>
          {t.footer.copyright}
        </div>
        <div className="flex gap-4">
          <span>{t.footer.isoCompliant}</span>
          <span>•</span>
          <span>{t.footer.zeroRetention}</span>
        </div>
      </div>
    </footer>
  );
};
