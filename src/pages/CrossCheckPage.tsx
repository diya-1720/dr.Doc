import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForensics } from '../context/ForensicsContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Sidebar } from '../components/Sidebar';
import { backendCrossCheck } from '../services/api';
import { smartCompareNames, smartCompareAddresses, smartCompareDates } from '../services/aiEngine';
import type { CrossCheckResult } from '../types';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ArrowRightLeft, 
  RefreshCw,
  CheckSquare,
  Square,
  UserCheck,
  UserX,
  Layers,
  ArrowRight
} from 'lucide-react';

export const CrossCheckPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, loadDemoMode } = useForensics();
  const { t } = useLanguage();

  // Selected document IDs for cross-checking (exactly 2)
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<CrossCheckResult | null>(null);

  // Initialize selection with first two documents if available
  useEffect(() => {
    if (documents.length >= 2 && selectedDocIds.length === 0) {
      setSelectedDocIds([documents[0].id, documents[1].id]);
    }
  }, [documents]);

  const doc1 = documents.find(d => d.id === selectedDocIds[0]);
  const doc2 = documents.find(d => d.id === selectedDocIds[1]);

  const toggleSelectDoc = (docId: string) => {
    setResult(null);
    setErrorMessage(null);

    setSelectedDocIds(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      }
      if (prev.length >= 2) {
        // Replace second selection if already 2 selected
        return [prev[0], docId];
      }
      return [...prev, docId];
    });
  };

  // Run Cross-Check
  const handleRunCrossCheck = async () => {
    if (!doc1 || !doc2) {
      setErrorMessage('Please select two documents from the case inbox using the checkboxes below.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Try backend API first if file objects exist
    if (doc1.fileObj && doc2.fileObj) {
      try {
        const apiRes = await backendCrossCheck(doc1.fileObj, doc2.fileObj);
        if (apiRes && apiRes.data) {
          setResult(apiRes.data);
          setIsProcessing(false);
          return;
        }
      } catch (backendErr) {
        console.warn('Backend cross-check failed or offline, running deep local forensic cross-check:', backendErr);
      }
    }

    // Comprehensive Local Cross-Check Computation
    try {
      const name1 = doc1.extractedFields.find(f => f.key.toLowerCase().includes('name') || f.key === 'applicantName')?.value || 'Not detected';
      const name2 = doc2.extractedFields.find(f => f.key.toLowerCase().includes('name') || f.key === 'applicantName')?.value || 'Not detected';

      const dob1 = doc1.extractedFields.find(f => f.key.toLowerCase().includes('dob') || f.key.toLowerCase().includes('birth'))?.value || 'Not detected';
      const dob2 = doc2.extractedFields.find(f => f.key.toLowerCase().includes('dob') || f.key.toLowerCase().includes('birth'))?.value || 'Not detected';

      const id1 = doc1.extractedFields.find(f => f.key.toLowerCase().includes('number') || f.key.toLowerCase().includes('num'))?.value || 'Not detected';
      const id2 = doc2.extractedFields.find(f => f.key.toLowerCase().includes('number') || f.key.toLowerCase().includes('num'))?.value || 'Not detected';

      const gender1 = doc1.extractedFields.find(f => f.key.toLowerCase().includes('gender') || f.key.toLowerCase().includes('sex'))?.value || 'Not specified';
      const gender2 = doc2.extractedFields.find(f => f.key.toLowerCase().includes('gender') || f.key.toLowerCase().includes('sex'))?.value || 'Not specified';

      const addr1 = doc1.extractedFields.find(f => f.key.toLowerCase().includes('address') || f.key.toLowerCase().includes('residence'))?.value || 'Not specified';
      const addr2 = doc2.extractedFields.find(f => f.key.toLowerCase().includes('address') || f.key.toLowerCase().includes('residence'))?.value || 'Not specified';

      const fields: Record<string, { match: boolean | 'Unable to verify'; document1: string; document2: string; notes: string }> = {};
      const matchedFields: string[] = [];
      const mismatches: string[] = [];

      // 1. Name Comparison (ONLY IF PRESENT IN BOTH DOCUMENTS)
      const isNamePresent1 = name1 && name1 !== 'Not detected' && name1 !== 'Not specified';
      const isNamePresent2 = name2 && name2 !== 'Not detected' && name2 !== 'Not specified';
      if (isNamePresent1 && isNamePresent2) {
        const nameComp = smartCompareNames(name1, name2);
        if (nameComp.match === true) {
          fields.name = { match: true, document1: name1, document2: name2, notes: nameComp.notes };
          matchedFields.push('name');
        } else if (nameComp.match === false) {
          fields.name = { match: false, document1: name1, document2: name2, notes: nameComp.notes };
          mismatches.push('name');
        }
      }

      // 2. DOB Comparison (ONLY IF PRESENT IN BOTH DOCUMENTS - CANONICAL COMPARISON)
      const isDobPresent1 = dob1 && dob1 !== 'Not detected' && dob1 !== 'Not specified';
      const isDobPresent2 = dob2 && dob2 !== 'Not detected' && dob2 !== 'Not specified';
      if (isDobPresent1 && isDobPresent2) {
        const dobComp = smartCompareDates(dob1, dob2);
        if (dobComp.match === true) {
          fields.dateOfBirth = { match: true, document1: dob1, document2: dob2, notes: dobComp.notes };
          matchedFields.push('dateOfBirth');
        } else if (dobComp.match === false) {
          fields.dateOfBirth = { match: false, document1: dob1, document2: dob2, notes: dobComp.notes };
          mismatches.push('dateOfBirth');
        }
      }

      // 3. Document / ID Number Comparison (ONLY IF BOTH ARE THE SAME DOCUMENT TYPE)
      const isDocNumPresent1 = id1 && id1 !== 'Not detected' && id1 !== 'Not specified';
      const isDocNumPresent2 = id2 && id2 !== 'Not detected' && id2 !== 'Not specified';
      if (doc1.documentType === doc2.documentType && isDocNumPresent1 && isDocNumPresent2) {
        const normId1 = id1.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const normId2 = id2.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (normId1 === normId2) {
          fields.documentNumber = { match: true, document1: id1, document2: id2, notes: `Document numbers match exactly (${id1})` };
          matchedFields.push('documentNumber');
        } else {
          fields.documentNumber = { match: false, document1: id1, document2: id2, notes: `Document numbers contradict each other (${id1} vs ${id2})` };
          mismatches.push('documentNumber');
        }
      }

      // 4. Gender Comparison (ONLY IF PRESENT IN BOTH DOCUMENTS)
      const isGenderPresent1 = gender1 && gender1 !== 'Not specified' && gender1 !== 'Not detected';
      const isGenderPresent2 = gender2 && gender2 !== 'Not specified' && gender2 !== 'Not detected';
      if (isGenderPresent1 && isGenderPresent2) {
        if (gender1.toUpperCase().charAt(0) === gender2.toUpperCase().charAt(0)) {
          fields.gender = { match: true, document1: gender1, document2: gender2, notes: `Gender verified (${gender1})` };
          matchedFields.push('gender');
        } else {
          fields.gender = { match: false, document1: gender1, document2: gender2, notes: `Gender record contradiction: ${gender1} vs ${gender2}` };
          mismatches.push('gender');
        }
      }

      // 5. Address Comparison (ONLY IF PRESENT IN BOTH DOCUMENTS)
      const isAddrPresent1 = addr1 && addr1 !== 'Not specified' && addr1 !== 'Not detected' && addr1.trim() !== '';
      const isAddrPresent2 = addr2 && addr2 !== 'Not specified' && addr2 !== 'Not detected' && addr2.trim() !== '';
      if (isAddrPresent1 && isAddrPresent2) {
        const addrComp = smartCompareAddresses(addr1, addr2);
        if (addrComp.match === true) {
          fields.address = { match: true, document1: addr1, document2: addr2, notes: addrComp.notes };
          matchedFields.push('address');
        } else if (addrComp.match === false) {
          fields.address = { match: false, document1: addr1, document2: addr2, notes: addrComp.notes };
          mismatches.push('address');
        }
      }

      // 6. Photo & Age Check (ONLY IF BOTH REQUIRE/HAVE PHOTO)
      const p1 = doc1.photoAudit;
      const p2 = doc2.photoAudit;
      if (p1?.hasPhoto && p2?.hasPhoto) {
        if (p1.photoStatus === 'OUTDATED_RECOMMEND_UPDATE' || p2.photoStatus === 'OUTDATED_RECOMMEND_UPDATE') {
          fields.photoAgeAudit = {
            match: false,
            document1: p1.photoStatus || 'N/A',
            document2: p2.photoStatus || 'N/A',
            notes: 'Outdated photo detected: photo appears to be from minor age while calculated age is adult.'
          };
          mismatches.push('photoAudit');
        } else {
          fields.photoAgeAudit = {
            match: true,
            document1: 'VERIFIED_CURRENT',
            document2: 'VERIFIED_CURRENT',
            notes: 'Both document photos verified as current and age-appropriate.'
          };
          matchedFields.push('photoAudit');
        }
      }

      const hasMismatch = mismatches.length > 0;
      const overallMatch = !hasMismatch && matchedFields.length >= 1;
      const matchScore = hasMismatch ? Math.max(20, 100 - mismatches.length * 35) : 100;

      const localResult: CrossCheckResult = {
        overallMatch,
        matchScore,
        fields,
        matchedFields,
        mismatches,
        unableToVerify: [],
        explanation: overallMatch
          ? `Primary identity details (${matchedFields.join(', ')}) are consistent between ${doc1.documentType} and ${doc2.documentType}.`
          : `Discrepancies flagged in [${mismatches.join(', ')}] between ${doc1.documentType} and ${doc2.documentType}. Please inspect below.`,
        document1Type: doc1.documentType,
        document2Type: doc2.documentType
      };

      setResult(localResult);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error executing cross-check');
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger comparison automatically when 2 docs are selected
  useEffect(() => {
    if (doc1 && doc2 && !result) {
      handleRunCrossCheck();
    }
  }, [selectedDocIds]);

  return (
    <div className="min-h-screen bg-[#F3E4C8] flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full">
        
        {/* Page Header */}
        <div className="mb-6 pb-4 border-b-2 border-[#3F2928] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span>PHASE 06 // {t.crossCheck.tag}</span>
              <span className="bg-[#FFF8EA] text-[#7A302F] px-1.5 py-0.2 border border-[#7A302F] text-[10px]">
                MULTI-DOCUMENT ENGINE
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#3F2928]">
              {t.crossCheck.title}
            </h1>
            <p className="font-body text-sm text-[#3F2928] mt-1">
              Select any 2 uploaded documents to cross-check name, DOB/age, photo, gender, and address consistency.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => navigate('/documents')}
              className="px-3 py-1.5 bg-[#FFF8EA] hover:bg-[#F3E4C8] text-[#3F2928] border border-[#3F2928] font-bold shadow-[2px_2px_0px_#3F2928]"
            >
              + INGEST MORE FILES
            </button>
          </div>
        </div>

        {/* Empty State Banner */}
        {documents.length === 0 && (
          <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-8 text-center shadow-[4px_4px_0px_#3F2928] mb-8 font-mono">
            <ShieldAlert className="w-12 h-12 text-[#7A302F] mx-auto mb-3" />
            <h3 className="font-heading text-2xl font-bold text-[#3F2928] mb-2">NO DOCUMENTS IN CASE</h3>
            <p className="text-xs text-[#A58B7B] max-w-md mx-auto mb-6">
              Upload documents in the Document Inbox or load sample case documents to perform live forensic cross-checking.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/documents')}
                className="bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] px-6 py-2.5 font-bold border border-[#3F2928] shadow-[2px_2px_0px_#3F2928]"
              >
                GO TO DOCUMENT INBOX
              </button>
              <button
                onClick={loadDemoMode}
                className="bg-[#FFF8EA] hover:bg-[#F3E4C8] text-[#3F2928] px-6 py-2.5 font-bold border border-[#3F2928]"
              >
                LOAD DEMO CASE
              </button>
            </div>
          </div>
        )}

        {/* DOCUMENT SELECTION CHECKBOX GRID (UP TO 20 DOCS) */}
        {documents.length > 0 && (
          <div className="bg-[#FFF8EA] border-2 border-[#3F2928] p-4 sm:p-6 shadow-[4px_4px_0px_#3F2928] mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#3F2928] pb-3 mb-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#7A302F] uppercase">SELECT 2 DOCUMENTS TO COMPARE:</span>
                <span className="px-2 py-0.5 bg-[#3F2928] text-[#FFF8EA] font-bold text-[10px]">
                  {selectedDocIds.length} / 2 SELECTED
                </span>
              </div>
              <span className="text-[#A58B7B] text-[11px]">
                Click checkboxes to select or switch documents ({documents.length} available)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {documents.map((doc) => {
                const isSelected = selectedDocIds.includes(doc.id);
                const isFirst = selectedDocIds[0] === doc.id;
                const isSecond = selectedDocIds[1] === doc.id;
                const applicantName = doc.extractedFields.find(f => f.key.toLowerCase().includes('name'))?.value;
                const dob = doc.extractedFields.find(f => f.key.toLowerCase().includes('dob'))?.value;

                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleSelectDoc(doc.id)}
                    className={`p-3 border-2 cursor-pointer transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-[#F3E4C8] border-[#7A302F] shadow-[3px_3px_0px_#7A302F]'
                        : 'bg-[#FFF8EA] border-[#3F2928] hover:bg-[#F3E4C8]/50'
                    }`}
                  >
                    {/* Selection Checkbox */}
                    <div className="mt-0.5">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-[#7A302F]" fill="#F3E4C8" />
                      ) : (
                        <Square className="w-5 h-5 text-[#3F2928]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 font-mono">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="evidence-tag text-[9px] px-1 py-0.2">{doc.category}</span>
                        {isFirst && (
                          <span className="text-[9px] font-bold bg-[#7A302F] text-white px-1.5 py-0.2">
                            DOC 1 (PRIMARY)
                          </span>
                        )}
                        {isSecond && (
                          <span className="text-[9px] font-bold bg-[#3F2928] text-white px-1.5 py-0.2">
                            DOC 2 (COMPARE)
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading text-sm font-bold text-[#3F2928] truncate">
                        {doc.documentType}
                      </h4>
                      <div className="text-[10px] text-[#A58B7B] truncate mb-1">
                        {doc.filename}
                      </div>

                      {applicantName && (
                        <div className="text-[10px] text-[#3F2928]">
                          Name: <strong>{applicantName}</strong>
                        </div>
                      )}
                      {dob && (
                        <div className="text-[10px] text-[#3F2928]">
                          DOB: <strong>{dob}</strong>
                        </div>
                      )}

                      {/* Photo Status Pill */}
                      {doc.photoAudit && doc.photoAudit.hasPhoto && (
                        <div className="mt-1">
                          {doc.photoAudit.photoStatus === 'OUTDATED_RECOMMEND_UPDATE' ? (
                            <span className="text-[9px] font-bold text-[#7A302F] bg-[#E8B9B8] px-1 py-0.2 border border-[#7A302F] flex items-center gap-0.5 w-max">
                              <UserX className="w-3 h-3" /> OUTDATED PHOTO
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-[#3F2928] bg-[#D4E8B8] px-1 py-0.2 border border-[#3F2928] flex items-center gap-0.5 w-max">
                              <UserCheck className="w-3 h-3" /> PHOTO VERIFIED
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Run Button */}
            <div className="mt-4 pt-3 border-t border-[#3F2928] flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="font-mono text-xs text-[#A58B7B]">
                {doc1 && doc2 ? `Comparing ${doc1.documentType} vs ${doc2.documentType}` : 'Select 2 documents above to run cross-check'}
              </span>

              <button
                onClick={handleRunCrossCheck}
                disabled={!doc1 || !doc2 || isProcessing}
                className="w-full sm:w-auto font-heading text-sm font-bold bg-[#7A302F] hover:bg-[#5c2322] disabled:opacity-50 text-[#FFF8EA] px-6 py-2.5 border border-[#3F2928] shadow-[2px_2px_0px_#3F2928] flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> RUNNING FORENSIC COMPARISON...
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4" /> RE-RUN CROSS-CHECK
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 mb-6 bg-[#E8B9B8] border-2 border-[#7A302F] text-[#7A302F] font-mono text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* COMPARISON RESULTS MATRIX */}
        {result && doc1 && doc2 && (
          <div className="space-y-6">
            
            {/* Overall Verdict Card */}
            <div className="bg-[#FFF8EA] border-4 border-[#3F2928] p-6 shadow-[6px_6px_0px_#3F2928]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-[#3F2928] pb-4 mb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-[#7A302F] uppercase tracking-widest block mb-1">
                    CROSS-CHECK VERDICT
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#3F2928]">
                    {result.document1Type} ↔ {result.document2Type}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-[#A58B7B] block">{t.crossCheck.consistencyScore}</span>
                    <span className="font-heading text-3xl font-bold text-[#7A302F]">
                      {result.matchScore}%
                    </span>
                  </div>

                  <span
                    className={`stamp text-sm ${
                      result.overallMatch ? 'stamp-verified' : 'stamp-critical'
                    }`}
                  >
                    {result.overallMatch ? t.crossCheckMatrix.overallConsistent : t.crossCheckMatrix.overallDiscrepancy}
                  </span>
                </div>
              </div>

              <p className="font-mono text-xs text-[#3F2928] leading-relaxed bg-[#F3E4C8] p-3 border border-[#3F2928]">
                <strong>Forensic Summary:</strong> {result.explanation}
              </p>
            </div>

            {/* Detailed Field Comparison Table */}
            <div className="bg-[#FFF8EA] border-2 border-[#3F2928] shadow-[4px_4px_0px_#3F2928] overflow-hidden">
              <div className="bg-[#3F2928] text-[#FFF8EA] p-3 sm:p-4 font-mono text-xs font-bold flex justify-between items-center">
                <span>{t.crossCheckMatrix.crossCheckReport}</span>
                <span className="text-[#E8B9B8] text-[11px]">
                  {result.matchedFields?.length || 0} MATCHED • {result.mismatches?.length || 0} MISMATCHES
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F3E4C8] border-b-2 border-[#3F2928] text-[#3F2928]">
                      <th className="p-3 border-r border-[#3F2928] w-40">{t.crossCheckMatrix.fieldName}</th>
                      <th className="p-3 border-r border-[#3F2928]">{doc1.documentType} ({doc1.filename})</th>
                      <th className="p-3 border-r border-[#3F2928]">{doc2.documentType} ({doc2.filename})</th>
                      <th className="p-3 w-36 text-center border-r border-[#3F2928]">{t.crossCheckMatrix.verdict}</th>
                      <th className="p-3">FORENSIC ANALYSIS NOTES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F2928]">
                    {Object.entries(result.fields || {}).map(([key, item]: [string, any]) => {
                      const isMatch = item.match === true;
                      const isMismatch = item.match === false;

                      return (
                        <tr key={key} className={isMismatch ? 'bg-[#E8B9B8]/40' : 'hover:bg-[#F3E4C8]/50'}>
                          <td className="p-3 font-bold text-[#7A302F] border-r border-[#3F2928] capitalize">
                            {key === 'dateOfBirth' ? t.docCard.dobAge : key === 'applicantName' ? t.docCard.name : key === 'photoAgeAudit' ? t.docCard.photoAgeVerified : key.replace(/([A-Z])/g, ' $1').trim()}
                          </td>
                          <td className="p-3 border-r border-[#3F2928] font-bold">
                            {item.document1 || 'Not detected'}
                          </td>
                          <td className="p-3 border-r border-[#3F2928] font-bold">
                            {item.document2 || 'Not detected'}
                          </td>
                          <td className="p-3 text-center border-r border-[#3F2928]">
                            {isMatch ? (
                              <span className="px-2 py-0.5 bg-[#D4E8B8] text-[#3F2928] border border-[#3F2928] font-bold text-[10px]">
                                {t.crossCheckMatrix.statusMatch}
                              </span>
                            ) : isMismatch ? (
                              <span className="px-2 py-0.5 bg-[#7A302F] text-white font-bold text-[10px]">
                                {t.crossCheckMatrix.statusMismatch}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-[#FFF8EA] text-[#A58B7B] border border-[#A58B7B] text-[10px]">
                                UNVERIFIED ⚠️
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-[11px] text-[#3F2928]">
                            {item.notes || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Next Steps Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#FFF8EA] border-2 border-[#3F2928] p-4 shadow-[4px_4px_0px_#3F2928] font-mono text-xs">
              <div className="flex items-center gap-2 text-[#3F2928]">
                <Layers className="w-4 h-4 text-[#7A302F]" />
                <span>Next Workflow Phase:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate('/issues')}
                  className="px-4 py-2 bg-[#FFF8EA] hover:bg-[#F3E4C8] text-[#7A302F] border border-[#7A302F] font-bold"
                >
                  07. VIEW CASE ISSUES ({result.mismatches?.length || 0})
                </button>
                <button
                  onClick={() => navigate('/fix')}
                  className="px-4 py-2 bg-[#3F2928] hover:bg-[#7A302F] text-[#FFF8EA] border border-[#3F2928] font-bold"
                >
                  08. RESOLUTION DESK
                </button>
                <button
                  onClick={() => navigate('/report')}
                  className="px-4 py-2 bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] border border-[#3F2928] font-bold flex items-center gap-1 shadow-[2px_2px_0px_#3F2928]"
                >
                  10. FINAL REPORT <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
