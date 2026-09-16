import React, { useState, useEffect } from 'react';
import PomodoroTimer from '../features/pomodoro/PomodoroTimer';
import { 
  Flame, CheckCircle2, Clock, Plus, Trash2, 
  Sparkles, Target, BarChart2, BookOpen, Layers
} from 'lucide-react';

export default function Pomodoro() {
  const [activeSubject, setActiveSubject] = useState('Organic Chemistry II');

  // Focus Stats with LocalStorage
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-focus-stats');
      return saved ? JSON.parse(saved) : {
        todayMinutes: 225, // 3h 45m
        goalMinutes: 300,  // 5h 00m
        streakDays: 14,
        completedSessions: 6,
        subjectMinutes: {
          'Organic Chemistry II': 105,
          'Neuroscience': 60,
          'Linear Algebra': 60
        }
      };
    } catch {
      return {
        todayMinutes: 225,
        goalMinutes: 300,
        streakDays: 14,
        completedSessions: 6,
        subjectMinutes: {
          'Organic Chemistry II': 105,
          'Neuroscience': 60,
          'Linear Algebra': 60
        }
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rivisonly-focus-stats', JSON.stringify(stats));
    } catch (e) {
      console.warn('Could not save focus stats', e);
    }
  }, [stats]);

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

  // Session History Log
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-pomodoro-history');
      return saved ? JSON.parse(saved) : [
        { id: 1, subject: 'Organic Chemistry II', color: '#9e3c26', duration: 25, timestamp: '10:45 AM' },
        { id: 2, subject: 'Neuroscience', color: '#4b41e1', duration: 25, timestamp: '11:15 AM' },
        { id: 3, subject: 'Linear Algebra', color: '#059669', duration: 25, timestamp: '12:00 PM' },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rivisonly-pomodoro-history', JSON.stringify(history));
    } catch (e) {
      console.warn('Could not save history', e);
    }
  }, [history]);

  // Callback when a focus session completes
  const handleTimeLogged = (minutes, subjectName) => {
    setStats(prev => {
      const prevSubj = prev.subjectMinutes || {};
      const newSubjTime = (prevSubj[subjectName] || 0) + minutes;
      return {
        ...prev,
        todayMinutes: prev.todayMinutes + minutes,
        completedSessions: prev.completedSessions + 1,
        subjectMinutes: {
          ...prevSubj,
          [subjectName]: newSubjTime
        }
      };
    });
  };

  const handleSessionCompleted = (session) => {
    setHistory(prev => [
      { id: Date.now(), ...session },
      ...prev.slice(0, 9) // Keep last 10 entries
    ]);
  };

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
  const goalProgress = Math.min(100, Math.round((stats.todayMinutes / stats.goalMinutes) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in-up">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest uppercase text-[rgb(var(--color-muted))] flex items-center gap-1.5 mb-1">
            <span>FOCUS STUDIO // MATRIX</span>
            <span>/</span>
            <span className="text-[rgb(var(--color-primary))] font-semibold">ACTIVE SESSION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--color-text))]">
            Pomodoro Focus Studio
          </h1>
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
              <span className="text-[10px] text-emerald-500 font-medium">+{todayRemainingMins}m</span>
            </div>
          </div>

          <div className="bg-[rgb(var(--color-card))] px-3.5 py-2.5 rounded-xl flex flex-col justify-center border border-[rgb(var(--color-border))]/50">
            <span className="text-[9px] uppercase tracking-wider text-[rgb(var(--color-muted))]">DAILY GOAL</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-bold text-sm text-[rgb(var(--color-primary))]">{goalProgress}%</span>
              <span className="text-[10px] text-[rgb(var(--color-muted))]">/ 5h</span>
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
          <PomodoroTimer
            activeSubject={activeSubject}
            setActiveSubject={setActiveSubject}
            onTimeLogged={handleTimeLogged}
            onSessionCompleted={handleSessionCompleted}
          />

          {/* Goal Progress Bar Card */}
          <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Target size={15} className="text-[rgb(var(--color-primary))]" />
                <span className="font-bold text-[rgb(var(--color-text))]">Daily Focus Goal Progress</span>
              </div>
              <span className="text-[rgb(var(--color-muted))]">
                {todayHours}h {todayRemainingMins}m / 5h 00m ({goalProgress}%)
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

          {/* 2. Subject Breakdown */}
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
              {Object.entries(stats.subjectMinutes || {}).map(([subj, mins]) => {
                const percent = Math.round((mins / (stats.todayMinutes || 1)) * 100);
                return (
                  <div key={subj} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[rgb(var(--color-text))] truncate max-w-[180px]">{subj}</span>
                      <span className="font-mono text-[rgb(var(--color-muted))]">{mins}m ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[rgb(var(--color-container-high))] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[rgb(var(--color-primary))] rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Completed Sessions Log */}
          {history.length > 0 && (
            <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-[rgb(var(--color-text))]">
                  <Clock size={15} className="text-[rgb(var(--color-muted))]" />
                  <span>Recent Intervals</span>
                </div>
                <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">Last {history.length}</span>
              </div>

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
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
