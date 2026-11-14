import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { useAI } from '../../context/AIContext';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import { getForgedDeck, saveForgedDeck, deleteForgedDeck } from '../../services/questionBankService';
import { 
  fetchDriveFileFullContent, 
  uploadDriveFile, 
  deleteDriveFile, 
  listGoogleDriveFiles 
} from '../../services/googleDriveService';
import {
  Sparkles, CheckCircle2, ArrowRight,
  Shield, Brain, Clock, AlertCircle, FileText, Network, RefreshCw, Key
} from 'lucide-react';

export default function ForgeDeckModal({
  isOpen,
  onClose,
  file,
  driveToken,
  currentFolderId = 'root',
  onDeckForged,
  onViewSummaryNow
}) {
  const { generateMindmapAndSummary, setShowAISettingsModal } = useAI();
  const { myGuild, sendGuildMessage } = useStudyRooms();

  // Step state: 1 (Extracting) | 2 (Summary & Mindmap) | 3 (Saving to Drive) | 4 (Complete) | 'error'
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(10);
  const [statusMessage, setStatusMessage] = useState('Extracting document text & key concepts...');
  const [errorMessage, setErrorMessage] = useState(null);
  const [createdSummaryFileName, setCreatedSummaryFileName] = useState('');
  const [createdFile, setCreatedFile] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!isOpen || !file) return;

    let isMounted = true;

    async function runSummaryPipeline() {
      setStep(1);
      setProgress(15);
      setErrorMessage(null);
      setStatusMessage(`Reading "${file.name}" from Google Drive...`);

      try {
        // Resolve clean base name and check if redoing an existing summary
        const cleanBaseName = file.name
          .replace(/^Summary\s*-\s*/i, '')
          .replace(/\.[^/.]+$/, '')
          .trim();
        const existingDeck = getForgedDeck(file.id, file.name);
        const primaryFileId = existingDeck?.fileId || file.id;
        const summaryFileName = `Summary - ${cleanBaseName}.md`;
        const parentId = file.parents?.[0] || currentFolderId || 'root';

        // Step 1: Content extraction (Multimodal PDF base64 / Docs / Slides / Text)
        const { text, fileData } = await fetchDriveFileFullContent(driveToken, file);

        if (!isMounted) return;
        setStep(2);
        setProgress(45);
        setStatusMessage(
          fileData
            ? 'Gemini AI is analyzing document slides, equations & architecture...'
            : 'Generating AI Mindmap and Key Concept Summary...'
        );

        // Step 2: Generate Mindmap, Summary Points & Background Questions with Gemini
        const result = await generateMindmapAndSummary(cleanBaseName, text, fileData);

        if (!isMounted) return;
        setStep(3);
        setProgress(70);
        setStatusMessage(`Removing previous summary file from Drive...`);

        // Step 3: Remove previous summary file from Google Drive before uploading new one
        const oldSummaryFileId = existingDeck?.summaryFileId || (file.name.startsWith('Summary - ') ? file.id : null);
        if (oldSummaryFileId && driveToken) {
          try {
            await deleteDriveFile(driveToken, oldSummaryFileId);
            deleteForgedDeck(oldSummaryFileId);
          } catch (delErr) {
            console.warn('Could not delete old summary by ID:', delErr);
          }
        }

        // Also check if any duplicate Summary file with this exact name exists in the target folder
        if (driveToken && parentId) {
          try {
            const folderFiles = await listGoogleDriveFiles({
              token: driveToken,
              folderId: parentId,
              searchQuery: summaryFileName
            });
            if (folderFiles?.files?.length > 0) {
              for (const f of folderFiles.files) {
                if (f.name === summaryFileName && f.id !== oldSummaryFileId) {
                  await deleteDriveFile(driveToken, f.id);
                  deleteForgedDeck(f.id);
                }
              }
            }
          } catch (searchErr) {
            console.warn('Could not scan folder for duplicate summaries:', searchErr);
          }
        }

        setProgress(85);
        setStatusMessage(`Uploading new "${summaryFileName}" to Drive folder...`);
        setCreatedSummaryFileName(summaryFileName);

        let uploadedFile = null;
        try {
          const fileBlob = new File([result.markdownContent], summaryFileName, { type: 'text/markdown' });
          uploadedFile = await uploadDriveFile({
            token: driveToken,
            file: fileBlob,
            parentFolderId: parentId
          });
          if (uploadedFile) {
            setCreatedFile(uploadedFile);
          }
        } catch (uploadErr) {
          console.warn('Drive summary file upload warning:', uploadErr);
        }

        // Step 4: Persist Summary & Mindmap locally (questions stored silently for revision)
        const saved = saveForgedDeck(primaryFileId, {
          fileName: existingDeck?.fileName || file.name,
          summary: result.summary,
          mindmap: result.mindmap,
          summaryFileId: uploadedFile?.id || null,
          summaryFileName,
          questions: result.questions || []
        });

        if (!isMounted) return;
        setStep(4);
        setProgress(100);
        setStatusMessage('Summary & Mindmap Updated Successfully!');

        // Notify parent
        if (onDeckForged) {
          onDeckForged(primaryFileId, saved, uploadedFile);
        }

        // Announce to active Guild chat
        if (myGuild) {
          sendGuildMessage(
            `📑 Updated study summary & mindmap for "${cleanBaseName}"!`,
            null
          );
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Summary pipeline failed:', err);
        setStep('error');
        setErrorMessage(
          err.code === 'NO_API_KEY'
            ? 'Please add your Google Gemini API key to synthesize lecture notes and PDFs.'
            : (err.message || 'Failed to generate summary with Gemini AI.')
        );
      }
    }

    runSummaryPipeline();

    return () => {
      isMounted = false;
    };
  }, [isOpen, file, driveToken, currentFolderId, retryCount]);

  if (!isOpen || !file) return null;

  return (
    <Modal isOpen={isOpen} onClose={step === 4 || step === 'error' ? onClose : undefined} maxWidth="max-w-lg">
      <div className="space-y-6 py-2">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[rgb(var(--color-border))] pb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl shadow-sm shrink-0">
            🧠
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base text-[rgb(var(--color-text))] truncate">
              {step === 4 ? 'Summary & Mindmap Ready!' : 'Generating Mindmap & Summary'}
            </h3>
            <p className="text-xs text-[rgb(var(--color-muted))] truncate">
              {file.name}
            </p>
          </div>
        </div>

        {/* ================= IN-PROGRESS OR COMPLETE VIEW ================= */}
        {step !== 'error' ? (
          <div className="space-y-5">
            
            {/* Progress Bar & Status Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[rgb(var(--color-text))]">
                  {statusMessage}
                </span>
                <span className="text-indigo-400 font-bold">{progress}%</span>
              </div>

              <div className="w-full h-2 bg-[rgb(var(--color-container))] rounded-full overflow-hidden p-0.5 border border-[rgb(var(--color-border))]">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-[#9e3c26] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Checklist of Steps */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs">
              <div className={`flex items-center gap-2.5 ${step >= 2 ? 'text-emerald-500 font-semibold' : 'text-[rgb(var(--color-muted))]'}`}>
                {step >= 2 ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border border-current animate-spin" />}
                <span>1. Scan and parse document content</span>
              </div>

              <div className={`flex items-center gap-2.5 ${step >= 3 ? 'text-emerald-500 font-semibold' : (step === 2 ? 'text-amber-400 font-semibold' : 'text-[rgb(var(--color-muted))]')}`}>
                {step >= 3 ? <CheckCircle2 size={16} /> : (step === 2 ? <div className="w-4 h-4 rounded-full border border-current animate-spin" /> : <div className="w-4 h-4 rounded-full border border-[rgb(var(--color-border))]" />)}
                <span>2. Synthesize High-Yield Takeaways & Formulas</span>
              </div>

              <div className={`flex items-center gap-2.5 ${step >= 4 ? 'text-emerald-500 font-semibold' : (step === 3 ? 'text-indigo-400 font-semibold' : 'text-[rgb(var(--color-muted))]')}`}>
                {step >= 4 ? <CheckCircle2 size={16} /> : (step === 3 ? <div className="w-4 h-4 rounded-full border border-current animate-spin" /> : <div className="w-4 h-4 rounded-full border border-[rgb(var(--color-border))]" />)}
                <span>3. Build Concept Mindmap & Upload to Folder</span>
              </div>
            </div>

            {/* Completion Success Card */}
            {step === 4 && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2.5 animate-fade-in-up">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <Sparkles size={14} className="text-emerald-500" />
                  <span>Summary & Mindmap Created Successfully!</span>
                </div>
                <p className="text-[11px] text-[rgb(var(--color-muted))] leading-relaxed">
                  A new summary file <strong className="text-[rgb(var(--color-text))] font-mono">"{createdSummaryFileName}"</strong> has been created in this same Google Drive folder.
                </p>
                <div className="pt-1 flex items-center gap-3 text-[11px] font-mono font-bold text-indigo-400">
                  <span className="flex items-center gap-1">
                    <Network size={12} /> Concept Mindmap Ready
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileText size={12} /> Synced to Drive
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            {step === 4 && (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[rgb(var(--color-muted))] hover:bg-[rgb(var(--color-container-low))] cursor-pointer"
                >
                  Done
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onViewSummaryNow) onViewSummaryNow(createdFile || file);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#9e3c26] text-white hover:brightness-110 shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Brain size={14} />
                  <span>View Mindmap & Summary</span>
                </button>
              </div>
            )}

          </div>
        ) : (
          /* ================= ERROR VIEW ================= */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
              <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Generation Paused</p>
                <p className="mt-1 leading-relaxed">{errorMessage}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setShowAISettingsModal(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Key size={13} />
                <span>AI Quota & Key Settings</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[rgb(var(--color-muted))] hover:bg-[rgb(var(--color-container))] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setRetryCount(prev => prev + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#9e3c26] text-white hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <RefreshCw size={13} />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}
