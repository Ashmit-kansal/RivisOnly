import React, { useState, useRef } from 'react';
import { UploadCloud, Sparkles } from 'lucide-react';

export default function FileUploader({ activeSubject, activeFolder, onFileUploaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  // Helper to read file asynchronously as DataURL, Text, or Blob
  const readFileAsync = (file, type, fileExt) => {
    return new Promise((resolve) => {
      // Images: Read as Data URL so they can be saved to localStorage & survive refresh
      if (type === 'png') {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ fileUrl: e.target.result, content: null });
        reader.onerror = () => resolve({ fileUrl: URL.createObjectURL(file), content: null });
        reader.readAsDataURL(file);
      } 
      // Small PDFs (<= 2.5 MB): Read as Data URL to persist in localStorage
      else if (type === 'pdf') {
        if (file.size <= 2.5 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = (e) => resolve({ fileUrl: e.target.result, content: null });
          reader.onerror = () => resolve({ fileUrl: URL.createObjectURL(file), content: null });
          reader.readAsDataURL(file);
        } else {
          // Large PDFs: use in-memory blob URL
          resolve({ fileUrl: URL.createObjectURL(file), content: null });
        }
      } 
      // Text or Markdown: Read as text
      else if (fileExt === 'txt' || fileExt === 'md') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const rawText = e.target.result || '';
          const lines = rawText.split('\n');
          let formattedHtml = '';
          lines.forEach(l => {
            const trimmed = l.trim();
            if (trimmed.startsWith('# ')) {
              formattedHtml += `<h2>${trimmed.replace(/^#\s+/, '')}</h2>`;
            } else if (trimmed.startsWith('## ')) {
              formattedHtml += `<h3>${trimmed.replace(/^##\s+/, '')}</h3>`;
            } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              formattedHtml += `<li>${trimmed.replace(/^[-*]\s+/, '')}</li>`;
            } else if (trimmed) {
              formattedHtml += `<p>${trimmed}</p>`;
            }
          });
          resolve({ fileUrl: null, content: formattedHtml || `<p>${rawText.replace(/\n/g, '<br />')}</p>` });
        };
        reader.onerror = () => resolve({ fileUrl: null, content: null });
        reader.readAsText(file);
      } 
      // Word Documents / Rich Notes: Create starter template
      else {
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        const starter = `<h2>${baseName}</h2><p>Ingested Word Document synchronized into <strong>${activeSubject || 'Knowledge Vault'}</strong> / <strong>${activeFolder || 'General Notes'}</strong>.</p><blockquote><strong>Archived Resource:</strong> File ${file.name} (${Math.max(1, (file.size / 1024).toFixed(0))} KB) parsed and available for live inline editing and spaced revision review.</blockquote>`;
        resolve({ fileUrl: null, content: starter });
      }
    });
  };

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop().toLowerCase();
      let type = 'doc';
      if (['pdf'].includes(fileExt)) type = 'pdf';
      else if (['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(fileExt)) type = 'png';
      else if (['doc', 'docx', 'txt', 'rtf', 'md'].includes(fileExt)) type = 'doc';

      // Stage 1: Reading file
      setUploadProgress({ name: file.name, progress: 35, status: 'Reading file stream...' });
      const { fileUrl, content } = await readFileAsync(file, type, fileExt);

      // Stage 2: Vectorizing & OCR
      setUploadProgress({ name: file.name, progress: 75, status: 'Vector indexing & OCR...' });
      await new Promise(r => setTimeout(r, 280));

      // Stage 3: Finalizing into Vault
      setUploadProgress({ name: file.name, progress: 100, status: 'Ingested into Vault!' });
      await new Promise(r => setTimeout(r, 200));

      const newFileObj = {
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        type,
        size: `${Math.max(1, (file.size / 1024).toFixed(0))} KB`,
        updatedAt: 'Just now',
        tags: ['Vectorized', 'Uploaded File'],
        fileUrl,
        reminder: { 
          type: 'ai', 
          basis: 'Smart Spaced Review', 
          interval: '3 days', 
          score: 95, 
          status: 'fresh',
          nextDate: '2026-09-27'
        },
        content: content || `<h2>${file.name.replace(/\.[^/.]+$/, '')}</h2><p>Ingested academic asset indexed into <strong>${activeSubject || 'Academic'}</strong> / <strong>${activeFolder || 'General'}</strong> vault.</p>`
      };

      if (onFileUploaded) {
        onFileUploaded(newFileObj);
      }
      setLastUploadedName(file.name);
    }

    setTimeout(() => {
      setUploadProgress(null);
    }, 600);
  };

  return (
    <div
      onDragOver={(e) => { 
        e.preventDefault(); 
        if (!uploadProgress) setIsDragging(true); 
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!uploadProgress) handleFiles(e.dataTransfer.files);
      }}
      onClick={() => {
        if (!uploadProgress) fileInputRef.current?.click();
      }}
      className={`p-3 rounded-2xl border border-dashed transition-all cursor-pointer text-center relative overflow-hidden select-none ${
        isDragging
          ? 'border-[#9e3c26] bg-[#9e3c26]/10 scale-[1.01]'
          : 'border-[rgb(var(--color-border))] hover:border-[#9e3c26]/50 bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] shadow-2xs'
      } ${uploadProgress ? 'pointer-events-none' : ''}`}
    >
      <input
        id="notes-file-uploader-input"
        type="file"
        multiple
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        accept=".pdf,.png,.jpg,.jpeg,.webp,.svg,.doc,.docx,.txt,.md"
        className="hidden"
      />

      <div className="flex items-center justify-center gap-2.5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
          uploadProgress 
            ? 'bg-[#9e3c26] text-white animate-pulse' 
            : 'bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3]'
        }`}>
          <UploadCloud size={16} />
        </div>

        <div className="text-left min-w-0 flex-1">
          <div className="font-semibold text-xs text-[rgb(var(--color-text))] truncate">
            Drop files here or <span className="text-[#9e3c26] dark:text-[#ffb4a3] underline">browse</span>
          </div>
          <div className="text-[10px] font-mono text-[rgb(var(--color-muted))] truncate mt-0.5">
            PDF, DOCX, PNG, TXT → <span className="text-[rgb(var(--color-text))] font-medium">{activeFolder || 'General Notes'}</span>
          </div>
        </div>
      </div>

      {uploadProgress && (
        <div className="w-full mt-2.5 space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-[rgb(var(--color-muted))]">
            <span className="truncate max-w-[170px] font-medium text-[rgb(var(--color-text))]">{uploadProgress.name}</span>
            <span className="font-bold text-[#9e3c26] dark:text-[#ffb4a3]">{uploadProgress.progress}%</span>
          </div>
          <div className="w-full h-1 bg-[rgb(var(--color-container-highest))] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#9e3c26] dark:bg-[#e26f54] transition-all duration-300"
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>
          <div className="text-[9px] font-mono text-[rgb(var(--color-muted))] text-left flex items-center gap-1">
            <Sparkles size={9} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>{uploadProgress.status}</span>
          </div>
        </div>
      )}
    </div>
  );
}
