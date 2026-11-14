import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { usePomodoro } from '../../context/PomodoroContext';
import { useStudyRooms } from '../../context/StudyRoomsContext';
import { useAI } from '../../context/AIContext';
import { Moon, Sun, ChevronDown, LogOut, Sparkles, User, BookOpen, BarChart3, Key } from 'lucide-react';
import Logo from '../ui/Logo';
import UserAvatar from '../ui/UserAvatar';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, setShowLogin, setShowSignup } = useAuth();
  const { hasCustomKey, setShowAISettingsModal } = useAI();
  const { isRunning, timeLeft, currentSubject, mode } = usePomodoro();
  const { activeRoomSession, activeTimeLeft } = useStudyRooms();
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isOnRoomsPage = location.pathname === '/rooms';

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const navLinks = [
    { name: 'Pomodoro', path: '/pomodoro' },
    { name: 'Guilds & Arena', path: '/rooms' },
    { name: 'AI Revision', path: '/revision', badge: '12 Due' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[rgb(var(--color-surface))]/90 backdrop-blur-xl border-b border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left Section: Brand Logo & Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <Logo className="w-8 h-8 rounded-lg shadow-md shadow-[#18181B]/25 group-hover:scale-105 transition-transform shrink-0" />
            <span className="font-bold text-lg tracking-tight text-[rgb(var(--color-text))] whitespace-nowrap">
              Rivisonly
            </span>
          </Link>

          {/* Desktop Nav Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink-0">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[rgb(var(--color-container))] text-[#9e3c26] dark:text-[#ffb4a3] font-semibold shadow-xs'
                      : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))]'
                  }`
                }
              >
                <span className="whitespace-nowrap">{link.name}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] border border-[rgb(var(--color-secondary))]/20 whitespace-nowrap shrink-0">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right side controls: Live Timer Pill, Theme toggle, Auth / Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Synchronized Live Session Pill (Shows active room pill when away from /rooms; otherwise standard single Pomodoro pill) */}
          {activeRoomSession && !isOnRoomsPage ? (
            <Link
              to="/rooms"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-700 dark:text-emerald-300 shadow-xs hover:border-emerald-500 transition-colors whitespace-nowrap shrink-0"
              title={`Active Study Room: ${activeRoomSession.room?.name || 'Study Hall'} • ${String(Math.floor(activeTimeLeft / 60)).padStart(2, '0')}:${String(activeTimeLeft % 60).padStart(2, '0')} remaining`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-semibold truncate max-w-[85px] sm:max-w-[120px]">
                {activeRoomSession.room?.name || 'Study Room'}
              </span>
              <span className="text-[rgb(var(--color-muted))]">•</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {String(Math.floor(activeTimeLeft / 60)).padStart(2, '0')}:{String(activeTimeLeft % 60).padStart(2, '0')}
              </span>
            </Link>
          ) : (
            <Link
              to="/pomodoro"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-text))] shadow-xs hover:border-[rgb(var(--color-primary))]/50 transition-colors whitespace-nowrap shrink-0"
              title={`${currentSubject?.name || 'Focus'} • ${formattedTime} (${isRunning ? 'Running' : 'Paused'})`}
            >
              <span 
                className={`w-2 h-2 rounded-full shrink-0 ${isRunning ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: currentSubject?.color || '#9e3c26' }}
              />
              <span className="font-semibold truncate max-w-[110px]">{currentSubject?.name || 'Focus'}</span>
              <span className="text-[rgb(var(--color-muted))]">•</span>
              <span className="text-[rgb(var(--color-primary))] font-medium">{formattedTime}</span>
              <span className="text-[10px] text-[rgb(var(--color-muted))]">{isRunning ? '▶' : '⏸'}</span>
            </Link>
          )}

          {/* AI Quota & Settings Pill */}
          <button
            onClick={() => setShowAISettingsModal(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              hasCustomKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-[rgb(var(--color-container-low))] border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
            }`}
            title="Gemini AI Quota Settings"
          >
            <Sparkles size={13} className={hasCustomKey ? 'text-emerald-500' : 'text-[#9e3c26] dark:text-[#ffb4a3]'} />
            <span className="hidden sm:inline font-mono text-[11px]">
              {hasCustomKey ? 'AI: Personal' : 'AI: Free'}
            </span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] border border-transparent hover:border-[rgb(var(--color-border))] transition-colors cursor-pointer shrink-0"
            aria-label="Toggle light/dark theme"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={17} className="text-[#ffb4a3]" /> : <Moon size={17} className="text-[rgb(var(--color-text))]" />}
          </button>

          {/* Auth State */}
          {user ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2.5 p-1 rounded-full bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-container))] transition-colors cursor-pointer shrink-0"
              >
                <div className="relative shrink-0">
                  <UserAvatar
                    src={user.avatar}
                    name={user.name || 'Scholar'}
                    className="w-7 h-7 rounded-full border border-[rgb(var(--color-border))]"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[rgb(var(--color-card))]" />
                </div>
                <div className="hidden lg:block text-left pr-1.5 whitespace-nowrap shrink-0">
                  <div className="text-[11px] font-bold leading-tight text-[rgb(var(--color-secondary))] whitespace-nowrap">
                    Focus Mode Active
                  </div>
                  <div className="text-[10px] font-mono text-[rgb(var(--color-muted))] whitespace-nowrap">
                    Lv. {user.level ?? 1} {user.title || 'Scholar'}
                  </div>
                </div>
                <ChevronDown size={13} className="text-[rgb(var(--color-muted))] hidden lg:inline mr-1 shrink-0" />
              </button>

              {userDropdown && (
                <>
                  {/* Backdrop to close dropdown on click outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setUserDropdown(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xl p-2 z-50 animate-fade-in-up">
                    {/* User Header / Profile Clickable Preview */}
                    <button
                      onClick={() => { navigate('/profile'); setUserDropdown(false); }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[rgb(var(--color-container-low))] transition-colors border-b border-[rgb(var(--color-border))] group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserAvatar
                          src={user.avatar}
                          name={user.name || 'Scholar'}
                          className="w-9 h-9 rounded-full border border-[rgb(var(--color-border))]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-[rgb(var(--color-text))] truncate group-hover:text-[rgb(var(--color-primary))] transition-colors">
                              {user.name}
                            </p>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))] shrink-0">
                              Lv. {user.level ?? 1}
                            </span>
                          </div>
                          <p className="text-[11px] text-[rgb(var(--color-muted))] truncate mt-0.5">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] text-[10px] font-mono font-medium">
                        <Sparkles size={11} />
                        <span>Elo: {user.eloRating ?? 1200} • Streak: {user.streak ?? 1}d</span>
                      </div>
                    </button>

                    {/* Navigation Menu Options */}
                    <div className="py-1.5 space-y-0.5">
                      <button
                        onClick={() => { navigate('/profile'); setUserDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-[rgb(var(--color-container-low))] flex items-center justify-between transition-colors cursor-pointer group ${
                          location.pathname === '/profile'
                            ? 'bg-[rgb(var(--color-container))] font-semibold text-[rgb(var(--color-primary))]'
                            : 'text-[rgb(var(--color-text))]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <User size={15} className="text-[rgb(var(--color-primary))]" />
                          <span>User Profile</span>
                        </div>
                        <span className="text-[10px] text-[rgb(var(--color-muted))] font-mono opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                      </button>

                      <button
                        onClick={() => { navigate('/notes'); setUserDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-[rgb(var(--color-container-low))] flex items-center justify-between transition-colors cursor-pointer group ${
                          location.pathname === '/notes'
                            ? 'bg-[rgb(var(--color-container))] font-semibold text-[rgb(var(--color-primary))]'
                            : 'text-[rgb(var(--color-text))]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <BookOpen size={15} className="text-[rgb(var(--color-secondary))]" />
                          <span>Notes Vault</span>
                        </div>
                        <span className="text-[10px] text-[rgb(var(--color-muted))] font-mono opacity-0 group-hover:opacity-100 transition-opacity">Vault</span>
                      </button>

                      <button
                        onClick={() => { navigate('/analytics'); setUserDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-[rgb(var(--color-container-low))] flex items-center justify-between transition-colors cursor-pointer group ${
                          location.pathname === '/analytics'
                            ? 'bg-[rgb(var(--color-container))] font-semibold text-[rgb(var(--color-primary))]'
                            : 'text-[rgb(var(--color-text))]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <BarChart3 size={15} className="text-amber-600 dark:text-amber-400" />
                          <span>Analytics</span>
                        </div>
                        <span className="text-[10px] text-[rgb(var(--color-muted))] font-mono opacity-0 group-hover:opacity-100 transition-opacity">Stats</span>
                      </button>

                      <button
                        onClick={() => { setShowAISettingsModal(true); setUserDropdown(false); }}
                        className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-[rgb(var(--color-container-low))] flex items-center justify-between text-[rgb(var(--color-text))] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Sparkles size={15} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                          <span>Gemini AI Quota</span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[rgb(var(--color-container))] text-[rgb(var(--color-muted))]">
                          {hasCustomKey ? 'Personal' : 'Free Tier'}
                        </span>
                      </button>

                      <div className="my-1 border-t border-[rgb(var(--color-border))]" />

                      <button
                        onClick={() => { logout(); setUserDropdown(false); }}
                        className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[rgb(var(--color-primary))] hover:brightness-95 text-white shadow-sm shadow-[rgb(var(--color-primary))]/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}

        </div>
      </div>

      {/* Mobile Nav Links Strip */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-[rgb(var(--color-border))] text-[11px] overflow-x-auto bg-[rgb(var(--color-surface))]">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `px-2.5 py-1 rounded-md whitespace-nowrap ${
                isActive ? 'bg-[rgb(var(--color-primary))] text-white font-medium' : 'text-[rgb(var(--color-muted))]'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
