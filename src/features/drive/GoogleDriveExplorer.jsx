import React, { useState, useEffect, useRef } from 'react';
import {
  listGoogleDriveFiles,
  createDriveFolder,
  uploadDriveFile,
  getFileTypeDetails,
  formatFileSize,
  GOOGLE_MIME_TYPES
} from '../../services/googleDriveService';
import { getForgedDeck } from '../../services/questionBankService';
import {
  Folder, FolderOpen, FileText, File, Search, ChevronRight,
  RefreshCw, ExternalLink, HardDrive, AlertCircle, Sparkles,
  Layers, ArrowLeft, Filter, CheckCircle2, FolderPlus, UploadCloud,
  Check, X, Loader2, Plus
} from 'lucide-react';

export default function GoogleDriveExplorer({
  token,
  selectedFile,
  onSelectFile,
  onRequestAuth,
  onToast,
  externalRefreshKey = 0,
}) {
  const [currentFolder, setCurrentFolder] = useState({ id: 'root', name: 'My Drive' });
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: 'root', name: 'My Drive' }]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [scopeAll, setScopeAll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Folder creation state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolderLoading, setCreatingFolderLoading] = useState(false);

  // File upload state
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load files when folder, search, filter, or refreshKey changes
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    async function loadFiles() {
      setLoading(true);
      setError(null);
      try {
        const results = await listGoogleDriveFiles({
          token,
          folderId: currentFolder.id,
          searchQuery,
          filterCategory,
          scopeAll,
        });
        if (isMounted) {
          setFiles(results);
          // Auto-select first non-folder file if nothing is selected yet
          if (!selectedFile && results.length > 0) {
            const firstFile = results.find(f => f.mimeType !== GOOGLE_MIME_TYPES.FOLDER);
            if (firstFile) onSelectFile(firstFile);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching Drive files:', err);
          setError(err.message || 'Failed to load Google Drive files.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFiles();
    return () => { isMounted = false; };
  }, [token, currentFolder.id, searchQuery, filterCategory, scopeAll, refreshKey, externalRefreshKey]);

  // Navigate down into a folder
  const handleOpenFolder = (folder) => {
    setCurrentFolder({ id: folder.id, name: folder.name });
    setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
    setSearchQuery('');
  };

  // Navigate back to specific breadcrumb
  const handleNavigateBreadcrumb = (index) => {
    const target = breadcrumbs[index];
    setBreadcrumbs(prev => prev.slice(0, index + 1));
    setCurrentFolder(target);
    setSearchQuery('');
  };

  // Step up one folder
  const handleStepUp = () => {
    if (breadcrumbs.length > 1) {
      handleNavigateBreadcrumb(breadcrumbs.length - 2);
    }
  };

  // Handle folder creation
  const handleCreateFolder = async (e) => {
    if (e) e.preventDefault();
    if (!newFolderName.trim() || creatingFolderLoading) return;

    setCreatingFolderLoading(true);
    try {
      const created = await createDriveFolder({
        token,
        name: newFolderName.trim(),
        parentFolderId: currentFolder.id,
      });

      if (onToast) {
        onToast(`📁 Created folder "${created.name || newFolderName}"!`, 'success');
      }
      setNewFolderName('');
      setIsCreatingFolder(false);
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error('Failed to create folder:', err);
      const errMsg = err.message || 'Failed to create folder.';
      setError(errMsg);
      if (onToast) onToast(errMsg, 'error');
    } finally {
      setCreatingFolderLoading(false);
    }
  };

  // Upload handler for files
  const uploadFileList = async (filesToUpload) => {
    if (!token || !filesToUpload.length) return;

    setIsUploading(true);
    let successCount = 0;
    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        setUploadStatus(`Uploading ${file.name} (${i + 1}/${filesToUpload.length})...`);
        const uploaded = await uploadDriveFile({
          token,
          file,
          parentFolderId: currentFolder.id,
        });
        successCount++;
        // If this is the first file, auto-select it
        if (i === 0 && uploaded?.id) {
          onSelectFile(uploaded);
        }
      }

      const msg = `Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''} to ${currentFolder.name}!`;
      setUploadStatus(msg);
      if (onToast) onToast(msg, 'success');
      setRefreshKey(k => k + 1);
      setTimeout(() => setUploadStatus(null), 3500);
    } catch (err) {
      console.error('Upload error:', err);
      const errMsg = err.message || 'File upload failed.';
      setError(errMsg);
      if (onToast) onToast(errMsg, 'error');
      setUploadStatus(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      uploadFileList(selected);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length > 0) {
      uploadFileList(droppedFiles);
    }
  };

  if (!token) {
    return (
      <div className="rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] p-8 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <HardDrive size={26} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
            Google Drive Disconnected
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] max-w-sm mx-auto">
            Authorize Rivisonly with your Google account to browse, read, and generate AI revision quizzes from your Drive notes.
          </p>
        </div>
        <button
          onClick={onRequestAuth}
          className="px-4 py-2 rounded-xl bg-[rgb(var(--color-primary))] text-white text-xs font-semibold shadow-sm hover:brightness-105 cursor-pointer inline-flex items-center gap-2 transition-all"
        >
          <Sparkles size={14} />
          <span>Connect Google Drive</span>
        </button>
      </div>
    );
  }

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs flex flex-col h-[740px] overflow-hidden relative"
    >
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-[rgb(var(--color-primary))]/20 backdrop-blur-xs border-2 border-dashed border-[rgb(var(--color-primary))] flex flex-col items-center justify-center space-y-2 p-6 animate-fade-in pointer-events-none">
          <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] text-[rgb(var(--color-primary))] shadow-xl">
            <UploadCloud size={36} className="animate-bounce" />
          </div>
          <p className="text-sm font-bold text-[rgb(var(--color-text))]">
            Drop files here to upload
          </p>
          <p className="text-xs font-mono text-[rgb(var(--color-muted))]">
            Uploading to folder: <span className="font-bold text-[rgb(var(--color-text))]">{currentFolder.name}</span>
          </p>
        </div>
      )}

      {/* Top Header & Search */}
      <div className="p-4 border-b border-[rgb(var(--color-border))] space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3]">
              <HardDrive size={16} />
            </span>
            <span className="font-bold text-sm text-[rgb(var(--color-text))]">
              Google Drive Explorer
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setScopeAll(prev => !prev)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border transition-colors cursor-pointer ${
                scopeAll
                  ? 'bg-[rgb(var(--color-primary))]/10 border-[rgb(var(--color-primary))]/30 text-[rgb(var(--color-primary))] font-bold'
                  : 'bg-[rgb(var(--color-container-low))] border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
              }`}
              title="Toggle searching across all Drive files vs current folder"
            >
              {scopeAll ? 'Scope: All Drive' : 'Scope: Folder'}
            </button>

            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="p-1.5 rounded-lg text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] border border-transparent hover:border-[rgb(var(--color-border))] transition-colors cursor-pointer"
              title="Refresh files"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={scopeAll ? "Search all files across your Google Drive..." : `Search files in ${currentFolder.name}...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/30"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar pt-0.5">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'folders', label: 'Folders' },
            { id: 'docs', label: 'Docs' },
            { id: 'pdfs', label: 'PDFs' },
            { id: 'slides', label: 'Slides' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterCategory(f.id)}
              className={`px-2.5 py-0.5 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterCategory === f.id
                  ? 'bg-[rgb(var(--color-primary))] text-white font-bold'
                  : 'bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumbs Navigation & File Actions Bar */}
      <div className="px-3.5 py-2 bg-[rgb(var(--color-container-low))]/70 border-b border-[rgb(var(--color-border))] flex items-center justify-between gap-2 text-xs font-mono shrink-0">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar min-w-0">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.id}>
                {idx > 0 && <ChevronRight size={11} className="text-[rgb(var(--color-muted))] shrink-0" />}
                <button
                  onClick={() => handleNavigateBreadcrumb(idx)}
                  className={`truncate max-w-[110px] transition-colors cursor-pointer ${
                    isLast 
                      ? 'font-bold text-[rgb(var(--color-text))]' 
                      : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:underline'
                  }`}
                  title={crumb.name}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Folder & Upload Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {breadcrumbs.length > 1 && (
            <button
              onClick={handleStepUp}
              className="px-2 py-1 rounded-lg text-[11px] text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-container))] flex items-center gap-1 cursor-pointer transition-colors"
              title="Go up one folder"
            >
              <ArrowLeft size={11} />
              <span>Up</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsCreatingFolder(prev => !prev);
              setNewFolderName('');
            }}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              isCreatingFolder
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-[rgb(var(--color-container))] hover:bg-[rgb(var(--color-container-high))] text-[rgb(var(--color-text))] border-[rgb(var(--color-border))]'
            }`}
            title="Create new folder in current directory"
          >
            <FolderPlus size={12} className="text-amber-500" />
            <span>Folder</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-2.5 py-1 rounded-lg bg-[rgb(var(--color-primary))] hover:brightness-105 text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs disabled:opacity-50"
            title="Upload files to current folder"
          >
            <UploadCloud size={12} />
            <span>Upload</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Inline New Folder Form */}
      {isCreatingFolder && (
        <form
          onSubmit={handleCreateFolder}
          className="p-2.5 bg-amber-500/5 border-b border-amber-500/20 flex items-center gap-2 animate-fade-in shrink-0"
        >
          <FolderPlus size={15} className="text-amber-500 shrink-0 ml-1" />
          <input
            type="text"
            autoFocus
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name (e.g. Operating Systems, Calculus)..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-muted))] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            disabled={creatingFolderLoading}
          />
          <button
            type="submit"
            disabled={creatingFolderLoading || !newFolderName.trim()}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer flex items-center gap-1 shrink-0 transition-colors shadow-xs"
          >
            {creatingFolderLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            <span>Create</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreatingFolder(false);
              setNewFolderName('');
            }}
            className="p-1.5 rounded-lg text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] cursor-pointer shrink-0 transition-colors"
            title="Cancel"
          >
            <X size={14} />
          </button>
        </form>
      )}

      {/* Upload Progress Status Banner */}
      {uploadStatus && (
        <div className="px-3.5 py-2 bg-[rgb(var(--color-primary))]/10 border-b border-[rgb(var(--color-primary))]/20 text-[rgb(var(--color-primary))] flex items-center justify-between text-xs font-semibold animate-fade-in shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {isUploading ? (
              <Loader2 size={13} className="animate-spin shrink-0" />
            ) : (
              <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
            )}
            <span className="truncate">{uploadStatus}</span>
          </div>
          {isUploading && (
            <span className="text-[10px] font-mono opacity-75 shrink-0">Drive v3</span>
          )}
        </div>
      )}

      {/* File List Body */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {error ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs space-y-2.5 m-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle size={15} />
              <span>Drive Query Error</span>
            </div>
            <p className="text-[11px] leading-relaxed break-words">{error}</p>
            {(() => {
              const urlMatch = error.match(/(https?:\/\/[^\s]+)/);
              const foundUrl = urlMatch ? urlMatch[0] : null;
              return (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {foundUrl && (
                    <a
                      href={foundUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <ExternalLink size={12} />
                      <span>Enable Google Drive API</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setRefreshKey(k => k + 1)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    <span>Retry Connection</span>
                  </button>
                  {(error.includes('AUTH_INSUFFICIENT_SCOPES') || 
                    error.toLowerCase().includes('insufficient') || 
                    error.toLowerCase().includes('scope') || 
                    error.includes('AUTH_EXPIRED')) && (
                    <button
                      type="button"
                      onClick={onRequestAuth}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#9e3c26] hover:bg-[#be543c] text-white font-semibold text-xs cursor-pointer shadow-sm transition-all"
                    >
                      <Sparkles size={13} />
                      <span>Grant Google Drive Permissions</span>
                    </button>
                  )}
                  {(error.includes('AUTH_INSUFFICIENT_SCOPES') || error.toLowerCase().includes('insufficient') || error.toLowerCase().includes('scope')) && (
                    <p className="w-full text-[10px] text-[rgb(var(--color-muted))] pt-1">
                      💡 <strong>Note:</strong> If Google displays &ldquo;Google hasn&apos;t verified this app&rdquo;, click <strong>Advanced &rarr; Go to Rivisonly (unsafe)</strong> and select both permissions to enable Drive access.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        ) : loading ? (
          <div className="space-y-2 p-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-12 rounded-xl bg-[rgb(var(--color-container-low))] animate-pulse" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="py-16 text-center space-y-3 text-[rgb(var(--color-muted))]">
            <FolderOpen size={32} className="mx-auto opacity-50 text-amber-500" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[rgb(var(--color-text))]">No files found in this folder</p>
              <p className="text-[11px] text-[rgb(var(--color-muted))] max-w-xs mx-auto">
                Drag and drop notes, PDFs, or docs here, or use the buttons above to create folders and upload notes.
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
              >
                Clear search filter
              </button>
            )}
          </div>
        ) : (
          files.map(file => {
            const isFolder = file.mimeType === GOOGLE_MIME_TYPES.FOLDER;
            const details = getFileTypeDetails(file.mimeType, file.name);
            const isSelected = selectedFile?.id === file.id;
            const forgedDeck = !isFolder ? getForgedDeck(file.id) : null;

            return (
              <div
                key={file.id}
                onClick={() => {
                  if (isFolder) {
                    handleOpenFolder(file);
                  } else {
                    onSelectFile(file);
                  }
                }}
                className={`w-full p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left group ${
                  isSelected
                    ? 'bg-[rgb(var(--color-container))] border-[rgb(var(--color-primary))]/50 shadow-xs'
                    : 'bg-transparent border-transparent hover:bg-[rgb(var(--color-container-low))] hover:border-[rgb(var(--color-border))]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-2 rounded-lg border shrink-0 ${details.color}`}>
                    {isFolder ? <Folder size={15} /> : <FileText size={15} />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--color-text))]'
                      }`}>
                        {file.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[rgb(var(--color-muted))] mt-0.5">
                      <span>{details.label}</span>
                      {file.size && (
                        <>
                          <span>•</span>
                          <span>{formatFileSize(file.size)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isFolder ? (
                    <ChevronRight size={14} className="text-[rgb(var(--color-muted))] group-hover:translate-x-0.5 transition-transform" />
                  ) : (
                    <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 text-[rgb(var(--color-muted))] transition-opacity">
                      Preview
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Status */}
      <div className="px-4 py-2 border-t border-[rgb(var(--color-border))] text-[11px] font-mono text-[rgb(var(--color-muted))] flex items-center justify-between shrink-0 bg-[rgb(var(--color-container-low))]/30">
        <span className="truncate">
          {files.length} items in <span className="font-bold text-[rgb(var(--color-text))]">{currentFolder.name}</span>
        </span>
        <span className="shrink-0">Drive v3</span>
      </div>

    </div>
  );
}
