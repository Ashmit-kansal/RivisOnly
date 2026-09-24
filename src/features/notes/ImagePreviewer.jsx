import React, { useState, useEffect } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCw, Download, Maximize2, 
  Minimize2, Image as ImageIcon, Grid, Info, Sparkles, 
  Bookmark, Check, FlipHorizontal, PanelLeftOpen
} from 'lucide-react';

export default function ImagePreviewer({ 
  activeFile, 
  activeSubject, 
  activeFolder,
  showSidebar,
  onToggleSidebar 
}) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [bgMode, setBgMode] = useState('clean'); // 'clean' | 'grid' | 'dark'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(true);

  const isUploadedRealImage = Boolean(activeFile?.fileUrl);

  const handleRotate = () => {
    setRotation(r => (r + 90) % 360);
  };

  const handleFlip = () => {
    setFlipped(f => !f);
  };

  const handleDownload = () => {
    if (activeFile?.fileUrl) {
      const a = document.createElement('a');
      a.href = activeFile.fileUrl;
      a.download = activeFile.name;
      a.click();
    } else {
      // Create SVG download for simulated diagram
      const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="#1e293b"><rect width="800" height="600" fill="#0f172a"/><text x="400" y="300" fill="#ffb4a3" font-size="24" font-family="sans-serif" text-anchor="middle">${activeFile?.name}</text></svg>`;
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeFile?.name || 'diagram.svg';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Keyboard shortcut: Press Escape to collapse fullscreen/expanded view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <div className={`bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-2xl shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col h-full overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
    }`}>
      
      {/* Top Image Controls Bar */}
      <div className="px-4 py-2.5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Format Badge & Name */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-mono font-bold border border-sky-500/20">
            <ImageIcon size={13} />
            <span>IMAGE & SCHEMATIC VIEWER</span>
          </span>

          <span className="text-xs font-mono text-[rgb(var(--color-muted))] hidden sm:inline truncate max-w-[200px]">
            {activeFile?.name}
          </span>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          
          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-xl px-1 py-0.5 text-xs font-mono">
            <button
              onClick={() => setZoomLevel(z => Math.max(40, z - 15))}
              className="p-1 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="px-1.5 text-[11px] text-[rgb(var(--color-muted))] min-w-[42px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(z => Math.min(250, z + 15))}
              className="p-1 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              onClick={() => { setZoomLevel(100); setRotation(0); setFlipped(false); }}
              className="px-1.5 py-0.5 text-[10px] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] rounded cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Rotate & Flip */}
          <button
            onClick={handleRotate}
            className="p-2 rounded-xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title="Rotate 90° Clockwise"
          >
            <RotateCw size={13} />
          </button>

          <button
            onClick={handleFlip}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              flipped 
                ? 'bg-[#9e3c26]/10 border-[#9e3c26]/30 text-[#9e3c26] dark:text-[#ffb4a3]' 
                : 'bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
            }`}
            title="Flip Horizontally"
          >
            <FlipHorizontal size={13} />
          </button>

          {/* Background Canvas Mode */}
          <button
            onClick={() => setBgMode(m => m === 'clean' ? 'grid' : m === 'grid' ? 'dark' : 'clean')}
            className="p-2 rounded-xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title={`Canvas Background: ${bgMode}`}
          >
            <Grid size={13} />
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isBookmarked 
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                : 'bg-[rgb(var(--color-card))] border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]'
            }`}
            title={isBookmarked ? 'Bookmarked for Revision' : 'Add to Bookmarks'}
          >
            <Bookmark size={13} />
          </button>

          {/* Metadata Drawer Toggle */}
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              showMetadata 
                ? 'bg-[#9e3c26]/10 border-[#9e3c26]/30 text-[#9e3c26] dark:text-[#ffb4a3]' 
                : 'bg-[rgb(var(--color-card))] border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]'
            }`}
            title="Toggle File Specs"
          >
            <Info size={13} />
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title="Download Image"
          >
            <Download size={13} />
          </button>

          {/* Fullscreen Expand / Collapse */}
          {isFullscreen ? (
            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs shadow-md shadow-[#9e3c26]/20 transition-all cursor-pointer animate-in fade-in"
              title="Collapse to Previous Position (Esc)"
            >
              <Minimize2 size={13} />
              <span>Collapse</span>
            </button>
          ) : (
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] text-xs font-mono transition-colors cursor-pointer"
              title="Expand to Fullscreen"
            >
              <Maximize2 size={13} />
              <span className="hidden sm:inline">Expand</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Quick-Collapse Badge in Fullscreen Mode */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-3 right-4 z-[60] flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 hover:bg-neutral-900 text-white border border-white/20 text-xs font-semibold shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
          title="Collapse to previous position (Esc)"
        >
          <Minimize2 size={13} className="text-[#ffb4a3]" />
          <span>Collapse View</span>
          <kbd className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-mono text-white/80">Esc</kbd>
        </button>
      )}

      {/* Main Canvas Area */}
      <div className={`flex-1 flex overflow-hidden ${
        bgMode === 'dark' 
          ? 'bg-neutral-950' 
          : bgMode === 'grid' 
            ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] bg-[rgb(var(--color-container-low))]' 
            : 'bg-[rgb(var(--color-container-low))]/50'
      }`}>
        
        {/* Center Display Viewport */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-auto">
          
          <div 
            className="transition-transform duration-200 select-none flex items-center justify-center"
            style={{ 
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg) scaleX(${flipped ? -1 : 1})`,
              transformOrigin: 'center center'
            }}
          >
            {isUploadedRealImage ? (
              /* Render real uploaded image */
              <div className="max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
                <img
                  src={activeFile.fileUrl}
                  alt={activeFile.name}
                  className="max-h-[500px] w-auto object-contain block"
                />
              </div>
            ) : (
              /* Render High-Resolution Chemical / Technical Vector Schematic */
              <div className="w-full max-w-xl p-8 rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-2xl text-center">
                
                {/* SVG Chemical Orbital Schematic */}
                <div className="w-full h-64 flex items-center justify-center relative mb-4">
                  <svg viewBox="0 0 400 240" className="w-full h-full max-h-60">
                    <defs>
                      <linearGradient id="piGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9e3c26" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#e26f54" stopOpacity="0.4" />
                      </linearGradient>
                      <linearGradient id="donorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>

                    {/* Central Benzene Ring (Hexagon) */}
                    <polygon 
                      points="200,45 255,75 255,145 200,175 145,145 145,75" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3.5"
                      className="text-[rgb(var(--color-text))]"
                    />

                    {/* Alternating double bonds */}
                    <line x1="200" y1="55" x2="245" y2="80" stroke="#9e3c26" strokeWidth="2.5" />
                    <line x1="247" y1="140" x2="200" y2="165" stroke="#9e3c26" strokeWidth="2.5" />
                    <line x1="153" y1="140" x2="153" y2="80" stroke="#9e3c26" strokeWidth="2.5" />

                    {/* Delocalized Pi Electron Cloud (Concentric dashed circle) */}
                    <circle cx="200" cy="110" r="32" fill="url(#piGrad)" stroke="#9e3c26" strokeWidth="1.5" strokeDasharray="4 3" />

                    {/* Substituent: Methoxy (-OCH3) Donor */}
                    <line x1="200" y1="45" x2="200" y2="20" stroke="currentColor" strokeWidth="3" className="text-[rgb(var(--color-text))]" />
                    <text x="200" y="14" textAnchor="middle" fill="#0ea5e9" fontSize="13" fontWeight="bold" fontFamily="monospace">
                      :Ö—CH₃ (+M Donor)
                    </text>

                    {/* Ortho Positions */}
                    <circle cx="255" cy="75" r="5" fill="#e26f54" />
                    <text x="280" y="78" fill="#e26f54" fontSize="10" fontFamily="monospace" fontWeight="bold">δ⁻ Ortho</text>

                    <circle cx="145" cy="75" r="5" fill="#e26f54" />
                    <text x="85" y="78" fill="#e26f54" fontSize="10" fontFamily="monospace" fontWeight="bold">δ⁻ Ortho</text>

                    {/* Para Position */}
                    <circle cx="200" cy="175" r="5" fill="#e26f54" />
                    <text x="200" y="200" textAnchor="middle" fill="#e26f54" fontSize="10" fontFamily="monospace" fontWeight="bold">δ⁻ Para</text>

                    {/* Meta Reference */}
                    <text x="275" y="150" fill="currentColor" opacity="0.5" fontSize="9" fontFamily="monospace">Meta</text>
                    <text x="105" y="150" fill="currentColor" opacity="0.5" fontSize="9" fontFamily="monospace">Meta</text>
                  </svg>
                </div>

                <h4 className="font-bold text-base text-[rgb(var(--color-text))] mb-1">
                  {activeFile?.name}
                </h4>
                <p className="text-xs text-[rgb(var(--color-muted))] max-w-md mx-auto leading-relaxed">
                  {activeFile?.content || 'Tactile molecular orbital schema for π-electron density in substituted benzene rings.'}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Right Metadata Drawer (Toggleable) */}
        {showMetadata && (
          <div className="w-64 border-l border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 overflow-y-auto space-y-4 shrink-0 hidden lg:block">
            <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-bold flex items-center justify-between pb-2 border-b border-[rgb(var(--color-border))]">
              <span>Image Diagnostics</span>
              <Info size={12} />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">Filename</div>
                <div className="font-medium text-[rgb(var(--color-text))] truncate mt-0.5">{activeFile?.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))]">
                  <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">Resolution</div>
                  <div className="text-xs font-bold font-mono text-[rgb(var(--color-text))] mt-0.5">2400 × 1600</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))]">
                  <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">File Size</div>
                  <div className="text-xs font-bold font-mono text-[rgb(var(--color-text))] mt-0.5">{activeFile?.size || '1.8 MB'}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] space-y-1.5">
                <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">Color Profile</div>
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">sRGB IEC61966-2.1</div>
                <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">Alpha Channel: Enabled</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#9e3c26]/5 dark:bg-[#e26f54]/10 border border-[#9e3c26]/20 space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-[#9e3c26] dark:text-[#ffb4a3] font-bold">
                  <Sparkles size={11} />
                  <span>OCR Ingestion</span>
                </div>
                <p className="text-[11px] text-[rgb(var(--color-text))] leading-tight">
                  Diagram symbols and functional groups parsed into knowledge graph.
                </p>
              </div>

              <div className="pt-2 border-t border-[rgb(var(--color-border))]">
                <div className="text-[10px] font-mono text-[rgb(var(--color-muted))] mb-1.5">Active Subject Vault</div>
                <span className="px-2 py-1 rounded-lg bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] text-xs font-medium block truncate">
                  {activeSubject}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-2 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] flex items-center justify-between text-[10px] font-mono text-[rgb(var(--color-muted))]">
        <div className="flex items-center gap-3">
          <span>Mode: High-Resolution Graphic Viewer</span>
          <span>•</span>
          <span>Zoom: {zoomLevel}%</span>
          <span>•</span>
          <span>Rotation: {rotation}°</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span>Dimensions: 2400 × 1600 px • 300 DPI</span>
        </div>
      </div>

    </div>
  );
}
