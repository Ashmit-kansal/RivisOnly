import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Line, Area, CartesianGrid, ComposedChart, ReferenceLine, Cell
} from 'recharts';
import ProgressBar from '../../components/ui/ProgressBar';
import Modal from '../../components/ui/Modal';
import { mockStats } from '../../data/mockStats';
import {
  Hourglass, Brain, Swords, Clock, TrendingUp, Flame,
  CheckCircle2, ChevronRight, Sparkles, BookOpen, ArrowRight,
  Info, Zap, Calendar, Sun, Moon, Coffee, ShieldCheck,
  AlertTriangle, Filter, Target, Award
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 1. TOP STAT CARDS (KPIs)                                                  */
/* -------------------------------------------------------------------------- */
export function StatsCards({ period = '30D', selectedSubject = 'All' }) {
  const { cumulativeFocus, spacedMastery, quizArena, focusCadence, subjectVolume } = mockStats;

  // Filter stats if a specific subject is selected
  const activeSubjData = selectedSubject !== 'All'
    ? subjectVolume.find(s => s.name === selectedSubject)
    : null;

  const displayHours = activeSubjData ? activeSubjData.hours : cumulativeFocus.hours;
  const displayGoal = activeSubjData ? activeSubjData.targetHours : cumulativeFocus.goal;
  const displayProgress = activeSubjData
    ? Math.min(100, Math.round((activeSubjData.hours / activeSubjData.targetHours) * 100))
    : cumulativeFocus.progress;
  const displayRetention = activeSubjData ? activeSubjData.masteryRate : spacedMastery.rate;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

      {/* 1. Total Study Time */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs hover:border-[#9e3c26]/30 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">
            {activeSubjData ? `${activeSubjData.name.split(' ')[0]} Time` : 'Total Study Time'}
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#9e3c26]/10 dark:bg-[#e26f54]/15 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center">
            <Hourglass size={15} />
          </div>
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold tracking-tight font-mono text-[rgb(var(--color-text))]">
            {displayHours} <span className="text-base font-normal text-[rgb(var(--color-muted))]">hrs</span>
          </div>
          <div className="text-xs text-[rgb(var(--color-secondary))] font-mono mt-1.5 flex items-center gap-1.5 font-medium">
            <TrendingUp size={13} />
            <span>{activeSubjData ? `${displayProgress}% of ${displayGoal}h target` : cumulativeFocus.delta}</span>
          </div>
        </div>
        <div className="pt-2">
          <ProgressBar value={displayProgress} height="h-2" color="bg-[#9e3c26] dark:bg-[#e26f54]" />
        </div>
      </div>

      {/* 2. Memory Retention Rate */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs hover:border-[rgb(var(--color-secondary))]/30 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">Memory Retention Rate</span>
          <div className="w-8 h-8 rounded-xl bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] flex items-center justify-center">
            <Brain size={15} />
          </div>
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold tracking-tight font-mono text-[rgb(var(--color-secondary))]">
            {displayRetention}%
          </div>
          <div className="text-xs text-[rgb(var(--color-secondary))] font-mono mt-1.5 flex items-center gap-1.5 font-medium">
            <Sparkles size={13} />
            <span>Spaced Review Score ({spacedMastery.delta})</span>
          </div>
        </div>
        <div className="flex gap-1.5 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 h-2 rounded-full bg-[rgb(var(--color-secondary))]" />
          ))}
        </div>
      </div>

      {/* 3. 1v1 Quiz Duels */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs hover:border-[#9e3c26]/30 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">1v1 Quiz Duels</span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Swords size={15} />
          </div>
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-bold tracking-tight font-mono text-[rgb(var(--color-text))]">
              {quizArena.rating.toLocaleString()}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))]">
              {quizArena.rankTier}
            </span>
          </div>
          <div className="text-xs text-[rgb(var(--color-muted))] font-mono mt-1.5">
            <strong className="text-[rgb(var(--color-text))]">{quizArena.wins}W / {quizArena.losses}L</strong> ({quizArena.winRate}% Win Rate)
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))] pt-2 border-t border-[rgb(var(--color-border))]/60">
          <span>Rank #{quizArena.globalRank} Globally</span>
          <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-bold">Streak: {quizArena.streak}</span>
        </div>
      </div>

      {/* 4. Study Sessions */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs hover:border-sky-500/30 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">Study Sessions</span>
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Clock size={15} />
          </div>
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold tracking-tight font-mono text-[rgb(var(--color-text))]">
            {focusCadence.sessions} <span className="text-base font-normal text-[rgb(var(--color-muted))]">sessions</span>
          </div>
          <div className="text-xs text-[rgb(var(--color-muted))] font-mono mt-1.5">
            {focusCadence.dailyAvg} sessions / day average
          </div>
        </div>
        <div className="text-[11px] font-mono text-[rgb(var(--color-secondary))] flex items-center gap-1.5 font-medium pt-2 border-t border-[rgb(var(--color-border))]/60">
          <span className="w-2 h-2 rounded-full bg-[rgb(var(--color-secondary))] animate-pulse" />
          <span>Deep focus quality ({focusCadence.focusQuality}%)</span>
        </div>
      </div>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. SUBJECT TIME ALLOCATION & COURSE MASTERY SECTION                       */
/* -------------------------------------------------------------------------- */
export function SubjectVolumeSection({ selectedSubject = 'All', onSelectSubject }) {
  const { subjectVolume } = mockStats;
  const totalHours = subjectVolume.reduce((acc, s) => acc + s.hours, 0);

  const handleCardClick = (subjName) => {
    if (onSelectSubject) {
      onSelectSubject(selectedSubject === subjName ? 'All' : subjName);
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgb(var(--color-border))]">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
            <BookOpen size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>COURSE WORKLOAD & MASTERY BREAKDOWN</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-text))] mt-1">
            Study Time by Course
          </h3>
          <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] mt-0.5">
            Click any course card to filter analytics, or view balanced distribution across all active subjects.
          </p>
        </div>

        <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between sm:justify-center gap-2 bg-[rgb(var(--color-container-low))] px-4 py-2.5 rounded-xl border border-[rgb(var(--color-border))] shrink-0">
          <div className="text-lg sm:text-xl font-bold font-mono text-[rgb(var(--color-text))]">
            {totalHours} hrs logged
          </div>
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <Target size={12} />
            <span>92% of 200h Target</span>
          </div>
        </div>
      </div>

      {/* Proportional Subject Breakdown Progress Bar */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[rgb(var(--color-muted))]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[rgb(var(--color-text))]">Time Distribution:</span>
            {selectedSubject !== 'All' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] font-bold border border-[#9e3c26]/20">
                <span>Active Filter: {selectedSubject}</span>
                <button
                  type="button"
                  onClick={() => onSelectSubject && onSelectSubject('All')}
                  className="hover:opacity-75 cursor-pointer ml-1"
                  title="Clear filter"
                >
                  ✕
                </button>
              </span>
            ) : (
              <span className="text-[rgb(var(--color-muted))]">All 4 courses active</span>
            )}
          </div>
          <span className="text-[11px] text-[rgb(var(--color-muted))]">Click segment or card to filter</span>
        </div>

        <div className="w-full h-5 rounded-xl overflow-hidden flex p-1 bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] gap-1 shadow-inner">
          {subjectVolume.map((subj) => {
            const isSelected = selectedSubject === subj.name;
            return (
              <div
                key={subj.name}
                onClick={() => handleCardClick(subj.name)}
                className={`h-full rounded-lg transition-all cursor-pointer relative group flex items-center justify-center ${isSelected
                    ? 'ring-2 ring-[#9e3c26] ring-offset-1 scale-y-110 z-10 shadow-sm'
                    : 'hover:opacity-90 hover:brightness-105'
                  }`}
                style={{ width: `${subj.percentage}%`, backgroundColor: subj.color }}
                title={`${subj.name}: ${subj.hours}h (${subj.percentage}%)`}
              >
                {subj.percentage >= 15 && (
                  <span className="text-[10px] font-mono font-bold text-white drop-shadow-xs px-1 truncate select-none">
                    {subj.percentage}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Spacious Subject Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjectVolume.map((subj) => {
          const isSelected = selectedSubject === subj.name;
          const targetPct = Math.round((subj.hours / subj.targetHours) * 100);

          return (
            <div
              key={subj.name}
              onClick={() => handleCardClick(subj.name)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${isSelected
                  ? 'border-[#9e3c26] bg-[#9e3c26]/5 dark:bg-[#9e3c26]/10 ring-2 ring-[#9e3c26]/40 shadow-md'
                  : 'bg-[rgb(var(--color-container-low))] border-[rgb(var(--color-border))] hover:border-[#9e3c26]/40 hover:bg-[rgb(var(--color-card))]'
                }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3.5 h-3.5 rounded-lg shrink-0 shadow-xs" style={{ backgroundColor: subj.color }} />
                    <div className="font-bold text-sm text-[rgb(var(--color-text))] truncate">
                      {subj.name}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] shrink-0">
                    {subj.grade}
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs font-mono my-2">
                  <span className="text-xl font-bold text-[rgb(var(--color-text))]">{subj.hours} <span className="text-xs font-normal text-[rgb(var(--color-muted))]">hrs</span></span>
                  <span className="text-[rgb(var(--color-muted))]">{subj.percentage}% share</span>
                </div>

                {/* Progress towards target */}
                <div className="space-y-1.5 mt-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))]">
                    <span>Goal: {subj.targetHours}h</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {targetPct}% met
                    </span>
                  </div>
                  <ProgressBar
                    value={subj.hours}
                    max={subj.targetHours}
                    height="h-2"
                    color={subj.color}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[rgb(var(--color-border))]/60 flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))]">
                <span className="flex items-center gap-1">
                  <Award size={12} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                  <span>{subj.topicsLearned} active topics</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{subj.masteryRate}% mastery</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. CIRCADIAN RHYTHM & COGNITIVE FLOW SECTION (FEATURED)                  */
/* -------------------------------------------------------------------------- */
export function CircadianRhythmSection({ selectedSubject = 'All' }) {
  const { hourlyFocusCurve } = mockStats;

  return (
    <div className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgb(var(--color-border))]">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
            <Clock size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>DAILY PEAK FOCUS WINDOWS (CIRCADIAN RHYTHM)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-text))] mt-1">
            Cognitive Energy & Time-of-Day Rhythm
          </h3>
          <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] mt-0.5">
            Tracks mental sharpness throughout 24 hours so you can schedule complex problem sets during high-velocity windows.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Zap size={14} />
            <span>2 Peak Windows Identified</span>
          </span>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left Column: Peak Opportunities & Schedule Strategy (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">

          {/* 2 Golden Focus Opportunity Cards */}
          <div className="space-y-3">
            {/* Morning Deep Work Window */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#9e3c26]/10 via-[rgb(var(--color-container-low))] to-transparent border border-[#9e3c26]/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#9e3c26] text-white flex items-center justify-center shrink-0">
                    <Sun size={15} />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-[rgb(var(--color-text))]">Morning Deep Work Window</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#9e3c26] text-white">
                  98% Focus
                </span>
              </div>
              <div className="text-base font-bold font-mono text-[#9e3c26] dark:text-[#ffb4a3] pl-1">
                09:00 AM – 12:00 PM
              </div>
              <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed pl-1">
                Highest analytical clarity of the day. <strong>54 hours logged.</strong> Best for mastering reaction mechanisms, mathematical proofs, and dense textbook synthesis.
              </p>
            </div>

            {/* Evening Sprint Window */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-[rgb(var(--color-container-low))] to-transparent border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Flame size={15} />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-[rgb(var(--color-text))]">Evening Sprint Window</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500 text-white">
                  95% Speed
                </span>
              </div>
              <div className="text-base font-bold font-mono text-amber-700 dark:text-amber-400 pl-1">
                08:00 PM – 11:00 PM
              </div>
              <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed pl-1">
                Fastest retrieval response speed. <strong>46 hours logged.</strong> Ideal for active recall: 1v1 live quiz duels, rapid flashcard check-ins, and spaced repetition queues.
              </p>
            </div>
          </div>

          {/* Actionable Strategy Tip */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-[rgb(var(--color-container-low))] to-transparent border border-amber-500/20 text-xs text-[rgb(var(--color-muted))] flex items-start gap-2.5">
            <span className="text-amber-500 font-bold shrink-0 mt-0.5">💡 Strategy:</span>
            <span>
              Reserve your <strong>09:00 – 12:00</strong> window strictly for heavy cognitive loads, leaving rapid 1v1 quizzes or flashcards for <strong>20:00 – 23:00</strong>.
            </span>
          </div>

        </div>

        {/* Right Column: 24-Hour Cognitive Energy Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex flex-col justify-between space-y-4">

          {/* Chart Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div>
              <span className="font-bold text-sm text-[rgb(var(--color-text))]">Cognitive Energy by Hour (24H Timeline)</span>
              <div className="text-[11px] text-[rgb(var(--color-muted))] mt-0.5">Hover any bar for focus score and recommended task</div>
            </div>

            <div className="flex items-center gap-2.5 text-[10px] flex-wrap">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#9e3c26]" /> ≥90% Peak</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> 80–89% Deep</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-600" /> 60–79% Steady</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-sky-500/50" /> Rest</span>
            </div>
          </div>

          {/* Recharts Bar Chart (Taller, spacious, responsive) */}
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourlyFocusCurve || []}
                margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: 'rgb(var(--color-muted))' }}
                  stroke="rgb(var(--color-border))"
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 100]}
                  width={34}
                  tick={{ fontSize: 10, fill: 'rgb(var(--color-muted))' }}
                  stroke="rgb(var(--color-border))"
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(val, name, item) => [
                    `${val}% Focus • ${item?.payload?.activity || ''}`,
                    'Focus Rating'
                  ]}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: 'rgb(var(--color-card))',
                    borderColor: 'rgb(var(--color-border))',
                    fontSize: '11px',
                    borderRadius: '10px',
                    color: 'rgb(var(--color-text))',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                  }}
                />
                <ReferenceLine
                  y={90}
                  stroke="#9e3c26"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Peak Flow (90%)',
                    fill: '#9e3c26',
                    fontSize: 10,
                    position: 'insideTopRight'
                  }}
                />
                <Bar dataKey="focus" radius={[4, 4, 0, 0]}>
                  {(hourlyFocusCurve || []).map((entry, index) => {
                    let fill = '#94a3b8';
                    if (entry.focus >= 90) fill = '#9e3c26';
                    else if (entry.focus >= 80) fill = '#d97706';
                    else if (entry.focus >= 60) fill = '#059669';
                    else if (entry.focus > 0) fill = '#0284c7';
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Time Zone Segment Ribbon (Responsive 2x2 or 4x1) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono pt-2 border-t border-[rgb(var(--color-border))]/60">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-800 dark:text-sky-300">
              <div className="font-bold flex items-center justify-center gap-1.5"><Moon size={12} /> Night</div>
              <div className="text-[10px] opacity-80 mt-0.5">11 PM – 6 AM • Sleep</div>
            </div>
            <div className="p-2 rounded-xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3]">
              <div className="font-bold flex items-center justify-center gap-1.5"><Sun size={12} /> Morning</div>
              <div className="text-[10px] opacity-80 mt-0.5">6 AM – 12 PM • 92% Focus</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300">
              <div className="font-bold flex items-center justify-center gap-1.5"><Coffee size={12} /> Afternoon</div>
              <div className="text-[10px] opacity-80 mt-0.5">12 PM – 6 PM • 78% Focus</div>
            </div>
            <div className="p-2 rounded-xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3]">
              <div className="font-bold flex items-center justify-center gap-1.5"><Flame size={12} /> Evening</div>
              <div className="text-[10px] opacity-80 mt-0.5">6 PM – 11 PM • 94% Focus</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

/* Backward-compatible alias */
export function VolumeAndCircadian(props) {
  return (
    <div className="space-y-6">
      <SubjectVolumeSection {...props} />
      <CircadianRhythmSection {...props} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. MEMORY HEALTH & SPACED RETENTION CURVE SECTION                         */
/* -------------------------------------------------------------------------- */
export function RetentionCurveSection({ selectedSubject = 'All' }) {
  const { retentionCurve, upcomingSchedule, memoryHealth } = mockStats;
  const [selectedForecastDay, setSelectedForecastDay] = useState('Mon');
  const [showExplainer, setShowExplainer] = useState(false);

  // Custom interactive tooltip
  const CustomRetentionTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const difference = data.aiRetention - data.unprompted;
      return (
        <div className="p-3.5 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-2xl text-xs font-mono space-y-2 z-50">
          <div className="font-bold text-[rgb(var(--color-text))] flex items-center justify-between gap-4 border-b border-[rgb(var(--color-border))] pb-1.5">
            <span className="text-sm">{data.day}</span>
            <span className="text-[11px] text-[#9e3c26] dark:text-[#ffb4a3] font-semibold">{data.stage}</span>
          </div>
          <div className="flex items-center justify-between gap-5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>🟢 With Rivisonly Spaced Reviews:</span>
            <span className="font-bold">{data.aiRetention}% Remembered</span>
          </div>
          <div className="flex items-center justify-between gap-5 text-red-600 dark:text-red-400">
            <span>🔴 Without Review (Natural Decay):</span>
            <span className="font-bold">{data.unprompted}% Remembered</span>
          </div>
          <div className="pt-1.5 border-t border-[rgb(var(--color-border))]/60 text-[11px] text-[rgb(var(--color-muted))] leading-relaxed">
            <strong className="text-emerald-600 dark:text-emerald-400">+{difference}% Retention Gain</strong> • {data.tip}
          </div>
        </div>
      );
    }
    return null;
  };

  const selectedDayData = upcomingSchedule.find(s => s.day === selectedForecastDay) || upcomingSchedule[0];

  return (
    <div className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgb(var(--color-border))]">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
              <Brain size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
              <span>ACTIVE RETENTION & FORGETTING PREVENTION</span>
            </div>
            {/* Info Icon Button */}
            <button
              type="button"
              onClick={() => setShowExplainer(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 transition-all cursor-pointer shadow-2xs"
              title="Click to view explanation: What is this data, how is it used, and how is it calculated?"
            >
              <Info size={11} />
              <span>How it works</span>
            </button>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-text))] mt-1">
            Memory Health & Spaced Review Tracker
          </h3>
          <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] mt-0.5">
            Visualizing retention decay vs spaced reviews to prevent steep forgetting slopes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck size={14} />
            <span>91.4% Overall Recall</span>
          </div>
        </div>
      </div>

      {/* 2-Column Balanced Layout: Chart & Topics on Left (7 cols), Forecast & Plan on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: 30-Day Trajectory Curve + 3 Health Tiers (7 cols) */}
        <div className="lg:col-span-7 space-y-5">

          {/* 30-Day Memory Trajectory Curve */}
          <div className="p-4 sm:p-5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono text-[rgb(var(--color-muted))]">
              <span className="font-bold text-sm text-[rgb(var(--color-text))]">30-Day Memory Trajectory (Your Recall vs Natural Decay)</span>
              <span className="text-[11px]">Hover data points to see advantage</span>
            </div>

            <div className="h-60 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={retentionCurve} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="aiRetentionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2d7d46" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2d7d46" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'rgb(var(--color-muted))' }} stroke="rgb(var(--color-border))" />
                  <YAxis
                    domain={[0, 100]}
                    width={34}
                    tick={{ fontSize: 10, fill: 'rgb(var(--color-muted))' }}
                    stroke="rgb(var(--color-border))"
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomRetentionTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="aiRetention"
                    stroke="#2d7d46"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#aiRetentionGrad)"
                    name="With Rivisonly Reviews"
                    dot={{ r: 3.5, fill: '#2d7d46', strokeWidth: 1.5, stroke: '#fff' }}
                    activeDot={{ r: 5, fill: '#2d7d46' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="unprompted"
                    stroke="#c84b31"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#c84b31' }}
                    name="Without Review"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Visual Chart Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono text-[rgb(var(--color-muted))] border-t border-[rgb(var(--color-border))]/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                <span className="font-semibold text-[rgb(var(--color-text))]">With Rivisonly Reviews (~91% Retained)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 border-b-2 border-dashed border-red-500 inline-block" />
                <span className="font-semibold text-[rgb(var(--color-text))]">Without Review (Drops to ~12%)</span>
              </div>
            </div>
          </div>

          {/* Real Topic Memory Health Breakdown (3 Tiers) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-sm text-[rgb(var(--color-text))]">Knowledge Base Memory Health</span>
              <span className="text-[rgb(var(--color-muted))]">37 Topics Tracked</span>
            </div>

            {/* 3 Tier Health Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Permanent Memory */}
              <div className="p-3.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck size={14} />
                    <span>Permanent</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    85–100%
                  </span>
                </div>
                <div className="font-mono text-base font-bold text-[rgb(var(--color-text))]">
                  24 Topics <span className="text-xs font-normal text-[rgb(var(--color-muted))]">(65%)</span>
                </div>
                <div className="text-[10px] font-mono text-[rgb(var(--color-muted))] truncate pt-1 border-t border-[rgb(var(--color-border))]/50">
                  Eigenvalues, CIP Rules, FT-NMR
                </div>
              </div>

              {/* Stable Recall */}
              <div className="p-3.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                    <CheckCircle2 size={14} />
                    <span>Stable Recall</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400">
                    70–84%
                  </span>
                </div>
                <div className="font-mono text-base font-bold text-[rgb(var(--color-text))]">
                  8 Topics <span className="text-xs font-normal text-[rgb(var(--color-muted))]">(22%)</span>
                </div>
                <div className="text-[10px] font-mono text-[rgb(var(--color-muted))] truncate pt-1 border-t border-[rgb(var(--color-border))]/50">
                  IS-LM Models, Meisenheimer
                </div>
              </div>

              {/* High Forgetting Risk */}
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-400">
                    <AlertTriangle size={14} />
                    <span>Needs Review</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-700 dark:text-red-400">
                    &lt;70%
                  </span>
                </div>
                <div className="font-mono text-base font-bold text-red-600 dark:text-red-400">
                  5 Topics <span className="text-xs font-normal text-red-700/70 dark:text-red-300/70">(13%)</span>
                </div>
                <div className="text-[10px] font-mono text-red-600 dark:text-red-400 truncate pt-1 border-t border-red-500/20 font-medium">
                  SNAr (62%), LTP (54%)
                </div>
              </div>
            </div>

            {/* Quick Action Link for At-Risk Topics */}
            <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="text-[rgb(var(--color-text))]">
                  <strong>5 topics</strong> have reached the steep forgetting threshold.
                </span>
              </div>
              <Link
                to="/revision"
                className="px-3.5 py-1.5 rounded-lg bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <span>Review At-Risk Topics (12 min)</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column: Upcoming 7-Day Review Schedule & Focus Plan (5 cols) */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-[rgb(var(--color-border))]/60">
            <div>
              <div className="text-sm font-bold text-[rgb(var(--color-text))] flex items-center gap-1.5">
                <Calendar size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                <span>7-Day Revision Load Forecast</span>
              </div>
              <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
                Short daily check-ins to maintain peak synaptic recall.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#9e3c26] dark:text-[#ffb4a3] shrink-0">
              142 Cards Due (~1h 15m)
            </span>
          </div>

          {/* 7-Day Clickable Pills (Clear grid) */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
            {upcomingSchedule.map((item) => {
              const isSelected = selectedForecastDay === item.day;
              return (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => setSelectedForecastDay(item.day)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${isSelected
                      ? 'border-[#9e3c26] bg-[#9e3c26]/10 dark:bg-[#9e3c26]/20 ring-1 ring-[#9e3c26]/30 shadow-xs'
                      : 'bg-[rgb(var(--color-card))] border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-container))]'
                    }`}
                >
                  <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">{item.day}</div>
                  <div className="text-sm font-bold font-mono text-[rgb(var(--color-text))] mt-0.5">
                    {item.count}
                  </div>
                  <div className={`text-[9px] font-mono mt-0.5 font-semibold ${item.isHeavy ? 'text-[#9e3c26] dark:text-[#ffb4a3]' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {item.isHeavy ? 'Heavy' : 'Light'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Day Inspector Box */}
          <div className="p-4 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#9e3c26] dark:text-[#ffb4a3] text-sm">
                {selectedDayData.day} Focus Plan:
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))]">
                {selectedDayData.estMinutes} mins total
              </span>
            </div>

            <div className="text-xs text-[rgb(var(--color-text))] font-medium">
              {selectedDayData.subjects}
            </div>

            <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] flex items-center justify-between pt-2 border-t border-[rgb(var(--color-border))]/60">
              <span>{selectedDayData.count} cards queued</span>
              <Link
                to="/revision"
                className="text-xs font-bold text-[#9e3c26] dark:text-[#ffb4a3] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Launch in Revision Hub</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Knowledge Stability Radar Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-[rgb(var(--color-card))] to-transparent border border-emerald-500/25 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[rgb(var(--color-text))] flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Knowledge Stability</span>
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">91.4% Secure</span>
            </div>
            <ProgressBar value={91.4} height="h-2" color="bg-emerald-600" />
            <p className="text-[11px] text-[rgb(var(--color-muted))] leading-relaxed pt-1">
              Active spaced intervals prevent up to <strong>70%</strong> of memory loss compared to traditional passive reading.
            </p>
          </div>

        </div>

      </div>

      {/* Comprehensive Retention & Forgetting Prevention Explainer Modal */}
      <Modal
        isOpen={showExplainer}
        onClose={() => setShowExplainer(false)}
        maxWidth="max-w-2xl"
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Brain size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[rgb(var(--color-text))]">
                Active Retention & Forgetting Prevention
              </h3>
              <p className="text-xs text-[rgb(var(--color-muted))] font-normal">
                How RivisOnly tracks memory strength, prevents forgetting, and schedules reviews
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-4 text-xs text-[rgb(var(--color-text))] pt-1">

          {/* Card 1: What is the Practical Use */}
          <div className="p-3.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-[rgb(var(--color-text))]">
              <Sparkles size={15} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
              <span>1. What is the practical use of this data?</span>
            </div>
            <p className="text-[rgb(var(--color-muted))] leading-relaxed">
              Without memory tracking, students waste up to <strong>70% of study time</strong> either re-reading material they already know, or discovering right before exams that they completely forgot earlier topics. This chart acts as your cognitive radar: it shows exactly which notes are cemented in permanent memory and flags the specific topics at risk of being forgotten right now.
            </p>
          </div>

          {/* Card 2: The Science */}
          <div className="p-3.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[rgb(var(--color-text))]">
              <TrendingUp size={15} className="text-emerald-600 dark:text-emerald-400" />
              <span>2. The Science: Why forgetting happens & how we stop it</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] leading-relaxed pt-0.5">
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 space-y-1">
                <strong className="text-red-700 dark:text-red-400 block font-semibold">🔴 Natural Forgetting Curve</strong>
                <span className="text-[rgb(var(--color-muted))]">
                  Without active retrieval, human memory drops by ~50% within 24 hours and ~70% within 3 days. Cramming gives an illusion of mastery, but vanishes days after tests.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <strong className="text-emerald-700 dark:text-emerald-400 block font-semibold">🟢 Spaced Active Recall</strong>
                <span className="text-[rgb(var(--color-muted))]">
                  Taking a quick 3-minute quiz test right as a topic dips near the forgetting threshold resets recall to 95%+. Repeating this at spaced intervals (Days 1, 3, 7, 14, 30) locks facts into permanent synaptic memory.
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: How Data is Calculated */}
          <div className="p-3.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[rgb(var(--color-text))]">
              <Zap size={15} className="text-amber-500" />
              <span>3. How is your retention data calculated?</span>
            </div>
            <p className="text-[rgb(var(--color-muted))] leading-relaxed">
              Retention percentages are dynamically generated from your active learning signals across all <strong>37 course topics</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
              <div className="p-2.5 rounded-lg bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))]">
                <div className="font-bold text-[rgb(var(--color-text))]">⚔️ Quiz Duels</div>
                <div className="text-[10px] text-[rgb(var(--color-muted))] mt-0.5">
                  40 1v1 arena matches evaluate answer accuracy and response latency.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))]">
                <div className="font-bold text-[rgb(var(--color-text))]">🃏 Revision Cards</div>
                <div className="text-[10px] text-[rgb(var(--color-muted))] mt-0.5">
                  Scheduled recall check-ins push the review interval further into the future.
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))]">
                <div className="font-bold text-[rgb(var(--color-text))]">⏳ Time Elapsed</div>
                <div className="text-[10px] text-[rgb(var(--color-muted))] mt-0.5">
                  Scores steadily decline over days without practice until you review again.
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Memory Tiers Breakdown */}
          <div className="p-3.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-2">
            <div className="font-bold text-sm text-[rgb(var(--color-text))] flex items-center gap-2">
              <ShieldCheck size={15} className="text-blue-500" />
              <span>4. Understanding the 3 Memory Health Tiers</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 shrink-0">
                  85–100%
                </span>
                <div>
                  <strong className="text-[rgb(var(--color-text))]">Permanent Memory (24 Topics):</strong> Stabilized through multiple successful spaced reviews. Safe from forgetting for 30+ days.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 shrink-0">
                  70–84%
                </span>
                <div>
                  <strong className="text-[rgb(var(--color-text))]">Stable Recall (8 Topics):</strong> Solid comprehension. Next short check-in scheduled in 3–5 days.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-700 dark:text-red-400 shrink-0">
                  &lt;70%
                </span>
                <div>
                  <strong className="text-[rgb(var(--color-text))]">Needs Review Today (5 Topics):</strong> Reached the steep forgetting slope. Taking a quick 3-minute quiz today restores recall back to 95%+.
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Action */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[rgb(var(--color-border))]">
            <button
              type="button"
              onClick={() => setShowExplainer(false)}
              className="px-4 py-2 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
            >
              Got it, Close
            </button>
          </div>

        </div>
      </Modal>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. THIRTY DAY FOCUS BAR CHART                                             */
/* -------------------------------------------------------------------------- */
export function ThirtyDayFocusBarChart({ period = '30D' }) {
  const { thirtyDayMinutes } = mockStats;

  // Adapt data based on period
  const chartData = period === '7D'
    ? thirtyDayMinutes.slice(-7)
    : thirtyDayMinutes;

  const totalMinutes = chartData.reduce((acc, d) => acc + d.minutes, 0);
  const avgMinutes = Math.round(totalMinutes / (chartData.length || 1));
  const daysMetGoal = chartData.filter(d => d.minutes >= 180).length;

  return (
    <div className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[rgb(var(--color-border))]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
            DAILY STUDY TIME • TARGET: 180 MIN / DAY
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-[rgb(var(--color-text))] mt-0.5">
            {period === '7D' ? '7-Day' : '30-Day'} Focus Minutes & Consistency
          </h3>
          <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] mt-0.5">
            Daily focus minutes logged. Green bars hit or exceeded your 180-minute target.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
          <span className="px-3 py-1.5 rounded-xl bg-[#9e3c26]/10 dark:bg-[#e26f54]/15 text-[#9e3c26] dark:text-[#ffb4a3] font-bold flex items-center gap-1.5 border border-[#9e3c26]/20">
            <Flame size={14} />
            <span>19 Day Streak</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] font-bold flex items-center gap-1.5 border border-[rgb(var(--color-secondary))]/20">
            <CheckCircle2 size={14} />
            <span>{daysMetGoal}/{chartData.length} Days Met Goal</span>
          </span>
        </div>
      </div>

      {/* Bar Chart with ReferenceLine for Target */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: 'rgb(var(--color-muted))' }}
              stroke="rgb(var(--color-border))"
              interval={period === '7D' ? 0 : 'preserveStartEnd'}
              tickFormatter={(day) => `Day ${day}`}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'rgb(var(--color-muted))' }}
              stroke="rgb(var(--color-border))"
              width={38}
              tickFormatter={(v) => `${v}m`}
            />
            <Tooltip
              formatter={(value) => {
                const diff = value - 180;
                const status = diff >= 0 ? `(+${diff}m above goal)` : `(${Math.abs(diff)}m below goal)`;
                return [`${value} min ${status}`, 'Focus Time'];
              }}
              labelFormatter={(label) => `Day ${label}`}
              contentStyle={{
                backgroundColor: 'rgb(var(--color-card))',
                borderColor: 'rgb(var(--color-border))',
                fontSize: '11px',
                borderRadius: '10px',
                color: 'rgb(var(--color-text))',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }}
            />
            {/* Target Goal Line */}
            <ReferenceLine
              y={180}
              stroke="#9e3c26"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Goal: 180m',
                fill: '#9e3c26',
                fontSize: 10,
                position: 'insideTopRight'
              }}
            />
            <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.minutes >= 180 ? '#2d7d46' : '#4f7cac'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info & Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))] pt-3 gap-3 border-t border-[rgb(var(--color-border))]/60">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#2d7d46]" />
            <span>Goal Reached (≥180m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#4f7cac]" />
            <span>Under Target (&lt;180m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-b border-dashed border-[#9e3c26]" />
            <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-semibold">180m Target Line</span>
          </div>
        </div>

        <div className="flex items-center gap-4 font-bold text-[rgb(var(--color-text))]">
          <span>Daily Average: {avgMinutes} min / day</span>
          <span>•</span>
          <span>Total: {(totalMinutes / 60).toFixed(1)} hrs</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. SYNCHRONOUS ARENA TABLE & ACCURACY                                     */
/* -------------------------------------------------------------------------- */
export function SynchronousArenaTable({ selectedSubject = 'All' }) {
  const { recentDuels, subjectAccuracy, overallVelocity } = mockStats;

  // Filter duels if a specific subject is chosen
  const filteredDuels = selectedSubject === 'All'
    ? recentDuels
    : recentDuels.filter(d => d.subject.toLowerCase().includes(selectedSubject.toLowerCase()) || selectedSubject.toLowerCase().includes(d.subject.toLowerCase()));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

      {/* Recent Duels Table (7 cols) */}
      <div className="lg:col-span-7 p-5 sm:p-6 lg:p-7 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-4 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-[rgb(var(--color-border))]/60">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
              LIVE QUIZ DUELS
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[rgb(var(--color-text))]">
              Recent Head-to-Head Duels
            </h3>
          </div>
          <Link
            to="/rooms"
            className="text-xs text-[#9e3c26] dark:text-[#ffb4a3] hover:underline font-mono font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Find Challenger</span>
            <ChevronRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[480px]">
            <thead>
              <tr className="border-b border-[rgb(var(--color-border))] text-[10px] font-mono text-[rgb(var(--color-muted))] uppercase">
                <th className="pb-2.5">OPPONENT</th>
                <th className="pb-2.5">SUBJECT & TOPIC</th>
                <th className="pb-2.5 text-right">SCORE & TIME</th>
                <th className="pb-2.5 text-right">RESULT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--color-border))]">
              {(filteredDuels.length > 0 ? filteredDuels : recentDuels).map((duel) => (
                <tr key={duel.id} className="hover:bg-[rgb(var(--color-container-low))] transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={duel.avatar}
                        alt={duel.opponent}
                        className="w-8 h-8 rounded-full object-cover border border-[rgb(var(--color-border))]"
                      />
                      <div>
                        <div className="font-semibold text-[rgb(var(--color-text))]">{duel.opponent}</div>
                        <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">{duel.school}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <div className="font-medium text-[rgb(var(--color-text))]">{duel.subject}</div>
                    <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">{duel.topic}</div>
                  </td>
                  <td className="py-3.5 text-right font-mono">
                    <div className="font-bold text-[rgb(var(--color-text))]">{duel.score} in {duel.timeTaken}</div>
                    <div className="text-[10px] text-[rgb(var(--color-secondary))] font-medium">{duel.speedDelta}</div>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${duel.result === 'VICTORY'
                        ? 'bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))]'
                        : 'bg-red-500/15 text-red-700 dark:text-red-400'
                      }`}>
                      {duel.result} ({duel.eloChange})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Duel Accuracy (5 cols) */}
      <div className="lg:col-span-5 p-5 sm:p-6 lg:p-7 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-4 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
            SUBJECT ACCURACY
          </span>
          <h3 className="text-base sm:text-lg font-bold text-[rgb(var(--color-text))]">
            Subject Quiz Accuracy
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
            Real-time answer accuracy and average response speed across competitive quiz sprints.
          </p>

          <div className="space-y-4 mt-5">
            {subjectAccuracy.map((acc) => {
              const isHighlighted = selectedSubject !== 'All' && acc.subject.toLowerCase().includes(selectedSubject.toLowerCase());
              return (
                <div
                  key={acc.subject}
                  className={`space-y-1.5 p-2.5 rounded-xl transition-all ${isHighlighted ? 'bg-[#9e3c26]/10 ring-1 ring-[#9e3c26]/30' : ''
                    }`}
                >
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[rgb(var(--color-text))] font-medium">{acc.subject}</span>
                    <span className="text-[rgb(var(--color-muted))]">
                      <strong className="text-[rgb(var(--color-text))]">{acc.accuracy}%</strong> ({acc.latency})
                    </span>
                  </div>
                  <ProgressBar value={acc.accuracy} height="h-2" color="bg-[#9e3c26] dark:bg-[#e26f54]" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-[rgb(var(--color-border))] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[rgb(var(--color-secondary))] font-medium">
            <Sparkles size={14} />
            <span>Average Answer Speed</span>
          </div>
          <span className="font-bold text-[rgb(var(--color-text))] text-sm">{overallVelocity}</span>
        </div>

      </div>

    </div>
  );
}
