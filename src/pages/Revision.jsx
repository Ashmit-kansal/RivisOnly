import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIKeyPointsModal from '../features/revision/AIKeyPointsModal';
import AIProficiencyQuizModal from '../features/revision/AIProficiencyQuizModal';
import CreateRevisionModal from '../features/revision/CreateRevisionModal';
import ProgressBar from '../components/ui/ProgressBar';
import { mockRevisionCards } from '../data/mockRevision';
import { getAllForgedDecks } from '../services/questionBankService';
import { 
  Sparkles, BookOpen, Clock, CheckCircle2, 
  Brain, AlertTriangle, ArrowUpRight, Filter, 
  Layers, Plus, TrendingUp, Zap, ArrowRight, Info, Dices
} from 'lucide-react';

const INTERVAL_STAGES = [
  {
    interval: 'Interval 1',
    day: 'Day 1',
    title: 'Initial Ingest',
    timingBadge: '24h Post-Class',
    status: 'Fresh Memory',
    statusColor: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
    retention: '95%',
    decayDrop: 'Drops to ~50% overnight if left unreviewed',
    scienceSummary: 'Immediately after learning a topic, your brain forms temporary synaptic traces. Reviewing on Day 1 prevents the initial rapid drop in retention.',
    actionStep: 'Spend 3-5 minutes reading the summary notes or scanning the 3 AI key points.',
    recommendedMode: 'Manual Notes or AI Key Points',
    cardFilterKeys: ['Day 1', 'Due Tomorrow', 'Initial'],
  },
  {
    interval: 'Interval 2',
    day: 'Day 3',
    title: 'The 48h Cliff',
    timingBadge: 'Critical Recall Spike',
    status: 'High Forgetting Risk ⚠️',
    statusColor: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20',
    isCritical: true,
    retention: '85%',
    decayDrop: 'Without review: 70% of details fade here',
    scienceSummary: 'This is the steepest slope of the forgetting curve. Testing yourself when retrieval starts feeling challenging triggers active recall, sparking neuroplastic growth.',
    actionStep: 'Take a quick 3-minute AI Quiz Sprint. Testing your brain forces formulas and mechanisms to lock in.',
    recommendedMode: 'AI Practice Quiz Sprint',
    cardFilterKeys: ['Day 3'],
  },
  {
    interval: 'Interval 3',
    day: 'Day 7',
    title: 'Synaptic Anchor',
    timingBadge: '1-Week Consolidation',
    status: 'Mid-Term Stability',
    statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    retention: '90%',
    decayDrop: 'Fine details become fuzzy without reinforcement',
    scienceSummary: 'After 1 week, your hippocampus begins transferring knowledge into associative neocortical storage. Checking key points here confirms you understand the core formulas.',
    actionStep: 'Check off the AI High-Yield Key Points checklist to verify retention confidence.',
    recommendedMode: 'AI Key Points Checklist',
    cardFilterKeys: ['Day 7', 'Day 5'],
  },
  {
    interval: 'Interval 4',
    day: 'Day 14',
    title: 'Deep Encoding',
    timingBadge: '2-Week Hardening',
    status: 'Exam-Resistant',
    statusColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    retention: '94%',
    decayDrop: 'High recall speed; memory remains solid',
    scienceSummary: 'By Day 14, spacing has multiplied retrieval speed. A quick check-in ensures you can access formulas effortlessly under timed exam stress.',
    actionStep: 'Run through a quick challenge question or compare with adjacent concepts in other chapters.',
    recommendedMode: 'AI Quiz or Quick Problem Solving',
    cardFilterKeys: ['Day 14', 'Day 10', 'Day 12'],
  },
  {
    interval: 'Interval 5',
    day: 'Day 30',
    title: 'Permanent Mastery',
    timingBadge: 'Long-Term Storage',
    status: 'Permanent Recall 🏆',
    statusColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
    retention: '98%',
    decayDrop: 'Permanent recall with zero future cramming needed',
    scienceSummary: 'Topics reviewed at Day 30 enter permanent semantic memory. The concepts are deeply integrated into your knowledge base for semester finals.',
    actionStep: 'Topic mastered! You can archive this revision or do a quick 1-minute refresher before finals.',
    recommendedMode: 'Final Mastery Check & Archive',
    cardFilterKeys: ['Day 30', 'Day 21', 'Permanent', 'Mastered'],
  },
];

export default function Revision() {
  const navigate = useNavigate();
  const { driveToken, requestDriveAccess } = useAuth();
  const [activeSubject, setActiveSubject] = useState('All Subjects');
  const [filterType, setFilterType] = useState('all');
  
  // Custom revisions persisted in localStorage with fallback to mock data
  const [revisionCards, setRevisionCards] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-custom-revisions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return mockRevisionCards;
  });

  // User quiz retention overrides & reviews persisted in localStorage
  const [retentionState, setRetentionState] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-retention-state');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeIntervalIndex, setActiveIntervalIndex] = useState(1);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalInterval, setCreateModalInterval] = useState('Day 3');
  const [selectedTopicForKeyPoints, setSelectedTopicForKeyPoints] = useState(null);
  const [selectedTopicForQuiz, setSelectedTopicForQuiz] = useState(null);

  // Helper to compute dynamic retention score & decay based on Ebbinghaus forgetting curve
  const computeRetention = (cardKey, { initialTime, defaultProgress, defaultScore, defaultStatus }) => {
    const override = retentionState[cardKey];
    if (override && override.lastReviewedAt) {
      const elapsedHours = (Date.now() - override.lastReviewedAt) / (1000 * 60 * 60);
      // Stability increases with each active recall review
      const stabilityHours = 24 * (1 + (override.reviewCount || 1) * 2.5);
      const score = Math.max(40, Math.min(100, Math.round(override.lastScore * Math.exp(-elapsedHours / stabilityHours))));
      const isDecaying = score < 75;
      
      let progress = 'Day 30 of 30';
      if ((override.reviewCount || 1) <= 1) progress = 'Day 3 of 30';
      else if ((override.reviewCount || 1) === 2) progress = 'Day 7 of 30';
      else if ((override.reviewCount || 1) === 3) progress = 'Day 14 of 30';

      return {
        decayScore: score,
        decayStatus: isDecaying ? 'decaying' : (score >= 90 ? 'fresh' : 'stable'),
        progress,
        badge: score >= 90 ? `Mastered (${score}%)` : (isDecaying ? `Needs Review (${score}%)` : `Proficient (${score}%)`),
        proficiencyScore: override.lastScore
      };
    }

    if (initialTime) {
      const elapsedHours = (Date.now() - initialTime) / (1000 * 60 * 60);
      if (elapsedHours > 336) {
        return { decayScore: 48, decayStatus: 'decaying', progress: 'Day 30 of 30', badge: 'Needs Review (48%)', proficiencyScore: 50 };
      }
      if (elapsedHours > 168) {
        return { decayScore: 58, decayStatus: 'decaying', progress: 'Day 14 of 30', badge: 'Needs Review (58%)', proficiencyScore: 60 };
      }
      if (elapsedHours > 72) {
        return { decayScore: 68, decayStatus: 'decaying', progress: 'Day 7 of 30', badge: 'Needs Review (68%)', proficiencyScore: 70 };
      }
      if (elapsedHours > 24) {
        return { decayScore: 78, decayStatus: 'decaying', progress: 'Day 3 of 30', badge: 'Review Due (78%)', proficiencyScore: 75 };
      }
      return { decayScore: 95, decayStatus: 'fresh', progress: 'Day 1 of 30', badge: 'Fresh Memory (95%)', proficiencyScore: 85 };
    }

    return {
      decayScore: defaultScore || 85,
      decayStatus: defaultStatus || 'fresh',
      progress: defaultProgress || 'Day 1 of 30',
      badge: `${defaultStatus === 'decaying' ? 'Needs Review' : 'Active'} (${defaultScore || 85}%)`,
      proficiencyScore: defaultScore || 85
    };
  };

  // Load real forged study notes from Google Drive / localStorage
  const forgedDecks = useMemo(() => {
    try {
      return getAllForgedDecks();
    } catch {
      return [];
    }
  }, []);

  const forgedCards = useMemo(() => {
    return forgedDecks.map(deck => {
      const cleanTopic = (deck.fileName || 'Academic Note')
        .replace(/^Summary\s*-\s*/i, '')
        .replace(/\.[^/.]+$/, '')
        .trim();

      const cardKey = (cleanTopic || deck.fileId).toLowerCase();
      const retention = computeRetention(cardKey, { initialTime: deck.forgedAt });

      // Rich key points with takeaways and analogies
      const keyPoints = (deck.summary || []).slice(0, 5).map(s => {
        let content = s.definition || s.content || '';
        if (Array.isArray(s.mainPoints) && s.mainPoints.length > 0) {
          content = content ? `${content}\n\n• ${s.mainPoints.join('\n• ')}` : s.mainPoints.join(' • ');
        }
        if (s.example) {
          content += `\n\nAnalogy: ${s.example}`;
        }
        return {
          title: s.title || 'Core Topic',
          content,
          formula: s.formula || (s.examTip ? `Tip: ${s.examTip}` : null)
        };
      });

      return {
        id: `forged-${deck.fileId || cleanTopic}`,
        subject: 'Google Drive Notes',
        topic: cleanTopic,
        type: 'ai',
        badge: retention.badge,
        progress: retention.progress,
        decayScore: retention.decayScore,
        decayStatus: retention.decayStatus,
        decayColor: retention.decayScore < 75 ? '#c84b31' : '#2d7d46',
        description: deck.summary?.[0]?.definition || deck.summary?.[0]?.content || `Complete concept summary with ${deck.summary?.length || 0} topics and interactive mindmap.`,
        sourcesScanned: 1,
        tokensVectorized: 6000,
        noteFileId: deck.fileId,
        noteFileName: deck.fileName,
        proficiencyScore: retention.proficiencyScore,
        keyPoints,
        customQuestions: deck.questions || [],
        isForgedNote: true
      };
    });
  }, [forgedDecks, retentionState]);

  // Combine forged cards with custom/curated revision cards applying retention calculation
  const allCards = useMemo(() => {
    const mappedCards = revisionCards.map(c => {
      const cardKey = (c.topic || c.id).toLowerCase();
      if (retentionState[cardKey]) {
        const retention = computeRetention(cardKey, {
          defaultProgress: c.progress,
          defaultScore: c.decayScore,
          defaultStatus: c.decayStatus
        });
        return {
          ...c,
          decayScore: retention.decayScore,
          decayStatus: retention.decayStatus,
          progress: retention.progress,
          badge: retention.badge,
          proficiencyScore: retention.proficiencyScore
        };
      }
      return c;
    });

    return [...forgedCards, ...mappedCards];
  }, [forgedCards, revisionCards, retentionState]);

  // Derive subject filter tabs dynamically from real cards in queue
  const subjects = useMemo(() => {
    const list = [{ id: 'all', name: 'All Subjects', icon: '📚' }];
    const unique = new Set();
    
    // Always include Google Drive Notes if present
    const hasDriveNotes = allCards.some(c => c.subject === 'Google Drive Notes' || c.isForgedNote);
    if (hasDriveNotes) {
      list.push({ id: 'Google Drive Notes', name: 'Google Drive Notes', icon: '📂', code: 'DRIVE' });
      unique.add('Google Drive Notes');
    }

    allCards.forEach(c => {
      if (c.subject && c.subject !== 'All Subjects' && !unique.has(c.subject)) {
        unique.add(c.subject);
        list.push({
          id: c.subject,
          name: c.subject,
          icon: '📖',
          code: c.subject.slice(0, 4).toUpperCase()
        });
      }
    });

    return list;
  }, [allCards]);

  // Open AI Practice Quiz (samples 5 questions at random across all notes if folder scope)
  const handleOpenQuiz = (card) => {
    if (!card) return;
    if (card.isFolderScope && Array.isArray(card.questionPool) && card.questionPool.length > 0) {
      // Pick 5 questions at random from across all notes in this folder
      const shuffled = [...card.questionPool].sort(() => 0.5 - Math.random());
      setSelectedTopicForQuiz({
        ...card,
        customQuestions: shuffled.slice(0, 5)
      });
    } else {
      setSelectedTopicForQuiz(card);
    }
  };

  // Filtered cards
  const filteredCards = allCards.filter(card => {
    const matchesSubject = activeSubject === 'All Subjects' || card.subject === activeSubject;
    if (!matchesSubject) return false;
    if (filterType === 'all') return true;
    if (filterType === 'decaying') return card.decayStatus === 'decaying';
    if (filterType === 'ai') return card.type === 'ai';
    if (filterType === 'manual') return card.type === 'manual';
    return true;
  });

  const handleCreateRevision = (newCard) => {
    setRevisionCards(prev => {
      const updated = [newCard, ...prev];
      try {
        localStorage.setItem('rivisonly-custom-revisions', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save custom revisions', e);
      }
      return updated;
    });
    if (activeSubject !== 'All Subjects' && activeSubject !== newCard.subject) {
      setActiveSubject(newCard.subject);
    }
  };

  // Called when student finishes an AI practice quiz
  const handleQuizCompleted = ({ topic, percentage }) => {
    if (!topic) return;
    const cardKey = topic.trim().toLowerCase();
    setRetentionState(prev => {
      const existing = prev[cardKey] || {};
      const updated = {
        ...prev,
        [cardKey]: {
          lastReviewedAt: Date.now(),
          lastScore: percentage,
          reviewCount: (existing.reviewCount || 0) + 1
        }
      };
      try {
        localStorage.setItem('rivisonly-retention-state', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save retention state', e);
      }
      return updated;
    });
  };

  const handleRedirectToNotes = (card) => {
    if (card.isFolderScope) {
      navigate(`/notes?folder=${encodeURIComponent(card.folder || '')}`);
    } else if (card.isForgedNote || card.subject === 'Google Drive Notes') {
      navigate(`/notes?fileId=${card.noteFileId || ''}&fileName=${encodeURIComponent(card.noteFileName || card.topic)}`);
    } else {
      const subjectParam = encodeURIComponent(card.subject);
      const fileParam = card.noteFileId ? `&fileId=${card.noteFileId}` : '';
      const folderParam = card.folder ? `&folder=${encodeURIComponent(card.folder)}` : '';
      navigate(`/notes?subject=${subjectParam}${folderParam}${fileParam}&mode=manual`);
    }
  };

  // Live dynamic statistics computed from active queue
  const avgRetention = Math.round(
    allCards.reduce((acc, c) => acc + (Number(c.decayScore) || 85), 0) / (allCards.length || 1)
  );
  const dueRetestCount = allCards.filter(c => c.decayStatus === 'decaying' || (c.decayScore && Number(c.decayScore) < 75)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      
      {/* Hero Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#9e3c26] dark:text-[#ffb4a3] font-bold mb-1 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Brain size={14} />
              <span>SMART SPACED REPETITION & RETENTION</span>
            </div>
            <div className="inline-flex items-center gap-1.5 ml-1 bg-[rgb(var(--color-container-low))] px-2.5 py-0.5 rounded-full border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-secondary))] animate-pulse" />
              <span className="font-bold text-[rgb(var(--color-secondary))]">Memory Engine Active</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--color-text))]">
            Active Revision & Retention Hub
          </h1>
          <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] max-w-2xl mt-1.5 leading-relaxed">
            Choose your preferred revision path: examine high-yield AI key points, test proficiency with AI practice quizzes, or study notes manually in tactile view.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* + Create Revision Button */}
          <button
            onClick={() => {
              setCreateModalInterval('Day 3');
              setShowCreateModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-[#9e3c26]/25 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Revision</span>
          </button>

          <Link
            to="/notes"
            className="px-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-xs border border-[rgb(var(--color-border))] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Layers size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>Open Notes Vault</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>


      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {subjects.map(subj => {
          const isSelected = activeSubject === subj.name;
          return (
            <button
              key={subj.id}
              onClick={() => setActiveSubject(subj.name)}
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 font-medium transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#9e3c26] text-white border-[#9e3c26] shadow-sm shadow-[#9e3c26]/20 font-semibold'
                  : 'bg-[rgb(var(--color-card))] border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))]'
              }`}
            >
              <span>{subj.icon || '📚'}</span>
              <span>{subj.name}</span>
              {subj.code && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))]'
                }`}>
                  {subj.code}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4 Revision Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Memory Health Score</span>
            <span className={`w-2 h-2 rounded-full ${avgRetention >= 80 ? 'bg-emerald-500' : avgRetention >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} />
          </div>
          <div className="text-3xl font-bold font-mono text-[rgb(var(--color-secondary))] mt-1.5">{avgRetention}%</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">
            {dueRetestCount === 0 ? 'All topics memory-stable' : `${dueRetestCount} topic${dueRetestCount === 1 ? '' : 's'} need review`}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Topics Due for Review</span>
            <AlertTriangle size={13} className={dueRetestCount > 0 ? "text-[#9e3c26] dark:text-[#ffb4a3]" : "text-emerald-500"} />
          </div>
          <div className={`text-3xl font-bold font-mono mt-1.5 ${dueRetestCount > 0 ? 'text-[#9e3c26] dark:text-[#ffb4a3]' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {dueRetestCount}
          </div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1 font-medium">
            {dueRetestCount > 0 ? 'Ready for active recall' : 'Queue fully up to date'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Topics in Queue</span>
            <CheckCircle2 size={13} className="text-[rgb(var(--color-tertiary))]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[rgb(var(--color-tertiary))] mt-1.5">{allCards.length}</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">
            {forgedCards.length > 0 ? `${forgedCards.length} Drive notes + ${allCards.length - forgedCards.length} curated` : 'Across active disciplines'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Retention Efficiency</span>
            <Sparkles size={13} className="text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1.5">
            +{Math.max(16, avgRetention - 55)}%
          </div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">Spaced Repetition Lift</div>
        </div>
      </div>

      {/* SCHEDULED TOPICS QUEUE WITH THE 3 EXPLICIT REVISION OPTIONS */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[rgb(var(--color-text))] flex items-center gap-2">
              <span>Active Revision Schedule & Topic Queue</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))]">
                {filteredCards.length} in queue
              </span>
            </h3>
            <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
              Choose an action on any card: read key points, test proficiency with AI, or open note in vault.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-mono text-[rgb(var(--color-muted))] flex items-center gap-1 mr-1">
              <Filter size={12} /> Filter:
            </span>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'decaying', label: 'Needs Review' },
              { id: 'ai', label: 'AI Optimized' },
              { id: 'manual', label: 'Manual Tasks' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterType === f.id
                    ? 'bg-[rgb(var(--color-container-high))] text-[rgb(var(--color-text))] font-bold shadow-xs'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] bg-[rgb(var(--color-container-low))]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid with 3 clear choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => {
            const isDecaying = card.decayStatus === 'decaying';
            return (
              <div
                key={card.id}
                className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] hover:border-[#9e3c26]/50 transition-all flex flex-col justify-between shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isDecaying
                        ? 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
                        : card.type === 'ai'
                        ? 'bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))]'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                    }`}>
                      {card.badge}
                    </span>

                    <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                      {card.progress}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[rgb(var(--color-text))] group-hover:text-[#9e3c26] dark:group-hover:text-[#ffb4a3] transition-colors line-clamp-1">
                    {card.topic}
                  </h4>
                  <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mb-2 flex items-center justify-between">
                    <span>{card.subject}</span>
                    {card.proficiencyScore && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {card.proficiencyScore}% Score
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[rgb(var(--color-muted))] line-clamp-2 leading-relaxed mb-3">
                    {card.description}
                  </p>

                  {/* Memory Strength Progress */}
                  <div className="space-y-1 mb-4 p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[rgb(var(--color-muted))]">Memory Strength:</span>
                      <span className={`font-bold ${isDecaying ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {card.decayScore}%
                      </span>
                    </div>
                    <ProgressBar
                      value={card.decayScore}
                      max={100}
                      color={isDecaying ? 'bg-red-500' : 'bg-emerald-500'}
                    />
                  </div>
                </div>

                {/* The 3 Action Buttons on each card */}
                <div className="pt-3 border-t border-[rgb(var(--color-border))] space-y-2">
                  <div className="text-[10px] font-mono text-[rgb(var(--color-muted))] uppercase font-semibold">
                    Choose Revision Mode:
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Option 1: Key Points */}
                    <button
                      type="button"
                      onClick={() => setSelectedTopicForKeyPoints(card)}
                      className="py-1.5 px-2 rounded-lg bg-[rgb(var(--color-tertiary-container))] hover:opacity-90 text-[rgb(var(--color-tertiary))] text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                      title="View AI High-Yield Key Points"
                    >
                      <Sparkles size={11} />
                      <span>Key Points</span>
                    </button>

                    {/* Option 2: AI Practice Quiz */}
                    <button
                      type="button"
                      onClick={() => handleOpenQuiz(card)}
                      className="py-1.5 px-2 rounded-lg bg-[#9e3c26]/10 hover:bg-[#9e3c26]/20 dark:bg-[#e26f54]/15 text-[#9e3c26] dark:text-[#ffb4a3] text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Test proficiency with AI Quiz"
                    >
                      <Brain size={11} />
                      <span>AI Quiz</span>
                    </button>

                    {/* Option 3: Manual Revision (Redirect to Notes) */}
                    <button
                      type="button"
                      onClick={() => handleRedirectToNotes(card)}
                      className="py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Redirect to full notes & mindmap in vault"
                    >
                      <BookOpen size={11} />
                      <span>{card.isForgedNote ? 'Notes' : 'Manual'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Spaced Repetition Roadmap & Retention Guide */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgb(var(--color-border))]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3]">
                <TrendingUp size={16} />
              </span>
              <h3 className="font-bold text-base text-[rgb(var(--color-text))]">
                How Spaced Repetition Works: Your Retention Roadmap
              </h3>
            </div>
            <p className="text-xs text-[rgb(var(--color-muted))] max-w-3xl leading-relaxed">
              Instead of 5 hours of stressful cramming before exams, small 3-minute reviews at these 5 critical milestones lock knowledge directly into long-term memory.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgb(var(--color-muted))] shrink-0 bg-[rgb(var(--color-container-low))] px-3 py-1.5 rounded-xl border border-[rgb(var(--color-border))]">
            <Info size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>Click any day below to see what to do</span>
          </div>
        </div>

        {/* 5 Clickable Milestone Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {INTERVAL_STAGES.map((stage, idx) => {
            const isSelected = activeIntervalIndex === idx;
            return (
              <button
                key={stage.day}
                type="button"
                onClick={() => setActiveIntervalIndex(idx)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  isSelected
                    ? 'border-[#9e3c26] bg-[#9e3c26]/10 dark:bg-[#9e3c26]/20 shadow-sm ring-2 ring-[#9e3c26]/20'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] hover:border-[#9e3c26]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono text-[rgb(var(--color-muted))] uppercase font-semibold">
                      {stage.interval}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${stage.statusColor}`}>
                      {stage.retention}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-[rgb(var(--color-text))] flex items-center gap-1.5">
                    <span>{stage.day}</span>
                    {stage.isCritical && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" title="Critical Drop Window" />
                    )}
                  </div>

                  <div className="text-xs font-semibold text-[#9e3c26] dark:text-[#ffb4a3] mt-0.5">
                    {stage.title}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[rgb(var(--color-border))]/60 text-[10px] font-mono text-[rgb(var(--color-muted))] flex items-center justify-between">
                  <span>{stage.timingBadge}</span>
                  {isSelected ? (
                    <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-bold">Active ●</span>
                  ) : (
                    <span>View →</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Explainer Panel */}
        {(() => {
          const currentStage = INTERVAL_STAGES[activeIntervalIndex];
          const stageMatchingCards = filteredCards.filter(c => {
            const prog = (c.progress || '').toLowerCase();
            return currentStage.cardFilterKeys.some(key => prog.includes(key.toLowerCase()));
          });

          return (
            <div className="p-4 sm:p-5 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-4 animate-fade-in">
              
              {/* Stage Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgb(var(--color-border))]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9e3c26] dark:text-[#ffb4a3]" />
                  <h4 className="font-bold text-sm text-[rgb(var(--color-text))]">
                    {currentStage.interval}: {currentStage.day} — {currentStage.title} ({currentStage.timingBadge})
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${currentStage.statusColor}`}>
                    {currentStage.status}
                  </span>
                  <span className="text-xs font-mono text-[rgb(var(--color-muted))]">
                    Target Retention: <strong className="text-[rgb(var(--color-text))]">{currentStage.retention}</strong>
                  </span>
                </div>
              </div>

              {/* 3 Actionable Guidance Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* 1. What Happens to Your Brain */}
                <div className="p-3.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[rgb(var(--color-text))]">
                      <Brain size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                      <span>1. The Memory Science</span>
                    </div>
                    <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
                      {currentStage.scienceSummary}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-[10px] font-mono text-[rgb(var(--color-muted))]">
                    ⚠️ {currentStage.decayDrop}
                  </div>
                </div>

                {/* 2. What You Should Do */}
                <div className="p-3.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[rgb(var(--color-text))]">
                      <Zap size={14} className="text-amber-500" />
                      <span>2. Recommended Action</span>
                    </div>
                    <div className="text-xs font-semibold text-[#9e3c26] dark:text-[#ffb4a3]">
                      {currentStage.recommendedMode}
                    </div>
                    <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
                      {currentStage.actionStep}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={stageMatchingCards.length === 0}
                      onClick={() => {
                        const target = stageMatchingCards[0];
                        if (target) handleOpenQuiz(target);
                      }}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all shadow-2xs ${
                        stageMatchingCards.length > 0 
                          ? 'bg-[#9e3c26] hover:bg-[#be543c] cursor-pointer' 
                          : 'bg-gray-400/20 text-[rgb(var(--color-muted))] cursor-not-allowed opacity-60'
                      }`}
                      title={stageMatchingCards.length > 0 ? `Launch AI quiz for ${stageMatchingCards[0].topic}` : 'No topic due in this window'}
                    >
                      <Sparkles size={11} />
                      <span>AI Quiz</span>
                    </button>
                    <button
                      type="button"
                      disabled={stageMatchingCards.length === 0}
                      onClick={() => {
                        const target = stageMatchingCards[0];
                        if (target) setSelectedTopicForKeyPoints(target);
                      }}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                        stageMatchingCards.length > 0
                          ? 'bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))] hover:opacity-90 cursor-pointer'
                          : 'bg-gray-400/15 text-[rgb(var(--color-muted))] cursor-not-allowed opacity-60'
                      }`}
                      title={stageMatchingCards.length > 0 ? `Read key points for ${stageMatchingCards[0].topic}` : 'No topic due in this window'}
                    >
                      <BookOpen size={11} />
                      <span>Key Points</span>
                    </button>
                  </div>
                </div>

                {/* 3. Topics Due in This Window */}
                <div className="p-3.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[rgb(var(--color-text))]">
                        <Clock size={14} className="text-sky-500" />
                        <span>3. Your Active Topics ({stageMatchingCards.length})</span>
                      </div>
                      <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                        {currentStage.day} Window
                      </span>
                    </div>

                    {stageMatchingCards.length > 0 ? (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {stageMatchingCards.map(c => (
                          <div
                            key={c.id}
                            onClick={() => handleOpenQuiz(c)}
                            className="p-2 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container-high))] border border-[rgb(var(--color-border))] text-left cursor-pointer transition-colors group flex items-center justify-between gap-1"
                          >
                            <span className="text-xs font-medium text-[rgb(var(--color-text))] truncate group-hover:text-[#9e3c26] dark:group-hover:text-[#ffb4a3]">
                              {c.topic}
                            </span>
                            <span className="text-[10px] font-mono text-[rgb(var(--color-muted))] shrink-0">
                              {c.decayScore}%
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
                        No topics currently queued for this interval. Use "+ Schedule a Topic" below to add one.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCreateModalInterval(currentStage.day);
                      setShowCreateModal(true);
                    }}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Schedule a Topic for {currentStage.day}</span>
                  </button>
                </div>

              </div>

              {/* Intuitive Cramming vs Spacing Educational Strip */}
              <div className="pt-3 border-t border-[rgb(var(--color-border))] flex items-center gap-2 text-xs text-[rgb(var(--color-muted))]">
                <span className="font-bold text-[rgb(var(--color-text))]">💡 Memory Insight:</span>
                <span>Short 3-minute active recall reviews at these 5 milestones yield ~95% long-term retention vs 5 hours of cramming (which drops below 30% in 72 hours).</span>
              </div>

            </div>
          );
        })()}

      </div>

      {/* AI Key Points Modal */}
      {selectedTopicForKeyPoints && (
        <AIKeyPointsModal
          isOpen={!!selectedTopicForKeyPoints}
          onClose={() => setSelectedTopicForKeyPoints(null)}
          topic={selectedTopicForKeyPoints.topic}
          subject={selectedTopicForKeyPoints.subject}
          keyPoints={selectedTopicForKeyPoints.keyPoints}
          onStartQuiz={() => {
            const item = selectedTopicForKeyPoints;
            setSelectedTopicForKeyPoints(null);
            handleOpenQuiz(item);
          }}
          onReadNotes={() => handleRedirectToNotes(selectedTopicForKeyPoints)}
        />
      )}

      {/* AI Proficiency Quiz Modal */}
      {selectedTopicForQuiz && (
        <AIProficiencyQuizModal
          isOpen={!!selectedTopicForQuiz}
          onClose={() => setSelectedTopicForQuiz(null)}
          topic={selectedTopicForQuiz.topic}
          subject={selectedTopicForQuiz.subject}
          customQuestions={selectedTopicForQuiz.customQuestions}
          onCompleteQuiz={handleQuizCompleted}
          onViewKeyPoints={() => {
            const item = selectedTopicForQuiz;
            setSelectedTopicForQuiz(null);
            setSelectedTopicForKeyPoints(item);
          }}
          onReadNotes={() => handleRedirectToNotes(selectedTopicForQuiz)}
        />
      )}

      {/* Create Revision Modal */}
      <CreateRevisionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        driveToken={driveToken}
        onRequestDriveAuth={requestDriveAccess}
        defaultInterval={createModalInterval}
        onCreate={handleCreateRevision}
      />

    </div>
  );
}
