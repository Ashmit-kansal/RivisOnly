import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, FolderOpen, FileText, Image as ImageIcon, FileCode, 
  ChevronRight, ChevronDown, Plus, Clock, Search, FilePlus, Trash2
} from 'lucide-react';

export default function FileTree({ 
  subjects, 
  selectedFile, 
  activeSubject,
  activeFolder,
  onSelectFile, 
  onSelectFolder,
  onOpenReminderModal,
  onAddFolder,
  onNewNote,
  onDeleteFile,
  onDeleteFolder,
  onAddSubject
}) {
  const [expandedSubjects, setExpandedSubjects] = useState(() => {
    const init = {};
    subjects.forEach(s => {
      init[s.id] = s.name === activeSubject;
    });
    return init;
  });

  const [expandedFolders, setExpandedFolders] = useState(() => {
    const init = {};
    subjects.forEach(s => {
      s.folders.forEach(f => {
        init[f.id] = f.name === activeFolder;
      });
    });
    return init;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Files');
  const prevActiveRef = useRef({ subject: activeSubject, folder: activeFolder });

  // Auto-expand subject and folder ONLY when activeSubject or activeFolder actually change
  useEffect(() => {
    if (activeSubject) {
      const subj = subjects.find(s => s.name === activeSubject);
      if (subj) {
        setExpandedSubjects(prev => ({ ...prev, [subj.id]: true }));
        if (activeFolder && (prevActiveRef.current.folder !== activeFolder || prevActiveRef.current.subject !== activeSubject)) {
          const folder = subj.folders.find(f => f.name === activeFolder);
          if (folder) {
            setExpandedFolders(prev => ({ ...prev, [folder.id]: true }));
          }
        }
      }
      prevActiveRef.current = { subject: activeSubject, folder: activeFolder };
    }
  }, [activeSubject, activeFolder, subjects]);

  const toggleSubject = (id) => {
    setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFolder = (id) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter subjects, folders, and files dynamically
  const q = searchQuery.toLowerCase().trim();
  const isFiltering = Boolean(q || activeFilter !== 'All Files');

  const filteredSubjects = subjects.map(subject => {
    const subjectNameMatches = q ? subject.name.toLowerCase().includes(q) : false;

    const updatedFolders = subject.folders.map(folder => {
      const folderNameMatches = q ? folder.name.toLowerCase().includes(q) : false;

      const matchingFiles = folder.files.filter(file => {
        // File type filter
        if (activeFilter === 'PDFs' && file.type !== 'pdf') return false;
        if (activeFilter === 'Notes' && file.type !== 'doc' && file.type !== 'docx' && file.type !== 'txt' && file.type !== 'md') return false;
        if (activeFilter === 'Media' && !['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(file.type)) return false;

        // If subject or folder name matches and filter is 'All Files', keep file
        if (!q) return true;
        if (subjectNameMatches || folderNameMatches) return true;

        // Text query
        const matchName = file.name.toLowerCase().includes(q);
        const matchContent = typeof file.content === 'string' && file.content.toLowerCase().includes(q);
        const matchTags = file.tags && file.tags.some(t => t.toLowerCase().includes(q));
        return matchName || matchContent || matchTags;
      });

      return { 
        ...folder, 
        files: matchingFiles,
        hasMatches: matchingFiles.length > 0 || folderNameMatches || subjectNameMatches
      };
    }).filter(folder => {
      if (!isFiltering) return true;
      return folder.hasMatches;
    });

    return {
      ...subject,
      folders: updatedFolders,
      hasMatches: updatedFolders.length > 0 || subjectNameMatches
    };
  }).filter(subject => {
    if (!isFiltering) return true;
    return subject.hasMatches;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'doc':
        return <FileCode size={14} className="text-[#9e3c26] dark:text-[#ffb4a3] shrink-0" />;
      case 'pdf':
        return <FileText size={14} className="text-red-500 shrink-0" />;
      case 'png':
        return <ImageIcon size={14} className="text-sky-500 shrink-0" />;
      case 'docx':
        return <FileText size={14} className="text-blue-500 shrink-0" />;
      default:
        return <FileText size={14} className="text-[rgb(var(--color-muted))] shrink-0" />;
    }
  };

  return (
    <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-2xl p-4 shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col h-full">
      
      {/* Header: Taxonomy Tree */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgb(var(--color-border))]">
        <div>
          <h3 className="font-bold text-sm tracking-tight text-[rgb(var(--color-text))]">
            Taxonomy Tree
          </h3>
          <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
            Root Directory: Disciplines
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {onAddSubject && (
            <button
              onClick={() => onAddSubject()}
              className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#9e3c26]/10 hover:bg-[#9e3c26]/20 text-[#9e3c26] dark:text-[#ffb4a3] border border-[#9e3c26]/30 font-semibold flex items-center gap-0.5 cursor-pointer transition-colors"
              title="Add a new discipline / subject"
            >
              <Plus size={10} />
              <span>Subject</span>
            </button>
          )}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))]">
            {subjects.length} Disciplines
          </span>
        </div>
      </div>

      {/* Search & Tag Pills */}
      <div className="py-3 space-y-2">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filenames, formulas, tags..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono py-1">
          {['All', 'Notes', 'PDFs', 'Media'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2 py-0.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                activeFilter === filter
                  ? 'bg-[#9e3c26] dark:bg-[#e26f54] text-white font-semibold shadow-xs'
                  : 'bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Root Subjects Tree List */}
      <div className="flex-1 overflow-y-auto space-y-2 text-xs pr-1">

        {filteredSubjects.length === 0 ? (
          <div className="p-6 text-center text-xs text-[rgb(var(--color-muted))] space-y-1">
            <p className="font-medium">No files matching filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('All Files'); }}
              className="text-[#9e3c26] dark:text-[#ffb4a3] font-semibold underline text-[11px] cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          filteredSubjects.map(subject => {
            const isSubjOpen = isFiltering ? true : expandedSubjects[subject.id];
            return (
            <div key={subject.id} className="rounded-xl border border-[rgb(var(--color-border))] overflow-hidden bg-[rgb(var(--color-container-low))]">
              
              {/* Subject Header (Root Level) */}
              <div className="flex items-center justify-between p-2.5 hover:bg-[rgb(var(--color-container))] transition-colors">
                <button
                  onClick={() => toggleSubject(subject.id)}
                  className="flex items-center gap-2 flex-1 text-left cursor-pointer min-w-0"
                >
                  {isSubjOpen ? <ChevronDown size={14} className="shrink-0" /> : <ChevronRight size={14} className="shrink-0" />}
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: subject.color || '#9e3c26' }} />
                  <span className="font-semibold text-[rgb(var(--color-text))] truncate">
                    {subject.name}
                  </span>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onAddFolder && onAddFolder(subject.id)}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#9e3c26] dark:text-[#ffb4a3] hover:bg-[#9e3c26]/10 transition-colors flex items-center gap-0.5 cursor-pointer"
                    title={`Add folder to ${subject.name}`}
                  >
                    <Plus size={11} />
                    <span>folder</span>
                  </button>

                  <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                    {subject.folders.reduce((acc, f) => acc + f.files.length, 0)} items
                  </span>
                </div>
              </div>

              {/* Folders in Subject */}
              {isSubjOpen && (
                <div className="pl-4 pr-2 pb-2 space-y-1.5 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
                  {subject.folders.map(folder => {
                    const isFolderOpen = isFiltering ? true : expandedFolders[folder.id];
                    const isFolderActive = activeFolder === folder.name && activeSubject === subject.name;
                    return (
                      <div key={folder.id} className="pt-1.5">
                        
                        {/* Folder Line */}
                        <div 
                          onClick={() => {
                            toggleFolder(folder.id);
                            onSelectFolder && onSelectFolder(subject.name, folder.name);
                          }}
                          className={`flex items-center justify-between py-1 px-1.5 rounded-lg transition-colors cursor-pointer group ${
                            isFolderActive
                              ? 'bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] font-semibold'
                              : 'hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-left flex-1 min-w-0">
                            {isFolderOpen ? <ChevronDown size={12} className="shrink-0" /> : <ChevronRight size={12} className="shrink-0" />}
                            {isFolderOpen ? <FolderOpen size={13} className="text-[#9e3c26] dark:text-[#ffb4a3] shrink-0" /> : <Folder size={13} className="text-[#9e3c26] dark:text-[#ffb4a3] shrink-0" />}
                            <span className="truncate">
                              {folder.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                            {folder.reminder && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))]">
                                {folder.reminder.status}
                              </span>
                            )}
                            <button
                              onClick={() => onNewNote && onNewNote({ subjectId: subject.id, subjectName: subject.name, folderName: folder.name })}
                              className="p-1 text-[rgb(var(--color-muted))] hover:text-[#9e3c26] transition-colors rounded cursor-pointer"
                              title={`Create Document in ${folder.name}`}
                            >
                              <Plus size={12} />
                            </button>
                            {onDeleteFolder && (
                              <button
                                onClick={() => onDeleteFolder(subject.name, folder.name)}
                                className="p-1 text-[rgb(var(--color-muted))] hover:text-red-500 opacity-60 hover:opacity-100 transition-all rounded cursor-pointer"
                                title={`Delete Folder "${folder.name}"`}
                              >
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Files in Folder */}
                        {isFolderOpen && (
                          <div className="pl-5 space-y-1 mt-1 border-l border-[rgb(var(--color-border))] ml-2">
                            {folder.files.length === 0 ? (
                              <div className="py-2 text-[11px] text-[rgb(var(--color-muted))] flex items-center justify-between pr-2">
                                <span>Empty folder</span>
                                <button
                                  onClick={() => onNewNote && onNewNote({ subjectId: subject.id, subjectName: subject.name, folderName: folder.name })}
                                  className="text-[#9e3c26] dark:text-[#ffb4a3] hover:underline font-medium flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Plus size={11} />
                                  <span>Add note</span>
                                </button>
                              </div>
                            ) : (
                              folder.files.map(file => {
                                const isSelected = selectedFile && selectedFile.id === file.id;
                                return (
                                  <div
                                    key={file.id}
                                    onClick={() => onSelectFile && onSelectFile(file, subject.name, folder.name)}
                                    className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer group ${
                                      isSelected
                                        ? 'border-[#9e3c26] dark:border-[#e26f54] bg-[#9e3c26]/10 dark:bg-[#e26f54]/15 text-[rgb(var(--color-text))]'
                                        : 'border-transparent hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      {getFileIcon(file.type)}
                                      <div className="truncate">
                                        <div className="font-medium truncate text-[rgb(var(--color-text))]">
                                          {file.name}
                                        </div>
                                        <div className="text-[10px] font-mono text-[rgb(var(--color-muted))] flex items-center gap-1.5">
                                          <span>{file.size}</span>
                                          <span>•</span>
                                          <span>{file.updatedAt}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                                      {file.reminder && (
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-medium ${
                                          file.reminder.status === 'decaying'
                                            ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                                            : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                        }`}>
                                          {file.reminder.interval || file.reminder.basis}
                                        </span>
                                      )}
                                      <button
                                        onClick={() => onOpenReminderModal && onOpenReminderModal({ id: file.id, name: file.name, subject: subject.name })}
                                        className="p-1 hover:text-[#9e3c26] text-[rgb(var(--color-muted))] cursor-pointer transition-colors"
                                        title="Set Revision Reminder"
                                      >
                                        <Clock size={12} />
                                      </button>
                                      {onDeleteFile && (
                                        <button
                                          onClick={() => onDeleteFile(subject.name, folder.name, file.id, file.name)}
                                          className="p-1 hover:text-red-500 text-[rgb(var(--color-muted))] opacity-60 hover:opacity-100 transition-all cursor-pointer"
                                          title={`Delete "${file.name}"`}
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        }))}

      </div>

      {/* Quick Action Button at Bottom */}
      <div className="pt-3 border-t border-[rgb(var(--color-border))] mt-3 flex items-center gap-2">
        <button
          onClick={() => onNewNote && onNewNote()}
          className="flex-1 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[#9e3c26] hover:text-white dark:hover:bg-[#e26f54] text-xs font-semibold text-[rgb(var(--color-text))] flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[rgb(var(--color-border))]"
        >
          <FilePlus size={13} />
          <span>Create Web Doc Note</span>
        </button>
      </div>

    </div>
  );
}
