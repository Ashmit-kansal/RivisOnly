import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import { mockAIQuizBank } from '../../data/mockRevision';
import { Bot, BookOpen, CheckCircle2, ArrowRight, PenTool, Bookmark, Maximize2 } from 'lucide-react';

export default function DualRevisionExperience({ activeSubject = 'Organic Chemistry II' }) {
  const [showFullAIQuizModal, setShowFullAIQuizModal] = useState(false);
  const [showManualReaderModal, setShowManualReaderModal] = useState(false);

  const [previewSelectedOption, setPreviewSelectedOption] = useState(1);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const questions = mockAIQuizBank[activeSubject] || mockAIQuizBank['Organic Chemistry II'];
  const currentQ = questions[activeQuestionIdx];

  const handleFullQuizAnswer = (idx) => {
    if (idx === currentQ.correct) {
      setQuizScore(s => s + 1);
    }
    if (activeQuestionIdx < questions.length - 1) {
      setActiveQuestionIdx(i => i + 1);
    } else {
      setQuizDone(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#9e3c26] dark:bg-[#ffb4a3]" />
          <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
            The Dual Revision Experience
          </h3>
          <span className="text-xs font-mono text-[rgb(var(--color-muted))] bg-[rgb(var(--color-container-low))] px-2 py-0.5 rounded border border-[rgb(var(--color-border))]">Select Pathway</span>
        </div>
        <div className="text-xs font-mono text-[rgb(var(--color-muted))]">
          Active Subject Focus: <strong className="text-[#9e3c26] dark:text-[#ffb4a3]">{activeSubject}</strong>
        </div>
      </div>

      {/* Two Pathways Grid matching template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pathway A: Algorithmic Deep Synthesis (AI Notes & Quiz) */}
        <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col justify-between relative overflow-hidden group">
          
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[rgb(var(--color-tertiary))]/10 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between text-xs font-mono mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))] font-bold uppercase text-[10px] tracking-wider">
                PATHWAY A • ALGORITHMIC DEEP SYNTHESIS
              </span>
              <span className="text-[10px] font-mono font-semibold text-[rgb(var(--color-tertiary))]">
                GPT-4o Diagnostic
              </span>
            </div>

            <h4 className="text-lg font-bold text-[rgb(var(--color-text))] mb-1 group-hover:text-[rgb(var(--color-tertiary))] transition-colors">
              Revise with AI Notes & 10-Question Quiz
            </h4>
            <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed mb-4">
              Scans and cross-indexes all lecture notes, NMR charts, and chemical mechanics to formulate precision edge-case challenges.
            </p>

            {/* Ingestion status */}
            <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex items-center justify-between text-xs mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))] flex items-center justify-center font-bold text-xs">
                  ⚛
                </div>
                <div>
                  <div className="font-semibold text-[rgb(var(--color-text))] text-xs">
                    Spectroscopy & NMR spectra analyzed
                  </div>
                  <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                    6 Source documents vectorized (14,280 tokens)
                  </div>
                </div>
              </div>
              <CheckCircle2 size={16} className="text-[rgb(var(--color-secondary))] shrink-0" />
            </div>

            {/* High-Yield Synthesis Bullets */}
            <div className="p-3.5 rounded-xl bg-[rgb(var(--color-container-high))]/60 border border-[rgb(var(--color-border))] space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[rgb(var(--color-muted))]">
                <span className="font-bold text-[#9e3c26] dark:text-[#ffb4a3]">HIGH-YIELD SYNTHESIS BULLETS</span>
                <span>3 min read</span>
              </div>
              <div className="space-y-1.5 text-[11px] leading-relaxed text-[rgb(var(--color-text))]">
                <div>
                  <strong className="font-mono text-[#9e3c26] dark:text-[#ffb4a3]">01.</strong> 13C-NMR chemical shifts between 160-185 ppm pinpoint carbonyl carbons with conjugation shifts toward lower field.
                </div>
                <div>
                  <strong className="font-mono text-[#9e3c26] dark:text-[#ffb4a3]">02.</strong> Spin-spin splitting (n+1 rule) collapses under broad-band decoupling; quaternary carbons exhibit noticeably depressed signal amplitudes.
                </div>
              </div>
            </div>

            {/* Question 4 of 10 Preview matching screenshot */}
            <div className="p-3.5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-[#9e3c26] dark:bg-[#e26f54] text-white font-bold">
                  Question 4 of 10
                </span>
                <span className="text-[rgb(var(--color-muted))]">Simulated Score: 9/10 (90%)</span>
              </div>

              <p className="text-xs font-semibold text-[rgb(var(--color-text))] leading-relaxed">
                In proton-decoupled 13C-NMR spectroscopy, which carbon nucleus typically produces the lowest intensity peak due to absent NOE enhancement?
              </p>

              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setPreviewSelectedOption(0)}
                  className={`w-full text-left p-2 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                    previewSelectedOption === 0 ? 'border-[#9e3c26] bg-[#9e3c26]/10' : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-xs'
                  }`}
                >
                  A) Methyl (-CH₃) primary carbon
                </button>
                <button
                  onClick={() => setPreviewSelectedOption(1)}
                  className={`w-full text-left p-2 rounded-lg border text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                    previewSelectedOption === 1 ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold' : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-xs'
                  }`}
                >
                  <span>B) Quaternary (C) without directly bonded protons</span>
                  <CheckCircle2 size={13} className="text-emerald-500" />
                </button>
                <button
                  onClick={() => setPreviewSelectedOption(2)}
                  className={`w-full text-left p-2 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                    previewSelectedOption === 2 ? 'border-[#9e3c26] bg-[#9e3c26]/10' : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-xs'
                  }`}
                >
                  C) Methylene (-CH₂-) adjacent to electronegative oxygen
                </button>
              </div>

              {previewSelectedOption === 1 && (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                  <span>Long T1 relaxation times + zero Nuclear Overhauser Effect produce weak signals.</span>
                  <span className="font-mono font-bold text-[10px] shrink-0 ml-2">+15% Retention</span>
                </div>
              )}
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-[rgb(var(--color-border))] relative z-10">
            <button
              onClick={() => {
                setActiveQuestionIdx(0);
                setQuizScore(0);
                setQuizDone(false);
                setShowFullAIQuizModal(true);
              }}
              className="w-full py-3 rounded-xl bg-[rgb(var(--color-tertiary))] hover:opacity-90 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Bot size={15} />
              <span>Launch 10-Question Sprint</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

        {/* Pathway B: Tactile Deep Immersion (Manual Notes & Reader) */}
        <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col justify-between relative overflow-hidden group">
          
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold uppercase text-[10px] tracking-wider">
                PATHWAY B • TACTILE DEEP IMMERSION
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] text-[10px] font-mono border border-[rgb(var(--color-border))]">
                Distraction-Free Mode
              </span>
            </div>

            <h4 className="text-lg font-bold text-[rgb(var(--color-text))] mb-1">
              Manual Deep Read & Annotation
            </h4>
            <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed mb-4">
              Tactile, hyper-focused reader for architectural diagrams, chemical structural PNGs, annotated PDFs, and rich laboratory write-ups.
            </p>

            {/* Document Preview Box */}
            <div className="p-4 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[rgb(var(--color-text))] truncate">
                  Benzene_Ring_Diagram.png
                </span>
                <div className="flex items-center gap-1.5 shrink-0 text-[rgb(var(--color-muted))]">
                  <span>Page 4 / 12</span>
                  <div className="h-3 w-px bg-[rgb(var(--color-border))]" />
                  <PenTool size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                  <Bookmark size={13} className="text-amber-500" />
                  <Maximize2 size={13} />
                </div>
              </div>

              {/* Graphic Diagram Mock */}
              <div className="h-44 rounded-xl bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] p-4 flex flex-col items-center justify-center relative overflow-hidden border border-[rgb(var(--color-border))]">
                <div className="text-center space-y-2 z-10">
                  <div className="text-3xl font-mono text-emerald-600 dark:text-emerald-400">⬡</div>
                  <div className="text-xs font-mono tracking-wider text-[rgb(var(--color-muted))]">
                    MO DIAGRAM: Pi-electron delocalization in Ortho/Para attacks
                  </div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                    <CheckCircle2 size={11} />
                    <span>4 Bookmarks Saved</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px] opacity-5" />
              </div>

              {/* Reading Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs">
                  <div className="text-[9px] font-mono uppercase text-[rgb(var(--color-muted))]">Ink Sensitivity</div>
                  <div className="text-xs font-bold text-[rgb(var(--color-text))] font-mono">0.5mm Hairstyle</div>
                </div>
                <div className="p-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs">
                  <div className="text-[9px] font-mono uppercase text-[rgb(var(--color-muted))]">Reading Palette</div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">Natural Warm</div>
                </div>
                <div className="p-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs">
                  <div className="text-[9px] font-mono uppercase text-[rgb(var(--color-muted))]">Retention Boost</div>
                  <div className="text-xs font-bold text-[rgb(var(--color-secondary))] font-mono">+22% Recall</div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[rgb(var(--color-muted))] pt-1">
                Last manual read: <strong>Yesterday, 21:15</strong>
              </div>
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-[rgb(var(--color-border))]">
            <button
              onClick={() => setShowManualReaderModal(true)}
              className="w-full py-3 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] dark:hover:bg-[#ffb4a3] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#9e3c26]/20 transition-all cursor-pointer"
            >
              <BookOpen size={15} />
              <span>Enter Focused Reader</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>

      {/* Full 10-Question AI Quiz Modal */}
      {showFullAIQuizModal && (
        <Modal
          isOpen={showFullAIQuizModal}
          onClose={() => setShowFullAIQuizModal(false)}
          maxWidth="max-w-2xl"
        >
          {!quizDone ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[rgb(var(--color-border))]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[rgb(var(--color-tertiary))] text-white font-mono text-xs font-bold">
                    AI SPRINT: Q{activeQuestionIdx + 1} OF {questions.length}
                  </span>
                  <span className="text-xs text-[rgb(var(--color-muted))] font-mono">{activeSubject}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[rgb(var(--color-secondary))]">
                  Current Score: {quizScore}/{activeQuestionIdx}
                </span>
              </div>

              <ProgressBar value={activeQuestionIdx + 1} max={questions.length} color="bg-[rgb(var(--color-tertiary))]" />

              <div className="p-4 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-sm font-semibold leading-relaxed">
                {currentQ.question}
              </div>

              <div className="space-y-2">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFullQuizAnswer(idx)}
                    className="w-full p-3.5 rounded-xl border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-tertiary))] bg-[rgb(var(--color-card))] text-left text-xs transition-colors flex items-start gap-2.5 cursor-pointer shadow-xs"
                  >
                    <span className="w-5 h-5 rounded-md bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] font-mono font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] mx-auto flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold">AI Quiz Sprint Finished!</h3>
              <p className="text-xs text-[rgb(var(--color-muted))]">
                Your spaced retention score has been refreshed across all vectorized notes.
              </p>
              <div className="text-4xl font-mono font-bold text-[#9e3c26] dark:text-[#ffb4a3]">
                {quizScore} / {questions.length}
              </div>
              <div className="max-w-xs mx-auto">
                <ProgressBar value={quizScore} max={questions.length} color="bg-emerald-500" />
              </div>
              <button
                onClick={() => setShowFullAIQuizModal(false)}
                className="px-6 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white text-xs font-semibold mt-4 cursor-pointer"
              >
                Close & Record to Vault
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* Manual Reader Modal */}
      {showManualReaderModal && (
        <Modal
          isOpen={showManualReaderModal}
          onClose={() => setShowManualReaderModal(false)}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[rgb(var(--color-border))]">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                <h3 className="font-bold text-base">Focused Manual Reader</h3>
                <span className="text-xs font-mono text-[rgb(var(--color-muted))]">Distraction-Free</span>
              </div>
              <span className="text-xs font-mono text-[rgb(var(--color-secondary))] font-medium">Auto-Tracking Read Time</span>
            </div>

            <div className="p-6 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-4 text-xs leading-relaxed text-[rgb(var(--color-text))]">
              <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">
                Organic Synthesis & Reaction Mechanisms Complete Dossier
              </h2>
              <p>
                In nucleophilic aromatic substitution (SNAr), electron-withdrawing groups (EWGs) such as nitro (-NO2), cyano (-CN), and carbonyl groups accelerate reaction rates when positioned ortho or para to the leaving halide. The rate-determining step involves initial nucleophilic attack to form a delocalized resonance-stabilized carbanion intermediate known as the Meisenheimer complex.
              </p>
              <div className="p-4 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] font-mono text-center text-sm font-bold text-[#9e3c26] dark:text-[#ffb4a3] shadow-xs">
                Rate = k [Ar-X] [Nu⁻]
              </div>
              <p>
                Fluorine is typically the most reactive halogen in SNAr reactions (F &gt;&gt; Cl &gt; Br &gt; I), because its strong electronegativity pulls electron density toward itself in the transition state, stabilizing the Meisenheimer intermediate and overcoming the stronger C-F bond energy.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowManualReaderModal(false)}
                className="px-5 py-2 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white text-xs font-medium cursor-pointer"
              >
                Finished Reading Session
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
