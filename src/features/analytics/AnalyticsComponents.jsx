import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Line, Area, CartesianGrid, ComposedChart, ReferenceLine, Cell
} from 'recharts';
import ProgressBar from '../../components/ui/ProgressBar';
import { mockStats } from '../../data/mockStats';
import { 
  Hourglass, Brain, Swords, Clock, TrendingUp, Flame, 
  CheckCircle2, ChevronRight, Sparkles, BookOpen, ArrowRight,
  Info, Zap, Calendar, ArrowUpRight, Sun, Moon, Coffee, Star
} from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Total Study Time */}
      <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">
            {activeSubjData ? `${activeSubjData.name.split(' ')[0]} Time` : 'Total Study Time'}
          </span>
          <Hourglass size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold tracking-tight font-mono text-[rgb(var(--color-text))]">
            {displayHours} <span className="text-lg font-normal text-[rgb(var(--color-muted))]">hrs</span>
          </div>
          <div className="text-xs text-[rgb(var(--color-secondary))] font-mono mt-1 flex items-center gap-1 font-medium">
            <TrendingUp size={12} />
            <span>{activeSubjData ? `${displayProgress}% of target (${displayGoal}h)` : cumulativeFocus.delta}</span>
          </div>
        </div>
        <ProgressBar value={displayProgress} height="h-1.5" color="bg-[#9e3c26] dark:bg-[#e26f54]" />
      </div>

      {/* Memory Retention Rate */}
      <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">Memory Retention Rate</span>
          <Brain size={14} className="text-[rgb(var(--color-secondary))]" />
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold tracking-tight font-mono text-[rgb(var(--color-secondary))]">
            {displayRetention}%
          </div>
          <div className="text-xs text-[rgb(var(--color-secondary))] font-mono mt-1 flex items-center gap-1 font-medium">
            <Sparkles size={12} />
            <span>Spaced Review Score ({spacedMastery.delta})</span>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-[rgb(var(--color-secondary))]" />
          ))}
        </div>
      </div>

      {/* 1v1 Quiz Duels */}
      <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">1v1 Quiz Duels</span>
          <Swords size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight font-mono text-[rgb(var(--color-text))]">
              {quizArena.rating.toLocaleString()}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[rgb(var(--color-tertiary-container))] text-[rgb(var(--color-tertiary))]">
              {quizArena.rankTier}
            </span>
          </div>
          <div className="text-xs text-[rgb(var(--color-muted))] font-mono mt-1">
            <strong className="text-[rgb(var(--color-text))]">{quizArena.wins}W / {quizArena.losses}L</strong> ({quizArena.winRate}% Win Rate)
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))]">
          <span>Rank #{quizArena.globalRank} Globally</span>
          <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-bold">Streak: {quizArena.streak}</span>
        </div>
      </div>

      {/* Study Sessions */}
      <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">Study Sessions</span>
          <Clock size={14} className="text-sky-500" />
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold tracking-tight font-mono text-[rgb(var(--color-text))]">
            {focusCadence.sessions} <span className="text-lg font-normal text-[rgb(var(--color-muted))]">sessions</span>
          </div>
          <div className="text-xs text-[rgb(var(--color-muted))] font-mono mt-1">
            {focusCadence.dailyAvg} sessions / day average
          </div>
        </div>
        <div className="text-[11px] font-mono text-[rgb(var(--color-secondary))] flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-secondary))] animate-pulse" />
          <span>Deep focus score ({focusCadence.focusQuality}%)</span>
        </div>
      </div>

    </div>
  );
}

export function VolumeAndCircadian({ selectedSubject = 'All', onSelectSubject }) {
  const { subjectVolume, circadianHeatmap } = mockStats;
  const [hoveredHour, setHoveredHour] = useState(null);

  const totalHours = subjectVolume.reduce((acc, s) => acc + s.hours, 0);

  const handleCardClick = (subjName) => {
    if (onSelectSubject) {
      onSelectSubject(selectedSubject === subjName ? 'All' : subjName);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgb(var(--color-border))]">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
            <BookOpen size={12} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>TIME ALLOCATION & FOCUS PATTERNS</span>
          </div>
          <h3 className="text-lg font-bold text-[rgb(var(--color-text))] mt-0.5">
            Study Time by Subject
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
            How your study hours are split across courses this month. Click any card to filter.
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-xl font-bold font-mono text-[rgb(var(--color-text))]">{totalHours} hrs</div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            92% of 200h Monthly Goal
          </div>
        </div>
      </div>

      {/* Proportional Subject Breakdown Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span>Subject Time Distribution:</span>
          <span>{selectedSubject !== 'All' ? `Filtering: ${selectedSubject}` : 'Click any subject to filter'}</span>
        </div>

        <div className="w-full h-4 rounded-xl overflow-hidden flex p-0.5 bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] gap-0.5 shadow-inner">
          {subjectVolume.map((subj) => {
            const isSelected = selectedSubject === subj.name;
            return (
              <div
                key={subj.name}
                onClick={() => handleCardClick(subj.name)}
                className={`h-full rounded-lg transition-all cursor-pointer relative group ${
                  isSelected ? 'ring-2 ring-white scale-y-110 z-10' : 'hover:opacity-90'
                }`}
                style={{ width: `${subj.percentage}%`, backgroundColor: subj.color }}
                title={`${subj.name}: ${subj.hours}h (${subj.percentage}%)`}
              />
            );
          })}
        </div>
      </div>

      {/* Subject Cards Grid with Goal Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {subjectVolume.map((subj) => {
          const isSelected = selectedSubject === subj.name;
          return (
            <div
              key={subj.name}
              onClick={() => handleCardClick(subj.name)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'border-[#9e3c26] bg-[#9e3c26]/5 dark:bg-[#9e3c26]/10 ring-2 ring-[#9e3c26]/40'
                  : 'bg-[rgb(var(--color-container-low))] border-[rgb(var(--color-border))] hover:border-[#9e3c26]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-3 h-3 rounded-md shrink-0 shadow-xs" style={{ backgroundColor: subj.color }} />
                  <div className="font-bold text-xs text-[rgb(var(--color-text))] truncate">
                    {subj.name}
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] shrink-0">
                  {subj.grade}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-[rgb(var(--color-text))]">{subj.hours} hrs</span>
                <span className="text-[rgb(var(--color-muted))]">{subj.percentage}% of study time</span>
              </div>

              {/* Progress towards target */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-[rgb(var(--color-muted))]">
                  <span>Target: {subj.targetHours} hrs</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {Math.round((subj.hours / subj.targetHours) * 100)}% met
                  </span>
                </div>
                <ProgressBar
                  value={subj.hours}
                  max={subj.targetHours}
                  height="h-1.5"
                  color={subj.color}
                />
              </div>

              <div className="mt-2.5 pt-2 border-t border-[rgb(var(--color-border))]/60 flex items-center justify-between text-[10px] font-mono text-[rgb(var(--color-muted))]">
                <span>{subj.topicsLearned} active topics</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{subj.masteryRate}% mastery</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Focus & Energy Rhythm (Intuitive 24-Hour Rhythm Wave) */}
      <div className="pt-4 border-t border-[rgb(var(--color-border))] space-y-4">
        
        {/* Header with Peak Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-[rgb(var(--color-text))] flex items-center gap-1.5">
              <Zap size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
              <span>Daily Focus & Energy Rhythm (24-Hour Wave)</span>
            </div>
            <p className="text-[11px] text-[rgb(var(--color-muted))] mt-0.5">
              Your natural cognitive energy pattern. Taller bars indicate peak focus and fast recall.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-[#9e3c26]/10 border border-[#9e3c26]/25 text-[#9e3c26] dark:text-[#ffb4a3] font-mono text-[11px] font-bold flex items-center gap-1">
              <Flame size={12} />
              <span>Morning Peak: 9–12 AM (98%)</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 font-mono text-[11px] font-bold flex items-center gap-1">
              <Star size={12} />
              <span>Evening Peak: 8–11 PM (95%)</span>
            </span>
          </div>
        </div>

        {/* 4 Clickable Time-of-Day Quick-Glance Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(mockStats.daySegments || [
            { id: 'morning', name: 'Morning', timeRange: '6 AM – 12 PM', avgScore: 92, tag: 'Peak Flow', bestFor: 'Complex mechanisms & math proofs' },
            { id: 'afternoon', name: 'Afternoon', timeRange: '12 PM – 6 PM', avgScore: 78, tag: 'Steady Study', bestFor: 'Problem sets, lab notes & exercises' },
            { id: 'evening', name: 'Evening', timeRange: '6 PM – 11 PM', avgScore: 94, tag: 'Sprint Peak', bestFor: '1v1 quiz duels & speed flashcards' },
            { id: 'night', name: 'Night', timeRange: '11 PM – 6 AM', avgScore: 15, tag: 'Rest & Sleep', bestFor: 'Sleep & memory consolidation' },
          ]).map((seg) => {
            const isSegActive = hoveredHour ? hoveredHour.period === seg.id : false;
            const icons = {
              morning: <Sun size={13} className="text-amber-500" />,
              afternoon: <Coffee size={13} className="text-amber-600 dark:text-amber-400" />,
              evening: <Flame size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />,
              night: <Moon size={13} className="text-sky-400" />
            };

            return (
              <div
                key={seg.id}
                className={`p-2.5 rounded-xl border text-xs transition-all ${
                  isSegActive
                    ? 'border-[#9e3c26] bg-[#9e3c26]/10 ring-1 ring-[#9e3c26]/30 shadow-xs'
                    : 'bg-[rgb(var(--color-container-low))] border-[rgb(var(--color-border))]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                  <span className="flex items-center gap-1 font-semibold text-[rgb(var(--color-text))]">
                    {icons[seg.id]}
                    <span>{seg.name}</span>
                  </span>
                  <span className={`px-1.5 py-0.2 rounded font-bold ${
                    seg.id === 'morning' || seg.id === 'evening'
                      ? 'text-[#9e3c26] dark:text-[#ffb4a3] bg-[#9e3c26]/10'
                      : seg.id === 'afternoon'
                      ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10'
                      : 'text-sky-700 dark:text-sky-400 bg-sky-500/10'
                  }`}>
                    {seg.avgScore > 20 ? `${seg.avgScore}%` : 'Rest'}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">{seg.timeRange}</div>
                <div className="text-[10px] text-[rgb(var(--color-muted))] line-clamp-1 mt-1 font-medium">
                  {seg.bestFor}
                </div>
              </div>
            );
          })}
        </div>

        {/* 24-Hour Energy Wave Bar Graph with Variable Heights */}
        <div className="p-4 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-3">
          
          {/* Chart Area with Horizontal Guide Lines & Proportional Bars */}
          <div className="relative h-44 w-full flex items-end pt-6 pb-1">
            
            {/* Horizontal guide lines (25%, 50%, 75%, 100%) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 border-b border-[rgb(var(--color-border))]">
              <div className="border-b border-dashed border-[rgb(var(--color-text))] w-full flex justify-end pr-1 text-[8px] font-mono">100% Peak</div>
              <div className="border-b border-dashed border-[rgb(var(--color-text))] w-full flex justify-end pr-1 text-[8px] font-mono">75% Deep</div>
              <div className="border-b border-dashed border-[rgb(var(--color-text))] w-full flex justify-end pr-1 text-[8px] font-mono">50% Steady</div>
              <div className="border-b border-dashed border-[rgb(var(--color-text))] w-full flex justify-end pr-1 text-[8px] font-mono">25% Light</div>
            </div>

            {/* 24 Dynamic Height Vertical Bars */}
            <div className="relative w-full h-full flex items-end justify-between gap-1 sm:gap-1.5 z-10">
              {circadianHeatmap.map((slot) => {
                const isHovered = hoveredHour?.hour === slot.hour;
                const isPeak = slot.isPeak || slot.level === 4;
                const barHeight = Math.max(12, slot.score || 0);

                // Distinct styling based on focus intensity
                let barColor = 'bg-[rgb(var(--color-card))] border border-dashed border-[rgb(var(--color-border))] opacity-50';
                if (slot.score >= 90) {
                  barColor = 'bg-gradient-to-t from-[#9e3c26] to-[#e26f54] text-white shadow-sm ring-1 ring-[#9e3c26]/50';
                } else if (slot.score >= 80) {
                  barColor = 'bg-gradient-to-t from-amber-600/90 to-amber-400 text-white';
                } else if (slot.score >= 60) {
                  barColor = 'bg-gradient-to-t from-emerald-600/80 to-emerald-400/90 text-white';
                } else if (slot.score >= 30) {
                  barColor = 'bg-sky-500/40 border border-sky-500/40 text-sky-800 dark:text-sky-300';
                }

                return (
                  <div
                    key={slot.hour}
                    onMouseEnter={() => setHoveredHour(slot)}
                    onMouseLeave={() => setHoveredHour(null)}
                    className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
                  >
                    {/* Small star above peak bars */}
                    {isPeak && (
                      <div className="mb-0.5 text-[8px] text-[#9e3c26] dark:text-[#ffb4a3] animate-bounce">
                        ★
                      </div>
                    )}

                    {/* Proportional Bar */}
                    <div
                      style={{ height: `${barHeight}%` }}
                      className={`w-full rounded-t-md transition-all flex items-end justify-center pb-1 ${barColor} ${
                        isHovered ? 'scale-y-105 scale-x-125 z-30 ring-2 ring-white shadow-lg' : 'hover:opacity-90'
                      }`}
                    >
                      {/* Show percentage or 2-digit hour only on hover or tall bars */}
                      {barHeight >= 70 && (
                        <span className="text-[7px] font-mono font-bold select-none opacity-80 rotate-[-90deg] sm:rotate-0 hidden sm:inline">
                          {slot.score}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 12-Hour AM/PM Milestone Axis Labels */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[rgb(var(--color-muted))] px-0.5 pt-1 border-t border-[rgb(var(--color-border))]">
            <span>12 AM</span>
            <span>3 AM</span>
            <span>6 AM</span>
            <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-bold">9 AM (Peak)</span>
            <span>12 PM</span>
            <span>3 PM</span>
            <span>6 PM</span>
            <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-bold">9 PM (Peak)</span>
            <span>11 PM</span>
          </div>

          {/* Time Zone Segment Ribbon */}
          <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-mono pt-0.5">
            <span className="py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300 font-medium">💤 Night Rest (12–6 AM)</span>
            <span className="py-0.5 rounded bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] font-bold">🌅 Morning Flow (6–12 PM)</span>
            <span className="py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium">☀️ Afternoon Study (12–6 PM)</span>
            <span className="py-0.5 rounded bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] font-bold">🌙 Evening Sprints (6–11 PM)</span>
          </div>

          {/* Interactive Inspection Card */}
          <div className="mt-2 p-2.5 rounded-lg bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            {hoveredHour ? (
              <div className="flex items-center gap-2 text-[rgb(var(--color-text))] flex-wrap">
                <span className="font-bold text-[#9e3c26] dark:text-[#ffb4a3]">
                  {hoveredHour.hour12 || hoveredHour.hour}
                </span>
                <span>•</span>
                <span className="font-semibold">{hoveredHour.label}</span>
                <span>•</span>
                <span className={`font-bold ${
                  (hoveredHour.score || 0) >= 90
                    ? 'text-[#9e3c26] dark:text-[#ffb4a3]'
                    : (hoveredHour.score || 0) >= 70
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {hoveredHour.focusScore || `${hoveredHour.score}%`} Focus
                </span>
                {hoveredHour.recommendation && (
                  <>
                    <span>•</span>
                    <span className="text-[rgb(var(--color-muted))] text-[11px]">
                      {hoveredHour.recommendation}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-[rgb(var(--color-muted))]">
                <Info size={13} className="text-[#9e3c26] dark:text-[#ffb4a3] shrink-0" />
                <span>Hover over any bar to view your focus score and best study task for that hour.</span>
              </div>
            )}
            <span className="text-[10px] text-[rgb(var(--color-muted))] shrink-0 hidden sm:inline">
              Height = Focus Intensity
            </span>
          </div>

        </div>

        {/* Actionable takeaway tip */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-[rgb(var(--color-container-low))] to-transparent border border-amber-500/20 text-xs text-[rgb(var(--color-muted))] flex items-start gap-2">
          <span className="text-amber-500 font-bold shrink-0">💡 Strategy:</span>
          <span>
            Tackle high-difficulty concepts (Reaction Mechanisms & Math Proofs) during your <strong>09:00 – 12:00</strong> morning peak, and save <strong>20:00 – 23:00</strong> for rapid 1v1 quiz duels and flashcard sprints.
          </span>
        </div>

      </div>

    </div>
  );
}

export function RetentionCurveSection({ selectedSubject = 'All' }) {
  const { retentionCurve, upcomingSchedule } = mockStats;
  const [selectedForecastDay, setSelectedForecastDay] = useState('Mon');

  // Custom interactive tooltip
  const CustomRetentionTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const difference = data.aiRetention - data.unprompted;
      return (
        <div className="p-3 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-2xl text-xs font-mono space-y-1.5 z-50">
          <div className="font-bold text-[rgb(var(--color-text))] flex items-center justify-between gap-3 border-b border-[rgb(var(--color-border))] pb-1">
            <span>{data.day}</span>
            <span className="text-[10px] text-[#9e3c26] dark:text-[#ffb4a3] font-semibold">{data.stage}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>🟢 With Rivisonly Spaced Reviews:</span>
            <span className="font-bold">{data.aiRetention}% Remembered</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-red-600 dark:text-red-400">
            <span>🔴 Without Review (Natural Forgetting):</span>
            <span className="font-bold">{data.unprompted}% Remembered</span>
          </div>
          <div className="pt-1 border-t border-[rgb(var(--color-border))]/60 text-[10px] text-[rgb(var(--color-muted))]">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{difference}% Retention Advantage</span> • {data.tip}
          </div>
        </div>
      );
    }
    return null;
  };

  const selectedDayData = upcomingSchedule.find(s => s.day === selectedForecastDay) || upcomingSchedule[0];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgb(var(--color-border))]">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
            <Brain size={12} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>RETENTION & FORGETTING CURVE</span>
          </div>
          <h3 className="text-lg font-bold text-[rgb(var(--color-text))] mt-0.5">
            Your Memory Retention vs. Normal Forgetting
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
            How smart spaced reviews lock knowledge into long-term memory vs. passive cramming.
          </p>
        </div>

        <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold shrink-0">
          +63% Recall Advantage
        </div>
      </div>

      {/* Two Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-[rgb(var(--color-text))]">With Rivisonly (Spaced Reviews)</span>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">91.4% Recall</span>
          </div>
          <p className="text-[11px] text-[rgb(var(--color-muted))]">
            Short 3-minute reviews at Days 1, 3, 7, 14, 21 & 30 keep material permanently fresh.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-red-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-red-500 border-dashed" />
              <span className="text-xs font-bold text-[rgb(var(--color-text))]">Without Review (Natural Forgetting)</span>
            </div>
            <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">12.0% Recall</span>
          </div>
          <p className="text-[11px] text-[rgb(var(--color-muted))]">
            Without review, 55% vanishes in 3 days, dropping to only 12% by Day 30.
          </p>
        </div>
      </div>

      {/* Composed Chart with Explicit Units and Review Anchors */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))]">
          <span>Retention (%)</span>
          <span>Hover review checkpoints for details</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={retentionCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aiRetentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d7d46" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2d7d46" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="rgb(var(--color-muted))" />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fontSize: 10 }} 
                stroke="rgb(var(--color-muted))"
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
                name="With Rivisonly"
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
        <div className="flex items-center justify-center gap-6 pt-1 text-xs font-mono text-[rgb(var(--color-muted))]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            <span className="font-medium text-[rgb(var(--color-text))]">With Rivisonly Spaced Reviews (~91%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-red-500 inline-block" />
            <span className="font-medium text-[rgb(var(--color-text))]">Without Review (~12%)</span>
          </div>
        </div>
      </div>

      {/* Upcoming 7-Day Revision Load Forecast */}
      <div className="pt-4 border-t border-[rgb(var(--color-border))] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <div className="text-xs font-bold text-[rgb(var(--color-text))] flex items-center gap-1.5">
              <Calendar size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
              <span>Upcoming 7-Day Revision Forecast</span>
            </div>
            <p className="text-[11px] text-[rgb(var(--color-muted))] mt-0.5">
              Scheduled spaced reviews due each day this week.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#9e3c26] dark:text-[#ffb4a3]">
            142 Cards Due Total (~1h 15m)
          </span>
        </div>

        {/* 7-Day Clickable Pills */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {upcomingSchedule.map((item) => {
            const isSelected = selectedForecastDay === item.day;
            return (
              <button
                key={item.day}
                type="button"
                onClick={() => setSelectedForecastDay(item.day)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#9e3c26] bg-[#9e3c26]/10 dark:bg-[#9e3c26]/20 ring-1 ring-[#9e3c26]/30 shadow-xs'
                    : 'bg-[rgb(var(--color-container-low))] border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-container))]'
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
        <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-[#9e3c26] dark:text-[#ffb4a3] font-mono">{selectedDayData.day} Plan:</span>
            <span className="text-[rgb(var(--color-text))] truncate">{selectedDayData.subjects}</span>
            <span className="text-[10px] font-mono text-[rgb(var(--color-muted))] shrink-0">
              ({selectedDayData.count} cards • {selectedDayData.estMinutes} mins)
            </span>
          </div>

          <Link
            to="/revision"
            className="text-[11px] font-bold text-[#9e3c26] dark:text-[#ffb4a3] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>Open in Revision Hub</span>
            <ArrowRight size={12} />
          </Link>
        </div>

      </div>

    </div>
  );
}

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
    <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
            DAILY STUDY TIME • TARGET: 180 MIN / DAY
          </span>
          <h3 className="text-lg font-bold text-[rgb(var(--color-text))] mt-0.5">
            {period === '7D' ? '7-Day' : '30-Day'} Study Time & Consistency
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
            Daily focus minutes logged. Green bars hit or exceeded your 180-minute target.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-[#9e3c26]/10 dark:bg-[#e26f54]/15 text-[#9e3c26] dark:text-[#ffb4a3] font-bold flex items-center gap-1 border border-[#9e3c26]/20">
            <Flame size={12} />
            <span>19 Day Streak</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] font-bold flex items-center gap-1 border border-[rgb(var(--color-secondary))]/20">
            <CheckCircle2 size={12} />
            <span>{daysMetGoal}/{chartData.length} Days Met Goal</span>
          </span>
        </div>
      </div>

      {/* Bar Chart with ReferenceLine for Target */}
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 9 }} 
              stroke="rgb(var(--color-muted))"
              interval={period === '7D' ? 0 : 2}
              tickFormatter={(day) => `Day ${day}`}
            />
            <YAxis 
              tick={{ fontSize: 9 }} 
              stroke="rgb(var(--color-muted))"
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
                borderRadius: '8px',
                color: 'rgb(var(--color-text))'
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))] pt-1 gap-2 border-t border-[rgb(var(--color-border))]/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#2d7d46]" />
            <span>Goal Reached (≥180m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#4f7cac]" />
            <span>Under Target (&lt;180m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-dashed border-[#9e3c26]" />
            <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-semibold">180m Target Line</span>
          </div>
        </div>

        <div className="font-bold text-[rgb(var(--color-text))]">
          Daily Average: {avgMinutes} min / day
        </div>
      </div>
    </div>
  );
}

export function SynchronousArenaTable({ selectedSubject = 'All' }) {
  const { recentDuels, subjectAccuracy, overallVelocity } = mockStats;

  // Filter duels if a specific subject is chosen
  const filteredDuels = selectedSubject === 'All' 
    ? recentDuels 
    : recentDuels.filter(d => d.subject.toLowerCase().includes(selectedSubject.toLowerCase()) || selectedSubject.toLowerCase().includes(d.subject.toLowerCase()));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Recent Duels Table (7 cols) */}
      <div className="lg:col-span-7 p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
              LIVE QUIZ DUELS
            </span>
            <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
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
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgb(var(--color-border))] text-[10px] font-mono text-[rgb(var(--color-muted))] uppercase">
                <th className="pb-2">OPPONENT</th>
                <th className="pb-2">SUBJECT & TOPIC</th>
                <th className="pb-2 text-right">SCORE & TIME</th>
                <th className="pb-2 text-right">RESULT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--color-border))]">
              {(filteredDuels.length > 0 ? filteredDuels : recentDuels).map((duel) => (
                <tr key={duel.id} className="hover:bg-[rgb(var(--color-container-low))] transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={duel.avatar}
                        alt={duel.opponent}
                        className="w-7 h-7 rounded-full object-cover border border-[rgb(var(--color-border))]"
                      />
                      <div>
                        <div className="font-semibold text-[rgb(var(--color-text))]">{duel.opponent}</div>
                        <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">{duel.school}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-medium text-[rgb(var(--color-text))]">{duel.subject}</div>
                    <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">{duel.topic}</div>
                  </td>
                  <td className="py-3 text-right font-mono">
                    <div className="font-bold text-[rgb(var(--color-text))]">{duel.score} in {duel.timeTaken}</div>
                    <div className="text-[10px] text-[rgb(var(--color-secondary))] font-medium">{duel.speedDelta}</div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      duel.result === 'VICTORY'
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
      <div className="lg:col-span-5 p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none space-y-4 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
            SUBJECT ACCURACY
          </span>
          <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
            Subject Quiz Accuracy
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
            Real-time answer accuracy and average response speed across competitive quiz sprints.
          </p>

          <div className="space-y-3.5 mt-5">
            {subjectAccuracy.map((acc) => {
              const isHighlighted = selectedSubject !== 'All' && acc.subject.toLowerCase().includes(selectedSubject.toLowerCase());
              return (
                <div 
                  key={acc.subject} 
                  className={`space-y-1 p-2 rounded-lg transition-all ${
                    isHighlighted ? 'bg-[#9e3c26]/10 ring-1 ring-[#9e3c26]/30' : ''
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
            <Sparkles size={13} />
            <span>Average Answer Speed</span>
          </div>
          <span className="font-bold text-[rgb(var(--color-text))]">{overallVelocity}</span>
        </div>

      </div>

    </div>
  );
}

