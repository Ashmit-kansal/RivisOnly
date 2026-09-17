import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Line, AreaChart, Area, CartesianGrid 
} from 'recharts';
import ProgressBar from '../../components/ui/ProgressBar';
import { mockStats } from '../../data/mockStats';
import { 
  Hourglass, Brain, Swords, Clock, TrendingUp, Flame, 
  CheckCircle2, ChevronRight, Sparkles, BookOpen, ArrowRight,
  Info, Zap, Calendar, ArrowUpRight
} from 'lucide-react';

export function StatsCards() {
  const { cumulativeFocus, spacedMastery, quizArena, focusCadence } = mockStats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Cumulative Focus */}
      <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">Cumulative Focus</span>
          <Hourglass size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold tracking-tight font-mono text-[rgb(var(--color-text))]">
            {cumulativeFocus.hours} <span className="text-lg font-normal text-[rgb(var(--color-muted))]">hrs</span>
          </div>
          <div className="text-xs text-[rgb(var(--color-secondary))] font-mono mt-1 flex items-center gap-1 font-medium">
            <TrendingUp size={12} />
            <span>{cumulativeFocus.delta}</span>
          </div>
        </div>
        <ProgressBar value={cumulativeFocus.progress} height="h-1.5" color="bg-[#9e3c26] dark:bg-[#e26f54]" />
      </div>

      {/* Spaced Mastery */}
      <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">Spaced Mastery</span>
          <Brain size={14} className="text-[rgb(var(--color-secondary))]" />
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold tracking-tight font-mono text-[rgb(var(--color-secondary))]">
            {spacedMastery.rate}%
          </div>
          <div className="text-xs text-[rgb(var(--color-secondary))] font-mono mt-1 flex items-center gap-1 font-medium">
            <Sparkles size={12} />
            <span>AI Retention Rate ({spacedMastery.delta})</span>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-[rgb(var(--color-secondary))]" />
          ))}
        </div>
      </div>

      {/* 1v1 Quiz Arena */}
      <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">1v1 Quiz Arena</span>
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
          <span>Rank #{quizArena.globalRank} Global</span>
          <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-bold">Streak: {quizArena.streak}</span>
        </div>
      </div>

      {/* Focus Cadence */}
      <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="uppercase tracking-wider font-semibold">Focus Cadence</span>
          <Clock size={14} className="text-sky-500" />
        </div>
        <div className="my-3">
          <div className="text-3xl font-bold tracking-tight font-mono text-[rgb(var(--color-text))]">
            {focusCadence.cycles} <span className="text-lg font-normal text-[rgb(var(--color-muted))]">cycles</span>
          </div>
          <div className="text-xs text-[rgb(var(--color-muted))] font-mono mt-1">
            {focusCadence.dailyAvg} cycles / day daily avg
          </div>
        </div>
        <div className="text-[11px] font-mono text-[rgb(var(--color-secondary))] flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-secondary))] animate-pulse" />
          <span>Optimal flow density ({focusCadence.flowDensity}%)</span>
        </div>
      </div>

    </div>
  );
}

export function VolumeAndCircadian() {
  const { subjectVolume, circadianHeatmap } = mockStats;
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [hoveredHour, setHoveredHour] = useState(null);

  const totalHours = subjectVolume.reduce((acc, s) => acc + s.hours, 0);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none space-y-6">
      
      {/* 1. Header: Human-understandable */}
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
            How your study hours are split across courses this month.
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
          <span>Distribution Bar:</span>
          <span>Click any subject to inspect details</span>
        </div>

        <div className="w-full h-4 rounded-xl overflow-hidden flex p-0.5 bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] gap-0.5 shadow-inner">
          {subjectVolume.map((subj) => {
            const isSelected = selectedSubject?.name === subj.name;
            return (
              <div
                key={subj.name}
                onClick={() => setSelectedSubject(isSelected ? null : subj)}
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
          const isSelected = selectedSubject?.name === subj.name;
          return (
            <div
              key={subj.name}
              onClick={() => setSelectedSubject(isSelected ? null : subj)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'border-[#9e3c26] bg-[#9e3c26]/5 dark:bg-[#9e3c26]/10 ring-1 ring-[#9e3c26]/30'
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
                <span className="text-[rgb(var(--color-muted))]">{subj.percentage}% of total time</span>
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
                <span>{subj.topicsLearned} topics active</span>
                <span>{subj.masteryRate}% mastery</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Clear Daily Peak Focus Hours (formerly Circadian Heatmap) */}
      <div className="pt-4 border-t border-[rgb(var(--color-border))] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-[rgb(var(--color-text))] flex items-center gap-1.5">
              <Clock size={14} className="text-amber-500" />
              <span>Daily Peak Focus Hours (24H Heatmap)</span>
            </div>
            <p className="text-[11px] text-[rgb(var(--color-muted))] mt-0.5">
              Shows which times of day your focus density and quiz accuracy are highest.
            </p>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 font-mono text-[11px] font-bold shrink-0 flex items-center gap-1.5">
            <Flame size={13} />
            <span>Peak: 9-12 AM & 8-11 PM</span>
          </div>
        </div>

        {/* 24-Hour Blocks Heatmap */}
        <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-2">
          <div className="grid grid-cols-12 sm:grid-cols-24 gap-1">
            {circadianHeatmap.map((slot) => {
              const colors = [
                'bg-[rgb(var(--color-card))] border-dashed border-[rgb(var(--color-border))]', // 0
                'bg-blue-500/25 border-blue-500/40', // 1
                'bg-emerald-500/35 border-emerald-500/50', // 2
                'bg-amber-500/50 border-amber-500/60', // 3
                'bg-[#9e3c26] dark:bg-[#e26f54] border-[#9e3c26] text-white shadow-xs' // 4 (Peak)
              ];
              const isHovered = hoveredHour?.hour === slot.hour;

              return (
                <div
                  key={slot.hour}
                  onMouseEnter={() => setHoveredHour(slot)}
                  onMouseLeave={() => setHoveredHour(null)}
                  className={`h-9 rounded-md ${colors[slot.level]} transition-all cursor-pointer border flex items-end justify-center pb-1 relative group ${
                    isHovered ? 'scale-115 ring-2 ring-white z-20 shadow-md' : 'hover:scale-105'
                  }`}
                >
                  <span className="text-[8px] font-mono opacity-80 select-none">
                    {slot.hour.slice(0, 2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time axis labels */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[rgb(var(--color-muted))] px-0.5 pt-0.5">
            <span>12 AM (Midnight)</span>
            <span>6 AM</span>
            <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-bold">12 PM (Noon)</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>

          {/* Dynamic Hover or Default Legend Box */}
          <div className="mt-2 p-2.5 rounded-lg bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            {hoveredHour ? (
              <div className="flex items-center gap-2 text-[rgb(var(--color-text))]">
                <span className="font-bold text-[#9e3c26] dark:text-[#ffb4a3]">{hoveredHour.hour}</span>
                <span>•</span>
                <span className="font-semibold">{hoveredHour.label}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{hoveredHour.focusScore} Focus Flow</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-[10px] text-[rgb(var(--color-muted))] flex-wrap">
                <span className="font-semibold text-[rgb(var(--color-text))]">Legend:</span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))]" /> Rest / Sleep
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500/35" /> Light Focus
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500/50" /> Moderate Study
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#9e3c26] dark:bg-[#e26f54]" /> Peak Flow
                </span>
              </div>
            )}
            <span className="text-[10px] text-[rgb(var(--color-muted))] shrink-0">
              Hover any bar to see stats
            </span>
          </div>
        </div>

        {/* Actionable takeaway tip */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-[rgb(var(--color-container-low))] to-transparent border border-amber-500/20 text-xs text-[rgb(var(--color-muted))] flex items-start gap-2">
          <span className="text-amber-500 font-bold shrink-0">💡 Strategy:</span>
          <span>
            Schedule heavy chemical mechanisms & math proofs between <strong>09:00 - 12:00</strong> when your flow is highest, and use <strong>20:00 - 23:00</strong> for quick flashcard quiz sprints.
          </span>
        </div>

      </div>

    </div>
  );
}

export function RetentionCurveSection() {
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
            <span className="text-[10px] text-[#9e3c26] dark:text-[#ffb4a3]">{data.stage}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>🧠 With Rivisonly:</span>
            <span className="font-bold">{data.aiRetention}% Remembered</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-red-600 dark:text-red-400">
            <span>📉 Without Review:</span>
            <span className="font-bold">{data.unprompted}% Remembered</span>
          </div>
          <div className="pt-1 border-t border-[rgb(var(--color-border))]/60 text-[10px] text-[rgb(var(--color-muted))]">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{difference}% retention saved</span> • {data.tip}
          </div>
        </div>
      );
    }
    return null;
  };

  const selectedDayData = upcomingSchedule.find(s => s.day === selectedForecastDay) || upcomingSchedule[0];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none space-y-5">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgb(var(--color-border))]">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
            <Brain size={12} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>MEMORY RETENTION ENGINE</span>
          </div>
          <h3 className="text-lg font-bold text-[rgb(var(--color-text))] mt-0.5">
            Your Memory Retention vs. Normal Forgetting
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
            Compare how much you remember using Rivisonly's spaced reviews vs. passive cramming.
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
              <span className="text-xs font-bold text-[rgb(var(--color-text))]">With Rivisonly Spaced Reviews</span>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">91.4% Recall</span>
          </div>
          <p className="text-[11px] text-[rgb(var(--color-muted))]">
            Short 3-minute reviews at Days 1, 3, 7, 14 & 30 keep knowledge fresh in permanent memory.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-red-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-red-500 border-dashed" />
              <span className="text-xs font-bold text-[rgb(var(--color-text))]">Without Review (Natural Decay)</span>
            </div>
            <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">12.0% Recall</span>
          </div>
          <p className="text-[11px] text-[rgb(var(--color-muted))]">
            Without review, 70% of facts vanish within 48 hours and 88% is lost within 30 days.
          </p>
        </div>
      </div>

      {/* Line / Area Chart with Custom Tooltip */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))]">
          <span>Retention (%)</span>
          <span>Hover points on curve for details</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={retentionCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aiRetentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2d7d46" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2d7d46" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="rgb(var(--color-muted))" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="rgb(var(--color-muted))" />
              <Tooltip content={<CustomRetentionTooltip />} />
              <Area
                type="monotone"
                dataKey="aiRetention"
                stroke="#2d7d46"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#aiRetentionGrad)"
                name="Rivisonly Recall (~91%)"
              />
              <Line
                type="monotone"
                dataKey="unprompted"
                stroke="#c84b31"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
                name="Without Review (~12%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Upcoming 7-Day Revision Load Forecast */}
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
            142 Due Total (~1h 15m)
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

export function ThirtyDayFocusBarChart() {
  const { thirtyDayMinutes } = mockStats;

  return (
    <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
            CHRONOMETRIC VELOCITY • DAILY FOCUS TARGET: 180 MIN
          </span>
          <h3 className="text-lg font-bold text-[rgb(var(--color-text))] mt-0.5">
            30-Day Focus Minutes & Active Continuity
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-[#9e3c26]/10 dark:bg-[#e26f54]/15 text-[#9e3c26] dark:text-[#ffb4a3] font-bold flex items-center gap-1 border border-[#9e3c26]/20">
            <Flame size={12} />
            <span>19 Days Streak</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] font-bold flex items-center gap-1 border border-[rgb(var(--color-secondary))]/20">
            <CheckCircle2 size={12} />
            <span>93% Consistency</span>
          </span>
        </div>
      </div>

      {/* 30-Day Bar Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={thirtyDayMinutes}>
            <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="rgb(var(--color-muted))" />
            <YAxis tick={{ fontSize: 9 }} stroke="rgb(var(--color-muted))" />
            <Tooltip
              formatter={(value) => [`${value} min`, 'Focus Time']}
              labelFormatter={(label) => `Day ${label}`}
              contentStyle={{
                backgroundColor: 'rgb(var(--color-card))',
                borderColor: 'rgb(var(--color-border))',
                fontSize: '11px',
                borderRadius: '8px',
                color: 'rgb(var(--color-text))'
              }}
            />
            <Bar dataKey="minutes" fill="#006c4a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))] pt-1">
        <span>30 Days Ago</span>
        <span>15 Days Ago</span>
        <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-bold">Today (236 min active)</span>
      </div>
    </div>
  );
}

export function SynchronousArenaTable() {
  const { recentDuels, subjectAccuracy, overallVelocity } = mockStats;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Recent Duels Table (7 cols) */}
      <div className="lg:col-span-7 p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] font-semibold">
              SYNCHRONOUS ARENA
            </span>
            <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
              Recent Head-to-Head Duels
            </h3>
          </div>
          <button className="text-xs text-[#9e3c26] dark:text-[#ffb4a3] hover:underline font-mono font-medium flex items-center gap-1 cursor-pointer">
            <span>Find Challenger</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgb(var(--color-border))] text-[10px] font-mono text-[rgb(var(--color-muted))] uppercase">
                <th className="pb-2">OPPONENT</th>
                <th className="pb-2">SUBJECT & FIELD</th>
                <th className="pb-2 text-right">SCORE / SPEED DELTA</th>
                <th className="pb-2 text-right">RESULT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--color-border))]">
              {recentDuels.map((duel) => (
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
                  <td className="py-3 text-[rgb(var(--color-muted))]">
                    {duel.subject}
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
            COMBAT PRECISION
          </span>
          <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
            Subject Duel Accuracy
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
            Real-time answer accuracy and response latency across all 40 competitive sprints.
          </p>

          <div className="space-y-3.5 mt-5">
            {subjectAccuracy.map((acc) => (
              <div key={acc.subject} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[rgb(var(--color-text))] font-medium">{acc.subject}</span>
                  <span className="text-[rgb(var(--color-muted))]">
                    <strong className="text-[rgb(var(--color-text))]">{acc.accuracy}%</strong> ({acc.latency})
                  </span>
                </div>
                <ProgressBar value={acc.accuracy} height="h-2" color="bg-[#9e3c26] dark:bg-[#e26f54]" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[rgb(var(--color-border))] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[rgb(var(--color-secondary))] font-medium">
            <Sparkles size={13} />
            <span>Overall Recall Velocity</span>
          </div>
          <span className="font-bold text-[rgb(var(--color-text))]">{overallVelocity}</span>
        </div>

      </div>

    </div>
  );
}
