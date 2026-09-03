import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  X, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import { 
  generateQrDataUrl, 
  createCaseShareSession, 
  prepareCaseFilesForShare,
  type ShareableFileItem 
} from '../services/qrService';
import type { DocItem, ApplicationRequirement, CrossCheckResult } from '../types';

interface QrShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocItem[];
  caseId: string;
  currentApp: ApplicationRequirement;
  crossCheckResult?: CrossCheckResult | null;
}

export const QrShareModal: React.FC<QrShareModalProps> = ({
  isOpen,
  onClose,
  documents,
  caseId,
  currentApp,
  crossCheckResult,
}) => {
  const { t } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [files, setFiles] = useState<ShareableFileItem[]>([]);
  const [isPreparing, setIsPreparing] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQrDataUrl(null);
      setShareUrl('');
      setCopied(false);
      setErrorMsg(null);
      return;
    }

    let isMounted = true;
    setIsPreparing(true);
    setErrorMsg(null);

    async function initShare() {
      try {
        const shareFiles = await prepareCaseFilesForShare(documents, caseId, currentApp, crossCheckResult);
        if (!isMounted) return;
        setFiles(shareFiles);

        const session = await createCaseShareSession(caseId, currentApp.name, shareFiles, 24);
        if (!isMounted) return;

        setShareUrl(session.shareUrl);

        const qrImg = await generateQrDataUrl(session.shareUrl);
        if (!isMounted) return;
        setQrDataUrl(qrImg);
      } catch (err: any) {
        console.error('Failed to generate QR share bundle:', err);
        if (isMounted) {
          setErrorMsg(err.message || 'Could not prepare files for sharing.');
        }
      } finally {
        if (isMounted) setIsPreparing(false);
      }
    }

    initShare();

    return () => {
      isMounted = false;
    };
  }, [isOpen, documents, caseId, currentApp, crossCheckResult]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadQrImage = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `DR_DOC_QR_${caseId}.png`;
    a.click();
  };

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return (
    <div className="fixed inset-0 bg-[#3F2928]/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#FFF8EA] border-2 sm:border-4 border-[#3F2928] shadow-[6px_6px_0px_#3F2928] sm:shadow-[8px_8px_0px_#3F2928] max-w-lg w-full p-4 sm:p-6 font-mono text-[#3F2928] my-8 relative">
        
        {/* Header Bar */}
        <div className="flex justify-between items-start mb-4 border-b-2 sm:border-b-4 border-[#3F2928] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#7A302F] text-[#FFF8EA] border border-[#3F2928]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#7A302F] tracking-widest uppercase block">
                {t.qr.qrModalTitle}
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#3F2928] leading-tight">
                {currentApp.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#3F2928] hover:text-[#7A302F] p-1.5 border border-transparent hover:border-[#3F2928] transition-colors"
            title={t.qr.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {isPreparing && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#7A302F]" />
            <span className="font-bold text-xs text-[#3F2928]">{t.qr.preparingFiles}</span>
          </div>
        )}

        {/* Error State */}
        {errorMsg && !isPreparing && (
          <div className="p-4 bg-[#7A302F]/10 border-2 border-[#7A302F] text-[#7A302F] text-xs font-bold my-4">
            {errorMsg}
          </div>
        )}

        {/* Ready Content */}
        {!isPreparing && !errorMsg && qrDataUrl && (
          <div className="space-y-4">
            
            {/* Case Info Badge */}
            <div className="flex flex-wrap justify-between items-center text-[11px] p-2.5 bg-[#F3E4C8] border border-[#3F2928] gap-2">
              <div>
                <span className="text-[#A58B7B] mr-1">{t.qr.caseId}:</span>
                <strong className="text-[#7A302F]">{caseId}</strong>
              </div>
              <div className="flex items-center gap-1 text-[#3F2928]">
                <Clock className="w-3.5 h-3.5 text-[#7A302F]" />
                <span className="font-bold">{t.qr.expiresIn}</span>
              </div>
            </div>

            {/* QR Code Center Display */}
            <div className="flex flex-col items-center justify-center p-4 bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928]">
              <div className="p-2 bg-[#FFF8EA] border-2 border-[#3F2928] rounded-none">
                <img
                  src={qrDataUrl}
                  alt={`QR Code for Case ${caseId}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain image-rendering-pixelated"
                />
              </div>
              <p className="text-[11px] text-[#7A302F] font-bold mt-2.5 text-center flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#7A302F]" />
                {t.qr.scanWithPhone}
              </p>
            </div>

            {/* Localhost Notice if testing in local dev */}
            {isLocalhost && (
              <div className="p-2.5 bg-[#F3E4C8] border border-[#3F2928] text-[10px] text-[#3F2928]">
                💡 <strong>Local Testing:</strong> {t.qr.localDevNotice}
              </div>
            )}

            {/* Available Files in this QR Package */}
            <div className="border border-[#3F2928] p-3 bg-[#FFF8EA]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase text-[#7A302F] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  {t.qr.availableFiles} ({files.length})
                </span>
              </div>

              <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                {files.map((file) => (
                  <div key={file.id} className="flex justify-between items-center py-1 px-2 bg-[#F3E4C8] border border-[#3F2928]/40">
                    <span className="truncate max-w-[240px] font-bold text-[#3F2928]">{file.name}</span>
                    <span className="text-[10px] text-[#7A302F] font-bold shrink-0">
                      {(file.sizeBytes / 1024).toFixed(0)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 bg-[#3F2928] hover:bg-[#7A302F] text-[#FFF8EA] border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? t.qr.linkCopied : t.qr.copyLink}
              </button>

              <button
                onClick={handleDownloadQrImage}
                className="py-2.5 px-3 bg-[#FFF8EA] hover:bg-[#F3E4C8] text-[#3F2928] border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-[#7A302F]" />
                {t.qr.downloadQr}
              </button>
            </div>

            {/* Open Share Page Direct Link (for Desktop preview) */}
            <div className="text-center pt-1">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#7A302F] hover:underline font-bold"
              >
                <span>Preview mobile download page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
