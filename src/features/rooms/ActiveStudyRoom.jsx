import React, { useState, useEffect, useRef } from 'react';
import DuelModal from './DuelModal';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, Swords, LogOut, Clock, Send, Sparkles, 
  Flame, CheckCircle2, AlertTriangle, ShieldAlert, 
  MessageSquare, ChevronRight, Lock
} from 'lucide-react';

export default function ActiveStudyRoom({ room, committedMinutes, onExitRoom }) {
  const { user } = useAuth();
  const youName = user ? `${user.name} (You)` : 'Guest Scholar (You)';

  // Timer State (Drift-free timestamp calculation)
  const totalSeconds = (committedMinutes || 25) * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExitWarningModal, setShowExitWarningModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Peers & Duel State
  const [peers, setPeers] = useState(() => {
    const existing = room.members || [];
    const you = {
      id: 'me',
      name: youName,
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      level: user?.level ?? 1,
      school: user?.title || 'Scholar',
      studyTime: 45,
      status: 'Focusing',
      isYou: true
    };
    return [you, ...existing.filter(m => m.id !== 'me')];
  });

  const [selectedDuelPeer, setSelectedDuelPeer] = useState(null);
  const [showDuelModal, setShowDuelModal] = useState(false);

  // Group Chat State
  const [messages, setMessages] = useState(() => {
    const initial = room.messages || [];
    return [
      ...initial,
      {
        id: `sys-enter-${Date.now()}`,
        sender: 'System',
        text: `You entered the room and locked in for a ${committedMinutes}m focus sprint.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      }
    ];
  });
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef(null);

  // DRIFT-FREE TIMESTAMP COUNTDOWN LOOP
  const targetEndTimeRef = useRef(Date.now() + totalSeconds * 1000);

  useEffect(() => {
    let animationFrame = null;

    const checkTimer = () => {
      const remainingMs = targetEndTimeRef.current - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      setTimeLeft(remainingSec);

      if (remainingSec <= 0) {
        setIsCompleted(true);
        setShowCompletionModal(true);
      } else {
        animationFrame = requestAnimationFrame(checkTimer);
      }
    };

    animationFrame = requestAnimationFrame(checkTimer);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle Send Chat Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: youName,
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: false,
      isYou: true
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  // Quick reaction emojis
  const handleSendReaction = (emoji) => {
    const reactionMsg = {
      id: `reaction-${Date.now()}`,
      sender: youName,
      text: `${emoji} sent a focus reaction!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: false,
      isYou: true
    };
    setMessages(prev => [...prev, reactionMsg]);
  };

  // Handle Challenge to Duel
  const handleChallengePeer = (peer) => {
    setSelectedDuelPeer(peer);
    setShowDuelModal(true);

    // Announce in chat
    setMessages(prev => [
      ...prev,
      {
        id: `duel-announce-${Date.now()}`,
        sender: 'System',
        text: `⚔️ You challenged ${peer.name} to a 1v1 Recall Duel!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      }
    ]);
  };

  // Exit Room Handler
  const handleExitClick = () => {
    if (timeLeft > 0 && !isCompleted) {
      setShowExitWarningModal(true);
    } else {
      onExitRoom();
    }
  };

  const handleConfirmExitAnyway = () => {
    setShowExitWarningModal(false);
    onExitRoom();
  };

  // Time calculations
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const elapsedPercent = Math.min(100, Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100));

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* 1. ROOM ACTIVE HERO HEADER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Room Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[rgb(var(--color-primary))]">
              ACTIVE STUDY HALL // {room.subject}
            </span>
            <span className="text-xs text-[rgb(var(--color-muted))]">•</span>
            <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">{peers.length} Co-Workers</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[rgb(var(--color-text))] tracking-tight">
            {room.name}
          </h1>

          <p className="text-xs text-[rgb(var(--color-muted))] max-w-xl line-clamp-1">
            {room.description}
          </p>
        </div>

        {/* Center: Live Locked Sprint Timer */}
        <div className="flex items-center gap-4 bg-[rgb(var(--color-container-low))] p-2.5 sm:p-3 rounded-2xl border border-[rgb(var(--color-border))]">
          <div className="text-center sm:text-right">
            <div className="text-[9px] font-mono uppercase tracking-widest text-[rgb(var(--color-primary))] font-bold flex items-center gap-1 justify-center sm:justify-end">
              <Lock size={10} />
              <span>COMMITTED SPRINT</span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-[rgb(var(--color-text))] tracking-tight">
              {formattedTime}
            </div>
          </div>

          {/* Mini progress bar & exit action */}
          <div className="flex flex-col gap-1 w-24">
            <div className="flex justify-between text-[9px] font-mono text-[rgb(var(--color-muted))]">
              <span>Progress</span>
              <span>{elapsedPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[rgb(var(--color-container-high))] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[rgb(var(--color-primary))] transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${elapsedPercent}%` }}
              />
            </div>
          </div>

          {/* EXIT ROOM BUTTON */}
          <button
            onClick={handleExitClick}
            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ml-2"
            title="Leave study room (Warning: early exit will lose progress)"
          >
            <LogOut size={13} />
            <span>Exit Room</span>
          </button>
        </div>

      </div>

      {/* 2. MAIN ROOM VIEW: LEFT PEERS HALL (7 COLS) & RIGHT GROUP CHAT (5 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE CO-WORKERS & 1V1 CHALLENGE ARENA */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[rgb(var(--color-primary))]" />
              <h2 className="text-sm font-bold text-[rgb(var(--color-text))] font-mono uppercase tracking-wide">
                Co-Workers in this Hall ({peers.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Camera-Free Silent Accountability
            </span>
          </div>

          {/* Peers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {peers.map((peer) => (
              <div
                key={peer.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  peer.isYou
                    ? 'bg-[rgb(var(--color-primary))]/5 border-[rgb(var(--color-primary))]/40 shadow-xs'
                    : 'bg-[rgb(var(--color-card))] border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-[rgb(var(--color-border))]"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[rgb(var(--color-card))] bg-emerald-500" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[rgb(var(--color-text))] truncate">
                        {peer.name}
                      </span>
                      {peer.isYou && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[rgb(var(--color-primary))] text-white text-[9px] font-mono font-bold">
                          YOU
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[rgb(var(--color-muted))] font-mono truncate">
                      {peer.school} • Lv. {peer.level}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-[rgb(var(--color-container-low))] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {peer.isYou ? `Committed ${committedMinutes}m` : (peer.status || 'Focusing')}
                      </span>
                      <span className="text-[rgb(var(--color-muted))] flex items-center gap-0.5">
                        <Clock size={10} /> {peer.studyTime}m today
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Action: Challenge Peer to 1v1 Duel */}
                {!peer.isYou ? (
                  <button
                    onClick={() => handleChallengePeer(peer)}
                    className="w-full py-2 px-3 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-primary))] text-[rgb(var(--color-text))] hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs border border-[rgb(var(--color-border))] hover:border-transparent group"
                  >
                    <Swords size={13} className="text-[rgb(var(--color-primary))] group-hover:text-white group-hover:rotate-45 transition-transform" />
                    <span>Challenge to 1v1 Duel</span>
                  </button>
                ) : (
                  <div className="w-full py-1.5 px-3 rounded-xl bg-[rgb(var(--color-container-low))] text-center text-[10px] font-mono text-[rgb(var(--color-muted))]">
                    Locked in session • Focus mode
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME ROOM GROUP CHAT */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-sm flex flex-col h-[520px]">
            
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[rgb(var(--color-border))]">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[rgb(var(--color-primary))]" />
                <h3 className="text-xs font-bold text-[rgb(var(--color-text))] font-mono uppercase tracking-wide">
                  Room Group Chat
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                Live Study Stream
              </span>
            </div>

            {/* Quick Reactions Bar */}
            <div className="flex items-center justify-between gap-1 py-2 px-1 border-b border-[rgb(var(--color-border))]/60 text-xs">
              <span className="text-[10px] font-mono text-[rgb(var(--color-muted))] uppercase">Cheer:</span>
              <div className="flex items-center gap-1.5">
                {['🔥', '👏', '🧠', '⚡', '☕'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSendReaction(emoji)}
                    className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-container-low))] transition-transform hover:scale-125 cursor-pointer text-sm"
                    title={`Send ${emoji} reaction`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1 text-xs">
              {messages.map((msg) => {
                if (msg.isSystem) {
                  return (
                    <div key={msg.id} className="py-1 px-2.5 rounded-lg bg-[rgb(var(--color-container-low))]/60 text-[11px] font-mono text-[rgb(var(--color-muted))] text-center">
                      {msg.text}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isYou ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] font-mono text-[rgb(var(--color-muted))] mb-0.5">
                      <span className="font-semibold">{msg.sender}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div
                      className={`py-2 px-3 rounded-2xl max-w-[85%] leading-relaxed ${
                        msg.isYou
                          ? 'bg-[rgb(var(--color-primary))] text-white rounded-tr-none'
                          : 'bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-[rgb(var(--color-border))] flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message room co-workers..."
                className="flex-1 px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-primary))]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 rounded-xl bg-[rgb(var(--color-primary))] text-white hover:brightness-105 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
                title="Send message"
              >
                <Send size={15} />
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* 3. EARLY EXIT WARNING MODAL (PROGRESS WILL BE LOST) */}
      {showExitWarningModal && (
        <Modal
          isOpen={showExitWarningModal}
          onClose={() => setShowExitWarningModal(false)}
          maxWidth="max-w-md"
        >
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center animate-bounce [animation-duration:1s]">
              <AlertTriangle size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[rgb(var(--color-text))]">
                Leave Study Room Early?
              </h3>
              <p className="text-xs font-mono text-[rgb(var(--color-muted))]">
                {formattedTime} remaining of your committed {committedMinutes}m sprint
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-300 leading-relaxed text-left space-y-2">
              <div className="font-bold flex items-center gap-1.5 font-mono uppercase text-[11px]">
                <ShieldAlert size={14} />
                <span>Progress Forfeiture Warning</span>
              </div>
              <p>
                If you leave before your committed timer ends, your session progress for this study hall will be <strong>lost</strong>, and you will not receive completion XP or active streak retention.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowExitWarningModal(false)}
                className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-[rgb(var(--color-primary))] text-white font-semibold text-xs hover:brightness-105 transition-all shadow-md cursor-pointer"
              >
                Stay Focused (Keep Studying)
              </button>

              <button
                type="button"
                onClick={handleConfirmExitAnyway}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-transparent hover:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold text-xs border border-red-500/30 transition-colors cursor-pointer"
              >
                Exit Anyway (Forfeit Progress)
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. SPRINT COMPLETED CELEBRATION MODAL */}
      {showCompletionModal && (
        <Modal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          maxWidth="max-w-md"
        >
          <div className="text-center space-y-4 py-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[rgb(var(--color-text))] tracking-tight">
                Focus Commitment Complete!
              </h3>
              <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
                You successfully honored your <strong className="text-[rgb(var(--color-text))]">{committedMinutes}-minute</strong> focus lock in {room.name}!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex items-center justify-around text-xs font-mono">
              <div>
                <div className="text-[10px] text-[rgb(var(--color-muted))] uppercase">TIME LOGGED</div>
                <div className="font-bold text-sm text-[rgb(var(--color-primary))]">{committedMinutes}m</div>
              </div>
              <div className="w-px h-8 bg-[rgb(var(--color-border))]" />
              <div>
                <div className="text-[10px] text-[rgb(var(--color-muted))] uppercase">STREAK BONUS</div>
                <div className="font-bold text-sm text-emerald-500">+100 XP</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onExitRoom}
                className="w-full py-3 rounded-xl bg-[rgb(var(--color-primary))] text-white font-semibold text-xs hover:brightness-105 transition-all shadow-md cursor-pointer"
              >
                Complete Session & Return to Lobby
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5. 1V1 DUEL MODAL */}
      {showDuelModal && (
        <DuelModal
          isOpen={showDuelModal}
          onClose={() => setShowDuelModal(false)}
          opponent={selectedDuelPeer}
        />
      )}

    </div>
  );
}
