import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import { sampleGauntletQuestions, checkTopicRankedStatus, getAllForgedDecks } from '../../services/questionBankService';
import {
  STANDARDIZED_ARENAS,
  getStandardizedArena,
  getStandardizedArenaQuestions
} from '../../data/standardizedArenas';
import AntiLensQuestionCard from '../../components/quiz/AntiLensQuestionCard';
import {
  Trophy, Swords, Zap, Shield, Clock, CheckCircle2,
  XCircle, Flame, ArrowRight, RotateCcw, AlertTriangle, Sparkles, Star,
  Layers, BookOpen, Target
} from 'lucide-react';

export default function RankedGauntletModal({
  isOpen,
  onClose,
  initialTopic = 'Operating Systems',
  initialFileId = 'default'
}) {
  const { completeGauntletMatch, currentLeague, userTrophies } = useStudyRooms();

  // Mode: 'standardized' | 'notes'
  const [matchMode, setMatchMode] = useState('standardized');
  const [selectedArenaId, setSelectedArenaId] = useState('arena-dsa');

  // Forged decks (for personal notes mode)
  const [forgedDecks, setForgedDecks] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(initialFileId || 'default');

  // Phase: 'select' | 'playing' | 'result'
  const [phase, setPhase] = useState('select');
  const [selectedTier, setSelectedTier] = useState(20); // 15 | 20 | 40
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answersState, setAnswersState] = useState([]); // [{ questionId, selected, correct, isCorrect, multiplier }]
  
  // Timer & Combo
  const [timeLeft, setTimeLeft] = useState(900); // in seconds
  const [streakCombo, setStreakCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [speedPointsTotal, setSpeedPointsTotal] = useState(0);

  // Result state
  const [matchResult, setMatchResult] = useState(null);

  // Load forged decks whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const decks = getAllForgedDecks();
      setForgedDecks(decks);
      setSelectedFileId(initialFileId || 'default');
      setPhase('select');
      setSelectedOption(null);
      setAnswersState([]);
      setCurrentIndex(0);
      setStreakCombo(0);
      setHighestCombo(0);
      setSpeedPointsTotal(0);
      setMatchResult(null);
    }
  }, [isOpen, initialFileId]);

  // Selected arena object
  const activeArena = getStandardizedArena(selectedArenaId);

  // Determine active deck & topic (when in personal notes mode)
  const activeDeck = forgedDecks.find(d => d.fileId === selectedFileId) || null;
  const activeTopic = matchMode === 'standardized' 
    ? activeArena.name 
    : (activeDeck ? activeDeck.fileName.replace(/\.[^/.]+$/, '') : initialTopic);

  const cooldownStatus = matchMode === 'standardized'
    ? { isEligible: true, remainingDaysFormatted: 'Ready' }
    : checkTopicRankedStatus(selectedFileId);

  // Countdown timer during match
  useEffect(() => {
    if (phase !== 'playing') return;

    if (timeLeft <= 0) {
      handleFinishMatch();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  if (!isOpen) return null;

  // Tier info lookup
  const TIERS = [
    {
      count: 15,
      name: 'Blitz Skirmish',
      timeSec: 420, // 7 mins
      timeLabel: '7 Mins',
      winTrophies: '+15 🏆',
      lossTrophies: '-8 🏆',
      stars: '⭐ 1 Star',
      starsCount: 1,
      badge: 'Quick Recall',
      color: 'border-blue-500/30 bg-blue-500/5 hover:border-blue-500',
      tagColor: 'text-blue-400 bg-blue-500/10'
    },
    {
      count: 20,
      name: 'Ranked Exam',
      timeSec: 900, // 15 mins
      timeLabel: '15 Mins',
      winTrophies: '+28 🏆',
      lossTrophies: '-16 🏆',
      stars: '⭐⭐ 2 Stars',
      starsCount: 2,
      badge: 'Standard Match',
      color: 'border-[#9e3c26]/40 bg-[#9e3c26]/5 hover:border-[#9e3c26]',
      tagColor: 'text-[#9e3c26] dark:text-[#ffb4a3] bg-[#9e3c26]/10'
    },
    {
      count: 40,
      name: 'Grand Gauntlet',
      timeSec: 1800, // 30 mins
      timeLabel: '30 Mins',
      winTrophies: '+65 🏆',
      lossTrophies: '-35 🏆',
      stars: '⭐⭐⭐ 3 Stars',
      starsCount: 3,
      badge: 'High Stakes Trial',
      color: 'border-[#9e3c26]/40 bg-[#9e3c26]/5 hover:border-[#9e3c26]',
      tagColor: 'text-[#9e3c26] dark:text-[#ffb4a3] bg-[#9e3c26]/10'
    }
  ];

  // START MATCH
  const handleStartGauntlet = () => {
    const tierConfig = TIERS.find(t => t.count === selectedTier) || TIERS[1];
    
    let questions = [];
    if (matchMode === 'standardized') {
      questions = getStandardizedArenaQuestions(selectedArenaId, selectedTier);
    } else {
      questions = sampleGauntletQuestions(selectedFileId, selectedTier);
    }

    setActiveQuestions(questions);
    setTimeLeft(tierConfig.timeSec);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswersState([]);
    setStreakCombo(0);
    setHighestCombo(0);
    setSpeedPointsTotal(0);
    setPhase('playing');
  };

  // ANSWER SELECTION (with speed multiplier from AntiLens card)
  const handleSelectOption = (idx, multiplier = 1) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    const currQ = activeQuestions[currentIndex];
    const isCorrect = idx === currQ.correct;

    if (isCorrect) {
      setStreakCombo(c => {
        const next = c + 1;
        setHighestCombo(h => Math.max(h, next));
        return next;
      });
      setSpeedPointsTotal(pts => pts + Math.round(10 * multiplier));
    } else {
      setStreakCombo(0);
    }

    setAnswersState(prev => [
      ...prev,
      {
        questionId: currQ.id || currQ.matchQuestionId,
        selected: idx,
        correct: currQ.correct,
        isCorrect,
        multiplier
      }
    ]);
  };

  // NEXT QUESTION OR FINISH
  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      handleFinishMatch();
    }
  };

  // COMPLETE MATCH
  const handleFinishMatch = () => {
    const correctCount = answersState.filter(a => a.isCorrect).length;
    const isRanked = cooldownStatus.isEligible;

    const result = completeGauntletMatch({
      tier: selectedTier,
      score: correctCount,
      total: activeQuestions.length || selectedTier,
      fileId: matchMode === 'standardized' ? selectedArenaId : selectedFileId,
      fileName: activeTopic,
      isRanked
    });

    setMatchResult(result);
    setPhase('result');
  };

  const currentQ = activeQuestions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="space-y-5">
        
        {/* ================= PHASE 1: SELECT GAUNTLET TIER & ARENA ================= */}
        {phase === 'select' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgb(var(--color-border))] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center text-2xl shadow-sm shrink-0">
                  ⚔️
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[rgb(var(--color-text))] flex items-center gap-2">
                    <span>Ranked Arena Gauntlet</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold">
                      {currentLeague.name}
                    </span>
                  </h3>
                  <p className="text-xs text-[rgb(var(--color-muted))]">
                    Standardized curriculum duels ensure 100% fair matchmaking and cheat-resistant League progression.
                  </p>
                </div>
              </div>

              {/* Trophies Display */}
              <div className="text-right shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-500 font-mono font-bold text-sm border border-amber-500/20">
                  <Trophy size={14} />
                  <span>{userTrophies} 🏆</span>
                </div>
              </div>
            </div>

            {/* Mode Switcher: Standardized Arenas vs Personal Forged Notes */}
            <div className="flex items-center p-1 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMatchMode('standardized')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  matchMode === 'standardized'
                    ? 'bg-[rgb(var(--color-card))] text-[rgb(var(--color-primary))] shadow-xs font-bold border border-[rgb(var(--color-border))]'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                <Target size={14} className="text-amber-500" />
                <span>Standardized Ranked Arenas (Fair PvP)</span>
              </button>

              <button
                type="button"
                onClick={() => setMatchMode('notes')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  matchMode === 'notes'
                    ? 'bg-[rgb(var(--color-card))] text-[rgb(var(--color-primary))] shadow-xs font-bold border border-[rgb(var(--color-border))]'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                <BookOpen size={14} className="text-blue-500" />
                <span>My Forged Notes ({forgedDecks.length} Decks)</span>
              </button>
            </div>

            {/* Mode A: Standardized Arenas Grid */}
            {matchMode === 'standardized' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[rgb(var(--color-muted))] uppercase tracking-wider">
                    Select Standardized Battleground
                  </label>
                  <span className="text-[11px] font-mono text-emerald-500 font-semibold flex items-center gap-1">
                    <Shield size={12} />
                    <span>Equal Syllabus for All Players</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {STANDARDIZED_ARENAS.map(arena => {
                    const isSelected = selectedArenaId === arena.id;
                    return (
                      <button
                        key={arena.id}
                        type="button"
                        onClick={() => setSelectedArenaId(arena.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[rgb(var(--color-container))] border-[rgb(var(--color-primary))] ring-2 ring-[rgb(var(--color-primary))]/20 shadow-xs'
                            : 'bg-[rgb(var(--color-card))] border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-border))]/80 opacity-90 hover:opacity-100'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{arena.icon}</span>
                            <h4 className="font-bold text-xs text-[rgb(var(--color-text))] truncate">
                              {arena.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-[rgb(var(--color-muted))] line-clamp-2">
                            {arena.description}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-[rgb(var(--color-border))]/60 flex items-center justify-between text-[10px] font-mono text-[rgb(var(--color-muted))]">
                          <span>{arena.subtopics.length} Subtopics</span>
                          <span className={isSelected ? "font-bold text-[rgb(var(--color-primary))]" : ""}>
                            {isSelected ? '✓ Selected' : 'Select'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode B: Personal Notes Deck Selector */}
            {matchMode === 'notes' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-2">
                  <label className="text-xs font-bold text-[rgb(var(--color-muted))] uppercase tracking-wider flex items-center justify-between">
                    <span>Select Note Deck:</span>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold">{forgedDecks.length} Forged Note(s)</span>
                  </label>
                  {forgedDecks.length > 0 ? (
                    <select
                      value={selectedFileId}
                      onChange={(e) => setSelectedFileId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs font-bold text-[rgb(var(--color-text))] focus:outline-none focus:border-[#9e3c26]"
                    >
                      {forgedDecks.map(deck => (
                        <option key={deck.fileId} value={deck.fileId}>
                          {deck.cooldownStatus.isEligible ? '🟢' : '⏳'} {deck.fileName} ({deck.questionCount || 50} MCQs {deck.cooldownStatus.isEligible ? '• Ready' : `• Cooldown: ${deck.cooldownStatus.remainingDaysFormatted}`})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-[rgb(var(--color-muted))] py-2">
                      No forged notes found. Go to <strong>Notes Vault</strong> and click "Forge Battle Deck" on any document to prepare it for revision duels!
                    </p>
                  )}
                </div>

                {/* Anti-Farming Cooldown Banner for Personal Notes */}
                {cooldownStatus.isEligible ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <div className="flex-1">
                      <span className="font-bold">Fresh Topic:</span> Eligible for full League Trophies and Guild War Stars.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
                    <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                    <div className="flex-1">
                      <span className="font-bold">Weekly Cooldown Active ({cooldownStatus.remainingDaysFormatted}):</span> Practice mode (+0 🏆) until cooldown resets.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3 Variety Choices */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[rgb(var(--color-muted))] uppercase tracking-wider">
                Select Gauntlet Variety
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TIERS.map((tier) => {
                  const isSelected = selectedTier === tier.count;
                  return (
                    <button
                      key={tier.count}
                      type="button"
                      onClick={() => setSelectedTier(tier.count)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${tier.color} ${
                        isSelected
                          ? 'ring-2 ring-[rgb(var(--color-primary))] shadow-md scale-[1.02]'
                          : 'opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tier.tagColor}`}>
                            {tier.count} MCQs
                          </span>
                          <span className="text-[11px] font-mono text-[rgb(var(--color-muted))] flex items-center gap-1">
                            <Clock size={11} /> {tier.timeLabel}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-[rgb(var(--color-text))] mb-1">
                          {tier.name}
                        </h4>
                        <div className="text-[11px] font-mono font-semibold text-amber-400 mb-2">
                          {tier.stars}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[rgb(var(--color-border))] text-[11px] flex items-center justify-between font-mono">
                        <span className="text-emerald-500 font-bold">{tier.winTrophies}</span>
                        <span className="text-rose-500 font-bold">{tier.lossTrophies}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Anti-Lens & Security Notice */}
            <div className="p-3.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-[11px] text-[rgb(var(--color-muted))] space-y-1">
              <div className="font-semibold text-[rgb(var(--color-text))] flex items-center gap-1.5">
                <Shield size={13} className="text-emerald-500" />
                <span>Optical Anti-Lens Matrix & FairPlay Active</span>
              </div>
              <p>• Background micro-pattern & sensor noise prevents phone camera OCR and Google Lens lookups.</p>
              <p>• Answering in &lt; 5 seconds activates <strong className="text-amber-400">3x Speed Bonus Combo</strong>.</p>
              <p>• Tabbing out triggers immediate screen blur and warning logs.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[rgb(var(--color-muted))] hover:bg-[rgb(var(--color-container-low))] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartGauntlet}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#9e3c26] text-white hover:brightness-110 shadow-md shadow-[#9e3c26]/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Enter {matchMode === 'standardized' ? activeArena.name : 'Deck'} ({selectedTier} Qs)</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ================= PHASE 2: IN-MATCH QUIZ RUNNER (ANTI-LENS PROTECTED) ================= */}
        {phase === 'playing' && currentQ && (
          <div className="space-y-4">
            {/* Top Bar: Progress, Timer & Combo */}
            <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[rgb(var(--color-text))]">
                  Question {currentIndex + 1} of {activeQuestions.length}
                </span>
                {streakCombo >= 2 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                    <Flame size={11} className="fill-amber-400" />
                    {streakCombo} Combo Streak!
                  </span>
                )}
                {speedPointsTotal > 0 && (
                  <span className="text-[10px] font-mono text-emerald-500 font-bold hidden sm:inline">
                    +{speedPointsTotal} Speed Pts
                  </span>
                )}
              </div>

              {/* Match Countdown Timer */}
              <div className={`flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-full border ${
                timeLeft < 60
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  : 'bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] border-[rgb(var(--color-border))]'
              }`}>
                <Clock size={13} />
                <span>{formattedTime}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[rgb(var(--color-container))] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9e3c26] transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
              />
            </div>

            {/* ANTI-LENS PROTECTED QUESTION CARD */}
            <AntiLensQuestionCard
              question={currentQ.question}
              options={currentQ.options}
              correctIndex={currentQ.correct}
              explanation={currentQ.explanation}
              selectedOption={selectedOption}
              onSelectOption={(idx, multiplier) => handleSelectOption(idx, multiplier)}
              topicName={currentQ.topic || activeTopic}
              questionNumber={currentIndex + 1}
              totalQuestions={activeQuestions.length}
              speedBonusActive={true}
            />

            {/* Next / Finish Button */}
            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#9e3c26] disabled:opacity-40 text-white hover:brightness-110 shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{currentIndex + 1 === activeQuestions.length ? 'Submit Gauntlet' : 'Next Question'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ================= PHASE 3: RESULTS & CLASH OF CLANS CELEBRATION ================= */}
        {phase === 'result' && matchResult && (
          <div className="p-6 text-center space-y-6 animate-fade-in-up">
            {/* Victory / Defeat Header */}
            <div className="space-y-2">
              <div className="text-5xl animate-bounce">
                {matchResult.isVictory ? '🏆' : '💀'}
              </div>
              <h3 className={`text-2xl font-black tracking-tight ${
                matchResult.isVictory ? 'text-amber-500' : 'text-rose-500'
              }`}>
                {matchResult.isVictory ? 'VICTORY!' : 'DEFEAT'}
              </h3>
              <p className="text-xs text-[rgb(var(--color-muted))] font-mono">
                {matchResult.fileName} • {matchResult.tier}-MCQ Trial
              </p>
            </div>

            {/* Score & Trophy Differential */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="p-3.5 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))]">Accuracy</div>
                <div className="text-xl font-bold font-mono text-[rgb(var(--color-text))] mt-0.5">
                  {matchResult.percentage}%
                </div>
                <div className="text-[10px] text-[rgb(var(--color-muted))] font-mono mt-0.5">
                  {matchResult.score} / {matchResult.total}
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border ${
                matchResult.trophyChange >= 0
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
              }`}>
                <div className="text-[10px] font-mono uppercase opacity-75">Trophy Delta</div>
                <div className="text-xl font-bold font-mono mt-0.5">
                  {matchResult.trophyChange > 0 ? `+${matchResult.trophyChange}` : matchResult.trophyChange} 🏆
                </div>
                <div className="text-[10px] font-mono opacity-75 mt-0.5">
                  Total: {matchResult.newTrophies}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))]">War Stars</div>
                <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                  {matchResult.starsAwarded > 0 ? `⭐ ×${matchResult.starsAwarded}` : '—'}
                </div>
                <div className="text-[10px] text-[rgb(var(--color-muted))] font-mono mt-0.5">
                  Streak: {highestCombo}x
                </div>
              </div>
            </div>

            {/* Cooldown reminder if practice */}
            {!matchResult.isRanked && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 max-w-md mx-auto">
                Played in Practice Mode due to topic cooldown. Trophies were not altered.
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartGauntlet}
                className="px-5 py-2.5 rounded-xl border border-[rgb(var(--color-border))] text-xs font-semibold text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Rematch / Retry</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#9e3c26] text-white text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-md"
              >
                Return to Arena Floor
              </button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}
