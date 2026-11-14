import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../components/ui/Modal';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import { FLASHCARD_RUSH_DECK } from '../../data/mockArena';
import {
  Zap, Clock, Trophy, Flame, CheckCircle2,
  XCircle, RotateCcw, ArrowRight, Sparkles, Volume2, VolumeX
} from 'lucide-react';

export default function FlashcardRushModal({ isOpen, onClose }) {
  const { rushHighScore, recordRushScore } = useStudyRooms();

  // Game States: 'ready' | 'playing' | 'finished'
  const [gameState, setGameState] = useState('ready');
  const [timeLeft, setTimeLeft] = useState(60);
  const [deck, setDeck] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  // Reset or start when opened
  useEffect(() => {
    if (isOpen) {
      setGameState('ready');
      setTimeLeft(60);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setCorrectCount(0);
      setWrongCount(0);
      setFeedback(null);
    }
  }, [isOpen]);

  // Shuffle deck and start countdown
  const handleStartGame = () => {
    const shuffled = [...FLASHCARD_RUSH_DECK].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(60);
    setGameState('playing');
  };

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Save score on finished
  useEffect(() => {
    if (gameState === 'finished') {
      recordRushScore(score);
    }
  }, [gameState, score]);

  // Compute Multiplier
  const multiplier = streak >= 10 ? 3 : streak >= 5 ? 2 : 1;

  // Handle Answer
  const handleAnswer = (userChoice) => {
    if (gameState !== 'playing' || !deck[currentIdx]) return;

    const currentCard = deck[currentIdx];
    const isCorrect = userChoice === currentCard.isTrue;

    if (isCorrect) {
      const addedPoints = 20 * multiplier;
      setScore(s => s + addedPoints);
      setCorrectCount(c => c + 1);
      setStreak(s => {
        const next = s + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      setFeedback('correct');
    } else {
      setWrongCount(w => w + 1);
      setStreak(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIdx < deck.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        // Reshuffle deck for infinite speedrun loop
        const reshuffled = [...FLASHCARD_RUSH_DECK].sort(() => Math.random() - 0.5);
        setDeck(reshuffled);
        setCurrentIdx(0);
      }
    }, 180);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft') {
        handleAnswer(false);
      } else if (e.key === 'ArrowRight') {
        handleAnswer(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentIdx, deck, multiplier]);

  if (!isOpen) return null;

  const currentCard = deck[currentIdx];
  const totalAnswered = correctCount + wrongCount;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const isNewRecord = score > rushHighScore && gameState === 'finished';

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-6">

        {/* READY STAGE */}
        {gameState === 'ready' && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-inner">
              <Zap size={32} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-[rgb(var(--color-text))]">
                60-Second Flashcard Rush
              </h2>
              <p className="text-xs text-[rgb(var(--color-muted))] max-w-md mx-auto leading-relaxed">
                Concepts and equations will fly onto your screen. Rapidly verify whether each statement is <strong>TRUE</strong> or <strong>FALSE</strong> before the timer expires!
              </p>
            </div>

            {/* Quick Rules */}
            <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto text-xs font-mono text-left">
              <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                <span className="text-amber-500 font-bold block mb-1">⏱️ 60 SECONDS</span>
                <span className="text-[11px] text-[rgb(var(--color-muted))]">Rapid-fire clock countdown.</span>
              </div>
              <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                <span className="text-orange-500 font-bold block mb-1">🔥 MULTIPLIERS</span>
                <span className="text-[11px] text-[rgb(var(--color-muted))]">5 streak = 2x, 10 streak = 3x!</span>
              </div>
              <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                <span className="text-emerald-500 font-bold block mb-1">🏆 BEST SCORE</span>
                <span className="text-[11px] text-[rgb(var(--color-muted))]">{rushHighScore} Points</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleStartGame}
                className="w-full max-w-sm py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold text-sm shadow-lg shadow-amber-600/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                START SPEEDRUN (GO!)
              </button>
            </div>
          </div>
        )}

        {/* PLAYING STAGE */}
        {gameState === 'playing' && currentCard && (
          <div className="space-y-4">
            
            {/* HUD Header */}
            <div className="flex items-center justify-between gap-3 border-b border-[rgb(var(--color-border))] pb-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold">
                  <Clock size={14} className="animate-pulse" />
                  <span className="text-sm">{timeLeft}s</span>
                </div>

                {streak >= 5 && (
                  <div className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 animate-bounce ${
                    multiplier === 3 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    <Flame size={13} />
                    <span>{multiplier}X COMBO ({streak})</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[rgb(var(--color-muted))] uppercase">SCORE</span>
                <div className="text-base font-extrabold text-[rgb(var(--color-text))]">
                  {score} pts
                </div>
              </div>
            </div>

            {/* Flashcard Canvas */}
            <div className={`p-6 sm:p-8 rounded-3xl border min-h-[220px] flex flex-col justify-center text-center transition-all shadow-xs ${
              feedback === 'correct'
                ? 'bg-emerald-500/15 border-emerald-500 scale-[1.02]'
                : feedback === 'wrong'
                ? 'bg-red-500/15 border-red-500 animate-shake'
                : multiplier === 3
                ? 'bg-[rgb(var(--color-card))] border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                : 'bg-[rgb(var(--color-card))] border-[rgb(var(--color-border))]'
            }`}>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-bold mb-2">
                Card #{totalAnswered + 1}
              </span>
              <p className="text-sm sm:text-base font-bold text-[rgb(var(--color-text))] leading-relaxed max-w-lg mx-auto">
                "{currentCard.prompt}"
              </p>
            </div>

            {/* Decision Controls: False / True */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleAnswer(false)}
                className="py-4 px-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <XCircle size={18} />
                <span>FALSE (←)</span>
              </button>

              <button
                type="button"
                onClick={() => handleAnswer(true)}
                className="py-4 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <CheckCircle2 size={18} />
                <span>TRUE (→)</span>
              </button>
            </div>

            <p className="text-[10px] font-mono text-center text-[rgb(var(--color-muted))] pt-1">
              Tip: Use Keyboard Arrow keys (← for False, → for True) for maximum speed.
            </p>
          </div>
        )}

        {/* FINISHED STAGE */}
        {gameState === 'finished' && (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-inner">
              <Trophy size={32} />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
                TIME EXPIRED!
              </span>
              <h2 className="text-3xl font-black text-[rgb(var(--color-text))]">
                {score} Points
              </h2>
              {isNewRecord && (
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold animate-bounce mt-1">
                  <Sparkles size={13} />
                  <span>NEW PERSONAL BEST!</span>
                </div>
              )}
            </div>

            {/* Stats Breakdown Grid */}
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto text-xs font-mono">
              <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                <span className="text-[10px] text-[rgb(var(--color-muted))] block">ACCURACY</span>
                <span className="font-extrabold text-[rgb(var(--color-text))] text-sm">{accuracy}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                <span className="text-[10px] text-[rgb(var(--color-muted))] block">CORRECT</span>
                <span className="font-extrabold text-emerald-500 text-sm">{correctCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                <span className="text-[10px] text-[rgb(var(--color-muted))] block">MAX STREAK</span>
                <span className="font-extrabold text-orange-500 text-sm">{maxStreak}🔥</span>
              </div>
              <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                <span className="text-[10px] text-[rgb(var(--color-muted))] block">LEAGUE XP</span>
                <span className="font-extrabold text-indigo-500 text-sm">+{Math.round(score / 20)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleStartGame}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-600/20 cursor-pointer transition-all"
              >
                <RotateCcw size={14} />
                <span>Play Again</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] font-semibold text-xs cursor-pointer transition-colors"
              >
                Return to Arena
              </button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}

