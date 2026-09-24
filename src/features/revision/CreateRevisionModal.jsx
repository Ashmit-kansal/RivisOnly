import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { loadStoredSubjects } from '../../utils/notesStorage';
import { mockSubjects } from '../../data/mockNotes';
import { 
  Plus, Folder, FileText, Check, ArrowRight
} from 'lucide-react';

function formatCleanTitle(filename) {
  if (!filename) return '';
  return filename
    .replace(/\.[a-zA-Z0-9]+$/, '') // strip extension (.doc, .pdf, etc.)
    .replace(/[_-]+/g, ' ')         // replace underscores and hyphens with spaces
    .trim();
}

function getFileBadgeColor(type) {
  switch (type) {
    case 'pdf':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'webp':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
    case 'doc':
    case 'docx':
    case 'txt':
    case 'md':
    default:
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
  }
}

export default function CreateRevisionModal({ 
  isOpen, 
  onClose, 
  defaultSubject = 'Organic Chemistry II', 
  defaultInterval = 'Day 3',
  onCreate 
}) {
  const [subjectsList, setSubjectsList] = useState([]);
  const [selectedSubjectName, setSelectedSubjectName] = useState(defaultSubject);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [scope, setScope] = useState('folder'); // 'folder' | 'file'
  const [selectedFileId, setSelectedFileId] = useState('');
  const [topic, setTopic] = useState('');
  const [isTitleCustomized, setIsTitleCustomized] = useState(false);
  const [interval, setInterval] = useState(defaultInterval || 'Day 3');
  const [description, setDescription] = useState('');

  // Load stored notes and initialize selection when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const stored = loadStoredSubjects();
    const list = Array.isArray(stored) && stored.length > 0 ? stored : mockSubjects;
    setSubjectsList(list);

    // Initial subject match
    const initialSubj = (defaultSubject && defaultSubject !== 'All Subjects' && list.find(s => s.name === defaultSubject))
      ? list.find(s => s.name === defaultSubject)
      : list[0];

    const initialSubjName = initialSubj?.name || 'Organic Chemistry II';
    setSelectedSubjectName(initialSubjName);

    // Initial folder
    const initialFolders = initialSubj?.folders || [];
    const firstFolder = initialFolders[0] || null;
    setSelectedFolderId(firstFolder?.id || '');

    // Initial scope & file: default to file if available, else folder
    const hasFiles = firstFolder && Array.isArray(firstFolder.files) && firstFolder.files.length > 0;
    if (hasFiles) {
      setScope('file');
      const firstFile = firstFolder.files[0];
      setSelectedFileId(firstFile.id);
      setTopic(formatCleanTitle(firstFile.name));
    } else if (firstFolder) {
      setScope('folder');
      setSelectedFileId('');
      setTopic(formatCleanTitle(firstFolder.name));
    } else {
      setScope('folder');
      setSelectedFileId('');
      setTopic(initialSubjName);
    }

    setIsTitleCustomized(false);
    setInterval(defaultInterval || 'Day 3');
    setDescription('');
  }, [isOpen, defaultSubject, defaultInterval]);

  if (!isOpen) return null;

  // Active subject, folders, and files
  const currentSubj = subjectsList.find(s => s.name === selectedSubjectName) || subjectsList[0];
  const availableFolders = currentSubj?.folders || [];
  const currentFolder = availableFolders.find(f => f.id === selectedFolderId) || availableFolders[0] || null;
  const availableFiles = currentFolder?.files || [];
  const selectedFile = availableFiles.find(f => f.id === selectedFileId) || availableFiles[0] || null;

  // Compute default derived title
  const defaultDerivedTitle = scope === 'folder' 
    ? (currentFolder ? formatCleanTitle(currentFolder.name) : selectedSubjectName)
    : (selectedFile ? formatCleanTitle(selectedFile.name) : (currentFolder ? formatCleanTitle(currentFolder.name) : selectedSubjectName));

  const handleSubjectChange = (newSubjName) => {
    setSelectedSubjectName(newSubjName);
    const subj = subjectsList.find(s => s.name === newSubjName) || subjectsList[0];
    const folders = subj?.folders || [];
    const firstFolder = folders[0] || null;
    setSelectedFolderId(firstFolder?.id || '');

    const hasFiles = firstFolder && Array.isArray(firstFolder.files) && firstFolder.files.length > 0;
    if (scope === 'file' && hasFiles) {
      const firstFile = firstFolder.files[0];
      setSelectedFileId(firstFile.id);
      if (!isTitleCustomized) {
        setTopic(formatCleanTitle(firstFile.name));
      }
    } else if (firstFolder) {
      if (!hasFiles) setScope('folder');
      setSelectedFileId('');
      if (!isTitleCustomized) {
        setTopic(formatCleanTitle(firstFolder.name));
      }
    } else {
      setSelectedFileId('');
      if (!isTitleCustomized) {
        setTopic(newSubjName);
      }
    }
  };

  const handleFolderChange = (folderId) => {
    setSelectedFolderId(folderId);
    const folder = availableFolders.find(f => f.id === folderId);
    const hasFiles = folder && Array.isArray(folder.files) && folder.files.length > 0;

    if (scope === 'file' && hasFiles) {
      const firstFile = folder.files[0];
      setSelectedFileId(firstFile.id);
      if (!isTitleCustomized) {
        setTopic(formatCleanTitle(firstFile.name));
      }
    } else {
      if (!hasFiles) setScope('folder');
      setSelectedFileId('');
      if (!isTitleCustomized) {
        setTopic(formatCleanTitle(folder?.name || selectedSubjectName));
      }
    }
  };

  const handleScopeChange = (newScope) => {
    setScope(newScope);
    if (newScope === 'folder') {
      if (!isTitleCustomized && currentFolder) {
        setTopic(formatCleanTitle(currentFolder.name));
      }
    } else {
      // file scope
      if (availableFiles.length > 0) {
        const file = availableFiles.find(f => f.id === selectedFileId) || availableFiles[0];
        setSelectedFileId(file.id);
        if (!isTitleCustomized) {
          setTopic(formatCleanTitle(file.name));
        }
      }
    }
  };

  const handleSelectFile = (file) => {
    setSelectedFileId(file.id);
    if (!isTitleCustomized) {
      setTopic(formatCleanTitle(file.name));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTitle = topic.trim() || defaultDerivedTitle || 'Untitled Revision';
    const isFolderScope = scope === 'folder';

    // Auto-generate high-yield key points from note content
    let generatedKeyPoints = [];
    if (!isFolderScope && selectedFile && selectedFile.content) {
      const plain = selectedFile.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      const excerpt = plain.length > 180 ? plain.slice(0, 177) + '...' : plain;
      generatedKeyPoints = [
        {
          title: 'Document High-Yield Summary',
          content: excerpt || `Core theoretical synthesis and notes from ${selectedFile.name}.`
        },
        {
          title: 'Core Concept & Mechanism',
          content: description.trim() || `Fundamental principles and formulas for ${finalTitle}.`
        },
        {
          title: 'Exam Mastery & Active Recall',
          content: 'Key equations, reaction pathways, and edge-case exceptions for high-proficiency retention.'
        }
      ];
    } else if (isFolderScope && currentFolder) {
      const fileNames = (currentFolder.files || []).map(f => f.name).slice(0, 3).join(', ');
      generatedKeyPoints = [
        {
          title: 'Folder Unit Curriculum',
          content: `Covers ${currentFolder.files?.length || 0} academic assets in ${currentFolder.name}${fileNames ? `: ${fileNames}` : ''}.`
        },
        {
          title: 'Core Retrieval Anchors',
          content: description.trim() || `Primary mechanisms and theoretical principles across this revision unit.`
        },
        {
          title: 'Spaced Repetition Schedule',
          content: `Review scheduled on ${interval} interval to strengthen long-term memory.`
        }
      ];
    } else {
      generatedKeyPoints = [
        {
          title: 'Core Concept Definition',
          content: description.trim() || `Primary theoretical foundation and key principles for ${finalTitle}.`
        },
        {
          title: 'High-Yield Recall Anchor',
          content: 'Key formulas, mechanisms, and edge-case exceptions for exam mastery.'
        }
      ];
    }

    const newRevisionItem = {
      id: `rev-${Date.now()}`,
      subject: currentSubj?.name || selectedSubjectName,
      folder: currentFolder?.name || '',
      topic: finalTitle,
      type: 'ai',
      badge: 'AI Optimized (95%)',
      progress: `${interval} Spaced Window`,
      decayScore: 95,
      decayStatus: 'fresh',
      decayColor: '#2d7d46',
      description: description.trim() || (isFolderScope 
        ? `Comprehensive review of all ${currentFolder?.files?.length || 0} dossiers in folder "${currentFolder?.name || 'unit'}".`
        : `Detailed study and active recall for document "${selectedFile?.name || finalTitle}".`),
      sourcesScanned: isFolderScope ? (currentFolder?.files?.length || 1) : 1,
      tokensVectorized: isFolderScope ? ((currentFolder?.files?.length || 1) * 3600) : 4800,
      noteFileId: isFolderScope ? (currentFolder?.files?.[0]?.id || null) : (selectedFile?.id || null),
      noteFileName: isFolderScope ? `Folder: ${currentFolder?.name}` : (selectedFile?.name || `${finalTitle}.doc`),
      proficiencyScore: 75,
      keyPoints: generatedKeyPoints
    };

    if (onCreate) {
      onCreate(newRevisionItem);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-4">
        
        {/* Header */}
        <div className="border-b border-[rgb(var(--color-border))] pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#9e3c26] dark:text-[#ffb4a3] uppercase font-bold mb-1">
            <Plus size={14} />
            <span>NEW REVISION TASK</span>
          </div>
          <h3 className="text-xl font-bold text-[rgb(var(--color-text))]">
            Schedule Topic from Uploaded Notes
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
            Select a folder or specific note document from your vault to generate an adaptive revision card.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Step 1: Subject and Folder Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                1. Discipline / Subject
              </label>
              <select
                value={selectedSubjectName}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] font-medium focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
              >
                {subjectsList.map(s => (
                  <option key={s.id || s.name} value={s.name}>
                    {s.name} {s.code ? `(${s.code})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                2. Vault Folder
              </label>
              <select
                value={selectedFolderId}
                onChange={(e) => handleFolderChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] font-medium focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
              >
                {availableFolders.map(f => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name} ({f.files?.length || 0} {f.files?.length === 1 ? 'file' : 'files'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Revision Scope (Entire Folder vs Specific File) */}
          <div>
            <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1.5 font-semibold flex items-center justify-between">
              <span>3. Revision Target Scope</span>
              <span className="text-[10px] text-[rgb(var(--color-muted))] font-normal">
                Choose entire folder or a single note
              </span>
            </label>

            <div className="grid grid-cols-2 gap-2 mb-2.5">
              {/* Entire Folder Option */}
              <button
                type="button"
                onClick={() => handleScopeChange('folder')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  scope === 'folder'
                    ? 'border-[#9e3c26] bg-[#9e3c26]/10 text-[rgb(var(--color-text))] shadow-xs'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))]'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${scope === 'folder' ? 'bg-[#9e3c26] text-white' : 'bg-[rgb(var(--color-container-high))] text-[rgb(var(--color-muted))]'}`}>
                  <Folder size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs truncate text-[rgb(var(--color-text))] flex items-center gap-1.5">
                    <span>Entire Folder</span>
                    {scope === 'folder' && <Check size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />}
                  </div>
                  <div className="text-[10px] text-[rgb(var(--color-muted))] truncate mt-0.5">
                    All {currentFolder?.files?.length || 0} files in {currentFolder?.name || 'folder'}
                  </div>
                </div>
              </button>

              {/* Specific File Option */}
              <button
                type="button"
                onClick={() => handleScopeChange('file')}
                disabled={availableFiles.length === 0}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  availableFiles.length === 0
                    ? 'opacity-50 cursor-not-allowed border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))]'
                    : scope === 'file'
                    ? 'border-[#9e3c26] bg-[#9e3c26]/10 text-[rgb(var(--color-text))] shadow-xs'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))]'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${scope === 'file' ? 'bg-[#9e3c26] text-white' : 'bg-[rgb(var(--color-container-high))] text-[rgb(var(--color-muted))]'}`}>
                  <FileText size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs truncate text-[rgb(var(--color-text))] flex items-center gap-1.5">
                    <span>Specific Note File</span>
                    {scope === 'file' && <Check size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />}
                  </div>
                  <div className="text-[10px] text-[rgb(var(--color-muted))] truncate mt-0.5">
                    {availableFiles.length > 0 ? `Select from ${availableFiles.length} notes` : 'No files in folder'}
                  </div>
                </div>
              </button>
            </div>

            {/* If Scope === 'file', show interactive file list */}
            {scope === 'file' && (
              <div className="space-y-1.5 p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] animate-fade-in">
                <div className="flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))] mb-1">
                  <span>Available Documents in "{currentFolder?.name}"</span>
                  <span>{availableFiles.length} files</span>
                </div>

                {availableFiles.length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {availableFiles.map(file => {
                      const isSelected = selectedFileId === file.id;
                      return (
                        <div
                          key={file.id}
                          onClick={() => handleSelectFile(file)}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'border-[#9e3c26] bg-[rgb(var(--color-card))] text-[rgb(var(--color-text))] shadow-xs font-semibold ring-1 ring-[#9e3c26]'
                              : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 truncate">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${getFileBadgeColor(file.type)}`}>
                              {file.type || 'DOC'}
                            </span>
                            <span className="text-xs truncate text-[rgb(var(--color-text))]">
                              {file.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                              {file.size || ''}
                            </span>
                            {isSelected ? (
                              <span className="w-4 h-4 rounded-full bg-[#9e3c26] text-white flex items-center justify-center text-[10px]">
                                ✓
                              </span>
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-[rgb(var(--color-border))]" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-[rgb(var(--color-muted))]">
                    No files found in this folder.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Topic Title (Auto-filled from note, editable if desired) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono uppercase text-[rgb(var(--color-muted))] font-semibold">
                Revision Task Title
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  ✓ Auto-selected from note
                </span>
                {isTitleCustomized && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsTitleCustomized(false);
                      setTopic(defaultDerivedTitle);
                    }}
                    className="text-[10px] text-[#9e3c26] dark:text-[#ffb4a3] hover:underline cursor-pointer font-medium"
                  >
                    Reset to original
                  </button>
                )}
              </div>
            </div>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setIsTitleCustomized(true);
              }}
              placeholder="e.g. Synthesis Pathways Notes"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] font-medium focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
            />
          </div>

          {/* Step 4: Spaced Interval */}
          <div>
            <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
              Spaced Repetition Interval Window
            </label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] font-medium focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
            >
              <option value="Day 1">Day 1 (Next-Day Ingest — 24h Post-Class)</option>
              <option value="Day 3">Day 3 (The 48h Cliff — Critical Recall Spike)</option>
              <option value="Day 7">Day 7 (Synaptic Anchor — 1-Week Consolidation)</option>
              <option value="Day 14">Day 14 (Deep Encoding — 2-Week Hardening)</option>
              <option value="Day 30">Day 30 (Permanent Mastery — Long-Term Store)</option>
            </select>
          </div>

          {/* Step 5: Description / Context (Optional) */}
          <div>
            <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
              Study Notes or Formula Anchors (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Focus on kinetic vs thermodynamic enolate formation with LDA..."
              className="w-full px-3.5 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-[rgb(var(--color-border))]">
            <div className="text-[11px] text-[rgb(var(--color-muted))] font-mono">
              Target: <strong className="text-[rgb(var(--color-text))]">{scope === 'folder' ? `Folder (${currentFolder?.name})` : (selectedFile?.name || 'File')}</strong>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-xs font-medium cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white text-xs font-semibold shadow-md shadow-[#9e3c26]/20 cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <span>Schedule Revision</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </form>

      </div>
    </Modal>
  );
}
