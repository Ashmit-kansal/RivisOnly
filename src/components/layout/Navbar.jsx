import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { usePomodoro } from '../../context/PomodoroContext';
import { Moon, Sun, ChevronDown, LogOut, Sparkles } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, setShowLogin, setShowSignup } = useAuth();
  const { isRunning, timeLeft, currentSubject, mode } = usePomodoro();
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const navLinks = [
    { name: 'Pomodoro', path: '/pomodoro' },
    { name: 'Study Rooms', path: '/rooms' },
    { name: 'Notes Vault', path: '/notes' },
    { name: 'AI Revision', path: '/revision', badge: '12 Due' },
    { name: 'Analytics', path: '/analytics' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[rgb(var(--color-surface))]/90 backdrop-blur-xl border-b border-[rgb(var(--color-border))] shadow-[0_1px_8px_rgba(20,27,43,0.04)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <Logo className="w-8 h-8 rounded-lg shadow-md shadow-[#18181B]/25 group-hover:scale-105 transition-transform" />
          <span className="font-bold text-lg tracking-tight text-[rgb(var(--color-text))]">
            Rivisonly
          </span>
        </Link>

        {/* Desktop Nav Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-[rgb(var(--color-container))] text-[#9e3c26] dark:text-[#ffb4a3] font-semibold shadow-xs'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))]'
                }`
              }
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[rgb(var(--color-secondary-container))] text-[rgb(var(--color-secondary))] border border-[rgb(var(--color-secondary))]/20">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right side controls: Live Timer Pill, Theme toggle, Auth / Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Synchronized Live Session pill */}
          <Link
            to="/pomodoro"
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-text))] shadow-xs hover:border-[rgb(var(--color-primary))]/50 transition-colors"
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

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] border border-transparent hover:border-[rgb(var(--color-border))] transition-colors cursor-pointer"
            aria-label="Toggle light/dark theme"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={17} className="text-[#ffb4a3]" /> : <Moon size={17} className="text-[rgb(var(--color-text))]" />}
          </button>

          {/* Auth State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2.5 p-1 rounded-full bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-container))] transition-colors cursor-pointer"
              >
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'Scholar'}
                      className="w-7 h-7 rounded-full object-cover border border-[rgb(var(--color-border))]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[rgb(var(--color-primary))] to-orange-500 text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs">
                      {user.name ? user.name.trim().charAt(0) : 'S'}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[rgb(var(--color-card))]" />
                </div>
                <div className="hidden lg:block text-left pr-1.5">
                  <div className="text-[11px] font-bold leading-tight text-[rgb(var(--color-secondary))]">
                    Focus Mode Active
                  </div>
                  <div className="text-[10px] font-mono text-[rgb(var(--color-muted))]">
                    Lv. {user.level ?? 1} {user.title || 'Scholar'}
                  </div>
                </div>
                <ChevronDown size={13} className="text-[rgb(var(--color-muted))] hidden lg:inline mr-1" />
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xl p-2 z-50 animate-fade-in-up">
                  <div className="p-2.5 border-b border-[rgb(var(--color-border))]">
                    <p className="text-xs font-bold text-[rgb(var(--color-text))]">{user.name}</p>
                    <p className="text-[11px] text-[rgb(var(--color-muted))] truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] text-[10px] font-mono font-medium">
                      <Sparkles size={11} />
                      <span>Elo: {user.eloRating ?? 1200} • Streak: {user.streak ?? 1}d</span>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { navigate('/analytics'); setUserDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-[rgb(var(--color-container-low))] flex items-center gap-2"
                    >
                      <span>Scholar Performance</span>
                    </button>
                    <button
                      onClick={() => { logout(); setUserDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLogin(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-low))] transition-colors cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[rgb(var(--color-primary))] hover:brightness-95 text-white shadow-sm shadow-[rgb(var(--color-primary))]/20 transition-all cursor-pointer"
              >
                Sign up
              </button>
            </div>
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
