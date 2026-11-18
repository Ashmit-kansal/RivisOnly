import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_PRIVATE_SQUADS, 
  INITIAL_LEAGUE_DIVISION, 
  INITIAL_COMMUNITY_BOSS 
} from '../data/mockArena';
import {
  COC_LEAGUES,
  getLeagueByTrophies,
  getLeagueProgress,
  INITIAL_GUILDS
} from '../data/leagueData';
import {
  lockTopicCooldown,
  logTrophyLedger,
  verifyDriveFilesIntegrity
} from '../services/questionBankService';

const StudyRoomsContext = createContext(null);

const GUILDS_STORAGE_KEY = 'rivisonly-guilds-v3';
const MY_GUILD_ID_KEY = 'rivisonly-my-guild-id';
const ACTIVE_SQUAD_SESSION_KEY = 'rivisonly-active-squad-session';
const USER_TROPHIES_KEY = 'rivisonly-user-trophies';
const USER_WAR_STARS_KEY = 'rivisonly-user-war-stars';
const ARENA_ELO_KEY = 'rivisonly-arena-elo';
const ARENA_STREAK_KEY = 'rivisonly-arena-streak';
const ARENA_XP_KEY = 'rivisonly-arena-xp';
const RUSH_HIGHSCORE_KEY = 'rivisonly-rush-highscore';

function sanitizeGuild(g) {
  if (!g) return g;
  const isPurple = !g.badgeBg || g.badgeBg.includes('purple') || g.badgeBg.includes('indigo-800');
  return {
    ...g,
    badgeBg: isPurple ? 'from-[#9e3c26] via-[#b3452d] to-[#7f2e1b]' : g.badgeBg
  };
}

function getStoredGuilds() {
  try {
    const raw = localStorage.getItem(GUILDS_STORAGE_KEY) || localStorage.getItem('rivisonly-guilds-v2');
    if (!raw) {
      localStorage.setItem(GUILDS_STORAGE_KEY, JSON.stringify(INITIAL_GUILDS));
      return INITIAL_GUILDS.map(sanitizeGuild);
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_GUILDS;
    const sanitized = list.map(sanitizeGuild);
    localStorage.setItem(GUILDS_STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized;
  } catch {
    return INITIAL_GUILDS.map(sanitizeGuild);
  }
}

function getStoredActiveSession() {
  try {
    const raw = localStorage.getItem(ACTIVE_SQUAD_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.room || !session.targetEndTime) return null;
    if (session.targetEndTime <= Date.now()) {
      localStorage.removeItem(ACTIVE_SQUAD_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function StudyRoomsProvider({ children }) {
  // 1. Private Guilds (Clans) State
  const [guilds, setGuilds] = useState(getStoredGuilds);
  const [myGuildId, setMyGuildId] = useState(() => {
    try {
      return localStorage.getItem(MY_GUILD_ID_KEY) || 'guild-quantum';
    } catch {
      return 'guild-quantum';
    }
  });

  const [activeRoomSession, setActiveRoomSession] = useState(getStoredActiveSession);
  const [activeTimeLeft, setActiveTimeLeft] = useState(() => {
    const initialSession = getStoredActiveSession();
    if (!initialSession) return 0;
    const ms = initialSession.targetEndTime - Date.now();
    return Math.max(0, Math.ceil(ms / 1000));
  });
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);

  // 2. CoC Trophies & War Stars
  const [userTrophies, setUserTrophies] = useState(() => {
    try {
      const val = localStorage.getItem(USER_TROPHIES_KEY);
      return val ? parseInt(val, 10) : 1540; // Default Crystal League
    } catch {
      return 1540;
    }
  });

  const [warStars, setWarStars] = useState(() => {
    try {
      const val = localStorage.getItem(USER_WAR_STARS_KEY);
      return val ? parseInt(val, 10) : 22;
    } catch {
      return 22;
    }
  });

  // 3. Arena Stats State
  const [userElo, setUserElo] = useState(() => {
    try {
      const val = localStorage.getItem(ARENA_ELO_KEY);
      return val ? parseInt(val, 10) : 1420;
    } catch {
      return 1420;
    }
  });

  const [winStreak, setWinStreak] = useState(() => {
    try {
      const val = localStorage.getItem(ARENA_STREAK_KEY);
      return val ? parseInt(val, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [leagueXp, setLeagueXp] = useState(() => {
    try {
      const val = localStorage.getItem(ARENA_XP_KEY);
      return val ? parseInt(val, 10) : 1920;
    } catch {
      return 1920;
    }
  });

  const [rushHighScore, setRushHighScore] = useState(() => {
    try {
      const val = localStorage.getItem(RUSH_HIGHSCORE_KEY);
      return val ? parseInt(val, 10) : 840;
    } catch {
      return 840;
    }
  });

  const [communityBoss, setCommunityBoss] = useState(INITIAL_COMMUNITY_BOSS);
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEAGUE_DIVISION);

  // Sync guilds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(GUILDS_STORAGE_KEY, JSON.stringify(guilds));
    } catch (e) {
      console.warn('Failed to save guilds to localStorage', e);
    }
  }, [guilds]);

  // Sync active squad session to localStorage
  useEffect(() => {
    try {
      if (activeRoomSession) {
        localStorage.setItem(ACTIVE_SQUAD_SESSION_KEY, JSON.stringify(activeRoomSession));
      } else {
        localStorage.removeItem(ACTIVE_SQUAD_SESSION_KEY);
      }
    } catch (e) {
      console.warn('Failed to save active squad session', e);
    }
  }, [activeRoomSession]);

  // Sync Timer for Active Squad Session
  useEffect(() => {
    if (!activeRoomSession) {
      setActiveTimeLeft(0);
      setIsSessionCompleted(false);
      return;
    }

    const updateTimer = () => {
      const remainingMs = activeRoomSession.targetEndTime - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      setActiveTimeLeft(remainingSec);

      if (remainingSec <= 0) {
        setIsSessionCompleted(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);
    return () => clearInterval(interval);
  }, [activeRoomSession]);

  // COMPUTED: User's Active Guild
  const myGuild = guilds.find(g => g.id === myGuildId) || null;
  const currentLeague = getLeagueByTrophies(userTrophies);
  const leagueProgress = getLeagueProgress(userTrophies);

  // GUILD (CLAN) ACTIONS
  const createGuild = (newGuildData, currentUser) => {
    const code = newGuildData.code?.toUpperCase() || `GUILD-${Math.floor(1000 + Math.random() * 9000)}`;
    const myName = currentUser ? `${currentUser.name} (You)` : 'Scholar (You)';
    
    const newGuild = {
      id: `guild-${Date.now()}`,
      name: newGuildData.name || 'Imperial Focus Syndicate',
      code: code,
      tag: `#G${Math.floor(100 + Math.random() * 900)}`,
      badge: newGuildData.badge || '🛡️',
      badgeBg: newGuildData.badgeBg || 'from-amber-600 to-yellow-800',
      motto: newGuildData.motto || 'Unrivaled discipline. Unstoppable intellect.',
      leaderName: myName,
      leaderId: 'me',
      level: 1,
      memberCount: 1,
      maxMembers: 20,
      trophies: userTrophies,
      warStars: warStars,
      warWins: 0,
      isPrivate: true,
      weeklyRank: guilds.length + 1,
      members: [
        {
          id: 'me',
          name: myName,
          role: 'Guild Leader',
          trophies: userTrophies,
          warStars: warStars,
          avatar: currentUser?.avatar || null,
          status: 'Active Guild Leader',
          level: currentUser?.level ?? 1,
          isYou: true
        }
      ],
      messages: [
        {
          id: `sys-${Date.now()}`,
          sender: 'System',
          role: 'System',
          text: `Guild established! Secret Passcode: ${code}. Share this code ONLY with trusted scholars.`,
          time: 'Just now',
          isSystem: true
        }
      ]
    };

    setGuilds(prev => [newGuild, ...prev]);
    setMyGuildId(newGuild.id);
    try {
      localStorage.setItem(MY_GUILD_ID_KEY, newGuild.id);
    } catch {}

    return newGuild;
  };

  const joinGuildByCode = (code, currentUser) => {
    if (!code) return { success: false, error: 'Please enter a valid guild passcode.' };
    const clean = code.trim().toUpperCase();
    const targetGuild = guilds.find(g => g.code?.toUpperCase() === clean);

    if (!targetGuild) {
      return { success: false, error: 'Invalid passcode. No private guild found with this secret code.' };
    }

    if (targetGuild.members?.length >= (targetGuild.maxMembers || 20)) {
      return { success: false, error: 'This guild is currently full (20/20 scholars).' };
    }

    const myName = currentUser ? `${currentUser.name} (You)` : 'Scholar (You)';
    const existing = targetGuild.members || [];
    const hasMe = existing.some(m => m.id === 'me');

    const updatedMembers = hasMe ? existing : [
      ...existing,
      {
        id: 'me',
        name: myName,
        role: 'Member',
        trophies: userTrophies,
        warStars: warStars,
        avatar: currentUser?.avatar || null,
        status: 'Active in Guild War',
        level: currentUser?.level ?? 1,
        isYou: true
      }
    ];

    const updatedGuild = {
      ...targetGuild,
      members: updatedMembers,
      memberCount: updatedMembers.length,
      trophies: targetGuild.trophies + userTrophies,
      messages: [
        ...(targetGuild.messages || []),
        {
          id: `sys-join-${Date.now()}`,
          sender: 'System',
          role: 'System',
          text: `${myName} unlocked the gates and joined the guild!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true
        }
      ]
    };

    setGuilds(prev => prev.map(g => g.id === targetGuild.id ? updatedGuild : g));
    setMyGuildId(targetGuild.id);
    try {
      localStorage.setItem(MY_GUILD_ID_KEY, targetGuild.id);
    } catch {}

    return { success: true, guild: updatedGuild };
  };

  const leaveGuild = () => {
    if (myGuild) {
      const updatedMembers = (myGuild.members || []).filter(m => m.id !== 'me');
      const updatedGuild = {
        ...myGuild,
        members: updatedMembers,
        memberCount: updatedMembers.length
      };
      setGuilds(prev => prev.map(g => g.id === myGuild.id ? updatedGuild : g));
    }
    setMyGuildId(null);
    try {
      localStorage.removeItem(MY_GUILD_ID_KEY);
    } catch {}
  };

  const regenerateGuildCode = (guildId) => {
    const newCode = `GUILD-${Math.floor(1000 + Math.random() * 9000)}`;
    setGuilds(prev => prev.map(g => {
      if (g.id === guildId) {
        return {
          ...g,
          code: newCode,
          messages: [
            ...(g.messages || []),
            {
              id: `sys-regen-${Date.now()}`,
              sender: 'System',
              role: 'System',
              text: `Guild Leader regenerated the secret passcode. New Passcode: ${newCode}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isSystem: true
            }
          ]
        };
      }
      return g;
    }));
    return newCode;
  };

  const sendGuildMessage = (text, currentUser) => {
    if (!myGuild || !text || !text.trim()) return;
    const myName = currentUser ? currentUser.name : 'Scholar';
    const newMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender: myName,
      role: myGuild.leaderId === 'me' ? 'Guild Leader' : 'Elder',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: false,
      isYou: true
    };

    setGuilds(prev => prev.map(g => {
      if (g.id === myGuild.id) {
        return {
          ...g,
          messages: [...(g.messages || []), newMessage]
        };
      }
      return g;
    }));
  };

  // RANKED GAUNTLET MATCH OUTCOME
  const completeGauntletMatch = ({
    tier = 15,
    score = 0,
    total = 15,
    fileId = 'default',
    fileName = 'Study Note',
    isRanked = true
  }) => {
    const accuracy = Math.round((score / total) * 100);
    const won = accuracy >= 70; // 70% passing threshold

    let trophyDelta = 0;
    let starsEarned = 0;

    if (won) {
      if (tier === 15) {
        trophyDelta = 15;
        starsEarned = 1;
      } else if (tier === 20) {
        trophyDelta = 28;
        starsEarned = 2;
      } else {
        // 40 MCQs Grand Gauntlet
        trophyDelta = 65;
        starsEarned = 3;
      }

      // Flawless 100% bonus (+20% trophies)
      if (accuracy === 100) {
        trophyDelta = Math.round(trophyDelta * 1.2);
      }
    } else {
      // Deductions on loss
      if (tier === 15) trophyDelta = -8;
      else if (tier === 20) trophyDelta = -16;
      else trophyDelta = -35;
    }

    if (!isRanked) {
      // Practice mode: zero trophy changes
      trophyDelta = 0;
      starsEarned = 0;
    }

    const nextTrophies = Math.max(0, userTrophies + trophyDelta);
    setUserTrophies(nextTrophies);
    try {
      localStorage.setItem(USER_TROPHIES_KEY, String(nextTrophies));
    } catch {}

    if (starsEarned > 0) {
      const nextStars = warStars + starsEarned;
      setWarStars(nextStars);
      try {
        localStorage.setItem(USER_WAR_STARS_KEY, String(nextStars));
      } catch {}
    }

    // Lock topic cooldown for 7 days if ranked
    if (isRanked && won) {
      lockTopicCooldown(fileId, fileName);
      logTrophyLedger({ fileId, fileName, delta: trophyDelta, won, reason: `${tier}-MCQ Ranked Gauntlet` });
    }

    // Award Guild War Stars to user's active Guild
    if (myGuild && starsEarned > 0) {
      setGuilds(prev => prev.map(g => {
        if (g.id === myGuild.id) {
          const updatedMembers = (g.members || []).map(m => {
            if (m.isYou || m.id === 'me') {
              return {
                ...m,
                trophies: nextTrophies,
                warStars: (m.warStars || 0) + starsEarned
              };
            }
            return m;
          });

          return {
            ...g,
            warStars: (g.warStars || 0) + starsEarned,
            trophies: Math.max(0, g.trophies + trophyDelta),
            members: updatedMembers,
            messages: [
              ...(g.messages || []),
              {
                id: `sys-star-${Date.now()}`,
                sender: 'System',
                role: 'System',
                text: `⭐ Scholar conquered ${tier}-MCQ Gauntlet with ${accuracy}% accuracy! +${starsEarned} War Star(s) for the Guild!`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSystem: true
              }
            ]
          };
        }
        return g;
      }));
    }

    // Update Elo and League XP
    if (won) {
      updateElo(tier === 40 ? 45 : (tier === 20 ? 25 : 15), true);
    } else {
      updateElo(tier === 40 ? -25 : (tier === 20 ? -15 : -8), false);
    }

    return {
      won,
      accuracy,
      trophyDelta,
      starsEarned,
      nextTrophies,
      newLeague: getLeagueByTrophies(nextTrophies)
    };
  };

  // SQUAD / ROOM COMPATIBILITY ACTIONS (Keeps existing room sessions working seamlessly)
  const joinSquadRoom = (squad, committedMinutes, currentUser) => {
    const totalSecs = (committedMinutes || 25) * 60;
    const targetEndTime = Date.now() + (totalSecs * 1000);
    const myName = currentUser ? `${currentUser.name} (You)` : 'Guest Scholar (You)';

    const session = {
      roomId: squad.id,
      room: squad,
      committedMinutes,
      targetEndTime,
      startedAt: Date.now(),
      messages: [
        ...(squad.messages || []),
        {
          id: `sys-join-${Date.now()}`,
          sender: 'System',
          text: `You locked into ${squad.name} for a ${committedMinutes}m focus cycle.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true
        }
      ]
    };

    setActiveRoomSession(session);
    setActiveTimeLeft(totalSecs);
    setIsSessionCompleted(false);
    damageCommunityBoss(committedMinutes);
  };

  const leaveSquadRoom = () => {
    setActiveRoomSession(null);
    setIsSessionCompleted(false);
    setActiveTimeLeft(0);
    try {
      localStorage.removeItem(ACTIVE_SQUAD_SESSION_KEY);
    } catch {}
  };

  const addMessageToActiveRoom = (msg) => {
    setActiveRoomSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...(prev.messages || []), msg]
      };
    });
  };

  const updateElo = (delta, won = true) => {
    const nextElo = Math.max(800, userElo + delta);
    setUserElo(nextElo);
    try {
      localStorage.setItem(ARENA_ELO_KEY, String(nextElo));
    } catch {}

    if (won) {
      setWinStreak(s => {
        const next = s + 1;
        try { localStorage.setItem(ARENA_STREAK_KEY, String(next)); } catch {}
        return next;
      });
      addLeagueXP(30);
    } else {
      setWinStreak(0);
      try { localStorage.setItem(ARENA_STREAK_KEY, '0'); } catch {}
      addLeagueXP(10);
    }
  };

  const addLeagueXP = (amount) => {
    setLeagueXp(prev => {
      const next = prev + amount;
      try { localStorage.setItem(ARENA_XP_KEY, String(next)); } catch {}
      return next;
    });
  };

  const recordRushScore = (score) => {
    if (score > rushHighScore) {
      setRushHighScore(score);
      try { localStorage.setItem(RUSH_HIGHSCORE_KEY, String(score)); } catch {}
    }
    addLeagueXP(Math.round(score / 20));
  };

  const damageCommunityBoss = (minutes) => {
    setCommunityBoss(prev => ({
      ...prev,
      currentHp: Math.max(0, prev.currentHp - minutes)
    }));
    addLeagueXP(minutes);
  };

  return (
    <StudyRoomsContext.Provider value={{
      // Guilds (Clans)
      guilds,
      myGuild,
      myGuildId,
      createGuild,
      joinGuildByCode,
      leaveGuild,
      regenerateGuildCode,
      sendGuildMessage,

      // CoC Leagues & Trophies
      userTrophies,
      currentLeague,
      leagueProgress,
      warStars,
      allLeagues: COC_LEAGUES,
      completeGauntletMatch,

      // Squad compatibility
      squads: guilds,
      rooms: guilds,
      activeRoomSession,
      activeTimeLeft,
      isSessionCompleted,
      createSquad: createGuild,
      createRoom: createGuild,
      findSquadByCode: (code) => guilds.find(g => g.code?.toUpperCase() === code?.trim()?.toUpperCase()),
      joinSquadRoom,
      joinRoom: joinSquadRoom,
      leaveSquadRoom,
      leaveRoom: leaveSquadRoom,
      addMessageToActiveRoom,

      // Arena & Gamification
      userElo,
      winStreak,
      leagueXp,
      rushHighScore,
      communityBoss,
      leaderboard,
      updateElo,
      addLeagueXP,
      recordRushScore,
      damageCommunityBoss
    }}>
      {children}
    </StudyRoomsContext.Provider>
  );
}

export const useStudyRooms = () => {
  const ctx = useContext(StudyRoomsContext);
  if (!ctx) throw new Error('useStudyRooms must be used within StudyRoomsProvider');
  return ctx;
};
