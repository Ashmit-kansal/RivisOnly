import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import DuelModal from './DuelModal';
import { Users, Swords, UserPlus, MessageSquare, Send, Clock } from 'lucide-react';

export default function RoomModal({ isOpen, onClose, room, userSubject }) {
  if (!room) return null;

  const [members, setMembers] = useState(room.members || []);
  const [messages, setMessages] = useState(room.messages || []);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState('group'); // 'group' | 'direct'
  const [activeDirectPeer, setActiveDirectPeer] = useState(null);
  const [directMessages, setDirectMessages] = useState({
    m1: [
      { id: 'dm1', sender: 'Elena Rostova', text: 'Hey Arjun! How is your stereochemistry prep going?', time: '18:05' },
      { id: 'dm2', sender: 'You', text: 'Going well, just wrapping up interval 3 on SNAr.', time: '18:08' }
    ]
  });

  const [selectedDuelOpponent, setSelectedDuelOpponent] = useState(null);
  const [showDuelModal, setShowDuelModal] = useState(false);

  const handleSendGroupMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: false
    };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  const handleSendDirectMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeDirectPeer) return;
    const newMsg = {
      id: `dm-${Date.now()}`,
      sender: 'You',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setDirectMessages(prev => ({
      ...prev,
      [activeDirectPeer.id]: [...(prev[activeDirectPeer.id] || []), newMsg]
    }));
    setChatInput('');
  };

  const handleToggleFriend = (memberId) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const isNowFriend = !m.isFriend;
        return { ...m, isFriend: isNowFriend, friendRequestSent: !m.isFriend };
      }
      return m;
    }));
  };

  const handleOpenDirectChat = (member) => {
    setActiveDirectPeer(member);
    setActiveTab('direct');
  };

  const handleChallenge = (member) => {
    setSelectedDuelOpponent(member);
    setShowDuelModal(true);
  };

  const currentCount = members.length;
  const maxCap = room.isPrivate ? 50 : 10;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
        {/* Room Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[rgb(var(--color-border))] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[rgb(var(--color-secondary))] animate-ping" />
              <h2 className="text-xl font-bold tracking-tight text-[rgb(var(--color-text))]">
                {room.name}
              </h2>
              {room.isPrivate && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  Private • Max 50
                </span>
              )}
            </div>
            <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
              Subject: <strong className="text-[rgb(var(--color-text))]">{room.subject}</strong> • {room.description}
            </p>
          </div>

          {/* Occupancy and Cycle details */}
          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs font-mono">
              <span className="text-[rgb(var(--color-muted))]">CAPACITY: </span>
              <strong className={currentCount >= maxCap ? 'text-red-500' : 'text-[rgb(var(--color-secondary))]'}>
                {currentCount}/{maxCap} Active
              </strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-muted))]">
              {room.cycleTime}
            </div>
          </div>
        </div>

        {/* Room Main Content: Left Members Grid (videoless hall) & Right Chat Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
          
          {/* Left: Videoless Study Hall (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[rgb(var(--color-muted))]">
                <Users size={14} />
                <span className="uppercase tracking-wider font-semibold">Synchronized Co-Workers ({members.length})</span>
              </div>
              <span className="text-[11px] font-mono text-[rgb(var(--color-secondary))] flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-secondary))]" />
                Audio/Video Muted • Deep Immersion
              </span>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {members.map(member => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex flex-col justify-between hover:border-[#9e3c26]/40 dark:hover:border-[#ffb4a3]/30 transition-all shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-[rgb(var(--color-border))]"
                      />
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[rgb(var(--color-card))] ${
                        member.status === 'Studying' ? 'bg-emerald-500' : member.status === 'In Duel' ? 'bg-[#9e3c26] dark:bg-[#e26f54]' : 'bg-amber-500'
                      }`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate text-[rgb(var(--color-text))]">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-[rgb(var(--color-muted))] truncate font-mono">
                        Lv. {member.level} • {member.school}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono">
                        <Clock size={11} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                        <span className="font-semibold text-[rgb(var(--color-text))]">{member.studyTime}m</span>
                        <span className="text-[10px] text-[rgb(var(--color-muted))]">logged today</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for member */}
                  <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-[rgb(var(--color-border))] text-xs">
                    <button
                      onClick={() => handleChallenge(member)}
                      className="flex-1 py-1.5 rounded-lg bg-[#9e3c26]/10 hover:bg-[#9e3c26]/20 dark:bg-[#e26f54]/15 dark:hover:bg-[#e26f54]/25 text-[#9e3c26] dark:text-[#ffb4a3] font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="Challenge to 1v1 Practice Duel"
                    >
                      <Swords size={12} />
                      <span>Challenge</span>
                    </button>

                    {member.isFriend ? (
                      <button
                        onClick={() => handleOpenDirectChat(member)}
                        className="py-1.5 px-2.5 rounded-lg bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] hover:opacity-90 text-[11px] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                        title="Chat directly"
                      >
                        <MessageSquare size={12} />
                        <span>Chat</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleFriend(member.id)}
                        className="py-1.5 px-2.5 rounded-lg bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                        title="Send Friend Request"
                      >
                        <UserPlus size={12} />
                        <span>Add</span>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Right: Chat Sidebar (5 cols) */}
          <div className="lg:col-span-5 flex flex-col h-[500px] rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] p-3.5">
            
            {/* Chat Tabs: Room Chat vs Direct Chat */}
            <div className="flex items-center justify-between pb-2 border-b border-[rgb(var(--color-border))] mb-2">
              <div className="inline-flex p-0.5 rounded-lg bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))]/60 text-xs">
                <button
                  onClick={() => setActiveTab('group')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'group'
                      ? 'bg-[rgb(var(--color-card))] font-semibold text-[rgb(var(--color-text))] shadow-xs'
                      : 'text-[rgb(var(--color-muted))]'
                  }`}
                >
                  Room Chat
                </button>
                <button
                  onClick={() => {
                    if (!activeDirectPeer) {
                      const firstFriend = members.find(m => m.isFriend);
                      if (firstFriend) setActiveDirectPeer(firstFriend);
                    }
                    setActiveTab('direct');
                  }}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'direct'
                      ? 'bg-[rgb(var(--color-card))] font-semibold text-[rgb(var(--color-text))] shadow-xs'
                      : 'text-[rgb(var(--color-muted))]'
                  }`}
                >
                  Direct {activeDirectPeer ? `(${activeDirectPeer.name.split(' ')[0]})` : ''}
                </button>
              </div>

              <span className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                {activeTab === 'group' ? 'Silent Study Protocol' : 'Encrypted 1v1'}
              </span>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {activeTab === 'group' ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-xl ${
                      msg.isSystem
                        ? 'bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] font-mono text-[11px] text-center'
                        : msg.sender === 'You'
                        ? 'bg-[#9e3c26]/10 dark:bg-[#e26f54]/15 border border-[#9e3c26]/20 ml-6 text-right'
                        : 'bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] mr-6 text-left shadow-xs'
                    }`}
                  >
                    {!msg.isSystem && (
                      <div className="flex items-center justify-between font-mono text-[10px] text-[rgb(var(--color-muted))] mb-1">
                        <span className="font-bold text-[rgb(var(--color-text))]">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                    )}
                    <p className="text-[rgb(var(--color-text))] leading-normal">{msg.text}</p>
                  </div>
                ))
              ) : (
                activeDirectPeer ? (
                  (directMessages[activeDirectPeer.id] || []).length > 0 ? (
                    (directMessages[activeDirectPeer.id] || []).map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2.5 rounded-xl ${
                          msg.sender === 'You'
                            ? 'bg-[#9e3c26]/10 dark:bg-[#e26f54]/15 border border-[#9e3c26]/20 ml-6 text-right'
                            : 'bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] mr-6 text-left shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[10px] text-[rgb(var(--color-muted))] mb-1">
                          <span className="font-bold text-[rgb(var(--color-text))]">{msg.sender}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="text-[rgb(var(--color-text))] leading-normal">{msg.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-[rgb(var(--color-muted))] text-xs">
                      Friend request accepted! Start chatting directly with {activeDirectPeer.name}.
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 text-[rgb(var(--color-muted))] text-xs">
                    Send a friend request to a room member to unlock direct messages.
                  </div>
                )
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={activeTab === 'group' ? handleSendGroupMessage : handleSendDirectMessage}
              className="mt-2 pt-2 border-t border-[rgb(var(--color-border))] flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  activeTab === 'group'
                    ? "Post silent academic message or question..."
                    : `Message ${activeDirectPeer ? activeDirectPeer.name : 'friend'}...`
                }
                className="flex-1 px-3.5 py-2 rounded-xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26] shadow-xs"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] dark:hover:bg-[#ffb4a3] text-white transition-colors cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>

          </div>

        </div>
      </Modal>

      {/* Duel Modal triggered from room member */}
      {showDuelModal && (
        <DuelModal
          isOpen={showDuelModal}
          onClose={() => setShowDuelModal(false)}
          opponent={selectedDuelOpponent}
          onDuelComplete={(res) => {
            setMessages(prev => [
              ...prev,
              {
                id: `msg-duel-${Date.now()}`,
                sender: 'System',
                text: `⚔️ 1v1 Practice Duel concluded between You and ${res.opponent}: You scored ${res.userScore}/${res.total}.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSystem: true
              }
            ]);
          }}
        />
      )}
    </>
  );
}
