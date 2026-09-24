import React, { useState } from 'react';
import { 
  StatsCards, VolumeAndCircadian, RetentionCurveSection, 
  ThirtyDayFocusBarChart, SynchronousArenaTable 
} from '../features/analytics/AnalyticsComponents';
import { Download, Sparkles, ChevronDown, Check } from 'lucide-react';
import { mockStats } from '../data/mockStats';

export default function Analytics() {
  const [period, setPeriod] = useState('30D');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState('All');
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExportReport = () => {
    const reportText = `=====================================================
RIVISONLY • STUDY ANALYTICS REPORT (${period})
Generated: ${new Date().toLocaleDateString()}
Selected Filter: ${activeSubjectFilter}
=====================================================

1. STUDY PERFORMANCE OVERVIEW:
- Total Study Hours: ${mockStats.cumulativeFocus.hours} hrs (${mockStats.cumulativeFocus.delta})
- Monthly Goal: ${mockStats.cumulativeFocus.goal} hrs (${mockStats.cumulativeFocus.progress}% completed)
- Memory Retention Rate: ${mockStats.spacedMastery.rate}% (${mockStats.spacedMastery.delta})
- Study Sessions Completed: ${mockStats.focusCadence.sessions} (Avg ${mockStats.focusCadence.dailyAvg} / day)
- Deep Focus Quality: ${mockStats.focusCadence.focusQuality}%

2. QUIZ DUEL STATS:
- Global Duel Rating: ${mockStats.quizArena.rating} (${mockStats.quizArena.rankTier} Tier)
- Record: ${mockStats.quizArena.wins} Wins / ${mockStats.quizArena.losses} Losses (${mockStats.quizArena.winRate}% Win Rate)
- Current Streak: ${mockStats.quizArena.streak}
- Average Answer Speed: ${mockStats.overallVelocity}

3. SUBJECT TIME BREAKDOWN:
${mockStats.subjectVolume.map(s => `- ${s.name}: ${s.hours} hrs / ${s.targetHours}h goal (${s.masteryRate}% mastery, Grade: ${s.grade})`).join('\n')}

=====================================================
Keep up the consistent reviews to maximize long-term retention!
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RivisOnly_Study_Report_${period}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono tracking-widest uppercase text-[rgb(var(--color-muted))] flex items-center gap-1.5 mb-1 font-semibold">
            <span>STUDY ANALYTICS & INSIGHTS</span>
            <span>•</span>
            <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-bold">CURRENT SEMESTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--color-text))]">
            Study Performance & Learning Progress
          </h1>
          <div className="mt-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))]">
              Rank: Top 2% of Learners Globally
            </span>
          </div>
        </div>

        {/* Controls: Period filters, Subject selector, Export button */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Period selector */}
          <div className="inline-flex p-1 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] shadow-inner">
            {['7D', '30D', '90D', 'ALL'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  period === p
                    ? 'bg-[rgb(var(--color-card))] font-bold text-[#9e3c26] dark:text-[#ffb4a3] shadow-xs'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Subject selector */}
          <div className="relative">
            <select
              value={activeSubjectFilter}
              onChange={(e) => setActiveSubjectFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26] appearance-none pr-8 cursor-pointer shadow-xs"
            >
              <option value="All">All Subjects (4 Active)</option>
              <option value="Organic Chemistry II">Organic Chemistry II</option>
              <option value="Linear Algebra">Linear Algebra</option>
              <option value="Cognitive Neuroscience">Cognitive Neuroscience</option>
              <option value="Macroeconomics">Macroeconomics</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[rgb(var(--color-muted))]" />
          </div>

          {/* Export Report button */}
          <button
            onClick={handleExportReport}
            className={`px-4 py-2 rounded-xl font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              exported 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white shadow-[#9e3c26]/20'
            }`}
          >
            {exported ? <Check size={13} /> : <Download size={13} />}
            <span>{exported ? 'Report Downloaded!' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <StatsCards period={period} selectedSubject={activeSubjectFilter} />

      {/* Time Allocation & Retention Curve Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <VolumeAndCircadian 
            selectedSubject={activeSubjectFilter} 
            onSelectSubject={setActiveSubjectFilter} 
          />
        </div>
        <div className="lg:col-span-6">
          <RetentionCurveSection selectedSubject={activeSubjectFilter} />
        </div>
      </div>

      {/* Daily Focus Minutes & Consistency */}
      <ThirtyDayFocusBarChart period={period} />

      {/* Head-to-Head Duels & Subject Accuracy */}
      <SynchronousArenaTable selectedSubject={activeSubjectFilter} />

      {/* Bottom Personalized Study Tip Alert Banner */}
      {!alertDismissed && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#9e3c26]/10 via-[rgb(var(--color-container-low))] to-transparent border border-[#9e3c26]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9e3c26] dark:bg-[#e26f54] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[rgb(var(--color-text))]">
                Smart Study Recommendation
              </h3>
              <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
                Recommended focus adjustment: Allocate +25 minutes to Linear Algebra (Orthogonal Projections) before Friday's review deadline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAlertDismissed(true)}
              className="px-3.5 py-1.5 rounded-xl border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container))] transition-colors cursor-pointer bg-[rgb(var(--color-card))]"
            >
              Dismiss
            </button>
            <button
              onClick={() => alert('Queued 15-Card Review for Linear Algebra in Revision Hub!')}
              className="px-4 py-1.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
            >
              Queue 15-Card Review
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
