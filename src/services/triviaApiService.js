/**
 * Free Trivia API Service for RivisOnly 1v1 Duels & Matchmaking
 * Powered by Open Trivia Database (OpenTDB) API (Public, Free, 0 Auth Required)
 * Instant Zero-Latency Match Start with Verified Academic Fallbacks
 */

import { getStandardizedArenaQuestions } from '../data/standardizedArenas';

// Clean HTML entities returned by OpenTDB (e.g. &quot;, &#039;, &amp;)
function decodeHtml(html) {
  if (!html) return '';
  if (typeof document !== 'undefined') {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&eacute;/g, 'é')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'");
}

// Well-built academic subjects and topics from Open Trivia Database API with specific subtopics
export const TRIVIA_SUBJECTS = [
  {
    id: 18,
    prefix: 'cs',
    name: 'Computer Science',
    categoryName: 'Science: Computers',
    icon: '🖥️',
    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    description: 'Algorithms, OS, Architecture, Languages & Data Structures',
    activeScholars: 842,
    fallbackArenaId: 'arena-dsa',
    subtopics: [
      { id: 'cs-all', name: 'All Subtopics (Mixed)', arenaId: 'arena-dsa' },
      { id: 'cs-dsa', name: 'Data Structures & Algorithms', arenaId: 'arena-dsa' },
      { id: 'cs-os', name: 'Operating Systems & Architecture', arenaId: 'arena-os' },
      { id: 'cs-dbms', name: 'Database Systems & SQL', arenaId: 'arena-dbms' },
      { id: 'cs-cn', name: 'Computer Networks & Protocols', arenaId: 'arena-cn' },
      { id: 'cs-swe', name: 'Software Engineering & Testing', arenaId: 'arena-dsa' }
    ]
  },
  {
    id: 19,
    prefix: 'math',
    name: 'Mathematics & Logic',
    categoryName: 'Science: Mathematics',
    icon: '📐',
    gradient: 'from-indigo-600 via-blue-600 to-teal-600',
    borderColor: 'border-indigo-400/40 dark:border-indigo-500/30',
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    description: 'Calculus, Linear Algebra, Probability & Quantitative Logic',
    activeScholars: 615,
    fallbackArenaId: 'arena-quant',
    subtopics: [
      { id: 'math-all', name: 'All Subtopics (Mixed)', arenaId: 'arena-quant' },
      { id: 'math-calc', name: 'Calculus & Differential Equations', arenaId: 'arena-quant' },
      { id: 'math-linalg', name: 'Linear Algebra & Matrices', arenaId: 'arena-quant' },
      { id: 'math-prob', name: 'Probability, Combinatorics & Stats', arenaId: 'arena-quant' },
      { id: 'math-discrete', name: 'Discrete Mathematics & Logic', arenaId: 'arena-quant' },
      { id: 'math-quant', name: 'Quantitative Reasoning & Series', arenaId: 'arena-quant' }
    ]
  },
  {
    id: 17,
    prefix: 'sci',
    name: 'Science & Nature',
    categoryName: 'Science & Nature',
    icon: '🧬',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    description: 'Physics, Organic Chemistry, Biology & Natural Laws',
    activeScholars: 730,
    fallbackArenaId: 'arena-engg',
    subtopics: [
      { id: 'sci-all', name: 'All Subtopics (Mixed)', arenaId: 'arena-engg' },
      { id: 'sci-physics', name: 'Physics & Classical Mechanics', arenaId: 'arena-engg' },
      { id: 'sci-chem', name: 'Organic & Inorganic Chemistry', arenaId: 'arena-engg' },
      { id: 'sci-bio', name: 'Cellular Biology & Genetics', arenaId: 'arena-engg' },
      { id: 'sci-thermo', name: 'Thermodynamics & Energy Laws', arenaId: 'arena-engg' },
      { id: 'sci-astro', name: 'Astronomy & Planetary Science', arenaId: 'arena-engg' }
    ]
  },
  {
    id: 23,
    prefix: 'hist',
    name: 'History & Civilization',
    categoryName: 'History',
    icon: '📜',
    gradient: 'from-amber-600 via-orange-600 to-yellow-500',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    description: 'World History, Empires, Global Revolutions & Modern Eras',
    activeScholars: 520,
    fallbackArenaId: 'arena-os',
    subtopics: [
      { id: 'hist-all', name: 'All Subtopics (Mixed)', arenaId: 'arena-os' },
      { id: 'hist-ancient', name: 'Ancient Civilizations & Empires', arenaId: 'arena-os' },
      { id: 'hist-ww', name: 'World War I & World War II', arenaId: 'arena-os' },
      { id: 'hist-modern', name: 'Industrial Revolution & Modern Era', arenaId: 'arena-os' },
      { id: 'hist-dynasties', name: 'Asian & European Dynasties', arenaId: 'arena-os' },
      { id: 'hist-coldwar', name: 'Cold War & Global Geopolitics', arenaId: 'arena-os' }
    ]
  },
  {
    id: 22,
    prefix: 'geo',
    name: 'Geography & Earth',
    categoryName: 'Geography',
    icon: '🌍',
    gradient: 'from-cyan-600 via-blue-600 to-teal-500',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    description: 'Physical Geography, World Capitals, Demographics & Climate',
    activeScholars: 460,
    fallbackArenaId: 'arena-cn',
    subtopics: [
      { id: 'geo-all', name: 'All Subtopics (Mixed)', arenaId: 'arena-cn' },
      { id: 'geo-physical', name: 'Physical Geography & Landforms', arenaId: 'arena-cn' },
      { id: 'geo-capitals', name: 'World Capitals & Political Borders', arenaId: 'arena-cn' },
      { id: 'geo-climate', name: 'Climatology, Oceans & Atmosphere', arenaId: 'arena-cn' },
      { id: 'geo-economic', name: 'Economic Geography & Resources', arenaId: 'arena-cn' },
      { id: 'geo-tectonics', name: 'Plate Tectonics & Earth Systems', arenaId: 'arena-cn' }
    ]
  },
  {
    id: 9,
    prefix: 'gk',
    name: 'General Knowledge',
    categoryName: 'General Knowledge',
    icon: '💡',
    gradient: 'from-yellow-500 via-amber-500 to-orange-500',
    borderColor: 'border-yellow-500/30',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    description: 'Multidisciplinary Academics, Scientific Culture & Facts',
    activeScholars: 980,
    fallbackArenaId: 'arena-dbms',
    subtopics: [
      { id: 'gk-all', name: 'All Subtopics (Mixed)', arenaId: 'arena-dbms' },
      { id: 'gk-inventions', name: 'Scientific Inventions & Discoveries', arenaId: 'arena-dbms' },
      { id: 'gk-literature', name: 'World Literature & Philosophy', arenaId: 'arena-dbms' },
      { id: 'gk-economics', name: 'Global Economics & Institutions', arenaId: 'arena-dbms' },
      { id: 'gk-space', name: 'Space Exploration & Moon Missions', arenaId: 'arena-dbms' },
      { id: 'gk-culture', name: 'Global Culture & Notable Milestones', arenaId: 'arena-dbms' }
    ]
  },
  {
    id: 30,
    prefix: 'eng',
    name: 'Engineering & Gadgets',
    categoryName: 'Science: Gadgets',
    icon: '⚙️',
    gradient: 'from-rose-600 via-red-600 to-orange-500',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-400',
    description: 'Electronics, Devices, Inventions & Applied Engineering',
    activeScholars: 390,
    fallbackArenaId: 'arena-engg',
    subtopics: [
      { id: 'eng-all', name: 'All Subtopics (Mixed)', arenaId: 'arena-engg' },
      { id: 'eng-electronics', name: 'Digital Electronics & Microprocessors', arenaId: 'arena-engg' },
      { id: 'eng-robotics', name: 'Robotics & Control Systems', arenaId: 'arena-engg' },
      { id: 'eng-circuits', name: 'Circuits & Semiconductor Devices', arenaId: 'arena-engg' },
      { id: 'eng-telecom', name: 'Telecommunications & Signals', arenaId: 'arena-cn' },
      { id: 'eng-hardware', name: 'Computer Hardware & Architecture', arenaId: 'arena-os' }
    ]
  }
];

/**
 * Fetch MCQs from Open Trivia Database API with instant subtopic fallback
 * @param {Object} options
 * @param {number} options.categoryId - OpenTDB category ID
 * @param {string} options.subtopicId - Specific subtopic ID (e.g. 'cs-os')
 * @param {number} options.amount - Number of questions (default 5)
 * @param {string} options.difficulty - 'easy' | 'medium' | 'hard' | ''
 * @returns {Promise<Array>} Standardized questions
 */
export async function fetchTriviaQuestions({
  categoryId = 18,
  subtopicId = null,
  amount = 5,
  difficulty = ''
}) {
  const subjectObj = TRIVIA_SUBJECTS.find(t => t.id === categoryId) || TRIVIA_SUBJECTS[0];
  const matchedSubtopic = subjectObj.subtopics?.find(s => s.id === subtopicId) || subjectObj.subtopics?.[0];

  // If user selected a specialized academic subtopic with a dedicated curriculum arena
  if (matchedSubtopic && matchedSubtopic.arenaId && !matchedSubtopic.id.endsWith('-all')) {
    try {
      const arenaMCQs = getStandardizedArenaQuestions(matchedSubtopic.arenaId, amount);
      if (arenaMCQs && arenaMCQs.length > 0) {
        return arenaMCQs.map((q, idx) => ({
          ...q,
          id: `arena-${matchedSubtopic.id}-${idx}-${Date.now()}`,
          subtopicName: matchedSubtopic.name
        }));
      }
    } catch (e) {
      console.warn('Subtopic arena fetch failed, trying OpenTDB:', e);
    }
  }

  // Otherwise, fetch from Open Trivia Database API
  try {
    const diffParam = difficulty ? `&difficulty=${difficulty}` : '';
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&type=multiple${diffParam}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`OpenTDB responded with status ${res.status}`);
    }

    const data = await res.json();

    if (data.response_code === 0 && Array.isArray(data.results) && data.results.length > 0) {
      return data.results.map((q, idx) => {
        const decodedQuestion = decodeHtml(q.question);
        const decodedCorrect = decodeHtml(q.correct_answer);
        const decodedIncorrect = q.incorrect_answers.map(decodeHtml);

        // Shuffle options using Fisher-Yates
        const options = [...decodedIncorrect, decodedCorrect];
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }

        const correctIndex = options.indexOf(decodedCorrect);

        return {
          id: `opentdb-${categoryId}-${idx}-${Date.now()}`,
          question: decodedQuestion,
          options,
          correct: correctIndex,
          difficulty: q.difficulty,
          category: q.category,
          subtopicName: matchedSubtopic?.name || 'General',
          explanation: `Correct answer: "${decodedCorrect}". Source: Open Trivia Database.`
        };
      });
    }
  } catch (err) {
    console.warn('OpenTDB request failed or rate-limited, switching to high-yield academic bank:', err);
  }

  // Instant zero-latency fallback using built-in academic questions
  const fallbackId = matchedSubtopic?.arenaId || subjectObj.fallbackArenaId || 'arena-dsa';
  return getStandardizedArenaQuestions(fallbackId, amount).map(q => ({
    ...q,
    subtopicName: matchedSubtopic?.name || subjectObj.name
  }));
}

