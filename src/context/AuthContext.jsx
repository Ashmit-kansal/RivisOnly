import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
  firebaseInitError
} from '../config/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';

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
    if (!raw || raw === 'guest' || raw === 'null') return null;
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.id === 'u_demo_arjun' || parsed.email === 'arjun@rivisonly.app')) {
      localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(getStoredUsers);
  const [user, setUser] = useState(getStoredActiveUser);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [driveToken, setDriveToken] = useState(() => {
    try {
      return sessionStorage.getItem('rivisonly_google_drive_token') || null;
    } catch {
      return null;
    }
  });

  // Sync active user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.setItem(ACTIVE_USER_STORAGE_KEY, 'guest');
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

  // Real-time Firebase Auth state listener
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(prev => {
          const baseName = firebaseUser.displayName || prev?.name || 'Scholar';
          return {
            id: firebaseUser.uid,
            name: baseName,
            username: (firebaseUser.email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') || 'scholar',
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL || prev?.avatar || null,
            level: prev?.level ?? 1,
            title: prev?.title || 'Scholar',
            subjects: prev?.subjects || ['Organic Chemistry II', 'Linear Algebra', 'Cognitive Neuroscience'],
            eloRating: prev?.eloRating ?? 1200,
            streak: prev?.streak ?? 1,
            joinedAt: prev?.joinedAt || new Date().toISOString().split('T')[0],
            isFirebase: true,
          };
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // 1. LOGIN WITH GOOGLE (POPUP)
  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      const msg = firebaseInitError 
        ? `Firebase initialization error: ${firebaseInitError}` 
        : 'Firebase keys in .env were not detected by Vite. Ensure all variable names start with "VITE_FIREBASE_" and restart the server.';
      return { 
        success: false, 
        error: msg 
      };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleToken = credential?.accessToken;
      if (googleToken) {
        setDriveToken(googleToken);
        try {
          sessionStorage.setItem('rivisonly_google_drive_token', googleToken);
        } catch {
          // ignore
        }
      }

      const fbUser = result.user;
      const scholar = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Google Scholar',
        username: (fbUser.email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') || 'scholar',
        email: fbUser.email,
        avatar: fbUser.photoURL,
        level: 1,
        title: 'Scholar',
        subjects: ['Organic Chemistry II', 'Linear Algebra', 'Cognitive Neuroscience'],
        eloRating: 1200,
        streak: 1,
        joinedAt: new Date().toISOString().split('T')[0],
        isFirebase: true,
      };

      setUser(scholar);
      setShowLogin(false);
      setShowSignup(false);
      return { success: true, user: scholar };
    } catch (err) {
      console.error('Google Sign-in failed:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Google sign-in popup was closed before completion.' };
      }
      if (err.code === 'auth/unauthorized-domain') {
        return { 
          success: false, 
          error: `This domain (${window.location.hostname}) is not authorized in Firebase yet. Add "${window.location.hostname}" in Firebase Console -> Authentication -> Settings -> Authorized Domains.` 
        };
      }
      return { success: false, error: err.message || 'Google authentication failed.' };
    }
  };

  // 2. EXPLICIT GOOGLE DRIVE AUTHORIZATION
  const requestDriveAccess = async () => {
    if (!auth) {
      return { success: false, error: 'Firebase is not initialized.' };
    }
    try {
      const driveProvider = new GoogleAuthProvider();
      driveProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
      driveProvider.addScope('https://www.googleapis.com/auth/drive.file');
      driveProvider.setCustomParameters({ prompt: 'consent' });
      const result = await signInWithPopup(auth, driveProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      if (token) {
        setDriveToken(token);
        try {
          sessionStorage.setItem('rivisonly_google_drive_token', token);
        } catch {}
        return { success: true, token };
      }
      return { success: false, error: 'No Google Drive token was received.' };
    } catch (err) {
      console.error('Drive access request failed:', err);
      if (err.code === 'auth/unauthorized-domain') {
        return { 
          success: false, 
          error: `Domain "${window.location.hostname}" is not authorized. Add it to Firebase Console -> Authentication -> Settings -> Authorized Domains.` 
        };
      }
      return { success: false, error: err.message || 'Failed to connect Google Drive.' };
    }
  };

  // 3. EMAIL & PASSWORD LOGIN
  const login = async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    if (!trimmedEmail) return { success: false, error: 'Please enter your academic email.' };
    if (!trimmedPassword) return { success: false, error: 'Please enter your password.' };

    // If Firebase configured, authenticate with Firebase
    if (isFirebaseConfigured && auth) {
      try {
        const res = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        const fbUser = res.user;
        const scholar = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Scholar',
          username: trimmedEmail.split('@')[0],
          email: fbUser.email,
          avatar: fbUser.photoURL,
          level: 1,
          title: 'Scholar',
          subjects: ['Organic Chemistry II', 'Linear Algebra'],
          eloRating: 1200,
          streak: 1,
          isFirebase: true,
        };
        setUser(scholar);
        setShowLogin(false);
        return { success: true, user: scholar };
      } catch (err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          return { success: false, error: 'Invalid email or password.' };
        }
        if (err.code === 'auth/wrong-password') {
          return { success: false, error: 'Incorrect password.' };
        }
        return { success: false, error: err.message || 'Login failed.' };
      }
    }

    // Fallback local storage auth
    const matchedUser = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!matchedUser) {
      return { success: false, error: 'No account registered with this email.' };
    }
    if (matchedUser.password && matchedUser.password !== trimmedPassword) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    setUser(matchedUser);
    setShowLogin(false);
    return { success: true, user: matchedUser };
  };

  // 3. SIGNUP
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

    if (isFirebaseConfigured && auth) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });

        const newUser = {
          id: res.user.uid,
          name,
          username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') || 'scholar',
          email,
          avatar: null,
          level: 1,
          title: 'Novice Scholar',
          subjects: [subjectPreference, 'Linear Algebra', 'Cognitive Neuroscience'],
          eloRating: 1200,
          streak: 1,
          joinedAt: new Date().toISOString().split('T')[0],
          isFirebase: true,
        };
        setUser(newUser);
        setShowSignup(false);
        return { success: true, user: newUser };
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          return { success: false, error: 'An account with this email address already exists.' };
        }
        return { success: false, error: err.message || 'Signup failed.' };
      }
    }

    // Fallback local storage
    const exists = users.some(u => u.email.toLowerCase() === email);
    if (exists) {
      return { success: false, error: 'An account with this email address already exists.' };
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

  // 4. LOGOUT
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Firebase signOut error:', err);
      }
    }
    setUser(null);
    setDriveToken(null);
    try {
      sessionStorage.removeItem('rivisonly_google_drive_token');
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, 'guest');
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
      loginWithGoogle,
      requestDriveAccess,
      logout,
      showLogin,
      setShowLogin,
      showSignup,
      setShowSignup,
      driveToken,
      isFirebaseConfigured,
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
