export const mockStats = {
  cumulativeFocus: {
    hours: 184.5,
    delta: '+14.2% vs prev month',
    goal: 200,
    progress: 92.25
  },
  spacedMastery: {
    rate: 91.4,
    delta: '+4.1%',
    status: 'Optimal Consolidation'
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
    dailyAvg: 4.2,
    flowDensity: 94.2
  },
  subjectVolume: [
    { name: 'Organic Chemistry II', hours: 72.0, targetHours: 80, percentage: 39, color: '#c84b31', grade: 'A- Tier', topicsLearned: 14, masteryRate: 88 },
    { name: 'Cognitive Neuroscience', hours: 54.0, targetHours: 60, percentage: 29, color: '#2d7d46', grade: 'A+ Tier', topicsLearned: 11, masteryRate: 94 },
    { name: 'Linear Algebra', hours: 38.0, targetHours: 45, percentage: 21, color: '#4f7cac', grade: 'B+ Tier', topicsLearned: 9, masteryRate: 79 },
    { name: 'Macroeconomics', hours: 20.5, targetHours: 25, percentage: 11, color: '#d4a017', grade: 'A Tier', topicsLearned: 6, masteryRate: 85 }
  ],
  retentionCurve: [
    { day: 'Day 0', aiRetention: 100, unprompted: 100, stage: 'Initial Ingestion', tip: '100% freshly learned material' },
    { day: 'Day 1', aiRetention: 95, unprompted: 68, stage: 'Next-Day Review', tip: 'Preserves 95% (prevents natural 32% overnight drop)' },
    { day: 'Day 3', aiRetention: 93, unprompted: 45, stage: 'The 48h Cliff', tip: 'Active recall stops the steep 55% loss' },
    { day: 'Day 7', aiRetention: 91, unprompted: 33, stage: '1-Week Anchor', tip: 'Consolidates formulas into mid-term memory' },
    { day: 'Day 14', aiRetention: 90, unprompted: 24, stage: '2-Week Hardening', tip: 'Synaptic connections harden for timed exams' },
    { day: 'Day 21', aiRetention: 92, unprompted: 18, stage: '3-Week Stability', tip: 'High retrieval speed (+74% over unreviewed)' },
    { day: 'Day 30', aiRetention: 91, unprompted: 12, stage: 'Permanent Storage', tip: 'Permanent retention locked in for semester finals' }
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
  circadianHeatmap: [
    { hour: '00:00', level: 0, label: 'Rest / Sleep', focusScore: '0%' },
    { hour: '01:00', level: 0, label: 'Rest / Sleep', focusScore: '0%' },
    { hour: '02:00', level: 0, label: 'Rest / Sleep', focusScore: '0%' },
    { hour: '03:00', level: 0, label: 'Rest / Sleep', focusScore: '0%' },
    { hour: '04:00', level: 0, label: 'Rest / Sleep', focusScore: '0%' },
    { hour: '05:00', level: 1, label: 'Waking / Dawn', focusScore: '40%' },
    { hour: '06:00', level: 2, label: 'Early Reading', focusScore: '72%' },
    { hour: '07:00', level: 2, label: 'Morning Prep', focusScore: '74%' },
    { hour: '08:00', level: 3, label: 'Warm-Up Session', focusScore: '86%' },
    { hour: '09:00', level: 4, label: 'Morning Deep Flow (Peak)', focusScore: '96%' },
    { hour: '10:00', level: 4, label: 'Morning Deep Flow (Peak)', focusScore: '98%' },
    { hour: '11:00', level: 4, label: 'Morning Deep Flow (Peak)', focusScore: '95%' },
    { hour: '12:00', level: 2, label: 'Midday Recharge', focusScore: '68%' },
    { hour: '13:00', level: 2, label: 'Lunch Break', focusScore: '65%' },
    { hour: '14:00', level: 3, label: 'Afternoon Practice', focusScore: '82%' },
    { hour: '15:00', level: 3, label: 'Afternoon Practice', focusScore: '85%' },
    { hour: '16:00', level: 3, label: 'Lab & Formula Review', focusScore: '84%' },
    { hour: '17:00', level: 3, label: 'Study Room Sprints', focusScore: '83%' },
    { hour: '18:00', level: 3, label: 'Dinner / Break', focusScore: '70%' },
    { hour: '19:00', level: 3, label: 'Evening Review', focusScore: '84%' },
    { hour: '20:00', level: 4, label: 'Evening Deep Flow (Peak)', focusScore: '94%' },
    { hour: '21:00', level: 4, label: 'Evening Deep Flow (Peak)', focusScore: '95%' },
    { hour: '22:00', level: 4, label: 'Quiz Sprint Hour', focusScore: '92%' },
    { hour: '23:00', level: 2, label: 'Wind-Down & Notes', focusScore: '68%' },
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
      subject: 'Org Chem: Stereochemistry',
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
      subject: 'Lin Alg: Eigenvectors',
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
      subject: 'Cognitive Neuro: Synaptic Plasticity',
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
      subject: 'Macro: IS-LM Models',
      score: '10/10',
      timeTaken: '2m 54s',
      speedDelta: '+42s Faster',
      result: 'VICTORY',
      eloChange: '+21 Elo'
    }
  ],
  subjectAccuracy: [
    { subject: 'Organic Chem II', accuracy: 96.4, latency: 'avg 2.8s/q', color: '#c84b31' },
    { subject: 'Cognitive Neuroscience', accuracy: 92.8, latency: 'avg 3.1s/q', color: '#2d7d46' },
    { subject: 'Linear Algebra', accuracy: 88.5, latency: 'avg 4.2s/q', color: '#4f7cac' },
    { subject: 'Macroeconomics', accuracy: 84.0, latency: 'avg 3.6s/q', color: '#d4a017' }
  ],
  overallVelocity: '3.24 sec / prompt'
};
