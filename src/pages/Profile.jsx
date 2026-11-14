import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UserAvatar from '../components/ui/UserAvatar';
import {
  User, Mail, Sparkles, Trophy, Flame, Clock, Brain,
  BookOpen, BarChart3, ShieldCheck, Award, CheckCircle2,
  Calendar, ArrowRight, GraduationCap, Zap, LogIn
} from 'lucide-react';

export default function Profile() {
  const { user: authUser, setShowLogin } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // If not logged in, prompt to authenticate
  if (!authUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] flex items-center justify-center shadow-inner">
          <User size={32} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text))]">
            Sign In to View Profile
          </h2>
          <p className="text-xs text-[rgb(var(--color-muted))] max-w-sm mx-auto leading-relaxed">
            Connect with your Google account to track your academic Elo, study streaks, and sync your notes repository.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2.5 rounded-xl bg-[rgb(var(--color-primary))] hover:brightness-105 text-white text-xs font-semibold shadow-md shadow-[rgb(var(--color-primary))]/20 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <LogIn size={15} />
            <span>Sign In to Rivisonly</span>
          </button>
        </div>
      </div>
    );
  }

  // Real scholar profile from authentication
  const profile = {
    id: authUser.id,
    name: authUser.name || 'Scholar',
    username: authUser.username || authUser.email?.split('@')[0] || 'scholar',
    email: authUser.email || 'No email provided',
    avatar: authUser.avatar || null,
    level: authUser.level ?? 1,
    title: authUser.title || 'Scholar',
    eloRating: authUser.eloRating ?? 1200,
    streak: authUser.streak ?? 1,
    joinedAt: authUser.joinedAt || 'Active Session',
    subjects: authUser.subjects?.length ? authUser.subjects : ['Organic Chemistry II', 'Linear Algebra', 'Cognitive Neuroscience', 'Macroeconomics'],
    totalFocusHrs: authUser.totalFocusHrs ?? 0,
    focusCycles: authUser.focusCycles ?? 0,
    duelsWon: authUser.duelsWon ?? 0,
    duelsTotal: authUser.duelsTotal ?? 0,
    retentionRate: authUser.retentionRate ?? 90,
  };

  const achievements = [
    {
      id: 'a1',
      title: 'Deep Work Master',
      desc: 'Completed over 150 hours of synchronized focus time.',
      icon: Clock,
      unlocked: true,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      date: 'Earned 3 days ago'
    },
    {
      id: 'a2',
      title: 'Duel Grandmaster',
      desc: 'Achieved an 85%+ win rate across 40 academic quiz duels.',
      icon: Trophy,
      unlocked: true,
      color: 'text-[#9e3c26] dark:text-[#ffb4a3] bg-[#9e3c26]/10 border-[#9e3c26]/20',
      date: 'Earned 1 week ago'
    },
    {
      id: 'a3',
      title: 'Consistency Virtuoso',
      desc: 'Maintained a daily revision streak of consecutive study.',
      icon: Flame,
      unlocked: true,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      date: 'Active Streak'
    },
    {
      id: 'a4',
      title: 'Memory Synthesizer',
      desc: 'Retained 90%+ spaced repetition recall across concepts.',
      icon: Brain,
      unlocked: true,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      date: 'Current Cycle'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-[rgb(var(--color-border))]/60">
        <div>
          <div className="text-[10px] font-mono tracking-widest uppercase text-[rgb(var(--color-muted))] flex items-center gap-1.5 mb-1 font-semibold">
            <span>SCHOLAR PORTAL</span>
            <span>•</span>
            <span className="text-[#9e3c26] dark:text-[#ffb4a3] font-bold">USER PROFILE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--color-text))]">
            Academic Scholar Profile
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/analytics')}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-xs font-medium text-[rgb(var(--color-text))] transition-colors cursor-pointer"
          >
            <BarChart3 size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
            <span>View Analytics</span>
          </button>
          <button
            onClick={() => navigate('/notes')}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-xs font-medium text-[rgb(var(--color-text))] transition-colors cursor-pointer"
          >
            <BookOpen size={14} className="text-[rgb(var(--color-secondary))]" />
            <span>Notes Vault</span>
          </button>
        </div>
      </div>

      {/* Hero Scholar Profile Card */}
      <div className="rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[rgb(var(--color-primary))]/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Status Badge */}
          <div className="relative shrink-0">
            <UserAvatar
              src={profile.avatar}
              name={profile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-[rgb(var(--color-border))] shadow-md"
            />
            <span 
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[rgb(var(--color-card))] shadow-xs" 
              title="Online • Focus Mode Active"
            />
          </div>

          {/* Core User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text))]">
                {profile.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))]/20">
                Lv. {profile.level} {profile.title}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Focus Mode
              </span>
            </div>

            <p className="text-xs sm:text-sm font-mono text-[rgb(var(--color-muted))] flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span>@{profile.username}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail size={13} />
                {profile.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                Joined {profile.joinedAt}
              </span>
            </p>

            <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] pt-1 max-w-2xl leading-relaxed">
              Academic scholar enrolled in spaced repetition focus cycles, collaborative study rooms, and active recall duels.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-[11px] font-mono text-[rgb(var(--color-text))] font-medium">
                Focus Cycles: <strong>{profile.focusCycles}</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-[11px] font-mono text-[rgb(var(--color-text))] font-medium">
                Duels Won: <strong>{profile.duelsWon}/{profile.duelsTotal}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Scholar Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Elo Rating */}
        <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[rgb(var(--color-muted))] text-xs font-mono">
            <span>ELO RATING</span>
            <Trophy size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-[rgb(var(--color-text))] tracking-tight">
            {profile.eloRating}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            Active Competitor
          </div>
        </div>

        {/* Daily Streak */}
        <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[rgb(var(--color-muted))] text-xs font-mono">
            <span>ACTIVE STREAK</span>
            <Flame size={16} className="text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-[rgb(var(--color-text))] tracking-tight">
            {profile.streak} <span className="text-sm font-normal text-[rgb(var(--color-muted))]">Days</span>
          </div>
          <div className="text-[11px] font-mono text-orange-600 dark:text-orange-400">
            Daily consistency active
          </div>
        </div>

        {/* Deep Focus Hours */}
        <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[rgb(var(--color-muted))] text-xs font-mono">
            <span>TOTAL FOCUS</span>
            <Clock size={16} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
          </div>
          <div className="text-2xl font-bold text-[rgb(var(--color-text))] tracking-tight">
            {profile.totalFocusHrs} <span className="text-sm font-normal text-[rgb(var(--color-muted))]">hrs</span>
          </div>
          <div className="text-[11px] font-mono text-[rgb(var(--color-muted))]">
            Focus studio tracked
          </div>
        </div>

        {/* Retention Mastery */}
        <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[rgb(var(--color-muted))] text-xs font-mono">
            <span>RETENTION RATE</span>
            <Brain size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-[rgb(var(--color-text))] tracking-tight">
            {profile.retentionRate}%
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            Spaced repetition mastery
          </div>
        </div>
      </div>

      {/* Main Grid: Enrolled Subjects & Scholar Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Enrolled Academic Courses */}
        <div className="lg:col-span-2 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
                Active Enrolled Courses & Mastery
              </h3>
              <p className="text-xs text-[rgb(var(--color-muted))] mt-0.5">
                Current semester subjects tracked across Notes Vault and AI Revision.
              </p>
            </div>
            <button
              onClick={() => navigate('/notes')}
              className="text-xs font-mono text-[#9e3c26] dark:text-[#ffb4a3] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Notes</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-4">
            {profile.subjects.map((subj, idx) => {
              const masteryScores = [92, 88, 85, 80];
              const score = masteryScores[idx % masteryScores.length];

              return (
                <div 
                  key={subj}
                  className="p-4 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                      <span className="font-semibold text-xs sm:text-sm text-[rgb(var(--color-text))]">
                        {subj}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="font-bold text-[#9e3c26] dark:text-[#ffb4a3]">{score}% mastery</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[rgb(var(--color-container))] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[rgb(var(--color-primary))] to-amber-500 transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Scholar Achievements & Quick Links */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[rgb(var(--color-text))] flex items-center gap-2">
                <Award size={18} className="text-amber-500" />
                <span>Earned Badges</span>
              </h3>
              <span className="text-xs font-mono text-[rgb(var(--color-muted))]">4 / 4</span>
            </div>

            <div className="space-y-3">
              {achievements.map((ach) => {
                const IconComponent = ach.icon;
                return (
                  <div 
                    key={ach.id}
                    className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-lg border shrink-0 ${ach.color}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[rgb(var(--color-text))] truncate">{ach.title}</p>
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                      </div>
                      <p className="text-[11px] text-[rgb(var(--color-muted))] leading-tight mt-0.5">{ach.desc}</p>
                      <p className="text-[10px] font-mono text-[rgb(var(--color-muted))] mt-1">{ach.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Hub Navigation Links */}
          <div className="rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-muted))] font-mono">
              Quick Scholar Hub
            </h4>
            <div className="space-y-2">
              <Link
                to="/notes"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[rgb(var(--color-container-low))] transition-colors border border-transparent hover:border-[rgb(var(--color-border))]"
              >
                <div className="flex items-center gap-2.5 text-xs font-medium text-[rgb(var(--color-text))]">
                  <BookOpen size={16} className="text-[rgb(var(--color-secondary))]" />
                  <span>Notes Vault</span>
                </div>
                <ArrowRight size={14} className="text-[rgb(var(--color-muted))]" />
              </Link>

              <Link
                to="/analytics"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[rgb(var(--color-container-low))] transition-colors border border-transparent hover:border-[rgb(var(--color-border))]"
              >
                <div className="flex items-center gap-2.5 text-xs font-medium text-[rgb(var(--color-text))]">
                  <BarChart3 size={16} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                  <span>Study Analytics</span>
                </div>
                <ArrowRight size={14} className="text-[rgb(var(--color-muted))]" />
              </Link>

              <Link
                to="/pomodoro"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[rgb(var(--color-container-low))] transition-colors border border-transparent hover:border-[rgb(var(--color-border))]"
              >
                <div className="flex items-center gap-2.5 text-xs font-medium text-[rgb(var(--color-text))]">
                  <Clock size={16} className="text-amber-500" />
                  <span>Pomodoro Timer</span>
                </div>
                <ArrowRight size={14} className="text-[rgb(var(--color-muted))]" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
