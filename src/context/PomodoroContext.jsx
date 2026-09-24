import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PomodoroContext = createContext(null);

export const DEFAULT_SUBJECTS = [
  { id: 'subj-1', name: 'Organic Chemistry II', color: '#9e3c26' },
  { id: 'subj-2', name: 'Neuroscience', color: '#4b41e1' },
  { id: 'subj-3', name: 'Linear Algebra', color: '#059669' },
  { id: 'subj-4', name: 'Microeconomics', color: '#d97706' },
  { id: 'subj-5', name: 'Computer Science', color: '#7c3aed' },
];

export const PRESET_COLORS = [
  '#9e3c26', // Crimson / Coral
  '#4b41e1', // Indigo
  '#059669', // Emerald
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#0284c7', // Sky Blue
  '#db2777', // Pink
  '#475569', // Slate
];

const DEFAULT_DURATIONS = {
  focus: 25,
  short: 5,
  long: 15,
  cyclesBeforeLong: 4,
  autoStartBreaks: true,
  autoStartFocus: false,
};

export const DEFAULT_STATS = {
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

export const DEFAULT_HISTORY = [
  { id: 1, subject: 'Organic Chemistry II', color: '#9e3c26', duration: 25, timestamp: '10:45 AM' },
  { id: 2, subject: 'Neuroscience', color: '#4b41e1', duration: 25, timestamp: '11:15 AM' },
  { id: 3, subject: 'Linear Algebra', color: '#059669', duration: 25, timestamp: '12:00 PM' },
];

export function PomodoroProvider({ children }) {
  // 1. SUBJECTS STATE
  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-subjects');
      return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
    } catch {
      return DEFAULT_SUBJECTS;
    }
  });

  const [activeSubject, setActiveSubject] = useState(() => {
    try {
      return localStorage.getItem('rivisonly-active-subject') || DEFAULT_SUBJECTS[0].name;
    } catch {
      return DEFAULT_SUBJECTS[0].name;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rivisonly-subjects', JSON.stringify(subjects));
    } catch (e) {
      console.warn('Failed to save subjects', e);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem('rivisonly-active-subject', activeSubject);
    } catch (e) {
      console.warn('Failed to save active subject', e);
    }
  }, [activeSubject]);

  const currentSubject = subjects.find(s => s.name === activeSubject) || subjects[0] || DEFAULT_SUBJECTS[0];

  const addSubject = (name, color) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const existing = subjects.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      setActiveSubject(existing.name);
      return existing;
    }
    const newSubj = {
      id: `subj-${Date.now()}`,
      name: trimmed,
      color: color || PRESET_COLORS[0],
    };
    setSubjects(prev => [...prev, newSubj]);
    setActiveSubject(newSubj.name);
    return newSubj;
  };

  // 2. CONFIGURABLE DURATIONS
  const [durations, setDurations] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-durations');
      return saved ? { ...DEFAULT_DURATIONS, ...JSON.parse(saved) } : DEFAULT_DURATIONS;
    } catch {
      return DEFAULT_DURATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rivisonly-durations', JSON.stringify(durations));
    } catch (e) {
      console.warn('Failed to save durations', e);
    }
  }, [durations]);

  // 3. TIMER ENGINE CORE STATE
  const [mode, setMode] = useState('focus'); // 'focus' | 'short' | 'long'
  const [timeLeft, setTimeLeft] = useState(() => (durations.focus || 25) * 60);
  const [initialDuration, setInitialDuration] = useState(() => (durations.focus || 25) * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalCount, setIntervalCount] = useState(1);
  const [isZenMode, setIsZenMode] = useState(false);

  const [soundBell, setSoundBell] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-bell');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rivisonly-bell', JSON.stringify(soundBell));
    } catch (e) {
      console.warn('Failed to save bell setting', e);
    }
  }, [soundBell]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted';
    }
    return false;
  });

  // 4. STATS & HISTORY
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-focus-stats');
      return saved ? JSON.parse(saved) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rivisonly-focus-stats', JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save focus stats', e);
    }
  }, [stats]);

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('rivisonly-pomodoro-history');
      return saved ? JSON.parse(saved) : DEFAULT_HISTORY;
    } catch {
      return DEFAULT_HISTORY;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rivisonly-pomodoro-history', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history', e);
    }
  }, [history]);

  // Ref tracking absolute finish timestamp for drift-free background execution
  const targetEndTimeRef = useRef(null);
  const audioContextRef = useRef(null);

  // 5. AUDIO CHIME (Resumes AudioContext safely)
  const playHarmonicChime = () => {
    if (!soundBell) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

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

      playTone(587.33, 0.0, 1.2);  // D5
      playTone(880.00, 0.15, 1.5);  // A5
      playTone(1174.66, 0.35, 1.8); // D6
    } catch (e) {
      console.warn('Chime audio error:', e);
    }
  };

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
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          triggerNotification('Rivisonly Notifications Enabled', 'You will receive gentle alerts when intervals complete.');
        } else {
          setNotificationsEnabled(false);
        }
      } catch (e) {
        console.warn('Permission request error:', e);
      }
    }
  };

  // 6. SESSION COMPLETION HANDLER
  const handleSessionComplete = () => {
    playHarmonicChime();

    if (mode === 'focus') {
      const loggedMins = Math.max(1, Math.round(initialDuration / 60));
      
      // Update stats
      setStats(prev => {
        const prevSubj = prev.subjectMinutes || {};
        const newSubjTime = (prevSubj[currentSubject.name] || 0) + loggedMins;
        return {
          ...prev,
          todayMinutes: prev.todayMinutes + loggedMins,
          completedSessions: prev.completedSessions + 1,
          subjectMinutes: {
            ...prevSubj,
            [currentSubject.name]: newSubjTime
          }
        };
      });

      // Update history log
      setHistory(prev => [
        {
          id: Date.now(),
          subject: currentSubject.name,
          color: currentSubject.color,
          duration: loggedMins,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev.slice(0, 9)
      ]);

      const isLongBreak = intervalCount >= (durations.cyclesBeforeLong || 4);
      const nextMode = isLongBreak ? 'long' : 'short';
      const nextDurationMins = isLongBreak ? (durations.long || 15) : (durations.short || 5);
      const nextSecs = nextDurationMins * 60;
      const shouldAutoStart = durations.autoStartBreaks !== false; // Default true (automatically start rest)

      triggerNotification(
        '🎯 Focus Session Completed!',
        `Awesome work on ${currentSubject.name}! Your ${nextDurationMins}-minute ${isLongBreak ? 'extended rest' : 'break'} ${shouldAutoStart ? 'has automatically started.' : 'is ready.'}`
      );

      // Transition to next interval
      setMode(nextMode);
      setTimeLeft(nextSecs);
      setInitialDuration(nextSecs);
      setIntervalCount(isLongBreak ? 1 : intervalCount + 1);

      if (shouldAutoStart) {
        targetEndTimeRef.current = Date.now() + (nextSecs * 1000);
        setIsRunning(true);
      } else {
        targetEndTimeRef.current = null;
        setIsRunning(false);
      }
    } else {
      // Break / Rest completed
      const shouldAutoFocus = durations.autoStartFocus === true;
      const nextSecs = (durations.focus || 25) * 60;

      triggerNotification(
        '⚡ Rest Completed — Ready to Lock In?',
        `Time to begin your next focus interval on ${currentSubject.name}.`
      );

      setMode('focus');
      setTimeLeft(nextSecs);
      setInitialDuration(nextSecs);

      if (shouldAutoFocus) {
        targetEndTimeRef.current = Date.now() + (nextSecs * 1000);
        setIsRunning(true);
      } else {
        targetEndTimeRef.current = null;
        setIsRunning(false);
      }
    }
  };

  // 7. ROCK-SOLID DRIFT-FREE TIMER LOOP (Interval + VisibilityChange)
  useEffect(() => {
    let intervalId = null;

    if (isRunning) {
      if (!targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + (timeLeft * 1000);
      }

      const syncTimer = () => {
        if (!targetEndTimeRef.current) return;
        const remainingMs = targetEndTimeRef.current - Date.now();
        const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

        setTimeLeft(remainingSec);

        if (remainingSec <= 0) {
          targetEndTimeRef.current = null;
          handleSessionComplete();
        }
      };

      intervalId = setInterval(syncTimer, 250);

      // Instant sync when user switches tabs or focuses browser window
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && targetEndTimeRef.current) {
          syncTimer();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleVisibilityChange);

      return () => {
        if (intervalId) clearInterval(intervalId);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleVisibilityChange);
      };
    } else {
      targetEndTimeRef.current = null;
    }
  }, [isRunning, mode, durations, currentSubject, intervalCount, initialDuration]);

  // 8. DYNAMIC DOCUMENT TITLE
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const modeLabel = mode === 'focus' ? 'Focus' : mode === 'short' ? 'Short Break' : 'Long Break';

    if (isRunning) {
      document.title = `(${formatted}) ${modeLabel} — Rivisonly`;
    } else {
      document.title = `Rivisonly — Your AI Study Partner & Real-Time Focus Space`;
    }
  }, [timeLeft, isRunning, mode]);

  // 9. CONTROLLER ACTIONS
  const toggleRun = () => {
    if (!isRunning) {
      let runSeconds = timeLeft;
      if (timeLeft <= 0) {
        runSeconds = (durations[mode] || 25) * 60;
        setTimeLeft(runSeconds);
        setInitialDuration(runSeconds);
      }
      targetEndTimeRef.current = Date.now() + (runSeconds * 1000);
      setIsRunning(true);
    } else {
      targetEndTimeRef.current = null;
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    const defaultSecs = (durations[mode] || 25) * 60;
    setTimeLeft(defaultSecs);
    setInitialDuration(defaultSecs);
  };

  const skipTimer = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;

    if (mode === 'focus') {
      const elapsedSecs = Math.max(0, initialDuration - timeLeft);
      const elapsedMins = Math.floor(elapsedSecs / 60);

      // If user worked for at least 1 minute before skipping, log it
      if (elapsedMins >= 1) {
        setStats(prev => {
          const prevSubj = prev.subjectMinutes || {};
          const newSubjTime = (prevSubj[currentSubject.name] || 0) + elapsedMins;
          return {
            ...prev,
            todayMinutes: prev.todayMinutes + elapsedMins,
            completedSessions: prev.completedSessions + 1,
            subjectMinutes: {
              ...prevSubj,
              [currentSubject.name]: newSubjTime
            }
          };
        });

        setHistory(prev => [
          {
            id: Date.now(),
            subject: currentSubject.name,
            color: currentSubject.color,
            duration: elapsedMins,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          ...prev.slice(0, 9)
        ]);
      }

      const isLongBreak = intervalCount >= (durations.cyclesBeforeLong || 4);
      const nextMode = isLongBreak ? 'long' : 'short';
      const nextDurationMins = isLongBreak ? (durations.long || 15) : (durations.short || 5);
      const nextSecs = nextDurationMins * 60;
      setMode(nextMode);
      setTimeLeft(nextSecs);
      setInitialDuration(nextSecs);
      setIntervalCount(isLongBreak ? 1 : intervalCount + 1);
    } else {
      setMode('focus');
      const nextSecs = (durations.focus || 25) * 60;
      setTimeLeft(nextSecs);
      setInitialDuration(nextSecs);
    }
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    setMode(newMode);
    const newSecs = (durations[newMode] || 25) * 60;
    setTimeLeft(newSecs);
    setInitialDuration(newSecs);
  };

  const adjustTime = (deltaSeconds) => {
    const nextTime = Math.max(10, timeLeft + deltaSeconds);
    setTimeLeft(nextTime);
    if (!isRunning) {
      setInitialDuration(nextTime);
    } else {
      setInitialDuration(prev => Math.max(nextTime, prev + deltaSeconds));
      targetEndTimeRef.current = Date.now() + (nextTime * 1000);
    }
  };

  const applyManualTime = (mins, secs) => {
    const validMins = Math.max(0, parseInt(mins, 10) || 0);
    const validSecs = Math.max(0, Math.min(59, parseInt(secs, 10) || 0));
    const totalSecs = Math.max(10, (validMins * 60) + validSecs);
    setTimeLeft(totalSecs);
    setInitialDuration(totalSecs);
    if (isRunning) {
      targetEndTimeRef.current = Date.now() + (totalSecs * 1000);
    }
  };

  const updateDurations = (newDurations) => {
    setDurations(newDurations);
    const modeSecs = (newDurations[mode] || 25) * 60;
    if (!isRunning) {
      setTimeLeft(modeSecs);
      setInitialDuration(modeSecs);
    } else if (targetEndTimeRef.current) {
      const diff = modeSecs - initialDuration;
      const nextTime = Math.max(10, timeLeft + diff);
      setTimeLeft(nextTime);
      setInitialDuration(modeSecs);
      targetEndTimeRef.current = Date.now() + (nextTime * 1000);
    }
  };

  const resetStats = () => {
    const fresh = {
      todayMinutes: 0,
      goalMinutes: 300,
      streakDays: 1,
      completedSessions: 0,
      subjectMinutes: {}
    };
    setStats(fresh);
    setHistory([]);
  };

  const resetToDemoStats = () => {
    setStats(DEFAULT_STATS);
    setHistory(DEFAULT_HISTORY);
  };

  return (
    <PomodoroContext.Provider value={{
      subjects,
      activeSubject,
      setActiveSubject,
      currentSubject,
      addSubject,
      durations,
      updateDurations,
      mode,
      switchMode,
      timeLeft,
      setTimeLeft,
      initialDuration,
      isRunning,
      intervalCount,
      setIntervalCount,
      toggleRun,
      resetTimer,
      skipTimer,
      adjustTime,
      applyManualTime,
      soundBell,
      setSoundBell,
      notificationsEnabled,
      requestNotificationPermission,
      isZenMode,
      setIsZenMode,
      stats,
      setStats,
      history,
      setHistory,
      resetStats,
      resetToDemoStats
    }}>
      {children}
    </PomodoroContext.Provider>
  );
}

export const usePomodoro = () => {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error('usePomodoro must be used within PomodoroProvider');
  return ctx;
};
