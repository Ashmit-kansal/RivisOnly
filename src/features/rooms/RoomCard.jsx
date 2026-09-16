import React, { useState } from 'react';
import { Lock, Unlock, ArrowRight } from 'lucide-react';
import Modal from '../../components/ui/Modal';

export default function RoomCard({ room, onJoin }) {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState(false);

  const memberCount = (room.members || []).length;
  const maxMembers = room.isPrivate ? 50 : 10;
  const isFull = memberCount >= maxMembers;

  const handleJoinClick = () => {
    if (room.isPrivate) {
      setShowCodeModal(true);
    } else {
      onJoin(room);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (enteredCode.trim().toUpperCase() === room.code) {
      setCodeError(false);
      setShowCodeModal(false);
      onJoin(room);
    } else {
      setCodeError(true);
    }
  };

  return (
    <>
      <div className="p-4 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] hover:border-[#9e3c26]/40 dark:hover:border-[#e26f54]/40 transition-all flex flex-col justify-between group shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
        <div>
          {/* Top header row */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9e3c26] dark:text-[#ffb4a3] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9e3c26] dark:bg-[#e26f54]" />
              {room.subject}
            </span>
            
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1 ${
              room.isPrivate
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                : 'bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] border border-[rgb(var(--color-secondary))]/20'
            }`}>
              {room.isPrivate ? <Lock size={10} /> : <Unlock size={10} />}
              <span>{room.isPrivate ? 'Private (50 max)' : 'Public (10 max)'}</span>
            </span>
          </div>

          {/* Room Name & Description */}
          <h3 className="font-bold text-base text-[rgb(var(--color-text))] group-hover:text-[#9e3c26] dark:group-hover:text-[#ffb4a3] transition-colors mb-1">
            {room.name}
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] line-clamp-2 mb-4 leading-relaxed">
            {room.description}
          </p>
        </div>

        <div>
          {/* Active members preview avatars */}
          <div className="flex items-center justify-between pt-3 border-t border-[rgb(var(--color-border))]">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                {(room.members || []).slice(0, 4).map((m, i) => (
                  <img
                    key={m.id || i}
                    src={m.avatar}
                    alt={m.name}
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-[rgb(var(--color-card))] object-cover"
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-[rgb(var(--color-muted))]">
                <strong className={isFull ? 'text-red-500' : 'text-[rgb(var(--color-secondary))] font-medium'}>
                  {memberCount}/{maxMembers}
                </strong> active
              </span>
            </div>

            <button
              onClick={handleJoinClick}
              disabled={isFull}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isFull
                  ? 'bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] cursor-not-allowed'
                  : 'bg-[rgb(var(--color-container-low))] hover:bg-[#9e3c26] hover:text-white dark:hover:bg-[#e26f54] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))]'
              }`}
            >
              <span>{isFull ? 'Hall Full' : 'Join'}</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Private Room Passcode Verification Modal */}
      {showCodeModal && (
        <Modal isOpen={showCodeModal} onClose={() => setShowCodeModal(false)} maxWidth="max-w-sm">
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2">
              <Lock size={22} />
            </div>
            <h3 className="text-lg font-bold">Private Study Hall Access</h3>
            <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
              Enter the passcode to enter {room.name}
            </p>
          </div>

          <form onSubmit={handleVerifyCode} className="space-y-3">
            <div>
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => { setEnteredCode(e.target.value); setCodeError(false); }}
                placeholder={`e.g. ${room.code || 'REV-8921'}`}
                className="w-full text-center tracking-widest font-mono text-base uppercase py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] focus:outline-none focus:ring-2 focus:ring-[#9e3c26]"
              />
              {codeError && (
                <p className="text-red-500 text-xs text-center mt-1.5">
                  Invalid invite code. Try: <strong>{room.code}</strong>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] dark:hover:bg-[#ffb4a3] text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Verify Passcode & Enter Room
            </button>

            <p className="text-[11px] font-mono text-center text-[rgb(var(--color-muted))]">
              Demo Passcode hint: <span className="font-bold text-[#9e3c26] dark:text-[#ffb4a3]">{room.code}</span>
            </p>
          </form>
        </Modal>
      )}
    </>
  );
}
