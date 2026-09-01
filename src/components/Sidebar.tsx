import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Inbox, 
  Scan, 
  GitCompare, 
  AlertOctagon, 
  Wrench, 
  FileCheck2, 
  MapPin, 
  FileText,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import logoImg from '../assets/logo.png';

export const Sidebar: React.FC = () => {
  const { documents, issues, readinessScore, currentApplication } = useForensics();
  const { t } = useLanguage();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const criticalCount = issues.filter(i => i.severity === 'CRITICAL' && !i.resolved).length;
  const reviewCount = issues.filter(i => i.severity === 'NEEDS REVIEW' && !i.resolved).length;

  const navItems = [
    { label: t.nav.home, path: '/', icon: Activity },
    { label: t.nav.documents, path: '/documents', icon: Inbox, badge: documents.length },
    { label: t.nav.ocr, path: '/ocr', icon: Scan },
    { label: t.nav.quality, path: '/quality', icon: Layers },
    { label: t.nav.verification, path: '/verification', icon: FileCheck2, badge: documents.length > 0 ? `${readinessScore}%` : undefined },
    { label: t.nav.crossCheck, path: '/cross-check', icon: GitCompare },
    { 
      label: t.nav.issues, 
      path: '/issues', 
      icon: AlertOctagon, 
      badge: criticalCount + reviewCount > 0 ? `${criticalCount + reviewCount}` : undefined,
      badgeColor: criticalCount > 0 ? 'bg-[#7A302F] text-[#FFF8EA]' : 'bg-[#E8B9B8] text-[#7A302F]'
    },
    { label: t.nav.fix, path: '/fix', icon: Wrench },
    { label: t.nav.tools, path: '/tools', icon: FileCheck2 },
    { label: t.nav.help, path: '/help-nearby', icon: MapPin },
    { label: t.nav.report, path: '/report', icon: FileText },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#FFF8EA] border-b-2 md:border-b-0 md:border-r-2 border-[#3F2928] p-4 flex flex-col justify-between shrink-0">
      <div>
        
        {/* Active Workspace Header with Mobile Collapsible Toggle */}
        <div className="pb-3 md:pb-4 border-b border-[#3F2928]/20 flex items-center justify-between md:block">
          <div className="flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="DR. DOC Logo"
              className="h-8 w-auto object-contain shrink-0"
            />
            <div>
              <div className="font-mono text-[10px] uppercase font-bold text-[#A58B7B]">
                {t.nav.activeApplication}
              </div>
              <div className="font-heading text-sm md:text-base font-bold text-[#3F2928] leading-tight break-words">
                {currentApplication.name}
              </div>
            </div>
          </div>

          {/* Mobile Drawer Accordion Toggle Button */}
          <button
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="md:hidden flex items-center gap-1 font-mono text-xs font-bold text-[#3F2928] bg-[#F3E4C8] border border-[#3F2928] px-2.5 py-1.5 shadow-[2px_2px_0px_#3F2928]"
          >
            <span>{t.nav.menu}</span>
            {isOpenMobile ? <ChevronUp className="w-4 h-4 text-[#7A302F]" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items (Visible always on Desktop, Toggleable on Mobile) */}
        <div className={`space-y-1 mt-3 md:mt-4 ${isOpenMobile ? 'block' : 'hidden md:block'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpenMobile(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-all border ${
                    isActive
                      ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928] shadow-[2px_2px_0px_#D47794]'
                      : 'text-[#3F2928] border-transparent hover:bg-[#F3E4C8] hover:border-[#3F2928]/30'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                      item.badgeColor ? item.badgeColor : 'bg-[#F3E4C8] text-[#3F2928]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer Status Panel (Visible on Desktop or when mobile drawer open) */}
      <div className={`mt-6 pt-4 border-t border-[#3F2928]/20 font-mono text-[11px] ${isOpenMobile ? 'block' : 'hidden md:block'}`}>
        <div className="flex justify-between items-center text-[#A58B7B] mb-1">
          <span>{t.home.readinessScore}:</span>
          <span className="font-bold text-[#7A302F]">{readinessScore}/100</span>
        </div>
        <div className="w-full h-2 bg-[#F3E4C8] border border-[#3F2928]">
          <div
            className="h-full bg-[#7A302F] transition-all duration-500"
            style={{ width: `${readinessScore}%` }}
          />
        </div>
        <div className="text-[10px] text-[#A58B7B] mt-2 text-center uppercase tracking-widest">
          DR. DOC ENGINE v2.4
        </div>
      </div>
    </aside>
  );
};
