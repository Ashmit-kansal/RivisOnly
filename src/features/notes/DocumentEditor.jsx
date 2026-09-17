import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, 
  AlignCenter, AlignRight, AlignJustify, List, ListOrdered, 
  CheckSquare, Sparkles, Save, CheckCircle, Printer, 
  Download, Copy, Check, RotateCcw, RotateCw, RemoveFormatting, 
  Highlighter, Palette, BookOpen, Edit3, Type, Divide, 
  HelpCircle, Quote, Plus
} from 'lucide-react';

export default function DocumentEditor({ 
  activeFile, 
  activeSubject, 
  activeFolder, 
  onSave, 
  initialMode = 'edit' 
}) {
  const editorRef = useRef(null);
  const [docTitle, setDocTitle] = useState(activeFile?.name?.replace(/\.[^/.]+$/, '') || 'Document');
  const [isSaved, setIsSaved] = useState(true);
  const [mode, setMode] = useState(initialMode); // 'edit' | 'read'
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [currentBlock, setCurrentBlock] = useState('p');

  // Convert raw markdown or clean HTML to HTML for contentEditable
  const parseInitialContent = (rawContent) => {
    if (!rawContent) return '<p>Start typing your lecture notes, study findings, or research dossier here...</p>';
    
    // If it already looks like HTML
    if (rawContent.includes('<') && rawContent.includes('>')) {
      return rawContent;
    }

    // If it was stored as markdown/plain text, convert smoothly without showing markdown symbols
    return rawContent
      .split('\n\n')
      .map(block => {
        const trimmed = block.trim();
        if (trimmed.startsWith('# ')) {
          return `<h2>${trimmed.replace('# ', '')}</h2>`;
        }
        if (trimmed.startsWith('## ')) {
          return `<h3>${trimmed.replace('## ', '')}</h3>`;
        }
        if (trimmed.startsWith('### ')) {
          return `<h4>${trimmed.replace('### ', '')}</h4>`;
        }
        if (trimmed.startsWith('> ')) {
          return `<blockquote style="border-left: 3px solid #9e3c26; padding-left: 12px; margin: 12px 0; color: #78716c; font-style: italic;">${trimmed.replace(/^> /gm, '')}</blockquote>`;
        }
        if (trimmed.startsWith('$$')) {
          return `<div style="background: rgba(158, 60, 38, 0.08); padding: 10px 14px; border-radius: 8px; font-family: monospace; font-weight: bold; margin: 12px 0; text-align: center;">${trimmed.replace(/\$\$/g, '')}</div>`;
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').map(l => `<li>${l.replace(/^[-*]\s+/, '')}</li>`).join('');
          return `<ul>${items}</ul>`;
        }
        if (/^\d+\./.test(trimmed)) {
          const items = trimmed.split('\n').map(l => `<li>${l.replace(/^\d+\.\s+/, '')}</li>`).join('');
          return `<ol>${items}</ol>`;
        }
        return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
      })
      .join('');
  };

  // Sync content when activeFile changes
  useEffect(() => {
    if (activeFile) {
      setDocTitle(activeFile.name?.replace(/\.[^/.]+$/, '') || 'Document');
      if (editorRef.current) {
        editorRef.current.innerHTML = parseInitialContent(activeFile.content);
        updateCounts();
      }
      setIsSaved(true);
    }
  }, [activeFile?.id]);

  const updateCounts = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
  };

  const handleInput = () => {
    setIsSaved(false);
    updateCounts();
  };

  const executeCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    setIsSaved(false);
    updateCounts();
  };

  const handleBlockChange = (tag) => {
    setCurrentBlock(tag);
    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'p') {
      executeCommand('formatBlock', `<${tag}>`);
    } else if (tag === 'blockquote') {
      executeCommand('formatBlock', '<blockquote>');
    }
  };

  const handleInsertCallout = () => {
    const calloutHtml = `
      <div style="background: rgba(158, 60, 38, 0.08); border-left: 4px solid #9e3c26; padding: 12px 16px; border-radius: 8px; margin: 16px 0; font-family: inherit;">
        <strong style="color: #9e3c26; font-size: 13px; text-transform: uppercase; display: block; margin-bottom: 4px;">Important Takeaway:</strong>
        <span>Type core synthesized principle, test edge-case, or high-yield exam takeaway here...</span>
      </div><p></p>
    `;
    executeCommand('insertHTML', calloutHtml);
  };

  const handleInsertFormula = () => {
    const formulaHtml = `
      <div style="background: rgba(20, 27, 43, 0.04); border: 1px solid rgba(20, 27, 43, 0.12); padding: 12px 18px; border-radius: 12px; margin: 16px 0; text-align: center; font-family: monospace; font-weight: bold; font-size: 15px;">
        Rate = k [Reactant A]² [Reactant B]
      </div><p></p>
    `;
    executeCommand('insertHTML', formulaHtml);
  };

  const handleInsertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
        <thead>
          <tr style="background: rgba(158, 60, 38, 0.1); border-bottom: 2px solid #9e3c26;">
            <th style="padding: 8px 12px; text-align: left;">Parameter / Variable</th>
            <th style="padding: 8px 12px; text-align: left;">Standard Condition</th>
            <th style="padding: 8px 12px; text-align: left;">Observed Yield</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(20, 27, 43, 0.1);">
            <td style="padding: 8px 12px;">ortho-Substituted</td>
            <td style="padding: 8px 12px;">Polar Aprotic (DMF)</td>
            <td style="padding: 8px 12px; font-weight: bold; color: #16a34a;">94.2%</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(20, 27, 43, 0.1);">
            <td style="padding: 8px 12px;">para-Substituted</td>
            <td style="padding: 8px 12px;">Polar Protic (MeOH)</td>
            <td style="padding: 8px 12px; font-weight: bold; color: #16a34a;">88.5%</td>
          </tr>
        </tbody>
      </table><p></p>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  const handleSave = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      if (onSave) {
        onSave(htmlContent);
      }
      setIsSaved(true);
    }
  };

  const handleCopy = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    if (editorRef.current) {
      const text = `${docTitle}\n${'='.repeat(docTitle.length)}\n\n${editorRef.current.innerText}`;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docTitle.replace(/\s+/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-2xl shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col h-full overflow-hidden">
      
      {/* Top Document Header & Meta Bar */}
      <div className="p-4 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Inline Editable Document Title */}
            <input
              type="text"
              value={docTitle}
              onChange={(e) => { setDocTitle(e.target.value); setIsSaved(false); }}
              placeholder="Untitled Document..."
              className="font-bold text-base sm:text-lg text-[rgb(var(--color-text))] bg-transparent border-b border-transparent hover:border-[rgb(var(--color-border))] focus:border-[#9e3c26] focus:outline-none transition-colors px-1 py-0.5 rounded max-w-md truncate"
            />
            
            {/* Auto-Save Pill */}
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 shrink-0 ${
              isSaved 
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
            }`}>
              <CheckCircle size={10} />
              <span>{isSaved ? 'Saved to Vault' : 'Unsaved Changes'}</span>
            </span>
          </div>

          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1 flex items-center gap-2 truncate">
            <span>Vault</span>
            <span>/</span>
            <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-semibold">{activeSubject || 'Organic Chemistry II'}</span>
            <span>/</span>
            <span>{activeFolder || 'Reaction Mechanisms'}</span>
            <span>•</span>
            <span>{wordCount} words</span>
            <span>•</span>
            <span>~{readingTimeMin} min read</span>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Reader / Edit Mode Switcher */}
          <button
            onClick={() => setMode(m => m === 'edit' ? 'read' : 'edit')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'read'
                ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400 shadow-xs'
                : 'bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border-[rgb(var(--color-border))] text-[rgb(var(--color-text))]'
            }`}
            title="Toggle Reader Mode"
          >
            {mode === 'read' ? <Edit3 size={13} /> : <BookOpen size={13} />}
            <span>{mode === 'read' ? 'Switch to Editor' : 'Distraction-Free Read'}</span>
          </button>

          {/* Copy note */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title="Copy Document Text"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>

          {/* Print / Export */}
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title="Print or Export to PDF"
          >
            <Printer size={13} />
          </button>

          {/* Download Text */}
          <button
            onClick={handleDownloadTxt}
            className="p-2 rounded-xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title="Download as .txt"
          >
            <Download size={13} />
          </button>

          {/* Save Document */}
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-[#9e3c26]/25 transition-all cursor-pointer"
          >
            <Save size={13} />
            <span>Save Note</span>
          </button>
        </div>
      </div>

      {/* Normal Document Formatting Toolbar (Word / Google Docs style, NO Markdown) */}
      {mode === 'edit' && (
        <div className="px-4 py-2 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] flex flex-wrap items-center gap-1.5 text-xs">
          
          {/* Paragraph Style Dropdown */}
          <select
            value={currentBlock}
            onChange={(e) => handleBlockChange(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26] cursor-pointer"
            title="Text Style"
          >
            <option value="p">Normal Text</option>
            <option value="h1">Title (Heading 1)</option>
            <option value="h2">Section (Heading 2)</option>
            <option value="h3">Subsection (Heading 3)</option>
            <option value="blockquote">Blockquote</option>
          </select>

          <div className="h-4 w-px bg-[rgb(var(--color-border))] mx-1" />

          {/* Inline formatting buttons */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => executeCommand('bold')}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Bold (Ctrl+B)"
            >
              <Bold size={14} />
            </button>
            <button
              onClick={() => executeCommand('italic')}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Italic (Ctrl+I)"
            >
              <Italic size={14} />
            </button>
            <button
              onClick={() => executeCommand('underline')}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Underline (Ctrl+U)"
            >
              <Underline size={14} />
            </button>
            <button
              onClick={() => executeCommand('strikeThrough')}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Strikethrough"
            >
              <Strikethrough size={14} />
            </button>
          </div>

          <div className="h-4 w-px bg-[rgb(var(--color-border))] mx-1" />

          {/* Text Color Presets */}
          <div className="relative">
            <button
              onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] flex items-center gap-1 transition-colors cursor-pointer"
              title="Text Color"
            >
              <Palette size={14} />
            </button>
            {showColorPicker && (
              <div className="absolute left-0 top-full mt-1 p-2 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-xl shadow-lg flex gap-1 z-30">
                {['inherit', '#9e3c26', '#0ea5e9', '#16a34a', '#d97706', '#8b5cf6'].map(col => (
                  <button
                    key={col}
                    onClick={() => {
                      executeCommand('foreColor', col === 'inherit' ? 'currentColor' : col);
                      setShowColorPicker(false);
                    }}
                    className="w-5 h-5 rounded-full border border-black/20 transition-transform hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: col === 'inherit' ? '#6b7280' : col }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Highlighter Presets */}
          <div className="relative">
            <button
              onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] flex items-center gap-1 transition-colors cursor-pointer"
              title="Highlight Text"
            >
              <Highlighter size={14} />
            </button>
            {showHighlightPicker && (
              <div className="absolute left-0 top-full mt-1 p-2 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-xl shadow-lg flex gap-1 z-30">
                {['transparent', '#fef08a', '#bbf7d0', '#bae6fd', '#fbcfe8', '#fed7aa'].map(bg => (
                  <button
                    key={bg}
                    onClick={() => {
                      executeCommand('hiliteColor', bg);
                      setShowHighlightPicker(false);
                    }}
                    className="w-5 h-5 rounded border border-black/20 transition-transform hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: bg === 'transparent' ? '#ffffff' : bg }}
                    title={bg === 'transparent' ? 'Clear Highlight' : bg}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-[rgb(var(--color-border))] mx-1" />

          {/* Alignment buttons */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => executeCommand('justifyLeft')}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Align Left"
            >
              <AlignLeft size={14} />
            </button>
            <button
              onClick={() => executeCommand('justifyCenter')}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Align Center"
            >
              <AlignCenter size={14} />
            </button>
            <button
              onClick={() => executeCommand('justifyRight')}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Align Right"
            >
              <AlignRight size={14} />
            </button>
          </div>

          <div className="h-4 w-px bg-[rgb(var(--color-border))] mx-1" />

          {/* List buttons */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => executeCommand('insertUnorderedList')}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Bulleted List"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => executeCommand('insertOrderedList')}
              className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Numbered List"
            >
              <ListOrdered size={14} />
            </button>
          </div>

          <div className="h-4 w-px bg-[rgb(var(--color-border))] mx-1" />

          {/* Insert Rich Blocks */}
          <button
            onClick={handleInsertCallout}
            className="px-2 py-1 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Insert Highlight Callout Box"
          >
            <Sparkles size={12} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>Callout</span>
          </button>

          <button
            onClick={handleInsertFormula}
            className="px-2 py-1 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] text-xs font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Insert Math Equation Block"
          >
            <span>fx Equation</span>
          </button>

          <button
            onClick={handleInsertTable}
            className="px-2 py-1 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title="Insert Comparison Table"
          >
            <span>Table</span>
          </button>

          <div className="h-4 w-px bg-[rgb(var(--color-border))] mx-1" />

          {/* Undo / Redo / Clear formatting */}
          <button
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title="Redo"
          >
            <RotateCw size={13} />
          </button>
          <button
            onClick={() => executeCommand('removeFormat')}
            className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title="Clear Formatting"
          >
            <RemoveFormatting size={13} />
          </button>

        </div>
      )}

      {/* Main Document Paper Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[rgb(var(--color-container-low))]/50 flex justify-center">
        
        {/* Document Sheet (Styled like Google Docs / Word page canvas) */}
        <div className="w-full max-w-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-2xl shadow-md p-8 sm:p-12 min-h-[580px] flex flex-col justify-between">
          
          <div>
            {/* Header Subject Info */}
            <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-3 mb-6 text-xs font-mono text-[rgb(var(--color-muted))]">
              <span className="font-semibold text-[#9e3c26] dark:text-[#ffb4a3] uppercase tracking-wider">
                {activeSubject} • {activeFolder}
              </span>
              <span>RivisOnly Knowledge Dossier</span>
            </div>

            {/* Document Title Display in Reader mode */}
            {mode === 'read' && (
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--color-text))] mb-6 pb-2 border-b border-[rgb(var(--color-border))]">
                {docTitle}
              </h1>
            )}

            {/* WYSIWYG Editable Document Body (contentEditable) */}
            <div
              ref={editorRef}
              contentEditable={mode === 'edit'}
              onInput={handleInput}
              suppressContentEditableWarning={true}
              className={`prose prose-sm sm:prose-base max-w-none text-[rgb(var(--color-text))] focus:outline-none leading-relaxed space-y-4 ${
                mode === 'edit' 
                  ? 'cursor-text min-h-[360px] selection:bg-[#9e3c26]/20' 
                  : 'cursor-default min-h-[360px]'
              }`}
              style={{
                fontFamily: 'inherit',
                lineHeight: '1.75'
              }}
            />
          </div>

          {/* Document Sheet Bottom Info */}
          <div className="pt-6 border-t border-[rgb(var(--color-border))] mt-8 flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))]">
            <span>{docTitle} • Formatted Academic Document</span>
            <span>{wordCount} words</span>
          </div>

        </div>

      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-2 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] flex items-center justify-between text-[10px] font-mono text-[rgb(var(--color-muted))]">
        <div className="flex items-center gap-3">
          <span>Mode: {mode === 'edit' ? 'Rich Document Editor (WYSIWYG)' : 'Distraction-Free Reader'}</span>
          <span>•</span>
          <span>Words: {wordCount}</span>
          <span>•</span>
          <span>Characters: {charCount}</span>
          <span>•</span>
          <span>Est. Reading Time: ~{readingTimeMin} min</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[rgb(var(--color-secondary))] font-medium">Standard Word/Doc Format</span>
        </div>
      </div>

    </div>
  );
}
