import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import { mockAIQuizBank } from '../../data/mockRevision';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, Trophy, BookOpen, RefreshCw } from 'lucide-react';

export default function AIProficiencyQuizModal({ 
  isOpen, 
  onClose, 
  topic, 
  subject = 'Organic Chemistry II', 
  customQuestions, 
  onViewKeyPoints,
  onReadNotes 
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Reset quiz state when modal opens or topic changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveIdx(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setScore(0);
      setQuizFinished(false);
    }
  }, [isOpen, topic]);

  if (!isOpen) return null;

  // Pick questions from bank based on subject or fallback
  const questionsList = customQuestions && customQuestions.length > 0
    ? customQuestions
    : (mockAIQuizBank[subject] || mockAIQuizBank['Organic Chemistry II']).slice(0, 5);

  const currentQ = questionsList[activeIdx] || questionsList[0];

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
    setIsAnswerSubmitted(true);
    if (idx === currentQ.correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (activeIdx < questionsList.length - 1) {
      setActiveIdx(i => i + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setActiveIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const proficiencyPercent = Math.round((score / questionsList.length) * 100);

  const getProficiencyLabel = () => {
    if (proficiencyPercent >= 80) return { label: 'Mastered (Scholar Grade)', color: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' };
    if (proficiencyPercent >= 60) return { label: 'Proficient (Decay Stabilized)', color: 'text-sky-600 dark:text-sky-400', badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-400' };
    return { label: 'Review Recommended', color: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400' };
  };

  const profInfo = getProficiencyLabel();

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      {!quizFinished ? (
        <div className="space-y-5">
          {/* Header */}
          <div className="border-b border-[rgb(var(--color-border))] pb-3 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1 rounded-md bg-[rgb(var(--color-tertiary))] text-white font-mono text-[10px] font-bold">
                  AI SPRINT
                </span>
                <span className="text-xs font-mono font-semibold text-[#9e3c26] dark:text-[#ffb4a3]">
                  {subject}
                </span>
              </div>
              <h3 className="font-bold text-base text-[rgb(var(--color-text))] truncate max-w-md">
                {topic || 'Proficiency Challenge'}
              </h3>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">QUESTION</div>
              <div className="text-sm font-bold font-mono text-[rgb(var(--color-text))]">
                {activeIdx + 1} / {questionsList.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar value={activeIdx + 1} max={questionsList.length} color="bg-[rgb(var(--color-tertiary))]" />

          {/* Question Box */}
          <div className="p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs sm:text-sm font-semibold leading-relaxed text-[rgb(var(--color-text))] shadow-xs">
            {currentQ.question}
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((option, idx) => {
              const isChosen = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correct;

              let btnStyle = 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:border-[rgb(var(--color-tertiary))]';
              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold';
                } else if (isChosen && !isCorrect) {
                  btnStyle = 'border-red-500 bg-red-500/10 text-red-800 dark:text-red-300';
                } else {
                  btnStyle = 'border-[rgb(var(--color-border))] opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer shadow-xs ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-md bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{option}</span>
                  {isAnswerSubmitted && isCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />}
                  {isAnswerSubmitted && isChosen && !isCorrect && <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Alert */}
          {isAnswerSubmitted && (
            <div className="p-3.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-1 text-xs animate-fade-in-up">
              <div className="font-bold flex items-center gap-1.5 text-[#9e3c26] dark:text-[#ffb4a3]">
                <Sparkles size={13} />
                <span>Concept Rationale:</span>
              </div>
              <p className="text-[rgb(var(--color-muted))] leading-relaxed text-[11px]">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswerSubmitted && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>{activeIdx < questionsList.length - 1 ? 'Next Challenge' : 'Complete Evaluation'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Evaluation Results Screen */
        <div className="text-center py-4 space-y-5">
          <div className="w-16 h-16 rounded-full bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] mx-auto flex items-center justify-center shadow-md">
            <Trophy size={30} />
          </div>

          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold mb-2 ${profInfo.badge}`}>
              {profInfo.label}
            </span>
            <h3 className="text-2xl font-bold text-[rgb(var(--color-text))]">
              Proficiency Diagnostic Complete!
            </h3>
            <p className="text-xs text-[rgb(var(--color-muted))] max-w-sm mx-auto mt-1">
              Your recall stability has been updated in the Ebbinghaus SM-2 decay matrix for <strong>{topic}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] max-w-xs mx-auto space-y-2">
            <div className="text-4xl font-mono font-bold text-[#9e3c26] dark:text-[#ffb4a3]">
              {proficiencyPercent}%
            </div>
            <div className="text-xs font-mono text-[rgb(var(--color-muted))]">
              {score} of {questionsList.length} Questions Correct
            </div>
            <ProgressBar value={score} max={questionsList.length} color="bg-emerald-500" />
          </div>

          <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto text-left text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs">
              <div className="text-[10px] text-[rgb(var(--color-muted))]">DECAY SHIFT</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">+18% Stability</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs">
              <div className="text-[10px] text-[rgb(var(--color-muted))]">NEXT RE-TEST</div>
              <div className="font-bold text-[rgb(var(--color-text))] mt-0.5">In 7 Days (SM-2)</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-[rgb(var(--color-border))]">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-xs font-medium border border-[rgb(var(--color-border))] flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Retry Quiz</span>
            </button>

            {onViewKeyPoints && (
              <button
                onClick={onViewKeyPoints}
                className="px-3.5 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-xs font-medium border border-[rgb(var(--color-border))] flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                <span>Review Key Points</span>
              </button>
            )}

            {onReadNotes && (
              <button
                onClick={onReadNotes}
                className="px-3.5 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-xs font-medium border border-[rgb(var(--color-border))] flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen size={13} />
                <span>Read Full Note</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white text-xs font-semibold cursor-pointer shadow-sm"
            >
              Done & Record
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
