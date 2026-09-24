export const mockStats = {
  cumulativeFocus: {
    hours: 184.5,
    delta: '+14.2% vs last month',
    goal: 200,
    progress: 92.25
  },
  spacedMastery: {
    rate: 91.4,
    delta: '+4.1% this month',
    status: 'High Memory Retention'
  },
  quizArena: {
    rating: 1840,
    rankTier: 'MASTER',
    wins: 34,
    losses: 6,
    winRate: 85,
    globalRank: 84,
    streak: '7W'
  },
  focusCadence: {
    cycles: 312,
    sessions: 312,
    dailyAvg: 4.2,
    flowDensity: 94.2,
    focusQuality: 94.2
  },
  subjectVolume: [
    { name: 'Organic Chemistry II', hours: 72.0, targetHours: 80, percentage: 39, color: '#c84b31', grade: 'A- Tier', topicsLearned: 14, masteryRate: 88 },
    { name: 'Cognitive Neuroscience', hours: 54.0, targetHours: 60, percentage: 29, color: '#2d7d46', grade: 'A+ Tier', topicsLearned: 11, masteryRate: 94 },
    { name: 'Linear Algebra', hours: 38.0, targetHours: 45, percentage: 21, color: '#4f7cac', grade: 'B+ Tier', topicsLearned: 9, masteryRate: 79 },
    { name: 'Macroeconomics', hours: 20.5, targetHours: 25, percentage: 11, color: '#d4a017', grade: 'A Tier', topicsLearned: 6, masteryRate: 85 }
  ],
  retentionCurve: [
    { day: 'Day 0', aiRetention: 100, unprompted: 100, stage: 'First Learned', tip: '100% freshly learned material' },
    { day: 'Day 1', aiRetention: 95, unprompted: 68, stage: '24-Hour Review', tip: 'Short review keeps retention at 95% (prevents overnight 32% loss)' },
    { day: 'Day 3', aiRetention: 93, unprompted: 45, stage: 'Day 3 Checkpoint', tip: 'Active recall stops the steep 55% forgetting cliff' },
    { day: 'Day 7', aiRetention: 91, unprompted: 33, stage: '1-Week Anchor', tip: 'Locks key concepts and formulas into mid-term memory' },
    { day: 'Day 14', aiRetention: 90, unprompted: 24, stage: '2-Week Memory Lock', tip: 'Knowledge becomes fast and automatic for exams' },
    { day: 'Day 21', aiRetention: 92, unprompted: 18, stage: '3-Week Milestone', tip: 'Effortless recall with minimal future review needed' },
    { day: 'Day 30', aiRetention: 91, unprompted: 12, stage: 'Permanent Storage', tip: 'Permanent memory secured for finals with zero cramming' }
  ],
  upcomingSchedule: [
    { day: 'Mon', count: 34, isHeavy: true, subjects: '22 Org Chem, 12 Lin Alg', estMinutes: 18 },
    { day: 'Tue', count: 18, isHeavy: false, subjects: '10 Neuroscience, 8 Macro', estMinutes: 10 },
    { day: 'Wed', count: 26, isHeavy: true, subjects: '16 Org Chem, 10 Lin Alg', estMinutes: 14 },
    { day: 'Thu', count: 12, isHeavy: false, subjects: '12 Neuroscience', estMinutes: 6 },
    { day: 'Fri', count: 22, isHeavy: false, subjects: '14 Macro, 8 Org Chem', estMinutes: 12 },
    { day: 'Sat', count: 14, isHeavy: false, subjects: '14 Lin Alg Review', estMinutes: 8 },
    { day: 'Sun', count: 16, isHeavy: false, subjects: '16 Weekly Recap Cards', estMinutes: 9 }
  ],
  daySegments: [
    {
      id: 'morning',
      name: 'Morning',
      timeRange: '6 AM – 12 PM',
      avgScore: 92,
      tag: 'Peak Flow',
      color: '#9e3c26',
      bestFor: 'Complex mechanisms & math proofs'
    },
    {
      id: 'afternoon',
      name: 'Afternoon',
      timeRange: '12 PM – 6 PM',
      avgScore: 78,
      tag: 'Steady Study',
      color: '#d4a017',
      bestFor: 'Problem sets, lab notes & exercises'
    },
    {
      id: 'evening',
      name: 'Evening',
      timeRange: '6 PM – 11 PM',
      avgScore: 94,
      tag: 'Sprint Peak',
      color: '#9e3c26',
      bestFor: '1v1 quiz duels & speed flashcards'
    },
    {
      id: 'night',
      name: 'Night',
      timeRange: '11 PM – 6 AM',
      avgScore: 15,
      tag: 'Rest & Sleep',
      color: '#4f7cac',
      bestFor: 'Sleep & memory consolidation'
    }
  ],
  circadianHeatmap: [
    { hour: '00:00', hour12: '12 AM', score: 0, level: 0, period: 'night', label: 'Rest / Sleep', focusScore: '0%', recommendation: 'Sleep & neural memory consolidation' },
    { hour: '01:00', hour12: '1 AM', score: 0, level: 0, period: 'night', label: 'Rest / Sleep', focusScore: '0%', recommendation: 'Sleep & neural memory consolidation' },
    { hour: '02:00', hour12: '2 AM', score: 0, level: 0, period: 'night', label: 'Rest / Sleep', focusScore: '0%', recommendation: 'Sleep & neural memory consolidation' },
    { hour: '03:00', hour12: '3 AM', score: 0, level: 0, period: 'night', label: 'Rest / Sleep', focusScore: '0%', recommendation: 'Sleep & neural memory consolidation' },
    { hour: '04:00', hour12: '4 AM', score: 0, level: 0, period: 'night', label: 'Rest / Sleep', focusScore: '0%', recommendation: 'Sleep & neural memory consolidation' },
    { hour: '05:00', hour12: '5 AM', score: 35, level: 1, period: 'night', label: 'Waking / Dawn', focusScore: '35%', recommendation: 'Gentle hydration & light review' },
    { hour: '06:00', hour12: '6 AM', score: 72, level: 2, period: 'morning', label: 'Early Reading', focusScore: '72%', recommendation: 'Textbook skimming & formula review' },
    { hour: '07:00', hour12: '7 AM', score: 75, level: 2, period: 'morning', label: 'Morning Warm-up', focusScore: '75%', recommendation: 'Flashcard speed run' },
    { hour: '08:00', hour12: '8 AM', score: 86, level: 3, period: 'morning', label: 'Warm-Up Session', focusScore: '86%', recommendation: 'Quick recall quiz sprints' },
    { hour: '09:00', hour12: '9 AM', score: 96, level: 4, period: 'morning', isPeak: true, label: 'Morning Deep Flow (Peak)', focusScore: '96%', recommendation: 'Hardest topics: Reaction Mechanisms & Proofs' },
    { hour: '10:00', hour12: '10 AM', score: 98, level: 4, period: 'morning', isPeak: true, label: 'Morning Deep Flow (Peak)', focusScore: '98%', recommendation: 'Highest cognitive clarity of the day' },
    { hour: '11:00', hour12: '11 AM', score: 95, level: 4, period: 'morning', isPeak: true, label: 'Morning Deep Flow (Peak)', focusScore: '95%', recommendation: 'High-yield problem solving & synthesis' },
    { hour: '12:00', hour12: '12 PM', score: 68, level: 2, period: 'afternoon', label: 'Midday Recharge', focusScore: '68%', recommendation: 'Lunch break & passive review' },
    { hour: '13:00', hour12: '1 PM', score: 65, level: 2, period: 'afternoon', label: 'Lunch Break', focusScore: '65%', recommendation: 'Rest to reset attention span' },
    { hour: '14:00', hour12: '2 PM', score: 82, level: 3, period: 'afternoon', label: 'Afternoon Practice', focusScore: '82%', recommendation: 'Applied problem sets & worksheet practice' },
    { hour: '15:00', hour12: '3 PM', score: 85, level: 3, period: 'afternoon', label: 'Afternoon Practice', focusScore: '85%', recommendation: 'Practice exams & active derivation' },
    { hour: '16:00', hour12: '4 PM', score: 84, level: 3, period: 'afternoon', label: 'Formula & Practice Review', focusScore: '84%', recommendation: 'Study group discussion & formula sheets' },
    { hour: '17:00', hour12: '5 PM', score: 83, level: 3, period: 'afternoon', label: 'Study Room Sprints', focusScore: '83%', recommendation: 'Lofi focus session in Virtual Room' },
    { hour: '18:00', hour12: '6 PM', score: 70, level: 2, period: 'evening', label: 'Dinner / Break', focusScore: '70%', recommendation: 'Recharge & exercise' },
    { hour: '19:00', hour12: '7 PM', score: 84, level: 3, period: 'evening', label: 'Evening Review', focusScore: '84%', recommendation: 'Summarizing key points & notes' },
    { hour: '20:00', hour12: '8 PM', score: 94, level: 4, period: 'evening', isPeak: true, label: 'Evening Deep Flow (Peak)', focusScore: '94%', recommendation: '1v1 Live Quiz Duels & speed tests' },
    { hour: '21:00', hour12: '9 PM', score: 95, level: 4, period: 'evening', isPeak: true, label: 'Evening Deep Flow (Peak)', focusScore: '95%', recommendation: 'High speed recall & competitive arena' },
    { hour: '22:00', hour12: '10 PM', score: 92, level: 4, period: 'evening', isPeak: true, label: 'Quiz Sprint Hour', focusScore: '92%', recommendation: 'Final review of spaced repetition queue' },
    { hour: '23:00', hour12: '11 PM', score: 68, level: 2, period: 'night', label: 'Wind-Down & Review', focusScore: '68%', recommendation: 'Light reading & prep for sleep' },
  ],
  thirtyDayMinutes: [
    { day: '1', minutes: 110, target: 180 }, { day: '2', minutes: 140, target: 180 }, { day: '3', minutes: 95, target: 180 },
    { day: '4', minutes: 165, target: 180 }, { day: '5', minutes: 130, target: 180 }, { day: '6', minutes: 80, target: 180 },
    { day: '7', minutes: 190, target: 180 }, { day: '8', minutes: 210, target: 180 }, { day: '9', minutes: 185, target: 180 },
    { day: '10', minutes: 140, target: 180 }, { day: '11', minutes: 195, target: 180 }, { day: '12', minutes: 220, target: 180 },
    { day: '13', minutes: 175, target: 180 }, { day: '14', minutes: 105, target: 180 }, { day: '15', minutes: 190, target: 180 },
    { day: '16', minutes: 230, target: 180 }, { day: '17', minutes: 215, target: 180 }, { day: '18', minutes: 185, target: 180 },
    { day: '19', minutes: 120, target: 180 }, { day: '20', minutes: 200, target: 180 }, { day: '21', minutes: 240, target: 180 },
    { day: '22', minutes: 225, target: 180 }, { day: '23', minutes: 190, target: 180 }, { day: '24', minutes: 160, target: 180 },
    { day: '25', minutes: 210, target: 180 }, { day: '26', minutes: 235, target: 180 }, { day: '27', minutes: 195, target: 180 },
    { day: '28', minutes: 250, target: 180 }, { day: '29', minutes: 220, target: 180 }, { day: '30', minutes: 236, target: 180 },
  ],
  recentDuels: [
    {
      id: 'd1',
      opponent: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      school: 'Lv. 16 • Heidelberg',
      subject: 'Organic Chemistry II',
      topic: 'Stereochemistry',
      score: '10/10',
      timeTaken: '3m 42s',
      speedDelta: '+18s Faster',
      result: 'VICTORY',
      eloChange: '+24 Elo'
    },
    {
      id: 'd2',
      opponent: 'Julian Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      school: 'Lv. 19 • MIT',
      subject: 'Linear Algebra',
      topic: 'Eigenvectors',
      score: '9/10',
      timeTaken: '4m 05s',
      speedDelta: '+31s Faster',
      result: 'VICTORY',
      eloChange: '+18 Elo'
    },
    {
      id: 'd3',
      opponent: 'Amara Nwosu',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      school: 'Lv. 21 • Cambridge',
      subject: 'Cognitive Neuroscience',
      topic: 'Synaptic Plasticity',
      score: '8/10 vs 9/10',
      timeTaken: '3m 50s',
      speedDelta: '-1 Mistake',
      result: 'DEFEAT',
      eloChange: '-12 Elo'
    },
    {
      id: 'd4',
      opponent: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      school: 'Lv. 14 • Toronto',
      subject: 'Macroeconomics',
      topic: 'IS-LM Models',
      score: '10/10',
      timeTaken: '2m 54s',
      speedDelta: '+42s Faster',
      result: 'VICTORY',
      eloChange: '+21 Elo'
    }
  ],
  subjectAccuracy: [
    { subject: 'Organic Chemistry II', accuracy: 96.4, latency: 'avg 2.8s / question', color: '#c84b31' },
    { subject: 'Cognitive Neuroscience', accuracy: 92.8, latency: 'avg 3.1s / question', color: '#2d7d46' },
    { subject: 'Linear Algebra', accuracy: 88.5, latency: 'avg 4.2s / question', color: '#4f7cac' },
    { subject: 'Macroeconomics', accuracy: 84.0, latency: 'avg 3.6s / question', color: '#d4a017' }
  ],
  overallVelocity: '3.2 sec / question'
};
