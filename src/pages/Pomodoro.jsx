import React, { useState, useEffect } from 'react';
import PomodoroTimer from '../features/pomodoro/PomodoroTimer';
import { usePomodoro } from '../context/PomodoroContext';
import { 
  Flame, CheckCircle2, Clock, Plus, Trash2, 
  Target, BarChart2, RotateCcw, Sparkles
} from 'lucide-react';

export default function Pomodoro() {
  const { stats, history, subjects, resetStats, resetToDemoStats } = usePomodoro();

  // Session Tasks / Goals Checklist with LocalStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-pomodoro-tasks');
      return saved ? JSON.parse(saved) : [
        { id: 1, text: 'Review Chapter 8 reaction mechanisms', completed: true },
        { id: 2, text: 'Solve 5 practice stereochemistry synthesis problems', completed: false },
        { id: 3, text: 'Consolidate flashcards for active recall duel', completed: false },
      ];
    } catch {
      return [
        { id: 1, text: 'Review Chapter 8 reaction mechanisms', completed: true },
        { id: 2, text: 'Solve 5 practice stereochemistry synthesis problems', completed: false },
      ];
    }
  });

  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('rivisonly-pomodoro-tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('Could not save tasks', e);
    }
  }, [tasks]);

  // Task Actions
  const handleAddTask = (e) => {
    e.preventDefault();
    const trimmed = newTaskText.trim();
    if (!trimmed) return;
    setTasks(prev => [...prev, { id: Date.now(), text: trimmed, completed: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const todayHours = Math.floor(stats.todayMinutes / 60);
  const todayRemainingMins = stats.todayMinutes % 60;
  const goalProgress = Math.min(100, Math.round((stats.todayMinutes / (stats.goalMinutes || 300)) * 100));
  const goalHours = Math.floor((stats.goalMinutes || 300) / 60);
  const goalRemMins = (stats.goalMinutes || 300) % 60;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in-up">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--color-text))]">
              Pomodoro Focus Studio
            </h1>
            <div className="flex items-center gap-1.5">
              <button
                onClick={resetStats}
                className="px-2.5 py-1 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[11px] font-mono text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title="Reset today's focus stats to 0m for live demo testing"
              >
                <RotateCcw size={12} />
                <span>Reset Day</span>
              </button>
              <button
                onClick={resetToDemoStats}
                className="px-2.5 py-1 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[11px] font-mono text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title="Restore default sample demo statistics"
              >
                <Sparkles size={12} />
                <span>Demo Data</span>
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] mt-1">
            Editable intervals, custom subject tracking, and distraction-free study cycles.
          </p>
        </div>

        {/* Metric Ribbons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[rgb(var(--color-container-low))] p-1.5 rounded-2xl border border-[rgb(var(--color-border))] shadow-xs text-xs font-mono">
          <div className="bg-[rgb(var(--color-card))] px-3.5 py-2.5 rounded-xl flex flex-col justify-center border border-[rgb(var(--color-border))]/50">
            <span className="text-[9px] uppercase tracking-wider text-[rgb(var(--color-muted))]">TODAY'S FOCUS</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-bold text-sm text-[rgb(var(--color-text))]">
                {todayHours}h {todayRemainingMins}m
              </span>
            </div>
          </div>

          <div className="bg-[rgb(var(--color-card))] px-3.5 py-2.5 rounded-xl flex flex-col justify-center border border-[rgb(var(--color-border))]/50">
            <span className="text-[9px] uppercase tracking-wider text-[rgb(var(--color-muted))]">DAILY GOAL</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-bold text-sm text-[rgb(var(--color-primary))]">{goalProgress}%</span>
              <span className="text-[10px] text-[rgb(var(--color-muted))]">/ {goalHours}h</span>
            </div>
          </div>

          <div className="bg-[rgb(var(--color-card))] px-3.5 py-2.5 rounded-xl flex flex-col justify-center border border-[rgb(var(--color-border))]/50">
            <span className="text-[9px] uppercase tracking-wider text-[rgb(var(--color-muted))]">STREAK</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-bold text-sm text-[rgb(var(--color-primary))]">{stats.streakDays} Days</span>
              <span className="text-xs">🔥</span>
            </div>
          </div>

          <div className="bg-[rgb(var(--color-card))] px-3.5 py-2.5 rounded-xl flex flex-col justify-center border border-[rgb(var(--color-border))]/50">
            <span className="text-[9px] uppercase tracking-wider text-[rgb(var(--color-muted))]">COMPLETED</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-bold text-sm text-[rgb(var(--color-text))]">{stats.completedSessions}</span>
              <span className="text-[10px] text-[rgb(var(--color-muted))]">intervals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Pomodoro Timer (8 cols) & Right Session Companion (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Pomodoro Studio */}
        <div className="lg:col-span-8 space-y-6">
          <PomodoroTimer />

          {/* Goal Progress Bar Card */}
          <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Target size={15} className="text-[rgb(var(--color-primary))]" />
                <span className="font-bold text-[rgb(var(--color-text))]">Daily Focus Goal Progress</span>
              </div>
              <span className="text-[rgb(var(--color-muted))]">
                {todayHours}h {todayRemainingMins}m / {goalHours}h {goalRemMins ? `${goalRemMins}m` : '00m'} ({goalProgress}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-[rgb(var(--color-container-high))] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[rgb(var(--color-primary))] to-indigo-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Session Objectives & Subject Distribution */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Session Task Checklist */}
          <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <h3 className="font-bold text-sm text-[rgb(var(--color-text))]">
                  Session Objectives
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))]">
                {tasks.filter(t => t.completed).length}/{tasks.length}
              </span>
            </div>

            <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
              Define target goals to accomplish during this Pomodoro interval.
            </p>

            {/* Task input */}
            <form onSubmit={handleAddTask} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add session goal..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-primary))]"
              />
              <button
                type="submit"
                disabled={!newTaskText.trim()}
                className="p-2 rounded-xl bg-[rgb(var(--color-primary))] text-white hover:brightness-105 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
                title="Add task"
              >
                <Plus size={16} />
              </button>
            </form>

            {/* Task list */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <div className="text-center py-4 text-xs font-mono text-[rgb(var(--color-muted))]">
                  No active objectives. Add one above!
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs ${
                      task.completed 
                        ? 'bg-[rgb(var(--color-container-low))]/50 border-[rgb(var(--color-border))]/50 text-[rgb(var(--color-muted))] line-through'
                        : 'bg-[rgb(var(--color-container-low))] border-[rgb(var(--color-border))] text-[rgb(var(--color-text))]'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-2.5 text-left min-w-0 flex-1 cursor-pointer"
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        task.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-[rgb(var(--color-muted))]'
                      }`}>
                        {task.completed && <CheckCircle2 size={12} />}
                      </span>
                      <span className="truncate">{task.text}</span>
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-[rgb(var(--color-muted))] hover:text-red-500 p-1 transition-colors cursor-pointer shrink-0"
                      title="Delete objective"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Subject Breakdown with dynamic subject colors */}
          <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-[rgb(var(--color-primary))]" />
                <h3 className="font-bold text-sm text-[rgb(var(--color-text))]">
                  Subject Time Distribution
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">Today</span>
            </div>

            <div className="space-y-3 text-xs">
              {Object.keys(stats.subjectMinutes || {}).length === 0 ? (
                <div className="text-center py-4 text-xs font-mono text-[rgb(var(--color-muted))]">
                  No focus time recorded yet today. Complete an interval to track subject distribution!
                </div>
              ) : (
                Object.entries(stats.subjectMinutes || {}).map(([subj, mins]) => {
                  const percent = Math.round((mins / (stats.todayMinutes || 1)) * 100);
                  const matchedSubject = subjects?.find(s => s.name === subj);
                  const barColor = matchedSubject?.color || '#9e3c26';
                  return (
                    <div key={subj} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate max-w-[180px]">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: barColor }} />
                          <span className="font-medium text-[rgb(var(--color-text))] truncate">{subj}</span>
                        </div>
                        <span className="font-mono text-[rgb(var(--color-muted))]">{mins}m ({percent}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-[rgb(var(--color-container-high))] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percent}%`, backgroundColor: barColor }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 3. Completed Sessions Log */}
          <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-[rgb(var(--color-text))]">
                <Clock size={15} className="text-[rgb(var(--color-muted))]" />
                <span>Recent Intervals</span>
              </div>
              <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                {history.length > 0 ? `Last ${history.length}` : 'Empty'}
              </span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-3 text-xs font-mono text-[rgb(var(--color-muted))]">
                No intervals recorded today yet.
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {history.slice(0, 5).map((entry) => (
                  <div 
                    key={entry.id}
                    className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color || '#9e3c26' }} />
                      <span className="font-medium text-[rgb(var(--color-text))] truncate">{entry.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[rgb(var(--color-muted))] shrink-0">
                      <span>{entry.duration}m</span>
                      <span>•</span>
                      <span>{entry.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
