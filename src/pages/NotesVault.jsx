import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FileTree from '../features/notes/FileTree';
import NoteEditor from '../features/notes/NoteEditor';
import FileUploader from '../features/notes/FileUploader';
import RevisionReminderModal from '../features/notes/RevisionReminderModal';
import CreateRevisionModal from '../features/revision/CreateRevisionModal';
import Modal from '../components/ui/Modal';
import { mockSubjects } from '../data/mockNotes';
import { 
  Plus, Sparkles, Brain, FolderPlus, ArrowRight, 
  Layers, FileText, Database, BookOpen, Clock,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

export default function NotesVault() {
  const [searchParams] = useSearchParams();

  // Helper to resolve initial file from URL if provided
  const getInitialStateFromUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qFileId = params.get('fileId');
      const qSubject = params.get('subject');
      const qFolder = params.get('folder');
      const qModal = params.get('modal');

      if (qFolder) {
        for (const subj of mockSubjects) {
          const foundF = subj.folders.find(f => f.name.toLowerCase() === qFolder.toLowerCase());
          if (foundF) {
            return {
              subject: subj.name,
              folder: foundF.name,
              file: foundF.files.length > 0 ? foundF.files[0] : null,
              modal: qModal
            };
          }
        }
      } else if (qFileId) {
        for (const subj of mockSubjects) {
          for (const folder of subj.folders) {
            const f = folder.files.find(file => file.id === qFileId);
            if (f) {
              return { subject: subj.name, folder: folder.name, file: f, modal: qModal };
            }
          }
        }
      } else if (qSubject) {
        const foundSubj = mockSubjects.find(s => s.name.toLowerCase() === qSubject.toLowerCase());
        if (foundSubj && foundSubj.folders.length > 0) {
          return { 
            subject: foundSubj.name, 
            folder: foundSubj.folders[0].name, 
            file: foundSubj.folders[0].files[0] || null,
            modal: qModal
          };
        }
      }
      return {
        subject: mockSubjects[0].name,
        folder: mockSubjects[0].folders[0].name,
        file: mockSubjects[0].folders[0].files[0],
        modal: qModal
      };
    }
    return {
      subject: mockSubjects[0].name,
      folder: mockSubjects[0].folders[0].name,
      file: mockSubjects[0].folders[0].files[0],
      modal: null
    };
  };

  const initialVault = getInitialStateFromUrl();
  const [subjects, setSubjects] = useState(mockSubjects);
  const [activeSubject, setActiveSubject] = useState(initialVault.subject);
  const [activeFolder, setActiveFolder] = useState(initialVault.folder);
  const [selectedFile, setSelectedFile] = useState(initialVault.file);
  const [showSidebar, setShowSidebar] = useState(true);

  // Modals state
  const [reminderTarget, setReminderTarget] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(initialVault.modal === 'new-folder');
  const [newFolderName, setNewFolderName] = useState('');
  const [targetSubjectForFolder, setTargetSubjectForFolder] = useState(mockSubjects[0].id);

  // New Document Modal state (replaces awkward window.prompt popup)
  const [showNewDocModal, setShowNewDocModal] = useState(initialVault.modal === 'new-doc');
  const [newDocName, setNewDocName] = useState('Lecture_Note_Kinetics.doc');
  const [newDocSubjectId, setNewDocSubjectId] = useState(mockSubjects[0].id);
  const [newDocFolderName, setNewDocFolderName] = useState(mockSubjects[0].folders[0].name);
  const [newDocTemplate, setNewDocTemplate] = useState('lecture');

  const [showCreateRevModal, setShowCreateRevModal] = useState(false);
  const [editorViewMode, setEditorViewMode] = useState('edit');

  // Handle URL query redirection if changed dynamically
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryFileId = params.get('fileId') || searchParams.get('fileId');
    const querySubject = params.get('subject') || searchParams.get('subject');
    const queryMode = params.get('mode') || searchParams.get('mode');
    const queryModal = params.get('modal') || searchParams.get('modal');

    if (queryModal === 'new-doc') {
      setShowNewDocModal(true);
    } else if (queryModal === 'new-folder') {
      setShowNewFolderModal(true);
    }

    if (queryFileId) {
      for (const subj of subjects) {
        for (const folder of subj.folders) {
          const foundFile = folder.files.find(f => f.id === queryFileId);
          if (foundFile) {
            setActiveSubject(subj.name);
            setActiveFolder(folder.name);
            setSelectedFile(foundFile);
            break;
          }
        }
      }
    } else if (querySubject) {
      const foundSubj = subjects.find(s => s.name.toLowerCase() === querySubject.toLowerCase());
      if (foundSubj) {
        setActiveSubject(foundSubj.name);
        if (foundSubj.folders.length > 0) {
          setActiveFolder(foundSubj.folders[0].name);
          if (foundSubj.folders[0].files.length > 0) {
            setSelectedFile(foundSubj.folders[0].files[0]);
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
        const hasFolder = subj.folders.some(f => f.name === activeFolder);
        const targetFolderName = hasFolder ? activeFolder : (subj.folders[0]?.name || 'General Notes');
        let folderMatched = false;
        let updatedFolders = subj.folders.map(folder => {
          if (folder.name === targetFolderName) {
            folderMatched = true;
            return { ...folder, files: [newFile, ...folder.files] };
          }
          return folder;
        });

        if (!folderMatched) {
          updatedFolders = [{
            id: `folder-${Date.now()}`,
            name: targetFolderName,
            reminder: { type: 'ai', status: 'AI Monitored', nextDate: '2026-09-20' },
            files: [newFile]
          }, ...subj.folders];
        }

        return { ...subj, totalFiles: subj.totalFiles + 1, folders: updatedFolders };
      }
      return subj;
    }));
    setSelectedFile(newFile);
  };

  // Open Add Folder modal with target subject pre-selected
  const handleOpenAddFolderModal = (subjectId = null) => {
    const validSubjectId = (typeof subjectId === 'string') ? subjectId : null;
    if (validSubjectId) {
      setTargetSubjectForFolder(validSubjectId);
    } else {
      const activeSubjObj = subjects.find(s => s.name === activeSubject);
      setTargetSubjectForFolder(activeSubjObj ? activeSubjObj.id : subjects[0].id);
    }
    setNewFolderName('');
    setShowNewFolderModal(true);
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const folderTrimmed = newFolderName.trim();
    const newF = {
      id: `folder-${Date.now()}`,
      name: folderTrimmed,
      reminder: { type: 'ai', status: 'AI Monitored', nextDate: '2026-09-20' },
      files: []
    };

    let targetSubjName = activeSubject;
    setSubjects(prev => prev.map(subj => {
      if (subj.id === targetSubjectForFolder) {
        targetSubjName = subj.name;
        return { ...subj, folders: [...subj.folders, newF] };
      }
      return subj;
    }));

    setActiveSubject(targetSubjName);
    setActiveFolder(folderTrimmed);
    setSelectedFile(null);
    setShowNewFolderModal(false);
    setNewFolderName('');
  };

  // Open New Document modal (replaces awkward window.prompt)
  const handleOpenNewDocModal = (target = null) => {
    const validTarget = (target && !target.nativeEvent && typeof target === 'object' && (target.subjectName || target.subjectId)) ? target : null;
    
    let activeSubjObj = null;
    if (validTarget?.subjectId) {
      activeSubjObj = subjects.find(s => s.id === validTarget.subjectId);
    } else if (validTarget?.subjectName) {
      activeSubjObj = subjects.find(s => s.name === validTarget.subjectName);
    } else {
      activeSubjObj = subjects.find(s => s.name === activeSubject);
    }
    if (!activeSubjObj) activeSubjObj = subjects[0];

    const targetSubjId = activeSubjObj.id;
    const availableFolders = activeSubjObj.folders || [];
    let targetFolder = '';
    if (validTarget?.folderName && availableFolders.some(f => f.name === validTarget.folderName)) {
      targetFolder = validTarget.folderName;
    } else if (availableFolders.some(f => f.name === activeFolder)) {
      targetFolder = activeFolder;
    } else if (availableFolders.length > 0) {
      targetFolder = availableFolders[0].name;
    } else {
      targetFolder = 'General Notes';
    }

    setNewDocSubjectId(targetSubjId);
    setNewDocFolderName(targetFolder);
    setNewDocName(`Lecture_Note_${Date.now().toString().slice(-4)}.doc`);
    setNewDocTemplate('lecture');
    setShowNewDocModal(true);
  };

  const handleSubjectChangeInDocModal = (newSubjId) => {
    setNewDocSubjectId(newSubjId);
    const chosenSubj = subjects.find(s => s.id === newSubjId);
    if (chosenSubj && chosenSubj.folders.length > 0) {
      setNewDocFolderName(chosenSubj.folders[0].name);
    } else {
      setNewDocFolderName('General Notes');
    }
  };

  const handleCreateNewDoc = (e) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    let fileName = newDocName.trim();
    if (!fileName.includes('.')) {
      fileName += '.doc';
    }
    const title = fileName.replace(/\.[^/.]+$/, '');

    let starterHtml = '';
    if (newDocTemplate === 'lecture') {
      starterHtml = `<h2>${title}</h2><p>Synthesized core foundational principles and academic lecture analysis.</p><h3>Key Takeaways:</h3><ul><li>Primary theoretical concept and scope</li><li>Empirical evidence and experimental yields</li></ul><blockquote style="border-left: 3px solid #9e3c26; padding-left: 12px; margin: 12px 0; color: #78716c; font-style: italic;"><strong>Important Insight:</strong> High-yield exam principle for spaced review.</blockquote>`;
    } else if (newDocTemplate === 'mechanism') {
      starterHtml = `<h2>Mechanism Dossier: ${title}</h2><p>Detailed step-by-step reaction coordinate and intermediate stability analysis.</p><div style="background: rgba(158, 60, 38, 0.08); padding: 10px 14px; border-radius: 8px; font-family: monospace; font-weight: bold; margin: 12px 0; text-align: center;">Rate = k [Reactant A]² [Reactant B]</div><h3>Step-by-Step Pathway:</h3><ol><li><strong>Initiation:</strong> Nucleophilic attack disrupts the starting conjugate system.</li><li><strong>Rearomatization:</strong> Fast elimination restores thermodynamic ground state.</li></ol>`;
    } else {
      starterHtml = `<h2>${title}</h2><p>Start typing your research findings, formulas, and study notes here...</p>`;
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: fileName,
      type: 'doc',
      size: '14 KB',
      updatedAt: 'Just now',
      tags: ['Live Edit', 'Auto-Saved'],
      reminder: { type: 'ai', basis: 'SuperMemo-2 AI Spaced', interval: '3 days', score: 98, status: 'fresh' },
      content: starterHtml
    };

    let chosenSubjName = activeSubject;
    const finalFolder = newDocFolderName.trim() || 'General Notes';

    setSubjects(prev => prev.map(subj => {
      if (subj.id === newDocSubjectId) {
        chosenSubjName = subj.name;
        let folderFound = false;
        const updatedFolders = subj.folders.map(folder => {
          if (folder.name === finalFolder) {
            folderFound = true;
            return { ...folder, files: [newDoc, ...folder.files] };
          }
          return folder;
        });

        if (!folderFound) {
          updatedFolders.push({
            id: `folder-${Date.now()}`,
            name: finalFolder,
            reminder: { type: 'ai', status: 'AI Monitored', nextDate: '2026-09-20' },
            files: [newDoc]
          });
        }

        return { ...subj, totalFiles: subj.totalFiles + 1, folders: updatedFolders };
      }
      return subj;
    }));

    setActiveSubject(chosenSubjName);
    setActiveFolder(finalFolder);
    setSelectedFile(newDoc);
    setShowNewDocModal(false);
  };

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
          <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-semibold truncate">{selectedFile?.name || '(Empty Folder)'}</span>
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
            Multi-modal academic archive, Word-style rich document editor, interactive PDF lecture previewer, and high-resolution diagram inspection.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="px-3 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-xs border border-[rgb(var(--color-border))] hidden md:flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title={showSidebar ? 'Collapse Taxonomy Sidebar' : 'Show Taxonomy Sidebar'}
          >
            {showSidebar ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            <span>{showSidebar ? 'Hide Tree' : 'Show Tree'}</span>
          </button>

          <button
            onClick={() => handleOpenAddFolderModal()}
            className="px-3.5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-xs border border-[rgb(var(--color-border))] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FolderPlus size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>+ Add Folder</span>
          </button>

          <button
            onClick={() => handleOpenNewDocModal()}
            className="px-4 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-[#9e3c26]/25 cursor-pointer"
          >
            <Plus size={14} />
            <span>+ New Document</span>
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
            <span>Rich Text Docs</span>
            <FileText size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#9e3c26] dark:text-[#ffb4a3] mt-1">14</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">Word & Rich Text Formatted</div>
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

      {/* Main Studio: Left File Taxonomy & Right Document / Previewer Workspace */}
      <div className={`grid grid-cols-1 gap-6 items-start ${
        showSidebar ? 'lg:grid-cols-12' : 'lg:grid-cols-1'
      }`}>
        
        {/* Left Column: File Taxonomy & Uploader */}
        {showSidebar && (
          <div className="lg:col-span-4 space-y-4">
            <FileTree
              subjects={subjects}
              selectedFile={selectedFile}
              activeSubject={activeSubject}
              activeFolder={activeFolder}
              onSelectFile={handleSelectFile}
              onSelectFolder={(subjName, fName) => {
                setActiveSubject(subjName);
                setActiveFolder(fName);
                const targetSubj = subjects.find(s => s.name === subjName);
                const targetFolder = targetSubj?.folders.find(f => f.name === fName);
                if (targetFolder && targetFolder.files.length > 0) {
                  setSelectedFile(targetFolder.files[0]);
                } else {
                  setSelectedFile(null);
                }
              }}
              onOpenReminderModal={handleOpenReminderModal}
              onAddFolder={handleOpenAddFolderModal}
              onNewNote={handleOpenNewDocModal}
            />

            <FileUploader
              activeSubject={activeSubject}
              activeFolder={activeFolder}
              onFileUploaded={handleFileUploaded}
            />
          </div>
        )}

        {/* Right Column: Multi-modal Document Studio / Previewer Workspace */}
        <div className={showSidebar ? 'lg:col-span-8 space-y-4' : 'lg:col-span-12 space-y-4'}>
          <div className="min-h-[620px]">
            {selectedFile ? (
              <NoteEditor
                activeFile={selectedFile}
                activeSubject={activeSubject}
                activeFolder={activeFolder}
                forcedViewMode={editorViewMode}
                onSave={(newContent) => {
                  if (selectedFile) {
                    setSelectedFile(prev => ({ ...prev, content: newContent }));
                  }
                }}
              />
            ) : (
              <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-2xl p-12 text-center shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col items-center justify-center min-h-[580px]">
                <div className="w-16 h-16 rounded-3xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center mb-4">
                  <FolderPlus size={30} />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#9e3c26] dark:text-[#ffb4a3] font-bold mb-1">
                  {activeSubject}
                </div>
                <h3 className="text-xl font-bold text-[rgb(var(--color-text))] mb-2">
                  Folder "{activeFolder}" is Empty
                </h3>
                <p className="text-xs text-[rgb(var(--color-muted))] max-w-md mb-6 leading-relaxed">
                  No notes, PDFs, or diagrams have been added to this folder yet. Create a new document or drag and drop files into the uploader on the left.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleOpenNewDocModal({ subjectName: activeSubject, folderName: activeFolder })}
                    className="px-4 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-[#9e3c26]/20 cursor-pointer transition-all"
                  >
                    <Plus size={14} />
                    <span>+ Create Document in this Folder</span>
                  </button>
                  <button
                    onClick={() => handleOpenAddFolderModal()}
                    className="px-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-xs border border-[rgb(var(--color-border))] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FolderPlus size={14} />
                    <span>Add Another Folder</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

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

      {/* Add Folder Modal (Clean UI Modal) */}
      {showNewFolderModal && (
        <Modal isOpen={showNewFolderModal} onClose={() => setShowNewFolderModal(false)} maxWidth="max-w-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-8 h-8 rounded-xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center font-bold">
              <FolderPlus size={16} />
            </span>
            <div>
              <h3 className="text-base font-bold text-[rgb(var(--color-text))]">Add Discipline Folder</h3>
              <p className="text-[11px] text-[rgb(var(--color-muted))]">Create a categorized section inside your vault.</p>
            </div>
          </div>
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
              className="w-full py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-medium text-xs cursor-pointer shadow-sm transition-colors"
            >
              Create Folder in Vault
            </button>
          </form>
        </Modal>
      )}

      {/* Create New Document Modal (Modern UI Modal replacing awkward prompt) */}
      {showNewDocModal && (
        <Modal isOpen={showNewDocModal} onClose={() => setShowNewDocModal(false)} maxWidth="max-w-md">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-8 h-8 rounded-xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center font-bold">
              <FileText size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
                Create New Academic Document
              </h3>
              <p className="text-[11px] text-[rgb(var(--color-muted))]">
                Draft formatted study notes, mechanism analyses, or lecture findings.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateNewDoc} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                Document Name
              </label>
              <input
                type="text"
                required
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                placeholder="e.g. Spectral_Analysis_Kinetics.doc"
                className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                  Discipline / Subject
                </label>
                <select
                  value={newDocSubjectId}
                  onChange={(e) => handleSubjectChangeInDocModal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))]"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                  Target Folder
                </label>
                {(() => {
                  const currSubj = subjects.find(s => s.id === newDocSubjectId);
                  const currFolders = currSubj?.folders || [];
                  if (currFolders.length > 0) {
                    return (
                      <select
                        value={newDocFolderName}
                        onChange={(e) => setNewDocFolderName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))]"
                      >
                        {currFolders.map(f => (
                          <option key={f.id} value={f.name}>{f.name}</option>
                        ))}
                      </select>
                    );
                  } else {
                    return (
                      <input
                        type="text"
                        value={newDocFolderName}
                        onChange={(e) => setNewDocFolderName(e.target.value)}
                        placeholder="e.g. General Notes"
                        className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))]"
                      />
                    );
                  }
                })()}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1.5 font-semibold">
                Starter Template
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'lecture', label: 'Lecture Note', desc: 'Summary & takeaways' },
                  { id: 'mechanism', label: 'Reaction Proof', desc: 'Step-by-step & rate' },
                  { id: 'blank', label: 'Blank Canvas', desc: 'Empty document' }
                ].map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setNewDocTemplate(tmpl.id)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      newDocTemplate === tmpl.id
                        ? 'border-[#9e3c26] bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] font-semibold'
                        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[rgb(var(--color-text))]">{tmpl.label}</div>
                    <div className="text-[10px] text-[rgb(var(--color-muted))] mt-0.5">{tmpl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs cursor-pointer shadow-sm transition-all mt-2"
            >
              Create Document in Vault
            </button>
          </form>
        </Modal>
      )}

    </div>
  );
}
