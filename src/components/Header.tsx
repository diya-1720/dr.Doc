import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { Play } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { caseId, readinessScore, documents, isDemoMode, loadDemoMode } = useForensics();

  const isActive = (path: string) => location.pathname === path;

  const handleDemoClick = () => {
    loadDemoMode();
    navigate('/documents');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F3E4C8]/95 backdrop-blur-sm border-b-2 border-[#3F2928] px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand & Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#3F2928] text-[#FFF8EA] flex items-center justify-center font-heading text-xl font-bold border border-[#3F2928] shadow-[2px_2px_0px_#7A302F] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_#7A302F] transition-all">
            DR
          </div>
          <div>
            <div className="font-heading text-xl font-bold tracking-wider leading-none text-[#3F2928]">
              DR. DOC
            </div>
            <div className="font-mono text-[10px] font-semibold text-[#7A302F] tracking-widest uppercase">
              DOCUMENT FORENSICS LAB
            </div>
          </div>
        </Link>

        {/* Global Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs font-medium uppercase tracking-wider">
          {[
            { label: 'Home', path: '/' },
            { label: 'Verify', path: '/verify' },
            { label: 'Documents', path: '/documents', badge: documents.length > 0 ? documents.length : undefined },
            { label: 'OCR', path: '/ocr' },
            { label: 'Tools', path: '/tools' },
            { label: 'Help', path: '/help-nearby' },
          ].map((item) => {
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

        {/* Right Side Action Indicators */}
        <div className="flex items-center gap-3">
          
          {/* Case ID / Score Indicator */}
          {documents.length > 0 && (
            <div className="hidden lg:flex items-center gap-2 border border-[#3F2928] bg-[#FFF8EA] px-2.5 py-1 text-xs font-mono">
              <span className="text-[#A58B7B]">CASE:</span>
              <span className="font-bold text-[#3F2928]">{caseId}</span>
              <span className="text-[#A58B7B] ml-1">| SCORE:</span>
              <span className="font-bold text-[#7A302F]">
                {readinessScore}/100
              </span>
            </div>
          )}

          {/* TRY DEMO Button */}
          <button
            onClick={handleDemoClick}
            className={`font-mono text-xs uppercase font-bold px-3 py-1.5 border border-[#3F2928] flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#3F2928] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              isDemoMode 
                ? 'bg-[#E8B9B8] text-[#7A302F]' 
                : 'bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928]'
            }`}
            title="Load sample case file with documents & issues"
          >
            <Play className="w-3.5 h-3.5 text-[#7A302F]" fill="#7A302F" />
            TRY DEMO
          </button>

          {/* Primary CTA */}
          <Link
            to="/verify"
            className="font-heading text-sm font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-4 py-1.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] hover:shadow-[3px_3px_0px_#3F2928] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5"
          >
            START CHECKUP
          </Link>
        </div>
      </div>
    </header>
  );
};
