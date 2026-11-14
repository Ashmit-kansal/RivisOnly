/**
 * Clash of Clans Style League Definitions for RivisOnly
 * Trophies determine the player's league, visual shield, perks, and war bonuses.
 */

export const COC_LEAGUES = [
  {
    id: 'bronze',
    name: 'Bronze League',
    tier: 'Bronze',
    minTrophies: 0,
    maxTrophies: 499,
    badgeColor: 'from-amber-700 to-amber-900',
    borderColor: 'border-amber-700',
    textColor: 'text-amber-500',
    bgColor: 'bg-amber-950/20',
    shieldIcon: '🛡️',
    warBonus: '1.0x War XP',
    perk: 'Unlocks Private Guild membership & 15-MCQ Blitz Skirmishes.',
    description: 'The foundation for aspiring scholars. Master the fundamentals to climb out of the bronze tier.'
  },
  {
    id: 'silver',
    name: 'Silver League',
    tier: 'Silver',
    minTrophies: 500,
    maxTrophies: 999,
    badgeColor: 'from-slate-400 to-slate-600',
    borderColor: 'border-slate-400',
    textColor: 'text-slate-300',
    bgColor: 'bg-slate-800/20',
    shieldIcon: '⚔️',
    warBonus: '1.1x War XP',
    perk: 'Unlocks 20-MCQ Ranked Exams & Guild Co-Leader nominations.',
    description: 'Sharpened intellect and consistent study rituals. Silver scholars begin taking leadership.'
  },
  {
    id: 'gold',
    name: 'Gold League',
    tier: 'Gold',
    minTrophies: 1000,
    maxTrophies: 1499,
    badgeColor: 'from-amber-400 to-yellow-600',
    borderColor: 'border-amber-400',
    textColor: 'text-yellow-400',
    bgColor: 'bg-amber-500/10',
    shieldIcon: '🏆',
    warBonus: '1.25x War XP',
    perk: 'Unlocks 40-MCQ Grand Gauntlet & Animated Profile Glow.',
    description: 'Recognized academic prestige. High accuracy in ranked exams and steady Guild War contributions.'
  },
  {
    id: 'crystal',
    name: 'Crystal League',
    tier: 'Crystal',
    minTrophies: 1500,
    maxTrophies: 1999,
    badgeColor: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    shieldIcon: '🔮',
    warBonus: '1.4x War XP',
    perk: 'Unlocks Weekly Trophy Loss Shield & Custom Guild War Banners.',
    description: 'Razor-sharp memory and synthesis. Crystal scholars are the backbone of competitive guilds.'
  },
  {
    id: 'master',
    name: 'Master League',
    tier: 'Master',
    minTrophies: 2000,
    maxTrophies: 2599,
    badgeColor: 'from-emerald-400 to-teal-700',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    shieldIcon: '⚜️',
    warBonus: '1.6x War XP',
    perk: 'Unlocks Grandmaster Title & 3-Star Gauntlet Multiplier.',
    description: 'Elite academic mastery. Capable of scoring flawless gauntlets across difficult syllabi.'
  },
  {
    id: 'champion',
    name: 'Champion League',
    tier: 'Champion',
    minTrophies: 2600,
    maxTrophies: 3199,
    badgeColor: 'from-rose-500 to-red-700',
    borderColor: 'border-rose-400',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    shieldIcon: '👑',
    warBonus: '1.85x War XP',
    perk: 'Global Guild War Star MVP nomination & Golden Nameplate.',
    description: 'Among the top 1% of revision masters worldwide. Feared in 1v1 duels and ranked matches.'
  },
  {
    id: 'titan',
    name: 'Titan League',
    tier: 'Titan',
    minTrophies: 3200,
    maxTrophies: 3999,
    badgeColor: 'from-cyan-400 to-blue-700',
    borderColor: 'border-cyan-400',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    shieldIcon: '⚡',
    warBonus: '2.1x War XP',
    perk: 'Titan Aura in live guild chat & Permanent Hall of Fame entry.',
    description: 'A colossus of knowledge. Unrivaled retention, speed, and strategic academic endurance.'
  },
  {
    id: 'legend',
    name: 'Legend League',
    tier: 'Legend',
    minTrophies: 4000,
    maxTrophies: 99999,
    badgeColor: 'from-amber-300 via-purple-500 to-indigo-600',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-300',
    bgColor: 'bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15',
    shieldIcon: '🌟',
    warBonus: '2.5x War XP',
    perk: 'Supreme Mythic Scholar Crown & Infinite Guild War Prestige.',
    description: 'The pinnacle of RivisOnly. Absolute intellectual perfection across all academic disciplines.'
  }
];

/**
 * Returns the player's league given a trophy count
 */
export function getLeagueByTrophies(trophies = 1540) {
  const t = Math.max(0, trophies);
  for (let i = COC_LEAGUES.length - 1; i >= 0; i--) {
    if (t >= COC_LEAGUES[i].minTrophies) {
      return COC_LEAGUES[i];
    }
  }
  return COC_LEAGUES[0];
}

/**
 * Returns progress percentage to the next league
 */
export function getLeagueProgress(trophies = 1540) {
  const current = getLeagueByTrophies(trophies);
  const next = COC_LEAGUES.find(l => l.minTrophies > trophies);
  if (!next) return { current, next: null, percent: 100, remaining: 0 };

  const range = next.minTrophies - current.minTrophies;
  const earned = trophies - current.minTrophies;
  const percent = Math.min(100, Math.max(0, Math.round((earned / range) * 100)));
  const remaining = next.minTrophies - trophies;

  return { current, next, percent, remaining };
}

/**
 * Initial Global Guilds (Clans) Leaderboard for Guild Wars
 */
export const INITIAL_GUILDS = [
  {
    id: 'guild-quantum',
    name: 'Quantum Vanguard',
    code: 'QUANTUM-7',
    tag: '#QV900',
    badge: '🔮',
    badgeBg: 'from-purple-600 to-indigo-800',
    motto: 'Knowledge is our armor. Focus is our weapon.',
    leaderName: 'Dr. Sarah Patel',
    leaderId: 'm10',
    level: 12,
    memberCount: 16,
    maxMembers: 20,
    trophies: 28450,
    warStars: 342,
    warWins: 28,
    isPrivate: true,
    weeklyRank: 1,
    members: [
      { id: 'm10', name: 'Dr. Sarah Patel', role: 'Guild Leader', trophies: 2780, warStars: 48, avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80', status: 'Studying Mechanisms', level: 25 },
      { id: 'm11', name: 'Kenji Sato', role: 'Co-Leader', trophies: 2410, warStars: 39, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', status: 'In 40-MCQ Gauntlet', level: 17 },
      { id: 'm12', name: 'Amara Nwosu', role: 'Elder', trophies: 2350, warStars: 36, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'Online', level: 19 },
      { id: 'me', name: 'Scholar (You)', role: 'Elder', trophies: 1540, warStars: 22, avatar: null, status: 'Active in Guild War', level: 14, isYou: true }
    ],
    messages: [
      { id: 'msg-g1', sender: 'Dr. Sarah Patel', role: 'Guild Leader', text: 'Guild War round active! Everyone please complete your 20-MCQ Exam today for +2 War Stars ⭐⭐!', time: '18:30', isSystem: false },
      { id: 'msg-g2', sender: 'Kenji Sato', role: 'Co-Leader', text: 'Just completed 40-MCQ Organic Mechanism Grand Trial with 95% accuracy! +3 Stars for the Vanguard! ⭐⭐⭐', time: '18:42', isSystem: false },
      { id: 'msg-g3', sender: 'System', role: 'System', text: 'Quantum Vanguard reached 340 War Stars! Ranked #1 in Crystal War Division.', time: '18:45', isSystem: true }
    ]
  },
  {
    id: 'guild-synapse',
    name: 'Synapse Synthesizers',
    code: 'SYNAPSE-42',
    tag: '#SYN42',
    badge: '⚡',
    badgeBg: 'from-amber-500 to-red-600',
    motto: 'Relentless active recall. No concept forgotten.',
    leaderName: 'Julian Chen',
    leaderId: 'm4',
    level: 10,
    memberCount: 14,
    maxMembers: 20,
    trophies: 26190,
    warStars: 318,
    warWins: 24,
    isPrivate: true,
    weeklyRank: 2,
    members: [
      { id: 'm4', name: 'Julian Chen', role: 'Guild Leader', trophies: 2540, warStars: 44, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'Focusing', level: 21 },
      { id: 'm6', name: 'Elena Rostova', role: 'Co-Leader', trophies: 2280, warStars: 35, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'Reviewing Notes', level: 16 }
    ],
    messages: [
      { id: 'msg-s1', sender: 'Julian Chen', role: 'Guild Leader', text: 'Pushing for 320 War Stars by midnight. Keep grinding the gauntlets!', time: '17:15', isSystem: false }
    ]
  },
  {
    id: 'guild-heidelberg',
    name: 'Heidelberg Mechanists',
    code: 'HEIDEL-8',
    tag: '#HD99',
    badge: '⚜️',
    badgeBg: 'from-emerald-600 to-teal-800',
    motto: 'Precision mechanisms and disciplined pomodoros.',
    leaderName: 'Marcus Vance',
    leaderId: 'm2',
    level: 9,
    memberCount: 12,
    maxMembers: 20,
    trophies: 23840,
    warStars: 284,
    warWins: 19,
    isPrivate: true,
    weeklyRank: 3,
    members: [
      { id: 'm2', name: 'Marcus Vance', role: 'Guild Leader', trophies: 2190, warStars: 32, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'Deep Session', level: 15 }
    ],
    messages: []
  },
  {
    id: 'guild-turing',
    name: 'Turing Automata',
    code: 'TURING-1',
    tag: '#TUR1',
    badge: '💻',
    badgeBg: 'from-cyan-600 to-blue-800',
    motto: 'Compiling mastery bit by bit.',
    leaderName: 'Sophia Lin',
    leaderId: 'm5',
    level: 8,
    memberCount: 11,
    maxMembers: 20,
    trophies: 21450,
    warStars: 260,
    warWins: 16,
    isPrivate: true,
    weeklyRank: 4,
    members: [
      { id: 'm5', name: 'Sophia Lin', role: 'Guild Leader', trophies: 1980, warStars: 29, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'Online', level: 14 }
    ],
    messages: []
  },
  {
    id: 'guild-oxford',
    name: 'Oxford Dialectics',
    code: 'OXFORD-5',
    tag: '#OX55',
    badge: '👑',
    badgeBg: 'from-amber-600 to-yellow-800',
    motto: 'Rigorous debate and unassailable recall.',
    leaderName: 'Alex Mercer',
    leaderId: 'm11',
    level: 7,
    memberCount: 10,
    maxMembers: 20,
    trophies: 19280,
    warStars: 235,
    warWins: 13,
    isPrivate: true,
    weeklyRank: 5,
    members: [],
    messages: []
  }
];

