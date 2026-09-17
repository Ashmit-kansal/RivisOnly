import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PomodoroProvider } from './context/PomodoroContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LofiPlayer from './components/lofi/LofiPlayer';
import LoginModal from './components/auth/LoginModal';
import SignupModal from './components/auth/SignupModal';

import Landing from './pages/Landing';
import Pomodoro from './pages/Pomodoro';
import StudyRooms from './pages/StudyRooms';
import NotesVault from './pages/NotesVault';
import Revision from './pages/Revision';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PomodoroProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] transition-colors selection:bg-[rgb(var(--color-primary))]/20 selection:text-[rgb(var(--color-primary))]">
              {/* Global Sticky Navbar */}
              <Navbar />

            {/* Main Content View */}
            <main className="flex-1 pb-6">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/pomodoro" element={<Pomodoro />} />
                <Route path="/dashboard" element={<Navigate to="/pomodoro" replace />} />
                <Route path="/rooms" element={<StudyRooms />} />
                <Route path="/notes" element={<NotesVault />} />
                <Route path="/revision" element={<Revision />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </main>

            {/* Architectural Footer */}
            <Footer />

            {/* Floating Collapsible Lo-Fi Player */}
            <LofiPlayer />

            {/* Global Auth Modals */}
            <LoginModal />
            <SignupModal />
          </div>
        </BrowserRouter>
      </PomodoroProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}
