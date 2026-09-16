import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RevisionReminderModal from '../features/notes/RevisionReminderModal';
import AIKeyPointsModal from '../features/revision/AIKeyPointsModal';
import AIProficiencyQuizModal from '../features/revision/AIProficiencyQuizModal';
import CreateRevisionModal from '../features/revision/CreateRevisionModal';
import ProgressBar from '../components/ui/ProgressBar';
import { mockRevisionCards } from '../data/mockRevision';
import { 
  Sparkles, BookOpen, Clock, CheckCircle2, 
  Brain, AlertTriangle, ArrowUpRight, Filter, 
  Layers, Plus, TrendingUp, Zap, ArrowRight, Info
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
    cardFilterKeys: ['Day 1', 'Tomorrow', 'Due Tomorrow', 'Initial'],
  },
  {
    interval: 'Interval 2',
    day: 'Day 3',
    title: 'The 48h Cliff',
    timingBadge: 'Critical Recall Spike',
    status: 'High Decay Risk ⚠️',
    statusColor: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20',
    isCritical: true,
    retention: '85%',
    decayDrop: 'Without review: 70% of details vanish here',
    scienceSummary: 'This is the steepest slope of the forgetting curve. Testing yourself when retrieval starts feeling challenging triggers active recall, sparking neuroplastic growth.',
    actionStep: 'Take a quick 3-minute AI Quiz Sprint. Testing your brain forces formulas and mechanisms to lock in.',
    recommendedMode: 'AI Practice Quiz Sprint',
    cardFilterKeys: ['Day 3', 'decaying', 'Decay Alert'],
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
    cardFilterKeys: ['Day 7', 'Day 5', 'stable'],
  },
  {
    interval: 'Interval 4',
    day: 'Day 14',
    title: 'Deep Encoding',
    timingBadge: '2-Week Hardening',
    status: 'Exam-Resistant',
    statusColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    retention: '94%',
    decayDrop: 'Very low decay; recall speed improves',
    scienceSummary: 'By Day 14, spacing has multiplied retrieval speed. A quick check-in ensures you can access formulas effortlessly under timed exam stress.',
    actionStep: 'Run through a quick challenge question or compare with adjacent concepts in other chapters.',
    recommendedMode: 'AI Quiz or Quick Problem Solving',
    cardFilterKeys: ['Day 14', 'Day 10', 'AI Optimized'],
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
    cardFilterKeys: ['Day 30', 'Permanent', 'Mastered'],
  },
];

export default function Revision() {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState('All Subjects');
  const [filterType, setFilterType] = useState('all');
  const [revisionCards, setRevisionCards] = useState(mockRevisionCards);
  const [activeIntervalIndex, setActiveIntervalIndex] = useState(1);

  // Modals state
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTarget, setReminderTarget] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTopicForKeyPoints, setSelectedTopicForKeyPoints] = useState(null);
  const [selectedTopicForQuiz, setSelectedTopicForQuiz] = useState(null);

  const subjects = [
    { id: 'all', name: 'All Subjects', icon: '📚' },
    { id: 'Organic Chemistry II', name: 'Organic Chemistry II', icon: '🧬', code: 'CHEM-302' },
    { id: 'Linear Algebra', name: 'Linear Algebra', icon: '📐', code: 'MATH-204' },
    { id: 'Cognitive Neuroscience', name: 'Cognitive Neuroscience', icon: '🧠', code: 'NEUR-410' },
  ];

  // Filtered cards
  const filteredCards = revisionCards.filter(card => {
    const matchesSubject = activeSubject === 'All Subjects' || card.subject === activeSubject;
    if (!matchesSubject) return false;
    if (filterType === 'all') return true;
    if (filterType === 'decaying') return card.decayStatus === 'decaying';
    if (filterType === 'ai') return card.type === 'ai';
    if (filterType === 'manual') return card.type === 'manual';
    return true;
  });

  const handleOpenReminder = (item) => {
    setReminderTarget(item || { id: 'rev-schedule', name: activeSubject, subject: activeSubject });
    setShowReminderModal(true);
  };

  const handleCreateRevision = (newCard) => {
    setRevisionCards(prev => [newCard, ...prev]);
  };

  const handleRedirectToNotes = (card) => {
    const subjectParam = encodeURIComponent(card.subject);
    const fileParam = card.noteFileId ? `&fileId=${card.noteFileId}` : '';
    navigate(`/notes?subject=${subjectParam}${fileParam}&mode=manual`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      
      {/* Top Spatial Header & Ebbinghaus Sync Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-muted))] gap-3">
        <div className="flex items-center gap-1.5 truncate">
          <span>SCHOLAR REPOSITORY</span>
          <span>/</span>
          <span className="text-[rgb(var(--color-text))] font-semibold">Revision Hub</span>
          <span>/</span>
          <span className="px-1.5 py-0.5 rounded bg-[rgb(var(--color-container-high))] text-[rgb(var(--color-primary))] font-bold">
            Ebbinghaus Matrix v4.8
          </span>
          <span>/</span>
          <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-semibold truncate">{activeSubject}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-[rgb(var(--color-container-low))] px-3 py-1 rounded-full border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]">
            <span className="w-2 h-2 rounded-full bg-[rgb(var(--color-secondary))] animate-pulse" />
            <span className="font-bold text-[10px] tracking-wider uppercase text-[rgb(var(--color-secondary))]">Decay Engine Live</span>
            <span className="text-[10px] hidden md:inline">• Next Decay Evaluation: 04:12 UTC</span>
          </div>

          <button
            onClick={() => handleOpenReminder(null)}
            className="px-3.5 py-1.5 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] text-xs border border-[rgb(var(--color-border))] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 font-medium"
          >
            <Clock size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>Spaced Settings</span>
          </button>
        </div>
      </div>

      {/* Hero Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#9e3c26] dark:text-[#ffb4a3] font-bold mb-1">
            <Brain size={14} />
            <span>ADAPTIVE SPACED REPETITION & DUAL SYNTHESIS</span>
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
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-[#9e3c26]/25 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>+ Create Revision</span>
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

      {/* 3 Core Revision Modalities Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9e3c26] dark:bg-[#ffb4a3]" />
            <h3 className="font-bold text-xs sm:text-sm text-[rgb(var(--color-text))]">
              3 Adaptive Pathways to Revise Any Topic
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">Select on any card below</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Modality 1 */}
          <div className="p-3.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))]">
                <Sparkles size={14} />
              </span>
              <span className="font-bold text-xs text-[rgb(var(--color-text))]">1. AI Key Points</span>
            </div>
            <p className="text-[11px] text-[rgb(var(--color-muted))] leading-relaxed">
              Auto-extracted high-yield synthesis bullets, core formulas, and memory anchors.
            </p>
          </div>

          {/* Modality 2 */}
          <div className="p-3.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3]">
                <Brain size={14} />
              </span>
              <span className="font-bold text-xs text-[rgb(var(--color-text))]">2. AI Practice Quiz</span>
            </div>
            <p className="text-[11px] text-[rgb(var(--color-muted))] leading-relaxed">
              Interactive quiz sprint that evaluates proficiency score (%) and refreshes decay.
            </p>
          </div>

          {/* Modality 3 */}
          <div className="p-3.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400">
                <BookOpen size={14} />
              </span>
              <span className="font-bold text-xs text-[rgb(var(--color-text))]">3. Manual Revision</span>
            </div>
            <p className="text-[11px] text-[rgb(var(--color-muted))] leading-relaxed">
              Redirects directly into the original document in Notes Vault for deep reading.
            </p>
          </div>
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
            <span>Decay Curve Health</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-[rgb(var(--color-secondary))] mt-1.5">91.4%</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">3 topics near recall threshold</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Due For AI Re-test</span>
            <AlertTriangle size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#9e3c26] dark:text-[#ffb4a3] mt-1.5">12</div>
          <div className="text-[11px] font-mono text-[#9e3c26] dark:text-[#ffb4a3] mt-1 font-medium">Spectroscopy & NMR priority</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Topics in Queue</span>
            <CheckCircle2 size={13} className="text-[rgb(var(--color-tertiary))]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[rgb(var(--color-tertiary))] mt-1.5">{revisionCards.length}</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">Across active disciplines</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
          <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-semibold flex items-center justify-between">
            <span>Retention Efficiency</span>
            <Sparkles size={13} className="text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1.5">+22%</div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">SuperMemo-2 interval boost</div>
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
              { id: 'decaying', label: 'Decay Critical' },
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

                  {/* Decay Score Progress */}
                  <div className="space-y-1 mb-4 p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[rgb(var(--color-muted))]">Recall Stability:</span>
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
                      onClick={() => setSelectedTopicForQuiz(card)}
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
                      title="Redirect to full notes in vault"
                    >
                      <BookOpen size={11} />
                      <span>Manual</span>
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
          const stageMatchingCards = filteredCards.filter(c => 
            currentStage.cardFilterKeys.some(key => 
              c.progress?.toLowerCase().includes(key.toLowerCase()) || 
              c.badge?.toLowerCase().includes(key.toLowerCase()) ||
              (key === 'decaying' && c.decayStatus === 'decaying')
            )
          );

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
                      onClick={() => {
                        const target = stageMatchingCards[0] || filteredCards[0];
                        if (target) setSelectedTopicForQuiz(target);
                      }}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#9e3c26] hover:bg-[#be543c] text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                    >
                      <Sparkles size={11} />
                      <span>AI Quiz</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = stageMatchingCards[0] || filteredCards[0];
                        if (target) setSelectedTopicForKeyPoints(target);
                      }}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))] hover:opacity-90 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
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
                            onClick={() => setSelectedTopicForQuiz(c)}
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
                        No topics currently queued for this interval. Use "+ Create Revision" above to schedule a new chapter.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>+ Schedule a Topic for {currentStage.day}</span>
                  </button>
                </div>

              </div>

              {/* Intuitive Cramming vs Spacing Strip */}
              <div className="pt-3 border-t border-[rgb(var(--color-border))] flex flex-col sm:flex-row items-center justify-between text-xs text-[rgb(var(--color-muted))] gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[rgb(var(--color-text))]">💡 Pro-Tip:</span>
                  <span>5 short 3-minute reviews (15 mins total) yields 95% retention vs 5 hours of cramming (which drops to 20% in 72 hours).</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="font-bold text-[#9e3c26] dark:text-[#ffb4a3] hover:underline cursor-pointer shrink-0 text-xs flex items-center gap-1"
                >
                  <span>Create Spaced Schedule</span>
                  <ArrowRight size={12} />
                </button>
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
            setSelectedTopicForQuiz(item);
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
        defaultSubject={activeSubject === 'All Subjects' ? 'Organic Chemistry II' : activeSubject}
        onCreate={handleCreateRevision}
      />

      {/* Spaced Revision Reminder Modal */}
      {showReminderModal && (
        <RevisionReminderModal
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          targetItem={reminderTarget}
          onSave={(schedule) => {
            alert(`Spaced schedule configured for ${reminderTarget?.name || activeSubject}: Basis = ${schedule.type.toUpperCase()}`);
          }}
        />
      )}

    </div>
  );
}
