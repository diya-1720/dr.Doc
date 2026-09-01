import React from 'react';
import { useForensics } from '../context/ForensicsContext';
import { Sidebar } from '../components/Sidebar';
import { Printer, Download } from 'lucide-react';

export const VerificationReportPage: React.FC = () => {
  const { readinessScore, caseId, currentApplication, documents, issues, crossChecks } = useForensics();

  const isReady = readinessScore >= 85 && issues.filter(i => i.severity === 'CRITICAL' && !i.resolved).length === 0;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 max-w-5xl">
        
        {/* Printable Card Area */}
        <div id="printable-report" className="bg-[#FFF8EA] border-4 border-[#3F2928] p-8 md:p-12 shadow-[8px_8px_0px_#3F2928] relative">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-4 border-[#3F2928] pb-6 mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#3F2928] text-[#FFF8EA] flex items-center justify-center font-heading text-xl font-bold border border-[#3F2928]">
                  DR
                </div>
                <div>
                  <h1 className="font-heading text-3xl font-bold tracking-wider text-[#3F2928]">
                    DR. DOC
                  </h1>
                  <div className="font-mono text-[10px] font-bold text-[#7A302F] tracking-widest uppercase">
                    DOCUMENT VERIFICATION REPORT
                  </div>
                </div>
              </div>
            </div>

            <div className="font-mono text-xs text-right space-y-1 text-[#3F2928]">
              <div>CASE ID: <strong>{caseId}</strong></div>
              <div>DATE: <strong>{new Date().toLocaleDateString('en-GB')}</strong></div>
              <div>ANALYST HASH: <strong>SHA-256#8F92...C01</strong></div>
            </div>
          </div>

          {/* Report Summary Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs mb-8 p-4 bg-[#F3E4C8] border-2 border-[#3F2928]">
            <div>
              <span className="text-[#A58B7B] block text-[10px]">APPLICATION</span>
              <strong className="text-[#3F2928]">{currentApplication.name}</strong>
            </div>
            <div>
              <span className="text-[#A58B7B] block text-[10px]">OVERALL READINESS</span>
              <strong className="text-base text-[#7A302F]">
                {readinessScore} / 100
              </strong>
            </div>
            <div>
              <span className="text-[#A58B7B] block text-[10px]">TOTAL DOCUMENTS</span>
              <strong className="text-[#3F2928]">{documents.length} Files</strong>
            </div>
            <div>
              <span className="text-[#A58B7B] block text-[10px]">UNRESOLVED ISSUES</span>
              <strong className="text-[#7A302F]">{issues.filter(i => !i.resolved).length} Issues</strong>
            </div>
          </div>

          {/* Final Verification Stamp Banner */}
          <div className="flex items-center justify-between p-6 border-2 border-[#3F2928] bg-[#F3E4C8] mb-8">
            <div>
              <div className="font-mono text-xs text-[#A58B7B] font-bold uppercase mb-1">
                FINAL FORENSIC VERIFICATION STATUS
              </div>
              <div className="font-heading text-3xl font-bold text-[#3F2928]">
                {isReady ? 'READY FOR PORTAL SUBMISSION' : 'ACTION REQUIRED BEFORE SUBMISSION'}
              </div>
            </div>

            <span
              className={`stamp text-lg ${
                isReady ? 'stamp-verified' : 'stamp-critical'
              }`}
            >
              {isReady ? 'VERIFIED ✓' : 'ACTION REQUIRED ✕'}
            </span>
          </div>

          {/* Document-by-Document Audit Table */}
          <div className="mb-8">
            <h3 className="font-heading text-xl font-bold text-[#3F2928] mb-3 border-b-2 border-[#3F2928] pb-1">
              DOCUMENT AUDIT SUMMARY
            </h3>

            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[#3F2928] text-[#FFF8EA]">
                  <th className="p-2 border border-[#3F2928]">DOC TYPE</th>
                  <th className="p-2 border border-[#3F2928]">FILENAME</th>
                  <th className="p-2 border border-[#3F2928]">QUALITY</th>
                  <th className="p-2 border border-[#3F2928]">CONFIDENCE</th>
                  <th className="p-2 border border-[#3F2928]">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-[#3F2928] hover:bg-[#F3E4C8] text-[#3F2928]">
                    <td className="p-2 border border-[#3F2928] font-bold">{doc.documentType}</td>
                    <td className="p-2 border border-[#3F2928]">{doc.filename}</td>
                    <td className="p-2 border border-[#3F2928]">{doc.quality.overallScore}%</td>
                    <td className="p-2 border border-[#3F2928] text-[#7A302F] font-bold">{doc.confidence}%</td>
                    <td className="p-2 border border-[#3F2928] font-bold">
                      <span className="text-[#7A302F]">
                        {doc.verificationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cross Check Findings Section */}
          <div className="mb-8 font-mono text-xs">
            <h3 className="font-heading text-xl font-bold text-[#3F2928] mb-3 border-b-2 border-[#3F2928] pb-1">
              CROSS-DOCUMENT FIELD CONSISTENCY
            </h3>
            <div className="space-y-2">
              {crossChecks.map((check) => (
                <div key={check.id} className="p-2 border border-[#3F2928] bg-[#F3E4C8] flex justify-between text-[#3F2928]">
                  <span>{check.fieldName}: <strong>{check.analysisNote}</strong></span>
                  <span className="font-bold text-[#7A302F]">
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t-2 border-[#3F2928] flex justify-between items-end font-mono text-[11px] text-[#A58B7B]">
            <div>
              <div>DR. DOC FORENSICS LABORATORY</div>
              <div>CONFIDENTIAL OFFICIAL REPORT</div>
            </div>
            <div className="text-right">
              <div className="border-b border-[#3F2928] w-48 mb-1" />
              <div>AUTHORIZED DIGITAL SIGNATURE</div>
            </div>
          </div>

        </div>

        {/* Floating Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-end gap-4 font-mono text-xs no-print">
          <button
            onClick={handlePrint}
            className="bg-[#3F2928] text-[#FFF8EA] px-6 py-3 border border-[#3F2928] shadow-[3px_3px_0px_#7A302F] font-bold flex items-center gap-2 hover:bg-[#7A302F] transition-colors"
          >
            <Printer className="w-4 h-4" />
            PRINT CASE FILE
          </button>

          <button
            onClick={handleDownloadReport}
            className="bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-6 py-3 border border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-heading text-lg font-bold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD FORENSIC REPORT (PDF)
          </button>
        </div>

      </main>
    </div>
  );
};
