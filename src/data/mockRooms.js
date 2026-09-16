export const mockRooms = [
  {
    id: 'room-1',
    name: 'Organic Chem Grind',
    subject: 'Organic Chemistry II',
    isPrivate: false,
    maxMembers: 10,
    cycleTime: '25m Cycle',
    tag: 'Deep Focus',
    description: 'Silent study hall for Organic Chemistry reaction pathways and mechanism synthesis.',
    members: [
      { id: 'm1', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', level: 16, school: 'Heidelberg', studyTime: 215, status: 'Studying', isFriend: true },
      { id: 'm2', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', level: 14, school: 'Toronto', studyTime: 180, status: 'Studying', isFriend: false },
      { id: 'm3', name: 'Amara Nwosu', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', level: 21, school: 'Cambridge', studyTime: 310, status: 'Break', isFriend: false },
      { id: 'm4', name: 'Julian Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', level: 19, school: 'MIT', studyTime: 245, status: 'Studying', isFriend: false },
      { id: 'm5', name: 'Sophia Lin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', level: 12, school: 'Stanford', studyTime: 95, status: 'Studying', isFriend: true },
      { id: 'm6', name: 'Lucas Meyer', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', level: 15, school: 'ETH Zurich', studyTime: 130, status: 'In Duel', isFriend: false },
      { id: 'm7', name: 'Alex Mercer', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', level: 18, school: 'Oxford', studyTime: 275, status: 'Studying', isFriend: false },
    ],
    messages: [
      { id: 'msg1', sender: 'Elena Rostova', text: 'Starting interval 4 on electrophilic additions. 45m sprint!', time: '18:20', isSystem: false },
      { id: 'msg2', sender: 'System', text: 'Alex Mercer joined Organic Chem Grind.', time: '18:22', isSystem: true },
      { id: 'msg3', sender: 'Alex Mercer', text: 'Ready for the group session. Has anyone reviewed chiral centers in chapter 6?', time: '18:25', isSystem: false },
      { id: 'msg4', sender: 'Marcus Vance', text: 'Yes, check the shared notes vault for the stereoisomer summary.', time: '18:28', isSystem: false },
    ]
  },
  {
    id: 'room-2',
    name: 'Late Night Medico',
    subject: 'Cognitive Neuroscience',
    isPrivate: false,
    maxMembers: 10,
    cycleTime: '50m Deep',
    tag: 'Ultra Silent',
    description: 'Long block pomodoro sprints for neuroscience and biomedical researchers.',
    members: [
      { id: 'm10', name: 'Dr. Sarah Patel', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80', level: 25, school: 'Johns Hopkins', studyTime: 380, status: 'Studying', isFriend: true },
      { id: 'm11', name: 'Kenji Sato', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', level: 17, school: 'Tokyo Univ', studyTime: 195, status: 'Studying', isFriend: false },
      { id: 'm12', name: 'Clara Oswald', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', level: 11, school: 'Edinburgh', studyTime: 140, status: 'Break', isFriend: false },
      { id: 'm13', name: 'Liam O’Connor', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', level: 13, school: 'Trinity College', studyTime: 160, status: 'Studying', isFriend: false },
      { id: 'm14', name: 'Maya Angelis', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', level: 19, school: 'UCL', studyTime: 290, status: 'Studying', isFriend: false },
      { id: 'm15', name: 'Hassan Al-Mansoor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', level: 16, school: 'McGill', studyTime: 220, status: 'Studying', isFriend: false },
      { id: 'm16', name: 'Zoe Kravitz', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', level: 14, school: 'Columbia', studyTime: 110, status: 'Studying', isFriend: false },
      { id: 'm17', name: 'Devon Miles', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', level: 18, school: 'Duke', studyTime: 230, status: 'Studying', isFriend: false },
    ],
    messages: [
      { id: 'msg10', sender: 'Dr. Sarah Patel', text: 'Synaptic plasticity session underway. Keep microphones muted.', time: '17:45', isSystem: false },
      { id: 'msg11', sender: 'Maya Angelis', text: 'Focus cycle 3 completed: 50m recorded.', time: '18:15', isSystem: false },
    ]
  },
  {
    id: 'room-3',
    name: 'Silent Math Lounge',
    subject: 'Linear Algebra',
    isPrivate: false,
    maxMembers: 10,
    cycleTime: 'Silent',
    tag: 'Strict No-Chat',
    description: 'Eigenvalues, vector spaces, and matrix decompositions in pure acoustic stillness.',
    members: [
      { id: 'm20', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', level: 22, school: 'KAIST', studyTime: 340, status: 'Studying', isFriend: true },
      { id: 'm21', name: 'Anna Ivanova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', level: 15, school: 'Lomonosov', studyTime: 155, status: 'Studying', isFriend: false },
      { id: 'm22', name: 'Gabriel Santos', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', level: 13, school: 'USP Brazil', studyTime: 120, status: 'Studying', isFriend: false },
      { id: 'm23', name: 'Chen Wei', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', level: 20, school: 'Tsinghua', studyTime: 290, status: 'Studying', isFriend: false },
    ],
    messages: [
      { id: 'msg20', sender: 'System', text: 'Room entered synchronized silent timer block.', time: '18:00', isSystem: true }
    ]
  },
  {
    id: 'room-4',
    name: 'Macro Masters Vault (Private)',
    subject: 'Macroeconomics',
    isPrivate: true,
    code: 'REV-8921',
    maxMembers: 50,
    cycleTime: '45m Sprint',
    tag: 'Private Room',
    description: 'Restricted invite-only study hall for Macroeconomic modelling, IS-LM, and DSGE analysis.',
    members: [
      { id: 'm30', name: 'Charlotte Dubois', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', level: 23, school: 'Sciences Po', studyTime: 420, status: 'Studying', isFriend: true },
      { id: 'm31', name: 'Oliver Schmidt', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', level: 17, school: 'Mannheim', studyTime: 210, status: 'Studying', isFriend: false },
      { id: 'm32', name: 'Priya Narang', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', level: 19, school: 'LSE', studyTime: 285, status: 'Studying', isFriend: true },
      { id: 'm33', name: 'Tariq Benali', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', level: 14, school: 'Sorbonne', studyTime: 175, status: 'Studying', isFriend: false },
      { id: 'm34', name: 'Emi Tanaka', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', level: 16, school: 'Kyoto Univ', studyTime: 195, status: 'Break', isFriend: false },
    ],
    messages: [
      { id: 'msg30', sender: 'Charlotte Dubois', text: 'Private room code active. Welcome economics cohorts!', time: '17:30', isSystem: false },
      { id: 'msg31', sender: 'Priya Narang', text: 'Evaluating Taylor Rule derivations on page 42.', time: '18:10', isSystem: false }
    ]
  },
  {
    id: 'room-5',
    name: 'Advanced Quantum & Physics (Private)',
    subject: 'Linear Algebra',
    isPrivate: true,
    code: 'REV-4091',
    maxMembers: 50,
    cycleTime: '60m Marathon',
    tag: 'Private Room',
    description: 'Private graduate research study enclave for spectral theorems and quantum observables.',
    members: [
      { id: 'm40', name: 'Dr. Nikolai Tesla', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', level: 28, school: 'Caltech', studyTime: 490, status: 'Studying', isFriend: true },
      { id: 'm41', name: 'Grace Hopper', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', level: 24, school: 'Yale', studyTime: 360, status: 'Studying', isFriend: false }
    ],
    messages: [
      { id: 'msg40', sender: 'Grace Hopper', text: 'Hilbert space projections underway.', time: '18:02', isSystem: false }
    ]
  }
];
