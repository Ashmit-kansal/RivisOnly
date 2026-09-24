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
  loadStoredSubjects,
  safeSaveToStorage,
  clearNotesStorage,
  resolveInitialVaultState,
  ACTIVE_SUBJ_KEY,
  ACTIVE_FOLDER_KEY,
  ACTIVE_FILE_KEY
} from '../utils/notesStorage';
import { 
  Plus, Brain, FolderPlus, ArrowRight, 
  Layers, FileText, Database, BookOpen, Clock,
  PanelLeftClose, PanelLeftOpen, Trash2, RotateCcw,
  CheckCircle2, UploadCloud
} from 'lucide-react';

export default function NotesVault() {
  const [searchParams] = useSearchParams();

  // Load persisted subjects from localStorage (or fallback to mockSubjects)
  const [subjects, setSubjects] = useState(() => loadStoredSubjects());

  // Resolve initial active state
  const initialVault = resolveInitialVaultState(subjects);
  const [activeSubject, setActiveSubject] = useState(initialVault.subject);
  const [activeFolder, setActiveFolder] = useState(initialVault.folder);
  const [selectedFile, setSelectedFile] = useState(initialVault.file);
  const [showSidebar, setShowSidebar] = useState(true);

  // Modals state
  const [reminderTarget, setReminderTarget] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(initialVault.modal === 'new-folder');
  const [newFolderName, setNewFolderName] = useState('');
  const [targetSubjectForFolder, setTargetSubjectForFolder] = useState(subjects[0]?.id || 'subj-1');

  // New Subject modal state
  const [showNewSubjectModal, setShowNewSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#9e3c26');

  // New Document Modal state
  const [showNewDocModal, setShowNewDocModal] = useState(initialVault.modal === 'new-doc');
  const [newDocName, setNewDocName] = useState('Lecture_Note_Kinetics.doc');
  const [newDocSubjectId, setNewDocSubjectId] = useState(subjects[0]?.id || 'subj-1');
  const [newDocFolderName, setNewDocFolderName] = useState(subjects[0]?.folders[0]?.name || 'General Notes');
  const [newDocTemplate, setNewDocTemplate] = useState('lecture');

  const [showCreateRevModal, setShowCreateRevModal] = useState(false);
  const [editorViewMode, setEditorViewMode] = useState('edit');

  // In-app Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // 1. Persist subjects to localStorage whenever changed
  useEffect(() => {
    safeSaveToStorage(subjects);
  }, [subjects]);

  // 2. Persist active subject to localStorage
  useEffect(() => {
    if (activeSubject) {
      try {
        localStorage.setItem(ACTIVE_SUBJ_KEY, activeSubject);
      } catch {}
    }
  }, [activeSubject]);

  // 3. Persist active folder to localStorage
  useEffect(() => {
    if (activeFolder) {
      try {
        localStorage.setItem(ACTIVE_FOLDER_KEY, activeFolder);
      } catch {}
    }
  }, [activeFolder]);

  // 4. Persist selected file ID to localStorage
  useEffect(() => {
    try {
      if (selectedFile?.id) {
        localStorage.setItem(ACTIVE_FILE_KEY, selectedFile.id);
      } else {
        localStorage.removeItem(ACTIVE_FILE_KEY);
      }
    } catch {}
  }, [selectedFile?.id]);

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
          } else {
            setSelectedFile(null);
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

  // Upload new file and place it in the active folder
  const handleFileUploaded = (newFile) => {
    const currentSubj = subjects.find(s => s.name === activeSubject);
    const hasFolder = currentSubj?.folders.some(f => f.name === activeFolder);
    const targetFolderName = hasFolder ? activeFolder : (currentSubj?.folders[0]?.name || 'General Notes');

    setSubjects(prev => prev.map(subj => {
      if (subj.name === activeSubject) {
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

        return { ...subj, totalFiles: (subj.totalFiles || 0) + 1, folders: updatedFolders };
      }
      return subj;
    }));

    setActiveFolder(targetFolderName);
    setSelectedFile(newFile);
    showToast(`Ingested "${newFile.name}" into ${targetFolderName}`, 'success');
  };

  // Save note content and updated title from DocumentEditor
  const handleSaveDocument = (newContent, newTitle) => {
    if (!selectedFile) return;

    const resolvedName = newTitle
      ? (newTitle.endsWith('.doc') || newTitle.endsWith('.docx') || newTitle.endsWith('.txt') || newTitle.endsWith('.md')
          ? newTitle
          : `${newTitle}.doc`)
      : selectedFile.name;

    const updatedFileObj = {
      ...selectedFile,
      name: resolvedName,
      content: newContent,
      updatedAt: 'Just now'
    };

    setSelectedFile(updatedFileObj);

    setSubjects(prevSubjects => prevSubjects.map(subj => {
      if (subj.name !== activeSubject) return subj;
      return {
        ...subj,
        folders: subj.folders.map(folder => {
          if (folder.name !== activeFolder) return folder;
          return {
            ...folder,
            files: folder.files.map(file => {
              if (file.id !== selectedFile.id) return file;
              return {
                ...file,
                name: resolvedName,
                content: newContent,
                updatedAt: 'Just now'
              };
            })
          };
        })
      };
    }));

    showToast('Saved note to Knowledge Vault', 'success');
  };

  // Open Add Folder modal with target subject pre-selected
  const handleOpenAddFolderModal = (subjectId = null) => {
    const validSubjectId = (typeof subjectId === 'string') ? subjectId : null;
    if (validSubjectId) {
      setTargetSubjectForFolder(validSubjectId);
    } else {
      const activeSubjObj = subjects.find(s => s.name === activeSubject);
      setTargetSubjectForFolder(activeSubjObj ? activeSubjObj.id : (subjects[0]?.id || 'subj-1'));
    }
    setNewFolderName('');
    setShowNewFolderModal(true);
  };

  // Create new folder inside the chosen subject
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const folderTrimmed = newFolderName.trim();

    const targetSubj = subjects.find(s => s.id === targetSubjectForFolder);
    const targetSubjName = targetSubj ? targetSubj.name : activeSubject;

    if (targetSubj?.folders.some(f => f.name.toLowerCase() === folderTrimmed.toLowerCase())) {
      alert(`Folder "${folderTrimmed}" already exists in ${targetSubjName}.`);
      return;
    }

    const newF = {
      id: `folder-${Date.now()}`,
      name: folderTrimmed,
      reminder: { type: 'ai', status: 'AI Monitored', nextDate: '2026-09-20' },
      files: []
    };

    setSubjects(prev => prev.map(subj => {
      if (subj.id === targetSubjectForFolder) {
        return { ...subj, folders: [...subj.folders, newF] };
      }
      return subj;
    }));

    setActiveSubject(targetSubjName);
    setActiveFolder(folderTrimmed);
    setSelectedFile(null);
    setShowNewFolderModal(false);
    setNewFolderName('');
    showToast(`Created folder "${folderTrimmed}" in ${targetSubjName}`, 'success');
  };

  // Delete a folder and its contents
  const handleDeleteFolder = (subjectName, folderName) => {
    if (!window.confirm(`Are you sure you want to delete folder "${folderName}" and all files in it?`)) return;

    let newActiveFolder = activeFolder;
    let newSelectedFile = selectedFile;

    setSubjects(prev => prev.map(subj => {
      if (subj.name !== subjectName) return subj;
      const remainingFolders = subj.folders.filter(f => f.name !== folderName);

      if (activeSubject === subjectName && activeFolder === folderName) {
        if (remainingFolders.length > 0) {
          newActiveFolder = remainingFolders[0].name;
          newSelectedFile = remainingFolders[0].files.length > 0 ? remainingFolders[0].files[0] : null;
        } else {
          newActiveFolder = '';
          newSelectedFile = null;
        }
      }
      return { ...subj, folders: remainingFolders };
    }));

    if (activeFolder === folderName) {
      setActiveFolder(newActiveFolder);
      setSelectedFile(newSelectedFile);
    }
    showToast(`Deleted folder "${folderName}"`, 'info');
  };

  // Delete an individual file
  const handleDeleteFile = (subjectName, folderName, fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    setSubjects(prev => prev.map(subj => {
      if (subj.name !== subjectName) return subj;
      return {
        ...subj,
        folders: subj.folders.map(folder => {
          if (folder.name !== folderName) return folder;
          return {
            ...folder,
            files: folder.files.filter(f => f.id !== fileId)
          };
        })
      };
    }));

    if (selectedFile?.id === fileId) {
      const subj = subjects.find(s => s.name === subjectName);
      const folder = subj?.folders.find(f => f.name === folderName);
      const remaining = (folder?.files || []).filter(f => f.id !== fileId);
      setSelectedFile(remaining.length > 0 ? remaining[0] : null);
    }
    showToast(`Deleted "${fileName}"`, 'info');
  };

  // Add new Subject / Discipline
  const handleCreateSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    const nameTrimmed = newSubjectName.trim();

    if (subjects.some(s => s.name.toLowerCase() === nameTrimmed.toLowerCase())) {
      alert(`Subject "${nameTrimmed}" already exists.`);
      return;
    }

    const newSubj = {
      id: `subj-${Date.now()}`,
      name: nameTrimmed,
      code: newSubjectCode.trim() || 'ACAD-101',
      color: newSubjectColor || '#9e3c26',
      totalFiles: 0,
      decayAlert: false,
      revisionDue: 'Fresh',
      folders: [
        {
          id: `folder-${Date.now()}`,
          name: 'General Notes',
          reminder: { type: 'ai', status: 'AI Monitored', nextDate: '2026-09-25' },
          files: []
        }
      ]
    };

    setSubjects(prev => [...prev, newSubj]);
    setActiveSubject(nameTrimmed);
    setActiveFolder('General Notes');
    setSelectedFile(null);
    setShowNewSubjectModal(false);
    setNewSubjectName('');
    setNewSubjectCode('');
    showToast(`Created discipline "${nameTrimmed}"`, 'success');
  };

  // Open New Document modal
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
    if (!activeSubjObj) activeSubjObj = subjects[0] || mockSubjects[0];

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

    const chosenSubj = subjects.find(s => s.id === newDocSubjectId);
    const chosenSubjName = chosenSubj ? chosenSubj.name : activeSubject;
    const finalFolder = newDocFolderName.trim() || 'General Notes';

    setSubjects(prev => prev.map(subj => {
      if (subj.id === newDocSubjectId) {
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

        return { ...subj, totalFiles: (subj.totalFiles || 0) + 1, folders: updatedFolders };
      }
      return subj;
    }));

    setActiveSubject(chosenSubjName);
    setActiveFolder(finalFolder);
    setSelectedFile(newDoc);
    setShowNewDocModal(false);
    showToast(`Created document "${fileName}"`, 'success');
  };

  // Configure Spaced Revision schedule for an item
  const handleSaveReminderSchedule = (schedule) => {
    if (!reminderTarget) return;

    setSubjects(prev => prev.map(subj => {
      if (subj.name !== (reminderTarget.subject || activeSubject)) return subj;

      // If subject was targeted
      if (subj.id === reminderTarget.id) {
        return {
          ...subj,
          reminder: {
            type: schedule.type,
            status: schedule.type === 'ai' ? 'AI Optimized' : schedule.date,
            nextDate: schedule.date
          }
        };
      }

      // If folder or file was targeted
      const updatedFolders = subj.folders.map(folder => {
        if (folder.id === reminderTarget.id) {
          return {
            ...folder,
            reminder: {
              type: schedule.type,
              status: schedule.type === 'ai' ? 'AI Monitored' : schedule.date,
              nextDate: schedule.date
            }
          };
        }

        const updatedFiles = folder.files.map(file => {
          if (file.id === reminderTarget.id) {
            return {
              ...file,
              reminder: {
                type: schedule.type,
                status: 'scheduled',
                interval: schedule.type === 'ai' ? 'AI Spaced (3d)' : schedule.date,
                basis: schedule.type === 'ai' ? 'SuperMemo-2 AI Spaced' : 'Manual Schedule',
                nextDate: schedule.date
              }
            };
          }
          return file;
        });

        return { ...folder, files: updatedFiles };
      });

      return { ...subj, folders: updatedFolders };
    }));

    if (selectedFile?.id === reminderTarget.id) {
      setSelectedFile(prev => prev ? ({
        ...prev,
        reminder: {
          type: schedule.type,
          status: 'scheduled',
          interval: schedule.type === 'ai' ? 'AI Spaced (3d)' : schedule.date,
          basis: schedule.type === 'ai' ? 'SuperMemo-2 AI Spaced' : 'Manual Schedule',
          nextDate: schedule.date
        }
      }) : null);
    }

    showToast(`Spaced revision scheduled for "${reminderTarget.name}"`, 'success');
  };

  // Reset to initial demo courseware notes
  const handleResetToDemo = () => {
    if (window.confirm('Reset Knowledge Vault back to default courseware demo data? This will clear custom uploaded files.')) {
      clearNotesStorage();
      setSubjects(mockSubjects);
      setActiveSubject(mockSubjects[0].name);
      setActiveFolder(mockSubjects[0].folders[0].name);
      setSelectedFile(mockSubjects[0].folders[0].files[0]);
      showToast('Vault restored to default demo courseware', 'info');
    }
  };

  // Dynamic Vault Metrics calculated from state
  const totalFilesCount = subjects.reduce((sum, s) => sum + (s.folders || []).reduce((fSum, f) => fSum + (f.files || []).length, 0), 0);
  const richDocsCount = subjects.reduce((sum, s) => sum + (s.folders || []).reduce((fSum, f) => fSum + (f.files || []).filter(file => file.type === 'doc' || file.type === 'docx' || file.type === 'txt').length, 0), 0);
  const diagramsCount = subjects.reduce((sum, s) => sum + (s.folders || []).reduce((fSum, f) => fSum + (f.files || []).filter(file => file.type === 'png' || file.type === 'jpg' || file.type === 'jpeg' || file.type === 'svg').length, 0), 0);
  const pdfsCount = subjects.reduce((sum, s) => sum + (s.folders || []).reduce((fSum, f) => fSum + (f.files || []).filter(file => file.type === 'pdf').length, 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in relative">
      
      {/* Toast Notification Pill */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[rgb(var(--color-card))] border border-[#9e3c26]/40 shadow-2xl text-xs font-semibold text-[rgb(var(--color-text))] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="w-5 h-5 rounded-full bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center shrink-0">
            <CheckCircle2 size={13} />
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Breadcrumbs & Quick Revision Hub Link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-muted))] gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <span>REPOSITORY</span>
          <span>/</span>
          <span>Knowledge Vault</span>
          <span>/</span>
          <span className="px-1.5 py-0.5 rounded bg-[rgb(var(--color-container-high))] text-[rgb(var(--color-text))] font-semibold">🧬 {activeSubject}</span>
          <span>/</span>
          <span>{activeFolder || '(No Folder)'}</span>
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
            <span>AI Revision Hub</span>
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

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-xs border border-[rgb(var(--color-border))] hidden md:flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title={showSidebar ? 'Collapse Taxonomy Sidebar' : 'Show Taxonomy Sidebar'}
          >
            {showSidebar ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            <span>{showSidebar ? 'Hide Tree' : 'Show Tree'}</span>
          </button>

          <button
            onClick={() => setShowNewSubjectModal(true)}
            className="px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-xs border border-[rgb(var(--color-border))] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Create a new academic discipline subject"
          >
            <Plus size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>+ Discipline</span>
          </button>

          <button
            onClick={() => handleOpenAddFolderModal()}
            className="px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-xs border border-[rgb(var(--color-border))] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FolderPlus size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>+ Folder</span>
          </button>

          <button
            onClick={() => handleOpenNewDocModal()}
            className="px-3.5 py-2 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-[#9e3c26]/25 cursor-pointer"
          >
            <Plus size={14} />
            <span>+ Document</span>
          </button>

          <button
            onClick={() => setShowCreateRevModal(true)}
            className="px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-xs border border-[rgb(var(--color-border))] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Clock size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>Revision</span>
          </button>

          <button
            onClick={handleResetToDemo}
            className="px-2.5 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] text-xs border border-[rgb(var(--color-border))] flex items-center gap-1 transition-colors cursor-pointer"
            title="Restore sample courseware demo notes"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* 4 Focused Vault Metrics (Dynamically Calculated) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Archived Assets</span>
            <Database size={13} className="text-[rgb(var(--color-muted))]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[rgb(var(--color-text))] mt-1">{totalFilesCount}</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-secondary))] mt-1 font-medium">Across {subjects.length} Disciplines</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Rich Text Docs</span>
            <FileText size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#9e3c26] dark:text-[#ffb4a3] mt-1">{richDocsCount}</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">Word & Rich Text Formatted</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Diagrams & Media</span>
            <Layers size={13} className="text-sky-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-sky-600 dark:text-sky-400 mt-1">{diagramsCount + pdfsCount}</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">{diagramsCount} Schematics • {pdfsCount} PDFs</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Vault Sync Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">Local Vault</div>
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
              onDeleteFile={handleDeleteFile}
              onDeleteFolder={handleDeleteFolder}
              onAddSubject={() => setShowNewSubjectModal(true)}
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
                onSave={handleSaveDocument}
              />
            ) : (
              <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-2xl p-8 sm:p-12 text-center shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col items-center justify-center min-h-[580px]">
                <div className="w-16 h-16 rounded-3xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center mb-4">
                  <FolderPlus size={30} />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#9e3c26] dark:text-[#ffb4a3] font-bold mb-1">
                  {activeSubject}
                </div>
                <h3 className="text-xl font-bold text-[rgb(var(--color-text))] mb-2">
                  Folder "{activeFolder || 'General'}" is Empty
                </h3>
                <p className="text-xs text-[rgb(var(--color-muted))] max-w-md mb-6 leading-relaxed">
                  No notes, PDFs, or diagrams in this folder yet. Create a new document, drag and drop files into the uploader, or delete this folder if no longer needed.
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
                    onClick={() => document.getElementById('notes-file-uploader-input')?.click()}
                    className="px-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-xs border border-[rgb(var(--color-border))] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <UploadCloud size={14} />
                    <span>Upload File to this Folder</span>
                  </button>
                  {activeFolder && (
                    <button
                      onClick={() => handleDeleteFolder(activeSubject, activeFolder)}
                      className="px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold text-xs border border-red-500/20 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>Delete Folder</span>
                    </button>
                  )}
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
          showToast(`Scheduled "${newItem.topic}" for Revision Hub!`, 'success');
        }}
      />

      {/* Spaced Revision Reminder Modal */}
      {showReminderModal && (
        <RevisionReminderModal
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          targetItem={reminderTarget}
          onSave={handleSaveReminderSchedule}
        />
      )}

      {/* Add Folder Modal */}
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

      {/* Add Discipline / Subject Modal */}
      {showNewSubjectModal && (
        <Modal isOpen={showNewSubjectModal} onClose={() => setShowNewSubjectModal(false)} maxWidth="max-w-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-8 h-8 rounded-xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center font-bold">
              <BookOpen size={16} />
            </span>
            <div>
              <h3 className="text-base font-bold text-[rgb(var(--color-text))]">Add Academic Discipline</h3>
              <p className="text-[11px] text-[rgb(var(--color-muted))]">Create a new root subject in your Knowledge Vault.</p>
            </div>
          </div>
          <form onSubmit={handleCreateSubject} className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                Subject Name
              </label>
              <input
                type="text"
                required
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g. Quantum Computing"
                className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                Course Code
              </label>
              <input
                type="text"
                value={newSubjectCode}
                onChange={(e) => setNewSubjectCode(e.target.value)}
                placeholder="e.g. CS-440"
                className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1.5 font-semibold">
                Badge Color
              </label>
              <div className="flex items-center gap-2">
                {['#9e3c26', '#4f7cac', '#2d7d46', '#d4a017', '#7c3aed', '#db2777'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewSubjectColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      newSubjectColor === color ? 'scale-125 border-[rgb(var(--color-text))]' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-medium text-xs cursor-pointer shadow-sm transition-colors mt-2"
            >
              Create Subject in Vault
            </button>
          </form>
        </Modal>
      )}

      {/* Create New Document Modal */}
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
