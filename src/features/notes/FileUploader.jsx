import React, { useState, useRef } from 'react';
import { UploadCloud, Sparkles } from 'lucide-react';

export default function FileUploader({ activeSubject, activeFolder, onFileUploaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    setUploadProgress({ name: file.name, progress: 20 });
    const timer1 = setTimeout(() => {
      setUploadProgress({ name: file.name, progress: 65 });
    }, 400);

    const timer2 = setTimeout(() => {
      setUploadProgress({ name: file.name, progress: 100 });
      setTimeout(() => {
        const fileExt = file.name.split('.').pop().toLowerCase();
        const type = ['pdf', 'png', 'docx', 'doc'].includes(fileExt) ? fileExt : 'doc';
        
        if (onFileUploaded) {
          onFileUploaded({
            id: `file-${Date.now()}`,
            name: file.name,
            type,
            size: `${(file.size / 1024).toFixed(0)} KB`,
            updatedAt: 'Just now',
            tags: ['Vectorized', 'Fresh Upload'],
            reminder: { type: 'ai', basis: 'SuperMemo-2 AI Spaced', interval: '3 days', score: 95, status: 'fresh' },
            content: `# ${file.name}\n\nIngested academic content vectorized into ${activeSubject || 'Organic Chemistry II'} vault.`
          });
        }
        setUploadProgress(null);
      }, 500);
    }, 900);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => fileInputRef.current?.click()}
      className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${
        isDragging
          ? 'border-[#9e3c26] bg-[#9e3c26]/5'
          : 'border-[rgb(var(--color-border))] hover:border-[#9e3c26]/50 bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] shadow-xs'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        accept=".pdf,.png,.docx,.doc,.txt"
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-2xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center">
          <UploadCloud size={20} />
        </div>

        <div>
          <h4 className="font-semibold text-xs sm:text-sm text-[rgb(var(--color-text))]">
            Drop files here to ingest
          </h4>
          <p className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-0.5">
            Accepts PDF, PNG, DOCX, LaTeX, Markdown
          </p>
        </div>

        {uploadProgress ? (
          <div className="w-full max-w-xs mt-2">
            <div className="flex justify-between text-[10px] font-mono text-[rgb(var(--color-muted))] mb-1">
              <span className="truncate max-w-[180px]">{uploadProgress.name}</span>
              <span>Vectorizing {uploadProgress.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[rgb(var(--color-container-highest))] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9e3c26] dark:bg-[#e26f54] transition-all duration-300"
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] text-[10px] font-mono font-bold mt-1 border border-[rgb(var(--color-secondary))]/20">
            <Sparkles size={11} />
            <span>Auto-OCR & Vector Indexing Active</span>
          </div>
        )}
      </div>
    </div>
  );
}
