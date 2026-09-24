import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, 
  Download, Printer, Maximize2, Minimize2, Search, FileText, 
  Sparkles, Layers, BookOpen, ExternalLink, Check, PanelLeftOpen
} from 'lucide-react';

export default function PdfPreviewer({ 
  activeFile, 
  activeSubject, 
  activeFolder,
  showSidebar,
  onToggleSidebar 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const totalPages = 6;
  const isUploadedRealFile = Boolean(activeFile?.fileUrl);

  const pagesData = [
    {
      page: 1,
      title: `${activeFile?.name.replace(/\.[^/.]+$/, '')} — Chapter Overview`,
      subtitle: `${activeSubject || 'Academic Archive'} • Ingested Vectorized Courseware`,
      body: [
        activeFile?.content || 'Primary lecture content vectorized and indexed into your active study vault.',
        'Nuclear Magnetic Resonance (NMR) spectroscopy exploits the magnetic properties of certain atomic nuclei. Carbon-13 NMR (13C-NMR) spectroscopy provides direct structural information regarding the carbon skeleton of organic molecules.',
        'Because the natural abundance of 13C is only 1.1% and its gyromagnetic ratio is roughly one-fourth that of 1H, sensitivity is substantially lower than proton NMR. Modern Fourier Transform (FT-NMR) instruments compensate for this via rapid signal averaging of hundreds to thousands of free induction decays (FIDs).'
      ],
      callout: 'Core Takeaway: Chemical shift range spans 0 - 220 ppm relative to internal tetramethylsilane (TMS = 0 ppm).'
    },
    {
      page: 2,
      title: 'Proton-Decoupled 13C Spectra & DEPT Analysis',
      subtitle: 'Section 8.2 • Multiplicity & Polarization Transfer',
      body: [
        'Broadband proton decoupling eliminates all 13C-1H scalar heteronuclear coupling (1J_CH = 125-250 Hz), collapsing multiplets into clean sharp singlets for each magnetically unique carbon nucleus.',
        'Distortionless Enhancement by Polarization Transfer (DEPT) pulse sequences employ polarization transfer from sensitive 1H nuclei to coupled 13C spins to dramatically enhance signal sensitivity and determine carbon hybridization:',
        '• DEPT-45: Displays all protonated carbons (CH, CH2, CH3) with positive intensity.\n• DEPT-90: Displays exclusively methine carbons (CH) with positive phase.\n• DEPT-135: Displays CH and CH3 carbons pointing upward (+), while methylene (CH2) carbons point downward (-).'
      ],
      callout: 'Quaternary carbons (bearing no attached protons) do not appear in DEPT spectra and are identified by disappearance from broadband decoupled spectra.'
    },
    {
      page: 3,
      title: 'Chemical Shift Correlations & Empirical Additivity',
      subtitle: 'Section 8.3 • Shielding & Electronegativity Trends',
      body: [
        'Carbon chemical shifts are predominantly governed by paramagnetic shielding terms, which reflect local electron density and hybridization state of the nucleus.',
        'Key Diagnostic Zones:\n• sp3 Aliphatic Carbons (C-C): 0 - 50 ppm\n• Carbons bonded to Electronegative Heteroatoms (C-O, C-N, C-X): 50 - 90 ppm\n• sp Alkyne Carbons: 70 - 95 ppm\n• sp2 Aromatic & Alkene Carbons: 100 - 160 ppm\n• Carbonyl Carbons (C=O): 165 - 220 ppm (Esters/Amides 165-175 ppm; Aldehydes/Ketones 190-220 ppm).'
      ],
      callout: 'Solvent Resonances: CDCl3 appears as a characteristic 1:1:1 triplet at 77.16 ppm due to spin-1 deuterium coupling.'
    },
    {
      page: 4,
      title: 'Spin-Lattice Relaxation (T1) & Quantitative 13C',
      subtitle: 'Section 8.4 • Instrumental Parameters',
      body: [
        'Unlike 1H-NMR, signal peak areas in standard 13C broadband decoupled spectra do NOT directly correlate with the number of carbons due to unequal nuclear Overhauser enhancement (NOE) and disparate longitudinal spin-lattice relaxation times (T1).',
        'Quaternary carbons typically have long T1 relaxation values (often 10-100 seconds) because they lack directly bonded protons to mediate efficient dipole-dipole relaxation, leading to partial saturation and diminished peak heights under rapid pulse repetitions.'
      ],
      callout: 'Quantitative 13C requires inverse-gated decoupling with long pulse repetition delays (d1 > 5 × T1) and zero-NOE conditions.'
    },
    {
      page: 5,
      title: 'Two-Dimensional Heteronuclear Correlations (HSQC & HMBC)',
      subtitle: 'Section 8.5 • 2D Structural Elucidation',
      body: [
        'Heteronuclear Single Quantum Coherence (HSQC) correlates the chemical shift of 13C nuclei with directly bonded 1H nuclei via one-bond coupling (1J_CH ~ 140 Hz).',
        'Heteronuclear Multiple Bond Correlation (HMBC) detects longer-range heteronuclear couplings across two (2J_CH) and three (3J_CH) chemical bonds, enabling connectivity across quaternary carbons and heteroatoms.'
      ],
      callout: 'Combining 1D 13C with HSQC and HMBC allows unambiguous de novo structural assignment of complex organic alkaloids.'
    },
    {
      page: 6,
      title: 'Chapter Review Problems & Experimental Yield Summary',
      subtitle: 'Section 8.6 • Self-Assessment & Synthesis Milestones',
      body: [
        'Problem 1: An unknown compound with molecular formula C8H8O exhibits 13C signals at 26.8, 128.4, 128.7, 133.1, 137.1, and 197.8 ppm. Identify the compound and assign all resonances.',
        'Solution Outline: Signal at 197.8 ppm confirms an aromatic ketone (acetophenone). Signal at 26.8 ppm corresponds to the methyl carbon. Four distinct aromatic resonances confirm monosubstituted benzene ring symmetry.'
      ],
      callout: 'Revision Alert: Review this chapter prior to upcoming midterm exam.'
    }
  ];

  const currentPageData = pagesData[currentPage - 1] || pagesData[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (activeFile?.fileUrl) {
      const a = document.createElement('a');
      a.href = activeFile.fileUrl;
      a.download = activeFile.name;
      a.click();
    } else {
      const blob = new Blob([
        `%PDF-1.4 Simulated Document\nTitle: ${activeFile?.name}\nSubject: ${activeSubject}\n\n${pagesData.map(p => `--- Page ${p.page}: ${p.title} ---\n${p.body.join('\n\n')}`).join('\n\n')}`
      ], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeFile?.name || 'Lecture_Notes.pdf';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      `${activeFile?.name}\n\n${currentPageData.title}\n${currentPageData.body.join('\n\n')}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
      
      {/* Top Document Reader Bar */}
      <div className="px-4 py-2.5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Document Badge, Page Counter & Sidebar Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Quick toggle to restore sidebar if hidden in normal view */}
          {onToggleSidebar && !showSidebar && !isFullscreen && (
            <button
              onClick={onToggleSidebar}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Restore Taxonomy Sidebar Tree"
            >
              <PanelLeftOpen size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
              <span className="hidden sm:inline">Show Tree</span>
            </button>
          )}

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono font-bold border border-red-500/20">
            <FileText size={13} />
            <span>PDF READER</span>
          </span>

          <div className="flex items-center gap-1 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-xl px-2 py-0.5 text-xs font-mono">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-1.5 font-semibold text-[rgb(var(--color-text))]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Next Page"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
              showThumbnails 
                ? 'bg-[#9e3c26]/10 border-[#9e3c26]/30 text-[#9e3c26] dark:text-[#ffb4a3]' 
                : 'bg-[rgb(var(--color-card))] border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]'
            }`}
            title="Toggle Page Thumbnails"
          >
            <Layers size={13} />
            <span className="hidden sm:inline">Pages</span>
          </button>
        </div>

        {/* Center: Search in Document */}
        <div className="relative hidden md:block max-w-xs flex-1">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search document text..."
            className="w-full pl-8 pr-3 py-1 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
          />
        </div>

        {/* Right: Zoom & Tool Actions */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-xl px-1 py-0.5 text-xs font-mono">
            <button
              onClick={() => setZoomLevel(z => Math.max(50, z - 15))}
              className="p-1 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="px-1.5 text-[11px] text-[rgb(var(--color-muted))] min-w-[42px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(z => Math.min(200, z + 15))}
              className="p-1 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="px-1.5 py-0.5 text-[10px] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] rounded cursor-pointer"
            >
              Reset
            </button>
          </div>

          <button
            onClick={handleCopySummary}
            className="p-2 rounded-xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title="Copy Page Text"
          >
            {isCopied ? <Check size={13} className="text-emerald-500" /> : <BookOpen size={13} />}
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title="Print PDF"
          >
            <Printer size={13} />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            title="Download PDF"
          >
            <Download size={13} />
          </button>

          {/* Expand / Collapse Button with clear label */}
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

      {/* Main Document Workspace */}
      <div className="flex-1 flex overflow-hidden bg-[rgb(var(--color-container-low))]/40">
        
        {/* Left Thumbnails Sidebar (Toggleable) */}
        {showThumbnails && (
          <div className="w-48 border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-3 overflow-y-auto space-y-2 hidden md:block shrink-0">
            <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-bold px-1 mb-2">
              Outline & Pages
            </div>
            {pagesData.map((p) => (
              <div
                key={p.page}
                onClick={() => setCurrentPage(p.page)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  currentPage === p.page
                    ? 'border-[#9e3c26] bg-[#9e3c26]/10 shadow-xs'
                    : 'border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-container-low))] bg-[rgb(var(--color-container-low))]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-[#9e3c26] dark:text-[#ffb4a3]">
                    PAGE {p.page}
                  </span>
                  <span className="text-[9px] font-mono text-[rgb(var(--color-muted))]">13C NMR</span>
                </div>
                <div className="text-[11px] font-medium text-[rgb(var(--color-text))] line-clamp-2 leading-tight">
                  {p.title}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Center: PDF Page Display Canvas */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col items-center">
          
          {isUploadedRealFile ? (
            /* Render embedded native PDF if actual file was uploaded */
            <div className="w-full h-full min-h-[550px] rounded-xl overflow-hidden border border-[rgb(var(--color-border))] bg-white">
              <iframe
                src={activeFile.fileUrl}
                title={activeFile.name}
                className="w-full h-full min-h-[550px] border-0"
              />
            </div>
          ) : (
            /* Render High-Fidelity Academic Lecture Slide Simulation */
            <div 
              className="w-full max-w-3xl transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* Paper Sheet Container */}
              <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-2xl shadow-lg p-8 sm:p-12 space-y-6 relative overflow-hidden min-h-[640px] flex flex-col justify-between">
                
                {/* Academic Sheet Top Running Header */}
                <div>
                  <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-3 text-xs font-mono text-[rgb(var(--color-muted))]">
                    <span className="font-semibold text-[#9e3c26] dark:text-[#ffb4a3] uppercase tracking-wider">
                      {activeSubject || 'Organic Chemistry II'} • Advanced Lecture Note
                    </span>
                    <span>Document Ref: 13C-NMR-v2.4</span>
                  </div>

                  {/* Title & Chapter */}
                  <div className="mt-6 space-y-1.5">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-[#9e3c26] dark:text-[#ffb4a3] font-bold">
                      {currentPageData.subtitle}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[rgb(var(--color-text))]">
                      {currentPageData.title}
                    </h2>
                  </div>

                  {/* Body Paragraphs */}
                  <div className="mt-6 space-y-4 text-xs sm:text-sm text-[rgb(var(--color-text))] leading-relaxed">
                    {currentPageData.body.map((para, idx) => (
                      <p key={idx} className="whitespace-pre-line leading-relaxed">
                        {searchQuery ? (
                          para.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, pIdx) => (
                            part.toLowerCase() === searchQuery.toLowerCase() ? (
                              <mark key={pIdx} className="bg-amber-300 dark:bg-amber-600/60 rounded px-1 text-black dark:text-white">
                                {part}
                              </mark>
                            ) : part
                          ))
                        ) : para}
                      </p>
                    ))}
                  </div>

                  {/* Callout Box */}
                  <div className="mt-6 p-4 rounded-xl bg-[#9e3c26]/5 dark:bg-[#e26f54]/10 border-l-4 border-[#9e3c26] dark:border-[#e26f54]">
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-[#9e3c26] dark:text-[#ffb4a3] font-bold mb-1">
                      <Sparkles size={12} />
                      <span>Vectorized Lecture Anchor</span>
                    </div>
                    <p className="text-xs text-[rgb(var(--color-text))] font-medium leading-relaxed">
                      {currentPageData.callout}
                    </p>
                  </div>
                </div>

                {/* Academic Sheet Bottom Running Footer */}
                <div className="pt-6 border-t border-[rgb(var(--color-border))] flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))]">
                  <span>File: {activeFile?.name} ({activeFile?.size})</span>
                  <span className="font-bold text-[rgb(var(--color-text))]">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-2 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] flex items-center justify-between text-[10px] font-mono text-[rgb(var(--color-muted))]">
        <div className="flex items-center gap-3">
          <span>Active Mode: Lecture PDF Reader</span>
          <span>•</span>
          <span>File: {activeFile?.name}</span>
          <span>•</span>
          <span>Status: Vectorized & OCR Synced</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>

    </div>
  );
}
