import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudyRooms } from '../context/StudyRoomsContext';

import ArenaHeroBanner from '../features/arena/ArenaHeroBanner';
import LeagueLeaderboard from '../features/arena/LeagueLeaderboard';
import CommunityBossBar from '../features/arena/CommunityBossBar';
import PrivateGuildsSection from '../features/guilds/PrivateGuildsSection';
import GuildWarLeaderboard from '../features/guilds/GuildWarLeaderboard';
import LeagueRoadView from '../features/leagues/LeagueRoadView';
import RoomCommitmentView from '../features/rooms/RoomCommitmentView';
import ActiveStudyRoom from '../features/rooms/ActiveStudyRoom';
import DuelModal from '../features/rooms/DuelModal';

import { Shield, Swords, Trophy, Heart, Zap, Lock, Star } from 'lucide-react';

export default function StudyRooms() {
  const { user } = useAuth();
  const {
    activeRoomSession,
    joinSquadRoom,
    leaveSquadRoom,
    myGuild
  } = useStudyRooms();

  // Navigation tab: 'guilds' | 'wars' | 'leagues' | 'boss'
  const [activeTab, setActiveTab] = useState('guilds');

  // Commitment & Session View State
  const [selectedSquadForCommit, setSelectedSquadForCommit] = useState(null);

  // 1v1 Duel Modal
  const [showGlobalDuelModal, setShowGlobalDuelModal] = useState(false);

  // Handler when user clicks "Enter Chamber" on a squad/guild
  const handleInitiateJoin = (squad) => {
    setSelectedSquadForCommit(squad);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler when user confirms time commitment
  const handleCommitAndEnter = (committedMinutes) => {
    if (!selectedSquadForCommit) return;
    joinSquadRoom(selectedSquadForCommit, committedMinutes, user);
    setSelectedSquadForCommit(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler when leaving active squad session
  const handleExitActiveRoom = () => {
    leaveSquadRoom();
    setSelectedSquadForCommit(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-7 animate-fade-in-up">
      
      {/* 1. ACTIVE PRIVATE GUILD SESSION (PERSISTENT ACROSS PAGE NAVIGATIONS) */}
      {activeRoomSession ? (
        <ActiveStudyRoom
          room={activeRoomSession.room}
          committedMinutes={activeRoomSession.committedMinutes}
          onExitRoom={handleExitActiveRoom}
        />
      ) : selectedSquadForCommit ? (
        /* 2. TIME COMMITMENT VIEW */
        <RoomCommitmentView
          room={selectedSquadForCommit}
          onCommit={handleCommitAndEnter}
          onCancel={() => setSelectedSquadForCommit(null)}
        />
      ) : (
        /* 3. GUILDS & RANKED ARENA MAIN FLOOR */
        <>
          {/* Top Hero Banner */}
          <ArenaHeroBanner
            onOpenDuel={() => setShowGlobalDuelModal(true)}
            onOpenGuilds={() => setActiveTab('guilds')}
          />

          {/* Navigation Tabs Bar */}
          <div className="flex items-center justify-between gap-3 border-b border-[rgb(var(--color-border))] pb-2 overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))]">
              
              {/* Tab 1: Private Guilds */}
              <button
                type="button"
                onClick={() => setActiveTab('guilds')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'guilds'
                    ? 'bg-[#9e3c26] text-white shadow-sm'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                <Shield size={13} />
                <span>Private Guilds</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/20 font-bold hidden sm:inline">
                  {myGuild ? 'Guild Hall' : 'Invite-Only'}
                </span>
              </button>

              {/* Tab 2: Guild Wars */}
              <button
                type="button"
                onClick={() => setActiveTab('wars')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'wars'
                    ? 'bg-[#9e3c26] text-white shadow-sm'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                <Swords size={13} />
                <span>Guild Wars</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/20 font-bold hidden sm:inline">
                  ⭐ Season 4
                </span>
              </button>

              {/* Tab 3: Trophy Road (CoC Leagues) */}
              <button
                type="button"
                onClick={() => setActiveTab('leagues')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'leagues'
                    ? 'bg-[#9e3c26] text-white shadow-sm'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                <Trophy size={13} />
                <span>Trophy Road</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/20 font-bold hidden sm:inline">
                  Leagues
                </span>
              </button>

              {/* Tab 4: Titan Raid */}
              <button
                type="button"
                onClick={() => setActiveTab('boss')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'boss'
                    ? 'bg-[#9e3c26] text-white shadow-sm'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                <Heart size={13} />
                <span>Titan Raid</span>
              </button>
            </div>

            {/* Quick Action Pill on Desktop */}
            <div className="hidden md:flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setShowGlobalDuelModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9e3c26] to-[#b84a32] hover:brightness-105 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Swords size={13} className="text-amber-300" />
                <span>⚔️ 1v1 Scholar Duel Arena</span>
              </button>
            </div>
          </div>

          {/* Active Tab View */}
          <div className="pt-1">
            {activeTab === 'guilds' && (
              <PrivateGuildsSection onEnterChamber={handleInitiateJoin} />
            )}

            {activeTab === 'wars' && (
              <GuildWarLeaderboard />
            )}

            {activeTab === 'leagues' && (
              <LeagueRoadView />
            )}

            {activeTab === 'boss' && (
              <div className="space-y-6">
                <CommunityBossBar />
                <LeagueLeaderboard />
              </div>
            )}
          </div>
        </>
      )}

      {/* 1v1 Global Arena Modal */}
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
