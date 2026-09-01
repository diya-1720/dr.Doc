import React, { useState, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { 
  compressDocumentFile, 
  convertImagesToPdf, 
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
  CheckCircle2
} from 'lucide-react';

export const DocumentToolsPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'compress' | 'convert' | 'rename' | 'merge' | 'enhance'>('compress');
  
  // Compression State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetMb, setTargetMb] = useState<number>(10);
  const [compressedResult, setCompressedResult] = useState<{ file: File; oldSize: number; newSize: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Conversion / Merge State
  const [multiFiles, setMultiFiles] = useState<File[]>([]);

  // Rename State
  const [renameInput, setRenameInput] = useState<string>('AADHAAR_CARD_RAHUL_KUMAR.pdf');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (activeTool === 'convert' || activeTool === 'merge') {
        setMultiFiles(Array.from(e.target.files));
      } else {
        setSelectedFile(e.target.files[0]);
      }
      setCompressedResult(null);
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    const res = await compressDocumentFile(selectedFile, targetMb);
    setCompressedResult({ file: res.compressedFile, oldSize: res.oldSizeMB, newSize: res.newSizeMB });
    setIsProcessing(false);
  };

  const handleConvert = async () => {
    if (multiFiles.length === 0) return;
    setIsProcessing(true);
    const pdf = await convertImagesToPdf(multiFiles, 'converted_bundle.pdf');
    downloadFile(pdf);
    setIsProcessing(false);
  };

  const handleMerge = async () => {
    if (multiFiles.length === 0) return;
    setIsProcessing(true);
    const merged = await mergePdfFiles(multiFiles, 'merged_application_bundle.pdf');
    downloadFile(merged);
    setIsProcessing(false);
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    const enhanced = await enhanceImageReadability(selectedFile);
    downloadFile(enhanced);
    setIsProcessing(false);
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
          <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1">
            DOCUMENT PREPARATION
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
            DOCUMENT PREPARATION TOOLS
          </h1>
          <p className="font-body text-sm text-[#3F2928] mt-1">
            Client-side document manipulation suite. Compress PDFs to custom portal limits, convert images, merge bundles, and enhance scan contrast.
          </p>
        </div>

        {/* Tool Selector Tabs */}
        <div className="flex flex-wrap gap-2 font-mono text-xs mb-6 sm:mb-8">
          {[
            { id: 'compress', label: 'COMPRESS PDF / IMAGE', icon: FileCheck2 },
            { id: 'convert', label: 'JPG / PNG → PDF', icon: FileText },
            { id: 'merge', label: 'MERGE PDFs', icon: Layers },
            { id: 'enhance', label: 'IMPROVE READABILITY', icon: Sparkles },
            { id: 'rename', label: 'RENAME FILE', icon: Edit3 },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { setActiveTool(t.id as any); setSelectedFile(null); setMultiFiles([]); setCompressedResult(null); }}
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
          
          {/* File Upload Zone for Active Tool */}
          <div className="mb-6">
            <label className="font-mono text-xs font-bold text-[#3F2928] block mb-2 uppercase">
              SELECT FILE(S) TO PROCESS:
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple={activeTool === 'convert' || activeTool === 'merge'}
              accept={activeTool === 'convert' ? 'image/*' : '.pdf,.png,.jpg,.jpeg'}
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
                  ? `SELECTED ${multiFiles.length} FILES`
                  : 'CLICK TO SELECT FILE FROM YOUR COMPUTER'}
              </span>
            </button>
          </div>

          {/* TOOL 1: COMPRESS PDF */}
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
                {isProcessing ? 'PROCESSING COMPRESSION...' : `COMPRESS FILE BELOW ${targetMb} MB`}
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
                    <div className="text-[11px] text-[#7A302F]">✓ READY FOR SUBMISSION</div>
                  </div>

                  <button
                    onClick={() => downloadFile(compressedResult.file)}
                    className="w-full sm:w-auto bg-[#7A302F] text-[#FFF8EA] px-5 py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] font-bold flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    DOWNLOAD COMPRESSED FILE ({compressedResult.newSize} MB)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TOOL 2: CONVERT IMAGES TO PDF */}
          {activeTool === 'convert' && (
            <div className="space-y-6 font-mono text-xs">
              <p className="text-[#A58B7B]">
                Select one or more PNG/JPG photos. Dr. Doc will bundle them into a clean A4 PDF document.
              </p>
              <button
                onClick={handleConvert}
                disabled={multiFiles.length === 0 || isProcessing}
                className="w-full sm:w-auto bg-[#7A302F] text-[#FFF8EA] px-6 py-3 border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] font-heading text-base sm:text-lg font-bold disabled:opacity-50"
              >
                CONVERT {multiFiles.length} IMAGE(S) TO PDF & DOWNLOAD
              </button>
            </div>
          )}

          {/* TOOL 3: MERGE PDFs */}
          {activeTool === 'merge' && (
            <div className="space-y-6 font-mono text-xs">
              <p className="text-[#A58B7B]">
                Select multiple PDF files to concatenate into a single master submission PDF.
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

          {/* TOOL 4: IMPROVE READABILITY */}
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

          {/* TOOL 5: RENAME FILE */}
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

