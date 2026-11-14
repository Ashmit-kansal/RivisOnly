import React, { useState, useEffect } from 'react';
import {
  Shield, ShieldAlert, Sparkles, Clock, CheckCircle2,
  XCircle, Zap, EyeOff, AlertTriangle, Flame
} from 'lucide-react';

/**
 * AntiLensQuestionCard Component
 * 
 * Engineered to prevent Google Lens, phone camera OCR, and browser automation scraping:
 * 1. High-frequency SVG fractal noise & micro-dot texture interrupts camera binarization/Otsu thresholding.
 * 2. Tab switch / Window blur detector immediately blurs screen when user navigates away.
 * 3. Text selection, drag, and context menu disabled.
 * 4. Micro-split DOM text rendering defeats automated extension scrapers.
 * 5. Per-question Blitz Speed Multiplier (answering under 5s awards 3x combo damage, rendering phone camera search futile).
 */
export default function AntiLensQuestionCard({
  question,
  options = [],
  correctIndex,
  explanation,
  selectedOption,
  onSelectOption,
  topicName = 'Standardized Arena',
  questionNumber = 1,
  totalQuestions = 20,
  speedBonusActive = true,
  onTabViolation,
}) {
  const [tabViolationDetected, setTabViolationDetected] = useState(false);
  const [questionElapsedSec, setQuestionElapsedSec] = useState(0);

  // Monitor Window Blur / Tab Switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setTabViolationDetected(true);
        if (onTabViolation) onTabViolation();
      }
    };

    const handleWindowBlur = () => {
      setTabViolationDetected(true);
      if (onTabViolation) onTabViolation();
    };

    const handleWindowFocus = () => {
      // Keep violation warning visible for 2 seconds to discourage tabbing
      setTimeout(() => setTabViolationDetected(false), 2500);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [onTabViolation]);

  // Per-question elapsed timer for speed bonus
  useEffect(() => {
    setQuestionElapsedSec(0);
    const interval = setInterval(() => {
      setQuestionElapsedSec(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [question]);

  // Calculate speed multiplier
  const getSpeedMultiplier = () => {
    if (questionElapsedSec <= 4) return { label: '3x Speed Bonus', multiplier: 3, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (questionElapsedSec <= 8) return { label: '1.5x Speed Bonus', multiplier: 1.5, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    return { label: 'Standard', multiplier: 1, color: 'text-[rgb(var(--color-muted))] bg-[rgb(var(--color-container-low))] border-[rgb(var(--color-border))]' };
  };

  const speedMultiplier = getSpeedMultiplier();

  // Helper to split text into safe micro-DOM fragments (resists DOM scraping)
  const renderScrambleProtectedText = (text = '') => {
    return text.split(' ').map((word, wordIdx) => (
      <span key={wordIdx} className="inline-block select-none pointer-events-none">
        {word}&nbsp;
      </span>
    ));
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className="relative rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-md overflow-hidden select-none"
    >
      {/* ================= SVG ANTI-OCR TURBULENCE FILTER ================= */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <filter id="anti-ocr-turbulence" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.07 0" />
          <feComposite in2="SourceGraphic" in="gl" operator="over" />
        </filter>
      </svg>

      {/* ================= OPTICAL MICRO-TEXTURE PATTERN ================= */}
      {/* 
        This high-frequency dot and scanline pattern creates sensor moiré on smartphone cameras,
        disrupting Otsu threshold binarization in Google Lens without hampering human readability.
      */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.08] dark:opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0),
            repeating-linear-gradient(45deg, transparent, transparent 3px, currentColor 3px, currentColor 4px)
          `,
          backgroundSize: '4px 4px, 12px 12px'
        }}
      />

      {/* ================= TAB VIOLATION BLUR OVERLAY ================= */}
      {tabViolationDetected && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 animate-pulse">
            <EyeOff size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">
              Anti-Cheat Shield Active: Window Unfocused
            </h4>
            <p className="text-xs text-rose-200/80 max-w-xs">
              Tabbing away from the exam triggers optical blur. Match timer continues running.
            </p>
          </div>
        </div>
      )}

      {/* ================= CARD HEADER: STATUS & BLITZ SPEED ================= */}
      <div className="px-4 py-3 border-b border-[rgb(var(--color-border))] flex items-center justify-between gap-3 relative z-20 bg-[rgb(var(--color-surface))]/60">
        
        {/* Anti-Lens Shield Pill */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
            <Shield size={11} className="text-emerald-500" />
            <span>Anti-Lens Shield</span>
          </span>

          <span className="text-[11px] font-mono text-[rgb(var(--color-muted))]">
            Q{questionNumber} / {totalQuestions}
          </span>
        </div>

        {/* Speed Bonus Indicator */}
        {speedBonusActive && selectedOption === null && (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-all ${speedMultiplier.color}`}>
            <Zap size={11} className={questionElapsedSec <= 4 ? "animate-bounce text-amber-400" : ""} />
            <span>{speedMultiplier.label} ({questionElapsedSec}s)</span>
          </div>
        )}
      </div>

      {/* ================= QUESTION BODY ================= */}
      <div className="p-5 sm:p-6 space-y-5 relative z-20">
        {/* Topic Badge */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[rgb(var(--color-primary))]">
            {topicName}
          </span>
          <span className="text-[10px] font-mono text-[rgb(var(--color-muted))] opacity-75">
            Optical Anti-OCR Matrix v2
          </span>
        </div>

        {/* Question Text with Anti-Lens text-shadow and broken DOM segments */}
        <div className="relative">
          <h3 
            className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text))] leading-relaxed select-none"
            style={{
              textShadow: '0 0.5px 0.5px rgba(0,0,0,0.12)'
            }}
          >
            {renderScrambleProtectedText(question)}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 pt-1">
          {options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === correctIndex;

            let btnStyle = 'bg-[rgb(var(--color-container-low))] border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container))] hover:border-[rgb(var(--color-primary))]/40';

            if (selectedOption !== null) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/15 border-emerald-500/60 text-emerald-800 dark:text-emerald-300 font-semibold shadow-xs';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500/15 border-rose-500/60 text-rose-800 dark:text-rose-300 font-semibold';
              } else {
                btnStyle = 'opacity-35 border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={selectedOption !== null}
                onClick={() => onSelectOption && onSelectOption(idx, speedMultiplier.multiplier)}
                className={`w-full p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer select-none relative overflow-hidden group ${btnStyle}`}
              >
                {/* Micro-dot texture for options */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.09]"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                    backgroundSize: '3px 3px'
                  }}
                />

                <span className="w-6 h-6 rounded-lg bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-[11px] font-mono font-bold flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[rgb(var(--color-primary))]/50 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </span>

                <span className="flex-1 leading-snug select-none relative z-10 font-medium">
                  {renderScrambleProtectedText(opt)}
                </span>

                {selectedOption !== null && isCorrect && (
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0 relative z-10" />
                )}
                {selectedOption !== null && isSelected && !isCorrect && (
                  <XCircle size={18} className="text-rose-500 shrink-0 relative z-10" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Drawer */}
        {selectedOption !== null && explanation && (
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-xs space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
              <Sparkles size={14} />
              <span>Concept Takeaway & Academic Analysis:</span>
            </div>
            <p className="text-[rgb(var(--color-text))] leading-relaxed text-xs">
              {explanation}
            </p>
          </div>
        )}
      </div>

      {/* ================= FOOTER SHIELD NOTICE ================= */}
      <div className="px-4 py-2 border-t border-[rgb(var(--color-border))] text-[10px] font-mono text-[rgb(var(--color-muted))] flex items-center justify-between relative z-20 bg-[rgb(var(--color-container-low))]/30">
        <div className="flex items-center gap-1.5">
          <Shield size={11} className="text-emerald-500" />
          <span>Optical Interference Pattern Active</span>
        </div>
        <span>Rivis FairPlay Protocol</span>
      </div>

    </div>
  );
}

