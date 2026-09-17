import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, SkipForward, Bell, BellOff,
  Plus, Settings, Check, Maximize2, Minimize2, Edit2, 
  ChevronDown, Sparkles, X
} from 'lucide-react';
import { usePomodoro, PRESET_COLORS } from '../../context/PomodoroContext';

export default function PomodoroTimer() {
  const {
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
    initialDuration,
    isRunning,
    intervalCount,
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
  } = usePomodoro();

  // Subject Dropdown State
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState(PRESET_COLORS[0]);
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const dropdownRef = useRef(null);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempDurations, setTempDurations] = useState(durations);

  useEffect(() => {
    setTempDurations(durations);
  }, [durations]);

  // Inline time edit state
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editMinutes, setEditMinutes] = useState(Math.floor(timeLeft / 60));
  const [editSeconds, setEditSeconds] = useState(timeLeft % 60);

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

  // Time calculations
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // Progress calculations
  const totalDuration = Math.max(1, initialDuration || (durations[mode] || 25) * 60);
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));
  const radius = 112;
  const circumference = 2 * Math.PI * radius; // ~703.71
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Handlers
  const handleStartEditTime = () => {
    if (isRunning) toggleRun();
    setEditMinutes(Math.floor(timeLeft / 60));
    setEditSeconds(timeLeft % 60);
    setIsEditingTime(true);
  };

  const handleSaveEditTime = () => {
    applyManualTime(editMinutes, editSeconds);
    setIsEditingTime(false);
  };

  const handleSelectSubject = (subj) => {
    setActiveSubject(subj.name);
    setIsSubjectDropdownOpen(false);
  };

  const handleCreateSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    addSubject(newSubjectName, newSubjectColor);
    setNewSubjectName('');
    setShowAddSubjectForm(false);
    setIsSubjectDropdownOpen(false);
  };

  const handleSaveSettings = () => {
    updateDurations(tempDurations);
    setIsSettingsOpen(false);
  };

  return (
    <>
      <div className={`bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-3xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(20,27,43,0.05)] dark:shadow-none transition-all relative overflow-hidden ${
        isZenMode ? 'fixed inset-0 z-50 rounded-none flex flex-col justify-center items-center bg-[rgb(var(--color-surface))]' : ''
      }`}>
        
        {/* Ambient Glow */}
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 transition-colors duration-700" 
          style={{ backgroundColor: currentSubject?.color || '#9e3c26' }}
        />

        {/* TOP BAR: Subject Selector Dropdown + Utility Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-20 w-full">
          
          {/* CUSTOMIZABLE SUBJECT DROPDOWN MENU */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              className="px-4 py-2.5 rounded-2xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] font-semibold text-xs sm:text-sm flex items-center gap-2.5 shadow-xs transition-all cursor-pointer group"
              title="Click to select or create a subject"
            >
              <span 
                className="w-3 h-3 rounded-full shrink-0 shadow-xs" 
                style={{ backgroundColor: currentSubject?.color || '#9e3c26' }} 
              />
              <span className="truncate max-w-[160px] sm:max-w-[220px]">
                {currentSubject?.name || 'Select Subject'}
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
                    const isSelected = subj.name === currentSubject?.name;
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
              {/* Background Track Circle */}
              <circle
                cx="130"
                cy="130"
                r={radius}
                className="stroke-[rgb(var(--color-container))] dark:stroke-[rgb(var(--color-container-low))]"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress Circle (opacity: 0 when 0% to eliminate stray round cap dot artifact) */}
              <circle
                cx="130"
                cy="130"
                r={radius}
                style={{ 
                  stroke: currentSubject?.color || '#9e3c26',
                  opacity: progressPercent > 0.5 ? 1 : 0
                }}
                className="transition-all duration-300 ease-linear"
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
                  onClick={handleStartEditTime}
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
                      onClick={handleSaveEditTime}
                      className="px-3 py-1 rounded-lg bg-[rgb(var(--color-primary))] text-white text-xs font-semibold cursor-pointer shadow-xs hover:brightness-105 transition-all"
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
                      backgroundColor: idx + 1 <= intervalCount ? (currentSubject?.color || '#9e3c26') : 'rgb(var(--color-container-highest))'
                    }}
                  />
                ))}
                <span className="text-xs font-mono text-[rgb(var(--color-muted))] ml-1">
                  Interval {intervalCount}/{durations.cyclesBeforeLong}
                </span>
              </div>

              <span 
                className="text-[11px] font-mono tracking-widest uppercase font-bold mt-1.5"
                style={{ color: currentSubject?.color || '#9e3c26' }}
              >
                {mode === 'focus' ? 'Deep Work' : mode === 'short' ? 'Short Rest' : 'Extended Rest'}
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
                backgroundColor: currentSubject?.color || '#9e3c26',
                boxShadow: `0 8px 24px ${(currentSubject?.color || '#9e3c26')}40`
              }}
            >
              {isRunning ? (
                <>
                  <Pause size={19} fill="currentColor" />
                  <span>{mode === 'focus' ? 'Pause Session' : 'Pause Rest'}</span>
                </>
              ) : (
                <>
                  <Play size={19} fill="currentColor" className="ml-0.5" />
                  <span>{mode === 'focus' ? 'Start Session' : 'Start Rest'}</span>
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
                  value={tempDurations.focus}
                  onChange={(e) => setTempDurations({ ...tempDurations, focus: Math.max(1, parseInt(e.target.value, 10) || 1) })}
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
                  value={tempDurations.short}
                  onChange={(e) => setTempDurations({ ...tempDurations, short: Math.max(1, parseInt(e.target.value, 10) || 1) })}
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
                  value={tempDurations.long}
                  onChange={(e) => setTempDurations({ ...tempDurations, long: Math.max(1, parseInt(e.target.value, 10) || 1) })}
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
                  value={tempDurations.cyclesBeforeLong}
                  onChange={(e) => setTempDurations({ ...tempDurations, cyclesBeforeLong: Math.max(2, parseInt(e.target.value, 10) || 4) })}
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
                  onClick={() => setTempDurations({ focus: 25, short: 5, long: 15, cyclesBeforeLong: 4 })}
                  className="p-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-center cursor-pointer"
                >
                  <div className="font-bold">25 / 5</div>
                  <div className="text-[10px] text-[rgb(var(--color-muted))]">Classic</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTempDurations({ focus: 50, short: 10, long: 20, cyclesBeforeLong: 3 })}
                  className="p-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-center cursor-pointer"
                >
                  <div className="font-bold">50 / 10</div>
                  <div className="text-[10px] text-[rgb(var(--color-muted))]">Extended</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTempDurations({ focus: 15, short: 3, long: 10, cyclesBeforeLong: 4 })}
                  className="p-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-center cursor-pointer"
                >
                  <div className="font-bold">15 / 3</div>
                  <div className="text-[10px] text-[rgb(var(--color-muted))]">Sprint</div>
                </button>
              </div>
            </div>

            {/* Automation Options */}
            <div className="space-y-3 pt-3 border-t border-[rgb(var(--color-border))] text-xs font-mono">
              <span className="text-[11px] font-mono text-[rgb(var(--color-muted))] uppercase">Automation</span>
              
              <label className="flex items-center justify-between cursor-pointer group select-none">
                <div>
                  <div className="font-bold text-[rgb(var(--color-text))] font-sans group-hover:text-[rgb(var(--color-primary))] transition-colors">
                    Auto-start Rest / Breaks
                  </div>
                  <div className="text-[rgb(var(--color-muted))] text-[11px]">
                    Automatically countdown rest when session completes
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={tempDurations.autoStartBreaks !== false}
                  onChange={(e) => setTempDurations({ ...tempDurations, autoStartBreaks: e.target.checked })}
                  className="w-4 h-4 accent-[rgb(var(--color-primary))] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group select-none">
                <div>
                  <div className="font-bold text-[rgb(var(--color-text))] font-sans group-hover:text-[rgb(var(--color-primary))] transition-colors">
                    Auto-start Focus
                  </div>
                  <div className="text-[rgb(var(--color-muted))] text-[11px]">
                    Automatically countdown next session when rest ends
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={tempDurations.autoStartFocus === true}
                  onChange={(e) => setTempDurations({ ...tempDurations, autoStartFocus: e.target.checked })}
                  className="w-4 h-4 accent-[rgb(var(--color-primary))] rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl border border-[rgb(var(--color-border))] text-xs font-semibold hover:bg-[rgb(var(--color-container-low))] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-5 py-2 rounded-xl bg-[rgb(var(--color-primary))] text-white text-xs font-semibold hover:brightness-105 cursor-pointer shadow-md"
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
