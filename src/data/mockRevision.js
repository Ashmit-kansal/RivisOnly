export const mockRevisionCards = [
  {
    id: 'rev-1',
    subject: 'Organic Chemistry II',
    topic: 'Reaction Mechanisms (SNAr & Meisenheimer)',
    type: 'ai',
    badge: 'Decay Alert (62%)',
    progress: 'Day 3 of 14',
    decayScore: 62,
    decayStatus: 'decaying',
    decayColor: '#c84b31',
    description: 'Nucleophilic aromatic substitution kinetics, Meisenheimer complex resonance, and halogen leaving group hierarchy.',
    sourcesScanned: 6,
    tokensVectorized: 14280,
    noteFileId: 'file-1',
    noteFileName: 'Synthesis_Pathways_Notes.doc',
    proficiencyScore: 68,
    keyPoints: [
      {
        title: 'Meisenheimer Complex Resonance',
        content: 'Addition of nucleophile disrupts the 6pi aromatic ring to generate an sp3 hybridized cyclohexadienyl anion stabilized by electron-withdrawing groups (EWGs) at ortho/para positions.',
        formula: 'Rate = k [Ar-X] [Nu⁻]'
      },
      {
        title: 'Halogen Leaving Group Order Inverted',
        content: 'F >> Cl > Br > I. Fluorine strongly withdraws electron density, lowering the activation energy of the rate-determining nucleophilic attack step.',
        formula: 'ΔG^‡ (Ar-F) < ΔG^‡ (Ar-Cl)'
      },
      {
        title: 'Two-Step Addition-Elimination',
        content: 'Step 1 is rate-determining addition forming carbanion. Step 2 is rapid expulsion of halide with restoration of aromaticity.'
      }
    ]
  },
  {
    id: 'rev-2',
    subject: 'Organic Chemistry II',
    topic: 'Stereochemistry & Cahn-Ingold-Prelog Rules',
    type: 'ai',
    badge: 'AI Optimized (78%)',
    progress: 'Day 7 of 30',
    decayScore: 78,
    decayStatus: 'stable',
    decayColor: '#2d7d46',
    description: 'Chiral centers, enantiomers vs diastereomers, meso forms, and CIP atomic number priority ranking.',
    sourcesScanned: 4,
    tokensVectorized: 9800,
    noteFileId: 'file-5',
    noteFileName: 'Chirality_Flash_Notes.doc',
    proficiencyScore: 84,
    keyPoints: [
      {
        title: 'Cahn-Ingold-Prelog (CIP) Priorities',
        content: 'Rank substituents strictly by atomic number at the first point of difference. Multiple bonds count as duplicate atoms (e.g. -COOH counts as 3 oxygens).',
        formula: '-I > -Br > -Cl > -SO3H > -F > -OR > -NH2 > -COOH > -CHO > -CH2OH > -CH3 > -H'
      },
      {
        title: 'Enantiomers vs Diastereomers',
        content: 'Enantiomers are non-superimposable mirror images with identical scalar physical properties but opposite optical rotation. Diastereomers have different MP/BP.'
      },
      {
        title: 'Meso Compounds',
        content: 'Molecules with 2+ stereocenters that possess an internal plane of symmetry (σ) or inversion center (i), rendering them optically inactive (achiral).'
      }
    ]
  },
  {
    id: 'rev-3',
    subject: 'Organic Chemistry II',
    topic: '13C-NMR Spectroscopy & Chemical Shifts',
    type: 'manual',
    badge: 'Fresh (85%)',
    progress: 'Due Tomorrow',
    decayScore: 85,
    decayStatus: 'fresh',
    decayColor: '#4f7cac',
    description: 'Proton decoupling, chemical shift ranges from 0-220 ppm, quaternary carbon relaxation, and DEPT spectra.',
    sourcesScanned: 5,
    tokensVectorized: 12100,
    noteFileId: 'file-2',
    noteFileName: 'Lecture_08_Spectroscopy.pdf',
    proficiencyScore: 92,
    keyPoints: [
      {
        title: 'Carbonyl Carbon Signals (160 - 220 ppm)',
        content: 'Aldehydes & ketones resonate furthest downfield (190-220 ppm). Esters, acids, and amides resonate between 160-185 ppm.',
        formula: 'δ(Ketone) > δ(Aldehyde) > δ(Ester) > δ(Amide)'
      },
      {
        title: 'Quaternary Carbon Signal Suppression',
        content: 'Carbons lacking directly bonded protons lack Nuclear Overhauser Effect (NOE) enhancement and have long T1 relaxation, resulting in small peaks.'
      },
      {
        title: 'DEPT-135 Phase Rules',
        content: 'CH3 and CH carbons point upwards (+). CH2 carbons point downwards (-). Quaternary carbons disappear entirely.'
      }
    ]
  },
  {
    id: 'rev-4',
    subject: 'Linear Algebra',
    topic: 'Spectral Theorem & Eigenvalue Decomposition',
    type: 'ai',
    badge: 'AI Optimized (88%)',
    progress: 'Day 5 of 21',
    decayScore: 88,
    decayStatus: 'fresh',
    decayColor: '#2d7d46',
    description: 'Orthogonal diagonalizability of real symmetric matrices, orthonormal bases of eigenvectors, and quadratic forms.',
    sourcesScanned: 7,
    tokensVectorized: 16400,
    noteFileId: 'file-1',
    noteFileName: 'Spectral_Analysis.doc',
    proficiencyScore: 80,
    keyPoints: [
      {
        title: 'Real Symmetric Matrix Factorization',
        content: 'Every real symmetric matrix A is orthogonally diagonalizable with real eigenvalues and an orthonormal matrix Q of eigenvectors.',
        formula: 'A = Q Λ Q^T, where Q^T Q = I'
      },
      {
        title: 'Rank-Nullity Fundamental Law',
        content: 'For any m x n matrix, the dimension of the column space plus the dimension of the nullspace equals the number of columns.',
        formula: 'Rank(A) + Nullity(A) = n'
      },
      {
        title: 'Positive Definiteness Test',
        content: 'A symmetric matrix is positive definite iff all eigenvalues λ_i > 0, or equivalently all leading principal minors are positive (Sylvester criterion).'
      }
    ]
  },
  {
    id: 'rev-5',
    subject: 'Cognitive Neuroscience',
    topic: 'Hippocampal Synaptic Plasticity & LTP',
    type: 'ai',
    badge: 'Decay Critical (54%)',
    progress: 'Day 12 of 14',
    decayScore: 54,
    decayStatus: 'decaying',
    decayColor: '#c84b31',
    description: 'NMDA receptor Mg2+ unblocking voltage threshold, CaMKII phosphorylation cascade, and retrograde NO signaling.',
    sourcesScanned: 5,
    tokensVectorized: 11400,
    noteFileId: 'file-1',
    noteFileName: 'LTP_Neuroplasticity.doc',
    proficiencyScore: 58,
    keyPoints: [
      {
        title: 'Coincidence Detection Mechanism',
        content: 'NMDA receptors act as molecular coincidence detectors: requiring presynaptic glutamate release AND postsynaptic depolarization to expel Mg2+ ion block.',
        formula: 'Mg²⁺ expulsion at V_m > -30 mV'
      },
      {
        title: 'Ca²⁺ Influx & CaMKII Activation',
        content: 'Calcium influx through NMDA channels autophosphorylates CaMKII (Thr286), trafficking additional AMPA receptors (GluA1) into the postsynaptic density.'
      },
      {
        title: 'Late-Phase LTP & Protein Synthesis',
        content: 'Maintained for weeks through CREB-mediated gene transcription, BDNF synthesis, and dendritic spine enlargement.'
      }
    ]
  }
];

export const mockAIQuizBank = {
  'Organic Chemistry II': [
    {
      id: 1,
      question: 'Which position on the nitrobenzene ring is predominantly attacked during electrophilic aromatic bromination with FeBr3, and why?',
      options: [
        'Ortho: The nitro group donates electron density through resonance stabilization.',
        'Meta: The nitro group is strongly deactivating; meta attack avoids positive charge on the nitro-bearing carbon.',
        'Para: Steric hindrance is minimized while induction favors opposite carbon.',
        'No reaction occurs: Nitrobenzene is entirely unreactive toward halogen electrophiles.'
      ],
      correct: 1,
      explanation: 'The nitro group (-NO2) is meta-directing because ortho/para attacks place a positive charge directly on the ring carbon bonded to the already positively charged nitrogen, causing severe electrostatic repulsion.',
      timeLimitSeconds: 45
    },
    {
      id: 2,
      question: 'In proton-decoupled 13C-NMR spectroscopy, which carbon nucleus typically produces the lowest intensity peak due to absent NOE enhancement?',
      options: [
        'Methyl (-CH3) primary carbon',
        'Quaternary carbon without directly bonded protons',
        'Methylene (-CH2-) adjacent to electronegative oxygen',
        'Aromatic CH methine carbon'
      ],
      correct: 1,
      explanation: 'Quaternary carbons lack directly bonded protons, leading to long T1 spin-lattice relaxation times and zero Nuclear Overhauser Effect (NOE) enhancement, yielding small signals.',
      timeLimitSeconds: 45
    },
    {
      id: 3,
      question: 'What is the stereochemical outcome of an SN2 reaction at a single asymmetric carbon center?',
      options: [
        'Complete inversion of configuration (Walden inversion)',
        'Complete retention of original optical geometry',
        '50:50 racemic mixture of enantiomers',
        'Diastereomeric equilibration with epimerization'
      ],
      correct: 0,
      explanation: 'SN2 proceeds via backside nucleophilic attack directly opposite the leaving group, causing an umbrella-like inversion of stereochemistry.',
      timeLimitSeconds: 40
    },
    {
      id: 4,
      question: 'Which reagent sequence best converts an aryl ketone (e.g., Acetophenone) to an alkylarene (Ethylbenzene)?',
      options: [
        'Clemmensen reduction (Zn(Hg), conc. HCl) or Wolff-Kishner (H2NNH2, KOH, heat)',
        'Pyridinium chlorochromate (PCC) in CH2Cl2',
        'Lithium aluminium hydride (LiAlH4) followed by H3O+',
        'Sodium borohydride (NaBH4) in ethanol'
      ],
      correct: 0,
      explanation: 'Clemmensen (acidic) and Wolff-Kishner (basic) both selectively reduce carbonyl groups of ketones/aldehydes directly to methylene (-CH2-) groups.',
      timeLimitSeconds: 45
    },
    {
      id: 5,
      question: 'According to the Cahn-Ingold-Prelog (CIP) priority rules, which group has the highest priority at a chiral center?',
      options: [
        '-CH2OH',
        '-CH=O (Aldehyde)',
        '-COOH (Carboxylic Acid)',
        '-CH2NH2'
      ],
      correct: 2,
      explanation: '-COOH treats the carbonyl as bonded to two oxygens plus the OH oxygen (equivalent to 3 oxygens), outranking -CH=O (two oxygens) and -CH2OH (one oxygen).',
      timeLimitSeconds: 45
    },
    {
      id: 6,
      question: 'Why does cyclopentadiene exhibit an unusually low pKa (~16) compared to typical hydrocarbons (pKa ~50)?',
      options: [
        'Its conjugate base is anti-aromatic with 4 pi electrons.',
        'Its conjugate base forms a planar aromatic cyclopentadienyl anion with 6 pi electrons (4n+2).',
        'The sp2 carbon exhibits exceptional electronegativity without resonance.',
        'Hydrogen bonding stabilizes the radical intermediate.'
      ],
      correct: 1,
      explanation: 'Deprotonation of cyclopentadiene yields the cyclopentadienyl anion, which is planar, fully conjugated, and satisfies Huckel’s rule (6 pi electrons, aromatic), conferring tremendous thermodynamic stability.',
      timeLimitSeconds: 40
    },
    {
      id: 7,
      question: 'In a Diels-Alder [4+2] cycloaddition, which statement regarding stereospecificity is correct?',
      options: [
        'The reaction is concerted and retains the cis/trans stereochemistry of both diene and dienophile.',
        'The endo rule favors the exo product at low temperature due to steric clash.',
        'The reaction proceeds via a free-radical intermediate with scrambling.',
        'Only trans-dienes with s-trans conformation can react.'
      ],
      correct: 0,
      explanation: 'Diels-Alder is a concerted [4+2] pericyclic cycloaddition. Stereochemistry of substituents on both the diene (which must adopt s-cis) and dienophile is rigorously conserved.',
      timeLimitSeconds: 45
    },
    {
      id: 8,
      question: 'Which spectroscopic method directly confirms the presence of a terminal alkyne C-H stretch?',
      options: [
        'IR sharp absorption near 3300 cm^-1',
        '1H-NMR singlet at 7.26 ppm',
        'Mass spec molecular ion peak at m/z = 44',
        'UV-Vis absorption peak at 210 nm'
      ],
      correct: 0,
      explanation: 'Terminal sp C-H bonds exhibit a characteristic sharp, strong infrared absorption around 3300 cm^-1.',
      timeLimitSeconds: 35
    },
    {
      id: 9,
      question: 'What is the intermediate formed during the acid-catalyzed dehydration of a secondary alcohol?',
      options: [
        'Carbocation subject to potential 1,2-hydride or alkyl shifts',
        'Carbanion stabilized by adjacent carbonyls',
        'Concerted benzyne intermediate',
        'Free radical cage intermediate'
      ],
      correct: 0,
      explanation: 'Acid-catalyzed E1 dehydration proceeds through a secondary carbocation, which may rearrange to a more stable tertiary carbocation via 1,2-hydride or methide shift.',
      timeLimitSeconds: 40
    },
    {
      id: 10,
      question: 'In nucleophilic aromatic substitution via addition-elimination (SNAr), the rate-determining step is usually:',
      options: [
        'Attack of the nucleophile to form the Meisenheimer resonance complex',
        'Elimination of the halide leaving group and rearomatization',
        'Protonation of the ring',
        'Dehalogenation by Lewis acid catalyst'
      ],
      correct: 0,
      explanation: 'Breaking aromaticity to produce the cyclohexadienyl (Meisenheimer) anion requires overcoming high activation energy and is the rate-determining step.',
      timeLimitSeconds: 45
    }
  ],
  'Linear Algebra': [
    {
      id: 1,
      question: 'If lambda is an eigenvalue of an invertible matrix A, what is the eigenvalue of A^-1?',
      options: ['1 / lambda', '-lambda', 'lambda^2', 'lambda / det(A)'],
      correct: 0,
      explanation: 'Since Ax = lambda x, multiplying by A^-1 gives x = lambda A^-1 x, so A^-1 x = (1/lambda) x.',
      timeLimitSeconds: 40
    },
    {
      id: 2,
      question: 'What is the rank of an n x n matrix with nullity equal to k?',
      options: ['n - k', 'k / n', 'n + k', 'k^2'],
      correct: 0,
      explanation: 'By the Rank-Nullity Theorem, Rank(A) + Nullity(A) = n, hence Rank(A) = n - k.',
      timeLimitSeconds: 35
    },
    {
      id: 3,
      question: 'Which of the following conditions ensures that an n x n matrix is diagonalizable over R?',
      options: [
        'It has n distinct real eigenvalues.',
        'Its determinant is non-zero.',
        'Its trace is zero.',
        'All its diagonal entries are positive.'
      ],
      correct: 0,
      explanation: 'If an n x n matrix has n distinct real eigenvalues, their corresponding eigenvectors are linearly independent, providing a basis of R^n that diagonalizes the matrix.',
      timeLimitSeconds: 40
    },
    {
      id: 4,
      question: 'What is the determinant of an orthogonal matrix Q?',
      options: ['+1 or -1', 'Always 0', 'Always +1', 'Any real number'],
      correct: 0,
      explanation: 'Since Q^T Q = I, det(Q^T) det(Q) = (det Q)^2 = 1, therefore det(Q) = +-1.',
      timeLimitSeconds: 30
    },
    {
      id: 5,
      question: 'The Gram-Schmidt process transforms a linearly independent set of vectors into:',
      options: [
        'An orthogonal (or orthonormal) set spanning the same subspace',
        'The nullspace of the original matrix',
        'The Jordan canonical form',
        'A set of eigenvectors'
      ],
      correct: 0,
      explanation: 'Gram-Schmidt systematically removes projections onto previously computed vectors to construct an orthogonal basis.',
      timeLimitSeconds: 40
    },
    {
      id: 6,
      question: 'If A is a symmetric real matrix, which statement is guaranteed by the Spectral Theorem?',
      options: [
        'All its eigenvalues are real, and it has an orthonormal basis of eigenvectors.',
        'Its eigenvalues are all complex conjugates.',
        'Its inverse is equal to -A.',
        'Its rank is always strictly less than n.'
      ],
      correct: 0,
      explanation: 'The Spectral Theorem states every real symmetric matrix has real eigenvalues and is orthogonally diagonalizable: A = Q Lambda Q^T.',
      timeLimitSeconds: 45
    },
    {
      id: 7,
      question: 'The singular values of a matrix A are equal to the square roots of the eigenvalues of:',
      options: ['A^T A', 'A + A^T', 'A^2', 'inv(A)'],
      correct: 0,
      explanation: 'Singular values sigma_i = sqrt(lambda_i(A^T A)).',
      timeLimitSeconds: 35
    },
    {
      id: 8,
      question: 'A square matrix A is positive definite if and only if:',
      options: [
        'x^T A x > 0 for all non-zero vectors x',
        'det(A) < 0',
        'trace(A) < 0',
        'All off-diagonal elements are zero'
      ],
      correct: 0,
      explanation: 'By definition, quadratic form x^T A x > 0 for all non-zero x in R^n.',
      timeLimitSeconds: 35
    },
    {
      id: 9,
      question: 'If u and v are orthogonal vectors in an inner product space, what is ||u + v||^2?',
      options: ['||u||^2 + ||v||^2', '(||u|| + ||v||)^2', '||u||^2 - ||v||^2', '2||u||||v||'],
      correct: 0,
      explanation: 'The Pythagorean theorem for inner products: ||u+v||^2 = ||u||^2 + 2<u,v> + ||v||^2 = ||u||^2 + ||v||^2 since <u,v>=0.',
      timeLimitSeconds: 30
    },
    {
      id: 10,
      question: 'What is the trace of a square matrix equal to?',
      options: [
        'The sum of its eigenvalues',
        'The product of its eigenvalues',
        'The square of its determinant',
        'The rank of the transpose'
      ],
      correct: 0,
      explanation: 'The trace of any square matrix equals the sum of its diagonal entries and also equals the sum of its eigenvalues (counted with algebraic multiplicity).',
      timeLimitSeconds: 35
    }
  ],
  'Cognitive Neuroscience': [
    {
      id: 1,
      question: 'Which molecular channel functions as the principal coincidence detector for long-term potentiation (LTP) in the hippocampus?',
      options: [
        'NMDA receptor, which requires both glutamate binding and membrane depolarization to expel Mg2+',
        'AMPA receptor, which is voltage-independent and freely conducts calcium',
        'GABA-A receptor, which hyperpolarizes the postsynaptic membrane via chloride influx',
        'Voltage-gated potassium channel Kv1.1'
      ],
      correct: 0,
      explanation: 'NMDA receptors are blocked by Mg2+ at resting membrane potential. Postsynaptic depolarization displaces the Mg2+ ion block, enabling Ca2+ influx only when pre- and post-synaptic activity coincide.',
      timeLimitSeconds: 40
    },
    {
      id: 2,
      question: 'What is the immediate downstream enzymatic trigger following calcium entry through NMDA receptors during induction of early-phase LTP?',
      options: [
        'Autophosphorylation of CaMKII at Thr286',
        'Inhibition of Protein Kinase A (PKA)',
        'Cleavage of Caspase-3',
        'Dephosphorylation of CREB transcription factor'
      ],
      correct: 0,
      explanation: 'Ca2+/calmodulin binding activates CaMKII, which autophosphorylates at Thr286 to lock into an autonomous persistently active state, facilitating AMPA receptor trafficking.',
      timeLimitSeconds: 35
    },
    {
      id: 3,
      question: 'Patient H.M. suffered profound anterograde amnesia following bilateral medial temporal lobe resection. Which type of memory was preserved?',
      options: [
        'Procedural / motor skill learning (e.g., mirror tracing task)',
        'Episodic autobiographical recollection of recent events',
        'Explicit semantic acquisition of new vocabulary',
        'Delayed free recall of word lists beyond 30 minutes'
      ],
      correct: 0,
      explanation: 'H.M. maintained intact non-declarative/procedural memory systems dependent on the basal ganglia and cerebellum, demonstrating that the hippocampus is specifically required for declarative memory consolidation.',
      timeLimitSeconds: 40
    },
    {
      id: 4,
      question: 'In the classic trisynaptic hippocampal circuit, the perforant path projects directly from the entorhinal cortex to which structure?',
      options: [
        'Dentate Gyrus granule cells',
        'CA1 pyramidal neurons directly via mossy fibers',
        'Subiculum output layer IV',
        'Prefrontal cortex layer V'
      ],
      correct: 0,
      explanation: 'The classic trisynaptic loop consists of: Perforant path (Entorhinal cortex -> Dentate Gyrus) -> Mossy fibers (DG -> CA3) -> Schaffer collaterals (CA3 -> CA1).',
      timeLimitSeconds: 35
    },
    {
      id: 5,
      question: 'Theta oscillations (4-8 Hz) in the hippocampus are most strongly correlated with which behavioral state?',
      options: [
        'Active spatial exploration, locomotion, and REM sleep',
        'Slow-wave deep sleep stage 4',
        'Comatose state under barbiturates',
        'Hyper-focused quiet immobile meditation'
      ],
      correct: 0,
      explanation: 'Hippocampal theta rhythms synchronize neuronal firing during active locomotion, spatial navigation, and REM sleep, coordinating synaptic plasticity windows.',
      timeLimitSeconds: 35
    }
  ]
};
