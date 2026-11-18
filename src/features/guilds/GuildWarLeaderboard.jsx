import React from 'react';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import { Trophy, Star, Shield, Users, Swords, Clock, Award, Lock } from 'lucide-react';

export default function GuildWarLeaderboard() {
  const { guilds, myGuild } = useStudyRooms();

  // Sort guilds by War Stars desc, then Trophies desc
  const sortedGuilds = [...guilds].sort((a, b) => {
    if ((b.warStars || 0) !== (a.warStars || 0)) {
      return (b.warStars || 0) - (a.warStars || 0);
    }
    return (b.trophies || 0) - (a.trophies || 0);
  });

  return (
    <div className="space-y-6">
      
      {/* Guild War Season Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#9e3c26]/15 via-amber-500/10 to-[#9e3c26]/10 border border-[#9e3c26]/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#9e3c26] text-white shadow-xs mb-2">
              <Swords size={12} />
              <span>GUILD WAR LEAGUE • SEASON 4</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[rgb(var(--color-text))]">
              Global Guild War Rankings
            </h2>
            <p className="text-xs text-[rgb(var(--color-muted))] max-w-lg mt-0.5">
              Conquer 15, 20, and 40 MCQ Gauntlets to harvest War Stars (⭐) for your Guild. Top 3 Guilds earn seasonal promotion and Champion titles!
            </p>
          </div>

          {/* War Timer */}
          <div className="p-3.5 rounded-2xl bg-[rgb(var(--color-card))]/80 backdrop-blur-md border border-[rgb(var(--color-border))] text-center shrink-0">
            <div className="text-[10px] font-mono uppercase text-[rgb(var(--color-muted))] font-bold flex items-center justify-center gap-1">
              <Clock size={11} /> Battle Day 4
            </div>
            <div className="text-sm font-black font-mono text-amber-400 mt-0.5">
              2d 14h Left
            </div>
          </div>
        </div>
      </div>

      {/* Guilds Leaderboard Table */}
      <div className="bg-[rgb(var(--color-card))] rounded-3xl border border-[rgb(var(--color-border))] overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[rgb(var(--color-border))] flex items-center justify-between text-xs text-[rgb(var(--color-muted))] font-mono">
          <span>GUILD ROSTER & WAR STARS</span>
          <span>TROPHIES & SCORE</span>
        </div>

        <div className="divide-y divide-[rgb(var(--color-border))]">
          {sortedGuilds.map((guild, idx) => {
            const rank = idx + 1;
            const isMyGuild = myGuild && myGuild.id === guild.id;

            return (
              <div
                key={guild.id}
                className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                  isMyGuild
                    ? 'bg-amber-500/10 border-l-4 border-l-amber-500'
                    : 'hover:bg-[rgb(var(--color-container-low))]'
                }`}
              >
                {/* Left: Rank & Guild Badge + Info */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Rank Badge */}
                  <div className="w-8 flex items-center justify-center shrink-0">
                    {rank === 1 && <span className="text-2xl">🥇</span>}
                    {rank === 2 && <span className="text-2xl">🥈</span>}
                    {rank === 3 && <span className="text-2xl">🥉</span>}
                    {rank > 3 && (
                      <span className="font-mono font-bold text-sm text-[rgb(var(--color-muted))]">
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Guild Shield Icon */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${(!guild.badgeBg || guild.badgeBg.includes('purple') || guild.badgeBg.includes('indigo-800')) ? 'from-[#9e3c26] to-[#7f2e1b]' : guild.badgeBg} text-white flex items-center justify-center text-2xl shadow-md shrink-0`}>
                    {guild.badge || '🛡️'}
                  </div>

                  {/* Guild Name & Motto */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-[rgb(var(--color-text))] truncate">
                        {guild.name}
                      </h4>
                      {isMyGuild && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-amber-500 text-black">
                          YOUR GUILD
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))]">
                        Lvl {guild.level || 1}
                      </span>
                    </div>

                    <p className="text-[11px] text-[rgb(var(--color-muted))] truncate max-w-xs sm:max-w-md mt-0.5">
                      {guild.motto || 'Unrivaled focus syndicate.'}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-[rgb(var(--color-muted))] mt-1">
                      <span className="flex items-center gap-1">
                        <Users size={11} /> {guild.members?.length || guild.memberCount || 1}/20 Scholars
                      </span>
                      <span>•</span>
                      <span>Leader: {guild.leaderName || 'Guild Master'}</span>
                    </div>
                  </div>
                </div>

                {/* Right: War Stars & Trophies */}
                <div className="text-right shrink-0 font-mono space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/25">
                    <Star size={13} className="fill-amber-300" />
                    <span>{guild.warStars || 0} Stars</span>
                  </div>

                  <div className="text-xs text-[rgb(var(--color-muted))] font-bold flex items-center justify-end gap-1">
                    <Trophy size={12} className="text-amber-500" />
                    <span>{(guild.trophies || 0).toLocaleString()} 🏆</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

