import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import { 
  Trophy, Swords, Zap, Flame, Shield, 
  Crown, Sparkles, Star, TrendingUp
} from 'lucide-react';

export default function ArenaHeroBanner({ onOpenDuel, onOpenGuilds }) {
  const { user } = useAuth();
  const { userTrophies, currentLeague, warStars, userElo, winStreak } = useStudyRooms();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[rgb(var(--color-card))] via-[rgb(var(--color-container-low))] to-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] p-6 sm:p-8 shadow-sm">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-[#9e3c26]/10 to-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: User Identity, League & Trophies */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/20 text-[rgb(var(--color-primary))] text-xs font-mono font-bold tracking-wide uppercase">
              <Swords size={12} />
              <span>Rivis 1v1 Arena & Guild Wars</span>
            </span>

            {/* CoC League Badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold ${currentLeague.borderColor} ${currentLeague.bgColor} ${currentLeague.textColor}`}>
              <span>{currentLeague.shieldIcon}</span>
              <span>{currentLeague.name}</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[rgb(var(--color-text))]">
              1v1 Scholar Arena & Private Guilds
            </h1>
            <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] max-w-xl mt-1 leading-relaxed">
              Match against scholars in real-time across Computer Science, Mathematics, Science, and more. Choose custom subtopics with zero AI latency.
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap pt-1 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgb(var(--color-surface))]/80 border border-[rgb(var(--color-border))]">
              <Trophy size={14} className="text-amber-400" />
              <span className="text-[rgb(var(--color-muted))]">Trophies:</span>
              <span className="font-bold text-amber-400">{userTrophies} 🏆</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgb(var(--color-surface))]/80 border border-[rgb(var(--color-border))]">
              <Star size={14} className="fill-amber-300 text-amber-300" />
              <span className="text-[rgb(var(--color-muted))]">War Stars:</span>
              <span className="font-bold text-amber-300">{warStars} ⭐</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgb(var(--color-surface))]/80 border border-[rgb(var(--color-border))]">
              <Flame size={14} className="text-orange-500 animate-pulse" />
              <span className="text-[rgb(var(--color-muted))]">Win Streak:</span>
              <span className="font-bold text-[rgb(var(--color-text))]">{winStreak}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgb(var(--color-surface))]/80 border border-[rgb(var(--color-border))]">
              <Shield size={14} className="text-indigo-400" />
              <span className="text-[rgb(var(--color-muted))]">Arena Elo:</span>
              <span className="font-bold text-[rgb(var(--color-text))]">{userElo}</span>
            </div>
          </div>
        </div>

        {/* Right: Dedicated 1v1 Duel Launch Action */}
        <div className="flex flex-col gap-2 shrink-0 sm:min-w-[280px]">
          <button
            onClick={onOpenDuel}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#9e3c26] via-[#b84a32] to-[#8d321d] hover:brightness-105 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#9e3c26]/25 border border-amber-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <Swords size={18} className="text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Launch 1v1 Scholar Duel</span>
          </button>
          
          <div className="flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))] px-1">
            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>3,800+ Active Scholars</span>
            </span>
            <span>0s AI Latency</span>
          </div>
        </div>

      </div>
    </div>
  );
}
