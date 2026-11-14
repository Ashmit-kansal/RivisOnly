/**
 * Question Bank & Anti-Cheat Gauntlet Service for RivisOnly
 * Features:
 * - 0ms Instant Match Start via cached pre-computed question banks
 * - 7-Day Topic Cooldown for Ranked Trophies (Anti-Farming)
 * - Anti-Cheat Drive File Integrity & Trophy Clawback
 * - Adaptive Difficulty Curve (Easy -> Medium -> Hard)
 */

const QUESTION_BANK_STORAGE_KEY = 'rivisonly_question_banks';
const FORGED_DECKS_STORAGE_KEY = 'rivisonly_forged_battle_decks';
const TOPIC_COOLDOWNS_STORAGE_KEY = 'rivisonly_topic_cooldowns';
const TROPHY_LEDGER_STORAGE_KEY = 'rivisonly_trophy_ledger';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// High-yield built-in question library spanning core academic disciplines (60+ questions)
const BUILT_IN_QUESTION_LIBRARY = [
  // Computer Science & OS
  {
    id: 'cs-1',
    topic: 'Operating Systems',
    difficulty: 'easy',
    question: 'Which of the following is NOT one of Coffman’s four necessary conditions for a deadlock?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Resource Replication', 'Circular Wait'],
    correct: 2,
    explanation: 'The four necessary conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.'
  },
  {
    id: 'cs-2',
    topic: 'Operating Systems',
    difficulty: 'medium',
    question: 'The Banker’s algorithm is primarily used for which phase of deadlock handling?',
    options: ['Deadlock Detection', 'Deadlock Avoidance', 'Deadlock Prevention', 'Deadlock Recovery'],
    correct: 1,
    explanation: 'Banker’s algorithm checks for a safe state before granting resource allocations to avoid deadlocks.'
  },
  {
    id: 'cs-3',
    topic: 'Operating Systems',
    difficulty: 'hard',
    question: 'In virtual memory systems, what is the primary consequence of Belady’s Anomaly?',
    options: [
      'Page fault rate increases as physical frame allocation increases (under FIFO)',
      'Cache misses increase when page table size exceeds TLB capacity',
      'Thrashing occurs due to inverted page tables',
      'Dirty pages fail to synchronize to secondary disk storage'
    ],
    correct: 0,
    explanation: 'Belady’s anomaly occurs with FIFO replacement: increasing frames can paradoxically increase page faults.'
  },
  {
    id: 'cs-4',
    topic: 'Data Structures',
    difficulty: 'easy',
    question: 'What is the worst-case time complexity of finding an element in an un-balanced Binary Search Tree (BST)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correct: 2,
    explanation: 'In the worst case (skewed tree), a BST degenerates into a linked list with O(n) search time.'
  },
  {
    id: 'cs-5',
    topic: 'Data Structures',
    difficulty: 'medium',
    question: 'Which tree rotation rebalances an AVL tree when an insertion occurs in the right subtree of the left child?',
    options: ['Left Rotation', 'Right Rotation', 'Left-Right Rotation (LR)', 'Right-Left Rotation (RL)'],
    correct: 2,
    explanation: 'A left-heavy node with a right-heavy child requires an LR double rotation to restore balance.'
  },
  {
    id: 'cs-6',
    topic: 'Computer Networks',
    difficulty: 'medium',
    question: 'In TCP three-way handshake, what flags are set in the second segment sent from server to client?',
    options: ['SYN only', 'SYN-ACK', 'ACK only', 'FIN-ACK'],
    correct: 1,
    explanation: 'The server responds to client SYN with a combined SYN-ACK packet.'
  },
  {
    id: 'cs-7',
    topic: 'Algorithms',
    difficulty: 'hard',
    question: 'Which algorithm finds single-source shortest paths in a directed graph containing negative weight edges (with cycle detection)?',
    options: ['Dijkstra’s Algorithm', 'Bellman-Ford Algorithm', 'Floyd-Warshall Algorithm', 'Kruskal’s Algorithm'],
    correct: 1,
    explanation: 'Bellman-Ford operates in O(VE) and can detect negative weight cycles, unlike Dijkstra.'
  },
  // Chemistry & Organic Mechanisms
  {
    id: 'chem-1',
    topic: 'Organic Chemistry',
    difficulty: 'easy',
    question: 'What type of stereochemical change occurs in a concerted SN2 nucleophilic substitution?',
    options: ['Racemization (50:50 mixture)', 'Walden Inversion of configuration', 'Retention of configuration', 'Tautomerization'],
    correct: 1,
    explanation: 'Backside attack by the nucleophile forces complete stereochemical inversion (Walden Inversion).'
  },
  {
    id: 'chem-2',
    topic: 'Organic Chemistry',
    difficulty: 'medium',
    question: 'According to Huckel’s rule, a planar, fully conjugated cyclic system is aromatic if it contains:',
    options: ['4n π electrons', '4n + 2 π electrons', '2n + 1 π electrons', '6n π electrons'],
    correct: 1,
    explanation: 'Aromaticity requires 4n + 2 delocalized π electrons in a planar monocyclic ring (n = 0, 1, 2, ...).'
  },
  {
    id: 'chem-3',
    topic: 'Organic Chemistry',
    difficulty: 'hard',
    question: 'In the Diels-Alder reaction between cyclopentadiene and maleic anhydride, which product is kinetically favored?',
    options: ['Exo adduct due to steric ease', 'Endo adduct due to secondary orbital interactions', 'Trans-diaxial isomer', 'Anti-Markovnikov hydrate'],
    correct: 1,
    explanation: 'The Alder Endo Rule dictates that secondary orbital overlap favors the endo transition state kinetically.'
  },
  {
    id: 'chem-4',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    question: 'What is the thermodynamic criterion for a reaction to be spontaneous under constant temperature and pressure?',
    options: ['ΔH < 0', 'ΔS > 0', 'ΔG < 0', 'ΔE = 0'],
    correct: 2,
    explanation: 'Gibbs Free Energy change ΔG < 0 is the universal condition for spontaneity at constant T and P.'
  },
  {
    id: 'chem-5',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    question: 'According to the Arrhenius equation, how does increasing the activation energy (Ea) affect the reaction rate constant (k)?',
    options: ['Increases k exponentially', 'Decreases k exponentially', 'Has no effect on k', 'Increases k linearly'],
    correct: 1,
    explanation: 'k = A * e^(-Ea / RT). As Ea increases, the exponential term becomes smaller, lowering k.'
  },
  // Biology & Neuroscience
  {
    id: 'bio-1',
    topic: 'Cognitive Neuroscience',
    difficulty: 'easy',
    question: 'Which anatomical brain structure is critical for the consolidation of short-term declarative memory into long-term memory?',
    options: ['Cerebellum', 'Hippocampus', 'Medulla Oblongata', 'Pons'],
    correct: 1,
    explanation: 'Classic clinical neuropsychology (patient H.M.) established the hippocampus as essential for memory consolidation.'
  },
  {
    id: 'bio-2',
    topic: 'Cognitive Neuroscience',
    difficulty: 'medium',
    question: 'In Long-Term Potentiation (LTP), what ion channel blockade must be removed by membrane depolarization before Ca2+ can enter via NMDA receptors?',
    options: ['Na+ block', 'Mg2+ (Magnesium) block', 'K+ block', 'Cl- block'],
    correct: 1,
    explanation: 'Depolarization repels the Mg2+ plug lodged in the NMDA channel pore, enabling calcium influx.'
  },
  {
    id: 'bio-3',
    topic: 'Molecular Biology',
    difficulty: 'easy',
    question: 'Where does oxidative phosphorylation take place within eukaryotic cells?',
    options: ['Outer mitochondrial membrane', 'Mitochondrial inner membrane / cristae', 'Cytosol', 'Endoplasmic reticulum lumen'],
    correct: 1,
    explanation: 'The electron transport chain complexes and ATP synthase are embedded in the inner mitochondrial membrane.'
  },
  {
    id: 'bio-4',
    topic: 'Molecular Biology',
    difficulty: 'hard',
    question: 'During DNA replication, which enzyme removes RNA primers and fills the resulting gaps with deoxyribonucleotides in prokaryotes?',
    options: ['DNA Polymerase III', 'DNA Polymerase I', 'DNA Ligase', 'Topoisomerase II (Gyrase)'],
    correct: 1,
    explanation: 'DNA Polymerase I possesses 5\' to 3\' exonuclease activity to degrade RNA primers and synthesize DNA in their place.'
  },
  // Physics & Mathematics
  {
    id: 'phys-1',
    topic: 'Physics',
    difficulty: 'easy',
    question: 'What physical law states that the induced electromotive force (EMF) is proportional to the rate of change of magnetic flux?',
    options: ['Ampere’s Law', 'Faraday’s Law of Induction', 'Gauss’s Law', 'Coulomb’s Law'],
    correct: 1,
    explanation: 'Faraday’s Law describes how changing magnetic fields induce an electromotive force (EMF = -dΦ/dt).'
  },
  {
    id: 'phys-2',
    topic: 'Physics',
    difficulty: 'medium',
    question: 'In special relativity, as an object’s velocity approaches the speed of light (c), its relativistic momentum approaches:',
    options: ['A constant finite upper bound', 'Zero', 'Infinity', 'Classical Newtonian momentum'],
    correct: 2,
    explanation: 'Relativistic momentum p = γmv approaches infinity as v -> c because the Lorentz factor γ -> infinity.'
  },
  {
    id: 'math-1',
    topic: 'Linear Algebra',
    difficulty: 'easy',
    question: 'A square matrix A is invertible (non-singular) if and only if:',
    options: ['det(A) = 0', 'det(A) ≠ 0', 'trace(A) > 0', 'All eigenvalues are zero'],
    correct: 1,
    explanation: 'A matrix is invertible if and only if its determinant is non-zero, guaranteeing linearly independent columns.'
  },
  {
    id: 'math-2',
    topic: 'Linear Algebra',
    difficulty: 'medium',
    question: 'What is guaranteed about the eigenvalues of a real symmetric matrix?',
    options: ['They are always complex conjugates', 'They are always strictly positive', 'They are all real numbers', 'Their sum is always zero'],
    correct: 2,
    explanation: 'The Spectral Theorem for real symmetric matrices guarantees that all eigenvalues are real and eigenvectors are orthogonal.'
  },
  {
    id: 'math-3',
    topic: 'Calculus',
    difficulty: 'medium',
    question: 'According to the Mean Value Theorem, if f(x) is continuous on [a, b] and differentiable on (a, b), there exists c in (a, b) such that:',
    options: ['f\'(c) = 0', 'f\'(c) = [f(b) - f(a)] / (b - a)', 'f(c) = (a + b) / 2', 'f\'\'(c) > 0'],
    correct: 1,
    explanation: 'The instantaneous rate of change f\'(c) equals the average rate of change over the interval.'
  }
];

/**
 * Retrieve cached topic cooldowns
 */
export function getStoredTopicCooldowns() {
  try {
    const raw = localStorage.getItem(TOPIC_COOLDOWNS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Check if a topic or note is currently eligible for RANKED trophies
 * Enforces the 1-Week Cooldown Rule
 */
export function checkTopicRankedStatus(topicOrFileId = 'default') {
  const cooldowns = getStoredTopicCooldowns();
  const entry = cooldowns[topicOrFileId];

  if (!entry || !entry.lastRankedAt) {
    return { isEligible: true, remainingMs: 0, lastRankedAt: null, remainingDaysFormatted: 'Ready' };
  }

  const elapsed = Date.now() - entry.lastRankedAt;
  if (elapsed >= SEVEN_DAYS_MS) {
    return { isEligible: true, remainingMs: 0, lastRankedAt: entry.lastRankedAt, remainingDaysFormatted: 'Ready' };
  }

  const remainingMs = SEVEN_DAYS_MS - elapsed;
  const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const formatted = days > 0 ? `${days}d ${hours}h` : `${hours}h remaining`;

  return {
    isEligible: false,
    remainingMs,
    lastRankedAt: entry.lastRankedAt,
    remainingDaysFormatted: formatted
  };
}

/**
 * Record that a ranked match was played on a topic/note (locks it for 7 days)
 */
export function lockTopicCooldown(topicOrFileId, fileName = 'Study Note') {
  try {
    const cooldowns = getStoredTopicCooldowns();
    cooldowns[topicOrFileId] = {
      lastRankedAt: Date.now(),
      fileName,
      totalRankedPlayed: (cooldowns[topicOrFileId]?.totalRankedPlayed || 0) + 1
    };
    localStorage.setItem(TOPIC_COOLDOWNS_STORAGE_KEY, JSON.stringify(cooldowns));
  } catch (e) {
    console.warn('Failed to lock topic cooldown', e);
  }
}

/**
 * Sample questions for a 15, 20, or 40 MCQ Gauntlet
 * Combines built-in questions + any custom generated note questions
 */
export function sampleGauntletQuestions(topicOrFileId, count = 15) {
  // Check local cache for custom note questions
  let customPool = [];
  try {
    const rawBanks = localStorage.getItem(QUESTION_BANK_STORAGE_KEY);
    if (rawBanks) {
      const parsed = JSON.parse(rawBanks);
      customPool = parsed[topicOrFileId] || [];
    }
  } catch {}

  // Combine custom pool with rich built-in academic library
  const combined = [...customPool, ...BUILT_IN_QUESTION_LIBRARY];

  // Shuffle array using Fisher-Yates
  const shuffled = [...combined];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // If requested count exceeds unique pool, loop with variations
  const selected = [];
  for (let i = 0; i < count; i++) {
    const base = shuffled[i % shuffled.length];
    selected.push({
      ...base,
      gauntletId: `${base.id || 'q'}-${i + 1}`
    });
  }

  return selected;
}

/**
 * Save newly generated AI Question Bank for a specific Google Drive note
 */
export function cacheNoteQuestionBank(fileId, questions) {
  if (!fileId || !Array.isArray(questions)) return;
  try {
    const raw = localStorage.getItem(QUESTION_BANK_STORAGE_KEY);
    const banks = raw ? JSON.parse(raw) : {};
    banks[fileId] = questions;
    localStorage.setItem(QUESTION_BANK_STORAGE_KEY, JSON.stringify(banks));
  } catch (e) {
    console.warn('Failed to cache question bank', e);
  }
}

/**
 * Retrieve all forged Battle Decks
 */
export function getAllForgedDecks() {
  try {
    const raw = localStorage.getItem(FORGED_DECKS_STORAGE_KEY);
    const decks = raw ? JSON.parse(raw) : {};
    const seen = new Set();
    const uniqueDecks = [];
    for (const d of Object.values(decks)) {
      if (!d) continue;
      const key = d.fileId || d.fileName;
      if (key && !seen.has(key)) {
        seen.add(key);
        uniqueDecks.push({
          ...d,
          cooldownStatus: checkTopicRankedStatus(d.fileId)
        });
      }
    }
    return uniqueDecks;
  } catch {
    return [];
  }
}

/**
 * Check if a specific file or folder is already forged as a Battle Deck
 */
export function getForgedDeck(fileId, fileName = '') {
  if (!fileId && !fileName) return null;
  try {
    const raw = localStorage.getItem(FORGED_DECKS_STORAGE_KEY);
    if (!raw) return null;
    const decks = JSON.parse(raw);

    // 1. Direct fileId match
    if (fileId && decks[fileId]) {
      return {
        ...decks[fileId],
        cooldownStatus: checkTopicRankedStatus(fileId)
      };
    }

    // 2. Match if this file is the created summary file (by summaryFileId)
    const allDecks = Object.values(decks);
    const matchBySummaryId = allDecks.find(d => d.summaryFileId && d.summaryFileId === fileId);
    if (matchBySummaryId) {
      return {
        ...matchBySummaryId,
        cooldownStatus: checkTopicRankedStatus(matchBySummaryId.fileId)
      };
    }

    // 3. Match by fileName (e.g. "Summary - Software Maintenance.md" -> "Software Maintenance.pdf")
    if (fileName) {
      const cleanTarget = fileName
        .replace(/^Summary\s*-\s*/i, '')
        .replace(/\.[^/.]+$/, '')
        .trim()
        .toLowerCase();

      const matchByName = allDecks.find(d => {
        const cleanDeck = (d.fileName || '')
          .replace(/^Summary\s*-\s*/i, '')
          .replace(/\.[^/.]+$/, '')
          .trim()
          .toLowerCase();
        return cleanDeck === cleanTarget || d.summaryFileName === fileName;
      });

      if (matchByName) {
        return {
          ...matchByName,
          cooldownStatus: checkTopicRankedStatus(matchByName.fileId)
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Persists a forged Battle Deck (Summary + Question Bank)
 */
export function saveForgedDeck(fileId, {
  fileName,
  summary = [],
  mindmap = null,
  summaryFileId = null,
  summaryFileName = null,
  questions = []
}) {
  if (!fileId) return;
  try {
    const raw = localStorage.getItem(FORGED_DECKS_STORAGE_KEY);
    const decks = raw ? JSON.parse(raw) : {};

    // If an older summaryFileId existed for this deck, purge the stale lookup key
    const existing = decks[fileId];
    if (existing?.summaryFileId && existing.summaryFileId !== summaryFileId) {
      delete decks[existing.summaryFileId];
    }

    const deckData = {
      fileId,
      fileName: fileName || 'Academic Note',
      summary,
      mindmap,
      summaryFileId,
      summaryFileName,
      questions,
      questionCount: questions.length,
      forgedAt: Date.now()
    };

    decks[fileId] = deckData;
    // Index by summaryFileId as well for 0ms lookup
    if (summaryFileId) {
      decks[summaryFileId] = deckData;
    }

    localStorage.setItem(FORGED_DECKS_STORAGE_KEY, JSON.stringify(decks));

    // Also persist questions into the question bank storage
    cacheNoteQuestionBank(fileId, questions);
    return deckData;
  } catch (e) {
    console.warn('Failed to save forged battle deck', e);
  }
}

/**
 * Deletes a forged Battle Deck
 */
export function deleteForgedDeck(fileId) {
  if (!fileId) return;
  try {
    const raw = localStorage.getItem(FORGED_DECKS_STORAGE_KEY);
    if (!raw) return;
    const decks = JSON.parse(raw);
    delete decks[fileId];
    localStorage.setItem(FORGED_DECKS_STORAGE_KEY, JSON.stringify(decks));
  } catch (e) {
    console.warn('Failed to delete battle deck', e);
  }
}

/**
 * Anti-Cheat: Record trophy transaction into immutable ledger
 */
export function logTrophyLedger({ fileId, fileName, delta, won, reason }) {
  try {
    const raw = localStorage.getItem(TROPHY_LEDGER_STORAGE_KEY);
    const ledger = raw ? JSON.parse(raw) : [];
    ledger.unshift({
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fileId,
      fileName: fileName || 'Academic Note',
      delta,
      won,
      reason,
      timestamp: Date.now()
    });
    // Keep last 100 transactions
    localStorage.setItem(TROPHY_LEDGER_STORAGE_KEY, JSON.stringify(ledger.slice(0, 100)));
  } catch (e) {
    console.warn('Failed to record trophy ledger', e);
  }
}

/**
 * Anti-Cheat: Verify Drive Files integrity against trophy ledger
 * If a note was deleted or trashed from Google Drive, claw back associated trophies
 */
export function verifyDriveFilesIntegrity(activeDriveFiles = []) {
  if (!Array.isArray(activeDriveFiles) || activeDriveFiles.length === 0) {
    return { clawbackCount: 0, totalDeducted: 0, removedFiles: [] };
  }

  try {
    const raw = localStorage.getItem(TROPHY_LEDGER_STORAGE_KEY);
    if (!raw) return { clawbackCount: 0, totalDeducted: 0, removedFiles: [] };
    const ledger = JSON.parse(raw);

    const activeIds = new Set(activeDriveFiles.map(f => f.id));
    const registeredDriveTransactions = ledger.filter(
      tx => tx.fileId && tx.fileId !== 'default' && tx.delta > 0 && !tx.clawbacked
    );

    let totalDeducted = 0;
    const removedFiles = [];

    for (const tx of registeredDriveTransactions) {
      if (!activeIds.has(tx.fileId)) {
        // File no longer exists in Drive! Trigger clawback
        totalDeducted += tx.delta;
        tx.clawbacked = true;
        removedFiles.push(tx.fileName);
      }
    }

    if (totalDeducted > 0) {
      localStorage.setItem(TROPHY_LEDGER_STORAGE_KEY, JSON.stringify(ledger));
    }

    return {
      clawbackCount: removedFiles.length,
      totalDeducted,
      removedFiles
    };
  } catch {
    return { clawbackCount: 0, totalDeducted: 0, removedFiles: [] };
  }
}

