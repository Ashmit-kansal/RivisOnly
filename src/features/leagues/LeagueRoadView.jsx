import React from 'react';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import { Trophy, Star, Shield, ArrowUpRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export default function LeagueRoadView() {
  const { userTrophies, currentLeague, leagueProgress, allLeagues, warStars } = useStudyRooms();

  return (
    <div className="space-y-6">
      
      {/* Current League Hero Showcase */}
      <div className={`p-6 rounded-3xl border relative overflow-hidden bg-gradient-to-r ${currentLeague.badgeColor} bg-opacity-10 border-opacity-30 ${currentLeague.bgColor}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--color-card))]/80 backdrop-blur-md border border-[rgb(var(--color-border))] flex items-center justify-center text-3xl shadow-xl shadow-black/20">
              {currentLeague.shieldIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[rgb(var(--color-muted))]">
                  Current Division
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                  {currentLeague.warBonus}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-[rgb(var(--color-text))]">
                {currentLeague.name}
              </h2>
              <p className="text-xs text-[rgb(var(--color-muted))] max-w-md mt-0.5">
                {currentLeague.perk}
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3 font-mono">
            <div className="p-3 rounded-2xl bg-[rgb(var(--color-card))]/80 backdrop-blur-md border border-[rgb(var(--color-border))] text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-bold text-[rgb(var(--color-muted))]">Trophies</div>
              <div className="text-base font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                <Trophy size={14} />
                <span>{userTrophies}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[rgb(var(--color-card))]/80 backdrop-blur-md border border-[rgb(var(--color-border))] text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-bold text-[rgb(var(--color-muted))]">War Stars</div>
              <div className="text-base font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                <Star size={14} className="fill-amber-300" />
                <span>{warStars}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Tier Progress Bar */}
        {leagueProgress.next && (
          <div className="mt-6 pt-5 border-t border-[rgb(var(--color-border))]/50 relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[rgb(var(--color-muted))]">
                Progress to <span className="font-bold text-[rgb(var(--color-text))]">{leagueProgress.next.name}</span>
              </span>
              <span className="font-bold text-amber-400">
                {leagueProgress.remaining} 🏆 to promote
              </span>
            </div>

            <div className="w-full h-2.5 bg-[rgb(var(--color-container))] rounded-full overflow-hidden p-0.5 border border-[rgb(var(--color-border))]">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#9e3c26] rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${leagueProgress.percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Clash of Clans Trophy Road Ladder */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[rgb(var(--color-text))] flex items-center gap-2">
          <Shield size={16} className="text-[#9e3c26]" />
          <span>Trophy Road • League Ladders</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {allLeagues.map((league) => {
            const isCurrent = league.id === currentLeague.id;
            const isUnlocked = userTrophies >= league.minTrophies;

            return (
              <div
                key={league.id}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/5 ring-2 ring-amber-500/30'
                    : isUnlocked
                    ? 'bg-[rgb(var(--color-card))] border-[rgb(var(--color-border))]'
                    : 'bg-[rgb(var(--color-container-low))]/50 border-[rgb(var(--color-border))]/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex items-center justify-center text-2xl shadow-sm shrink-0">
                      {league.shieldIcon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[rgb(var(--color-text))]">
                          {league.name}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-amber-500 text-black">
                            YOU ARE HERE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-amber-400 mt-0.5">
                        {league.minTrophies.toLocaleString()} 🏆 {league.maxTrophies < 99999 ? `– ${league.maxTrophies} 🏆` : '+'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] border border-[rgb(var(--color-border))] shrink-0">
                    {league.warBonus}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[rgb(var(--color-border))] text-[11px] text-[rgb(var(--color-muted))] flex items-center justify-between">
                  <span>{league.perk}</span>
                  {isUnlocked ? (
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Lock size={14} className="text-[rgb(var(--color-muted))] shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

