import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Sidebar } from '../components/Sidebar';
import { Wrench } from 'lucide-react';

export const DocumentQualityPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents } = useForensics();
  const { t } = useLanguage();

  const handleFixTool = () => {
    navigate('/tools');
  };

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928]">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
            PHASE 04 // {t.quality.tag}
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
            {t.quality.title}
          </h1>
          <p className="font-body text-sm text-[#3F2928] mt-1">
            {t.quality.subtitle}
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="bg-[#FFF8EA] p-6 sm:p-8 border-2 border-[#3F2928] text-center font-mono text-xs text-[#3F2928] shadow-[3px_3px_0px_#3F2928]">
            {t.inbox.noDocsMessage}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {documents.map((doc) => {
              const q = doc.quality;
              const isGood = q.overallScore >= 80;

              return (
                <div
                  key={doc.id}
                  className={`bg-[#FFF8EA] p-4 sm:p-6 border-2 shadow-[4px_4px_0px_#3F2928] ${
                    isGood ? 'border-[#3F2928]' : 'border-[#7A302F]'
                  }`}
                >
                  
                  {/* Top Line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3F2928] pb-3 sm:pb-4 mb-4">
                    <div>
                      <span className="evidence-tag mb-1 inline-block">{doc.category}</span>
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928]">
                        {doc.documentType} ({doc.filename})
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`stamp text-[10px] sm:text-xs ${
                          isGood ? 'stamp-verified' : 'stamp-critical'
                        }`}
                      >
                        {isGood ? 'QUALITY COMPLIANT' : 'NEEDS ATTENTION'}
                      </span>
                      <span className="font-mono text-lg sm:text-xl font-bold text-[#7A302F]">
                        {q.overallScore} / 100
                      </span>
                    </div>
                  </div>

                  {/* Quality Metric Sliders / Meters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs mb-4 sm:mb-6">
                    
                    <div className="p-3 bg-[#F3E4C8] border border-[#3F2928]">
                      <div className="text-[#A58B7B] mb-1 text-[10px] sm:text-xs">SHARPNESS</div>
                      <div className="font-bold text-sm sm:text-base text-[#3F2928]">{q.sharpness}%</div>
                      <div className="w-full h-1.5 bg-[#FFF8EA] mt-2 border border-[#3F2928]/30">
                        <div className="bg-[#3F2928] h-full" style={{ width: `${q.sharpness}%` }} />
                      </div>
                    </div>

                    <div className="p-3 bg-[#F3E4C8] border border-[#3F2928]">
                      <div className="text-[#A58B7B] mb-1 text-[10px] sm:text-xs">TEXT VISIBILITY</div>
                      <div className="font-bold text-sm sm:text-base text-[#3F2928]">{q.textVisibility}%</div>
                      <div className="w-full h-1.5 bg-[#FFF8EA] mt-2 border border-[#3F2928]/30">
                        <div className="bg-[#3F2928] h-full" style={{ width: `${q.textVisibility}%` }} />
                      </div>
                    </div>

                    <div className="p-3 bg-[#F3E4C8] border border-[#3F2928]">
                      <div className="text-[#A58B7B] mb-1 text-[10px] sm:text-xs">LIGHTING</div>
                      <div className="font-bold text-sm sm:text-base text-[#3F2928]">{q.lighting}%</div>
                      <div className="w-full h-1.5 bg-[#FFF8EA] mt-2 border border-[#3F2928]/30">
                        <div className="bg-[#3F2928] h-full" style={{ width: `${q.lighting}%` }} />
                      </div>
                    </div>

                    <div className="p-3 bg-[#F3E4C8] border border-[#3F2928]">
                      <div className="text-[#A58B7B] mb-1 text-[10px] sm:text-xs">CROPPING & ALIGNMENT</div>
                      <div className="font-bold text-sm sm:text-base text-[#3F2928]">{q.cropping}%</div>
                      <div className="w-full h-1.5 bg-[#FFF8EA] mt-2 border border-[#3F2928]/30">
                        <div className="bg-[#7A302F] h-full" style={{ width: `${q.cropping}%` }} />
                      </div>
                    </div>

                  </div>

                  {/* Recommendations and Tools CTA */}
                  <div className="bg-[#F3E4C8] p-3.5 sm:p-4 border border-[#3F2928] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                    <div>
                      <div className="font-bold text-[#3F2928] mb-0.5">FORENSIC RECOMMENDATION:</div>
                      <p className="text-[#7A302F]">{q.feedbackLines && q.feedbackLines.length > 0 ? q.feedbackLines.join('; ') : 'All forensic quality metrics pass verification thresholds.'}</p>
                    </div>

                    {!isGood && (
                      <button
                        onClick={handleFixTool}
                        className="bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] font-heading text-xs font-bold px-4 py-2 border border-[#3F2928] flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        {t.quality.fixQualityBtn}
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};
