import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { Sidebar } from '../components/Sidebar';
import { AlertOctagon, Wrench, MapPin, CheckCircle2 } from 'lucide-react';

export const IssuesPage: React.FC = () => {
  const navigate = useNavigate();
  const { issues, resolveIssue } = useForensics();
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'NEEDS REVIEW' | 'RESOLVED'>('ALL');

  const handleFixClick = () => {
    navigate('/fix');
  };

  const handleNearbyClick = () => {
    navigate('/help-nearby');
  };

  const filteredIssues = issues.filter(issue => {
    if (filterSeverity === 'RESOLVED') return issue.resolved;
    if (filterSeverity === 'ALL') return true;
    return issue.severity === filterSeverity && !issue.resolved;
  });

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
              PHASE 07 // CASE FINDINGS
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
              CASE FINDINGS
            </h1>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {(['ALL', 'CRITICAL', 'NEEDS REVIEW', 'RESOLVED'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 border font-bold transition-all text-[11px] sm:text-xs ${
                  filterSeverity === sev
                    ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928] shadow-[2px_2px_0px_#D47794]'
                    : 'bg-[#FFF8EA] text-[#3F2928] border-[#3F2928] hover:bg-[#F3E4C8]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Issue Cards Stack */}
        {filteredIssues.length === 0 ? (
          <div className="bg-[#FFF8EA] p-6 sm:p-8 border-2 border-[#3F2928] text-center font-mono text-xs shadow-[3px_3px_0px_#3F2928]">
            <CheckCircle2 className="w-10 h-10 text-[#7A302F] mx-auto mb-2" />
            <h3 className="font-heading text-xl font-bold text-[#3F2928] mb-1">
              NO ACTIVE ISSUES MATCHING FILTER
            </h3>
            <p className="text-[#A58B7B]">All document parameters comply with application requirements.</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredIssues.map((issue) => {
              const isCritical = issue.severity === 'CRITICAL';

              return (
                <div
                  key={issue.id}
                  className={`bg-[#FFF8EA] p-4 sm:p-6 border-2 shadow-[4px_4px_0px_#3F2928] relative ${
                    issue.resolved
                      ? 'border-[#3F2928] opacity-75'
                      : isCritical
                      ? 'border-[#7A302F]'
                      : 'border-[#D47794]'
                  }`}
                >
                  
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3F2928] pb-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span
                        className={`stamp text-[10px] ${
                          issue.resolved
                            ? 'stamp-verified'
                            : 'stamp-critical'
                        }`}
                      >
                        {issue.resolved ? 'RESOLVED ✓' : issue.severity}
                      </span>
                      {issue.affectedDocumentName && (
                        <span className="evidence-tag">{issue.affectedDocumentName}</span>
                      )}
                    </div>

                    <span className="font-mono text-xs text-[#A58B7B]">
                      ISSUE CODE: #{issue.id}
                    </span>
                  </div>

                  {/* Issue Title */}
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928] mb-3 sm:mb-4">
                    {issue.title}
                  </h3>

                  {/* Explanation Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs mb-6">
                    
                    {/* WHY THIS WAS FLAGGED */}
                    <div className="p-3 sm:p-4 bg-[#E8B9B8] border border-[#7A302F]">
                      <div className="font-bold text-[#7A302F] mb-1 uppercase flex items-center gap-1.5 text-[11px] sm:text-xs">
                        <AlertOctagon className="w-4 h-4 shrink-0" />
                        WHY THIS WAS FLAGGED
                      </div>
                      <p className="font-body text-xs text-[#3F2928] leading-relaxed">
                        {issue.whyFlagged}
                      </p>
                    </div>

                    {/* RECOMMENDED ACTION */}
                    <div className="p-3 sm:p-4 bg-[#F3E4C8] border border-[#3F2928]">
                      <div className="font-bold text-[#7A302F] mb-1 uppercase flex items-center gap-1.5 text-[11px] sm:text-xs">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        RECOMMENDED ACTION
                      </div>
                      <p className="font-body text-xs text-[#3F2928] leading-relaxed">
                        {issue.recommendedAction}
                      </p>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  {!issue.resolved && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-[#3F2928]/20 font-mono text-xs">
                      <button
                        onClick={handleFixClick}
                        className="w-full sm:w-auto bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-5 py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] font-heading text-base font-bold flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px] transition-all"
                      >
                        <Wrench className="w-4 h-4" />
                        FIX THIS ISSUE IN WORKFLOW
                      </button>

                      <button
                        onClick={handleNearbyClick}
                        className="w-full sm:w-auto bg-[#FFF8EA] hover:bg-[#E8B9B8] text-[#3F2928] px-4 py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] font-mono text-xs font-bold flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-[#7A302F]" />
                        FIND HELP NEARBY
                      </button>

                      <button
                        onClick={() => resolveIssue(issue.id)}
                        className="sm:ml-auto text-[#A58B7B] hover:text-[#7A302F] underline font-bold py-1 text-center sm:text-right"
                      >
                        MARK AS RESOLVED
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

