import React, { useState, useRef } from 'react';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Sidebar } from '../components/Sidebar';
import { 
  compressDocumentFile, 
  convertImagesToPdf, 
  convertImageFormat,
  convertTxtToPdf,
  extractPdfText,
  enhanceImageReadability, 
  renameFile, 
  mergePdfFiles 
} from '../services/docTools';
import { 
  FileCheck2, 
  FileText, 
  Upload, 
  Download, 
  Layers, 
  Edit3, 
  Sparkles,
  CheckCircle2,
  RefreshCw,
  FileCode2,
  Server,
  FolderOpen
} from 'lucide-react';

export const DocumentToolsPage: React.FC = () => {
  const { documents, replaceDocument } = useForensics();
  const { t } = useLanguage();
  const [activeTool, setActiveTool] = useState<'compress' | 'convert' | 'format' | 'txtpdf' | 'merge' | 'enhance' | 'rename'>('compress');
  
  // Compression State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCaseDocId, setSelectedCaseDocId] = useState<string | null>(null);
  const [targetMb, setTargetMb] = useState<number>(10);
  const [compressedResult, setCompressedResult] = useState<{ file: File; oldSize: number; newSize: number; reductionPercent?: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [replacedInCase, setReplacedInCase] = useState<boolean>(false);

  // Conversion / Merge State
  const [multiFiles, setMultiFiles] = useState<File[]>([]);

  // Format Conversion State
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpg' | 'webp'>('webp');

  // TXT / PDF Mode
  const [txtPdfMode, setTxtPdfMode] = useState<'txt-to-pdf' | 'pdf-to-txt'>('txt-to-pdf');
  const [extractedTextResult, setExtractedTextResult] = useState<string | null>(null);

  // Rename State
  const [renameInput, setRenameInput] = useState<string>('AADHAAR_CARD_RAHUL_KUMAR.pdf');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSelectedCaseDocId(null);
    setReplacedInCase(false);

    if (e.target.files && e.target.files.length > 0) {
      if (activeTool === 'convert' || activeTool === 'merge') {
        let filesArr = Array.from(e.target.files);
        if (filesArr.length > 5) {
          setErrorMsg('Batch tool limit is 5 files. Selected first 5 files.');
          filesArr = filesArr.slice(0, 5);
        }
        setMultiFiles(filesArr);
      } else {
        setSelectedFile(e.target.files[0]);
        if (activeTool === 'rename') {
          setRenameInput(e.target.files[0].name.toUpperCase());
        }
      }
      setCompressedResult(null);
      setExtractedTextResult(null);
    }
  };

  const handlePickCaseDoc = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    setSelectedCaseDocId(doc.id);
    setReplacedInCase(false);
    setErrorMsg(null);
    setCompressedResult(null);
    setExtractedTextResult(null);

    if (doc.fileObj) {
      setSelectedFile(doc.fileObj);
      if (activeTool === 'rename') setRenameInput(doc.filename.toUpperCase());
      return;
    }

    fetch(doc.previewUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], doc.filename, { type: doc.mimeType });
        setSelectedFile(file);
        if (activeTool === 'rename') setRenameInput(doc.filename.toUpperCase());
      })
      .catch(() => {
        const blob = new Blob([doc.rawOcrText || 'Document text'], { type: doc.mimeType || 'text/plain' });
        const file = new File([blob], doc.filename, { type: doc.mimeType || 'text/plain' });
        setSelectedFile(file);
      });
  };

  const handleCompress = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setReplacedInCase(false);
    try {
      const res = await compressDocumentFile(selectedFile, targetMb);
      setCompressedResult({ 
        file: res.compressedFile, 
        oldSize: res.oldSizeMB, 
        newSize: res.newSizeMB,
        reductionPercent: res.reductionPercent 
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Compression failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateInCase = async () => {
    if (!selectedCaseDocId || !compressedResult) return;
    try {
      await replaceDocument(selectedCaseDocId, compressedResult.file);
      setReplacedInCase(true);
    } catch (err: any) {
      setErrorMsg('Failed to update document in case');
    }
  };

  const handleConvert = async () => {
    if (multiFiles.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const pdf = await convertImagesToPdf(multiFiles, 'converted_bundle.pdf');
      downloadFile(pdf);
    } catch (err: any) {
      setErrorMsg(err.message || 'Conversion failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormatConvert = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const converted = await convertImageFormat(selectedFile, targetFormat);
      downloadFile(converted);
    } catch (err: any) {
      setErrorMsg(err.message || 'Format conversion failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTxtPdfConvert = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      if (txtPdfMode === 'txt-to-pdf') {
        const pdf = await convertTxtToPdf(selectedFile);
        downloadFile(pdf);
      } else {
        const text = await extractPdfText(selectedFile);
        setExtractedTextResult(text);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Text conversion failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMerge = async () => {
    if (multiFiles.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const merged = await mergePdfFiles(multiFiles, 'merged_application_bundle.pdf');
      downloadFile(merged);
    } catch (err: any) {
      setErrorMsg(err.message || 'Merge failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const enhanced = await enhanceImageReadability(selectedFile);
      downloadFile(enhanced);
    } catch (err: any) {
      setErrorMsg(err.message || 'Enhancement failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRename = () => {
    if (!selectedFile) return;
    const renamed = renameFile(selectedFile, renameInput);
    downloadFile(renamed);
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928]">
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span>PHASE 09 // {t.tools.tag}</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-[#7A302F] bg-[#FFF8EA] px-2 py-0.5 border border-[#7A302F]">
              <Server className="w-3 h-3" /> NODE ENGINE
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
            {t.tools.title}
          </h1>
          <p className="font-body text-sm text-[#3F2928] mt-1">
            {t.tools.subtitle}
          </p>
        </div>

        {/* Tool Selector Tabs */}
        <div className="flex flex-wrap gap-2 font-mono text-xs mb-6 sm:mb-8">
          {[
            { id: 'compress', label: 'COMPRESS PDF / IMAGE', icon: FileCheck2 },
            { id: 'convert', label: 'JPG / PNG → PDF', icon: FileText },
            { id: 'format', label: 'IMAGE FORMAT (WEBP/JPG/PNG)', icon: RefreshCw },
            { id: 'txtpdf', label: 'TXT ↔ PDF', icon: FileCode2 },
            { id: 'merge', label: 'MERGE PDFs', icon: Layers },
            { id: 'enhance', label: 'IMPROVE READABILITY', icon: Sparkles },
            { id: 'rename', label: 'RENAME FILE', icon: Edit3 },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { 
                  setActiveTool(t.id as any); 
                  setSelectedFile(null); 
                  setSelectedCaseDocId(null);
                  setMultiFiles([]); 
                  setCompressedResult(null); 
                  setExtractedTextResult(null);
                  setErrorMsg(null);
                  setReplacedInCase(false);
                }}
                className={`px-3 sm:px-4 py-2 border font-bold flex items-center gap-2 transition-all text-[11px] sm:text-xs ${
                  isActive
                    ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928] shadow-[3px_3px_0px_#D47794]'
                    : 'bg-[#FFF8EA] text-[#3F2928] border-[#3F2928] hover:bg-[#F3E4C8]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Active Tool Card Workspace */}
        <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-8 shadow-[6px_6px_0px_#3F2928]">
          
          {errorMsg && (
            <div className="p-3 mb-4 bg-[#E8B9B8] border-2 border-[#7A302F] text-[#7A302F] font-mono text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Quick Select from Case Inbox if documents exist */}
          {documents.length > 0 && activeTool !== 'convert' && activeTool !== 'merge' && (
            <div className="mb-5 p-3 bg-[#F3E4C8] border border-[#3F2928]">
              <div className="font-mono text-[11px] font-bold text-[#7A302F] uppercase mb-2 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5" />
                OR PICK FROM CURRENT CASE INBOX ({documents.length} DOCS):
              </div>
              <div className="flex flex-wrap gap-2">
                {documents.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handlePickCaseDoc(d.id)}
                    className={`px-2.5 py-1 font-mono text-xs border transition-all ${
                      selectedCaseDocId === d.id
                        ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928] font-bold shadow-[2px_2px_0px_#D47794]'
                        : 'bg-[#FFF8EA] text-[#3F2928] border-[#3F2928] hover:bg-[#FFF8EA]/80'
                    }`}
                  >
                    {d.documentType} ({d.fileSizeMB} MB)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Zone for Active Tool */}
          <div className="mb-6">
            <label className="font-mono text-xs font-bold text-[#3F2928] block mb-2 uppercase">
              SELECT FILE(S) TO PROCESS (MAX 5 FILES):
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple={activeTool === 'convert' || activeTool === 'merge'}
              accept={
                activeTool === 'convert' || activeTool === 'format' || activeTool === 'enhance'
                  ? 'image/png,image/jpeg,image/webp'
                  : activeTool === 'txtpdf'
                  ? '.txt,.pdf'
                  : '.pdf,.png,.jpg,.jpeg,.webp'
              }
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#F3E4C8] hover:bg-[#FFF8EA] text-[#3F2928] px-4 sm:px-6 py-4 border-2 border-dashed border-[#3F2928] font-mono text-xs font-bold w-full text-center flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5 text-[#7A302F] shrink-0" />
              <span className="truncate">
                {selectedFile 
                  ? `SELECTED: ${selectedFile.name} (${(selectedFile.size / (1024*1024)).toFixed(2)} MB)`
                  : multiFiles.length > 0
                  ? `SELECTED ${multiFiles.length} FILES (MAX 5)`
                  : 'CLICK TO SELECT FILE FROM YOUR COMPUTER'}
              </span>
            </button>
          </div>

          {/* TOOL 1: COMPRESS PDF / IMAGE */}
          {activeTool === 'compress' && (
            <div className="space-y-6 font-mono text-xs">
              <div>
                <label className="font-bold text-[#3F2928] block mb-2">
                  TARGET PORTAL FILE SIZE THRESHOLD (MB):
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={targetMb}
                    onChange={(e) => setTargetMb(parseInt(e.target.value))}
                    className="w-full sm:w-64 accent-[#7A302F]"
                  />
                  <span className="font-bold text-base text-[#7A302F]">{targetMb} MB LIMIT</span>
                </div>
              </div>

              <button
                onClick={handleCompress}
                disabled={!selectedFile || isProcessing}
                className="w-full sm:w-auto bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-heading text-base sm:text-lg font-bold disabled:opacity-50"
              >
                {isProcessing ? 'PROCESSING BACKEND COMPRESSION...' : `COMPRESS FILE BELOW ${targetMb} MB`}
              </button>

              {compressedResult && (
                <div className="p-4 bg-[#F3E4C8] border-2 border-[#7A302F] mt-6">
                  <div className="font-heading text-lg sm:text-xl font-bold text-[#7A302F] mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    COMPRESSION SUCCESSFUL!
                  </div>
                  <div className="space-y-1 mb-4 text-[#3F2928]">
                    <div>BEFORE SIZE: <strong>{compressedResult.oldSize} MB</strong></div>
                    <div>AFTER SIZE: <strong className="text-[#7A302F]">{compressedResult.newSize} MB</strong></div>
                    {compressedResult.reductionPercent && (
                      <div>REDUCTION: <strong className="text-[#7A302F]">{compressedResult.reductionPercent}% SMALLER</strong></div>
                    )}
                    <div className="text-[11px] text-[#7A302F]">✓ READY FOR SUBMISSION</div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => downloadFile(compressedResult.file)}
                      className="w-full sm:w-auto bg-[#7A302F] text-[#FFF8EA] px-5 py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] font-bold flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      DOWNLOAD COMPRESSED FILE ({compressedResult.newSize} MB)
                    </button>

                    {selectedCaseDocId && (
                      <button
                        onClick={handleUpdateInCase}
                        disabled={replacedInCase}
                        className="w-full sm:w-auto bg-[#3F2928] text-[#FFF8EA] px-5 py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] font-bold flex items-center justify-center gap-2 disabled:opacity-75"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        {replacedInCase ? 'UPDATED IN CASE FILE ✓' : 'REPLACE IN CURRENT CASE FILE'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TOOL 2: CONVERT IMAGES TO PDF */}
          {activeTool === 'convert' && (
            <div className="space-y-6 font-mono text-xs">
              <p className="text-[#A58B7B]">
                Select up to 5 PNG/JPG/WEBP photos. The backend sharp + pdf-lib engine bundles them into a multi-page A4 PDF document.
              </p>
              <button
                onClick={handleConvert}
                disabled={multiFiles.length === 0 || isProcessing}
                className="w-full sm:w-auto bg-[#7A302F] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-heading text-base sm:text-lg font-bold disabled:opacity-50"
              >
                {isProcessing ? 'CONVERTING ON BACKEND...' : `CONVERT ${multiFiles.length} IMAGE(S) TO PDF & DOWNLOAD`}
              </button>
            </div>
          )}

          {/* TOOL 3: FORMAT CONVERSION */}
          {activeTool === 'format' && (
            <div className="space-y-6 font-mono text-xs">
              <div>
                <label className="font-bold text-[#3F2928] block mb-2">TARGET IMAGE FORMAT:</label>
                <div className="flex gap-3">
                  {(['webp', 'jpg', 'png'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      className={`px-4 py-2 border font-bold uppercase ${
                        targetFormat === fmt
                          ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928] shadow-[2px_2px_0px_#7A302F]'
                          : 'bg-[#F3E4C8] text-[#3F2928] border-[#3F2928]'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleFormatConvert}
                disabled={!selectedFile || isProcessing}
                className="w-full sm:w-auto bg-[#7A302F] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-heading text-base sm:text-lg font-bold disabled:opacity-50"
              >
                {isProcessing ? 'CONVERTING FORMAT...' : `CONVERT TO ${targetFormat.toUpperCase()} & DOWNLOAD`}
              </button>
            </div>
          )}

          {/* TOOL 4: TXT <-> PDF */}
          {activeTool === 'txtpdf' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex gap-3">
                <button
                  onClick={() => { setTxtPdfMode('txt-to-pdf'); setSelectedFile(null); setSelectedCaseDocId(null); }}
                  className={`px-4 py-2 border font-bold ${
                    txtPdfMode === 'txt-to-pdf'
                      ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928]'
                      : 'bg-[#F3E4C8] text-[#3F2928] border-[#3F2928]'
                  }`}
                >
                  TXT → PDF (PDFKIT LAYOUT)
                </button>
                <button
                  onClick={() => { setTxtPdfMode('pdf-to-txt'); setSelectedFile(null); setSelectedCaseDocId(null); }}
                  className={`px-4 py-2 border font-bold ${
                    txtPdfMode === 'pdf-to-txt'
                      ? 'bg-[#3F2928] text-[#FFF8EA] border-[#3F2928]'
                      : 'bg-[#F3E4C8] text-[#3F2928] border-[#3F2928]'
                  }`}
                >
                  PDF → TXT (PDF-PARSE EXTRACTION)
                </button>
              </div>

              <button
                onClick={handleTxtPdfConvert}
                disabled={!selectedFile || isProcessing}
                className="w-full sm:w-auto bg-[#7A302F] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-heading text-base sm:text-lg font-bold disabled:opacity-50"
              >
                {isProcessing ? 'PROCESSING...' : txtPdfMode === 'txt-to-pdf' ? 'GENERATE PAGINATED PDF' : 'EXTRACT TEXT FROM PDF'}
              </button>

              {extractedTextResult && (
                <div className="p-4 bg-[#F3E4C8] border-2 border-[#3F2928] mt-4">
                  <div className="font-bold text-[#3F2928] mb-2 uppercase">EXTRACTED TEXT OUTPUT:</div>
                  <pre className="whitespace-pre-wrap max-h-60 overflow-y-auto bg-[#FFF8EA] p-3 border border-[#3F2928] font-mono text-xs">
                    {extractedTextResult}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TOOL 5: MERGE PDFs */}
          {activeTool === 'merge' && (
            <div className="space-y-6 font-mono text-xs">
              <p className="text-[#A58B7B]">
                Select up to 5 PDF files to concatenate into a single master submission PDF.
              </p>
              <button
                onClick={handleMerge}
                disabled={multiFiles.length === 0 || isProcessing}
                className="w-full sm:w-auto bg-[#7A302F] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-heading text-base sm:text-lg font-bold disabled:opacity-50"
              >
                MERGE {multiFiles.length} PDF(S) & DOWNLOAD
              </button>
            </div>
          )}

          {/* TOOL 6: IMPROVE READABILITY */}
          {activeTool === 'enhance' && (
            <div className="space-y-6 font-mono text-xs">
              <p className="text-[#A58B7B]">
                Applies high-contrast grayscale binarization to remove dark shadows and enhance faint document text.
              </p>
              <button
                onClick={handleEnhance}
                disabled={!selectedFile || isProcessing}
                className="w-full sm:w-auto bg-[#7A302F] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-heading text-base sm:text-lg font-bold disabled:opacity-50"
              >
                ENHANCE TEXT CONTRAST & DOWNLOAD
              </button>
            </div>
          )}

          {/* TOOL 7: RENAME FILE */}
          {activeTool === 'rename' && (
            <div className="space-y-6 font-mono text-xs">
              <div>
                <label className="font-bold text-[#3F2928] block mb-2">NEW FILENAME:</label>
                <input
                  type="text"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  className="w-full max-w-md bg-[#F3E4C8] border border-[#3F2928] p-2 text-xs font-mono text-[#3F2928]"
                />
              </div>

              <button
                onClick={handleRename}
                disabled={!selectedFile}
                className="w-full sm:w-auto bg-[#7A302F] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-heading text-base sm:text-lg font-bold disabled:opacity-50"
              >
                DOWNLOAD RENAMED FILE
              </button>
            </div>
          )}

        </div>

      </main>
    </div>
  );
};
