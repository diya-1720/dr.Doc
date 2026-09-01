import React from 'react';
import { useForensics } from '../context/ForensicsContext';
import { Sidebar } from '../components/Sidebar';
import { ShieldAlert } from 'lucide-react';

export const CrossCheckPage: React.FC = () => {
  const { crossChecks } = useForensics();

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-6xl">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928]">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
            PHASE 06 // FORENSIC RELATIONSHIP GRAPH & MATRIX
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-[#3F2928]">
            CROSS-DOCUMENT VERIFICATION
          </h1>
          <p className="font-body text-sm text-[#3F2928] mt-1">
            Detects discrepancies in name spelling, dates of birth, tax identifiers, and addresses across all uploaded documents simultaneously.
          </p>
        </div>

        {/* Forensic Relationship Canvas View (Visual Node Graph with Red Strings) */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-6 shadow-[6px_6px_0px_#3F2928] mb-8 relative">
          <div className="flex justify-between items-center font-mono text-xs font-bold border-b border-[#3F2928] pb-2 mb-6">
            <span className="text-[#3F2928]">EVIDENCE LINKAGE MAP</span>
            <span className="text-[#7A302F]">RED STRING FORENSIC MAP</span>
          </div>

          {/* Graphical Diagram */}
          <div className="max-w-2xl mx-auto py-4 text-center font-mono relative">
            
            {/* Top Root: Applicant Entity */}
            <div className="inline-block bg-[#3F2928] text-[#FFF8EA] px-6 py-2 border border-[#3F2928] shadow-[3px_3px_0px_#7A302F] mb-8">
              <span className="text-[10px] text-[#E8B9B8] block">CLAIMED APPLICANT</span>
              <span className="font-heading text-lg font-bold text-white">Rahul Kumar</span>
            </div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-6 bg-[#7A302F] mx-auto border-l-2 border-dashed border-[#7A302F]" />

            {/* 3 Document Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
              
              {/* PAN Node */}
              <div className="bg-[#FFF8EA] p-4 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] relative">
                <div className="text-[10px] text-[#A58B7B] font-bold">IDENTITY: PAN CARD</div>
                <div className="font-bold text-sm text-[#3F2928] mt-1">Rahul Kumar</div>
                <div className="mt-2 text-[10px] text-[#7A302F] font-bold bg-[#F3E4C8] border border-[#7A302F] py-0.5">
                  FULL MATCH ✓
                </div>
              </div>

              {/* Aadhaar Node */}
              <div className="bg-[#FFF8EA] p-4 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] relative">
                <div className="text-[10px] text-[#A58B7B] font-bold">IDENTITY: AADHAAR</div>
                <div className="font-bold text-sm text-[#3F2928] mt-1">Rahul Kumar</div>
                <div className="mt-2 text-[10px] text-[#7A302F] font-bold bg-[#F3E4C8] border border-[#7A302F] py-0.5">
                  FULL MATCH ✓
                </div>
              </div>

              {/* Address Proof Node (Flagged) */}
              <div className="bg-[#FFF8EA] p-4 border-2 border-[#7A302F] shadow-[3px_3px_0px_#7A302F] relative">
                <div className="text-[10px] text-[#7A302F] font-bold">ADDRESS: STATEMENT</div>
                <div className="font-bold text-sm text-[#7A302F] mt-1 bg-[#E8B9B8] px-1">R. Kumar</div>
                <div className="mt-2 text-[10px] text-[#7A302F] font-bold bg-[#E8B9B8] border border-[#7A302F] py-0.5">
                  NAME MISMATCH ✕
                </div>
              </div>

            </div>

            {/* Red String Alert Callout */}
            <div className="mt-6 inline-flex items-center gap-2 bg-[#7A302F] text-[#FFF8EA] px-4 py-2 font-mono text-xs font-bold border border-[#3F2928] shadow-[3px_3px_0px_#3F2928]">
              <ShieldAlert className="w-4 h-4 text-[#E8B9B8]" />
              FORENSIC FINDING: POSSIBLE NAME INCONSISTENCY ("R. Kumar" vs "Rahul Kumar")
            </div>

          </div>
        </div>

        {/* Detailed Field Comparison Table */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-6 shadow-[4px_4px_0px_#3F2928]">
          <div className="font-mono text-xs font-bold text-[#3F2928] uppercase tracking-widest mb-4">
            FIELD-BY-FIELD COMPARISON MATRIX
          </div>

          {crossChecks.length === 0 ? (
            <div className="font-mono text-xs text-[#A58B7B]">
              No cross-checks generated. Please upload multiple documents containing applicant fields.
            </div>
          ) : (
            <div className="space-y-6 font-mono text-xs">
              {crossChecks.map((check) => {
                const isMismatch = check.status === 'MISMATCH';

                return (
                  <div
                    key={check.id}
                    className={`p-4 border-2 ${
                      isMismatch ? 'border-[#7A302F] bg-[#E8B9B8]' : 'border-[#3F2928] bg-[#F3E4C8]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3F2928] pb-2 mb-3">
                      <div className="font-heading text-lg font-bold text-[#3F2928]">
                        {check.fieldName}
                      </div>

                      <span
                        className={`stamp text-[10px] ${
                          isMismatch ? 'stamp-critical' : 'stamp-verified'
                        }`}
                      >
                        {isMismatch ? 'NEEDS REVIEW / MISMATCH' : 'CONSISTENT / MATCHED'}
                      </span>
                    </div>

                    {/* Sources Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      {check.sources.map((src, idx) => (
                        <div key={idx} className="p-2 bg-[#FFF8EA] border border-[#3F2928]">
                          <div className="text-[10px] text-[#A58B7B]">{src.documentType}</div>
                          <div className="text-[10px] text-[#A58B7B] truncate mb-1">{src.documentName}</div>
                          <div className="font-bold text-sm text-[#3F2928] select-all">
                            {src.extractedValue}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-[#3F2928] font-semibold flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#7A302F]" />
                      <span>{check.analysisNote}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};
