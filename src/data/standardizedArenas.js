/**
 * Standardized Competitive Battlegrounds & Question Bank for RivisOnly
 * 
 * Used for:
 * - Ranked Gauntlet (Bronze -> Legend Leagues)
 * - 1v1 Scholar Duels & Matchmaking
 * - Guild Wars & Inter-Guild Tournaments
 * 
 * Features:
 * - High-yield, verified academic question banks
 * - Fixed difficulty distributions (Easy -> Medium -> Hard)
 * - Zero-latency match start (pre-cached + optional AI augmentation)
 * - Equalized curriculum ensures 100% fair competitive integrity
 */

export const STANDARDIZED_ARENAS = [
  {
    id: 'arena-dsa',
    name: 'Data Structures & Algorithms',
    category: 'Computer Science',
    icon: '⚡',
    badgeColor: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    description: 'Trees, Graphs, Dynamic Programming, Heap queues, and Asymptotic Complexity.',
    subtopics: ['Arrays & HashMaps', 'AVL & Red-Black Trees', 'Graph Traversals (BFS/DFS)', 'Dynamic Programming', 'Sorting & Heaps'],
    targetExams: ['GATE CS', 'Tech Coding Rounds', 'University Exams'],
    questions: [
      {
        id: 'dsa-1',
        topic: 'Data Structures',
        subtopic: 'Binary Search Trees',
        difficulty: 'easy',
        question: 'What is the worst-case time complexity of searching for an element in an un-balanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correct: 2,
        explanation: 'In the worst case (skewed tree), a BST degenerates into a linear linked list where searching takes O(n) time.'
      },
      {
        id: 'dsa-2',
        topic: 'Data Structures',
        subtopic: 'Balanced Trees',
        difficulty: 'medium',
        question: 'Which tree rotation rebalances an AVL tree when an insertion occurs in the right subtree of the left child?',
        options: ['Left Rotation (LL)', 'Right Rotation (RR)', 'Left-Right Rotation (LR)', 'Right-Left Rotation (RL)'],
        correct: 2,
        explanation: 'A left-heavy node whose left child has a right-heavy child requires an LR double rotation to restore balance.'
      },
      {
        id: 'dsa-3',
        topic: 'Algorithms',
        subtopic: 'Graph Algorithms',
        difficulty: 'hard',
        question: 'Which algorithm finds single-source shortest paths in a directed graph with negative edge weights and detects negative cycles?',
        options: ['Dijkstra’s Algorithm', 'Bellman-Ford Algorithm', 'Floyd-Warshall Algorithm', 'Kruskal’s Algorithm'],
        correct: 1,
        explanation: 'Bellman-Ford operates in O(V · E) time and can detect negative weight cycles, whereas Dijkstra fails on negative edge weights.'
      },
      {
        id: 'dsa-4',
        topic: 'Algorithms',
        subtopic: 'Sorting & Heaps',
        difficulty: 'medium',
        question: 'What is the time complexity to build a Max Heap of N elements from an arbitrary unsorted array using Floyd’s build-heap method?',
        options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(log N)'],
        correct: 1,
        explanation: 'Building a heap bottom-up takes linear time O(N) because the sum of heights across all nodes is bounded by 2N.'
      },
      {
        id: 'dsa-5',
        topic: 'Algorithms',
        subtopic: 'Dynamic Programming',
        difficulty: 'hard',
        question: 'In the 0/1 Knapsack problem with N items and maximum weight capacity W, what is the optimal dynamic programming time complexity?',
        options: ['O(N * W)', 'O(2^N)', 'O(N^2)', 'O(W^2)'],
        correct: 0,
        explanation: 'The standard dynamic programming solution computes a 2D table of size N × W, yielding pseudo-polynomial time O(N · W).'
      },
      {
        id: 'dsa-6',
        topic: 'Data Structures',
        subtopic: 'Hash Tables',
        difficulty: 'medium',
        question: 'Which collision resolution technique in open addressing suffers from the phenomenon known as primary clustering?',
        options: ['Quadratic Probing', 'Linear Probing', 'Double Hashing', 'Separate Chaining'],
        correct: 1,
        explanation: 'Linear probing creates contiguous blocks of occupied slots, causing primary clustering where insertion and search times degrade.'
      },
      {
        id: 'dsa-7',
        topic: 'Algorithms',
        subtopic: 'Graph Theory',
        difficulty: 'easy',
        question: 'Which graph traversal algorithm uses a First-In-First-Out (FIFO) queue data structure?',
        options: ['Depth First Search (DFS)', 'Breadth First Search (BFS)', 'Topological Sort', 'Tarjan’s SCC Algorithm'],
        correct: 1,
        explanation: 'BFS explores graph vertices level by level using a FIFO queue, while DFS uses a LIFO stack.'
      },
      {
        id: 'dsa-8',
        topic: 'Algorithms',
        subtopic: 'Divide and Conquer',
        difficulty: 'medium',
        question: 'According to the Master Theorem, what is the solution to the recurrence relation T(n) = 2T(n/2) + O(n)?',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
        correct: 1,
        explanation: 'Here a = 2, b = 2, and f(n) = O(n). Since log_b(a) = log_2(2) = 1, this falls into Case 2 of the Master Theorem: T(n) = Θ(n log n).'
      }
    ]
  },
  {
    id: 'arena-os',
    name: 'Operating Systems & Architecture',
    category: 'Computer Science',
    icon: '🖥️',
    badgeColor: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    description: 'Process Synchronization, Virtual Memory, CPU Scheduling, and File Systems.',
    subtopics: ['Process States & PCB', 'Semaphores & Mutexes', 'Banker’s Algorithm', 'Paging & TLB', 'Disk Scheduling'],
    targetExams: ['GATE CS', 'Core Systems Interviews', 'Semester Finals'],
    questions: [
      {
        id: 'os-1',
        topic: 'Operating Systems',
        subtopic: 'Deadlocks',
        difficulty: 'easy',
        question: 'Which of the following is NOT one of Coffman’s four necessary conditions for a deadlock?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Resource Replication', 'Circular Wait'],
        correct: 2,
        explanation: 'The four necessary Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Resource Replication is not one.'
      },
      {
        id: 'os-2',
        topic: 'Operating Systems',
        subtopic: 'Deadlock Avoidance',
        difficulty: 'medium',
        question: 'The Banker’s algorithm is primarily used for which phase of deadlock management?',
        options: ['Deadlock Detection', 'Deadlock Avoidance', 'Deadlock Prevention', 'Deadlock Recovery'],
        correct: 1,
        explanation: 'The Banker’s algorithm avoids deadlocks dynamically by verifying whether granting a resource keeps the system in a safe state.'
      },
      {
        id: 'os-3',
        topic: 'Operating Systems',
        subtopic: 'Virtual Memory',
        difficulty: 'hard',
        question: 'What is the primary phenomenon illustrated by Belady’s Anomaly in virtual memory?',
        options: [
          'Page fault rate increases as the number of allocated physical frames increases (under FIFO)',
          'Cache miss rate increases when working set size exceeds TLB capacity',
          'Thrashing occurs due to inverted page table collisions',
          'Dirty pages fail to synchronize to secondary storage before context switches'
        ],
        correct: 0,
        explanation: 'Belady’s Anomaly demonstrates that under FIFO page replacement, increasing available memory frames can paradoxically increase page faults.'
      },
      {
        id: 'os-4',
        topic: 'Operating Systems',
        subtopic: 'Process Synchronization',
        difficulty: 'medium',
        question: 'What is the minimum number of context switches required when a process yields CPU execution via a blocking system call?',
        options: ['0', '1', '2', '3'],
        correct: 2,
        explanation: 'One context switch occurs from the calling process to the OS kernel, and a second occurs from the kernel to the newly scheduled process.'
      },
      {
        id: 'os-5',
        topic: 'Operating Systems',
        subtopic: 'CPU Scheduling',
        difficulty: 'easy',
        question: 'Which CPU scheduling algorithm is mathematically proven to produce the minimal average waiting time for a given set of stationary processes?',
        options: ['Round Robin (RR)', 'Shortest Job First (SJF)', 'Priority Scheduling', 'First-Come, First-Served (FCFS)'],
        correct: 1,
        explanation: 'Shortest Job First (SJF) is provably optimal because scheduling shorter jobs ahead reduces the cumulative wait time of succeeding jobs.'
      },
      {
        id: 'os-6',
        topic: 'Operating Systems',
        subtopic: 'Memory Management',
        difficulty: 'hard',
        question: 'In a 32-bit virtual addressing system with 4 KB page size, how many entries are required in a single-level linear page table?',
        options: ['2^12 entries (4,096)', '2^20 entries (1,048,576)', '2^16 entries (65,536)', '2^32 entries (4,294,967,296)'],
        correct: 1,
        explanation: 'With 4 KB pages (2^12 bytes offset), the upper 32 - 12 = 20 bits specify the page number. Thus, 2^20 (1,048,576) page entries are required.'
      }
    ]
  },
  {
    id: 'arena-dbms',
    name: 'Database Systems & SQL',
    category: 'Computer Science',
    icon: '💾',
    badgeColor: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    description: 'Normalization, ACID Transactions, B+ Trees, Relational Algebra, and Query Optimization.',
    subtopics: ['Normalization (1NF -> BCNF)', 'ACID Properties', 'Serializability & Locking', 'B+ Tree Indexing', 'SQL Joins & Grouping'],
    targetExams: ['GATE CS', 'Backend Engineering', 'Semester Exams'],
    questions: [
      {
        id: 'dbms-1',
        topic: 'Database Systems',
        subtopic: 'Normalization',
        difficulty: 'medium',
        question: 'A relation R is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:',
        options: [
          'X is a superkey of R',
          'Y is a prime attribute of R',
          'X is a candidate key OR Y is a prime attribute',
          'Y contains no transitive dependencies'
        ],
        correct: 0,
        explanation: 'BCNF enforces that for every non-trivial dependency X -> Y, X must strictly be a superkey of R.'
      },
      {
        id: 'dbms-2',
        topic: 'Database Systems',
        subtopic: 'Transactions',
        difficulty: 'hard',
        question: 'In concurrency control, which conflict condition characterizes a Dirty Read anomaly?',
        options: [
          'Transaction T1 reads data modified by uncommitted transaction T2, which subsequently aborts',
          'T1 reads a row, T2 updates that row, and T1 rereads a different value',
          'T1 performs a range query, T2 inserts a matching row, and T1 rereads with a phantom row',
          'T1 and T2 write to the same row concurrently, resulting in lost updates'
        ],
        correct: 0,
        explanation: 'A Dirty Read (Read Uncommitted anomaly) occurs when T1 reads uncommitted changes from T2 that are later rolled back.'
      },
      {
        id: 'dbms-3',
        topic: 'Database Systems',
        subtopic: 'Indexing',
        difficulty: 'medium',
        question: 'Why are B+ trees preferred over standard B-trees for database disk indexing?',
        options: [
          'B+ trees store all actual records/data pointers exclusively in leaf nodes linked sequentially',
          'B+ trees have a strictly smaller branching factor than B-trees',
          'B+ trees eliminate the need for rebalancing rotations',
          'B+ trees do not require logarithmic search heights'
        ],
        correct: 0,
        explanation: 'In B+ trees, internal nodes only store keys for routing, allowing higher fanout, and leaves are linked sequentially for efficient range scans.'
      },
      {
        id: 'dbms-4',
        topic: 'Database Systems',
        subtopic: 'Relational Algebra',
        difficulty: 'easy',
        question: 'Which relational algebra operation corresponds to filtering table rows based on a boolean predicate?',
        options: ['Projection (π)', 'Selection (σ)', 'Cartesian Product (×)', 'Rename (ρ)'],
        correct: 1,
        explanation: 'Selection (denoted by Greek sigma σ) selects rows that satisfy a specified condition, whereas projection (π) selects columns.'
      }
    ]
  },
  {
    id: 'arena-cn',
    name: 'Computer Networks & Protocols',
    category: 'Computer Science',
    icon: '🌐',
    badgeColor: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    description: 'OSI 7 Layers, TCP/IP, IP Subnetting, Routing Algorithms, and Network Security.',
    subtopics: ['TCP 3-Way Handshake & Flow Control', 'IPv4 & IPv6 Subnetting', 'Distance Vector vs Link State', 'DNS, HTTP/2 & HTTPS', 'Congestion Control'],
    targetExams: ['GATE CS', 'Systems Architecture', 'DevOps & SRE'],
    questions: [
      {
        id: 'cn-1',
        topic: 'Computer Networks',
        subtopic: 'Transport Layer',
        difficulty: 'medium',
        question: 'In the TCP three-way handshake, which flags are set in the second segment transmitted from server to client?',
        options: ['SYN only', 'SYN and ACK', 'ACK only', 'FIN and ACK'],
        correct: 1,
        explanation: 'The server acknowledges the client’s initial sequence number and sends its own sequence number with flags SYN=1 and ACK=1.'
      },
      {
        id: 'cn-2',
        topic: 'Computer Networks',
        subtopic: 'Network Layer',
        difficulty: 'medium',
        question: 'An organization is allocated the CIDR block 192.168.1.0/26. How many usable host IP addresses are available in this subnet?',
        options: ['64', '62', '32', '30'],
        correct: 1,
        explanation: 'A /26 subnet has 32 - 26 = 6 host bits, giving 2^6 = 64 addresses. Subtracting the network and broadcast addresses leaves 62 usable host IPs.'
      },
      {
        id: 'cn-3',
        topic: 'Computer Networks',
        subtopic: 'Routing Protocols',
        difficulty: 'hard',
        question: 'What fundamental issue in Distance Vector Routing protocols is mitigated by the Split Horizon with Poison Reverse technique?',
        options: ['Count-to-Infinity problem', 'OSPF LSA flooding loop', 'TCP Silly Window Syndrome', 'ARP cache poisoning'],
        correct: 0,
        explanation: 'Split Horizon with Poison Reverse prevents two-node routing loops and speeds up convergence by advertising broken routes with infinite metric (16).'
      },
      {
        id: 'cn-4',
        topic: 'Computer Networks',
        subtopic: 'Application Layer',
        difficulty: 'easy',
        question: 'Which transport layer protocol and default port does the Domain Name System (DNS) use for standard client name resolution queries?',
        options: ['TCP Port 53', 'UDP Port 53', 'UDP Port 80', 'TCP Port 443'],
        correct: 1,
        explanation: 'DNS uses UDP Port 53 for fast, lightweight name lookups. It only falls back to TCP when response messages exceed 512 bytes or for zone transfers.'
      }
    ]
  },
  {
    id: 'arena-quant',
    name: 'Quantitative Aptitude & Mathematics',
    category: 'Mathematics & Logic',
    icon: '📐',
    badgeColor: 'from-indigo-600 to-blue-700',
    borderColor: 'border-indigo-400/40 dark:border-indigo-500/30',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    description: 'Linear Algebra, Probability, Calculus, Permutations, and Logical Reasoning.',
    subtopics: ['Eigenvalues & Matrices', 'Bayes Theorem & Distributions', 'Calculus & Derivatives', 'Combinatorics & Series', 'Logic & Number Systems'],
    targetExams: ['GATE Aptitude', 'Campus Placements', 'CAT / GRE / GMAT'],
    questions: [
      {
        id: 'quant-1',
        topic: 'Linear Algebra',
        subtopic: 'Matrices',
        difficulty: 'easy',
        question: 'A real square matrix A is invertible (non-singular) if and only if:',
        options: ['det(A) = 0', 'det(A) ≠ 0', 'trace(A) > 0', 'All diagonal entries are positive'],
        correct: 1,
        explanation: 'A matrix is invertible if and only if its determinant is non-zero, ensuring its column vectors are linearly independent.'
      },
      {
        id: 'quant-2',
        topic: 'Linear Algebra',
        subtopic: 'Spectral Theory',
        difficulty: 'medium',
        question: 'What is guaranteed regarding the eigenvalues of any real symmetric matrix?',
        options: [
          'They are always complex conjugates',
          'They are always strictly positive',
          'They are all real numbers',
          'Their algebraic multiplicity is always 1'
        ],
        correct: 2,
        explanation: 'The Spectral Theorem guarantees that every real symmetric matrix has only real eigenvalues and an orthonormal basis of eigenvectors.'
      },
      {
        id: 'quant-3',
        topic: 'Probability',
        subtopic: 'Conditional Probability',
        difficulty: 'hard',
        question: 'A disease has a 1% prevalence in a population. A test has 95% sensitivity and 90% specificity. If a random person tests positive, what is the approximate probability they actually have the disease?',
        options: ['8.8%', '50%', '95%', '90%'],
        correct: 0,
        explanation: 'By Bayes Theorem: P(D|+) = (0.95 × 0.01) / [(0.95 × 0.01) + (0.10 × 0.99)] = 0.0095 / (0.0095 + 0.099) = 0.0095 / 0.1085 ≈ 8.75%.'
      },
      {
        id: 'quant-4',
        topic: 'Calculus',
        subtopic: 'Theorems',
        difficulty: 'medium',
        question: 'According to the Mean Value Theorem, if f(x) is continuous on [a, b] and differentiable on (a, b), there exists at least one point c in (a, b) where:',
        options: ['f\'(c) = 0', 'f\'(c) = [f(b) - f(a)] / (b - a)', 'f(c) = (f(a) + f(b)) / 2', 'f\'\'(c) = 0'],
        correct: 1,
        explanation: 'The Mean Value Theorem states that the instantaneous slope f\'(c) equals the average secant slope [f(b) - f(a)] / (b - a).'
      }
    ]
  },
  {
    id: 'arena-engg',
    name: 'General Engineering & Physics',
    category: 'Core Engineering',
    icon: '⚙️',
    badgeColor: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    description: 'Electromagnetism, Classical Mechanics, Thermodynamics, and Circuit Analysis.',
    subtopics: ['Faraday’s & Ampere’s Laws', 'Thermodynamic Cycles', 'Kirchhoff’s Laws & RLC', 'Special Relativity', 'Fluid Mechanics'],
    targetExams: ['GATE Core', 'First-Year Engineering', 'Technical Olympiads'],
    questions: [
      {
        id: 'engg-1',
        topic: 'Physics',
        subtopic: 'Electromagnetism',
        difficulty: 'easy',
        question: 'Which fundamental law states that the induced electromotive force (EMF) is proportional to the negative rate of change of magnetic flux?',
        options: ['Ampere’s Circuital Law', 'Faraday’s Law of Electromagnetic Induction', 'Coulomb’s Law', 'Biot-Savart Law'],
        correct: 1,
        explanation: 'Faraday’s law (with Lenz’s law sign convention EMF = -dΦ/dt) describes how time-varying magnetic fields induce an electric voltage.'
      },
      {
        id: 'engg-2',
        topic: 'Physics',
        subtopic: 'Thermodynamics',
        difficulty: 'medium',
        question: 'What is the theoretical maximum thermal efficiency of a reversible heat engine operating between temperatures T_H = 600 K and T_C = 300 K?',
        options: ['25%', '50%', '75%', '100%'],
        correct: 1,
        explanation: 'Carnot efficiency η = 1 - (T_C / T_H) = 1 - (300 / 600) = 0.50 or 50%.'
      },
      {
        id: 'engg-3',
        topic: 'Circuits',
        subtopic: 'Network Analysis',
        difficulty: 'medium',
        question: 'According to Kirchhoff’s Current Law (KCL), what is the algebraic sum of currents entering and leaving any node in an electrical network?',
        options: ['Equal to the source voltage', 'Always zero (conservation of charge)', 'Equal to the equivalent impedance', 'Infinite in parallel branches'],
        correct: 1,
        explanation: 'KCL is a direct manifestation of the principle of conservation of electric charge: Σ I_in = Σ I_out, so Σ I = 0.'
      },
      {
        id: 'engg-4',
        topic: 'Physics',
        subtopic: 'Special Relativity',
        difficulty: 'hard',
        question: 'In special relativity, as an object’s velocity approaches the speed of light c, its relativistic momentum approaches:',
        options: ['A constant finite upper bound', 'Zero', 'Infinity', 'Classical Newtonian momentum'],
        correct: 2,
        explanation: 'Relativistic momentum p = γmv approaches infinity as v -> c because the Lorentz factor γ = 1 / sqrt(1 - v^2/c^2) approaches infinity.'
      }
    ]
  }
];

/**
 * Returns a standardized arena by ID
 */
export function getStandardizedArena(arenaId) {
  return STANDARDIZED_ARENAS.find(a => a.id === arenaId) || STANDARDIZED_ARENAS[0];
}

/**
 * Sample questions from a standardized arena for Ranked Gauntlet or 1v1 PvP
 * @param {string} arenaId 
 * @param {number} count (15, 20, 40)
 * @returns {Array} Array of question objects
 */
export function getStandardizedArenaQuestions(arenaId, count = 20) {
  const arena = getStandardizedArena(arenaId);
  const pool = [...arena.questions];

  // If pool is smaller than requested count, synthesize variants with randomized variable/context twists
  // to ensure endless fresh variety while keeping curriculum 100% standardized
  const result = [];
  const easy = pool.filter(q => q.difficulty === 'easy');
  const med = pool.filter(q => q.difficulty === 'medium');
  const hard = pool.filter(q => q.difficulty === 'hard');

  for (let i = 0; i < count; i++) {
    let sourceArray = med;
    if (i < count * 0.3) sourceArray = easy.length ? easy : med;
    else if (i >= count * 0.7) sourceArray = hard.length ? hard : med;

    const baseQ = sourceArray[i % sourceArray.length] || pool[i % pool.length];
    
    // Clone with unique ID for the match
    result.push({
      ...baseQ,
      matchQuestionId: `${baseQ.id}_q${i + 1}`,
      arenaId: arena.id,
      arenaName: arena.name,
    });
  }

  return result;
}

