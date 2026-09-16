import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FileTree from '../features/notes/FileTree';
import NoteEditor from '../features/notes/NoteEditor';
import FileUploader from '../features/notes/FileUploader';
import RevisionReminderModal from '../features/notes/RevisionReminderModal';
import AIKeyPointsModal from '../features/revision/AIKeyPointsModal';
import AIProficiencyQuizModal from '../features/revision/AIProficiencyQuizModal';
import CreateRevisionModal from '../features/revision/CreateRevisionModal';
import Modal from '../components/ui/Modal';
import { mockSubjects } from '../data/mockNotes';
import { 
  Plus, Sparkles, Brain, FolderPlus, ArrowRight, 
  Layers, FileText, Database, BookOpen, Clock 
} from 'lucide-react';

export default function NotesVault() {
  const [searchParams] = useSearchParams();
  const [subjects, setSubjects] = useState(mockSubjects);
  const [activeSubject, setActiveSubject] = useState(mockSubjects[0].name);
  const [activeFolder, setActiveFolder] = useState(mockSubjects[0].folders[0].name);
  const [selectedFile, setSelectedFile] = useState(mockSubjects[0].folders[0].files[0]);

  // Modals state
  const [reminderTarget, setReminderTarget] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [targetSubjectForFolder, setTargetSubjectForFolder] = useState(mockSubjects[0].id);

  // 3 Revision Modalities state
  const [showKeyPointsModal, setShowKeyPointsModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showCreateRevModal, setShowCreateRevModal] = useState(false);
  const [editorViewMode, setEditorViewMode] = useState('split');

  // Handle URL query redirection (e.g. from Revision page clicking "Manual Revision")
  useEffect(() => {
    const querySubject = searchParams.get('subject');
    const queryFileId = searchParams.get('fileId');
    const queryMode = searchParams.get('mode');

    if (querySubject) {
      const foundSubj = subjects.find(s => s.name.toLowerCase() === querySubject.toLowerCase());
      if (foundSubj) {
        setActiveSubject(foundSubj.name);
        if (queryFileId) {
          for (const folder of foundSubj.folders) {
            const foundFile = folder.files.find(f => f.id === queryFileId);
            if (foundFile) {
              setActiveFolder(folder.name);
              setSelectedFile(foundFile);
              break;
            }
          }
        }
      }
    }

    if (queryMode === 'manual') {
      setEditorViewMode('preview');
    }
  }, [searchParams, subjects]);

  const handleSelectFile = (file, subjectName, folderName) => {
    setSelectedFile(file);
    if (subjectName) setActiveSubject(subjectName);
    if (folderName) setActiveFolder(folderName);
  };

  const handleOpenReminderModal = (item) => {
    setReminderTarget(item);
    setShowReminderModal(true);
  };

  const handleFileUploaded = (newFile) => {
    setSubjects(prev => prev.map(subj => {
      if (subj.name === activeSubject) {
        const updatedFolders = subj.folders.map(folder => {
          if (folder.name === activeFolder) {
            return { ...folder, files: [newFile, ...folder.files] };
          }
          return folder;
        });
        return { ...subj, totalFiles: subj.totalFiles + 1, folders: updatedFolders };
      }
      return subj;
    }));
    setSelectedFile(newFile);
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const newF = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      reminder: { type: 'ai', status: 'AI Monitored', nextDate: '2026-09-20' },
      files: []
    };

    setSubjects(prev => prev.map(subj => {
      if (subj.id === targetSubjectForFolder) {
        return { ...subj, folders: [...subj.folders, newF] };
      }
      return subj;
    }));

    setShowNewFolderModal(false);
    setNewFolderName('');
  };

  const handleCreateNewWebDoc = () => {
    const docName = prompt('Enter document name (e.g. Spectral_Analysis.doc):') || `New_Document_${Date.now().toString().slice(-4)}.doc`;
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: docName,
      type: 'doc',
      size: '12 KB',
      updatedAt: 'Just now',
      tags: ['Live Edit', 'Auto-Saved'],
      reminder: { type: 'ai', basis: 'SuperMemo-2 AI Spaced', interval: '3 days', score: 98, status: 'fresh' },
      content: `# ${docName.replace(/\.[^/.]+$/, '')}\n\nStart typing your study notes here using Markdown and LaTeX notation.\n\n### Core Insights:\n- Point 1\n- Point 2\n\n$$Rate = k [A]^2$$`
    };

    handleFileUploaded(newDoc);
  };

  // Generate dynamic keypoints for active note
  const activeKeyPoints = [
    {
      title: `${selectedFile?.name.replace(/\.[^/.]+$/, '')} Core Summary`,
      content: selectedFile?.content?.slice(0, 180) || 'Primary theoretical foundation and lecture insights vectorized from your vault.',
      formula: selectedFile?.type === 'doc' ? 'Rate = k [Ar-X] [Nu⁻]' : undefined
    },
    {
      title: 'High-Yield Memory Anchor',
      content: 'Critical concepts and edge-case exceptions prioritized for upcoming spaced repetition check.'
    },
    {
      title: 'SuperMemo-2 Recall Calibration',
      content: `Current stability score: ${selectedFile?.reminder?.score || 85}%. Reviewing now resets decay slope.`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      
      {/* Top Breadcrumbs & Quick Revision Hub Link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-muted))] gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <span>REPOSITORY</span>
          <span>/</span>
          <span>Knowledge Vault</span>
          <span>/</span>
          <span className="px-1.5 py-0.5 rounded bg-[rgb(var(--color-container-high))] text-[rgb(var(--color-text))] font-semibold">🧬 {activeSubject}</span>
          <span>/</span>
          <span>{activeFolder}</span>
          <span>/</span>
          <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-semibold truncate">{selectedFile?.name}</span>
        </div>

        {/* Quick Link to Dedicated Revision Page */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/revision"
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#9e3c26]/10 hover:bg-[#9e3c26]/20 dark:bg-[#e26f54]/15 text-[#9e3c26] dark:text-[#ffb4a3] border border-[#9e3c26]/30 transition-all font-semibold"
          >
            <Brain size={13} className="animate-pulse" />
            <span>12 Topics Due in AI Revision</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Main Title & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono tracking-widest uppercase text-[#9e3c26] dark:text-[#ffb4a3] font-bold mb-1">
            ARCHITECTURAL KNOWLEDGE REPOSITORY • DOCUMENT STUDIO
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--color-text))]">
            Knowledge Vault & Notes Studio
          </h1>
          <p className="text-xs text-[rgb(var(--color-muted))] max-w-2xl mt-1 leading-relaxed">
            Multi-modal academic archive, live Markdown & LaTeX notes studio, tactile PDF diagrams, and instant AI revision pathways.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-xs border border-[rgb(var(--color-border))] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FolderPlus size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>+ Add Folder</span>
          </button>

          <button
            onClick={handleCreateNewWebDoc}
            className="px-4 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-[#9e3c26]/25 cursor-pointer"
          >
            <Plus size={14} />
            <span>+ New Web Doc</span>
          </button>

          <button
            onClick={() => setShowCreateRevModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-xs border border-[rgb(var(--color-border))] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Clock size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>Schedule Revision</span>
          </button>
        </div>
      </div>

      {/* 4 Focused Vault Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Archived Assets</span>
            <Database size={13} className="text-[rgb(var(--color-muted))]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[rgb(var(--color-text))] mt-1">98</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-secondary))] mt-1 font-medium">Across {subjects.length} Disciplines</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Live Web Docs</span>
            <FileText size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#9e3c26] dark:text-[#ffb4a3] mt-1">14</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">Markdown + LaTeX formatted</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Visual Diagrams</span>
            <Layers size={13} className="text-sky-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-sky-600 dark:text-sky-400 mt-1">08</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">High-Res Chemical MO Schemes</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Vault Sync Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">4.2 MB</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">100% Vectorized & Synced</div>
        </div>
      </div>

      {/* Main Studio: Left File Taxonomy (4 cols) & Right Document Workspace (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: File Taxonomy & Uploader */}
        <div className="lg:col-span-4 space-y-4">
          <FileTree
            subjects={subjects}
            selectedFile={selectedFile}
            onSelectFile={handleSelectFile}
            onOpenReminderModal={handleOpenReminderModal}
            onAddFolder={() => setShowNewFolderModal(true)}
            onNewNote={handleCreateNewWebDoc}
          />

          <FileUploader
            activeSubject={activeSubject}
            activeFolder={activeFolder}
            onFileUploaded={handleFileUploaded}
          />
        </div>

        {/* Right Column: Multi-modal Document Studio & Revision Options */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* REVISION PATHWAY LAUNCHPAD FOR ACTIVE NOTE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgb(var(--color-border))] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center font-bold">
                  <Brain size={17} />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[rgb(var(--color-text))] flex items-center gap-2">
                    <span>Revision Pathways for:</span>
                    <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-mono">{selectedFile?.name}</span>
                  </h3>
                  <p className="text-[11px] text-[rgb(var(--color-muted))]">
                    Select your study mode below to revise this note or test your proficiency.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateRevModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] text-xs font-semibold border border-[rgb(var(--color-border))] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
              >
                <Clock size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                <span>+ Schedule Spaced Task</span>
              </button>
            </div>

            {/* 3 Revision Action Cards (AI Key Points, AI Quiz, Manual Read) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              
              {/* Option 1: AI Key Points */}
              <button
                type="button"
                onClick={() => setShowKeyPointsModal(true)}
                className="p-3.5 rounded-xl border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-tertiary))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-card))] text-left transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-1.5 rounded-lg bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))]">
                      <Sparkles size={14} />
                    </span>
                    <span className="text-[10px] font-mono text-[rgb(var(--color-tertiary))] font-bold uppercase">
                      Option 1
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-tertiary))] transition-colors">
                    AI Key Points
                  </div>
                  <p className="text-[11px] text-[rgb(var(--color-muted))] leading-relaxed mt-1">
                    Get high-yield bullet synthesis, key takeaways, and core formulas.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-[rgb(var(--color-tertiary))] flex items-center gap-1 font-semibold">
                  <span>View Key Points</span>
                  <ArrowRight size={11} />
                </div>
              </button>

              {/* Option 2: AI Practice Quiz */}
              <button
                type="button"
                onClick={() => setShowQuizModal(true)}
                className="p-3.5 rounded-xl border border-[rgb(var(--color-border))] hover:border-[#9e3c26] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-card))] text-left transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-1.5 rounded-lg bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3]">
                      <Brain size={14} />
                    </span>
                    <span className="text-[10px] font-mono text-[#9e3c26] dark:text-[#ffb4a3] font-bold uppercase">
                      Option 2
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[rgb(var(--color-text))] group-hover:text-[#9e3c26] dark:group-hover:text-[#ffb4a3] transition-colors">
                    AI Practice Quiz
                  </div>
                  <p className="text-[11px] text-[rgb(var(--color-muted))] leading-relaxed mt-1">
                    Determine proficiency score (%) with precision diagnostic challenges.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-[#9e3c26] dark:text-[#ffb4a3] flex items-center gap-1 font-semibold">
                  <span>Start AI Quiz</span>
                  <ArrowRight size={11} />
                </div>
              </button>

              {/* Option 3: Manual Revision */}
              <button
                type="button"
                onClick={() => setEditorViewMode('preview')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group shadow-xs flex flex-col justify-between ${
                  editorViewMode === 'preview'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-[rgb(var(--color-border))] hover:border-amber-500 bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-card))]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
                      <BookOpen size={14} />
                    </span>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">
                      Option 3
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[rgb(var(--color-text))] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Manual Revision
                  </div>
                  <p className="text-[11px] text-[rgb(var(--color-muted))] leading-relaxed mt-1">
                    Distraction-free read & tactile study of full document notes below.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                  <span>{editorViewMode === 'preview' ? 'Active in Reader' : 'Open Reader Mode'}</span>
                  <ArrowRight size={11} />
                </div>
              </button>

            </div>
          </div>

          {/* Note Editor Studio */}
          <div className="min-h-[580px]">
            <NoteEditor
              activeFile={selectedFile}
              activeSubject={activeSubject}
              activeFolder={activeFolder}
              forcedViewMode={editorViewMode}
              onOpenKeyPoints={() => setShowKeyPointsModal(true)}
              onOpenQuiz={() => setShowQuizModal(true)}
              onSave={(newContent) => {
                if (selectedFile) {
                  setSelectedFile(prev => ({ ...prev, content: newContent }));
                }
              }}
            />
          </div>

        </div>

      </div>

      {/* AI Key Points Modal */}
      <AIKeyPointsModal
        isOpen={showKeyPointsModal}
        onClose={() => setShowKeyPointsModal(false)}
        topic={selectedFile?.name.replace(/\.[^/.]+$/, '')}
        subject={activeSubject}
        keyPoints={activeKeyPoints}
        onStartQuiz={() => {
          setShowKeyPointsModal(false);
          setShowQuizModal(true);
        }}
        onReadNotes={() => {
          setShowKeyPointsModal(false);
          setEditorViewMode('preview');
        }}
      />

      {/* AI Proficiency Quiz Modal */}
      <AIProficiencyQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        topic={selectedFile?.name.replace(/\.[^/.]+$/, '')}
        subject={activeSubject}
        onViewKeyPoints={() => {
          setShowQuizModal(false);
          setShowKeyPointsModal(true);
        }}
        onReadNotes={() => {
          setShowQuizModal(false);
          setEditorViewMode('preview');
        }}
      />

      {/* Create Spaced Revision Modal */}
      <CreateRevisionModal
        isOpen={showCreateRevModal}
        onClose={() => setShowCreateRevModal(false)}
        defaultSubject={activeSubject}
        onCreate={(newItem) => {
          alert(`Successfully scheduled "${newItem.topic}" for ${newItem.progress} in Revision Hub!`);
        }}
      />

      {/* Spaced Revision Reminder Modal */}
      {showReminderModal && (
        <RevisionReminderModal
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          targetItem={reminderTarget}
          onSave={(schedule) => {
            alert(`Spaced schedule configured for ${reminderTarget?.name}: Basis = ${schedule.type.toUpperCase()}`);
          }}
        />
      )}

      {/* Add Folder Modal */}
      {showNewFolderModal && (
        <Modal isOpen={showNewFolderModal} onClose={() => setShowNewFolderModal(false)} maxWidth="max-w-sm">
          <h3 className="text-base font-bold mb-3">Add Discipline Folder</h3>
          <form onSubmit={handleCreateFolder} className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                Root Subject
              </label>
              <select
                value={targetSubjectForFolder}
                onChange={(e) => setTargetSubjectForFolder(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))]"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                Folder Name
              </label>
              <input
                type="text"
                required
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. Unit 4: Enolates & Condensation"
                className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-medium text-xs cursor-pointer shadow-sm"
            >
              Create Folder in Vault
            </button>
          </form>
        </Modal>
      )}

    </div>
  );
}
