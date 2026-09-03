import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  fetchShareSession, 
  type ShareSessionMetadata, 
  type ShareableFileItem 
} from '../services/qrService';
import { 
  Download, 
  FileText, 
  FileCheck, 
  FileSpreadsheet, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Layers,
  ArrowDownToLine,
  Globe
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export const ShareDownloadPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { t, language, setLanguage } = useLanguage();

  const [session, setSession] = useState<ShareSessionMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorType, setErrorType] = useState<'EXPIRED' | 'NOT_FOUND' | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorType('NOT_FOUND');
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setErrorType(null);

    fetchShareSession(token)
      .then((data: ShareSessionMetadata) => {
        if (!isMounted) return;
        setSession(data);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        if (err.message === 'SHARE_EXPIRED') {
          setErrorType('EXPIRED');
        } else {
          setErrorType('NOT_FOUND');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Download a single file
  const handleDownloadFile = async (file: ShareableFileItem) => {
    setDownloadingId(file.id);
    setSuccessMsg(null);
    try {
      if (file.base64Data) {
        // Direct download from Base64
        const a = document.createElement('a');
        a.href = file.base64Data;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (file.downloadUrl) {
        // Download from backend endpoint
        const a = document.createElement('a');
        a.href = file.downloadUrl;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        throw new Error('File data unavailable');
      }

      setSuccessMsg(`Downloaded: ${file.name}`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Download failed: ${err.message || 'Error fetching file'}`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Download all files sequentially
  const handleDownloadAll = async () => {
    if (!session || !session.files || session.files.length === 0) return;
    setDownloadingAll(true);
    setSuccessMsg(null);

    try {
      for (let i = 0; i < session.files.length; i++) {
        const file = session.files[i];
        if (file.base64Data) {
          const a = document.createElement('a');
          a.href = file.base64Data;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else if (file.downloadUrl) {
          const a = document.createElement('a');
          a.href = file.downloadUrl;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        // Small delay between downloads so browser doesn't block multi-download
        await new Promise((r) => setTimeout(r, 450));
      }

      setSuccessMsg(`All ${session.files.length} files downloaded successfully!`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(`Download all failed: ${err.message || 'Error triggering downloads'}`);
    } finally {
      setDownloadingAll(false);
    }
  };

  const getFileCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'BUNDLE':
        return t.qr.consolidatedPdf;
      case 'ORIGINAL':
        return t.qr.originalDocument;
      case 'PROCESSED':
        return t.qr.processedImage;
      case 'OCR':
        return t.qr.ocrExport;
      case 'REPORT':
        return t.qr.crossCheckReport;
      default:
        return 'Document';
    }
  };

  const getFileIcon = (file: ShareableFileItem) => {
    if (file.category === 'BUNDLE') return <Layers className="w-5 h-5 text-[#7A302F]" />;
    if (file.mimeType.includes('pdf')) return <FileCheck className="w-5 h-5 text-[#7A302F]" />;
    if (file.category === 'OCR') return <FileSpreadsheet className="w-5 h-5 text-[#3F2928]" />;
    return <FileText className="w-5 h-5 text-[#3F2928]" />;
  };

  return (
    <div className="min-h-screen bg-[#F3E4C8] text-[#3F2928] flex flex-col justify-between antialiased selection:bg-[#7A302F] selection:text-[#FFF8EA]">
      
      {/* Top Navbar / Header */}
      <header className="bg-[#FFF8EA] border-b-2 sm:border-b-4 border-[#3F2928] py-3 px-4 sm:px-8 shadow-[0px_4px_0px_#3F2928] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-2">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src={logoImg} alt="DR. DOC" className="h-9 sm:h-11 w-auto object-contain" />
            <div>
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-wider text-[#3F2928] block leading-none">
                DR. DOC
              </span>
              <span className="font-mono text-[9px] font-bold text-[#7A302F] tracking-widest uppercase">
                SECURE DOCUMENT DOWNLOAD
              </span>
            </div>
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 font-mono text-xs">
            <Globe className="w-3.5 h-3.5 text-[#7A302F] mr-0.5 hidden sm:inline" />
            {(['en', 'hi', 'mr'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 font-bold border transition-colors ${
                  language === lang
                    ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928]'
                    : 'bg-[#FFF8EA] text-[#3F2928] border-[#3F2928] hover:bg-[#F3E4C8]'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Download Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-8">
        
        {/* Loading Spinner */}
        {loading && (
          <div className="bg-[#FFF8EA] border-2 sm:border-4 border-[#3F2928] p-8 sm:p-12 shadow-[6px_6px_0px_#3F2928] text-center my-8">
            <Loader2 className="w-10 h-10 animate-spin text-[#7A302F] mx-auto mb-3" />
            <h2 className="font-heading text-xl font-bold text-[#3F2928]">{t.qr.preparingFiles}</h2>
            <p className="font-mono text-xs text-[#A58B7B] mt-1">Verifying secure token and decrypting document package...</p>
          </div>
        )}

        {/* Expired Link State */}
        {errorType === 'EXPIRED' && !loading && (
          <div className="bg-[#FFF8EA] border-2 sm:border-4 border-[#7A302F] p-6 sm:p-10 shadow-[6px_6px_0px_#7A302F] text-center my-8">
            <div className="w-14 h-14 bg-[#7A302F] text-[#FFF8EA] border-2 border-[#3F2928] flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#7A302F] mb-2">{t.qr.linkExpiredTitle}</h2>
            <p className="font-mono text-xs sm:text-sm text-[#3F2928] max-w-md mx-auto mb-6">
              {t.qr.linkExpiredDesc}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#3F2928] hover:bg-[#7A302F] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-bold text-xs font-mono transition-colors"
            >
              <span>Return to DR. DOC Home</span>
            </Link>
          </div>
        )}

        {/* Invalid / Not Found State */}
        {errorType === 'NOT_FOUND' && !loading && (
          <div className="bg-[#FFF8EA] border-2 sm:border-4 border-[#3F2928] p-6 sm:p-10 shadow-[6px_6px_0px_#3F2928] text-center my-8">
            <div className="w-14 h-14 bg-[#3F2928] text-[#FFF8EA] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-amber-400" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#3F2928] mb-2">Invalid Share Link</h2>
            <p className="font-mono text-xs sm:text-sm text-[#A58B7B] max-w-md mx-auto mb-6">
              The requested QR code or share URL is invalid or has been revoked. Please check the URL and try again.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-bold text-xs font-mono transition-colors"
            >
              <span>Go to DR. DOC Portal</span>
            </Link>
          </div>
        )}

        {/* Active Valid Session */}
        {session && !loading && !errorType && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            
            {/* Header Hero Card */}
            <div className="bg-[#FFF8EA] border-2 sm:border-4 border-[#3F2928] p-4 sm:p-6 shadow-[6px_6px_0px_#3F2928]">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-[#3F2928] pb-3 mb-4 gap-2">
                <div>
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-[#7A302F] tracking-widest uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.qr.secureDownloadTitle}
                  </span>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#3F2928] leading-tight">
                    {session.applicationName}
                  </h1>
                </div>

                <div className="font-mono text-xs text-left sm:text-right">
                  <span className="text-[#A58B7B] block text-[10px] uppercase">{t.qr.caseId}</span>
                  <strong className="text-sm font-bold text-[#7A302F]">{session.caseId}</strong>
                </div>
              </div>

              {/* Security & Expiry Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] p-2.5 bg-[#F3E4C8] border border-[#3F2928]">
                <div className="flex items-center gap-1.5 text-[#3F2928]">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                  <span>{t.qr.downloadReady} ({session.files.length} {t.qr.fileCount.toLowerCase()})</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#7A302F] font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.qr.expiresIn}</span>
                </div>
              </div>

              {/* Master Download All Action */}
              {session.files.length > 1 && (
                <div className="mt-4 pt-3 border-t border-[#3F2928]/30">
                  <button
                    onClick={handleDownloadAll}
                    disabled={downloadingAll}
                    className="w-full bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] py-3 px-4 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-heading text-base font-bold flex items-center justify-center gap-2 transition-transform active:translate-y-0.5 disabled:opacity-50"
                  >
                    {downloadingAll ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t.qr.downloadingAll}</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-5 h-5" />
                        <span>{t.qr.downloadAll} ({session.files.length})</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Success Notification */}
              {successMsg && (
                <div className="mt-3 p-2.5 bg-green-100 border border-green-800 text-green-900 font-mono text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-green-800" />
                  <span>{successMsg}</span>
                </div>
              )}

            </div>

            {/* Individual Files Card List */}
            <div className="bg-[#FFF8EA] border-2 sm:border-4 border-[#3F2928] p-4 sm:p-6 shadow-[6px_6px_0px_#3F2928]">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-[#3F2928] mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7A302F]" />
                {t.qr.availableFiles}
              </h2>

              <div className="space-y-3 font-mono">
                {session.files.map((file: ShareableFileItem) => (
                  <div
                    key={file.id}
                    className="p-3 sm:p-4 bg-[#F3E4C8] border-2 border-[#3F2928] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-[#ebd8b6] transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 bg-[#FFF8EA] border border-[#3F2928] shrink-0 mt-0.5 sm:mt-0">
                        {getFileIcon(file)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-[#7A302F] uppercase block tracking-wider">
                          {getFileCategoryLabel(file.category)}
                        </span>
                        <strong className="text-xs sm:text-sm text-[#3F2928] block truncate max-w-xs sm:max-w-md">
                          {file.name}
                        </strong>
                        <span className="text-[10px] text-[#A58B7B]">
                          {(file.sizeBytes / 1024).toFixed(0)} KB • {file.mimeType.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadFile(file)}
                      disabled={downloadingId === file.id || downloadingAll}
                      className="w-full sm:w-auto bg-[#3F2928] hover:bg-[#7A302F] text-[#FFF8EA] py-2 px-4 border border-[#3F2928] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
                    >
                      {downloadingId === file.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>{t.qr.download}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Security Footnote */}
              <div className="mt-4 pt-3 border-t border-[#3F2928]/20 font-mono text-[10px] text-[#A58B7B] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
                <span>{t.qr.securityNote}</span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#FFF8EA] border-t-2 border-[#3F2928] py-4 px-4 text-center font-mono text-[11px] text-[#A58B7B]">
        <div>© 2026 DR. DOC • Official Forensic Document Intelligence</div>
        <div className="mt-0.5 text-[9px] text-[#7A302F]">Secure Client Document Distribution Portal</div>
      </footer>

    </div>
  );
};
