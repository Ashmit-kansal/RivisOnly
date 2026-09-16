import React, { useState } from 'react';
import { 
  Folder, FolderOpen, FileText, Image as ImageIcon, FileCode, 
  ChevronRight, ChevronDown, Plus, Clock, Search, FilePlus
} from 'lucide-react';

export default function FileTree({ 
  subjects, 
  selectedFile, 
  onSelectFile, 
  onOpenReminderModal,
  onAddFolder,
  onNewNote
}) {
  const [expandedSubjects, setExpandedSubjects] = useState({ 'subj-1': true, 'subj-2': false, 'subj-3': false });
  const [expandedFolders, setExpandedFolders] = useState({ 'folder-1': true, 'folder-2': false });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Files');

  const toggleSubject = (id) => {
    setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFolder = (id) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))]">
          {subjects.length} Disciplines
        </span>
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
          {['All Files', '#Decay-Critical', '#Exams-W08', '#PDFs', '#WebDocs'].map(filter => (
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
        
        <div className="flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))] uppercase px-1">
          <span className="font-semibold">Active Root Subjects</span>
          <button
            onClick={onAddFolder}
            className="flex items-center gap-1 text-[#9e3c26] dark:text-[#ffb4a3] hover:underline cursor-pointer lowercase font-medium"
          >
            <Plus size={12} />
            <span>+ add folder</span>
          </button>
        </div>

        {subjects.map(subject => {
          const isSubjOpen = expandedSubjects[subject.id];
          return (
            <div key={subject.id} className="rounded-xl border border-[rgb(var(--color-border))] overflow-hidden bg-[rgb(var(--color-container-low))]">
              
              {/* Subject Header (Root Level) */}
              <div className="flex items-center justify-between p-2.5 hover:bg-[rgb(var(--color-container))] transition-colors">
                <button
                  onClick={() => toggleSubject(subject.id)}
                  className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                >
                  {isSubjOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                  <span className="font-semibold text-[rgb(var(--color-text))] truncate">
                    {subject.name}
                  </span>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                    {subject.totalFiles} items
                  </span>
                  
                  <button
                    onClick={() => onOpenReminderModal && onOpenReminderModal({ id: subject.id, name: subject.name, subject: subject.name })}
                    className="p-1 text-[rgb(var(--color-muted))] hover:text-[#9e3c26] rounded-md transition-colors"
                    title="Set Spaced Revision for this Subject"
                  >
                    <Clock size={12} />
                  </button>
                </div>
              </div>

              {/* Folders in Subject */}
              {isSubjOpen && (
                <div className="pl-4 pr-2 pb-2 space-y-1.5 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
                  {subject.folders.map(folder => {
                    const isFolderOpen = expandedFolders[folder.id];
                    return (
                      <div key={folder.id} className="pt-1.5">
                        
                        {/* Folder Line */}
                        <div className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] transition-colors">
                          <button
                            onClick={() => toggleFolder(folder.id)}
                            className="flex items-center gap-1.5 text-left flex-1 cursor-pointer"
                          >
                            {isFolderOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            {isFolderOpen ? <FolderOpen size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" /> : <Folder size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />}
                            <span className="font-medium text-[rgb(var(--color-text))] truncate">
                              {folder.name}
                            </span>
                          </button>

                          <div className="flex items-center gap-1">
                            {folder.reminder && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))]">
                                {folder.reminder.status}
                              </span>
                            )}
                            <button
                              onClick={() => onOpenReminderModal && onOpenReminderModal({ id: folder.id, name: folder.name, subject: subject.name })}
                              className="p-1 text-[rgb(var(--color-muted))] hover:text-[#9e3c26]"
                              title="Set Spaced Revision for Folder"
                            >
                              <Clock size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Files in Folder */}
                        {isFolderOpen && (
                          <div className="pl-5 space-y-1 mt-1 border-l border-[rgb(var(--color-border))] ml-2">
                            {folder.files.map(file => {
                              const isSelected = selectedFile && selectedFile.id === file.id;
                              return (
                                <div
                                  key={file.id}
                                  onClick={() => onSelectFile && onSelectFile(file, subject.name, folder.name)}
                                  className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
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

                                  <div className="flex items-center gap-1.5 shrink-0">
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenReminderModal && onOpenReminderModal({ id: file.id, name: file.name, subject: subject.name });
                                      }}
                                      className="p-1 hover:text-[#9e3c26] text-[rgb(var(--color-muted))]"
                                      title="Set Revision Reminder"
                                    >
                                      <Clock size={12} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* Quick Action Button at Bottom */}
      <div className="pt-3 border-t border-[rgb(var(--color-border))] mt-3 flex items-center gap-2">
        <button
          onClick={onNewNote}
          className="flex-1 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[#9e3c26] hover:text-white dark:hover:bg-[#e26f54] text-xs font-semibold text-[rgb(var(--color-text))] flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[rgb(var(--color-border))]"
        >
          <FilePlus size={13} />
          <span>+ Create Web Doc Note</span>
        </button>
      </div>

    </div>
  );
}
