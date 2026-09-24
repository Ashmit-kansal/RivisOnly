import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { mockRooms } from '../data/mockRooms';

const StudyRoomsContext = createContext(null);

const ROOMS_STORAGE_KEY = 'rivisonly-study-rooms';
const ACTIVE_ROOM_SESSION_KEY = 'rivisonly-active-room-session';

function getStoredRooms() {
  try {
    const raw = localStorage.getItem(ROOMS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(mockRooms));
      return mockRooms;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockRooms;
  } catch {
    return mockRooms;
  }
}

function getStoredActiveRoomSession() {
  try {
    const raw = localStorage.getItem(ACTIVE_ROOM_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.room || !session.targetEndTime) return null;
    
    // If the saved session has already completed in the past, clean it up
    if (session.targetEndTime <= Date.now()) {
      localStorage.removeItem(ACTIVE_ROOM_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function StudyRoomsProvider({ children }) {
  const [rooms, setRooms] = useState(getStoredRooms);
  const [activeRoomSession, setActiveRoomSession] = useState(getStoredActiveRoomSession);
  const [activeTimeLeft, setActiveTimeLeft] = useState(() => {
    const initialSession = getStoredActiveRoomSession();
    if (!initialSession) return 0;
    const ms = initialSession.targetEndTime - Date.now();
    return Math.max(0, Math.ceil(ms / 1000));
  });
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);

  // Sync rooms list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
    } catch (e) {
      console.warn('Failed to save rooms to localStorage', e);
    }
  }, [rooms]);

  // Sync active room session to localStorage
  useEffect(() => {
    try {
      if (activeRoomSession) {
        localStorage.setItem(ACTIVE_ROOM_SESSION_KEY, JSON.stringify(activeRoomSession));
      } else {
        localStorage.removeItem(ACTIVE_ROOM_SESSION_KEY);
      }
    } catch (e) {
      console.warn('Failed to save active room session', e);
    }
  }, [activeRoomSession]);

  // Global Countdown Ticker: accurate across page navigation
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

  // JOIN ROOM ACTION
  const joinRoom = (room, committedMinutes, currentUser) => {
    const totalSecs = (committedMinutes || 25) * 60;
    const targetEndTime = Date.now() + (totalSecs * 1000);

    const userName = currentUser ? `${currentUser.name} (You)` : 'Guest Scholar (You)';
    const userAvatar = currentUser?.avatar || null;
    const userLevel = currentUser?.level ?? 1;
    const userTitle = currentUser?.title || 'Scholar';

    // Ensure user is in room members
    const existingMembers = room.members || [];
    const hasMe = existingMembers.some(m => m.id === 'me');
    const updatedMembers = hasMe ? existingMembers : [
      {
        id: 'me',
        name: userName,
        avatar: userAvatar,
        level: userLevel,
        school: userTitle,
        studyTime: committedMinutes,
        status: 'Focusing',
        isYou: true
      },
      ...existingMembers
    ];

    const updatedRoom = {
      ...room,
      members: updatedMembers
    };

    const initialMessages = room.messages || [];
    const session = {
      roomId: room.id,
      room: updatedRoom,
      committedMinutes,
      targetEndTime,
      startedAt: Date.now(),
      messages: [
        ...initialMessages,
        {
          id: `sys-enter-${Date.now()}`,
          sender: 'System',
          text: `You joined ${room.name} and locked in for a ${committedMinutes}m focus sprint.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true
        }
      ]
    };

    // Update rooms list with updated room
    setRooms(prev => prev.map(r => r.id === room.id ? updatedRoom : r));
    setActiveTimeLeft(totalSecs);
    setIsSessionCompleted(false);
    setActiveRoomSession(session);
  };

  // EXIT / LEAVE ROOM ACTION
  const leaveRoom = () => {
    setActiveRoomSession(null);
    setIsSessionCompleted(false);
    setActiveTimeLeft(0);
    try {
      localStorage.removeItem(ACTIVE_ROOM_SESSION_KEY);
    } catch (e) {
      console.warn('Failed to clear active room session', e);
    }
  };

  // APPEND CHAT MESSAGE TO ACTIVE ROOM
  const addMessageToActiveRoom = (msg) => {
    setActiveRoomSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...(prev.messages || []), msg]
      };
    });
  };

  // CREATE ROOM
  const createRoom = (newRoom) => {
    setRooms(prev => [newRoom, ...prev]);
  };

  return (
    <StudyRoomsContext.Provider value={{
      rooms,
      activeRoomSession,
      activeTimeLeft,
      isSessionCompleted,
      joinRoom,
      leaveRoom,
      addMessageToActiveRoom,
      createRoom,
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
