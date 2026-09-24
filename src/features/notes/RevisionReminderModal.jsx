import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { Calendar, Bot, Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RevisionReminderModal({ isOpen, onClose, targetItem, onSave }) {
  const [reminderMode, setReminderMode] = useState('ai');
  const [manualDate, setManualDate] = useState('2026-09-18');
  const [manualTime, setManualTime] = useState('16:00');
  const [frequency, setFrequency] = useState('spaced');
  const [priority, setPriority] = useState('High');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!targetItem) return null;

  const handleSaveReminder = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      if (onSave) {
        onSave({
          itemId: targetItem.id,
          type: reminderMode,
          date: reminderMode === 'ai' ? 'Calculated by Smart Spacing' : `${manualDate} ${manualTime}`,
          frequency,
          priority
        });
      }
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="text-left mb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#9e3c26] dark:text-[#ffb4a3] uppercase tracking-wider mb-1 font-semibold">
          <Clock size={14} />
          <span>SCHEDULE SPACED REVISION</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-[rgb(var(--color-text))]">
          Set Revision Reminder
        </h3>
        <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
          Target: <strong className="text-[rgb(var(--color-text))] font-mono">{targetItem.name}</strong> ({targetItem.subject || 'Root Subject'})
        </p>
      </div>

      {/* Mode Switch */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] mb-5 shadow-inner">
        <button
          type="button"
          onClick={() => setReminderMode('ai')}
          className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
            reminderMode === 'ai'
              ? 'bg-[rgb(var(--color-card))] font-semibold text-[#9e3c26] dark:text-[#ffb4a3] shadow-xs'
              : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
          }`}
        >
          <Bot size={14} />
          <span>AI Algorithm Basis</span>
        </button>

        <button
          type="button"
          onClick={() => setReminderMode('manual')}
          className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
            reminderMode === 'manual'
              ? 'bg-[rgb(var(--color-card))] font-semibold text-[#9e3c26] dark:text-[#ffb4a3] shadow-xs'
              : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
          }`}
        >
          <Calendar size={14} />
          <span>Manual Schedule</span>
        </button>
      </div>

      <form onSubmit={handleSaveReminder} className="space-y-4">
        {reminderMode === 'ai' ? (
          <div className="space-y-3.5 p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[rgb(var(--color-text))] flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                Smart Adaptive Retention Tracking
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))]">
                Active
              </span>
            </div>

            <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
              The AI calculates your forgetting curve based on quiz response latency and note interaction intervals. Next optimal recall trigger estimated in <strong>3 days</strong> before retention falls under 65%.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[rgb(var(--color-border))]">
              <div className="p-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs">
                <div className="text-[10px] text-[rgb(var(--color-muted))] uppercase">Target Retention</div>
                <div className="font-bold text-[rgb(var(--color-secondary))] mt-0.5">85% - 95%</div>
              </div>
              <div className="p-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs">
                <div className="text-[10px] text-[rgb(var(--color-muted))] uppercase">Notification Type</div>
                <div className="font-bold text-[rgb(var(--color-text))] mt-0.5">Quiz Sprint</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                  Revision Date
                </label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                  Revision Time
                </label>
                <input
                  type="time"
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
                >
                  <option value="once">Once Only</option>
                  <option value="daily">Daily Repeat</option>
                  <option value="spaced">Spaced Intervals</option>
                  <option value="weekly">Weekly Deep Read</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                  Urgency Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
                >
                  <option value="Normal">Normal Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Critical">Critical Exam Block</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] dark:hover:bg-[#ffb4a3] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-[#9e3c26]/20 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 size={14} />
                <span>Reminder Synced!</span>
              </>
            ) : (
              <>
                <span>Save Revision Schedule</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
