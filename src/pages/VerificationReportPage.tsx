import React, { useState } from 'react';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Sidebar } from '../components/Sidebar';
import { mergeSelectedDocsIntoPdf, downloadDocInFormat } from '../services/docTools';
import type { DocItem } from '../types';
import { 
  Printer, 
  Download, 
  Layers, 
  CheckCircle2, 
  UserCheck, 
  UserX, 
  FileText,
  Loader2,
  X
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export const VerificationReportPage: React.FC = () => {
  const { readinessScore, caseId, currentApplication, documents, issues, crossChecks } = useForensics();
  const { t } = useLanguage();

  const isReady = readinessScore >= 85 && issues.filter(i => i.severity === 'CRITICAL' && !i.resolved).length === 0;

  // Bundle download state
  const [isDownloadingBundle, setIsDownloadingBundle] = useState(false);
  const [bundleSuccessMsg, setBundleSuccessMsg] = useState<string | null>(null);

  // Individual download format modal
  const [downloadModalDoc, setDownloadModalDoc] = useState<DocItem | null>(null);
  const [chosenFormat, setChosenFormat] = useState<'pdf' | 'png' | 'jpg' | 'webp'>('pdf');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadConsolidatedBundle = async () => {
    if (documents.length === 0) return;
    setIsDownloadingBundle(true);
    setBundleSuccessMsg(null);
    try {
      const mergedPdf = await mergeSelectedDocsIntoPdf(documents, `CONSOLIDATED_APPLICATION_${caseId}.pdf`);
      const url = URL.createObjectURL(mergedPdf);
      const a = document.createElement('a');
      a.href = url;
      a.download = mergedPdf.name;
      a.click();
      URL.revokeObjectURL(url);
      setBundleSuccessMsg(`Consolidated PDF bundle (${documents.length} documents) downloaded successfully!`);
      setTimeout(() => setBundleSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(`Consolidated bundle failed: ${err.message || 'Error merging files'}`);
    } finally {
      setIsDownloadingBundle(false);
    }
  };

  const openDownloadModal = (doc: DocItem) => {
    setDownloadModalDoc(doc);
    setChosenFormat(doc.mimeType.includes('pdf') ? 'pdf' : 'png');
  };

  const executeDownloadSingle = async () => {
    if (!downloadModalDoc) return;
    try {
      await downloadDocInFormat(downloadModalDoc, chosenFormat);
      setDownloadModalDoc(null);
    } catch (err: any) {
      alert(`Download failed: ${err.message || 'Error converting format'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-5xl w-full">
        
        {/* Printable Card Area */}
        <div id="printable-report" className="bg-[#FFF8EA] border-2 sm:border-4 border-[#3F2928] p-4 sm:p-8 md:p-12 shadow-[6px_6px_0px_#3F2928] md:shadow-[8px_8px_0px_#3F2928] relative">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 sm:border-b-4 border-[#3F2928] pb-4 sm:pb-6 mb-6 sm:mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={logoImg}
                  alt="DR. DOC Logo"
                  className="h-12 sm:h-14 w-auto object-contain shrink-0"
                />
                <div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-wider text-[#3F2928]">
                    {t.header.tagline}
                  </h1>
                  <div className="font-mono text-[9px] sm:text-[10px] font-bold text-[#7A302F] tracking-widest uppercase">
                    {t.report.title}
                  </div>
                </div>
              </div>
            </div>

            <div className="font-mono text-xs sm:text-right space-y-0.5 sm:space-y-1 text-[#3F2928]">
              <div>CASE ID: <strong>{caseId}</strong></div>
              <div>DATE: <strong>{new Date().toLocaleDateString('en-GB')}</strong></div>
              <div>STATUS: <strong className="text-[#7A302F]">{isReady ? t.common.readyForSubmission : t.common.actionRequired}</strong></div>
            </div>
          </div>

          {/* Report Summary Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs mb-6 sm:mb-8 p-3 sm:p-4 bg-[#F3E4C8] border-2 border-[#3F2928]">
            <div>
              <span className="text-[#A58B7B] block text-[10px] uppercase">APPLICATION</span>
              <strong className="text-[#3F2928] truncate block">{currentApplication.name}</strong>
            </div>
            <div>
              <span className="text-[#A58B7B] block text-[10px] uppercase">{t.home.readinessScore}</span>
              <strong className="text-sm sm:text-base text-[#7A302F]">
                {readinessScore} / 100
              </strong>
            </div>
            <div>
              <span className="text-[#A58B7B] block text-[10px] uppercase">{t.nav.documents}</span>
              <strong className="text-[#3F2928]">{documents.length} / 20 Files</strong>
            </div>
            <div>
              <span className="text-[#A58B7B] block text-[10px] uppercase">{t.issues.title}</span>
              <strong className="text-[#7A302F]">{issues.filter(i => !i.resolved).length} Issues</strong>
            </div>
          </div>

          {/* Final Verification Stamp Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-2 border-[#3F2928] bg-[#F3E4C8] mb-6 sm:mb-8 gap-4">
            <div>
              <div className="font-mono text-xs text-[#A58B7B] font-bold uppercase mb-1">
                {t.report.decisionStatus}
              </div>
              <div className="font-heading text-xl sm:text-3xl font-bold text-[#3F2928]">
                {isReady ? t.common.readyForSubmission : t.common.actionRequired}
              </div>
            </div>

            <span
              className={`stamp text-sm sm:text-lg self-start sm:self-auto ${
                isReady ? 'stamp-verified' : 'stamp-critical'
              }`}
            >
              {isReady ? `${t.common.verified} ✓` : `${t.common.actionRequired} ✕`}
            </span>
          </div>

          {/* Document-by-Document Audit Table */}
          <div className="mb-6 sm:mb-8">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#3F2928] mb-3 border-b-2 border-[#3F2928] pb-1">
              {t.report.auditSummary}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-[#3F2928] text-[#FFF8EA]">
                    <th className="p-2 border border-[#3F2928]">{t.report.tableType}</th>
                    <th className="p-2 border border-[#3F2928]">{t.report.tableCredentials}</th>
                    <th className="p-2 border border-[#3F2928]">{t.report.tablePhotoAudit}</th>
                    <th className="p-2 border border-[#3F2928]">{t.report.tableQuality}</th>
                    <th className="p-2 border border-[#3F2928]">{t.report.tableStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => {
                    const applicantName = doc.extractedFields.find(f => f.key.toLowerCase().includes('name') || f.key === 'applicantName')?.value;
                    const docNumber = doc.extractedFields.find(f => f.key.toLowerCase().includes('number') || f.key === 'documentNumber')?.value;

                    return (
                      <tr key={doc.id} className="border-b border-[#3F2928] hover:bg-[#F3E4C8] text-[#3F2928]">
                        <td className="p-2 border border-[#3F2928] font-bold">
                          <span className="block text-[#7A302F]">{doc.documentType}</span>
                          <span className="text-[10px] text-[#A58B7B]">{doc.category}</span>
                        </td>
                        <td className="p-2 border border-[#3F2928]">
                          {applicantName && <div>{t.docCard.name} <strong>{applicantName}</strong></div>}
                          {docNumber && <div>{t.docCard.idNo} <strong className="text-[#7A302F]">{docNumber}</strong></div>}
                          {doc.calculatedAge ? <div className="text-[10px] text-[#A58B7B]">{t.docCard.dobAge} {doc.calculatedAge} {t.docCard.years}</div> : null}
                        </td>
                        <td className="p-2 border border-[#3F2928]">
                          {doc.photoAudit && doc.photoAudit.hasPhoto ? (
                            doc.photoAudit.photoStatus === 'OUTDATED_RECOMMEND_UPDATE' || !doc.photoAudit.ageMatch ? (
                              <span className="text-[#7A302F] font-bold flex items-center gap-1">
                                <UserX className="w-3.5 h-3.5" /> {t.docCard.photoAgeMismatch}
                              </span>
                            ) : (
                              <span className="text-green-800 font-bold flex items-center gap-1">
                                <UserCheck className="w-3.5 h-3.5" /> {t.docCard.photoAgeVerified}
                              </span>
                            )
                          ) : (
                            <span className="text-[#A58B7B]">N/A</span>
                          )}
                        </td>
                        <td className="p-2 border border-[#3F2928] font-bold">{doc.quality.overallScore}%</td>
                        <td className="p-2 border border-[#3F2928] font-bold">
                          <span className={doc.verificationStatus === 'VERIFIED' ? 'text-green-800' : 'text-[#7A302F]'}>
                            {doc.verificationStatus === 'VERIFIED' ? t.common.verified : t.common.needsReview}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cross Check Findings Section */}
          {crossChecks.length > 0 && (
            <div className="mb-6 sm:mb-8 font-mono text-xs">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#3F2928] mb-3 border-b-2 border-[#3F2928] pb-1">
                {t.crossCheck.matrixTitle}
              </h3>
              <div className="space-y-2">
                {crossChecks.map((check) => (
                  <div key={check.id} className="p-2.5 border border-[#3F2928] bg-[#F3E4C8] flex flex-col sm:flex-row justify-between text-[#3F2928] gap-1 sm:gap-2">
                    <span>{check.fieldName}: <strong>{check.analysisNote}</strong></span>
                    <span className={`font-bold self-start sm:self-auto ${check.status === 'MATCHED' ? 'text-green-800' : 'text-[#7A302F]'}`}>
                      {check.status === 'MATCHED' ? t.crossCheck.allMatch : t.crossCheck.mismatchDetected}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Signature */}
          <div className="pt-6 border-t-2 border-[#3F2928] flex flex-col sm:flex-row justify-between items-start sm:items-end font-mono text-[10px] sm:text-[11px] text-[#A58B7B] gap-4">
            <div>
              <div>DR. DOC • {t.report.title}</div>
              <div>{t.footer.philosophyText}</div>
            </div>
            <div className="sm:text-right w-full sm:w-auto">
              <div className="border-b border-[#3F2928] w-48 mb-1" />
              <div>{t.report.authorizedSignature}</div>
            </div>
          </div>

        </div>

        {/* Action Panel: Consolidated Master Bundle & Individual Downloads */}
        <div className="mt-8 space-y-6 no-print">
          
          {/* Consolidated Master PDF Export */}
          <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-5 sm:p-6 shadow-[4px_4px_0px_#3F2928]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#7A302F] uppercase flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#7A302F]" />
                  {t.report.submissionPackage}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#3F2928]">
                  {t.report.consolidatedPdfTitle}
                </h3>
                <p className="font-mono text-xs text-[#A58B7B] mt-0.5">
                  {t.report.consolidatedPdfDesc}
                </p>
              </div>

              <button
                onClick={handleDownloadConsolidatedBundle}
                disabled={isDownloadingBundle || documents.length === 0}
                className="w-full sm:w-auto bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-heading text-base font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDownloadingBundle ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> {t.common.loading}</>
                ) : (
                  <><Download className="w-5 h-5" /> {t.report.downloadConsolidatedPdf}</>
                )}
              </button>
            </div>

            {bundleSuccessMsg && (
              <div className="mt-4 p-3 bg-[#F3E4C8] border border-[#7A302F] font-mono text-xs font-bold text-[#7A302F] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7A302F]" />
                <span>{bundleSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Individual Document Downloads with Classified Renaming */}
          {documents.length > 0 && (
            <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-5 sm:p-6 shadow-[4px_4px_0px_#3F2928]">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#3F2928] mb-1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7A302F]" />
                {t.report.individualExportsTitle}
              </h3>
              <p className="font-mono text-xs text-[#A58B7B] mb-4">
                {t.report.individualExportsDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-[#F3E4C8] border border-[#3F2928] flex flex-col justify-between font-mono text-xs">
                    <div className="mb-2">
                      <strong className="text-[#3F2928] block truncate">{doc.documentType}</strong>
                      <span className="text-[10px] text-[#A58B7B] block truncate">{doc.filename}</span>
                    </div>

                    <button
                      onClick={() => openDownloadModal(doc)}
                      className="bg-[#3F2928] hover:bg-[#7A302F] text-[#FFF8EA] py-1.5 px-3 border border-[#3F2928] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> {t.report.exportAsFormat}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Print Certificate Bar */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 font-mono text-xs">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto bg-[#3F2928] text-[#FFF8EA] px-6 py-3 border border-[#3F2928] shadow-[3px_3px_0px_#7A302F] font-bold flex items-center justify-center gap-2 hover:bg-[#7A302F] transition-colors"
            >
              <Printer className="w-4 h-4" />
              {t.report.printReportBtn}
            </button>
          </div>

        </div>

        {/* Smart Download & Format Selector Modal */}
        {downloadModalDoc && (
          <div className="fixed inset-0 bg-[#3F2928]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFF8EA] border-4 border-[#3F2928] shadow-[8px_8px_0px_#3F2928] max-w-md w-full p-6 font-mono">
              
              <div className="flex justify-between items-start mb-4 border-b-2 border-[#3F2928] pb-2">
                <div>
                  <span className="text-[10px] text-[#7A302F] font-bold uppercase">{t.docCard.aiClassified}</span>
                  <h3 className="font-heading text-xl font-bold text-[#3F2928]">
                    {t.inbox.formatModalTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setDownloadModalDoc(null)}
                  className="text-[#3F2928] hover:text-[#7A302F] p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs mb-6">
                <div>
                  <span className="text-[#A58B7B] block mb-1">{t.tools.renameDesc}</span>
                  <div className="p-2 bg-[#F3E4C8] border border-[#3F2928] font-bold text-[#7A302F] truncate">
                    {downloadModalDoc.suggestedFilename || `${downloadModalDoc.documentType.toUpperCase().replace(/\s+/g, '_')}_${downloadModalDoc.filename}`}
                  </div>
                </div>

                <div>
                  <label className="text-[#3F2928] font-bold block mb-2">{t.report.chooseExportFormat}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['pdf', 'png', 'jpg', 'webp'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setChosenFormat(fmt)}
                        className={`py-2 border font-bold uppercase text-center transition-all ${
                          chosenFormat === fmt
                            ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928] shadow-[2px_2px_0px_#7A302F]'
                            : 'bg-[#FFF8EA] text-[#3F2928] border-[#3F2928] hover:bg-[#F3E4C8]'
                        }`}
                      >
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={executeDownloadSingle}
                  className="flex-1 bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] py-2.5 font-heading text-base font-bold border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t.report.downloadAs} {chosenFormat.toUpperCase()}
                </button>
                <button
                  onClick={() => setDownloadModalDoc(null)}
                  className="px-4 py-2.5 bg-[#FFF8EA] hover:bg-[#F3E4C8] text-[#3F2928] border border-[#3F2928] font-bold text-xs"
                >
                  {t.common.cancel}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};
