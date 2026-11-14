import React, { useState, useEffect, useMemo } from 'react';
import {
  getDrivePreviewUrl,
  getFileTypeDetails,
  formatFileSize,
  fetchDriveFileBlob,
  fetchDriveFileFullContent,
  GOOGLE_MIME_TYPES
} from '../../services/googleDriveService';
import { getForgedDeck, saveForgedDeck } from '../../services/questionBankService';
import {
  FileText, ExternalLink, Sparkles, Brain, Clock,
  Maximize2, Minimize2, Eye, ShieldCheck, Download,
  RefreshCw, Loader2, Network, BookOpen, Layers,
  CheckCircle2, ChevronRight, Copy, Check, X
} from 'lucide-react';
import InteractiveMindmap from '../../components/mindmap/InteractiveMindmap';

/**
 * Intelligent client-side parser to extract structured topics, definitions,
 * main points, real-world examples, and mindmap branches from any markdown summary dossier.
 */
function parseDossierFromMarkdown(markdownText, defaultTitle = 'Academic Note') {
  if (!markdownText || typeof markdownText !== 'string') {
    return { summary: [], mindmap: null };
  }

  const root = defaultTitle
    .replace(/^Summary\s*-\s*/i, '')
    .replace(/\.[^/.]+$/, '')
    .trim();

  const summary = [];
  const treeBranches = [];

  // 1. Parse directory tree lines (├── 📂 Branch / ├── 📄 Leaf)
  const lines = markdownText.split('\n');
  let currentTreeBranch = null;

  for (const line of lines) {
    const folderMatch = line.match(/[├└]──\s*📂\s*(.*?)$/);
    if (folderMatch) {
      if (currentTreeBranch) treeBranches.push(currentTreeBranch);
      currentTreeBranch = {
        name: folderMatch[1].trim(),
        children: []
      };
      continue;
    }

    const fileMatch = line.match(/[├└]──\s*📄\s*(.*?)$/);
    if (fileMatch && currentTreeBranch) {
      currentTreeBranch.children.push(fileMatch[1].trim());
    }
  }
  if (currentTreeBranch) treeBranches.push(currentTreeBranch);

  // 2. Parse Mermaid syntax if directory tree was not present
  if (treeBranches.length === 0) {
    const mermaidMatch = markdownText.match(/```mermaid[\s\S]*?graph\s+TD([\s\S]*?)```/i) ||
                         markdownText.match(/graph\s+TD([\s\S]*?)(?:##|📌|$)/i);
    if (mermaidMatch) {
      const graphBody = mermaidMatch[1];
      const branchMap = {};
      const branchOrder = [];

      const bMatches = graphBody.matchAll(/B(\d+)\["([^"]+)"\]/g);
      for (const m of bMatches) {
        const id = m[1];
        const name = m[2];
        if (!branchMap[id]) {
          branchMap[id] = { name, children: [] };
          branchOrder.push(id);
        }
      }

      const cMatches = graphBody.matchAll(/B(\d+)_\d+\["([^"]+)"\]/g);
      for (const m of cMatches) {
        const pId = m[1];
        const childText = m[2];
        if (branchMap[pId]) {
          branchMap[pId].children.push(childText);
        }
      }

      branchOrder.forEach(id => {
        if (branchMap[id]) treeBranches.push(branchMap[id]);
      });
    }
  }

  // 3. Parse Topics / Modules
  const topicBlocks = markdownText.split(/(?:###\s*(?:📘\s*)?|##\s*\d+\.\s+|###\s*\*\*?\d+\.?\s*)/g);
  for (const block of topicBlocks) {
    const trimmed = block.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('---')) continue;

    const blockLines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
    if (blockLines.length === 0) continue;

    const rawTitle = blockLines[0].replace(/^[#*📘\d\.\s]+/, '').replace(/[*_]/g, '').trim();
    if (!rawTitle || 
        rawTitle.toLowerCase().includes('concept mindmap') || 
        rawTitle.toLowerCase().includes('knowledge architecture') ||
        rawTitle.toLowerCase().includes('visual concept') ||
        rawTitle.toLowerCase().includes('high-yield topics') ||
        rawTitle.toLowerCase().includes('key concepts & exam')) {
      continue;
    }

    let definition = '';
    const mainPoints = [];
    let example = '';
    let formula = null;
    let examTip = null;
    let inExampleBlock = false;

    for (let i = 1; i < blockLines.length; i++) {
      const l = blockLines[i];
      if (l.match(/^###?\s*\*\*?Example/i) || l.match(/^\*\*Example:?\*\*/i) || l.includes('💡 Real-World Example') || l.includes('💡 Example')) {
        inExampleBlock = true;
        continue;
      }
      if (l.match(/^###?\s*\*\*?(Main Points|Exam-Ready Points)/i) || l.startsWith('> 📐') || l.startsWith('> 🎯') || l.startsWith('> 💡 Exam')) {
        inExampleBlock = false;
      }

      if (l.startsWith('- ') || l.startsWith('* ')) {
        const bulletText = l.replace(/^[-*]\s*/, '').trim();
        if (inExampleBlock) {
          if (!example) example = bulletText;
          else example += ' ' + bulletText;
        } else {
          mainPoints.push(bulletText);
        }
      } else if (l.includes('Formula') || l.includes('Standard') || l.includes('📐')) {
        formula = l.replace(/^>*\s*[📐\s*]*Formula\s*\/?\s*Rule\s*:*|\*\*Formula[^*]*\*\*:*/i, '').replace(/[`*]/g, '').trim();
      } else if (l.includes('Exam Tip') || l.includes('🎯') || l.includes('💡')) {
        examTip = l.replace(/^>*\s*[🎯💡\s*]*Exam\s*Tip\s*:*|\*\*Exam[^*]*\*\*:*/i, '').replace(/[`*]/g, '').trim();
      } else if (inExampleBlock) {
        const clean = l.replace(/^>\s*/, '').trim();
        if (!example) example = clean;
        else if (example.length < 350) example += ' ' + clean;
      } else if (!l.startsWith('>') && !l.startsWith('**Key') && !l.startsWith('**Main') && !l.startsWith('**Exam Definition')) {
        const clean = l.replace(/^>\s*/, '').trim();
        if (!definition) definition = clean;
        else if (definition.length < 280) definition += ' ' + clean;
      }
    }

    if (definition || mainPoints.length > 0) {
      summary.push({
        title: rawTitle,
        definition: definition || 'Core conceptual definition.',
        content: definition || 'Core conceptual definition.',
        mainPoints: mainPoints.length > 0 ? mainPoints : ['Foundational Principle', 'Key Examination Rule'],
        keyPoints: mainPoints,
        example: example || null,
        formula,
        examTip
      });
    }
  }

  // 4. Synthesize mindmap branches from summary if tree was empty
  let finalMindmap = null;
  if (treeBranches.length > 0) {
    finalMindmap = { root, branches: treeBranches };
  } else if (summary.length > 0) {
    finalMindmap = {
      root,
      branches: summary.map((s, idx) => ({
        name: `${idx + 1}. ${s.title.slice(0, 40)}`,
        children: (s.mainPoints && s.mainPoints.length > 0 ? s.mainPoints : (s.keyPoints || []))
          .map(kp => kp.replace(/^[•\-\*\d\.\s]+/, '').slice(0, 48)).slice(0, 4)
      }))
    };
  }

  return { summary, mindmap: finalMindmap };
}

export default function GoogleDriveViewer({
  file,
  token,
  onGenerateKeyPoints,
  onGenerateQuiz,
  onLaunchGauntlet,
  onTriggerForge,
  onToast,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard shortcut (Escape) & body scroll lock to escape Fullscreen mode
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isFullscreen]);

  // For forged PDFs: toggle between 'pdf' and 'mindmap'
  const [pdfViewMode, setPdfViewMode] = useState('pdf');

  // Markdown viewer state
  const [markdownText, setMarkdownText] = useState('');
  const [markdownLoading, setMarkdownLoading] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  // Image detection & state
  const isImageFile = Boolean(
    file?.mimeType?.startsWith('image/') || 
    /\.(png|jpe?g|gif|webp|svg)$/i.test(file?.name || '')
  );
  const [imageBlobUrl, setImageBlobUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);

  // PDF detection & state
  const isPdfFile = Boolean(
    file?.mimeType === 'application/pdf' || 
    /\.pdf$/i.test(file?.name || '')
  );
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Markdown / Summary note detection
  const isMarkdownFile = Boolean(
    file?.name?.endsWith('.md') || 
    file?.name?.startsWith('Summary - ') || 
    file?.mimeType?.includes('markdown') ||
    file?.mimeType === 'text/plain'
  );

  // Download state
  const [isDownloading, setIsDownloading] = useState(false);

  // Reset zoom & view on file change
  useEffect(() => {
    if (!file) return;
    setImageZoom(1);
    setPdfViewMode('pdf');
  }, [file?.id]);

  // Load markdown text if viewing a markdown or summary note
  useEffect(() => {
    if (!file || !token || !isMarkdownFile) return;

    let active = true;
    async function loadMarkdown() {
      setMarkdownLoading(true);
      try {
        const { text } = await fetchDriveFileFullContent(token, file);
        if (active && text) {
          setMarkdownText(text);
        }
      } catch (err) {
        console.warn('Could not load markdown text:', err);
      } finally {
        if (active) setMarkdownLoading(false);
      }
    }

    loadMarkdown();
    return () => { active = false; };
  }, [file?.id, token, isMarkdownFile]);

  // Load PDF blob directly from Drive for zero CSP errors
  useEffect(() => {
    if (!file || !token || !isPdfFile) return;

    let active = true;
    async function loadPdf() {
      setPdfLoading(true);
      try {
        const blob = await fetchDriveFileBlob(token, file.id);
        if (active && blob) {
          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          const url = URL.createObjectURL(pdfBlob);
          setPdfBlobUrl(url);
        }
      } catch (err) {
        console.warn('Could not load PDF blob, fallback to Drive preview:', err);
      } finally {
        if (active) setPdfLoading(false);
      }
    }

    loadPdf();
    return () => {
      active = false;
      if (pdfBlobUrl && pdfBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [file?.id, token, isPdfFile]);

  // Load image blob if viewing an image
  useEffect(() => {
    if (!file || !token || !isImageFile) return;

    let active = true;
    async function loadImage() {
      setImageLoading(true);
      try {
        const blob = await fetchDriveFileBlob(token, file.id);
        if (active && blob) {
          const url = URL.createObjectURL(blob);
          setImageBlobUrl(url);
        }
      } catch (err) {
        console.warn('Could not load image blob, fallback to thumbnailLink', err);
        if (active && file.thumbnailLink) {
          setImageBlobUrl(file.thumbnailLink.replace(/=s\d+/, '=s1600'));
        }
      } finally {
        if (active) setImageLoading(false);
      }
    }

    loadImage();
    return () => {
      active = false;
      if (imageBlobUrl && imageBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageBlobUrl);
      }
    };
  }, [file?.id, token, isImageFile]);

  // Download handler
  const handleDownload = async () => {
    if (!file) return;
    setIsDownloading(true);
    try {
      if (token) {
        const blob = await fetchDriveFileBlob(token, file.id);
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          if (onToast) onToast(`Downloaded "${file.name}"!`, 'success');
          return;
        }
      }
      if (file.webContentLink) {
        window.open(file.webContentLink, '_blank');
      } else if (file.webViewLink) {
        window.open(file.webViewLink, '_blank');
      }
    } catch (err) {
      console.error('Download failed:', err);
      if (file.webViewLink) window.open(file.webViewLink, '_blank');
      if (onToast) onToast('Opened download via Google Drive.', 'info');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyRaw = () => {
    if (!markdownText) return;
    navigator.clipboard.writeText(markdownText);
    setCopiedRaw(true);
    if (onToast) onToast('Copied full markdown notes to clipboard!', 'success');
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const forgedDeck = file ? getForgedDeck(file.id, file.name) : null;

  // Derive effective Summary & Mindmap from ALL possible sources (Hooks must run unconditionally)
  const { effectiveSummary, effectiveMindmap } = useMemo(() => {
    if (!file) return { effectiveSummary: [], effectiveMindmap: null };

    const rootName = (file.name || 'Academic Note')
      .replace(/^Summary\s*-\s*/i, '')
      .replace(/\.[^/.]+$/, '')
      .trim();

    // 1. Direct match from forgedDeck
    let summary = Array.isArray(forgedDeck?.summary) && forgedDeck.summary.length > 0
      ? forgedDeck.summary
      : [];
    let mindmap = forgedDeck?.mindmap && Array.isArray(forgedDeck.mindmap.branches) && forgedDeck.mindmap.branches.length > 0
      ? forgedDeck.mindmap
      : null;

    // 2. Synthesize mindmap from summary if mindmap was missing
    if (!mindmap && summary.length > 0) {
      mindmap = {
        root: rootName,
        branches: summary.map((s, idx) => {
          let children = [];
          if (Array.isArray(s.mainPoints) && s.mainPoints.length > 0) {
            children = s.mainPoints.map(kp => kp.replace(/^[•\-\*\d\.\s]+/, '').slice(0, 48)).slice(0, 4);
          } else if (Array.isArray(s.keyPoints) && s.keyPoints.length > 0) {
            children = s.keyPoints.map(kp => kp.replace(/^[•\-\*\d\.\s]+/, '').slice(0, 48)).slice(0, 4);
          } else if (s.definition || s.content) {
            children = (s.definition || s.content)
              .split(/[.;]/)
              .map(t => t.trim())
              .filter(t => t.length > 6 && t.length < 52)
              .slice(0, 3);
          }
          if (children.length === 0) {
            children = ['Core Foundations', 'Standard Framework', 'Exam Takeaways'];
          }
          return {
            name: `${idx + 1}. ${s.title.replace(/^\d+[\.\s]*/, '').slice(0, 40)}`,
            children
          };
        })
      };
    }

    // 3. Fallback: Parse from markdownText if available
    if ((!summary.length || !mindmap) && markdownText) {
      const parsed = parseDossierFromMarkdown(markdownText, file.name);
      if (!summary.length && parsed.summary?.length > 0) {
        summary = parsed.summary;
      }
      if (!mindmap && parsed.mindmap?.branches?.length > 0) {
        mindmap = parsed.mindmap;
      }
    }

    return { effectiveSummary: summary, effectiveMindmap: mindmap };
  }, [forgedDeck, markdownText, file?.name]);

  // Backfill localStorage with synthesized mindmap if it was missing (Hooks must run unconditionally)
  useEffect(() => {
    if (file && forgedDeck && !forgedDeck.mindmap && effectiveMindmap) {
      saveForgedDeck(forgedDeck.fileId || file.id, {
        ...forgedDeck,
        mindmap: effectiveMindmap
      });
    }
  }, [forgedDeck, effectiveMindmap, file?.id]);

  if (!file) {
    return (
      <div className="rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] p-12 text-center h-[740px] flex flex-col items-center justify-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] flex items-center justify-center shadow-inner">
          <Eye size={28} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
            No Note Selected
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] max-w-sm mx-auto leading-relaxed">
            Choose a Google Doc, PDF, lecture slide, or text note from the explorer to preview, explore interactive mindmaps, and study.
          </p>
        </div>
      </div>
    );
  }

  const previewUrl = getDrivePreviewUrl(file.id, file.mimeType);
  const details = getFileTypeDetails(file.mimeType, file.name);
  const hasDossier = Boolean(effectiveMindmap || effectiveSummary.length > 0);
  const isForged = Boolean(forgedDeck || hasDossier);

  return (
    <>
      {/* Fullscreen Backdrop Blur Overlay */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 transition-opacity animate-fade-in"
          onClick={() => setIsFullscreen(false)}
          title="Click to Exit Fullscreen"
          aria-hidden="true"
        />
      )}

      {/* Floating ESC Exit Pill when in Fullscreen */}
      {isFullscreen && (
        <button
          type="button"
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[60] px-3.5 py-1.5 rounded-full bg-black/90 hover:bg-black text-white text-xs font-mono font-bold flex items-center gap-2 border border-white/20 shadow-2xl backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Exit Fullscreen Preview (or press Escape)"
        >
          <X size={14} className="text-red-400" />
          <span>Exit Full View</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] text-white/90 font-mono">ESC</kbd>
        </button>
      )}

      <div className={`rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs flex flex-col overflow-hidden transition-all ${
        isFullscreen 
          ? 'fixed inset-2 sm:inset-4 md:inset-6 z-50 h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] shadow-2xl ring-1 ring-white/10' 
          : 'h-[740px]'
      }`}>
      
      {/* Viewer Header */}
      <div className="p-3 sm:p-3.5 border-b border-[rgb(var(--color-border))] flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0 bg-[rgb(var(--color-surface))]/40">
        
        {/* Document Info & Status Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2 rounded-xl border shrink-0 ${details.color}`}>
            <FileText size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-[rgb(var(--color-text))] truncate max-w-[280px] sm:max-w-md" title={file.name}>
                {file.name}
              </h2>

              {isForged ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                  <Sparkles size={11} className="text-indigo-500" />
                  <span>Summary & Mindmap Ready</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))]">
                  <span>Raw Drive Note</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-[rgb(var(--color-muted))] mt-0.5">
              <span>{details.label}</span>
              {file.size && (
                <>
                  <span>•</span>
                  <span>{formatFileSize(file.size)}</span>
                </>
              )}
              {file.modifiedTime && (
                <>
                  <span>•</span>
                  <span>Updated {new Date(file.modifiedTime).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          
          {/* Generate Summary & Mindmap (if not forged) */}
          {!isForged && (
            <button
              onClick={() => onTriggerForge && onTriggerForge(file)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-[#9e3c26] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer transition-all"
              title="Generate AI Mindmap & Summary file in this Google Drive folder"
            >
              <Sparkles size={13} className="text-yellow-200 fill-yellow-200 animate-pulse" />
              <span>Generate Summary & Mindmap</span>
            </button>
          )}

          {/* Regenerate Summary button (if already forged) */}
          {isForged && (
            <button
              onClick={() => onTriggerForge && onTriggerForge(file)}
              className="p-1.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] transition-colors cursor-pointer"
              title="Regenerate Mindmap & Summary"
            >
              <RefreshCw size={13} />
            </button>
          )}

          {/* Copy Raw Markdown Notes */}
          {markdownText && (
            <button
              onClick={handleCopyRaw}
              className="px-2.5 py-1.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy notes markdown text to clipboard"
            >
              {copiedRaw ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span className="hidden sm:inline">{copiedRaw ? 'Copied' : 'Copy Notes'}</span>
            </button>
          )}

          {/* Direct Download */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-1.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] transition-colors cursor-pointer"
            title="Download file"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          </button>

          {/* Open in Google Drive External */}
          {file.webViewLink && (
            <a
              href={file.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] transition-colors cursor-pointer inline-flex items-center justify-center"
              title="Open directly in Google Drive"
            >
              <ExternalLink size={14} />
            </a>
          )}

          {/* Fullscreen / Exit Fullscreen Button */}
          {isFullscreen ? (
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 hover:text-red-300 font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Exit Fullscreen Preview (or press Escape)"
            >
              <Minimize2 size={13} />
              <span>Exit Fullscreen</span>
              <kbd className="hidden sm:inline px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-red-300 font-mono border border-red-500/20">ESC</kbd>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] transition-colors cursor-pointer"
              title="Fullscreen Preview"
            >
              <Maximize2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* PDF View Mode Switcher (if PDF has been forged into a summary note) */}
      {isPdfFile && hasDossier && (
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-3.5 py-2 bg-[rgb(var(--color-container-low))]/60 shrink-0">
          <div className="inline-flex items-center p-0.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs font-semibold gap-1">
            <button
              type="button"
              onClick={() => setPdfViewMode('pdf')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                pdfViewMode === 'pdf'
                  ? 'bg-[rgb(var(--color-primary))] text-white font-bold shadow-xs'
                  : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
              }`}
            >
              <FileText size={13} />
              <span>PDF Document</span>
            </button>

            <button
              type="button"
              onClick={() => setPdfViewMode('mindmap')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                pdfViewMode === 'mindmap'
                  ? 'bg-[rgb(var(--color-primary))] text-white font-bold shadow-xs'
                  : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
              }`}
            >
              <Network size={13} />
              <span>AI Mindmap & Summary Notes</span>
            </button>
          </div>

          {forgedDeck?.summaryFileName && (
            <span className="text-[11px] font-mono text-[rgb(var(--color-muted))] hidden sm:inline-block">
              Linked: <strong className="text-[rgb(var(--color-text))]">{forgedDeck.summaryFileName}</strong>
            </span>
          )}
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 w-full bg-[rgb(var(--color-surface))] relative overflow-hidden flex flex-col">
        {isImageFile && imageBlobUrl ? (
          /* Native Image Viewer */
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-black/95 relative items-center justify-center p-4">
            <div className="w-full h-full overflow-auto flex items-center justify-center">
              <img
                src={imageBlobUrl}
                alt={file.name}
                style={{ transform: `scale(${imageZoom})`, transformOrigin: 'center center' }}
                className="max-w-full max-h-full object-contain transition-transform duration-150 rounded-lg shadow-2xl"
              />
            </div>
          </div>
        ) : isPdfFile && pdfViewMode === 'pdf' && pdfBlobUrl ? (
          /* Native PDF Viewer from Blob URL */
          <iframe
            src={`${pdfBlobUrl}#toolbar=1&navpanes=1`}
            title={file.name}
            className="flex-1 w-full h-full border-0 bg-white"
          />
        ) : isPdfFile && pdfViewMode === 'pdf' && pdfLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-[rgb(var(--color-surface))] text-[rgb(var(--color-muted))]">
            <Loader2 size={24} className="animate-spin text-indigo-500" />
            <p className="text-xs font-mono">Loading PDF preview securely from Google Drive...</p>
          </div>
        ) : isMarkdownFile || (isPdfFile && pdfViewMode === 'mindmap') ? (
          /* Unified Single Flow: Mindmap at the Top, then Structured Topics with Definitions & Examples */
          <div className="flex-1 w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-[rgb(var(--color-surface))]">
            
            {/* Header Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-[#9e3c26]/10 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
                  <Brain size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[rgb(var(--color-text))]">
                    {file.name.replace(/^Summary\s*-\s*/i, '').replace(/\.[^/.]+$/, '')} — Concept Notes & Mindmap
                  </h3>
                  <p className="text-[11px] text-[rgb(var(--color-muted))]">
                    Story-based concise definitions • Visual Mindmap • Practical Examples • Exam Preparation
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 text-[10px] font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span>Verified Notes</span>
              </span>
            </div>

            {/* SECTION 1: Concept Mindmap from the Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[rgb(var(--color-text))]">
                  <Network size={14} className="text-indigo-400" />
                  <span>Visual Concept Mindmap</span>
                </div>
                {effectiveMindmap?.branches && (
                  <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                    {effectiveMindmap.branches.length} Thematic Branches
                  </span>
                )}
              </div>

              {effectiveMindmap ? (
                <InteractiveMindmap
                  mindmap={effectiveMindmap}
                  rootTitle={file.name.replace(/^Summary\s*-\s*/i, '').replace(/\.[^/.]+$/, '')}
                />
              ) : markdownLoading ? (
                <div className="p-8 text-center space-y-3 text-[rgb(var(--color-muted))]">
                  <Loader2 size={24} className="animate-spin text-indigo-500 mx-auto" />
                  <p className="text-xs font-mono">Building concept mindmap from Google Drive note...</p>
                </div>
              ) : null}
            </div>

            {/* SECTION 2: Topic Summaries (2-4 Line Definition, Main Points, Examples in Simple Language) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[rgb(var(--color-text))]">
                  <BookOpen size={14} className="text-indigo-400" />
                  <span>High-Yield Topics & Real-World Examples ({effectiveSummary.length} Topics)</span>
                </div>
                <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                  Concise Exam Revision
                </span>
              </div>

              {effectiveSummary.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {effectiveSummary.map((mod, idx) => {
                    const definition = mod.definition || mod.content || '';
                    const mainPoints = (Array.isArray(mod.mainPoints) && mod.mainPoints.length > 0)
                      ? mod.mainPoints
                      : ((Array.isArray(mod.keyPoints) && mod.keyPoints.length > 0) ? mod.keyPoints : []);
                    const example = mod.example || null;
                    const title = (mod.title || `Topic ${idx + 1}`).replace(/^\d+[\.\s]*/, '');

                    return (
                      <div 
                        key={idx} 
                        className="p-4 sm:p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs space-y-3.5 shadow-xs hover:border-indigo-500/30 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Topic Header */}
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <h4 className="font-bold text-[rgb(var(--color-text))] text-xs leading-snug">
                              {title}
                            </h4>
                          </div>

                          {/* 2-4 Line Definition */}
                          {definition && (
                            <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border-l-4 border-indigo-500 text-xs text-[rgb(var(--color-text))] leading-relaxed space-y-1">
                              <span className="font-bold text-indigo-500 text-[10px] block font-mono">
                                📖 Exam Definition:
                              </span>
                              <p className="text-[rgb(var(--color-text))] text-[11px] leading-relaxed">
                                {definition}
                              </p>
                            </div>
                          )}

                          {/* Main Points */}
                          {mainPoints.length > 0 && (
                            <div className="space-y-1 pt-1">
                              <span className="text-[10px] font-bold text-[rgb(var(--color-text))] font-mono flex items-center gap-1.5">
                                <span>📌 Main Points:</span>
                              </span>
                              <div className="space-y-1 pl-1">
                                {mainPoints.map((pt, pIdx) => (
                                  <div key={pIdx} className="text-[11px] text-[rgb(var(--color-muted))] flex items-start gap-2 leading-relaxed">
                                    <span className="text-indigo-400 font-bold shrink-0">•</span>
                                    <span className="text-[rgb(var(--color-text))]">{pt}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Real-World Example in Simple Language */}
                          {example && (
                            <div className="p-3 rounded-xl bg-amber-500/[0.08] dark:bg-amber-500/[0.12] border border-amber-500/25 text-xs space-y-1">
                              <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-300 text-[10px] font-mono">
                                <Sparkles size={11} className="text-amber-500" />
                                <span>💡 Real-World Example (Simple Language):</span>
                              </div>
                              <p className="text-[11px] text-[rgb(var(--color-text))] leading-relaxed italic">
                                "{example}"
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Footer Rules & Exam Pro-Tips */}
                        <div className="space-y-2 pt-2">
                          {mod.formula && (
                            <div className="px-3 py-1.5 rounded-xl bg-[rgb(var(--color-container))] font-mono text-[10px] text-amber-600 dark:text-amber-300 border border-[rgb(var(--color-border))]">
                              📐 <strong>Rule / Standard:</strong> {mod.formula}
                            </div>
                          )}

                          {mod.examTip && (
                            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 text-[10px] leading-relaxed">
                              <span className="font-bold">🎯 Exam Pro-Tip:</span> {mod.examTip}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : markdownLoading ? (
                <div className="p-12 text-center space-y-3 text-[rgb(var(--color-muted))]">
                  <Loader2 size={24} className="animate-spin text-indigo-500 mx-auto" />
                  <p className="text-xs font-mono">Loading concise lecture topics from Google Drive...</p>
                </div>
              ) : markdownText ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs font-mono whitespace-pre-wrap leading-relaxed text-[rgb(var(--color-text))] shadow-inner">
                  {markdownText}
                </div>
              ) : null}
            </div>

          </div>
        ) : (
          /* Official Google Drive Preview Iframe (for Google Docs, Sheets, Presentations) */
          <iframe
            src={previewUrl}
            title={file.name}
            className="flex-1 w-full h-full border-0"
            allow="autoplay"
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-[rgb(var(--color-border))] text-[11px] font-mono text-[rgb(var(--color-muted))] flex items-center justify-between shrink-0 bg-[rgb(var(--color-container-low))]/30">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span>Google Drive Document Preview</span>
        </div>
        <span>{isForged ? 'Summary & Mindmap Synced' : 'Raw Drive Note'}</span>
      </div>

    </div>
    </>
  );
}
