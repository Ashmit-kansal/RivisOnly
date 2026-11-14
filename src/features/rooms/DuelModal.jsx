import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import { 
  TRIVIA_SUBJECTS, 
  fetchTriviaQuestions 
} from '../../services/triviaApiService';
import AntiLensQuestionCard from '../../components/quiz/AntiLensQuestionCard';
import { 
  Swords, CheckCircle2, Clock, Sparkles, Trophy, 
  ArrowRight, Search, Zap, ShieldCheck, RefreshCw, X, Shield, 
  Target, Dices, Flame, Check
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
  isMatchmaking = true,
  onDuelComplete 
}) {
  const { user } = useAuth();
  const { updateElo, currentLeague, userTrophies } = useStudyRooms();

  // Subject / Topic chosen from free API
  const [selectedSubjectId, setSelectedSubjectId] = useState(18); // Default Computer Science
  const selectedSubject = TRIVIA_SUBJECTS.find(s => s.id === selectedSubjectId) || TRIVIA_SUBJECTS[0];

  // Specific Subtopic selection
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(selectedSubject.subtopics?.[0]?.id || 'cs-all');
  const selectedSubtopic = selectedSubject.subtopics?.find(s => s.id === selectedSubtopicId) || selectedSubject.subtopics?.[0] || { id: 'all', name: 'All Subtopics (Mixed)' };

  const handleSelectSubject = (subjectId) => {
    setSelectedSubjectId(subjectId);
    const subj = TRIVIA_SUBJECTS.find(s => s.id === subjectId) || TRIVIA_SUBJECTS[0];
    const defaultSub = subj.subtopics?.[0]?.id || `${subj.prefix || 'all'}-all`;
    setSelectedSubtopicId(defaultSub);
  };

  // Opponent State
  const [opponentData, setOpponentData] = useState(
    opponent || SCHOLAR_POOL[0]
  );

  // Duel Stages: 'select-topic' | 'searching' | 'matched' | 'in-progress' | 'results'
  const [duelStage, setDuelStage] = useState(opponent ? 'matched' : 'select-topic');

  // Matchmaking Search Animation State
  const [searchCandidateIdx, setSearchCandidateIdx] = useState(0);
  const [searchTimer, setSearchTimer] = useState(0);
  const [matchCountdown, setMatchCountdown] = useState(3);

  // Questions from Open Trivia API
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Quiz Gameplay State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentPoints, setOpponentPoints] = useState(0);
  const [timeLeftUser, setTimeLeftUser] = useState(45.0);
  const [timeLeftOpponent, setTimeLeftOpponent] = useState(45.0);

  const currentQ = questions[currentQuestionIdx] || null;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (opponent) {
        setOpponentData(opponent);
        setDuelStage('matched');
      } else {
        setDuelStage('select-topic');
      }
      setSelectedOption(null);
      setIsAnswered(false);
      setUserScore(0);
      setUserPoints(0);
      setOpponentScore(0);
      setOpponentPoints(0);
      setCurrentQuestionIdx(0);
    }
  }, [isOpen, opponent]);

  // Handle topic selection and initiate matchmaking search
  const handleStartSearching = (subjectId = selectedSubjectId, subtopicId = selectedSubtopicId) => {
    setSelectedSubjectId(subjectId);
    setSelectedSubtopicId(subtopicId);
    setDuelStage('searching');
    setSearchTimer(0);
    setMatchCountdown(3);
  };

  // MATCHMAKING RADAR SEARCH: match player who queued for the SAME subject
  useEffect(() => {
    let cycleInterval = null;
    let finishTimeout = null;

    if (isOpen && duelStage === 'searching') {
      cycleInterval = setInterval(() => {
        setSearchCandidateIdx(prev => (prev + 1) % SCHOLAR_POOL.length);
        setSearchTimer(t => +(t + 0.15).toFixed(1));
      }, 150);

      // Match with an opponent in the same subject after ~2.2 seconds
      finishTimeout = setTimeout(async () => {
        const randomOpponent = SCHOLAR_POOL[Math.floor(Math.random() * SCHOLAR_POOL.length)];
        setOpponentData({
          ...randomOpponent,
          matchedSubject: selectedSubject.name,
          matchedSubtopic: selectedSubtopic.name
        });

        // Pre-fetch questions from free Open Trivia Database API / subtopic bank (0ms AI latency)
        setIsLoadingQuestions(true);
        const mcqs = await fetchTriviaQuestions({
          categoryId: selectedSubject.id,
          subtopicId: selectedSubtopic.id,
          amount: 5
        });
        setQuestions(mcqs);
        setIsLoadingQuestions(false);

        setDuelStage('matched');
      }, 2200);
    }

    return () => {
      if (cycleInterval) clearInterval(cycleInterval);
      if (finishTimeout) clearTimeout(finishTimeout);
    };
  }, [isOpen, duelStage, selectedSubject, selectedSubtopic]);

  // MATCHED COUNTDOWN TO DUEL START
  useEffect(() => {
    let countdownInterval = null;
    if (duelStage === 'matched') {
      countdownInterval = setInterval(() => {
        setMatchCountdown(c => {
          if (c <= 1) {
            clearInterval(countdownInterval);
            handleLaunchMatch();
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [duelStage, questions]);

  // Launch into live questions
  const handleLaunchMatch = async () => {
    let activeMCQs = questions;
    if (!activeMCQs || activeMCQs.length === 0) {
      activeMCQs = await fetchTriviaQuestions({
        categoryId: selectedSubject.id,
        subtopicId: selectedSubtopic.id,
        amount: 5
      });
      setQuestions(activeMCQs);
    }

    setDuelStage('in-progress');
    setCurrentQuestionIdx(0);
    setUserScore(0);
    setUserPoints(0);
    setOpponentScore(0);
    setOpponentPoints(0);
    setTimeLeftUser(45.0);
    setTimeLeftOpponent(45.0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // LIVE IN-PROGRESS QUESTION TIMER LOOP
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

  // Option selection
  const handleSelectOption = (index, multiplier = 1) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correct;
    if (isCorrect) {
      setUserScore(prev => prev + 1);
      setUserPoints(prev => prev + Math.round(100 * (multiplier || 1)));
    }

    // Dynamic opponent simulation (fair parity based on opponent's Elo)
    const opponentAccuracyThreshold = opponentData.elo > 1800 ? 0.25 : 0.40;
    const opponentCorrect = Math.random() > opponentAccuracyThreshold;
    if (opponentCorrect) {
      setOpponentScore(prev => prev + 1);
      setOpponentPoints(prev => prev + Math.round(80 + Math.random() * 35));
    }
  };

  // Next question
  const handleNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeftUser(45.0);
      setTimeLeftOpponent(45.0);
    } else {
      // Duel finished!
      const isWon = userPoints >= opponentPoints || (userPoints === opponentPoints && userScore >= opponentScore);
      if (updateElo) {
        updateElo(isWon ? 25 : -12, isWon);
      }
      setDuelStage('results');
      if (onDuelComplete) {
        onDuelComplete({
          opponent: opponentData.name,
          userScore,
          total: questions.length,
          won: isWon
        });
      }
    }
  };

  const currentSearchingCandidate = SCHOLAR_POOL[searchCandidateIdx];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      
      {/* ================= 1. TOPIC SELECTION STAGE (FREE API CATEGORIES) ================= */}
      {duelStage === 'select-topic' && (
        <div className="space-y-6 animate-fade-in-up">
          
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[rgb(var(--color-border))] pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#9e3c26] dark:text-[#ffb4a3] uppercase font-bold mb-1">
                <Swords size={14} />
                <span>MATCHMAKING QUEUE • OPEN TRIVIA DATABASE API</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[rgb(var(--color-text))] tracking-tight">
                Choose Subject for 1v1 Duel
              </h3>
              <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
                Select your competitive discipline. You will be matched against a scholar applying for the exact same subject.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-muted))]">
              <Zap size={13} className="text-amber-500" />
              <span>0s AI Latency</span>
            </div>
          </div>

          {/* Grid of Free API Subjects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {TRIVIA_SUBJECTS.map((subj) => {
              const isSelected = selectedSubjectId === subj.id;
              return (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => handleSelectSubject(subj.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? `border-[#9e3c26] bg-[#9e3c26]/10 ring-2 ring-[#9e3c26]/30 shadow-xs`
                      : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container-low))] hover:border-[#9e3c26]/40'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{subj.icon}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]">
                        {subj.activeScholars} online
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[rgb(var(--color-text))] group-hover:text-[#9e3c26] dark:group-hover:text-[#ffb4a3] transition-colors flex items-center gap-1">
                        <span className="truncate">{subj.name}</span>
                        {isSelected && <Check size={12} className="text-[#9e3c26] dark:text-[#ffb4a3] shrink-0" />}
                      </h4>
                      <p className="text-[10px] text-[rgb(var(--color-muted))] line-clamp-1 mt-0.5">
                        {subj.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-[rgb(var(--color-border))]/60 flex items-center justify-between text-[9px] font-mono text-[rgb(var(--color-muted))]">
                    <span>{subj.subtopics?.length || 6} Subtopics</span>
                    <span className={isSelected ? 'text-[#9e3c26] dark:text-[#ffb4a3] font-bold' : ''}>
                      {isSelected ? 'Active ●' : 'Select'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* STEP 2: CHOOSE SPECIFIC SUBTOPIC */}
          <div className="p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedSubject.icon}</span>
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[rgb(var(--color-text))] flex items-center gap-2">
                    <span>Specific Subtopics in {selectedSubject.name}</span>
                    <span className="text-[10px] font-normal px-2 py-0.2 rounded-full bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]">
                      Optional Focus
                    </span>
                  </h4>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                Selected: <strong className="text-[rgb(var(--color-text))]">{selectedSubtopic.name}</strong>
              </span>
            </div>

            {/* Subtopics Grid Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {selectedSubject.subtopics?.map((sub) => {
                const isSubSelected = selectedSubtopicId === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubtopicId(sub.id)}
                    className={`px-3 py-2 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSubSelected
                        ? 'bg-[#9e3c26] text-white border-[#9e3c26] font-bold shadow-xs'
                        : 'bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] border-[rgb(var(--color-border))] text-[rgb(var(--color-text))]'
                    }`}
                  >
                    <span className="truncate">{sub.name}</span>
                    {isSubSelected && <Check size={14} className="shrink-0 text-white ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matchmaking Info Strip */}
          <div className="p-3.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[rgb(var(--color-muted))]">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>
                Equalized Matchmaking: Both players match in <strong>{selectedSubject.name}</strong> for <strong>{selectedSubtopic.name}</strong>.
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleStartSearching(selectedSubjectId, selectedSubtopicId)}
              className="px-6 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#9e3c26]/20 transition-all cursor-pointer shrink-0"
            >
              <Swords size={14} />
              <span>Duel in {selectedSubtopic.name}</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </div>
      )}

      {/* ================= 2. MATCHMAKING SEARCHING RADAR STAGE ================= */}
      {duelStage === 'searching' && (
        <div className="py-8 px-4 text-center space-y-6 animate-fade-in-up">
          
          {/* Radar Scanner Animation */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#9e3c26]/30 animate-ping [animation-duration:2s]" />
            <div className="absolute -inset-3 rounded-full border border-indigo-500/20 animate-pulse [animation-duration:1.5s]" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#9e3c26]/10 to-indigo-500/10 blur-md" />
            
            <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden border-2 border-[#9e3c26] shadow-xl ring-4 ring-[rgb(var(--color-card))]">
              <img
                src={currentSearchingCandidate.avatar}
                alt={currentSearchingCandidate.name}
                className="w-full h-full object-cover transition-all duration-150 filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#9e3c26]/30 to-transparent animate-bounce [animation-duration:1s]" />
            </div>

            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#9e3c26] text-white flex items-center justify-center shadow-md animate-spin [animation-duration:6s] z-20">
              <Swords size={14} />
            </div>
          </div>

          {/* Searching Status Headings */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#9e3c26] animate-ping" />
              <span>Scanning Queue for: {selectedSubject.name}</span>
            </div>

            <h3 className="text-2xl font-extrabold text-[rgb(var(--color-text))] tracking-tight">
              Matching Scholars in {selectedSubject.name}
            </h3>

            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[rgb(var(--color-muted))]">
              <span>Target Subtopic:</span>
              <strong className="text-[rgb(var(--color-text))] px-2 py-0.5 rounded-md bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                {selectedSubtopic.name}
              </strong>
            </div>

            <div className="text-xs font-mono text-[rgb(var(--color-muted))] h-5 pt-1">
              Checking: <span className="font-bold text-[rgb(var(--color-text))]">{currentSearchingCandidate.name}</span> ({currentSearchingCandidate.school} • Elo {currentSearchingCandidate.elo})
            </div>
          </div>

          {/* Queue Statistics Badges */}
          <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
              <div className="text-[9px] text-[rgb(var(--color-muted))] uppercase">SUBJECT</div>
              <div className="font-bold text-[rgb(var(--color-text))] truncate">{selectedSubject.name}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
              <div className="text-[9px] text-[rgb(var(--color-muted))] uppercase">SUBTOPIC</div>
              <div className="font-bold text-[#9e3c26] dark:text-[#ffb4a3] truncate">{selectedSubtopic.name}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
              <div className="text-[9px] text-[rgb(var(--color-muted))] uppercase">LATENCY</div>
              <div className="font-bold text-emerald-500">0ms (Instant)</div>
            </div>
          </div>

          {/* Cancel Search Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setDuelStage('select-topic')}
              className="px-5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            >
              Change Subject / Subtopic
            </button>
          </div>

        </div>
      )}

      {/* ================= 3. MATCH FOUND & PAIRED STAGE ================= */}
      {duelStage === 'matched' && (
        <div className="py-8 px-4 text-center space-y-6 animate-fade-in-up">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest border border-emerald-500/30 animate-pulse">
            <Sparkles size={14} />
            <span>⚔️ MATCH CONFIRMED ON SAME SUBJECT!</span>
          </div>

          {/* Versus Showcase */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 pt-2">
            
            {/* YOU */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#9e3c26] text-white font-extrabold flex items-center justify-center text-xl shadow-lg ring-4 ring-[rgb(var(--color-card))]">
                YOU
              </div>
              <div>
                <div className="font-bold text-sm text-[rgb(var(--color-text))]">{user?.name || 'You'}</div>
                <div className="text-[11px] font-mono text-[rgb(var(--color-muted))]">Elo {user?.eloRating ?? 1200}</div>
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex items-center justify-center font-black font-mono text-xs text-[#9e3c26] dark:text-[#ffb4a3] shadow-sm">
                VS
              </div>
            </div>

            {/* MATCHED OPPONENT */}
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
              Matched in <strong className="text-[rgb(var(--color-text))]">{selectedSubject.name}</strong> • Focus: <strong className="text-[#9e3c26] dark:text-[#ffb4a3]">{selectedSubtopic.name}</strong> • Synchronized 5 MCQs loaded.
            </p>
            <div className="text-sm font-bold font-mono text-[#9e3c26] dark:text-[#ffb4a3]">
              Duel begins in {matchCountdown}s...
            </div>
          </div>

          {/* Quick Enter Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleLaunchMatch}
              className="px-8 py-3 rounded-2xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-bold text-xs sm:text-sm flex items-center gap-2 mx-auto shadow-lg shadow-[#9e3c26]/25 transition-all cursor-pointer"
            >
              <Swords size={16} />
              <span>Start 1v1 Duel Immediately</span>
            </button>
          </div>

        </div>
      )}

      {/* ================= 4. IN-PROGRESS LIVE 1V1 DUEL ================= */}
      {duelStage === 'in-progress' && currentQ && (
        <div className="space-y-5 animate-fade-in-up">
          
          {/* Question Banner & Real-time Live Timers */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[rgb(var(--color-border))]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#9e3c26] dark:bg-[#e26f54] text-white text-xs font-mono font-bold uppercase">
                QUESTION {currentQuestionIdx + 1} OF {questions.length}
              </span>
              <span className="text-xs font-mono text-[rgb(var(--color-muted))]">
                {selectedSubject.name} • <span className="text-[rgb(var(--color-text))] font-bold">{selectedSubtopic.name}</span>
              </span>
            </div>

            {/* Split Live Scores: YOU vs OPPONENT */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#9e3c26]/10 dark:bg-[#e26f54]/15 text-[#9e3c26] dark:text-[#ffb4a3] font-bold">
                <span>YOU: {userScore} / {questions.length} ({userPoints} pts)</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] font-bold border border-[rgb(var(--color-border))]">
                <span>{opponentData.name.split(' ')[0].toUpperCase()}: {opponentScore} / {questions.length} ({opponentPoints} pts)</span>
              </div>
            </div>
          </div>

          {/* Time Progress */}
          <ProgressBar
            value={timeLeftUser}
            max={45}
            height="h-1.5"
            color={timeLeftUser < 10 ? 'bg-red-500' : 'bg-[#9e3c26] dark:bg-[#e26f54]'}
          />

          {/* ANTI-LENS PROTECTED QUESTION CARD */}
          <AntiLensQuestionCard
            question={currentQ.question}
            options={currentQ.options}
            correctIndex={currentQ.correct}
            explanation={currentQ.explanation}
            selectedOption={selectedOption}
            onSelectOption={(idx, multiplier) => handleSelectOption(idx, multiplier)}
            topicName={`${selectedSubject.name} — ${selectedSubtopic.name}`}
            questionNumber={currentQuestionIdx + 1}
            totalQuestions={questions.length}
            speedBonusActive={true}
          />

          {/* Next Controls */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{currentQuestionIdx < questions.length - 1 ? 'Next Duel Question' : 'Complete 1v1 Duel'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </div>
      )}

      {/* ================= 5. RESULTS STAGE ================= */}
      {duelStage === 'results' && (
        <div className="text-center space-y-6 py-4 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3]">
            <Trophy size={32} />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#9e3c26] dark:text-[#ffb4a3] font-bold">
              1V1 DUEL CONCLUDED • {selectedSubject.name.toUpperCase()} ({selectedSubtopic.name.toUpperCase()})
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight text-[rgb(var(--color-text))] mt-1">
              {userPoints >= opponentPoints ? '🏆 Victory!' : '⚔️ Defeat!'}
            </h3>
            <p className="text-xs text-[rgb(var(--color-muted))] mt-1 font-mono">
              {userPoints >= opponentPoints
                ? '+25 Elo Rating & +18 Trophies added to your profile'
                : '-12 Elo adjustment recorded'}
            </p>
          </div>

          {/* Score comparison card */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] shadow-xs">
              <div className="text-xs font-mono text-[rgb(var(--color-muted))]">YOUR SCORE</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#9e3c26] dark:text-[#ffb4a3] mt-1">
                {userScore} / {questions.length}
              </div>
              <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {userPoints} Battle Points
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] shadow-xs">
              <div className="text-xs font-mono text-[rgb(var(--color-muted))] truncate">{opponentData.name.toUpperCase()}</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[rgb(var(--color-muted))] mt-1">
                {opponentScore} / {questions.length}
              </div>
              <div className="text-xs font-mono text-[rgb(var(--color-muted))] mt-1">
                {opponentPoints} Battle Points
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => handleStartSearching(selectedSubjectId, selectedSubtopicId)}
              className="px-5 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white text-xs font-semibold shadow-md shadow-[#9e3c26]/20 cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              <span>Rematch in {selectedSubtopic.name}</span>
            </button>

            <button
              type="button"
              onClick={() => setDuelStage('select-topic')}
              className="px-5 py-2.5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-xs font-medium text-[rgb(var(--color-text))] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Dices size={13} />
              <span>Change Subject / Subtopic</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] text-xs font-medium cursor-pointer"
            >
              Return to Arena
            </button>
          </div>

        </div>
      )}

    </Modal>
  );
}
