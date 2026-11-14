import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import Modal from '../../components/ui/Modal';
import {
  Lock, Plus, Users, Clock, Key,
  Copy, Check, ChevronRight, MessageSquare, Shield, AlertCircle
} from 'lucide-react';

export default function PrivateSquadsSection({ onSelectSquadForCommit }) {
  const { user } = useAuth();
  const { squads, createSquad, findSquadByCode } = useStudyRooms();

  const [inputPasscode, setInputPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Create Squad Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Organic Chemistry II');
  const [passcode, setPasscode] = useState('');
  const [cycle, setCycle] = useState('25m Cycle');

  const handleJoinByCode = (e) => {
    e.preventDefault();
    setPasscodeError(null);
    if (!inputPasscode.trim()) return;

    const squad = findSquadByCode(inputPasscode);
    if (squad) {
      setInputPasscode('');
      onSelectSquadForCommit(squad);
    } else {
      setPasscodeError(`No private squad found matching passcode "${inputPasscode.trim().toUpperCase()}".`);
    }
  };

  const handleCreateSquad = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const created = createSquad({
      name: name.trim(),
      subject,
      code: passcode.trim(),
      cycleTime: cycle,
      description: `Private synchronized ${cycle} study group for ${subject}.`
    }, user);

    setShowCreateModal(false);
    setName('');
    setPasscode('');
    onSelectSquadForCommit(created);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header & Join Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgb(var(--color-border))] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3]">
              <Lock size={15} />
            </span>
            <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">
              Private Squad Enclaves
            </h2>
          </div>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
            Invite-only study groups with group chat & synchronized cycles. Public chatter has been removed.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-[#9e3c26]/20 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus size={14} />
          <span>New Private Squad</span>
        </button>
      </div>

      {/* Join with Passcode Card */}
      <div className="p-4 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
        <form onSubmit={handleJoinByCode} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" />
            <input
              type="text"
              value={inputPasscode}
              onChange={(e) => {
                setInputPasscode(e.target.value.toUpperCase());
                setPasscodeError(null);
              }}
              placeholder="Enter Squad Passcode (e.g. CHEM-42, NEURO-9)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-muted))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
            />
          </div>

          <button
            type="submit"
            disabled={!inputPasscode.trim()}
            className="px-5 py-2 rounded-xl bg-[rgb(var(--color-container))] hover:bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs font-bold text-[rgb(var(--color-text))] disabled:opacity-50 transition-colors cursor-pointer shrink-0"
          >
            Enter Squad
          </button>
        </form>

        {passcodeError && (
          <p className="text-[11px] text-red-500 flex items-center gap-1.5 mt-2 font-mono">
            <AlertCircle size={12} />
            <span>{passcodeError}</span>
          </p>
        )}
      </div>

      {/* Squad Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {squads.map(squad => (
          <div
            key={squad.id}
            className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] hover:border-[#9e3c26]/50 transition-all flex flex-col justify-between space-y-4 shadow-xs group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))] flex items-center gap-1">
                  <Clock size={11} />
                  <span>{squad.cycleTime}</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyCode(squad.code)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[10px] font-mono font-bold text-[#9e3c26] dark:text-[#ffb4a3] border border-[rgb(var(--color-border))] transition-colors cursor-pointer"
                  title="Copy Passcode to invite friends"
                >
                  {copiedCode === squad.code ? (
                    <>
                      <Check size={11} className="text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>{squad.code}</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <h3 className="font-bold text-base text-[rgb(var(--color-text))] group-hover:text-[#9e3c26] dark:group-hover:text-[#ffb4a3] transition-colors truncate">
                  {squad.name}
                </h3>
                <p className="text-[11px] font-mono text-[rgb(var(--color-muted))] mt-0.5 truncate">
                  {squad.subject}
                </p>
              </div>

              <p className="text-xs text-[rgb(var(--color-muted))] line-clamp-2 leading-relaxed">
                {squad.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[rgb(var(--color-border))] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[rgb(var(--color-muted))]">
                <Users size={13} />
                <span>{squad.memberCount || squad.members?.length || 1} scholars</span>
              </div>

              <button
                type="button"
                onClick={() => onSelectSquadForCommit(squad)}
                className="px-3 py-1.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
              >
                <span>Enter Chamber</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Squad Modal */}
      {showCreateModal && (
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="max-w-md">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[rgb(var(--color-border))] pb-3">
              <span className="p-2 rounded-xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3]">
                <Shield size={18} />
              </span>
              <div>
                <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
                  Create Private Squad Enclave
                </h3>
                <p className="text-xs text-[rgb(var(--color-muted))]">
                  Protected with a unique passcode for your study cohort.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSquad} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                  Squad Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bio-Chem Sprint Crew"
                  className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                  Academic Focus
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
                >
                  <option value="Organic Chemistry II">Organic Chemistry II</option>
                  <option value="Cognitive Neuroscience">Cognitive Neuroscience</option>
                  <option value="Linear Algebra">Linear Algebra</option>
                  <option value="Computer Systems">Computer Systems</option>
                  <option value="Macroeconomics">Macroeconomics</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                    Cycle Protocol
                  </label>
                  <select
                    value={cycle}
                    onChange={(e) => setCycle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
                  >
                    <option value="25m Cycle">25m Pomodoro</option>
                    <option value="50m Deep">50m Deep Work</option>
                    <option value="90m Flow">90m Ultra Flow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                    Custom Passcode
                  </label>
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white font-semibold text-xs cursor-pointer shadow-sm transition-all"
                >
                  Create Squad & Lock In
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-xs font-semibold text-[rgb(var(--color-text))] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

    </div>
  );
}

