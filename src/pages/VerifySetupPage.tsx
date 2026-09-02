import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Sidebar } from '../components/Sidebar';
import { CheckSquare, ArrowRight } from 'lucide-react';

export const VerifySetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { applications, currentApplication, setApplication } = useForensics();
  const { t } = useLanguage();

  const handleSelectApp = (id: string) => {
    setApplication(id);
  };

  const handleProceedToInbox = () => {
    navigate('/documents');
  };

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-5xl w-full">
        
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 pb-4 border-b-2 border-[#3F2928]">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
            PHASE 01 // {t.setup.tag}
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
            {t.setup.title}
          </h1>
          <p className="font-body text-sm sm:text-base text-[#3F2928] mt-2">
            {t.setup.subtitle}
          </p>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {applications.map((app) => {
            const isSelected = currentApplication.id === app.id;
            return (
              <div
                key={app.id}
                onClick={() => handleSelectApp(app.id)}
                className={`p-5 sm:p-6 border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#FFF8EA] border-[#3F2928] shadow-[6px_6px_0px_#7A302F]'
                    : 'bg-[#F3E4C8] border-[#3F2928] hover:bg-[#FFF8EA] shadow-[3px_3px_0px_#3F2928]'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#3F2928] text-[#FFF8EA]">
                      {app.code}
                    </div>
                    {app.id === 'app-default-universal' && (
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-[#7A302F] text-[#FFF8EA] uppercase tracking-wider">
                        ★ {t.setup.defaultForensics}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <span className="stamp stamp-verified text-[10px]">{t.setup.selected}</span>
                  )}
                </div>

                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#3F2928] mb-2">
                  {app.id === 'app-default-universal' ? t.applications.universal.name : app.id === 'app-biz-reg' ? t.applications.bizReg.name : app.id === 'app-kyc-bank' ? t.applications.kycBank.name : app.id === 'app-loan-grant' ? t.applications.loanGrant.name : app.id === 'app-college-adm' ? t.applications.collegeAdm.name : app.name}
                </h3>
                <p className="font-body text-xs text-[#3F2928] mb-4 leading-relaxed">
                  {app.id === 'app-default-universal' ? t.applications.universal.description : app.id === 'app-biz-reg' ? t.applications.bizReg.description : app.id === 'app-kyc-bank' ? t.applications.kycBank.description : app.id === 'app-loan-grant' ? t.applications.loanGrant.description : app.id === 'app-college-adm' ? t.applications.collegeAdm.description : app.description}
                </p>

                {/* Requirement pills */}
                <div className="pt-3 border-t border-[#3F2928]/20 font-mono text-[11px] text-[#A58B7B]">
                  <div className="font-bold text-[#3F2928] mb-1">{t.setup.requiredDocsLabel}</div>
                  <div className="flex flex-wrap gap-1">
                    {app.requiredDocuments.map((docType) => (
                      <span key={docType} className="px-1.5 py-0.5 bg-[#FFF8EA] border border-[#3F2928] text-[#3F2928] text-[10px]">
                        {docType}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-[#7A302F]">
                    {t.setup.portalMaxLimit}: <strong>{app.portalMaxFileSizeMB} MB</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Application Details & Checklist */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-6 shadow-[4px_4px_0px_#3F2928] mb-8">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-2">
            {t.setup.activeProfileChecklist}
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928] mb-4">
            {currentApplication.id === 'app-default-universal' ? t.applications.universal.name : currentApplication.name} ({t.setup.requirements})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs mb-6">
            {currentApplication.requiredDocuments.map((req) => (
              <div key={req} className="p-3 bg-[#F3E4C8] border border-[#3F2928] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#7A302F] shrink-0" />
                  <span className="font-bold text-[#3F2928]">{req}</span>
                </div>
                <span className="text-[10px] text-[#A58B7B]">{t.setup.mandatory}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4 border-t border-[#3F2928]">
            <button
              onClick={handleProceedToInbox}
              className="w-full sm:w-auto font-heading text-base sm:text-lg font-bold bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-8 py-3 border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {t.nav.documents} ({t.header.inbox})
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};
