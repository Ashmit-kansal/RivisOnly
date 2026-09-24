import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, Users, BookOpen, BarChart3, Swords, Bot, 
  Sparkles, ShieldCheck, ArrowRight, Music, CheckCircle2,
  Zap, Brain, Trophy, Flame, Layers, Headphones, Target,
  ChevronRight, Play, Check, Quote, GraduationCap, ArrowUpRight
} from 'lucide-react';
import Logo from '../components/ui/Logo';

export default function Landing() {
  const { setShowLogin, setShowSignup } = useAuth();
  const [activePreviewTab, setActivePreviewTab] = useState('pomodoro');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'What makes Rivisonly different from Notion, Forest, or Discord?',
      a: 'Most tools force you to juggle five different tabs: a timer app, a noisy Discord server, Spotify for music, flashcard software, and scattered PDF notes. Rivisonly integrates all five into a single architectural workspace calibrated specifically for cognitive flow — with zero clutter and zero distractions.'
    },
    {
      q: 'How do the Virtual Study Rooms work?',
      a: 'In Rivisonly, study rooms are synchronized by real-time focus timers, active subjects, and live accountability pulses. You experience genuine peer motivation and shared focus without the awkwardness or pressure of turning on a webcam.'
    },
    {
      q: 'How does the AI Spaced Repetition engine work?',
      a: 'When you upload lecture slides or take notes in our markdown editor, the AI maps out core concepts and calculates your memory retention using smart spaced repetition. It automatically suggests flashcards and reviews right before you forget them.'
    },
    {
      q: 'Are 1v1 Quiz Duels mandatory?',
      a: 'Not at all! Duels are an optional, gamified active recall tool. When you want to test your mastery before an exam, you can challenge a peer or classmate to a 10-question rapid quiz duel to solidify high-yield concepts.'
    },
    {
      q: 'Is Rivisonly free to use?',
      a: 'Yes! Core focus rooms, Pomodoro tracking, the Lo-Fi radio sanctuary, and basic note-taking vaults are 100% free for individual scholars.'
    }
  ];

  return (
    <div className="space-y-24 py-6 sm:py-10">
      
      {/* 1. HERO SECTION */}
      <section className="relative text-center max-w-5xl mx-auto px-4 pt-4 sm:pt-8 space-y-8">
        
        {/* Subtle decorative glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[400px] bg-gradient-to-tr from-[rgb(var(--color-primary))]/15 via-[rgb(var(--color-tertiary))]/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))]/25 text-xs font-mono font-semibold tracking-wide shadow-xs animate-fade-in-up">
          <Sparkles size={14} className="animate-pulse" />
          <span>Your AI Study Partner & Real-Time Focus Space</span>
        </div>

        {/* Main Inspiring Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[rgb(var(--color-text))] leading-[1.12]">
            Study Smarter. Retain Deeper. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#9e3c26] via-[#be543c] to-[#e26f54] dark:from-[#ffb4a3] dark:via-[#e26f54] dark:to-[#ffdad2] bg-clip-text text-transparent">
              Built for Pure Focus.
            </span>
          </h1>
          
          <p className="text-base sm:text-xl text-[rgb(var(--color-muted))] max-w-3xl mx-auto leading-relaxed font-normal">
            The all-in-one distraction-free sanctuary for serious students. Combine synchronized 
            virtual study rooms, AI-powered notes, active 1v1 recall duels, and 
            a built-in floating lo-fi radio with 20 royalty-free tracks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link
            to="/pomodoro"
            className="px-8 py-4 rounded-2xl bg-[rgb(var(--color-primary))] hover:brightness-105 text-white font-semibold text-sm flex items-center gap-2.5 shadow-xl shadow-[rgb(var(--color-primary))]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Zap size={18} className="fill-current" />
            <span>Launch Pomodoro Studio — Free</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/rooms"
            className="px-7 py-4 rounded-2xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] font-semibold text-sm border border-[rgb(var(--color-border))] shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2"
          >
            <Users size={17} className="text-[rgb(var(--color-primary))]" />
            <span>Join Live Study Rooms</span>
          </Link>
        </div>

        {/* Live Social Proof Badge Bar */}
        <div className="pt-3 flex items-center justify-center gap-2 text-xs font-mono text-[rgb(var(--color-muted))]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[rgb(var(--color-text))]">1,420+ Scholars</span>
          <span>in active study cycles</span>
        </div>

      </section>

      {/* 2. INTERACTIVE APP EXPERIENCE PREVIEW (THE WOW MOMENT) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-xl overflow-hidden">
          
          {/* Mock Browser Header with Tab Switcher */}
          <div className="px-4 sm:px-6 py-3.5 bg-[rgb(var(--color-container-low))] border-b border-[rgb(var(--color-border))] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-amber-400/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-xs font-mono text-[rgb(var(--color-muted))] hidden md:inline">
                rivisonly.app/focus-studio
              </span>
            </div>

            {/* Preview Mode Selector */}
            <div className="flex items-center gap-1 p-1 bg-[rgb(var(--color-card))] rounded-xl border border-[rgb(var(--color-border))] text-xs font-medium">
              <button
                onClick={() => setActivePreviewTab('pomodoro')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activePreviewTab === 'pomodoro'
                    ? 'bg-[rgb(var(--color-primary))] text-white shadow-xs'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                Focus Pomodoro
              </button>
              <button
                onClick={() => setActivePreviewTab('rooms')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activePreviewTab === 'rooms'
                    ? 'bg-[rgb(var(--color-primary))] text-white shadow-xs'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                Study Rooms
              </button>
              <button
                onClick={() => setActivePreviewTab('vault')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activePreviewTab === 'vault'
                    ? 'bg-[rgb(var(--color-primary))] text-white shadow-xs'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                AI Notes Vault
              </button>
              <button
                onClick={() => setActivePreviewTab('duels')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activePreviewTab === 'duels'
                    ? 'bg-[rgb(var(--color-primary))] text-white shadow-xs'
                    : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                }`}
              >
                1v1 Duels
              </button>
            </div>
          </div>

          {/* Interactive Screen Preview Container */}
          <div className="p-6 sm:p-10 min-h-[340px] flex items-center justify-center bg-gradient-to-b from-[rgb(var(--color-surface))] to-[rgb(var(--color-container-low))]">
            
            {activePreviewTab === 'pomodoro' && (
              <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="px-2.5 py-1 rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] text-[11px] font-mono font-bold">
                    ACTIVE INTERVAL // 03 of 04
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text))]">
                    Organic Chemistry II: Synthesis Reactions
                  </h3>
                  <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
                    Stay locked in with structured focus intervals, gentle session chimes, and calming background lo-fi music.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Flame size={14} /> 14-day streak active
                    </span>
                    <span className="text-xs font-mono text-[rgb(var(--color-muted))]">•</span>
                    <span className="text-xs font-mono text-[rgb(var(--color-muted))]">Daily Goal: 82%</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-lg flex flex-col items-center text-center space-y-4">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-[rgb(var(--color-container-high))]" />
                    <div className="absolute inset-0 rounded-full border-4 border-[rgb(var(--color-primary))] border-t-transparent animate-spin [animation-duration:8s]" />
                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold text-[rgb(var(--color-text))]">18:42</div>
                      <div className="text-[10px] font-mono text-[rgb(var(--color-primary))] font-semibold">DEEP WORK</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-[rgb(var(--color-container-low))] text-xs font-mono font-semibold text-[rgb(var(--color-text))]">
                      Track: Shinjuki Gyoen
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'rooms' && (
              <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[11px] font-mono font-bold">
                    SILENT ACCOUNTABILITY
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text))]">
                    Co-work with Serious Scholars Across Top Universities
                  </h3>
                  <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
                    Study alongside motivated peers in real time with synchronized focus timers and shared milestones — all in a calm, camera-free space.
                  </p>
                  <div className="pt-1">
                    <Link to="/rooms" className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1">
                      <span>Browse 18 active study halls</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-2.5">
                    <div className="text-xs font-bold text-[rgb(var(--color-text))]">Radcliffe Camera • Silent Hall</div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      9/10 Seats
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Elena Rostova', subj: 'Molecular Bio', time: '42m in' },
                      { name: 'David Chen', subj: 'Distributed Systems', time: '1h 15m in' },
                      { name: 'Maya Lin', subj: 'Constitutional Law', time: '28m in' }
                    ].map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[rgb(var(--color-container-low))]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-[rgb(var(--color-text))]">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px] text-[rgb(var(--color-muted))]">
                          <span>{p.subj}</span>
                          <span>•</span>
                          <span className="text-[rgb(var(--color-primary))] font-semibold">{p.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'vault' && (
              <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-mono font-bold">
                    AI RETENTION ENGINE
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text))]">
                    Upload Lecture Slides & Turn Them into Long-Term Memory
                  </h3>
                  <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
                    The AI parses complex OCR equations, structures concepts hierarchically, and feeds them to your personal spaced repetition schedule.
                  </p>
                  <div className="pt-1">
                    <Link to="/notes" className="text-xs font-semibold text-emerald-500 hover:underline flex items-center gap-1">
                      <span>Explore Notes Vault</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-lg space-y-3">
                  <div className="text-xs font-mono text-[rgb(var(--color-muted))] flex items-center justify-between">
                    <span>SYNTHESIS // LECTURE_08.PDF</span>
                    <span className="text-emerald-500 font-bold">91.4% RETENTION</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs space-y-2">
                    <div className="font-bold text-[rgb(var(--color-text))]">
                      Key Concept: Stereochemical Inversion (SN2)
                    </div>
                    <p className="text-[11px] text-[rgb(var(--color-muted))] leading-relaxed">
                      "Bi-molecular nucleophilic substitution proceeds via a backside attack, causing a Walden inversion of the chiral center..."
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] text-[10px] font-mono font-semibold">
                        Review in 2 days
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-semibold">
                        Mastery: High
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'duels' && (
              <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[11px] font-mono font-bold">
                    GAMIFIED ACTIVE RECALL
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-text))]">
                    10-Question 1v1 Quiz Duels Under Light Pressure
                  </h3>
                  <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
                    Test your intuition against peers. Answer timed multiple-choice questions curated directly from course material and raise your Scholar Elo rating.
                  </p>
                  <div className="pt-1">
                    <Link to="/rooms" className="text-xs font-semibold text-amber-500 hover:underline flex items-center gap-1">
                      <span>Challenge a Scholar</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] shadow-lg space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[rgb(var(--color-text))]">DUEL // ROUND 4 OF 10</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                      ⏱ 00:07s
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[rgb(var(--color-text))]">
                    Which reagent selectively reduces esters to primary alcohols?
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-semibold flex items-center justify-between">
                      <span>A) Lithium Aluminium Hydride (LiAlH4)</span>
                      <Check size={14} />
                    </div>
                    <div className="p-2 rounded-lg bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))] text-xs font-mono">
                      <span>B) Sodium Borohydride (NaBH4)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 3. "WHY RIVISONLY?" - CORE VALUE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[rgb(var(--color-primary))] font-bold">
            THE ARCHITECTURAL DIFFERENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[rgb(var(--color-text))] tracking-tight">
            Why Top Students Choose Rivisonly Over Fragmented Apps
          </h2>
          <p className="text-sm sm:text-base text-[rgb(var(--color-muted))] leading-relaxed">
            Stop switching between Spotify, YouTube, Discord, Forest, and Notion. We engineered a single, unified environment dedicated to deep analytical recall.
          </p>
        </div>

        {/* 4 Strategic Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/50 transition-all space-y-4 group shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-lg text-[rgb(var(--color-text))]">
              1. Camera-Free Co-Working
            </h3>
            <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] leading-relaxed">
              Study alongside real students with synchronized timers and shared milestones. Enjoy true peer accountability and community without the awkwardness or pressure of being on camera.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/50 transition-all space-y-4 group shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain size={24} />
            </div>
            <h3 className="font-bold text-lg text-[rgb(var(--color-text))]">
              2. Spaced Memory Science
            </h3>
            <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] leading-relaxed">
              Passive re-reading is a proven illusion of competence. Rivisonly calculates your retention schedule and prompts active retrieval right when memory starts fading.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/50 transition-all space-y-4 group shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Swords size={24} />
            </div>
            <h3 className="font-bold text-lg text-[rgb(var(--color-text))]">
              3. Thrilling 1v1 Duels
            </h3>
            <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] leading-relaxed">
              Transform boring cramming into friendly academic competition. Challenge friends to 10-question practice duels with instant explanations and Elo ratings.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/50 transition-all space-y-4 group shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Headphones size={24} />
            </div>
            <h3 className="font-bold text-lg text-[rgb(var(--color-text))]">
              4. Built-in Lo-Fi Player
            </h3>
            <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] leading-relaxed">
              20 royalty-free chill lo-fi tracks streamed right from a floating player. No lyrics, no ads, just pure focus.
            </p>
          </div>

        </div>
      </section>

      {/* 4. COMPREHENSIVE FEATURE BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[rgb(var(--color-primary))] font-bold">
            PRECISION TOOLKIT
          </span>
          <h2 className="text-3xl font-extrabold text-[rgb(var(--color-text))] tracking-tight">
            Everything You Need to Ace Your Exams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Subject-First Pomodoro Tracker */}
          <div className="p-7 rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] flex flex-col justify-between hover:border-[rgb(var(--color-primary))]/40 transition-all group shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h3 className="font-bold text-lg text-[rgb(var(--color-text))]">
                Subject-Mapped Pomodoro
              </h3>
              <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] leading-relaxed">
                Log focus hours directly to subject trees like Organic Chem, Linear Algebra, or Law. Features interval rings, gentle audio chimes, and daily progress tracking.
              </p>
            </div>
            <Link to="/pomodoro" className="mt-6 text-xs font-semibold text-[rgb(var(--color-primary))] flex items-center gap-1.5 hover:underline">
              <span>Open Pomodoro Studio</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Card 2: Videoless Peer Rooms */}
          <div className="p-7 rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] flex flex-col justify-between hover:border-[rgb(var(--color-primary))]/40 transition-all group shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-lg text-[rgb(var(--color-text))]">
                Public & Private Study Halls
              </h3>
              <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] leading-relaxed">
                Drop into open co-working halls (up to 10 scholars) or create password-protected private study spaces (up to 50 scholars) with live timer sync and group chat.
              </p>
            </div>
            <Link to="/rooms" className="mt-6 text-xs font-semibold text-indigo-500 flex items-center gap-1.5 hover:underline">
              <span>Explore Study Halls</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Card 3: Notes Vault & AI OCR */}
          <div className="p-7 rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] flex flex-col justify-between hover:border-[rgb(var(--color-primary))]/40 transition-all group shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-lg text-[rgb(var(--color-text))]">
                Knowledge Vault & LaTeX
              </h3>
              <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] leading-relaxed">
                Organize PDF, PNG, and DOCX notes with subject taxonomies. Write and edit directly in our Markdown/LaTeX editor with AI automated summaries and OCR extraction.
              </p>
            </div>
            <Link to="/notes" className="mt-6 text-xs font-semibold text-emerald-500 flex items-center gap-1.5 hover:underline">
              <span>View Notes Vault</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. STUDENT TESTIMONIALS & RESULTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[rgb(var(--color-primary))] font-bold">
            COMMUNITY RESULTS
          </span>
          <h2 className="text-3xl font-extrabold text-[rgb(var(--color-text))] tracking-tight">
            Hear from Scholars Who Scaled Their Focus
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <Quote size={24} className="text-[rgb(var(--color-primary))] opacity-40" />
              <p className="text-xs sm:text-sm text-[rgb(var(--color-text))] leading-relaxed">
                "I went from 2.8 to 3.8 GPA in Biochemistry. The quiet co-working rooms keep me completely focused and accountable for 4-hour deep work sessions without burnout."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-[rgb(var(--color-border))]">
              <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-primary))]/20 text-[rgb(var(--color-primary))] flex items-center justify-center font-bold text-xs">
                ML
              </div>
              <div>
                <div className="text-xs font-bold text-[rgb(var(--color-text))]">Maya Lin</div>
                <div className="text-[11px] text-[rgb(var(--color-muted))] font-mono">Pre-Med Scholar • UC Berkeley</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <Quote size={24} className="text-indigo-500 opacity-40" />
              <p className="text-xs sm:text-sm text-[rgb(var(--color-text))] leading-relaxed">
                "The 1v1 Quiz Duels are addictive in the best way. My study group duels on Linear Algebra theorems twice a week and our exam retention has shot through the roof."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-[rgb(var(--color-border))]">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-xs">
                DK
              </div>
              <div>
                <div className="text-xs font-bold text-[rgb(var(--color-text))]">Daniel K.</div>
                <div className="text-[11px] text-[rgb(var(--color-muted))] font-mono">Computer Science • Waterloo</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <Quote size={24} className="text-emerald-500 opacity-40" />
              <p className="text-xs sm:text-sm text-[rgb(var(--color-text))] leading-relaxed">
                "The floating Lo-Fi music player built directly into Rivisonly is pure genius. 20 chill tracks without YouTube ads or distracting tabs."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-[rgb(var(--color-border))]">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs">
                AR
              </div>
              <div>
                <div className="text-xs font-bold text-[rgb(var(--color-text))]">Aisha R.</div>
                <div className="text-[11px] text-[rgb(var(--color-muted))] font-mono">Juris Doctor Scholar • Oxford</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[rgb(var(--color-primary))] font-bold">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl font-extrabold text-[rgb(var(--color-text))] tracking-tight">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[rgb(var(--color-container-low))] transition-colors"
              >
                <span className="text-sm font-semibold text-[rgb(var(--color-text))]">
                  {faq.q}
                </span>
                <ChevronRight
                  size={18}
                  className={`text-[rgb(var(--color-muted))] shrink-0 transition-transform ${
                    openFaq === idx ? 'rotate-90 text-[rgb(var(--color-primary))]' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-[rgb(var(--color-muted))] leading-relaxed border-t border-[rgb(var(--color-border))]/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. HIGH-CONVERSION BOTTOM CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[rgb(var(--color-container-low))] via-[rgb(var(--color-card))] to-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] shadow-2xl text-center space-y-6 overflow-hidden">
          
          {/* Subtle warm decorative glow */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[rgb(var(--color-primary))]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[rgb(var(--color-tertiary))]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-center">
            <Logo className="w-12 h-12 shadow-lg rounded-xl" />
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[rgb(var(--color-text))] tracking-tight">
              Reclaim Your Deep Attention Today
            </h2>
            <p className="text-xs sm:text-base text-[rgb(var(--color-muted))] leading-relaxed">
              Step into a study space designed specifically for cognitive clarity. No clutter, no social media noise, pure focus.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              to="/pomodoro"
              className="px-8 py-3.5 rounded-2xl bg-[rgb(var(--color-primary))] hover:brightness-105 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[rgb(var(--color-primary))]/25 hover:scale-105 transition-all cursor-pointer"
            >
              <span>Launch Pomodoro Immediately</span>
              <ArrowRight size={16} />
            </Link>

            <button
              onClick={() => setShowSignup(true)}
              className="px-7 py-3.5 rounded-2xl bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-sm border border-[rgb(var(--color-border))] shadow-xs transition-colors cursor-pointer"
            >
              Create Free Account
            </button>
          </div>

          <div className="pt-2 text-[11px] font-mono text-[rgb(var(--color-muted))]">
            Instant guest access • No credit card required • Full Lo-Fi access included
          </div>

        </div>
      </section>

    </div>
  );
}
