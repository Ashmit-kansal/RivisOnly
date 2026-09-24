import React, { useState } from 'react';
import RoomCard from '../features/rooms/RoomCard';
import RoomCommitmentView from '../features/rooms/RoomCommitmentView';
import ActiveStudyRoom from '../features/rooms/ActiveStudyRoom';
import DuelModal from '../features/rooms/DuelModal';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { mockRooms } from '../data/mockRooms';
import { Users, Plus, Search, Swords, Lock } from 'lucide-react';

export default function StudyRooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState(mockRooms);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Page View States: 'lobby' | 'commit' | 'active'
  const [viewState, setViewState] = useState('lobby');
  const [selectedRoomForCommit, setSelectedRoomForCommit] = useState(null);
  const [activeRoomData, setActiveRoomData] = useState(null); // { room, committedMinutes }

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGlobalDuelModal, setShowGlobalDuelModal] = useState(false);

  // New room form state
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomSubject, setNewRoomSubject] = useState('Organic Chemistry II');
  const [newRoomType, setNewRoomType] = useState('public');
  const [newRoomPasscode, setNewRoomPasscode] = useState('');
  const [newRoomCycle, setNewRoomCycle] = useState('25m Cycle');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.subject.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Public') return !room.isPrivate;
    if (activeFilter === 'Private') return room.isPrivate;
    return room.subject === activeFilter;
  });

  // Handler when user clicks "Join" on a room card
  const handleInitiateJoin = (room) => {
    setSelectedRoomForCommit(room);
    setViewState('commit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler when user confirms their time commitment
  const handleCommitAndEnter = (committedMinutes) => {
    setActiveRoomData({
      room: selectedRoomForCommit,
      committedMinutes
    });
    setViewState('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler when user leaves/exits active room
  const handleExitActiveRoom = () => {
    setActiveRoomData(null);
    setSelectedRoomForCommit(null);
    setViewState('lobby');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const newRoom = {
      id: `room-${Date.now()}`,
      name: newRoomName || 'Silent Focus Chamber',
      subject: newRoomSubject,
      isPrivate: newRoomType === 'private',
      code: newRoomType === 'private' ? (newRoomPasscode.toUpperCase() || 'REV-2025') : undefined,
      maxMembers: newRoomType === 'private' ? 50 : 10,
      cycleTime: newRoomCycle,
      tag: newRoomType === 'private' ? 'Private Enclave' : 'Public Hall',
      description: `Synchronized ${newRoomCycle} study hall for ${newRoomSubject}.`,
      members: [
        {
          id: 'me',
          name: user ? `${user.name} (You)` : 'Guest Scholar (You)',
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          level: user?.level ?? 1,
          school: user?.title || 'Scholar',
          studyTime: 45,
          status: 'Studying',
          isFriend: true
        }
      ],
      messages: [
        { id: 'm1', sender: 'System', text: `Room created by You. Protocol: ${newRoomCycle}`, time: 'Just now', isSystem: true }
      ]
    };

    setRooms(prev => [newRoom, ...prev]);
    setShowCreateModal(false);
    setNewRoomName('');
    setNewRoomPasscode('');

    // Launch directly into commitment view for newly created room
    setSelectedRoomForCommit(newRoom);
    setViewState('commit');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in-up">
      
      {/* 1. TIME COMMITMENT VIEW (FULL-SCREEN UNDER STUDY ROOMS PAGE) */}
      {viewState === 'commit' && selectedRoomForCommit && (
        <RoomCommitmentView
          room={selectedRoomForCommit}
          onCommit={handleCommitAndEnter}
          onCancel={() => {
            setSelectedRoomForCommit(null);
            setViewState('lobby');
          }}
        />
      )}

      {/* 2. ACTIVE STUDY ROOM VIEW (FULL-SCREEN UNDER STUDY ROOMS PAGE) */}
      {viewState === 'active' && activeRoomData && (
        <ActiveStudyRoom
          room={activeRoomData.room}
          committedMinutes={activeRoomData.committedMinutes}
          onExitRoom={handleExitActiveRoom}
        />
      )}

      {/* 3. STUDY ROOMS LOBBY VIEW (DEFAULT) */}
      {viewState === 'lobby' && (
        <>
          {/* Top Banner */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-[rgb(var(--color-muted))] flex items-center gap-1.5 mb-1 font-semibold">
                <span>SYNCHRONOUS SPACES</span>
                <span>//</span>
                <span className="text-[rgb(var(--color-secondary))] font-bold">1,420 ONLINE SCHOLARS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--color-text))]">
                Virtual Study Rooms & 1v1 Arena
              </h1>
              <p className="text-xs text-[rgb(var(--color-muted))] mt-1 max-w-2xl leading-relaxed">
                Commit time to lock into synchronized study halls, chat with co-workers in real time, and challenge peers to live 1v1 topic duels.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowGlobalDuelModal(true)}
                className="group px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 dark:from-indigo-600 dark:via-purple-600 dark:to-indigo-700 dark:hover:from-indigo-500 dark:hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/25 dark:shadow-indigo-950/50 border border-indigo-500/30 dark:border-indigo-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Swords size={15} className="text-amber-300 dark:text-amber-300 group-hover:rotate-12 transition-transform duration-200" />
                <span className="tracking-wide">Open 1v1 Arena</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] dark:hover:bg-[#ffb4a3] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-[#9e3c26]/20 transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>Create Study Hall</span>
              </button>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] dark:shadow-none">
            
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rooms or subjects..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-mono">
              {['All', 'Public', 'Private', 'Organic Chemistry II', 'Linear Algebra', 'Cognitive Neuroscience', 'Macroeconomics'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
                    activeFilter === filter
                      ? 'bg-[#9e3c26] dark:bg-[#e26f54] text-white font-semibold shadow-xs'
                      : 'bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onJoin={handleInitiateJoin}
              />
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="p-12 text-center rounded-2xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] space-y-3">
              <Users size={32} className="mx-auto text-[rgb(var(--color-muted))]" />
              <h3 className="font-bold text-base text-[rgb(var(--color-text))]">No matching study halls found</h3>
              <p className="text-xs text-[rgb(var(--color-muted))]">
                Adjust your subject filter or create a new public or private room.
              </p>
            </div>
          )}
        </>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="max-w-md">
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] mx-auto flex items-center justify-center mb-2">
              <Users size={22} />
            </div>
            <h3 className="text-xl font-bold text-[rgb(var(--color-text))]">Create Study Room</h3>
            <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
              Synchronized study space with focus timer, peer duels, and group chat
            </p>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                Room Name
              </label>
              <input
                type="text"
                required
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="e.g. Organic Chem Evening Sprint"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                Discipline Subject
              </label>
              <select
                value={newRoomSubject}
                onChange={(e) => setNewRoomSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
              >
                <option value="Organic Chemistry II">Organic Chemistry II</option>
                <option value="Linear Algebra">Linear Algebra</option>
                <option value="Cognitive Neuroscience">Cognitive Neuroscience</option>
                <option value="Macroeconomics">Macroeconomics</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                  Room Privacy
                </label>
                <select
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
                >
                  <option value="public">Public (10 Scholars Max)</option>
                  <option value="private">Private (50 Scholars Max)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                  Focus Cadence
                </label>
                <select
                  value={newRoomCycle}
                  onChange={(e) => setNewRoomCycle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
                >
                  <option value="25m Cycle">25m Standard</option>
                  <option value="50m Deep">50m Deep</option>
                  <option value="Silent">Pure Silent</option>
                </select>
              </div>
            </div>

            {newRoomType === 'private' && (
              <div>
                <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                  Passcode Required
                </label>
                <input
                  type="text"
                  required
                  value={newRoomPasscode}
                  onChange={(e) => setNewRoomPasscode(e.target.value)}
                  placeholder="e.g. REV-7721"
                  className="w-full px-3.5 py-2.5 font-mono text-center tracking-widest uppercase rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] dark:hover:bg-[#ffb4a3] text-white font-semibold text-xs transition-colors cursor-pointer shadow-md shadow-[#9e3c26]/20"
            >
              Launch Room & Commit Focus
            </button>
          </form>
        </Modal>
      )}

      {/* 1v1 Global Arena Modal with Live Matchmaking */}
      {showGlobalDuelModal && (
        <DuelModal
          isOpen={showGlobalDuelModal}
          onClose={() => setShowGlobalDuelModal(false)}
          isMatchmaking={true}
        />
      )}

    </div>
  );
}
