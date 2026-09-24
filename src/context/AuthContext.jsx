import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEMO_USER = {
  id: 'u_demo_arjun',
  name: 'Arjun Sharma',
  username: 'arjun_scholar',
  email: 'arjun@rivisonly.app',
  password: 'password123',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  level: 14,
  title: 'Senior Scholar',
  subjects: ['Organic Chemistry II', 'Linear Algebra', 'Cognitive Neuroscience', 'Macroeconomics'],
  eloRating: 1840,
  streak: 19,
  joinedAt: '2024-09-01',
};

const USERS_STORAGE_KEY = 'rivisonly-users';
const ACTIVE_USER_STORAGE_KEY = 'rivisonly-active-user';

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const initial = [DEMO_USER];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    // Ensure demo user is always present
    if (!parsed.some(u => u.email.toLowerCase() === DEMO_USER.email.toLowerCase())) {
      parsed.unshift(DEMO_USER);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.warn('Failed to load registered users from localStorage', e);
    return [DEMO_USER];
  }
}

function getStoredActiveUser() {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(getStoredUsers);
  const [user, setUser] = useState(getStoredActiveUser);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Sync active user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save active user', e);
    }
  }, [user]);

  // Sync users registry to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save users registry', e);
    }
  }, [users]);

  // LOGIN: authenticates against stored users registry
  const login = async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    if (!trimmedEmail) {
      return { success: false, error: 'Please enter your academic email.' };
    }
    if (!trimmedPassword) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Special quick shortcut for demo credentials
    if (trimmedEmail === DEMO_USER.email.toLowerCase() && (trimmedPassword === 'demo' || trimmedPassword === DEMO_USER.password)) {
      setUser(DEMO_USER);
      setShowLogin(false);
      return { success: true, user: DEMO_USER };
    }

    // Search registered users
    const matchedUser = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!matchedUser) {
      return { 
        success: false, 
        error: 'No account registered with this email. Please check your spelling or create a new account.' 
      };
    }

    if (matchedUser.password && matchedUser.password !== trimmedPassword) {
      return { 
        success: false, 
        error: 'Incorrect password. Please verify and try again.' 
      };
    }

    // Login successful
    setUser(matchedUser);
    setShowLogin(false);
    return { success: true, user: matchedUser };
  };

  // SIGNUP: registers custom user profile
  const signup = async (data) => {
    const name = (data.name || '').trim();
    const email = (data.email || '').trim().toLowerCase();
    const password = (data.password || '').trim();
    const subjectPreference = data.subjectPreference || 'Organic Chemistry II';

    if (!name || name.length < 2) {
      return { success: false, error: 'Please enter your full name (at least 2 characters).' };
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      return { success: false, error: 'Please provide a valid academic email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Check if email already registered
    const exists = users.some(u => u.email.toLowerCase() === email);
    if (exists) {
      return { 
        success: false, 
        error: 'An account with this email address already exists. Please sign in instead.' 
      };
    }

    const newUser = {
      id: 'u_' + Date.now(),
      name,
      username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') || 'scholar',
      email,
      password,
      avatar: null,
      level: 1,
      title: 'Novice Scholar',
      subjects: [subjectPreference, 'Linear Algebra', 'Cognitive Neuroscience'],
      eloRating: 1200,
      streak: 1,
      joinedAt: new Date().toISOString().split('T')[0],
      totalFocusHrs: 0,
      duelsWon: 0,
      duelsTotal: 0,
    };

    setUsers(prev => [newUser, ...prev]);
    setUser(newUser);
    setShowSignup(false);
    return { success: true, user: newUser };
  };

  // INSTANT DEMO LOGIN
  const loginAsDemo = () => {
    setUser(DEMO_USER);
    setShowLogin(false);
    setShowSignup(false);
    return { success: true, user: DEMO_USER };
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear active user', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      login,
      signup,
      loginAsDemo,
      logout,
      showLogin,
      setShowLogin,
      showSignup,
      setShowSignup,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
