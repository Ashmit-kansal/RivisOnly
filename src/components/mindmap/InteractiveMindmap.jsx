import React, { useState } from 'react';
import {
  Sparkles, ChevronDown, ChevronRight, Copy, Check,
  ZoomIn, ZoomOut, RotateCcw, Network, ChevronsUpDown,
  Layers, FolderTree, BookOpen
} from 'lucide-react';

const BRANCH_THEMES = [
  {
    border: 'border-blue-500/30 hover:border-blue-500/50',
    bg: 'bg-blue-500/[0.04] dark:bg-blue-500/[0.07]',
    headerBg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30',
    dot: 'bg-blue-500',
    leafBg: 'bg-[rgb(var(--color-card))] hover:border-blue-500/40'
  },
  {
    border: 'border-emerald-500/30 hover:border-emerald-500/50',
    bg: 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.07]',
    headerBg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    dot: 'bg-emerald-500',
    leafBg: 'bg-[rgb(var(--color-card))] hover:border-emerald-500/40'
  },
  {
    border: 'border-purple-500/30 hover:border-purple-500/50',
    bg: 'bg-purple-500/[0.04] dark:bg-purple-500/[0.07]',
    headerBg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30',
    dot: 'bg-purple-500',
    leafBg: 'bg-[rgb(var(--color-card))] hover:border-purple-500/40'
  },
  {
    border: 'border-amber-500/30 hover:border-amber-500/50',
    bg: 'bg-amber-500/[0.04] dark:bg-amber-500/[0.07]',
    headerBg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30',
    dot: 'bg-amber-500',
    leafBg: 'bg-[rgb(var(--color-card))] hover:border-amber-500/40'
  },
  {
    border: 'border-cyan-500/30 hover:border-cyan-500/50',
    bg: 'bg-cyan-500/[0.04] dark:bg-cyan-500/[0.07]',
    headerBg: 'bg-cyan-500/10',
    text: 'text-cyan-600 dark:text-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30',
    dot: 'bg-cyan-500',
    leafBg: 'bg-[rgb(var(--color-card))] hover:border-cyan-500/40'
  },
  {
    border: 'border-rose-500/30 hover:border-rose-500/50',
    bg: 'bg-rose-500/[0.04] dark:bg-rose-500/[0.07]',
    headerBg: 'bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30',
    dot: 'bg-rose-500',
    leafBg: 'bg-[rgb(var(--color-card))] hover:border-rose-500/40'
  }
];

export default function InteractiveMindmap({ mindmap, rootTitle = 'Document Mindmap' }) {
  const [zoom, setZoom] = useState(1);
  const [collapsedBranches, setCollapsedBranches] = useState({});
  const [copied, setCopied] = useState(false);

  if (!mindmap || !Array.isArray(mindmap.branches) || mindmap.branches.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-[rgb(var(--color-muted))] flex flex-col items-center justify-center space-y-2">
        <Network size={28} className="opacity-40 text-indigo-400" />
        <p className="font-semibold text-[rgb(var(--color-text))]">No Mindmap Available</p>
        <p className="text-[11px] max-w-sm">Generating academic summary modules will automatically build your interactive concept mindmap.</p>
      </div>
    );
  }

  const branches = mindmap.branches;
  const isAllCollapsed = Object.keys(collapsedBranches).length === branches.length;

  const toggleBranch = (bIdx) => {
    setCollapsedBranches(prev => ({
      ...prev,
      [bIdx]: !prev[bIdx]
    }));
  };

  const handleToggleAll = () => {
    if (isAllCollapsed) {
      setCollapsedBranches({});
    } else {
      const all = {};
      branches.forEach((_, idx) => {
        all[idx] = true;
      });
      setCollapsedBranches(all);
    }
  };

  const handleCopyMermaid = () => {
    const rootName = mindmap.root || rootTitle;
    const lines = [
      '```mermaid',
      'graph TD',
      `    Root["${rootName.replace(/"/g, "'")}"]`,
      ...branches.flatMap((b, bIdx) => [
        `    B${bIdx}["${b.name.replace(/"/g, "'")}"]`,
        `    Root --> B${bIdx}`,
        ...(b.children || []).map((c, cIdx) => `    B${bIdx} --> B${bIdx}_${cIdx}["${c.replace(/"/g, "'")}"]`)
      ]),
      '```'
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayRoot = mindmap.root || rootTitle.replace(/^Summary\s*-\s*/i, '').replace(/\.[^/.]+$/, '');

  return (
    <div className="space-y-4">
      
      {/* Mindmap Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs font-mono">
        <div className="flex items-center gap-2 text-[rgb(var(--color-text))]">
          <Network size={14} className="text-indigo-500" />
          <span className="font-bold">Interactive Concept Hierarchy</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border border-indigo-500/20 font-semibold">
            {branches.length} Core Branches
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Collapse / Expand All */}
          <button
            onClick={handleToggleAll}
            className="px-2.5 py-1 rounded-lg bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] transition-colors cursor-pointer flex items-center gap-1.5 text-[11px]"
            title={isAllCollapsed ? "Expand all branches" : "Collapse all branches"}
          >
            <ChevronsUpDown size={12} />
            <span>{isAllCollapsed ? 'Expand All' : 'Collapse All'}</span>
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => setZoom(z => Math.max(0.6, parseFloat((z - 0.1).toFixed(1))))}
            className="p-1 rounded-lg bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>

          <span className="text-[11px] font-mono px-1.5 text-[rgb(var(--color-text))] font-semibold">
            {Math.round(zoom * 100)}%
          </span>

          {/* Zoom In */}
          <button
            onClick={() => setZoom(z => Math.min(1.4, parseFloat((z + 0.1).toFixed(1))))}
            className="p-1 rounded-lg bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>

          {/* Reset Zoom */}
          <button
            onClick={() => setZoom(1)}
            className="p-1 rounded-lg bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] transition-colors cursor-pointer"
            title="Reset Zoom to 100%"
          >
            <RotateCcw size={13} />
          </button>

          {/* Copy Mermaid */}
          <button
            onClick={handleCopyMermaid}
            className="px-2.5 py-1 rounded-lg bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] transition-colors cursor-pointer flex items-center gap-1.5 text-[11px]"
            title="Copy Mermaid.js diagram source"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Mermaid'}</span>
          </button>
        </div>
      </div>

      {/* Visual Mindmap Canvas */}
      <div 
        className="p-6 sm:p-8 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] overflow-x-auto shadow-inner transition-transform duration-150"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center'
        }}
      >
        {/* Central Knowledge Node */}
        <div className="flex flex-col items-center mb-6">
          <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-[#9e3c26] text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/20 border border-white/20 flex items-center gap-2.5 tracking-tight">
            <Sparkles size={16} className="text-yellow-300 fill-yellow-300 animate-pulse" />
            <span>{displayRoot}</span>
          </div>

          {/* Connecting Trunk Line */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500/60 to-[rgb(var(--color-border))]" />
        </div>

        {/* Thematic Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {branches.map((branch, bIdx) => {
            const theme = BRANCH_THEMES[bIdx % BRANCH_THEMES.length];
            const isCollapsed = Boolean(collapsedBranches[bIdx]);
            const leafCount = branch.children?.length || 0;

            return (
              <div 
                key={bIdx}
                className={`rounded-2xl border ${theme.border} ${theme.bg} p-4 space-y-3 transition-all duration-200 shadow-xs flex flex-col justify-between`}
              >
                {/* Branch Header Card */}
                <div>
                  <div 
                    onClick={() => toggleBranch(bIdx)}
                    className="flex items-center justify-between gap-2 cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-6 h-6 rounded-lg ${theme.badge} font-mono font-bold text-[10px] flex items-center justify-center shrink-0`}>
                        {bIdx + 1}
                      </span>
                      <h4 className={`text-xs font-bold ${theme.text} truncate group-hover:brightness-125 transition-all`} title={branch.name}>
                        {branch.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {leafCount > 0 && (
                        <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                          {leafCount}
                        </span>
                      )}
                      <button className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] p-0.5">
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Leaf Nodes */}
                  {!isCollapsed && branch.children && branch.children.length > 0 && (
                    <div className="mt-3 pl-3 space-y-1.5 border-l-2 border-[rgb(var(--color-border))]">
                      {branch.children.map((child, cIdx) => (
                        <div 
                          key={cIdx}
                          className={`p-2.5 rounded-xl border border-[rgb(var(--color-border))] ${theme.leafBg} text-[11px] text-[rgb(var(--color-text))] leading-relaxed shadow-2xs flex items-start gap-2 transition-all`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} mt-1.5 shrink-0`} />
                          <span className="flex-1">{child}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Collapsed footer pill */}
                {isCollapsed && leafCount > 0 && (
                  <div 
                    onClick={() => toggleBranch(bIdx)}
                    className="pt-1 text-[10px] font-mono text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] cursor-pointer flex items-center gap-1"
                  >
                    <span>Click to reveal {leafCount} key concepts...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
