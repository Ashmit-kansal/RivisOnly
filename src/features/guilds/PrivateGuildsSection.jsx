import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import Modal from '../../components/ui/Modal';
import UserAvatar from '../../components/ui/UserAvatar';
import {
  Lock, Key, Users, Trophy, Star, Shield, Send,
  Plus, Copy, Check, RefreshCw, LogOut, ArrowRight, Sparkles, MessageSquare
} from 'lucide-react';

export default function PrivateGuildsSection({ onEnterChamber }) {
  const { user } = useAuth();
  const {
    myGuild,
    guilds,
    createGuild,
    joinGuildByCode,
    leaveGuild,
    regenerateGuildCode,
    sendGuildMessage,
    userTrophies,
    warStars
  } = useStudyRooms();

  // Passcode unlock input
  const [passcode, setPasscode] = useState('');
  const [unlockError, setUnlockError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Chat message input
  const [chatInput, setChatInput] = useState('');

  // Found Guild Modal State
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildMotto, setNewGuildMotto] = useState('');
  const [newGuildBadge, setNewGuildBadge] = useState('🛡️');
  const [newGuildBg, setNewGuildBg] = useState('from-purple-600 to-indigo-800');

  const BADGE_OPTIONS = ['🛡️', '🔮', '⚔️', '⚡', '⚜️', '👑', '🐉', '💻', '🌟', '🎯'];
  const BG_OPTIONS = [
    { label: 'Royal Purple', class: 'from-purple-600 to-indigo-800' },
    { label: 'Crimson Flame', class: 'from-rose-600 to-red-800' },
    { label: 'Emerald Order', class: 'from-emerald-600 to-teal-800' },
    { label: 'Solar Amber', class: 'from-amber-500 to-orange-700' },
    { label: 'Cyber Blue', class: 'from-cyan-600 to-blue-800' },
  ];

  // JOIN BY CODE
  const handleJoinGuild = (e) => {
    e?.preventDefault();
    setUnlockError(null);
    if (!passcode.trim()) {
      setUnlockError('Please enter a secret passcode.');
      return;
    }

    const res = joinGuildByCode(passcode, user);
    if (!res.success) {
      setUnlockError(res.error);
    } else {
      setPasscode('');
    }
  };

  // FOUND NEW GUILD
  const handleFoundGuildSubmit = (e) => {
    e?.preventDefault();
    if (!newGuildName.trim()) return;

    createGuild({
      name: newGuildName.trim(),
      motto: newGuildMotto.trim() || 'Discipline, focus, and victory.',
      badge: newGuildBadge,
      badgeBg: newGuildBg
    }, user);

    setShowFoundModal(false);
    setNewGuildName('');
    setNewGuildMotto('');
  };

  // COPY CODE
  const handleCopyCode = () => {
    if (!myGuild?.code) return;
    navigator.clipboard.writeText(myGuild.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // SEND CHAT MESSAGE
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    sendGuildMessage(chatInput, user);
    setChatInput('');
  };

  // IS USER THE LEADER OF MY GUILD?
  const isLeader = myGuild?.leaderId === 'me' || myGuild?.leaderName?.includes('(You)');

  return (
    <div className="space-y-6">

      {/* ================= CASE 1: USER IS IN A GUILD ================= */}
      {myGuild ? (
        <div className="space-y-6 animate-fade-in-up">
          
          {/* Guild Header Banner */}
          <div className={`p-6 sm:p-7 rounded-3xl border relative overflow-hidden bg-gradient-to-r ${myGuild.badgeBg || 'from-purple-600 to-indigo-800'} text-white shadow-xl shadow-black/10`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              
              {/* Guild Icon & Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl shrink-0">
                  {myGuild.badge || '🛡️'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/30 text-amber-300 border border-amber-300/30">
                      PRIVATE GUILD • LVL {myGuild.level || 1}
                    </span>
                    <span className="text-[11px] font-mono text-white/80">
                      {myGuild.tag || '#GUILD'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-black tracking-tight mt-0.5">
                    {myGuild.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 max-w-lg mt-1 italic">
                    "{myGuild.motto || 'Focus, learn, conquer.'}"
                  </p>
                </div>
              </div>

              {/* Trophies & War Stars Badges */}
              <div className="flex items-center gap-3 font-mono shrink-0">
                <div className="p-3 sm:p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/15 text-center min-w-[100px]">
                  <div className="text-[10px] uppercase font-bold text-white/70">War Stars</div>
                  <div className="text-base sm:text-lg font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                    <Star size={15} className="fill-amber-300" />
                    <span>{myGuild.warStars || 0}</span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/15 text-center min-w-[100px]">
                  <div className="text-[10px] uppercase font-bold text-white/70">Guild Trophies</div>
                  <div className="text-base sm:text-lg font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                    <Trophy size={15} />
                    <span>{(myGuild.trophies || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secret Passcode Drawer (Only Members & Leaders See This) */}
            <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10 text-xs">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-amber-300" />
                <span className="text-white/80">Secret Guild Passcode:</span>
                <span className="px-3 py-1 rounded-xl bg-black/40 font-mono font-black text-amber-300 text-sm tracking-wider border border-amber-300/30">
                  {myGuild.code}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  title="Copy secret code"
                >
                  {copiedCode ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Leader Controls */}
              <div className="flex items-center gap-2">
                {isLeader && (
                  <button
                    type="button"
                    onClick={() => regenerateGuildCode(myGuild.id)}
                    className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-mono text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Regenerate secret passcode if leaked"
                  >
                    <RefreshCw size={12} />
                    <span>Regenerate Code</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={leaveGuild}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-mono text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut size={12} />
                  <span>Leave Guild</span>
                </button>
              </div>
            </div>
          </div>

          {/* Guild Hall Grid: Chat + Members Roster */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: In-Guild Live Chat */}
            <div className="lg:col-span-2 bg-[rgb(var(--color-card))] rounded-3xl border border-[rgb(var(--color-border))] p-5 flex flex-col h-[460px] shadow-sm">
              <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#9e3c26]" />
                  <h3 className="font-bold text-sm text-[rgb(var(--color-text))]">
                    Guild War Tactics & Chat
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[rgb(var(--color-muted))]">
                  {myGuild.members?.length || 1} Scholars Online
                </span>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {(myGuild.messages || []).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-2xl ${
                      msg.isSystem
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 font-mono text-[11px]'
                        : msg.isYou
                        ? 'bg-[#9e3c26]/10 border border-[#9e3c26]/20 text-[rgb(var(--color-text))] ml-6'
                        : 'bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] mr-6'
                    }`}
                  >
                    {!msg.isSystem && (
                      <div className="flex items-center justify-between font-mono text-[10px] text-[rgb(var(--color-muted))] mb-1">
                        <span className="font-bold text-[rgb(var(--color-text))] flex items-center gap-1.5">
                          {msg.sender}
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))]">
                            {msg.role || 'Scholar'}
                          </span>
                        </span>
                        <span>{msg.time}</span>
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-[rgb(var(--color-border))] flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Share revision tips or coordinate Gauntlets..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:border-[#9e3c26]"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#9e3c26] text-white disabled:opacity-40 text-xs font-bold hover:brightness-110 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Send size={13} />
                </button>
              </form>
            </div>

            {/* Right Col: Member Roster */}
            <div className="bg-[rgb(var(--color-card))] rounded-3xl border border-[rgb(var(--color-border))] p-5 flex flex-col h-[460px] shadow-sm">
              <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-amber-500" />
                  <h3 className="font-bold text-sm text-[rgb(var(--color-text))]">
                    Guild Roster
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-[rgb(var(--color-muted))]">
                  {myGuild.members?.length || 1}/20
                </span>
              </div>

              {/* Members List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {(myGuild.members || []).map((member) => (
                  <div
                    key={member.id}
                    className="p-2.5 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UserAvatar
                        src={member.avatar}
                        name={member.name}
                        className="w-8 h-8 rounded-full border border-[rgb(var(--color-border))]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-[rgb(var(--color-text))] truncate">
                            {member.name}
                          </p>
                          {member.isYou && (
                            <span className="text-[9px] font-mono px-1 rounded bg-amber-500/20 text-amber-400 font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                          {member.role || 'Member'} • Lvl {member.level || 1}
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono shrink-0">
                      <div className="text-xs font-bold text-amber-400 flex items-center justify-end gap-1">
                        <Trophy size={11} />
                        <span>{member.trophies || 1540}</span>
                      </div>
                      <div className="text-[10px] text-amber-300 font-bold flex items-center justify-end gap-1">
                        <Star size={10} className="fill-amber-300" />
                        <span>{member.warStars || 0} ⭐</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Start Synchronized Focus Chamber Button */}
              {onEnterChamber && (
                <div className="pt-3 border-t border-[rgb(var(--color-border))] mt-3">
                  <button
                    type="button"
                    onClick={() => onEnterChamber(myGuild)}
                    className="w-full py-2.5 rounded-xl bg-[#9e3c26] text-white text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Enter Guild Focus Chamber</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* ================= CASE 2: USER IS NOT IN A GUILD ================= */
        <div className="space-y-6 animate-fade-in-up">
          
          {/* Action Hero: Enter Passcode or Found Guild */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Card 1: Enter Secret Passcode */}
            <div className="p-6 rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl shadow-sm">
                <Key size={22} />
              </div>

              <div>
                <h3 className="font-bold text-base text-[rgb(var(--color-text))]">
                  Enter Secret Guild Passcode
                </h3>
                <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
                  Private Guilds are invite-only. Enter the secret code given to you by your Guild Leader.
                </p>
              </div>

              <form onSubmit={handleJoinGuild} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                    placeholder="e.g. QUANTUM-7"
                    className="w-full px-4 py-3 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-sm font-mono tracking-wider uppercase text-[rgb(var(--color-text))] focus:outline-none focus:border-[#9e3c26]"
                  />
                  <Lock size={15} className="absolute right-4 top-3.5 text-[rgb(var(--color-muted))]" />
                </div>

                {unlockError && (
                  <p className="text-xs text-rose-500 font-medium">
                    {unlockError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#9e3c26] text-white font-bold text-xs hover:brightness-110 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Unlock & Join Guild</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>

            {/* Card 2: Found a New Guild */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#9e3c26]/10 via-[rgb(var(--color-card))] to-purple-900/10 border border-[#9e3c26]/30 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center text-2xl shadow-sm">
                  🛡️
                </div>

                <div>
                  <h3 className="font-bold text-base text-[rgb(var(--color-text))]">
                    Found Your Own Guild
                  </h3>
                  <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
                    Become a Guild Leader. Create your secret passcode, recruit your top study squad, and lead them in global Guild Wars!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFoundModal(true)}
                className="w-full py-3 rounded-2xl bg-[rgb(var(--color-container))] hover:bg-[rgb(var(--color-container-high))] text-[rgb(var(--color-text))] font-bold text-xs border border-[rgb(var(--color-border))] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Plus size={15} />
                <span>Found a Guild (Free)</span>
              </button>
            </div>

          </div>

          {/* Known Guild Enclaves (Shows that they are private locked) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-muted))]">
              Active Private Enclaves (Invite-Only)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {guilds.map((g) => (
                <div
                  key={g.id}
                  className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${g.badgeBg || 'from-purple-600 to-indigo-800'} text-white flex items-center justify-center text-xl shadow-sm shrink-0`}>
                      {g.badge || '🛡️'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[rgb(var(--color-text))] truncate">
                        {g.name}
                      </h4>
                      <p className="text-[11px] text-[rgb(var(--color-muted))] truncate">
                        {g.motto}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[rgb(var(--color-muted))] mt-1">
                        <span>{g.members?.length || g.memberCount || 1}/20 Scholars</span>
                        <span>•</span>
                        <span className="text-amber-400 font-bold">{g.warStars || 0} Stars</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5 shrink-0">
                    <Lock size={12} />
                    <span>Locked</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= MODAL: FOUND NEW GUILD ================= */}
      {showFoundModal && (
        <Modal isOpen={showFoundModal} onClose={() => setShowFoundModal(false)} maxWidth="max-w-md">
          <form onSubmit={handleFoundGuildSubmit} className="space-y-5">
            <div className="flex items-center gap-3 border-b border-[rgb(var(--color-border))] pb-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center text-xl shrink-0">
                🛡️
              </div>
              <div>
                <h3 className="font-bold text-base text-[rgb(var(--color-text))]">
                  Found a Private Guild
                </h3>
                <p className="text-xs text-[rgb(var(--color-muted))]">
                  You will become the Guild Leader with the master passcode.
                </p>
              </div>
            </div>

            {/* Shield Icon Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[rgb(var(--color-muted))]">
                Choose Guild Shield Emblem
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {BADGE_OPTIONS.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => setNewGuildBadge(badge)}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xl transition-all cursor-pointer ${
                      newGuildBadge === badge
                        ? 'border-[#9e3c26] bg-[#9e3c26]/15 scale-110 shadow-sm'
                        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))]'
                    }`}
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[rgb(var(--color-muted))]">
                Banner Color
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BG_OPTIONS.map((bg) => (
                  <button
                    key={bg.class}
                    type="button"
                    onClick={() => setNewGuildBg(bg.class)}
                    className={`p-2 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer bg-gradient-to-r ${bg.class} text-white ${
                      newGuildBg === bg.class ? 'ring-2 ring-[#9e3c26] shadow-sm' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Motto */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[rgb(var(--color-muted))]">
                  Guild Name
                </label>
                <input
                  type="text"
                  required
                  value={newGuildName}
                  onChange={(e) => setNewGuildName(e.target.value)}
                  placeholder="e.g. Oxford Neuro Syndicate"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:border-[#9e3c26]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[rgb(var(--color-muted))]">
                  War Motto / Objective
                </label>
                <input
                  type="text"
                  value={newGuildMotto}
                  onChange={(e) => setNewGuildMotto(e.target.value)}
                  placeholder="e.g. Relentless active recall and exam mastery."
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:border-[#9e3c26]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFoundModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[rgb(var(--color-muted))] hover:bg-[rgb(var(--color-container-low))]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#9e3c26] text-white hover:brightness-110 shadow-md transition-all cursor-pointer"
              >
                Found Guild
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}

