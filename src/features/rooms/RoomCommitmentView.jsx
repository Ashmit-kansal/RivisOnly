import React, { useState } from 'react';
import { 
  Lock, ArrowLeft, Clock, ShieldAlert, Sparkles, 
  Users, CheckCircle2, Flame, ArrowRight 
} from 'lucide-react';

export default function RoomCommitmentView({ room, onCommit, onCancel }) {
  const [committedDuration, setCommittedDuration] = useState(25);
  const [customMinutes, setCustomMinutes] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const presets = [
    { mins: 15, label: '15m Sprint', desc: 'Quick warmup or rapid review' },
    { mins: 25, label: '25m Standard', desc: 'Classic Pomodoro focus block' },
    { mins: 45, label: '45m Deep Work', desc: 'Sustained problem solving' },
    { mins: 60, label: '60m Marathon', desc: 'Intense analytical study' },
    { mins: 90, label: '90m Master', desc: 'Full exam simulation block' },
  ];

  const handleSelectPreset = (mins) => {
    setIsCustom(false);
    setCommittedDuration(mins);
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomMinutes(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setCommittedDuration(parsed);
    }
  };

  const handleConfirm = () => {
    const finalMinutes = isCustom ? (parseInt(customMinutes, 10) || 25) : committedDuration;
    onCommit(Math.max(1, Math.min(240, finalMinutes)));
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 sm:py-8 space-y-6 animate-fade-in-up">
      
      {/* Top Back Link */}
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-xs font-mono text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Back to Study Halls Lobby</span>
      </button>

      {/* Main Commitment Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#9e3c26]/10 dark:bg-[#e26f54]/15 blur-3xl pointer-events-none" />

        {/* Room Header Preview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgb(var(--color-border))] pb-5">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase text-[#9e3c26] dark:text-[#ffb4a3] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#9e3c26] dark:bg-[#e26f54] animate-pulse" />
              <span>{room.subject}</span>
              <span>•</span>
              <span className="text-[rgb(var(--color-muted))]">{room.tag || 'Focus Room'}</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--color-text))]">
              {room.name}
            </h2>
            <p className="text-xs text-[rgb(var(--color-muted))] mt-1 leading-relaxed">
              {room.description}
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs font-mono shrink-0 flex items-center gap-2">
            <Users size={14} className="text-[rgb(var(--color-primary))]" />
            <span>{(room.members || []).length} Peers Live</span>
          </div>
        </div>

        {/* Commitment Instructions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] flex items-center justify-center">
              <Lock size={16} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[rgb(var(--color-text))]">
                Commit Time to Lock Into Room
              </h3>
              <p className="text-xs text-[rgb(var(--color-muted))]">
                Select your focus sprint duration before entering the study hall.
              </p>
            </div>
          </div>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {presets.map((p) => {
              const selected = !isCustom && committedDuration === p.mins;
              return (
                <button
                  key={p.mins}
                  type="button"
                  onClick={() => handleSelectPreset(p.mins)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selected
                      ? 'bg-[rgb(var(--color-primary))]/10 border-[rgb(var(--color-primary))] shadow-sm scale-[1.01]'
                      : 'bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border-[rgb(var(--color-border))]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[rgb(var(--color-text))]">
                      {p.label}
                    </span>
                    {selected && <CheckCircle2 size={16} className="text-[rgb(var(--color-primary))]" />}
                  </div>
                  <span className="text-[11px] text-[rgb(var(--color-muted))] mt-1 leading-snug">
                    {p.desc}
                  </span>
                </button>
              );
            })}

            {/* Custom Minutes Option */}
            <div
              onClick={() => setIsCustom(true)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isCustom
                  ? 'bg-[rgb(var(--color-primary))]/10 border-[rgb(var(--color-primary))] shadow-sm scale-[1.01]'
                  : 'bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border-[rgb(var(--color-border))]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[rgb(var(--color-text))]">
                  Custom Time
                </span>
                {isCustom && <CheckCircle2 size={16} className="text-[rgb(var(--color-primary))]" />}
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="240"
                  placeholder="Minutes"
                  value={customMinutes}
                  onChange={handleCustomChange}
                  onFocus={() => setIsCustom(true)}
                  className="w-20 px-2 py-1 rounded-lg bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs font-mono font-bold text-center focus:outline-none focus:border-[rgb(var(--color-primary))]"
                />
                <span className="text-xs font-mono text-[rgb(var(--color-muted))]">mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strictest Commitment Warning Callout */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-2 font-bold font-mono uppercase text-[11px] text-amber-600 dark:text-amber-400">
            <ShieldAlert size={15} />
            <span>Focus Lock Agreement & Exit Protection</span>
          </div>
          <p>
            By entering, you are committing to stay focused in this room for{' '}
            <strong className="underline font-bold font-mono">
              {isCustom ? (customMinutes || 25) : committedDuration} minutes
            </strong>.
            If you click <em>Exit Room</em> before the timer reaches zero, your progress and session streak bonus for this block will be <strong>lost</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel & Stay in Lobby
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] dark:hover:bg-[#ffb4a3] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#9e3c26]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Lock size={15} />
            <span>
              Lock In & Enter Room ({isCustom ? (customMinutes || 25) : committedDuration}m)
            </span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>

    </div>
  );
}
