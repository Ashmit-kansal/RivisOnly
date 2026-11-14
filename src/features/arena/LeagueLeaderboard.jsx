import React from 'react';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import UserAvatar from '../../components/ui/UserAvatar';
import {
  Trophy, TrendingUp, ShieldAlert, Sparkles,
  Flame, Swords, ArrowUp, ArrowDown, Clock
} from 'lucide-react';

export default function LeagueLeaderboard() {
  const { leaderboard, userElo, leagueXp } = useStudyRooms();

  return (
    <div className="rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] p-5 sm:p-6 space-y-4 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgb(var(--color-border))] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Trophy size={16} />
            </span>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
              Weekly Division League
            </span>
          </div>
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">
            Emerald Scholar Tier (20 Contenders)
          </h2>
          <p className="text-xs text-[rgb(var(--color-muted))]">
            Top 3 promote to Diamond League. Bottom 5 relegate to Ruby League.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono px-3 py-1.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]">
          <Clock size={13} className="text-amber-500" />
          <span>Resets Sunday 23:59 UTC</span>
        </div>
      </div>

      {/* Rules Pill */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-[rgb(var(--color-muted))] flex-wrap py-1">
        <span>Scoring:</span>
        <span className="px-2 py-0.5 rounded-md bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] font-bold">+1 XP / min Focus</span>
        <span className="px-2 py-0.5 rounded-md bg-[rgb(var(--color-container-low))] text-indigo-500 font-bold">+30 XP / Duel Win</span>
        <span className="px-2 py-0.5 rounded-md bg-[rgb(var(--color-container-low))] text-amber-500 font-bold">+20 XP / Flashcard Rush</span>
      </div>

      {/* Leaderboard Table List */}
      <div className="space-y-1.5 overflow-x-auto">
        {leaderboard.map((scholar, idx) => {
          const rank = idx + 1;
          const isTop3 = rank <= 3;
          const isBottom5 = rank >= 16;
          const isYou = scholar.isYou;

          return (
            <div
              key={scholar.name}
              className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all text-xs ${
                isYou
                  ? 'bg-[#9e3c26]/10 border-[#9e3c26]/40 shadow-xs'
                  : isTop3
                  ? 'bg-emerald-500/[0.04] border-emerald-500/20 hover:bg-emerald-500/[0.08]'
                  : isBottom5
                  ? 'bg-red-500/[0.02] border-red-500/15 opacity-80 hover:opacity-100'
                  : 'bg-[rgb(var(--color-surface))]/40 border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-container-low))]'
              }`}
            >
              {/* Left: Rank & Avatar */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 text-center font-mono font-extrabold text-xs shrink-0">
                  {rank === 1 ? (
                    <span className="text-amber-500 text-sm">🥇</span>
                  ) : rank === 2 ? (
                    <span className="text-slate-400 text-sm">🥈</span>
                  ) : rank === 3 ? (
                    <span className="text-amber-700 text-sm">🥉</span>
                  ) : (
                    <span className={isBottom5 ? 'text-red-500 font-bold' : 'text-[rgb(var(--color-muted))]'}>
                      #{rank}
                    </span>
                  )}
                </div>

                <UserAvatar
                  src={scholar.avatar}
                  name={scholar.name}
                  className="w-8 h-8 rounded-full border border-[rgb(var(--color-border))] shrink-0"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`font-bold truncate ${
                      isYou ? 'text-[#9e3c26] dark:text-[#ffb4a3]' : 'text-[rgb(var(--color-text))]'
                    }`}>
                      {scholar.name}
                    </p>
                    {isYou && (
                      <span className="px-1.5 py-0.2 rounded bg-[#9e3c26] text-white text-[10px] font-mono font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[rgb(var(--color-muted))] font-mono truncate">
                    {scholar.school} • {scholar.elo} Elo
                  </p>
                </div>
              </div>

              {/* Right: Metrics & XP */}
              <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs shrink-0">
                <div className="hidden sm:flex items-center gap-1 text-[rgb(var(--color-muted))]">
                  <Swords size={12} className="text-indigo-400" />
                  <span>{scholar.duelsWon}W</span>
                </div>

                {scholar.streak > 0 && (
                  <div className="hidden sm:flex items-center gap-1 text-orange-500 font-bold">
                    <Flame size={12} />
                    <span>{scholar.streak}</span>
                  </div>
                )}

                <div className="text-right min-w-[70px]">
                  <div className="font-extrabold text-[rgb(var(--color-text))]">
                    {scholar.xp.toLocaleString()} XP
                  </div>
                  <div className="text-[10px] font-medium flex items-center justify-end gap-1">
                    {isTop3 ? (
                      <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                        <ArrowUp size={10} /> Promote
                      </span>
                    ) : isBottom5 ? (
                      <span className="text-red-500 flex items-center gap-0.5">
                        <ArrowDown size={10} /> Relegate
                      </span>
                    ) : (
                      <span className="text-[rgb(var(--color-muted))]">Safe</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

