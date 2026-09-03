import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  X, 
  Layers, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Package,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import type { DocItem } from '../types';
import { 
  type ExportFormat, 
  createSharePackage, 
  deleteSharePackage,
  generateQrCodeDataUrl, 
  generateClassifiedFilename,
  downloadAllAsZip,
  type SharePackageData 
} from '../services/shareService';

interface QrExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents?: DocItem[];
  applicantName?: string;
  readinessScore?: number;
  reportSummary?: any;
}

export const QrExportModal: React.FC<QrExportModalProps> = ({
  isOpen,
  onClose,
  documents = [],
  applicantName = 'Applicant',
  readinessScore = 100,
  reportSummary
}) => {
  // Step 1: Configure | Step 2: Generated QR
  const [step, setStep] = useState<'config' | 'qr'>('config');

  // Format mapping per document
  const [formatConfigs, setFormatConfigs] = useState<Record<string, ExportFormat>>({});
  const [includeMergedPdf, setIncludeMergedPdf] = useState<boolean>(true);
  const [includeReport, setIncludeReport] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // QR output state
  const [sharePackage, setSharePackage] = useState<SharePackageData | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1800); // 30 minutes

  // Initialize format configs to PDF by default
  useEffect(() => {
    const docs = documents || [];
    if (docs.length > 0) {
      const initial: Record<string, ExportFormat> = {};
      docs.forEach(d => {
        if (d && d.id) {
          initial[d.id] = 'pdf';
        }
      });
      setFormatConfigs(initial);
    }
  }, [documents]);

  // Live 30-minute countdown timer
  useEffect(() => {
    if (step !== 'qr' || !sharePackage) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((sharePackage.expiresAt - now) / 1000));
      setRemainingSeconds(diff);
      if (diff <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [step, sharePackage]);

  if (!isOpen) return null;

  // Bulk format setter
  const setAllFormats = (fmt: ExportFormat) => {
    const updated: Record<string, ExportFormat> = {};
    (documents || []).forEach(d => {
      if (d && d.id) {
        updated[d.id] = fmt;
      }
    });
    setFormatConfigs(updated);
  };

  // Generate QR Code package
  const handleGenerateQr = async () => {
    setIsGenerating(true);
    try {
      const pkg = await createSharePackage(documents, formatConfigs, {
        applicantName,
        readinessScore,
        includeMergedPdf,
        includeReport,
        reportSummary
      });

      // Construct absolute share URL
      const origin = window.location.origin;
      const url = `${origin}/share/${pkg.shareId}`;
      const qrImg = await generateQrCodeDataUrl(url);

      setSharePackage(pkg);
      setShareUrl(url);
      setQrDataUrl(qrImg);
      setRemainingSeconds(1800);
      setStep('qr');
    } catch (err: any) {
      alert(`Failed to generate QR Code: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Early QR Code Deletion Handler
  const handleDeleteQr = async () => {
    if (!sharePackage) return;
    setIsDeleting(true);
    try {
      await deleteSharePackage(sharePackage.shareId);
      setSharePackage(null);
      setQrDataUrl(null);
      setShareUrl('');
      setShowDeleteConfirm(false);
      setStep('config');
    } catch (err: any) {
      alert(`Error deleting QR code: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy share URL to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download QR Code image file
  const handleDownloadQrImage = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `DR_DOC_TRANSFER_QR_${applicantName.toUpperCase().replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Format seconds to MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFF8EA] border-3 border-[#3F2928] shadow-[10px_10px_0px_#3F2928] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-none flex flex-col font-mono text-[#3F2928]">
        
        {/* Modal Header */}
        <div className="bg-[#3F2928] text-[#FFF8EA] p-4 flex items-center justify-between border-b-2 border-[#3F2928] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#7A302F] p-2 border border-[#FFF8EA]/30 text-[#FFF8EA]">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider">
                {step === 'config' ? 'QR Code Export & Mobile Transfer' : 'Scan to Download Documents'}
              </h2>
              <p className="text-xs text-[#FFF8EA]/70">
                {step === 'config' 
                  ? 'Select formats & generate a 30-minute self-expiring mobile download QR code' 
                  : '30-minute secure applicant hand-off window active'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-[#7A302F] text-[#FFF8EA] border border-transparent hover:border-[#FFF8EA] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 space-y-6">
          
          {step === 'config' ? (
            <>
              {/* Top Informational Banner */}
              <div className="bg-[#F3E4C8] border-2 border-[#3F2928] p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#7A302F] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold uppercase tracking-wider text-[#7A302F]">
                    Automatic AI Classification Renaming Included
                  </p>
                  <p className="text-[#3F2928]/80 leading-relaxed">
                    All documents will be auto-renamed according to their verified official classification (e.g., <code className="bg-[#FFF8EA] px-1 py-0.5 border border-[#3F2928]/30 font-bold">AADHAAR_CARD_{applicantName.toUpperCase().replace(/\s+/g, '_')}.pdf</code>).
                  </p>
                </div>
              </div>

              {/* Bulk Format Quick Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#7A302F] mb-2">
                  Apply Format to All Documents:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['pdf', 'png', 'jpg', 'webp', 'original'] as ExportFormat[]).map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setAllFormats(fmt)}
                      className="px-3 py-2 text-xs font-bold uppercase border-2 border-[#3F2928] bg-[#FFF8EA] hover:bg-[#7A302F] hover:text-[#FFF8EA] transition-colors shadow-[2px_2px_0px_#3F2928] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      {fmt === 'original' ? 'Original' : fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Format Customization List */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-[#7A302F]">
                  Document Format & Classified Name Preview ({(documents || []).length} files):
                </label>
                <div className="border-2 border-[#3F2928] divide-y-2 divide-[#3F2928] bg-[#FFF8EA] max-h-60 overflow-y-auto">
                  {(documents || []).length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#A58B7B]">
                      No documents in current case yet. Upload or load demo documents to generate a mobile transfer package.
                    </div>
                  ) : (
                    (documents || []).map((doc, idx) => {
                      const currentFormat = formatConfigs[doc?.id] || 'pdf';
                      const previewName = doc ? generateClassifiedFilename(doc, currentFormat, applicantName) : 'DOCUMENT.pdf';

                      return (
                        <div key={doc?.id || idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F3E4C8]/50">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="text-xs font-bold text-[#7A302F] bg-[#F3E4C8] px-1.5 py-0.5 border border-[#3F2928]">
                              #{idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate text-[#3F2928]">
                                {previewName}
                              </p>
                              <p className="text-[10px] text-[#3F2928]/60 truncate">
                                Original: {doc?.filename || 'File'} • Type: <span className="font-semibold text-[#7A302F]">{doc?.documentType || 'Document'}</span>
                              </p>
                            </div>
                          </div>

                          {/* Format Dropdown */}
                          <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                            <span className="text-[10px] uppercase font-bold text-[#7A302F]">Format:</span>
                            <select
                              value={currentFormat}
                              onChange={(e) => setFormatConfigs(prev => ({ ...prev, [doc.id]: e.target.value as ExportFormat }))}
                              className="bg-[#FFF8EA] border-2 border-[#3F2928] px-2 py-1 text-xs font-bold uppercase focus:outline-none focus:bg-[#F3E4C8] shadow-[2px_2px_0px_#3F2928]"
                            >
                              <option value="pdf">PDF (Standard)</option>
                              <option value="png">PNG (High-Res)</option>
                              <option value="jpg">JPG (Photo)</option>
                              <option value="webp">WEBP (Web)</option>
                              <option value="original">Original</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Bundling Options */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-black uppercase tracking-wider text-[#7A302F]">
                  Bundled Package Add-ons:
                </label>
                
                {/* Master Merged PDF Toggle */}
                <label className="flex items-center gap-3 p-3 border-2 border-[#3F2928] bg-[#F3E4C8]/40 hover:bg-[#F3E4C8] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={includeMergedPdf}
                    onChange={(e) => setIncludeMergedPdf(e.target.checked)}
                    className="w-4 h-4 accent-[#7A302F]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="font-bold flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#7A302F]" />
                      <span>Include Consolidated Master PDF (All {(documents || []).length} documents merged into 1 submission file)</span>
                    </div>
                    <p className="text-[11px] text-[#3F2928]/70 mt-0.5">
                      Combines all verified identity & address proofs into a single multi-page PDF ready for portal submission.
                    </p>
                  </div>
                </label>

                {/* Verification Report Toggle */}
                <label className="flex items-center gap-3 p-3 border-2 border-[#3F2928] bg-[#F3E4C8]/40 hover:bg-[#F3E4C8] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={includeReport}
                    onChange={(e) => setIncludeReport(e.target.checked)}
                    className="w-4 h-4 accent-[#7A302F]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#7A302F]" />
                      <span>Include Official Dr. Doc Forensic Verification & Audit Report</span>
                    </div>
                    <p className="text-[11px] text-[#3F2928]/70 mt-0.5">
                      Includes the complete application readiness audit ({readinessScore}% score), cross-document parity matrix, and forensic seal.
                    </p>
                  </div>
                </label>
              </div>

              {/* Expiry Warning Callout */}
              <div className="border-2 border-[#D97706] bg-[#FEF3C7] p-3 flex items-center gap-3 text-xs text-[#92400E]">
                <Clock className="w-5 h-5 shrink-0 text-[#D97706]" />
                <span>
                  <strong>30-Minute Security Window:</strong> Once generated, the QR code and download portal link will remain active for exactly 30 minutes.
                </span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGenerateQr}
                disabled={isGenerating || documents.length === 0}
                className="w-full py-3.5 bg-[#7A302F] text-[#FFF8EA] font-black uppercase text-sm border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] hover:bg-[#5c2322] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#FFF8EA] border-t-transparent rounded-full animate-spin" />
                    <span>Processing & Building QR Package...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    <span>Generate 30-Minute Mobile Download QR Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          ) : (
            /* STEP 2: QR CODE READY */
            <div className="space-y-6 animate-fade-in">
              
              {/* 30-Minute Live Countdown Timer Pill */}
              <div className={`border-2 p-3 flex items-center justify-between font-bold text-xs ${
                remainingSeconds > 300 
                  ? 'bg-[#FEF3C7] border-[#D97706] text-[#92400E]' 
                  : remainingSeconds > 0 
                  ? 'bg-[#FEE2E2] border-[#DC2626] text-[#991B1B] animate-pulse'
                  : 'bg-red-900 text-white border-red-950'
              }`}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {remainingSeconds > 0 ? 'QR TRANSFER CODE ACTIVE' : 'TRANSFER SESSION EXPIRED'}
                  </span>
                </div>
                <div className="text-sm font-black tracking-wider">
                  {remainingSeconds > 0 ? (
                    <span>⏳ EXPIRES IN {formatTime(remainingSeconds)}</span>
                  ) : (
                    <span>EXPIRED (30m ELAPSED)</span>
                  )}
                </div>
              </div>

              {/* QR Code Center Display */}
              <div className="flex flex-col md:flex-row items-center gap-6 bg-[#F3E4C8] border-2 border-[#3F2928] p-6">
                <div className="p-3 bg-[#FFF8EA] border-3 border-[#3F2928] shadow-[6px_6px_0px_#3F2928] shrink-0">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="Dr. Doc Transfer QR Code" 
                      className="w-56 h-56 object-contain"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center">
                      <div className="w-8 h-8 border-3 border-[#7A302F] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-3 flex-1 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[#7A302F] uppercase tracking-wider">Instructions:</span>
                    <h3 className="text-base font-black text-[#3F2928] uppercase mt-0.5">
                      Scan with Phone Camera
                    </h3>
                    <p className="text-[#3F2928]/80 leading-relaxed mt-1">
                      Open your phone camera to instantly access the mobile download portal. You can download all classified documents, the merged PDF, and the verification report directly to your mobile device.
                    </p>
                  </div>

                  <div className="border-t border-[#3F2928]/20 pt-2.5 space-y-1">
                    <p><strong>Applicant:</strong> {sharePackage?.applicantName}</p>
                    <p><strong>Case ID:</strong> {sharePackage?.caseId}</p>
                    <p><strong>Package Contents:</strong> {sharePackage?.documents.length} Documents {sharePackage?.hasMergedPdf && '+ Merged PDF'} {sharePackage?.hasReport && '+ Audit Report'}</p>
                  </div>
                </div>
              </div>

              {/* Share URL Box */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A302F]">
                  Or Copy Direct Mobile Download Link:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#FFF8EA] border-2 border-[#3F2928] px-3 py-2 text-xs font-mono select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-[#7A302F] text-[#FFF8EA] font-bold text-xs uppercase border-2 border-[#3F2928] shadow-[2px_2px_0px_#3F2928] hover:bg-[#5c2322] transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 bg-[#FFF8EA] text-[#3F2928] hover:bg-[#7A302F] hover:text-[#FFF8EA] font-bold text-xs uppercase border-2 border-[#3F2928] shadow-[2px_2px_0px_#3F2928] transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Portal</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadQrImage}
                  className="py-2.5 px-3 bg-[#FFF8EA] text-[#3F2928] hover:bg-[#7A302F] hover:text-[#FFF8EA] font-bold text-xs uppercase border-2 border-[#3F2928] shadow-[2px_2px_0px_#3F2928] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Save QR PNG</span>
                </button>

                <button
                  type="button"
                  onClick={() => sharePackage && downloadAllAsZip(sharePackage)}
                  className="py-2.5 px-3 bg-[#7A302F] text-[#FFF8EA] hover:bg-[#5c2322] font-bold text-xs uppercase border-2 border-[#3F2928] shadow-[2px_2px_0px_#3F2928] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>Download ZIP</span>
                </button>
              </div>

              {/* Early QR Code Deletion / Revocation Button */}
              <div className="pt-2">
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2.5 px-4 bg-[#FFF8EA] hover:bg-[#DC2626] text-[#DC2626] hover:text-white font-bold text-xs uppercase border-2 border-[#DC2626] shadow-[2px_2px_0px_#DC2626] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>🗑️ Revoke & Delete QR Code Early (Security)</span>
                  </button>
                ) : (
                  <div className="p-3.5 bg-[#FEE2E2] border-2 border-[#DC2626] text-[#991B1B] text-xs space-y-2.5">
                    <div className="flex items-center gap-2 font-bold uppercase">
                      <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                      <span>Confirm QR Code Revocation</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Are you sure you want to delete this QR code? The mobile transfer link will be destroyed immediately and no one will be able to scan or download files from it.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleDeleteQr}
                        disabled={isDeleting}
                        className="flex-1 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold uppercase text-xs border border-[#7F1D1D] shadow-[2px_2px_0px_#7F1D1D] cursor-pointer"
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete QR Code Now'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-[#FFF8EA] hover:bg-[#F3E4C8] text-[#3F2928] font-bold uppercase text-xs border border-[#3F2928] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Back / Reconfigure */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('config')}
                  className="text-xs font-bold text-[#7A302F] underline hover:text-[#3F2928] cursor-pointer"
                >
                  ← Reconfigure Formats or Add-ons
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
