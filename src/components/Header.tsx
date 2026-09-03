import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';
import { QrExportModal } from './QrExportModal';
import { Menu, X, Globe, ChevronDown, FolderOpen, QrCode } from 'lucide-react';

import logoImg from '../assets/logo.png';

export const Header: React.FC = () => {
  const location = useLocation();
  const { readinessScore, documents } = useForensics();
  const { language, setLanguage, t } = useLanguage();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.verify, path: '/verify' },
    { label: t.nav.documents, path: '/documents', badge: (documents || []).length > 0 ? (documents || []).length : undefined },
    { label: t.nav.ocr, path: '/ocr' },
    { label: t.nav.quality, path: '/quality' },
    { label: t.nav.verification, path: '/verification' },
    { label: t.nav.crossCheck, path: '/cross-check' },
    { label: t.nav.issues, path: '/issues' },
    { label: t.nav.tools, path: '/tools' },
    { label: t.nav.report, path: '/report' },
    { label: t.nav.help, path: '/help-nearby' },
  ];

  const applicantName = (documents || [])
    .map(d => (d?.extractedFields || []).find(f => f?.key && (String(f.key).toLowerCase().includes('name') || f.key === 'applicantName'))?.value)
    .find(name => name && name !== 'Not detected' && name !== 'Not specified') || 'Applicant';

  return (
    <header className="sticky top-0 z-50 bg-[#F3E4C8]/95 backdrop-blur-sm border-b-2 border-[#3F2928] px-3 sm:px-4 md:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand & Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={logoImg}
            alt="DR. DOC Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform group-hover:scale-105 shrink-0"
          />
          <div>
            <div className="font-heading text-lg sm:text-xl font-bold tracking-wider leading-none text-[#3F2928]">
              {t.header.tagline}
            </div>
            <div className="font-mono text-[9px] sm:text-[10px] font-semibold text-[#7A302F] tracking-widest uppercase">
              {t.header.descriptor}
            </div>
          </div>
        </Link>

        {/* Desktop Global Navigation Links (Scrollable on intermediate screens) */}
        <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-4 font-mono text-[11px] 2xl:text-xs font-bold uppercase tracking-wider overflow-x-auto py-1">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors py-1 flex items-center gap-1 shrink-0 relative ${
                  active
                    ? 'text-[#7A302F] font-black border-b-2 border-[#D47794]'
                    : 'text-[#3F2928] hover:text-[#7A302F]'
                }`}
              >
                {item.label}
                {item.badge !== undefined && (
                  <span className="bg-[#3F2928] text-[#FFF8EA] px-1 py-0.2 text-[9px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Action Indicators, Language Selector & Quick QR */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          
          {/* Quick QR Mobile Transfer CTA */}
          {(documents || []).length > 0 && (
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase font-black bg-[#D97706] hover:bg-[#B45309] text-[#FFF8EA] px-2.5 py-1.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] transition-all cursor-pointer shrink-0"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR (30m)</span>
            </button>
          )}

          {/* Multilingual Language Switcher Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="px-2.5 py-1.5 bg-[#FFF8EA] border border-[#3F2928] hover:bg-[#F3E4C8] font-mono text-xs font-bold text-[#3F2928] flex items-center gap-1 shadow-[2px_2px_0px_#3F2928] transition-all"
              aria-label="Language Selector"
            >
              <Globe className="w-3.5 h-3.5 text-[#7A302F]" />
              <span className="uppercase">{language}</span>
              <ChevronDown className={`w-3 h-3 text-[#A58B7B] transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] z-50 py-1 font-mono text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-[#A58B7B] uppercase border-b border-[#3F2928]/20">
                  {t.nav.selectLanguage}
                </div>
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'mr', label: 'मराठी' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as Language);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#F3E4C8] flex items-center justify-between transition-colors ${
                      language === lang.code ? 'font-bold text-[#7A302F] bg-[#F3E4C8]' : 'text-[#3F2928]'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && <span className="text-[#7A302F] font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Document Inbox Action */}
          <Link
            to="/documents"
            className="font-mono text-xs uppercase font-bold bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928] px-2.5 py-1.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] flex items-center gap-1.5 transition-all"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#7A302F]" />
            {(documents || []).length}
          </Link>

          {/* Primary CTA */}
          <Link
            to="/verify"
            className="font-heading text-xs uppercase font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-3.5 py-1.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] hover:shadow-[3px_3px_0px_#3F2928] transition-all flex items-center gap-1"
          >
            {t.nav.startCheckup}
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-1.5 md:hidden">
          {(documents || []).length > 0 && (
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="p-1.5 bg-[#D97706] text-[#FFF8EA] border border-[#3F2928] shadow-[1px_1px_0px_#3F2928]"
              title="QR Transfer"
            >
              <QrCode className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-[#FFF8EA] text-[#3F2928] border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] active:translate-x-[1px] active:translate-y-[1px]"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#7A302F]" /> : <Menu className="w-5 h-5 text-[#3F2928]" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t-2 border-[#3F2928] flex flex-col gap-3 font-mono text-xs uppercase">
          
          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-1.5 max-h-[60vh] overflow-y-auto">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 border transition-colors flex items-center justify-between text-[11px] font-bold ${
                    active
                      ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928]'
                      : 'bg-[#FFF8EA] text-[#3F2928] border-[#3F2928]'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="bg-[#7A302F] text-white px-1 py-0.2 text-[9px] ml-1">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Language Switcher */}
          <div className="pt-2 border-t border-[#3F2928]/30">
            <div className="font-mono text-[10px] font-bold text-[#A58B7B] uppercase mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#7A302F]" />
              {t.nav.selectLanguage}
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'mr', label: 'मराठी' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as Language);
                  }}
                  className={`py-1.5 px-2 text-center border font-bold transition-all ${
                    language === lang.code
                      ? 'bg-[#7A302F] text-[#FFF8EA] border-[#3F2928]'
                      : 'bg-[#F3E4C8] text-[#3F2928] border-[#3F2928]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#3F2928]/30">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsQrModalOpen(true);
              }}
              className="w-full text-center font-mono text-xs uppercase font-black py-2.5 bg-[#D97706] text-[#FFF8EA] border border-[#3F2928] flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Transfer (30m)</span>
            </button>

            <Link
              to="/documents"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center font-mono text-xs uppercase font-bold py-2 bg-[#FFF8EA] text-[#3F2928] border border-[#3F2928]"
            >
              DOCUMENT INBOX ({(documents || []).length})
            </Link>

            <Link
              to="/verify"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center font-heading text-sm font-bold bg-[#7A302F] text-[#FFF8EA] py-2 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928]"
            >
              {t.nav.startCheckup}
            </Link>
          </div>

        </div>
      )}

      {/* Global QR Export Modal Accessible From Navbar */}
      {isQrModalOpen && (
        <QrExportModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          documents={documents || []}
          applicantName={applicantName}
          readinessScore={readinessScore}
        />
      )}
    </header>
  );
};
