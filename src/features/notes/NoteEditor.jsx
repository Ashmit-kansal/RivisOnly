import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bold, Italic, List, ListOrdered, Sparkles, 
  CheckCircle, Eye, Code, Save, BookOpen, 
  ZoomIn, ZoomOut, Bookmark, 
  Brain, FileText, ImageIcon
} from 'lucide-react';

export default function NoteEditor({ 
  activeFile, 
  activeSubject, 
  activeFolder, 
  onSave,
  onOpenKeyPoints,
  onOpenQuiz,
  forcedViewMode 
}) {
  const navigate = useNavigate();
  const [content, setContent] = useState(activeFile?.content || '');
  const [isSaved, setIsSaved] = useState(true);
  const [viewMode, setViewMode] = useState(forcedViewMode || 'split'); // 'split' | 'edit' | 'preview'
  const [zoomLevel, setZoomLevel] = useState(100);

  // Sync forced view mode if passed from parent
  useEffect(() => {
    if (forcedViewMode) {
      setViewMode(forcedViewMode);
    }
  }, [forcedViewMode]);

  // Sync content when selected file changes
  useEffect(() => {
    if (activeFile?.content) {
      setContent(activeFile.content);
      setIsSaved(true);
    }
  }, [activeFile?.id, activeFile?.content]);

  const handleContentChange = (val) => {
    setContent(val);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    if (onSave) {
      onSave(content);
    }
  };

  const handleInsert = (template) => {
    setContent(prev => prev + '\n' + template);
    setIsSaved(false);
  };

  const handleAIExpand = () => {
    setContent(prev => prev + `\n\n### AI Synthesis Expansion (Ebbinghaus Anchor):\n- Electron withdrawing groups stabilize sigma-complex via resonance delocalization.\n- Leaving group order: F⁻ >> Cl⁻ > Br⁻ > I⁻ due to high electronegativity of fluorine stabilizing the rate-determining transition state.\n- Reaction accelerates substantially in polar aprotic solvents (DMF, DMSO).`);
    setIsSaved(false);
  };

  const handleAISummarize = () => {
    setContent(prev => prev + `\n\n> [!TIP]\n> **Executive 30-Second Summary**:\n> Nucleophilic aromatic substitution (SNAr) proceeds via Meisenheimer addition-elimination. Requires strong ortho/para EWGs.`);
    setIsSaved(false);
  };

  const lines = content.split('\n').length;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characters = content.length;

  const fileType = activeFile?.type || 'doc';

  return (
    <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-2xl shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col h-full overflow-hidden">
      
      {/* Editor Main Header */}
      <div className="p-4 border-b border-[rgb(var(--color-border))] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[rgb(var(--color-container-low))]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-[rgb(var(--color-text))] truncate">
              {activeFile?.name || 'Synthesis_Pathways_Notes.doc'}
            </h3>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 shrink-0 ${
              isSaved 
                ? 'bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))]' 
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
            }`}>
              <CheckCircle size={10} />
              <span>{isSaved ? 'Auto-Saved' : 'Unsaved Changes'}</span>
            </span>
          </div>

          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-0.5 flex items-center gap-1.5 truncate">
            <span>Vault</span>
            <span>/</span>
            <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-semibold">{activeSubject || 'Organic Chemistry II'}</span>
            <span>/</span>
            <span>{activeFolder || 'Reaction Mechanisms'}</span>
            <span>•</span>
            <span>{activeFile?.size || '34 KB'}</span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenKeyPoints && (
            <button
              onClick={onOpenKeyPoints}
              className="px-2.5 py-1.5 rounded-xl bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))] hover:opacity-90 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="View AI High-Yield Key Points for this note"
            >
              <Sparkles size={13} />
              <span className="hidden sm:inline">Key Points</span>
            </button>
          )}

          {onOpenQuiz && (
            <button
              onClick={onOpenQuiz}
              className="px-2.5 py-1.5 rounded-xl bg-[#9e3c26]/10 hover:bg-[#9e3c26]/20 dark:bg-[#e26f54]/15 text-[#9e3c26] dark:text-[#ffb4a3] font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
              title="Take AI proficiency quiz for this note"
            >
              <Brain size={13} />
              <span className="hidden sm:inline">AI Quiz</span>
            </button>
          )}

          <button
            onClick={() => setViewMode(v => v === 'preview' ? 'split' : 'preview')}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400'
                : 'bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border-[rgb(var(--color-border))] text-[rgb(var(--color-text))]'
            }`}
            title="Toggle Focused Manual Reading Mode"
          >
            <BookOpen size={13} />
            <span className="hidden md:inline">{viewMode === 'preview' ? 'Editing Mode' : 'Manual Read'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-[#9e3c26]/25 transition-all cursor-pointer"
          >
            <Save size={13} />
            <span>Save Note</span>
          </button>
        </div>
      </div>

      {/* Conditional View: Diagram / Image Viewer */}
      {fileType === 'png' || fileType === 'jpg' ? (
        <div className="flex-1 flex flex-col min-h-[450px] bg-[rgb(var(--color-container-low))]/50">
          {/* Graphic Controls Toolbar */}
          <div className="px-4 py-2 border-b border-[rgb(var(--color-border))] flex items-center justify-between text-xs bg-[rgb(var(--color-card))]">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-mono text-[rgb(var(--color-muted))]">
                <ImageIcon size={13} className="text-sky-500" />
                Structural Diagram Canvas
              </span>
              <span className="text-[rgb(var(--color-border))]">•</span>
              <span className="font-mono text-[10px] text-[rgb(var(--color-muted))]">Zoom: {zoomLevel}%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel(z => Math.max(50, z - 10))}
                className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))]"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={() => setZoomLevel(z => Math.min(200, z + 10))}
                className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))]"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="px-2 py-0.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[11px] font-mono text-[rgb(var(--color-muted))]"
              >
                Reset
              </button>
              <div className="h-4 w-px bg-[rgb(var(--color-border))] mx-1" />
              <button className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-amber-500">
                <Bookmark size={14} />
              </button>
            </div>
          </div>

          {/* Diagram Display Box */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-auto">
            <div 
              className="w-full max-w-xl p-8 rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-center shadow-lg transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <div className="text-5xl font-mono text-emerald-600 dark:text-emerald-400 mb-3">⬡</div>
              <h4 className="font-bold text-base text-[rgb(var(--color-text))] mb-1">
                {activeFile?.name}
              </h4>
              <p className="text-xs text-[rgb(var(--color-muted))] max-w-md mx-auto leading-relaxed mb-4">
                {activeFile?.content || 'Tactile molecular orbital schema for pi-electron density in substituted benzene rings.'}
              </p>

              <div className="grid grid-cols-3 gap-2 text-left pt-3 border-t border-[rgb(var(--color-border))]">
                <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))]">
                  <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">Resolution</div>
                  <div className="text-xs font-bold font-mono text-[rgb(var(--color-text))] mt-0.5">2400 × 1600 px</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))]">
                  <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">Color Space</div>
                  <div className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">sRGB / Vector</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))]">
                  <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">Vector Layer</div>
                  <div className="text-xs font-bold font-mono text-[rgb(var(--color-secondary))] mt-0.5">Auto-Indexed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : fileType === 'pdf' ? (
        /* PDF Lecture Viewer */
        <div className="flex-1 flex flex-col min-h-[450px] bg-[rgb(var(--color-container-low))]/50">
          <div className="px-4 py-2 border-b border-[rgb(var(--color-border))] flex items-center justify-between text-xs bg-[rgb(var(--color-card))]">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-mono text-[rgb(var(--color-muted))]">
                <FileText size={13} className="text-red-500" />
                Lecture PDF Document Reader
              </span>
              <span className="text-[rgb(var(--color-border))]">•</span>
              <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">Page 1 of 14</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/revision')}
                className="px-2.5 py-1 rounded-lg bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))] font-mono text-[10px] font-bold flex items-center gap-1"
              >
                <Sparkles size={11} />
                <span>Vectorized (14,280 Tokens)</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-4">
            <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-3">
                <span className="text-xs font-mono uppercase text-[#9e3c26] dark:text-[#ffb4a3] font-bold">
                  {activeSubject} • Chapter 8 Lecture
                </span>
                <span className="text-xs font-mono text-[rgb(var(--color-muted))]">{activeFile?.size}</span>
              </div>
              <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
                {activeFile?.name.replace(/\.[^/.]+$/, '')}
              </h2>
              <div className="prose prose-sm text-xs leading-relaxed text-[rgb(var(--color-text))] space-y-3">
                <p>{activeFile?.content}</p>
                <p>
                  Carbon-13 Nuclear Magnetic Resonance spectroscopy measures the resonance frequencies of 13C nuclei in magnetic fields. In proton-decoupled spectra, all carbon-hydrogen scalar J-couplings are eliminated, producing clean single resonances for each chemically non-equivalent carbon.
                </p>
                <div className="p-3.5 rounded-xl bg-[rgb(var(--color-container-low))] font-mono text-center text-xs font-bold text-[#9e3c26] dark:text-[#ffb4a3] border border-[rgb(var(--color-border))]">
                  Chemical Shift Range: delta 0 - 220 ppm (TMS Standard delta = 0 ppm)
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Markdown & Web Doc Split Editor */
        <>
          {/* Rich Formatting Toolbar & Mode Switcher */}
          <div className="px-4 py-2 border-b border-[rgb(var(--color-border))] flex flex-wrap items-center justify-between gap-2 bg-[rgb(var(--color-card))]">
            <div className="flex items-center gap-1">
              <button onClick={() => handleInsert('# Heading 1')} className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] text-xs font-mono font-bold">H1</button>
              <button onClick={() => handleInsert('## Heading 2')} className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] text-xs font-mono font-bold">H2</button>
              <button onClick={() => handleInsert('### Heading 3')} className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] text-xs font-mono font-bold">H3</button>
              
              <div className="h-4 w-px bg-[rgb(var(--color-border))] mx-1" />

              <button onClick={() => handleInsert('**bold text**')} className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]"><Bold size={13} /></button>
              <button onClick={() => handleInsert('*italic text*')} className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]"><Italic size={13} /></button>
              <button onClick={() => handleInsert('- Bullet point')} className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]"><List size={13} /></button>
              <button onClick={() => handleInsert('1. Numbered item')} className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]"><ListOrdered size={13} /></button>

              <div className="h-4 w-px bg-[rgb(var(--color-border))] mx-1" />

              <button onClick={() => handleInsert('> [!IMPORTANT]\n> Key mechanism step summary')} className="px-2 py-1 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] text-xs font-mono">
                Callout
              </button>
              <button onClick={() => handleInsert('$$Rate = k [A]^2$$')} className="px-2 py-1 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] text-xs font-mono">
                Σ LaTeX
              </button>
              <button onClick={handleAISummarize} className="px-2 py-1 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[#9e3c26] dark:text-[#ffb4a3] text-xs font-mono font-semibold flex items-center gap-1">
                <Sparkles size={11} />
                <span>AI Summary</span>
              </button>
              <button onClick={handleAIExpand} className="px-2 py-1 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-tertiary))] text-xs font-mono font-semibold flex items-center gap-1">
                <Brain size={11} />
                <span>AI Expand</span>
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-[11px] font-mono">
              <button
                onClick={() => setViewMode('split')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'split' ? 'bg-[rgb(var(--color-card))] font-bold text-[#9e3c26] dark:text-[#ffb4a3] shadow-xs' : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
                title="Split Source & Live Preview"
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('edit')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'edit' ? 'bg-[rgb(var(--color-card))] font-bold text-[#9e3c26] dark:text-[#ffb4a3] shadow-xs' : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
                title="Markdown Editor Only"
              >
                Editor
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'preview' ? 'bg-[rgb(var(--color-card))] font-bold text-[#9e3c26] dark:text-[#ffb4a3] shadow-xs' : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
                title="Clean Preview Only"
              >
                Preview
              </button>
            </div>
          </div>

          {/* Editor Main Content: Split, Edit Only, or Preview Only */}
          <div className={`flex-1 grid min-h-[400px] overflow-hidden ${
            viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[rgb(var(--color-border))]' : 'grid-cols-1'
          }`}>
            
            {/* Left: Raw Markdown & LaTeX Source */}
            {(viewMode === 'split' || viewMode === 'edit') && (
              <div className="flex flex-col h-full bg-[rgb(var(--color-container-low))]/30 overflow-hidden">
                <div className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] border-b border-[rgb(var(--color-border))] flex items-center justify-between font-semibold">
                  <span>Source [Markdown & LaTeX]</span>
                  <Code size={12} />
                </div>
                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="flex-1 p-4 font-mono text-xs sm:text-sm bg-transparent resize-none focus:outline-none text-[rgb(var(--color-text))] leading-relaxed overflow-y-auto"
                  placeholder="Type your notes here in Markdown or LaTeX..."
                />
              </div>
            )}

            {/* Right: Live Preview & Print Composition */}
            {(viewMode === 'split' || viewMode === 'preview') && (
              <div className="flex flex-col h-full bg-[rgb(var(--color-card))] overflow-y-auto">
                <div className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] border-b border-[rgb(var(--color-border))] flex items-center justify-between font-semibold">
                  <span>Live Rendered Composition</span>
                  <Eye size={12} />
                </div>
                
                <div className="p-6 text-sm max-w-none text-[rgb(var(--color-text))] space-y-4">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-[rgb(var(--color-text))] mb-2">
                      {activeFile?.name.replace(/\.[^/.]+$/, '') || 'Study Note Dossier'}
                    </h1>
                    
                    {/* Rendered note body */}
                    <div className="text-xs text-[rgb(var(--color-muted))] leading-relaxed space-y-3 whitespace-pre-line font-sans">
                      {content.split('\n\n').map((paragraph, pIdx) => {
                        if (paragraph.startsWith('# ')) {
                          return <h1 key={pIdx} className="text-lg font-bold text-[rgb(var(--color-text))] mt-3 mb-1">{paragraph.replace('# ', '')}</h1>;
                        }
                        if (paragraph.startsWith('## ')) {
                          return <h2 key={pIdx} className="text-base font-bold text-[rgb(var(--color-text))] mt-3 mb-1">{paragraph.replace('## ', '')}</h2>;
                        }
                        if (paragraph.startsWith('### ')) {
                          return <h3 key={pIdx} className="text-sm font-semibold text-[#9e3c26] dark:text-[#ffb4a3] mt-2 mb-1">{paragraph.replace('### ', '')}</h3>;
                        }
                        if (paragraph.startsWith('> ')) {
                          return (
                            <div key={pIdx} className="p-3 rounded-xl border-l-4 border-[#9e3c26] bg-[#9e3c26]/5 dark:bg-[#e26f54]/10 my-2 text-xs text-[rgb(var(--color-text))]">
                              {paragraph.replace(/^> \s*/gm, '')}
                            </div>
                          );
                        }
                        if (paragraph.startsWith('$$')) {
                          return (
                            <div key={pIdx} className="my-3 p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-center font-mono text-sm font-bold text-[#9e3c26] dark:text-[#ffb4a3]">
                              {paragraph.replace(/\$\$/g, '')}
                            </div>
                          );
                        }
                        return <p key={pIdx} className="text-[rgb(var(--color-text))]">{paragraph}</p>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </>
      )}

      {/* Footer Info Strip */}
      <div className="px-4 py-2 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] flex items-center justify-between text-[10px] font-mono text-[rgb(var(--color-muted))]">
        <div className="flex items-center gap-3">
          <span>Lines: {lines}</span>
          <span>•</span>
          <span>Words: {words}</span>
          <span>•</span>
          <span>Chars: {characters}</span>
          <span>•</span>
          <span className="text-[rgb(var(--color-secondary))] font-medium">Decay Engine Vectorized</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span>Format: {fileType.toUpperCase()} + MathJax</span>
        </div>
      </div>

    </div>
  );
}
