import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { mockAIQuizBank } from '../../data/mockRevision';
import { 
  Swords, CheckCircle2, Clock, Sparkles, Trophy, 
  ArrowRight, Search, Zap, ShieldCheck, RefreshCw, X
} from 'lucide-react';

const SCHOLAR_POOL = [
  { name: 'Dr. Sarah Patel', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80', school: 'Johns Hopkins', level: 25, elo: 1940 },
  { name: 'Kenji Sato', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', school: 'Tokyo Univ', level: 17, elo: 1780 },
  { name: 'Amara Nwosu', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', school: 'Cambridge', level: 21, elo: 1890 },
  { name: 'Julian Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', school: 'MIT', level: 19, elo: 1845 },
  { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', school: 'Heidelberg', level: 16, elo: 1750 },
  { name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', school: 'Toronto', level: 14, elo: 1690 },
  { name: 'Sophia Lin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', school: 'Stanford', level: 18, elo: 1820 },
  { name: 'Lucas Meyer', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', school: 'ETH Zurich', level: 15, elo: 1715 },
  { name: 'Charlotte Dubois', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', school: 'Sciences Po', level: 23, elo: 1910 },
  { name: 'Alex Mercer', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', school: 'Oxford', level: 18, elo: 1810 }
];

export default function DuelModal({ 
  isOpen, 
  onClose, 
  opponent, 
  isMatchmaking = false,
  onDuelComplete 
}) {
  const { user } = useAuth();
  // Opponent State
  const [opponentData, setOpponentData] = useState(
    opponent || SCHOLAR_POOL[Math.floor(Math.random() * SCHOLAR_POOL.length)]
  );

  // Duel Stages: 'searching' | 'matched' | 'lobby' | 'in-progress' | 'results'
  const [duelStage, setDuelStage] = useState(isMatchmaking ? 'searching' : 'lobby');

  // Matchmaking Search Animation State
  const [searchCandidateIdx, setSearchCandidateIdx] = useState(0);
  const [searchTimer, setSearchTimer] = useState(0);
  const [matchCountdown, setMatchCountdown] = useState(3);

  const topicsList = [
    'Organic Chem: Electrophilic Aromatic Substitution',
    'Organic Chem: Stereochemistry & Isomerism',
    'Linear Algebra: Eigenvalues & Spectral Theorem',
    'Cognitive Neuroscience: Hippocampal LTP'
  ];

  const [selectedTopic, setSelectedTopic] = useState(topicsList[0]);
  const [opponentDecision, setOpponentDecision] = useState('accepted');
  const [opponentProposedTopic, setOpponentProposedTopic] = useState('Organic Chem: Stereochemistry & Isomerism');

  // Quiz Gameplay State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeftUser, setTimeLeftUser] = useState(38.2);
  const [timeLeftOpponent, setTimeLeftOpponent] = useState(41.0);

  const activeQuestions = mockAIQuizBank['Organic Chemistry II'] || [];
  const currentQ = activeQuestions[currentQuestionIdx] || activeQuestions[0];

  // Reset or start matchmaking on modal open
  useEffect(() => {
    if (isOpen) {
      if (isMatchmaking) {
        setDuelStage('searching');
        setSearchTimer(0);
        setMatchCountdown(3);
      } else if (opponent) {
        setOpponentData(opponent);
        setDuelStage('lobby');
      } else {
        setDuelStage('lobby');
      }
    }
  }, [isOpen, isMatchmaking, opponent]);

  // MATCHMAKING SEARCHING ANIMATION
  useEffect(() => {
    let cycleInterval = null;
    let finishTimeout = null;

    if (isOpen && duelStage === 'searching') {
      // Rapidly cycle candidate avatars to create the searching radar scan effect
      cycleInterval = setInterval(() => {
        setSearchCandidateIdx(prev => (prev + 1) % SCHOLAR_POOL.length);
        setSearchTimer(t => t + 0.15);
      }, 150);

      // Settle on a random opponent after 2.6 seconds
      finishTimeout = setTimeout(() => {
        const randomOpponent = SCHOLAR_POOL[Math.floor(Math.random() * SCHOLAR_POOL.length)];
        setOpponentData(randomOpponent);
        setDuelStage('matched');
      }, 2600);
    }

    return () => {
      if (cycleInterval) clearInterval(cycleInterval);
      if (finishTimeout) clearTimeout(finishTimeout);
    };
  }, [isOpen, duelStage]);

  // MATCHED COUNTDOWN TO DUEL START
  useEffect(() => {
    let countdownInterval = null;
    if (duelStage === 'matched') {
      countdownInterval = setInterval(() => {
        setMatchCountdown(c => {
          if (c <= 1) {
            clearInterval(countdownInterval);
            handleStartDuel();
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [duelStage]);

  // IN-PROGRESS LIVE DUEL TIMER LOOP
  useEffect(() => {
    let interval = null;
    if (duelStage === 'in-progress' && !isAnswered && timeLeftUser > 0) {
      interval = setInterval(() => {
        setTimeLeftUser(prev => Math.max(0, +(prev - 0.1).toFixed(1)));
        setTimeLeftOpponent(prev => Math.max(0, +(prev - 0.12).toFixed(1)));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [duelStage, isAnswered, timeLeftUser]);

  const handleStartDuel = () => {
    setDuelStage('in-progress');
    setCurrentQuestionIdx(0);
    setUserScore(0);
    setOpponentScore(0);
    setTimeLeftUser(38.2);
    setTimeLeftOpponent(41.0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correct;
    if (isCorrect) {
      setUserScore(prev => prev + 1);
    }
    if (Math.random() > 0.25) {
      setOpponentScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeftUser(42.0);
      setTimeLeftOpponent(44.0);
    } else {
      setDuelStage('results');
      if (onDuelComplete) {
        onDuelComplete({
          opponent: opponentData.name,
          userScore: userScore + (selectedOption === currentQ.correct ? 1 : 0),
          total: activeQuestions.length
        });
      }
    }
  };

  const currentSearchingCandidate = SCHOLAR_POOL[searchCandidateIdx];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      
      {/* 1. MATCHMAKING SEARCHING ANIMATION STAGE */}
      {duelStage === 'searching' && (
        <div className="py-8 px-4 text-center space-y-6 animate-fade-in-up">
          
          {/* Pulsating Radar Scanner Animation */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            {/* Concentric expanding wave rings */}
            <div className="absolute inset-0 rounded-full border-2 border-[rgb(var(--color-primary))]/30 animate-ping [animation-duration:2s]" />
            <div className="absolute -inset-3 rounded-full border border-indigo-500/20 animate-pulse [animation-duration:1.5s]" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[rgb(var(--color-primary))]/10 to-indigo-500/10 blur-md" />
            
            {/* Center Avatar Roulette */}
            <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden border-2 border-[rgb(var(--color-primary))] shadow-xl ring-4 ring-[rgb(var(--color-card))]">
              <img
                src={currentSearchingCandidate.avatar}
                alt={currentSearchingCandidate.name}
                className="w-full h-full object-cover transition-all duration-150 filter contrast-105"
              />
              {/* Scanline beam effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgb(var(--color-primary))]/30 to-transparent animate-bounce [animation-duration:1s]" />
            </div>

            {/* Rotating Swords Badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[rgb(var(--color-primary))] text-white flex items-center justify-center shadow-md animate-spin [animation-duration:6s] z-20">
              <Swords size={14} />
            </div>
          </div>

          {/* Searching Status Headings */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[rgb(var(--color-primary))] animate-ping" />
              <span>Pinging Global Scholar Queue...</span>
            </div>

            <h3 className="text-2xl font-extrabold text-[rgb(var(--color-text))] tracking-tight">
              Finding 1v1 Arena Opponent
            </h3>

            {/* Candidate stream preview */}
            <div className="text-xs font-mono text-[rgb(var(--color-muted))] h-5">
              Evaluating: <span className="font-bold text-[rgb(var(--color-text))]">{currentSearchingCandidate.name}</span> ({currentSearchingCandidate.school} • Elo {currentSearchingCandidate.elo})
            </div>
          </div>

          {/* Queue Statistics Badges */}
          <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
              <div className="text-[9px] text-[rgb(var(--color-muted))] uppercase">QUEUED</div>
              <div className="font-bold text-[rgb(var(--color-text))]">1,420</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
              <div className="text-[9px] text-[rgb(var(--color-muted))] uppercase">EST. WAIT</div>
              <div className="font-bold text-[rgb(var(--color-primary))]">~2.5s</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
              <div className="text-[9px] text-[rgb(var(--color-muted))] uppercase">PARITY</div>
              <div className="font-bold text-emerald-500">±50 Elo</div>
            </div>
          </div>

          {/* Cancel Search Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            >
              Cancel Matchmaking
            </button>
          </div>

        </div>
      )}

      {/* 2. MATCH FOUND & PAIRED CELEBRATION STAGE */}
      {duelStage === 'matched' && (
        <div className="py-8 px-4 text-center space-y-6 animate-fade-in-up">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest border border-emerald-500/30 animate-pulse">
            <Sparkles size={14} />
            <span>⚔️ MATCH FOUND & PAIRED!</span>
          </div>

          {/* Versus Showcase */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 pt-2">
            
            {/* YOU */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[rgb(var(--color-primary))] text-white font-extrabold flex items-center justify-center text-xl shadow-lg ring-4 ring-[rgb(var(--color-card))]">
                YOU
              </div>
              <div>
                <div className="font-bold text-sm text-[rgb(var(--color-text))]">{user?.name || 'You'}</div>
                <div className="text-[11px] font-mono text-[rgb(var(--color-muted))]">Elo {user?.eloRating ?? 1200} • Lv. {user?.level ?? 1}</div>
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex items-center justify-center font-black font-mono text-xs text-[rgb(var(--color-primary))] shadow-sm">
                VS
              </div>
            </div>

            {/* PAIRED RANDOM OPPONENT */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-emerald-500/50 border border-[rgb(var(--color-border))]">
                <img
                  src={opponentData.avatar}
                  alt={opponentData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {opponentData.name}
                </div>
                <div className="text-[11px] font-mono text-[rgb(var(--color-muted))]">
                  {opponentData.school} • Elo {opponentData.elo}
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-1">
            <p className="text-xs text-[rgb(var(--color-muted))] font-mono">
              Synchronized 10-question dynamic dual quiz loaded.
            </p>
            <div className="text-sm font-bold font-mono text-[rgb(var(--color-primary))]">
              Arena launching in {matchCountdown}s...
            </div>
          </div>

          {/* Quick Enter Action */}
          <div className="pt-2">
            <button
              onClick={handleStartDuel}
              className="px-8 py-3 rounded-2xl bg-[rgb(var(--color-primary))] hover:brightness-105 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 mx-auto shadow-lg shadow-[rgb(var(--color-primary))]/25 transition-all cursor-pointer"
            >
              <Swords size={16} />
              <span>Start 1v1 Duel Now</span>
            </button>
          </div>

        </div>
      )}

      {/* 3. LOBBY STAGE (When directly challenging a peer) */}
      {duelStage === 'lobby' && (
        <div className="space-y-6 animate-fade-in-up">
          
          {/* Header Title with Stakes badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center font-bold">
              <Swords size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight text-[rgb(var(--color-text))]">1v1 Practice Duel Arena</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#9e3c26] dark:bg-[#e26f54] text-white tracking-wider uppercase">
                  Live Stakes
                </span>
              </div>
              <p className="text-xs text-[rgb(var(--color-muted))]">
                Real-time synchronized spaced-repetition challenge
              </p>
            </div>
          </div>

          {/* Versus Header Box matching screenshot */}
          <div className="p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                <div className="w-10 h-10 rounded-full bg-[#9e3c26] dark:bg-[#e26f54] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[rgb(var(--color-card))]">
                  YOU
                </div>
                <div className="text-xs font-bold text-[rgb(var(--color-muted))] px-1 z-10">VS</div>
                <img
                  src={opponentData.avatar}
                  alt={opponentData.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[rgb(var(--color-card))]"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-[rgb(var(--color-text))] flex items-center gap-1.5">
                  <span>Challenging</span>
                  <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-bold">{opponentData.name}</span>
                </div>
                <div className="text-xs text-[rgb(var(--color-muted))]">
                  Stakes: <strong className="text-[rgb(var(--color-secondary))] font-mono">+50 Elo rating</strong> to victor • Permanent combat record logged in vault
                </div>
              </div>
            </div>

            {/* Opponent Protocol badge */}
            <div className="p-2.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-right text-[11px] font-mono shadow-xs">
              <div className="text-[10px] text-[rgb(var(--color-muted))] uppercase font-semibold">OPPONENT PROTOCOL</div>
              <div className="flex items-center gap-1.5 text-[rgb(var(--color-secondary))] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-secondary))] animate-pulse" />
                <span>Can accept OR propose topic</span>
              </div>
            </div>
          </div>

          {/* Challenger Deck Source & AI Engine Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Note Deck Source */}
            <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[10px] uppercase text-[rgb(var(--color-muted))] font-semibold">CHALLENGER DECK SOURCE</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] font-bold">
                  Validated Vault Note
                </span>
              </div>
              
              <h4 className="font-semibold text-sm text-[rgb(var(--color-text))] mb-1">
                {selectedTopic}
              </h4>
              <p className="text-xs text-[rgb(var(--color-muted))] mb-3">
                Extracted from 42 scanned notes & syllabus flashcard decks with ortho/para directing rules.
              </p>

              <div className="mb-2">
                <div className="flex justify-between text-[11px] font-mono text-[rgb(var(--color-muted))] mb-1">
                  <span>Your Deck Mastery & Retention Score</span>
                  <span className="font-bold text-[rgb(var(--color-secondary))]">84% Solid</span>
                </div>
                <ProgressBar value={84} color="bg-emerald-500" height="h-1.5" />
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-[11px] font-mono text-[rgb(var(--color-muted))]">42 Pages Scanned</span>
                <button
                  onClick={() => {
                    const nextIndex = (topicsList.indexOf(selectedTopic) + 1) % topicsList.length;
                    setSelectedTopic(topicsList[nextIndex]);
                  }}
                  className="text-xs text-[#9e3c26] dark:text-[#ffb4a3] hover:underline font-semibold cursor-pointer"
                >
                  Change Note Source ▾
                </button>
              </div>
            </div>

            {/* AI Evaluation Engine Card */}
            <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[10px] uppercase text-[rgb(var(--color-muted))] font-semibold">AI EVALUATION ENGINE</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))] font-bold">
                  GPT-4o Diagnostic
                </span>
              </div>

              <h4 className="font-semibold text-sm text-[rgb(var(--color-text))] mb-1">
                10-Question Dynamic Dual Eval
              </h4>
              <p className="text-xs text-[rgb(var(--color-muted))] mb-3">
                Generates edge-case mechanism traps. Score calculated on <strong>Precision (60%)</strong> + <strong>Response Velocity (40%)</strong>.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-center">
                  <div className="text-[9px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold">SPEED LIMIT</div>
                  <div className="text-xs font-bold text-[#9e3c26] dark:text-[#ffb4a3] font-mono">45s / Question</div>
                </div>
                <div className="p-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-center">
                  <div className="text-[9px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold">DIFFICULTY</div>
                  <div className="text-xs font-bold text-[rgb(var(--color-tertiary))] font-mono">Tier IV Senior</div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[rgb(var(--color-muted))] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-secondary))]" />
                <span>Format: Multi-Choice + Mechanism Step Anti-Cheat Active</span>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] transition-colors cursor-pointer"
            >
              Cancel Challenge
            </button>

            <button
              onClick={handleStartDuel}
              className="px-7 py-3 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] dark:hover:bg-[#ffb4a3] text-white font-semibold text-sm flex items-center gap-2 shadow-md shadow-[#9e3c26]/25 transition-all cursor-pointer"
            >
              <Swords size={16} />
              <span>Initiate 1v1 Sprint</span>
            </button>
          </div>

        </div>
      )}

      {/* 4. IN-PROGRESS QUIZ STAGE (SAME FORMAT) */}
      {duelStage === 'in-progress' && (
        <div className="space-y-5 animate-fade-in-up">
          
          {/* Question Banner & Real-time Live Timers */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[rgb(var(--color-border))]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#9e3c26] dark:bg-[#e26f54] text-white text-xs font-mono font-bold uppercase">
                QUESTION {currentQuestionIdx + 1} OF {activeQuestions.length}
              </span>
              <span className="text-xs font-mono text-[rgb(var(--color-muted))]">
                Organic Chemistry Recall Arena
              </span>
            </div>

            {/* Synchronized Timers: YOU vs OPPONENT */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#9e3c26]/10 dark:bg-[#e26f54]/15 text-[#9e3c26] dark:text-[#ffb4a3] font-bold">
                <span>YOU:</span>
                <span>00:{String(Math.floor(timeLeftUser)).padStart(2, '0')}.{Math.floor((timeLeftUser % 1) * 10)}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] font-bold border border-[rgb(var(--color-border))]">
                <span>{opponentData.name.split(' ')[0].toUpperCase()}:</span>
                <span>00:{String(Math.floor(timeLeftOpponent)).padStart(2, '0')}.{Math.floor((timeLeftOpponent % 1) * 10)}</span>
              </div>
            </div>
          </div>

          {/* Animated Time Progress */}
          <ProgressBar
            value={timeLeftUser}
            max={45}
            height="h-1.5"
            color={timeLeftUser < 10 ? 'bg-red-500' : 'bg-[#9e3c26] dark:bg-[#e26f54]'}
          />

          {/* Question Box */}
          <div className="p-5 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
            <h3 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text))] leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid (A, B, C, D) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isChosen = selectedOption === idx;
              const isCorrect = idx === currentQ.correct;
              
              let cardStyle = 'border-[rgb(var(--color-border))] hover:border-[#9e3c26]/40 bg-[rgb(var(--color-card))] shadow-xs';
              if (isAnswered) {
                if (isCorrect) {
                  cardStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
                } else if (isChosen) {
                  cardStyle = 'border-red-500 bg-red-500/10 text-red-800 dark:text-red-300';
                } else {
                  cardStyle = 'opacity-50 border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${cardStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isAnswered && isCorrect
                      ? 'bg-emerald-500 text-white'
                      : isChosen
                      ? 'bg-red-500 text-white'
                      : 'bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))]'
                  }`}>
                    {letter}
                  </span>
                  <span className="text-xs leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs animate-fade-in-up space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono uppercase">
                  {selectedOption === currentQ.correct ? '✓ Correct Mechanism' : '✕ Precision Error'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                  +15% Retention
                </span>
              </div>
              <p className="text-[rgb(var(--color-text))] leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next / Continue Controls */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] dark:hover:bg-[#ffb4a3] text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{currentQuestionIdx < activeQuestions.length - 1 ? 'Next Duel Question' : 'Complete 1v1 Duel'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </div>
      )}

      {/* 5. RESULTS STAGE (SAME FORMAT) */}
      {duelStage === 'results' && (
        <div className="text-center space-y-6 py-4 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3]">
            <Trophy size={32} />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#9e3c26] dark:text-[#ffb4a3] font-bold">
              DUEL CONCLUDED
            </span>
            <h3 className="text-3xl font-bold tracking-tight text-[rgb(var(--color-text))] mt-1">
              {userScore >= opponentScore ? 'Victory!' : 'Defeat!'}
            </h3>
            <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
              {userScore >= opponentScore
                ? '+24 Elo Rating added to your Global Scholar Profile'
                : '-12 Elo adjustment applied'}
            </p>
          </div>

          {/* Score comparison card */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] shadow-xs">
              <div className="text-xs font-mono text-[rgb(var(--color-muted))]">YOUR SCORE</div>
              <div className="text-3xl font-bold font-mono text-[#9e3c26] dark:text-[#ffb4a3] mt-1">{userScore} / {activeQuestions.length}</div>
              <div className="text-[11px] text-[rgb(var(--color-secondary))] font-mono mt-1">Avg 2.8s response</div>
            </div>
            <div className="p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] shadow-xs">
              <div className="text-xs font-mono text-[rgb(var(--color-muted))]">{opponentData.name.toUpperCase()}</div>
              <div className="text-3xl font-bold font-mono text-[rgb(var(--color-muted))] mt-1">{opponentScore} / {activeQuestions.length}</div>
              <div className="text-[11px] text-[rgb(var(--color-muted))] font-mono mt-1">Avg 3.1s response</div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-xs font-mono text-[rgb(var(--color-muted))] mb-1.5">
              <span>Overall Spaced Recall Accuracy</span>
              <span className="font-bold text-[rgb(var(--color-text))]">{Math.round((userScore / activeQuestions.length) * 100)}%</span>
            </div>
            <ProgressBar value={userScore} max={activeQuestions.length} color="bg-[#9e3c26] dark:bg-[#e26f54]" height="h-2.5" />
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setDuelStage('searching')}
              className="px-5 py-2.5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-xs font-medium text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              <span>Find New Opponent</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] dark:hover:bg-[#ffb4a3] text-white font-medium text-xs shadow-md shadow-[#9e3c26]/20 cursor-pointer"
            >
              Return to Study Room
            </button>
          </div>
        </div>
      )}

    </Modal>
  );
}
