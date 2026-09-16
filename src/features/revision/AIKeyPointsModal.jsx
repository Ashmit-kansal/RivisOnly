import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import { Sparkles, Brain, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

export default function AIKeyPointsModal({ 
  isOpen, 
  onClose, 
  topic, 
  subject, 
  keyPoints = [], 
  onStartQuiz, 
  onReadNotes 
}) {
  const [checkedPoints, setCheckedPoints] = useState({});

  // Reset checked state when modal opens or topic changes
  React.useEffect(() => {
    if (isOpen) {
      setCheckedPoints({});
    }
  }, [isOpen, topic]);

  if (!isOpen) return null;

  const defaultPoints = keyPoints.length > 0 ? keyPoints : [
    {
      title: 'Core Concept Synthesis',
      content: 'Key rate-determining mechanism step involves nucleophilic addition forming a resonance-stabilized carbanion intermediate.',
      formula: 'Rate = k [Reactant][Reagent]'
    },
    {
      title: 'Thermodynamic & Kinetic Factors',
      content: 'Electron withdrawing substituents lower activation barriers substantially by delocalizing charge density across conjugated heteroatoms.'
    },
    {
      title: 'Common Exam Edge Cases',
      content: 'Watch for stereochemical inversion versus retention when comparing SN1 and SN2 pathway competitions.'
    }
  ];

  const totalPoints = defaultPoints.length;
  const masteredCount = Object.values(checkedPoints).filter(Boolean).length;
  const recallPercentage = Math.round((masteredCount / totalPoints) * 100);

  const togglePoint = (idx) => {
    setCheckedPoints(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="border-b border-[rgb(var(--color-border))] pb-4">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))]">
                <Brain size={16} />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[rgb(var(--color-tertiary))]">
                AI HIGH-YIELD KEY POINTS SYNTHESIS
              </span>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] font-mono text-[11px] border border-[rgb(var(--color-border))]">
              {subject || 'General Discipline'}
            </span>
          </div>

          <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
            {topic || 'Key Concept Summary'}
          </h2>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
            Synthesized from vector index of your course materials, lecture notes, and formula sheets.
          </p>
        </div>

        {/* Mastered Progress Tracker */}
        <div className="p-3.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[rgb(var(--color-muted))] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
              Concept Retention Confidence:
            </span>
            <span className="font-bold text-[#9e3c26] dark:text-[#ffb4a3]">
              {masteredCount} of {totalPoints} Mastered ({recallPercentage}%)
            </span>
          </div>
          <ProgressBar value={masteredCount} max={totalPoints} color="bg-emerald-500" />
        </div>

        {/* Key Points List */}
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {defaultPoints.map((pt, idx) => {
            const isChecked = !!checkedPoints[idx];
            return (
              <div
                key={idx}
                onClick={() => togglePoint(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:border-[#9e3c26]/50 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))]'
                    }`}
                  >
                    {isChecked && <CheckCircle2 size={13} />}
                  </button>

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold ${isChecked ? 'text-emerald-700 dark:text-emerald-300 line-through' : 'text-[rgb(var(--color-text))]'}`}>
                        {pt.title || `Point ${idx + 1}`}
                      </h4>
                      <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                        #{idx + 1}
                      </span>
                    </div>

                    <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
                      {pt.content}
                    </p>

                    {pt.formula && (
                      <div className="mt-2 p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] font-mono text-xs font-bold text-[#9e3c26] dark:text-[#ffb4a3] text-center">
                        {pt.formula}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Strip */}
        <div className="pt-3 border-t border-[rgb(var(--color-border))] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))]">
            Click points to mark as retained
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onReadNotes && (
              <button
                type="button"
                onClick={onReadNotes}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] text-xs font-semibold border border-[rgb(var(--color-border))] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen size={13} />
                <span>Read Full Note</span>
              </button>
            )}

            {onStartQuiz && (
              <button
                type="button"
                onClick={onStartQuiz}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-[#9e3c26]/20 transition-all cursor-pointer"
              >
                <Sparkles size={13} />
                <span>Test Proficiency (Quiz)</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
}
