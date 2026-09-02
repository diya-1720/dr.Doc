import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';
import { Menu, X, Globe, ChevronDown, FolderOpen } from 'lucide-react';

import logoImg from '../assets/logo.png';

export const Header: React.FC = () => {
  const location = useLocation();
  const { caseId, readinessScore, documents } = useForensics();
  const { language, setLanguage, t } = useLanguage();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
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
    { label: t.nav.documents, path: '/documents', badge: documents.length > 0 ? documents.length : undefined },
    { label: t.nav.ocr, path: '/ocr' },
    { label: t.nav.tools, path: '/tools' },
    { label: t.nav.help, path: '/help-nearby' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F3E4C8]/95 backdrop-blur-sm border-b-2 border-[#3F2928] px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand & Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logoImg}
            alt="DR. DOC Logo"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform group-hover:scale-105 shrink-0"
          />
          <div>
            <div className="font-heading text-xl font-bold tracking-wider leading-none text-[#3F2928]">
              {t.header.tagline}
            </div>
            <div className="font-mono text-[10px] font-semibold text-[#7A302F] tracking-widest uppercase">
              {t.header.descriptor}
            </div>
          </div>
        </Link>

        {/* Desktop Global Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 font-mono text-xs font-medium uppercase tracking-wider">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors py-1 flex items-center gap-1.5 relative ${
                  active
                    ? 'text-[#7A302F] font-bold border-b-2 border-[#D47794]'
                    : 'text-[#3F2928] hover:text-[#7A302F]'
                }`}
              >
                {item.label}
                {item.badge !== undefined && (
                  <span className="bg-[#3F2928] text-[#FFF8EA] px-1.5 py-0.2 text-[10px]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Action Indicators, Language Selector & Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Case ID / Score Indicator */}
          {documents.length > 0 && (
            <div className="hidden xl:flex items-center gap-2 border border-[#3F2928] bg-[#FFF8EA] px-2.5 py-1 text-xs font-mono">
              <span className="text-[#A58B7B]">{t.header.case}:</span>
              <strong className="text-[#3F2928]">{caseId}</strong>
              <span className="text-[#A58B7B]">|</span>
              <span className="text-[#A58B7B]">{t.header.readiness}:</span>
              <strong className="text-[#7A302F]">{readinessScore}%</strong>
            </div>
          )}

          {/* Multilingual Language Switcher Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="px-2.5 py-1.5 bg-[#FFF8EA] border border-[#3F2928] hover:bg-[#F3E4C8] font-mono text-xs font-bold text-[#3F2928] flex items-center gap-1.5 shadow-[2px_2px_0px_#3F2928] transition-all"
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
            className="font-mono text-xs uppercase font-bold bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928] px-3 py-1.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] flex items-center gap-1.5 transition-all"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#7A302F]" />
            {t.header.inbox} ({documents.length})
          </Link>

          {/* Primary CTA */}
          <Link
            to="/verify"
            className="font-heading text-sm font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-4 py-1.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] hover:shadow-[3px_3px_0px_#3F2928] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5"
          >
            {t.nav.startCheckup}
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-[#FFF8EA] text-[#3F2928] border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] active:translate-x-[1px] active:translate-y-[1px]"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-[#7A302F]" /> : <Menu className="w-6 h-6 text-[#3F2928]" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t-2 border-[#3F2928] flex flex-col gap-3 font-mono text-xs uppercase">
          
          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2.5 border transition-colors flex items-center justify-between ${
                    active
                      ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928]'
                      : 'bg-[#FFF8EA] text-[#3F2928] border-[#3F2928]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="bg-[#7A302F] text-white px-1.5 py-0.2 text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Language Switcher */}
          <div className="pt-2 border-t border-[#3F2928]/30">
            <div className="font-mono text-[10px] font-bold text-[#A58B7B] uppercase mb-1.5 flex items-center gap-1">
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
            <Link
              to="/documents"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center font-mono text-xs uppercase font-bold py-2.5 bg-[#FFF8EA] text-[#3F2928] border border-[#3F2928]"
            >
              DOCUMENT INBOX ({documents.length})
            </Link>

            <Link
              to="/verify"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center font-heading text-base font-bold bg-[#7A302F] text-[#FFF8EA] py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928]"
            >
              {t.nav.startCheckup}
            </Link>
          </div>

        </div>
      )}
    </header>
  );
};
