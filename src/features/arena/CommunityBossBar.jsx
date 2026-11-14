import React from 'react';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import ProgressBar from '../../components/ui/ProgressBar';
import { Shield, Sparkles, Award, Clock, Heart, Flame } from 'lucide-react';

export default function CommunityBossBar() {
  const { communityBoss } = useStudyRooms();
  const hpPercent = Math.max(0, Math.round((communityBoss.currentHp / communityBoss.maxHp) * 100));

  return (
    <div className="rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] p-5 sm:p-6 space-y-4 shadow-sm relative overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Boss Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-2xl flex items-center justify-center border border-red-500/20 shrink-0">
            {communityBoss.avatar}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 uppercase">
                COMMUNITY RAID BOSS
              </span>
              <span className="text-[11px] font-mono text-[rgb(var(--color-muted))]">
                {communityBoss.daysRemaining} days remaining
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[rgb(var(--color-text))] mt-0.5">
              {communityBoss.name}
            </h3>
            <p className="text-xs text-[rgb(var(--color-muted))]">
              {communityBoss.subtitle}
            </p>
          </div>
        </div>

        {/* Reward Pill */}
        <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
          <Award size={15} />
          <span>Reward: {communityBoss.rewardBadge} (+{communityBoss.rewardXp} XP)</span>
        </div>

      </div>

      {/* HP Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[rgb(var(--color-muted))] flex items-center gap-1">
            <Heart size={12} className="text-red-500 fill-red-500" />
            <span>Titan HP Remaining:</span>
          </span>
          <span className="font-extrabold text-[rgb(var(--color-text))]">
            {communityBoss.currentHp.toLocaleString()} / {communityBoss.maxHp.toLocaleString()} HP ({hpPercent}%)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-[rgb(var(--color-container-low))] overflow-hidden border border-[rgb(var(--color-border))]">
          <div 
            className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[rgb(var(--color-muted))] pt-0.5">
        <span>⚔️ 1 focus minute in Pomodoro or Squad = 1 DMG</span>
        <span>All participating scholars earn the badge upon defeat</span>
      </div>

    </div>
  );
}

