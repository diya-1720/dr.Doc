import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  Download, 
  FileText, 
  Layers, 
  Package, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  ArrowDownToLine,
  Trash2
} from 'lucide-react';
import { 
  getSharePackage, 
  deleteSharePackage,
  downloadAllAsZip, 
  triggerFileDownload, 
  type SharePackageData,
  type ShareDocumentItem 
} from '../services/shareService';

export const ShareDownloadPage: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<SharePackageData | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);

  // Fetch session data
  useEffect(() => {
    if (!shareId) {
      setLoading(false);
      setIsExpired(true);
      return;
    }

    const loadSession = async () => {
      setLoading(true);
      const res = await getSharePackage(shareId);
      if (res.data && !res.isExpired) {
        setSession(res.data);
        setIsExpired(false);
        setRemainingSeconds(res.data.remainingSeconds || 0);
      } else {
        setIsExpired(true);
      }
      setLoading(false);
    };

    loadSession();
  }, [shareId]);

  // Live countdown timer
  useEffect(() => {
    if (!session || isExpired) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((session.expiresAt - now) / 1000));
      setRemainingSeconds(diff);
      if (diff <= 0) {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session, isExpired]);

  // Format seconds to MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1-Tap Document Download
  const handleDownloadDoc = (doc: ShareDocumentItem) => {
    setDownloadingDocId(doc.id);
    triggerFileDownload(doc.dataUrl, doc.classifiedFilename);
    setTimeout(() => setDownloadingDocId(null), 1000);
  };

  // 1-Tap Merged PDF Download
  const handleDownloadMergedPdf = () => {
    if (!session?.mergedPdfDataUrl) return;
    triggerFileDownload(session.mergedPdfDataUrl, session.mergedPdfFilename || 'CONSOLIDATED_CASE_DOCUMENTS.pdf');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3E4C8] text-[#3F2928] font-mono flex items-center justify-center p-6">
        <div className="bg-[#FFF8EA] border-3 border-[#3F2928] p-8 shadow-[8px_8px_0px_#3F2928] text-center space-y-4 max-w-sm w-full">
          <div className="w-12 h-12 border-4 border-[#7A302F] border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-base font-black uppercase">Connecting to Dr. Doc Hub...</h2>
          <p className="text-xs text-[#3F2928]/70">Retrieving encrypted case transfer package</p>
        </div>
      </div>
    );
  }

  // EXPIRED STATE
  if (isExpired || !session) {
    return (
      <div className="min-h-screen bg-[#F3E4C8] text-[#3F2928] font-mono flex items-center justify-center p-4">
        <div className="bg-[#FFF8EA] border-3 border-[#3F2928] shadow-[8px_8px_0px_#3F2928] max-w-md w-full p-6 sm:p-8 space-y-6 text-center">
          
          <div className="w-16 h-16 bg-[#7A302F] text-[#FFF8EA] border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#7A302F] bg-[#F3E4C8] px-2 py-0.5 border border-[#3F2928]">
              SECURITY TIMEOUT
            </span>
            <h1 className="text-xl font-black uppercase text-[#3F2928]">
              Transfer Session Expired
            </h1>
            <p className="text-xs text-[#3F2928]/80 leading-relaxed">
              For privacy and data protection, Dr. Doc QR code mobile transfer sessions are strictly limited to <strong>30 minutes</strong>.
            </p>
          </div>

          <div className="border-2 border-[#D97706] bg-[#FEF3C7] p-3.5 text-xs text-[#92400E] text-left flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 text-[#D97706] mt-0.5" />
            <div>
              <p className="font-bold uppercase">Need these files?</p>
              <p className="mt-0.5">Please generate a new QR transfer code from the Dr. Doc workstation on your computer.</p>
            </div>
          </div>

          <Link
            to="/"
            className="block w-full py-3 bg-[#7A302F] text-[#FFF8EA] font-black text-xs uppercase border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] hover:bg-[#5c2322] transition-colors"
          >
            Go to Dr. Doc Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ACTIVE MOBILE DOWNLOAD PORTAL
  return (
    <div className="min-h-screen bg-[#F3E4C8] text-[#3F2928] font-mono pb-16">
      
      {/* Sticky Countdown Header */}
      <header className="bg-[#3F2928] text-[#FFF8EA] border-b-3 border-[#3F2928] sticky top-0 z-30 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#7A302F] border border-[#FFF8EA]/30 flex items-center justify-center text-xs font-black">
              🩺
            </div>
            <div>
              <h1 className="text-xs font-black uppercase tracking-wider">DR. DOC MOBILE HUB</h1>
              <p className="text-[10px] text-[#FFF8EA]/70">Verified Case Hand-Off</p>
            </div>
          </div>

          {/* Live Expiration Countdown Badge */}
          <div className={`px-2.5 py-1 text-xs font-bold uppercase border border-current flex items-center gap-1.5 ${
            remainingSeconds > 300 
              ? 'bg-[#FEF3C7] text-[#92400E] border-[#D97706]' 
              : 'bg-[#FEE2E2] text-[#991B1B] border-[#DC2626] animate-pulse'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Case & Applicant Summary Card */}
        <div className="bg-[#FFF8EA] border-3 border-[#3F2928] p-5 shadow-[6px_6px_0px_#3F2928] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3F2928]/20 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#7A302F] tracking-wider">APPLICANT CASE</span>
              <h2 className="text-base font-black uppercase text-[#3F2928]">{session.applicantName}</h2>
              <p className="text-xs text-[#3F2928]/70">Case ID: {session.caseId}</p>
            </div>

            <div className="bg-[#E8F5E9] border-2 border-[#2E7D32] px-3 py-1.5 text-right">
              <span className="text-[10px] font-bold text-[#2E7D32] uppercase block">Audit Score</span>
              <span className="text-lg font-black text-[#2E7D32]">{session.readinessScore}% READY</span>
            </div>
          </div>

          <div className="text-xs text-[#3F2928]/80 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>All {session.documents.length} documents verified & renamed according to AI classification.</span>
          </div>
        </div>

        {/* Big Quick-Action Cards: Merged PDF & ZIP Package */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Consolidated Master PDF */}
          {session.hasMergedPdf && session.mergedPdfDataUrl && (
            <div className="bg-[#FFF8EA] border-3 border-[#3F2928] p-4 shadow-[4px_4px_0px_#3F2928] flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#7A302F]">
                  <Layers className="w-5 h-5" />
                  <h3 className="font-black text-xs uppercase">Consolidated Master PDF</h3>
                </div>
                <p className="text-[11px] text-[#3F2928]/80 leading-relaxed">
                  All {session.documents.length} approved documents merged into 1 single multi-page PDF for submission.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadMergedPdf}
                className="w-full py-2.5 px-3 bg-[#7A302F] text-[#FFF8EA] hover:bg-[#5c2322] font-black text-xs uppercase border-2 border-[#3F2928] shadow-[2px_2px_0px_#3F2928] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Download Merged PDF</span>
              </button>
            </div>
          )}

          {/* Download Full ZIP Package */}
          <div className="bg-[#FFF8EA] border-3 border-[#3F2928] p-4 shadow-[4px_4px_0px_#3F2928] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#7A302F]">
                <Package className="w-5 h-5" />
                <h3 className="font-black text-xs uppercase">Download Complete ZIP</h3>
              </div>
              <p className="text-[11px] text-[#3F2928]/80 leading-relaxed">
                Download all individual classified files, merged PDF, and audit summary in 1 ZIP archive.
              </p>
            </div>

            <button
              type="button"
              onClick={() => downloadAllAsZip(session)}
              className="w-full py-2.5 px-3 bg-[#3F2928] text-[#FFF8EA] hover:bg-[#251817] font-black text-xs uppercase border-2 border-[#3F2928] shadow-[2px_2px_0px_#3F2928] flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download ZIP Package</span>
            </button>
          </div>
        </div>

        {/* Individual Document Files List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#7A302F]">
              Individual Document Files ({session.documents.length}):
            </h3>
            <span className="text-[10px] text-[#3F2928]/70">Tap to download</span>
          </div>

          <div className="space-y-2.5">
            {session.documents.map((doc, idx) => (
              <div 
                key={doc.id || idx}
                className="bg-[#FFF8EA] border-2 border-[#3F2928] p-3.5 shadow-[3px_3px_0px_#3F2928] flex items-center justify-between gap-3 hover:bg-[#F3E4C8]/30 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-[#F3E4C8] border-2 border-[#3F2928] flex items-center justify-center text-xs font-bold text-[#7A302F] shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black truncate text-[#3F2928]">
                      {doc.classifiedFilename}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase bg-[#F3E4C8] text-[#7A302F] px-1.5 py-0.2 border border-[#3F2928]/40">
                        {doc.documentType}
                      </span>
                      <span className="text-[10px] font-bold text-[#3F2928]/70 uppercase">
                        {doc.format.toUpperCase()} • {(doc.fileSizeBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1-Tap Download Button */}
                <button
                  type="button"
                  onClick={() => handleDownloadDoc(doc)}
                  disabled={downloadingDocId === doc.id}
                  className="shrink-0 py-2 px-3 bg-[#7A302F] text-[#FFF8EA] hover:bg-[#5c2322] font-bold text-xs uppercase border-2 border-[#3F2928] shadow-[2px_2px_0px_#3F2928] flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice & Early Deletion Card */}
        <div className="border-2 border-[#3F2928]/30 bg-[#FFF8EA]/50 p-4 text-[11px] text-[#3F2928]/70 space-y-2.5">
          <div>
            <p className="font-bold uppercase text-[#3F2928]">🔒 Dr. Doc Privacy & Auto-Deletion</p>
            <p className="mt-0.5">
              This transfer link is temporary and will self-destruct after 30 minutes. Finished downloading? You can delete this session now to ensure no one else can access it.
            </p>
          </div>

          <button
            type="button"
            onClick={async () => {
              if (shareId && window.confirm('Are you sure you want to end this transfer session and delete the QR code?')) {
                await deleteSharePackage(shareId);
                setIsExpired(true);
              }
            }}
            className="w-full py-2 px-3 bg-[#FFF8EA] hover:bg-[#DC2626] text-[#DC2626] hover:text-white font-bold text-xs uppercase border border-[#DC2626] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Finished Downloading? End Session & Delete QR Code</span>
          </button>
        </div>

      </main>
    </div>
  );
};
