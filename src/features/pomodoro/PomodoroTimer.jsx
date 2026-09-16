import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, SkipForward, Bell, BellOff,
  Plus, Settings, Check, Maximize2, Minimize2, Edit2, 
  ChevronDown, Volume2, Sparkles, X, Flame
} from 'lucide-react';

const DEFAULT_SUBJECTS = [
  { id: 'subj-1', name: 'Organic Chemistry II', color: '#9e3c26' },
  { id: 'subj-2', name: 'Neuroscience', color: '#4b41e1' },
  { id: 'subj-3', name: 'Linear Algebra', color: '#059669' },
  { id: 'subj-4', name: 'Microeconomics', color: '#d97706' },
  { id: 'subj-5', name: 'Computer Science', color: '#7c3aed' },
];

const PRESET_COLORS = [
  '#9e3c26', // Crimson / Coral
  '#4b41e1', // Indigo
  '#059669', // Emerald
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#0284c7', // Sky Blue
  '#db2777', // Pink
  '#475569', // Slate
];

export default function PomodoroTimer({ 
  activeSubject, 
  setActiveSubject, 
  onTimeLogged,
  onSessionCompleted 
}) {
  // 1. SUBJECT STATE WITH LOCALSTORAGE PERSISTENCE
  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-subjects');
      return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
    } catch {
      return DEFAULT_SUBJECTS;
    }
  });

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState(PRESET_COLORS[0]);
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const dropdownRef = useRef(null);

  // Save subjects to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('rivisonly-subjects', JSON.stringify(subjects));
    } catch (e) {
      console.warn('Could not save subjects to localStorage', e);
    }
  }, [subjects]);

  // Ensure activeSubject object or name exists
  const currentSubject = subjects.find(s => s.name === activeSubject) || subjects[0];

  // 2. CONFIGURABLE TIMER DURATIONS WITH PERSISTENCE
  const [durations, setDurations] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-durations');
      return saved ? JSON.parse(saved) : { focus: 25, short: 5, long: 15, cyclesBeforeLong: 4 };
    } catch {
      return { focus: 25, short: 5, long: 15, cyclesBeforeLong: 4 };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rivisonly-durations', JSON.stringify(durations));
    } catch (e) {
      console.warn('Could not save durations', e);
    }
  }, [durations]);

  // 3. TIMER ENGINE STATE
  const [mode, setMode] = useState('focus'); // 'focus' | 'short' | 'long'
  const [timeLeft, setTimeLeft] = useState(durations.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalCount, setIntervalCount] = useState(1);
  const [soundBell, setSoundBell] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Inline edit state
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editMinutes, setEditMinutes] = useState(durations.focus);
  const [editSeconds, setEditSeconds] = useState(0);

  // Timestamp-based drift-free timer ref
  const targetEndTimeRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSubjectDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update document title with remaining time
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const modeLabel = mode === 'focus' ? 'Focus' : mode === 'short' ? 'Short Break' : 'Long Break';
    
    if (isRunning) {
      document.title = `(${formatted}) ${modeLabel} — RivisOnly`;
    } else {
      document.title = `RivisOnly — Your AI Study Partner & Real-Time Focus Space`;
    }

    return () => {
      document.title = `RivisOnly — Your AI Study Partner & Real-Time Focus Space`;
    };
  }, [timeLeft, isRunning, mode]);

  // DRIFT-FREE TIMESTAMP TIMER LOOP
  useEffect(() => {
    let animationFrame = null;

    if (isRunning) {
      if (!targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + timeLeft * 1000;
      }

      const checkTime = () => {
        const remainingMs = targetEndTimeRef.current - Date.now();
        const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

        setTimeLeft(remainingSec);

        if (remainingSec <= 0) {
          handleSessionComplete();
        } else {
          animationFrame = requestAnimationFrame(checkTime);
        }
      };

      animationFrame = requestAnimationFrame(checkTime);
    } else {
      targetEndTimeRef.current = null;
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isRunning]);

  // PLAY WEBAUDIO HARMONIC CHIME
  const playHarmonicChime = () => {
    if (!soundBell) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Dual-tone harmonic academic chime (A5 880Hz + E6 1320Hz)
      const playTone = (freq, startOffset, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + startOffset);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + startOffset + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startOffset + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startOffset);
        osc.stop(ctx.currentTime + startOffset + duration);
      };

      playTone(587.33, 0.0, 1.2); // D5
      playTone(880.00, 0.15, 1.5); // A5
      playTone(1174.66, 0.35, 1.8); // D6
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  // SEND HTML5 BROWSER NOTIFICATION
  const triggerNotification = (title, body) => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.svg',
        });
      } catch (e) {
        console.warn('Notification error:', e);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        triggerNotification('RivisOnly Notifications Enabled', 'You will receive gentle alerts when intervals complete.');
      } else {
        setNotificationsEnabled(false);
      }
    }
  };

  // SESSION FINISH HANDLER
  const handleSessionComplete = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    playHarmonicChime();

    if (mode === 'focus') {
      const loggedMins = durations.focus;
      if (onTimeLogged) onTimeLogged(loggedMins, currentSubject.name);
      if (onSessionCompleted) {
        onSessionCompleted({
          subject: currentSubject.name,
          color: currentSubject.color,
          duration: loggedMins,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      triggerNotification(
        '🎯 Focus Session Completed!',
        `Awesome work on ${currentSubject.name}! Take a refreshing ${durations.short}-minute break.`
      );

      // Advance interval
      if (intervalCount >= durations.cyclesBeforeLong) {
        setMode('long');
        setTimeLeft(durations.long * 60);
        setIntervalCount(1);
      } else {
        setMode('short');
        setTimeLeft(durations.short * 60);
        setIntervalCount(prev => prev + 1);
      }
    } else {
      triggerNotification(
        '⚡ Break Over — Ready to Lock In?',
        `Time to begin your next focus interval on ${currentSubject.name}.`
      );
      setMode('focus');
      setTimeLeft(durations.focus * 60);
    }
  };

  // MODE SWITCHING
  const switchMode = (newMode) => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    setIsEditingTime(false);
    setMode(newMode);
    setTimeLeft(durations[newMode] * 60);
  };

  const toggleRun = () => {
    if (isEditingTime) {
      applyManualTimeEdit();
    }
    if (!isRunning && timeLeft <= 0) {
      setTimeLeft(durations[mode] * 60);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    setIsEditingTime(false);
    setTimeLeft(durations[mode] * 60);
  };

  const skipTimer = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    setIsEditingTime(false);
    if (mode === 'focus') {
      if (intervalCount >= durations.cyclesBeforeLong) {
        switchMode('long');
        setIntervalCount(1);
      } else {
        switchMode('short');
        setIntervalCount(prev => prev + 1);
      }
    } else {
      switchMode('focus');
    }
  };

  // QUICK TIME ADJUSTMENTS (+/- 1m, 5m)
  const adjustTime = (deltaSeconds) => {
    setTimeLeft(prev => {
      const nextTime = Math.max(60, prev + deltaSeconds);
      if (isRunning) {
        targetEndTimeRef.current = Date.now() + nextTime * 1000;
      }
      return nextTime;
    });
  };

  // MANUAL TIME EDIT (Direct typing of minutes/seconds)
  const startEditingTime = () => {
    if (isRunning) setIsRunning(false);
    targetEndTimeRef.current = null;
    setEditMinutes(Math.floor(timeLeft / 60));
    setEditSeconds(timeLeft % 60);
    setIsEditingTime(true);
  };

  const applyManualTimeEdit = () => {
    const mins = Math.max(0, parseInt(editMinutes, 10) || 0);
    const secs = Math.max(0, Math.min(59, parseInt(editSeconds, 10) || 0));
    const totalSecs = Math.max(10, mins * 60 + secs);
    setTimeLeft(totalSecs);
    setIsEditingTime(false);
  };

  // SUBJECT HANDLERS
  const handleSelectSubject = (subj) => {
    if (setActiveSubject) setActiveSubject(subj.name);
    setIsSubjectDropdownOpen(false);
  };

  const handleCreateSubject = (e) => {
    e.preventDefault();
    const trimmed = newSubjectName.trim();
    if (!trimmed) return;
    
    // Check if duplicate
    const exists = subjects.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      handleSelectSubject(exists);
      setNewSubjectName('');
      setShowAddSubjectForm(false);
      return;
    }

    const newSubj = {
      id: `subj-${Date.now()}`,
      name: trimmed,
      color: newSubjectColor
    };

    setSubjects(prev => [...prev, newSubj]);
    if (setActiveSubject) setActiveSubject(newSubj.name);
    setNewSubjectName('');
    setShowAddSubjectForm(false);
    setIsSubjectDropdownOpen(false);
  };

  // FORMATTING & CIRCULAR CALCULATIONS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  const totalDuration = (durations[mode] || 25) * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));
  const radius = 112;
  const circumference = 2 * Math.PI * radius; // ~703.71
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <>
      <div className={`bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-3xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(20,27,43,0.05)] dark:shadow-none transition-all relative overflow-hidden ${
        isZenMode ? 'fixed inset-0 z-50 rounded-none flex flex-col justify-center items-center bg-[rgb(var(--color-surface))]' : ''
      }`}>
        
        {/* Ambient Glow */}
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 transition-colors duration-700" 
          style={{ backgroundColor: currentSubject.color }}
        />

        {/* TOP BAR: Subject Selector Dropdown + Utility Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-20">
          
          {/* CUSTOMIZABLE SUBJECT DROPDOWN MENU */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              className="px-4 py-2.5 rounded-2xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] font-semibold text-xs sm:text-sm flex items-center gap-2.5 shadow-xs transition-all cursor-pointer group"
              title="Click to select or create a subject"
            >
              <span 
                className="w-3 h-3 rounded-full shrink-0 shadow-xs" 
                style={{ backgroundColor: currentSubject.color }} 
              />
              <span className="truncate max-w-[160px] sm:max-w-[220px]">
                {currentSubject.name}
              </span>
              <ChevronDown 
                size={15} 
                className={`text-[rgb(var(--color-muted))] group-hover:text-[rgb(var(--color-text))] transition-transform duration-200 ${
                  isSubjectDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu Box */}
            {isSubjectDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-2xl p-3 space-y-3 z-50 animate-fade-in-up text-[rgb(var(--color-text))]">
                <div className="flex items-center justify-between px-1 pb-1 border-b border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-muted))]">
                  <span>SELECT FOCUS SUBJECT</span>
                  <span className="text-[10px]">{subjects.length} Subjects</span>
                </div>

                {/* Subject List */}
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {subjects.map((subj) => {
                    const isSelected = subj.name === currentSubject.name;
                    return (
                      <button
                        key={subj.id}
                        onClick={() => handleSelectSubject(subj)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] font-bold'
                            : 'hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0" 
                            style={{ backgroundColor: subj.color }} 
                          />
                          <span className="truncate">{subj.name}</span>
                        </div>
                        {isSelected && <Check size={14} className="shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {/* Create New Subject Button or Form */}
                {!showAddSubjectForm ? (
                  <button
                    onClick={() => setShowAddSubjectForm(true)}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/5 text-xs font-mono text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create New Subject</span>
                  </button>
                ) : (
                  <form onSubmit={handleCreateSubject} className="p-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-2.5">
                    <div className="text-[11px] font-mono text-[rgb(var(--color-muted))] flex items-center justify-between">
                      <span>NEW SUBJECT</span>
                      <button 
                        type="button" 
                        onClick={() => setShowAddSubjectForm(false)}
                        className="hover:text-[rgb(var(--color-text))]"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="e.g. Cognitive Psychology"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-primary))]"
                      autoFocus
                    />

                    {/* Color palette pills */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {PRESET_COLORS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setNewSubjectColor(col)}
                          className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                            newSubjectColor === col ? 'scale-125 ring-2 ring-offset-1 ring-[rgb(var(--color-text))]' : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={!newSubjectName.trim()}
                        className="flex-1 py-1.5 rounded-lg bg-[rgb(var(--color-primary))] hover:brightness-105 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer shadow-xs transition-all"
                      >
                        Save & Select
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* RIGHT TOOLBAR: Bell Chime, Notifications, Fullscreen, Settings */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {/* Chime Toggle */}
            <button
              onClick={() => setSoundBell(!soundBell)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                soundBell
                  ? 'bg-[rgb(var(--color-container-low))] border-[rgb(var(--color-border))] text-[rgb(var(--color-primary))]'
                  : 'bg-transparent border-dashed border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]'
              }`}
              title={soundBell ? 'Sound Chime: Active (Click to mute)' : 'Sound Chime: Muted'}
            >
              {soundBell ? <Bell size={15} /> : <BellOff size={15} />}
            </button>

            {/* Browser Notifications Toggle */}
            <button
              onClick={requestNotificationPermission}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                notificationsEnabled
                  ? 'bg-[rgb(var(--color-container-low))] border-[rgb(var(--color-border))] text-emerald-500'
                  : 'bg-transparent border-dashed border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]'
              }`}
              title={notificationsEnabled ? 'Desktop Notifications Enabled' : 'Enable Desktop Notifications'}
            >
              <Sparkles size={15} />
            </button>

            {/* Zen Fullscreen Focus Mode */}
            <button
              onClick={() => setIsZenMode(!isZenMode)}
              className="p-2 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title={isZenMode ? "Exit Zen Mode" : "Enter Distraction-Free Zen Mode"}
            >
              {isZenMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Duration Settings Modal Toggle */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
              title="Customize Timer Durations"
            >
              <Settings size={15} />
            </button>
          </div>
        </div>

        {/* MODE SELECTOR TABS: Focus | Short Break | Long Break */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] shadow-inner">
            <button
              onClick={() => switchMode('focus')}
              className={`px-4 sm:px-5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                mode === 'focus'
                  ? 'bg-[rgb(var(--color-card))] text-[rgb(var(--color-primary))] shadow-sm'
                  : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
              }`}
            >
              Focus ({durations.focus}m)
            </button>
            <button
              onClick={() => switchMode('short')}
              className={`px-4 sm:px-5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                mode === 'short'
                  ? 'bg-[rgb(var(--color-card))] text-[rgb(var(--color-primary))] shadow-sm'
                  : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
              }`}
            >
              Short Break ({durations.short}m)
            </button>
            <button
              onClick={() => switchMode('long')}
              className={`px-4 sm:px-5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                mode === 'long'
                  ? 'bg-[rgb(var(--color-card))] text-[rgb(var(--color-primary))] shadow-sm'
                  : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
              }`}
            >
              Long Break ({durations.long}m)
            </button>
          </div>
        </div>

        {/* HERO CIRCULAR POMODORO CLOCK */}
        <div className="flex flex-col items-center justify-center my-2 relative z-10">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            
            {/* SVG Ring */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 260 260">
              <circle
                cx="130"
                cy="130"
                r={radius}
                className="stroke-[rgb(var(--color-container))] dark:stroke-[rgb(var(--color-container-low))]"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="130"
                cy="130"
                r={radius}
                style={{ stroke: currentSubject.color }}
                className="transition-all duration-700 ease-linear"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* CENTER TIME DISPLAY: Direct Click-to-Edit or Inline Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              
              {!isEditingTime ? (
                <div 
                  onClick={startEditingTime}
                  className="group flex items-center justify-center gap-1 cursor-pointer py-1 px-3 rounded-2xl hover:bg-[rgb(var(--color-container-low))]/60 transition-colors"
                  title="Click to edit timing"
                >
                  <span className="text-5xl sm:text-7xl font-bold tracking-tighter font-mono text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-primary))] transition-colors">
                    {formattedMinutes}:{formattedSeconds}
                  </span>
                  <Edit2 size={16} className="text-[rgb(var(--color-muted))] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                /* Inline Manual Time Editor */
                <div className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] shadow-lg">
                  <div className="flex items-center gap-1 font-mono text-3xl sm:text-4xl font-bold text-[rgb(var(--color-text))]">
                    <input
                      type="number"
                      min="0"
                      max="180"
                      value={editMinutes}
                      onChange={(e) => setEditMinutes(e.target.value)}
                      className="w-16 text-center bg-[rgb(var(--color-card))] rounded-lg border border-[rgb(var(--color-border))] p-1 focus:outline-none focus:border-[rgb(var(--color-primary))]"
                      autoFocus
                    />
                    <span>:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={editSeconds}
                      onChange={(e) => setEditSeconds(e.target.value)}
                      className="w-16 text-center bg-[rgb(var(--color-card))] rounded-lg border border-[rgb(var(--color-border))] p-1 focus:outline-none focus:border-[rgb(var(--color-primary))]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={applyManualTimeEdit}
                      className="px-3 py-1 rounded-lg bg-[rgb(var(--color-primary))] text-white text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Set Time
                    </button>
                    <button
                      onClick={() => setIsEditingTime(false)}
                      className="px-3 py-1 rounded-lg bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Interval Dots / Cycle Progression */}
              <div className="flex items-center gap-2 mt-2">
                {Array.from({ length: durations.cyclesBeforeLong }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      idx + 1 === intervalCount
                        ? 'scale-125 animate-pulse'
                        : ''
                    }`}
                    style={{
                      backgroundColor: idx + 1 <= intervalCount ? currentSubject.color : 'rgb(var(--color-container-highest))'
                    }}
                  />
                ))}
                <span className="text-xs font-mono text-[rgb(var(--color-muted))] ml-1">
                  Interval {intervalCount}/{durations.cyclesBeforeLong}
                </span>
              </div>

              <span 
                className="text-[11px] font-mono tracking-widest uppercase font-bold mt-1.5"
                style={{ color: currentSubject.color }}
              >
                {mode === 'focus' ? 'Deep Work' : 'Rest Cadence'}
              </span>

            </div>
          </div>

          {/* QUICK EDIT STEP CONTROLS: -5m, -1m, +1m, +5m */}
          {!isRunning && !isEditingTime && (
            <div className="flex items-center gap-2 mt-3 text-xs font-mono text-[rgb(var(--color-muted))]">
              <span className="text-[10px] uppercase font-bold tracking-wider mr-1">Quick Adjust:</span>
              <button
                onClick={() => adjustTime(-5 * 60)}
                className="px-2.5 py-1 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
                title="Subtract 5 minutes"
              >
                -5m
              </button>
              <button
                onClick={() => adjustTime(-1 * 60)}
                className="px-2.5 py-1 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
                title="Subtract 1 minute"
              >
                -1m
              </button>
              <button
                onClick={() => adjustTime(1 * 60)}
                className="px-2.5 py-1 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
                title="Add 1 minute"
              >
                +1m
              </button>
              <button
                onClick={() => adjustTime(5 * 60)}
                className="px-2.5 py-1 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
                title="Add 5 minutes"
              >
                +5m
              </button>
            </div>
          )}

          {/* MAIN PLAYER CONTROLS: Reset, Start/Pause, Skip */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={resetTimer}
              className="w-12 h-12 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={toggleRun}
              className="px-8 py-4 rounded-2xl text-white font-semibold text-sm flex items-center gap-2.5 shadow-xl transition-all cursor-pointer min-w-[180px] justify-center active:scale-95 hover:brightness-105"
              style={{ 
                backgroundColor: currentSubject.color,
                boxShadow: `0 8px 24px ${currentSubject.color}40`
              }}
            >
              {isRunning ? (
                <>
                  <Pause size={19} fill="currentColor" />
                  <span>Pause Session</span>
                </>
              ) : (
                <>
                  <Play size={19} fill="currentColor" className="ml-0.5" />
                  <span>Start Session</span>
                </>
              )}
            </button>

            <button
              onClick={skipTimer}
              className="w-12 h-12 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Skip to Next Interval"
            >
              <SkipForward size={18} />
            </button>
          </div>

        </div>

      </div>

      {/* DURATION SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in-up">
          <div className="w-full max-w-md bg-[rgb(var(--color-card))] rounded-3xl border border-[rgb(var(--color-border))] p-6 shadow-2xl space-y-6 text-[rgb(var(--color-text))]">
            
            <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-3">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-[rgb(var(--color-primary))]" />
                <h3 className="font-bold text-base">Pomodoro Timer Settings</h3>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Duration Input Fields */}
            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[rgb(var(--color-text))] font-sans">Focus Duration</div>
                  <div className="text-[rgb(var(--color-muted))] text-[11px]">Minutes per work interval</div>
                </div>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={durations.focus}
                  onChange={(e) => setDurations({ ...durations, focus: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                  className="w-20 px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-center font-bold text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[rgb(var(--color-text))] font-sans">Short Break</div>
                  <div className="text-[rgb(var(--color-muted))] text-[11px]">Minutes for regular rest</div>
                </div>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={durations.short}
                  onChange={(e) => setDurations({ ...durations, short: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                  className="w-20 px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-center font-bold text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[rgb(var(--color-text))] font-sans">Long Break</div>
                  <div className="text-[rgb(var(--color-muted))] text-[11px]">Minutes for extended rest</div>
                </div>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={durations.long}
                  onChange={(e) => setDurations({ ...durations, long: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                  className="w-20 px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-center font-bold text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[rgb(var(--color-text))] font-sans">Long Break Interval</div>
                  <div className="text-[rgb(var(--color-muted))] text-[11px]">Cycles before long break</div>
                </div>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={durations.cyclesBeforeLong}
                  onChange={(e) => setDurations({ ...durations, cyclesBeforeLong: Math.max(2, parseInt(e.target.value, 10) || 4) })}
                  className="w-20 px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-center font-bold text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-primary))]"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2 pt-2 border-t border-[rgb(var(--color-border))]">
              <span className="text-[11px] font-mono text-[rgb(var(--color-muted))] uppercase">Quick Presets</span>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setDurations({ focus: 25, short: 5, long: 15, cyclesBeforeLong: 4 })}
                  className="p-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-center cursor-pointer"
                >
                  <div className="font-bold">25 / 5</div>
                  <div className="text-[10px] text-[rgb(var(--color-muted))]">Classic</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDurations({ focus: 50, short: 10, long: 20, cyclesBeforeLong: 3 })}
                  className="p-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-center cursor-pointer"
                >
                  <div className="font-bold">50 / 10</div>
                  <div className="text-[10px] text-[rgb(var(--color-muted))]">Extended</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDurations({ focus: 15, short: 3, long: 10, cyclesBeforeLong: 4 })}
                  className="p-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-center cursor-pointer"
                >
                  <div className="font-bold">15 / 3</div>
                  <div className="text-[10px] text-[rgb(var(--color-muted))]">Sprint</div>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-4">
              <button
                onClick={() => {
                  setTimeLeft(durations[mode] * 60);
                  setIsSettingsOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[rgb(var(--color-primary))] text-white text-xs font-semibold hover:brightness-105 cursor-pointer shadow-md"
              >
                Save & Apply
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
