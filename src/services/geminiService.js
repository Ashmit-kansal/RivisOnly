/**
 * Gemini AI Service for Rivisonly
 * Supports Hybrid Quota:
 * 1. User's personal free key (from localStorage)
 * 2. Shared default key (from import.meta.env.VITE_GEMINI_API_KEY)
 * Auto-detects supported model (gemini-2.0-flash, gemini-1.5-flash, gemini-1.5-pro, etc.)
 */

export const GEMINI_STORAGE_KEY = 'rivisonly_gemini_api_key';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// Cache the working model and ordered candidates once discovered
let cachedWorkingModel = null;
let cachedCandidateModels = null;

export const PREFERRED_MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-2.5-pro',
  'gemini-2.5-flash-lite',
  'gemini-pro-latest'
];

/**
 * Retrieves the effective Gemini API key:
 * Priority: User's custom key in localStorage > App environment key > null
 */
export function getEffectiveGeminiKey() {
  try {
    const userKey = localStorage.getItem(GEMINI_STORAGE_KEY);
    if (userKey && userKey.trim().length > 5) {
      return userKey.trim();
    }
  } catch (err) {
    console.warn('Could not read user key from localStorage:', err);
  }

  const appKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (appKey && appKey.trim().length > 5) {
    return appKey.trim();
  }

  return null;
}

/**
 * Checks whether user has plugged in their own personal key
 */
export function hasUserCustomKey() {
  try {
    const userKey = localStorage.getItem(GEMINI_STORAGE_KEY);
    return Boolean(userKey && userKey.trim().length > 5);
  } catch {
    return false;
  }
}

/**
 * Save user's personal key to localStorage
 */
export function saveUserCustomKey(key) {
  if (!key) return;
  localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  cachedWorkingModel = null; // Clear cached model for fresh validation
  cachedCandidateModels = null;
}

/**
 * Remove user's personal key
 */
export function removeUserCustomKey() {
  localStorage.removeItem(GEMINI_STORAGE_KEY);
  cachedWorkingModel = null;
  cachedCandidateModels = null;
}

/**
 * Queries Google's ListModels endpoint to detect supported models for this specific API key
 * and returns an ordered list of viable candidates.
 */
export async function getCandidateModels(apiKey) {
  if (cachedCandidateModels && cachedCandidateModels.length > 0) {
    return cachedCandidateModels;
  }

  try {
    const res = await fetch(`${API_BASE}/models?key=${apiKey}`, {
      headers: { 'x-goog-api-key': apiKey }
    });
    if (res.ok) {
      const data = await res.json();
      const rawModels = (data.models || [])
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .map(m => m.name.replace(/^models\//, ''));

      // Filter strictly for viable text/multimodal LLMs
      // (Exclude TTS, audio transcribe, image generation, robotics, lyria music, computer-use)
      const viableModels = rawModels.filter(name => {
        const lower = name.toLowerCase();
        return (
          !lower.includes('tts') &&
          !lower.includes('image') &&
          !lower.includes('transcribe') &&
          !lower.includes('clip') &&
          !lower.includes('lyria') &&
          !lower.includes('robotics') &&
          !lower.includes('computer-use') &&
          !lower.includes('customtools')
        );
      });

      console.log('[Rivis AI] Viable LLM models detected:', viableModels);

      // Order preferred models first, then cap at top 3 viable models
      const preferred = PREFERRED_MODELS.filter(m => viableModels.includes(m));
      const remaining = viableModels.filter(m => !PREFERRED_MODELS.includes(m));
      const ordered = [...preferred, ...remaining].slice(0, 3);

      if (ordered.length > 0) {
        cachedCandidateModels = ordered;
        if (!cachedWorkingModel) cachedWorkingModel = ordered[0];
        console.log('[Rivis AI] Active model candidates:', ordered);
        return ordered;
      }
    }
  } catch (err) {
    console.warn('Could not query model list, using preferred list fallback:', err);
  }

  cachedCandidateModels = PREFERRED_MODELS;
  return PREFERRED_MODELS;
}

/**
 * Retrieves the currently selected best working model
 */
export async function getBestWorkingModel(apiKey) {
  if (cachedWorkingModel) return cachedWorkingModel;
  const candidates = await getCandidateModels(apiKey);
  return candidates[0] || 'gemini-flash-lite-latest';
}

/**
 * Robust JSON Parser that handles markdown wrappers, trailing commas,
 * unescaped string control characters, and truncated JSON segments.
 */
export function robustParseJson(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  let clean = rawText.trim();
  // 1. Strip markdown fences
  const codeBlockMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    clean = codeBlockMatch[1].trim();
  }

  // 2. Direct JSON.parse
  try {
    return JSON.parse(clean);
  } catch {}

  // 3. Extract outermost { ... }
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = clean.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {}

    // 4. Try sanitizing trailing commas and literal control characters
    try {
      const sanitized = candidate
        .replace(/,\s*([\]}])/g, '$1')
        .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, '');
      return JSON.parse(sanitized);
    } catch {}
  }

  // 5. Section-by-section regex recovery (if output was cut off at the end)
  const result = {};

  try {
    const mindmapMatch = clean.match(/"mindmap"\s*:\s*(\{[\s\S]*?\n\s*\})/);
    if (mindmapMatch) {
      result.mindmap = JSON.parse(mindmapMatch[1]);
    }
  } catch {}

  try {
    const summaryMatch = clean.match(/"summary"\s*:\s*(\[\s*\{[\s\S]*?\}\s*\])/);
    if (summaryMatch) {
      result.summary = JSON.parse(summaryMatch[1]);
    }
  } catch {}

  try {
    const questionsMatch = clean.match(/"questions"\s*:\s*(\[\s*\{[\s\S]*?\}\s*\])/);
    if (questionsMatch) {
      result.questions = JSON.parse(questionsMatch[1]);
    }
  } catch {}

  if (result.mindmap || result.summary) {
    return result;
  }

  return null;
}

/**
 * Internal robust fetcher that supports text & multimodal parts (PDFs, slides, images)
 * and tries candidate models with fallback
 */
async function callGeminiAPI({
  activeKey,
  prompt,
  fileData = null,
  temperature = 0.3,
  maxTokens = 2500,
  responseMimeType = null
}) {
  const candidateModels = await getCandidateModels(activeKey);
  const modelsToTry = cachedWorkingModel
    ? [cachedWorkingModel, ...candidateModels.filter(m => m !== cachedWorkingModel)]
    : candidateModels;

  let lastError = null;

  // Build request parts: if fileData (PDF base64) is provided, place it first
  const parts = [];
  if (fileData?.base64) {
    let safeMime = fileData.mimeType || 'application/pdf';
    if (safeMime === 'application/octet-stream' || !safeMime.includes('/')) {
      safeMime = 'application/pdf';
    }
    parts.push({
      inlineData: {
        mimeType: safeMime,
        data: fileData.base64
      }
    });
  }
  if (prompt) {
    parts.push({ text: prompt });
  }

  for (const model of modelsToTry) {
    const t0 = Date.now();
    console.log(`[Rivis AI] Calling model "${model}" (${parts.length} parts, ${responseMimeType || 'raw text'})...`);

    // 35s timeout to guarantee we never hang indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      const url = `${API_BASE}/models/${model}:generateContent?key=${activeKey}`;
      const generationConfig = {
        temperature,
        maxOutputTokens: maxTokens
      };
      if (responseMimeType) {
        generationConfig.responseMimeType = responseMimeType;
      }

      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': activeKey
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig
        }),
        signal: controller.signal
      });

      // If model does not support responseMimeType (e.g. 400), retry without it
      if (response.status === 400 && responseMimeType) {
        delete generationConfig.responseMimeType;
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': activeKey
          },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig
          }),
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);

      if (response.ok) {
        cachedWorkingModel = model; // Lock in working model
        const data = await response.json();
        console.log(`[Rivis AI] Model "${model}" completed in ${Date.now() - t0}ms`);
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }

      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error?.message || `Gemini API error (${response.status})`;

      console.warn(`[Rivis AI] Model "${model}" failed (${response.status}: ${message}), trying next candidate...`);

      // 404, 503, 400 or transient failure -> try next candidate
      if (
        response.status === 404 ||
        response.status === 503 ||
        response.status === 400 ||
        response.status === 500 ||
        message.includes('not found') ||
        message.includes('no longer available') ||
        message.includes('not supported') ||
        message.includes('high demand')
      ) {
        lastError = new Error(message);
        continue;
      }

      // 429 Rate limit / quota
      if (response.status === 429) {
        lastError = new Error(message);
        lastError.code = 'QUOTA_EXCEEDED';
        continue;
      }

      const err = new Error(message);
      err.status = response.status;
      if (response.status === 403 || message.toLowerCase().includes('api key')) {
        err.code = 'INVALID_KEY';
      }
      throw err;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.warn(`[Rivis AI] Model "${model}" timed out after 35s, trying next candidate...`);
        lastError = new Error(`Model ${model} timed out`);
        continue;
      }
      if (err.code === 'INVALID_KEY') {
        throw err;
      }
      lastError = err;
    }
  }

  throw lastError || new Error('All candidate Gemini models failed to respond.');
}

/**
 * Validates a Gemini API Key with a lightweight ping
 */
export async function testGeminiApiKey(key) {
  if (!key || typeof key !== 'string' || key.trim().length < 10) {
    throw new Error('Please enter a valid Gemini API key.');
  }

  const cleanKey = key.trim();
  await callGeminiAPI({
    activeKey: cleanKey,
    prompt: 'Respond with the word "VALID" only.',
    maxTokens: 10
  });

  return true;
}

/**
 * Generates Structured AI Key Points for a lecture note (supports multimodal PDF)
 */
export async function generateKeyPointsWithGemini({ noteTitle, noteContent, fileData = null, customKey }) {
  const activeKey = customKey || getEffectiveGeminiKey();
  if (!activeKey) {
    const error = new Error('NO_API_KEY');
    error.code = 'NO_API_KEY';
    throw error;
  }

  const prompt = `You are an expert academic tutor and exam preparation assistant.
Analyze the provided academic lecture note / document titled "${noteTitle || 'Study Note'}".

Extract 3 to 4 high-yield, exam-critical key takeaway concepts formatted strictly as a JSON array of objects.
Each object must have:
- "title": A concise concept title (e.g., "Reaction Kinetics & Rate Law")
- "content": A 2-3 sentence clear, high-yield explanation focusing on what students must understand and remember for exams based on the document.
- "formula": Optional formula, equation, rule or null.

${noteContent ? `DOCUMENT TEXT:\n${noteContent.slice(0, 20000)}` : `(Analyze the attached document).`}

Respond strictly with valid JSON array:
[
  { "title": "...", "content": "...", "formula": null }
]`;

  const rawText = await callGeminiAPI({
    activeKey,
    prompt,
    fileData,
    temperature: 0.2,
    maxTokens: 2000,
    responseMimeType: 'application/json'
  });

  const parsed = robustParseJson(rawText);
  const list = Array.isArray(parsed) ? parsed : (parsed?.summary || []);

  if (Array.isArray(list) && list.length > 0) {
    return list.map(p => ({
      title: p.title || 'Key Takeaway',
      content: p.content || 'Important academic concept.',
      formula: p.formula || null
    }));
  }

  // Fallback if model returned prose or partial
  return [
    {
      title: `Core Synthesis: ${(noteTitle || 'Study Material').replace(/\.[^/.]+$/, '')}`,
      content: rawText.slice(0, 350) || 'Synthesized high-yield concept framework for exam retention.'
    }
  ];
}

/**
 * Generates Structured Quiz Questions from a lecture note (supports multimodal PDF)
 */
export async function generateQuizWithGemini({ noteTitle, noteContent, count = 5, fileData = null, customKey }) {
  const activeKey = customKey || getEffectiveGeminiKey();
  if (!activeKey) {
    const error = new Error('NO_API_KEY');
    error.code = 'NO_API_KEY';
    throw error;
  }

  const prompt = `You are a university exam professor creating an active-recall proficiency quiz.
Based on the provided academic document titled "${noteTitle || 'Study Note'}", generate ${count} challenging multiple-choice questions.

Output strictly as a JSON array of ${count} question objects:
[
  {
    "id": 1,
    "question": "Clear question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Brief explanation of why this answer is correct."
  }
]

${noteContent ? `DOCUMENT TEXT:\n${noteContent.slice(0, 20000)}` : `(Read and analyze the attached document file).`}

Respond strictly with JSON array.`;

  const rawText = await callGeminiAPI({
    activeKey,
    prompt,
    fileData,
    temperature: 0.3,
    maxTokens: 3000,
    responseMimeType: 'application/json'
  });

  const parsed = robustParseJson(rawText);
  const list = Array.isArray(parsed) ? parsed : (parsed?.questions || []);

  if (Array.isArray(list) && list.length > 0) {
    return list.map((q, idx) => ({
      id: q.id || idx + 1,
      question: q.question || 'Academic question',
      options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['True', 'False'],
      correct: typeof q.correct === 'number' ? q.correct : (typeof q.correctIndex === 'number' ? q.correctIndex : 0),
      explanation: q.explanation || 'Verified based on study notes.'
    }));
  }

  throw new Error('Failed to parse quiz questions from AI response.');
}

/**
 * Generates Structured Mindmap, Summary Points, and Hidden Background Questions
 * Supports native Multimodal PDF ingestion via Gemini InlineData
 */
export async function generateMindmapAndSummaryWithGemini({
  noteTitle,
  noteContent,
  fileData = null,
  customKey
}) {
  const activeKey = customKey || getEffectiveGeminiKey();
  if (!activeKey) {
    const error = new Error('NO_API_KEY');
    error.code = 'NO_API_KEY';
    throw error;
  }

  const rootName = (noteTitle || 'Academic Note').replace(/\.[^/.]+$/, '');

  const prompt = `You are a distinguished university professor, computer science textbook author, and academic revision architect.
Analyze the provided academic lecture note / presentation document titled "${noteTitle || 'Study Note'}".

Generate an EXHAUSTIVE, story-backed, exam-ready revision dossier containing THREE parts in a single JSON object:

1. "summary": An array of 5 to 7 high-yield study topics thoroughly covering all slides/topics in this document.
   Each topic MUST have:
   - "title": Specific concept title (e.g. "1. What is Software Testing?", "2. Error, Fault and Failure", "3. Equivalence Class Partitioning (ECP)", "4. Boundary Value Analysis (BVA)")
   - "definition": A 2 to 4 line exam-ready definition written in simple, clear, intuitive language that any student can easily understand and write in an exam.
   - "mainPoints": An array of 3 to 4 concise bullet points explaining the core rules, mechanisms, or principles.
   - "example": A real-world practical example written in simple, conversational language (e.g., using intuitive analogies like testing motorcycle brakes before a long journey, an online student exam portal calculating percentages or pass marks, a calculator addition test, etc.).
   - "formula": Exact mathematical law, percentage formula, IEEE/ISO standard, or equation (e.g. "6n + 1 test cases", "V(G) = E - N + 2", "IEEE Standard 610.12") or null.
   - "examTip": A high-yield university exam tip or memory trick (e.g. "Memory trick: Testing = Input -> Execute -> Compare -> Find defects").

2. "mindmap": A structured hierarchical conceptual tree with:
   - "root": "${rootName}"
   - "branches": An array of 4 to 6 main thematic branches covering the document syllabus. Each branch must have:
     - "name": Descriptive, numbered topic (e.g. "1. Introduction & Principles", "2. Verification vs Validation", "3. Black-Box Techniques", "4. White-Box Coverage", "5. Levels of Testing")
     - "children": Array of 3 to 4 specific technical leaf nodes (e.g. ["Error vs Fault vs Failure", "7 Testing Principles", "Equivalence Partitioning", "Boundary Value Analysis"]). NEVER use vague placeholders like "Key Principles", "Definitions", "Framework", or "Techniques" — use real technical terms!

3. "questions": An array of 5 challenging multiple-choice questions for university retention:
   - "question": Question string
   - "options": Array of 4 options
   - "correct": Index (0, 1, 2, or 3) of correct option
   - "explanation": In-depth concept explanation

${noteContent ? `DOCUMENT TEXT:\n${noteContent.slice(0, 30000)}` : `(Read and synthesize all slides/pages of the attached document).`}

Respond strictly with valid JSON:
{
  "summary": [...],
  "mindmap": { "root": "${rootName}", "branches": [...] },
  "questions": [...]
}`;

  let rawText = '';
  try {
    rawText = await callGeminiAPI({
      activeKey,
      prompt,
      fileData,
      temperature: 0.2,
      maxTokens: 6000,
      responseMimeType: 'application/json'
    });
  } catch (err) {
    if (fileData) {
      console.warn('[Rivis AI] Multimodal PDF call failed, falling back to curriculum knowledge synthesis...', err);
      const fallbackPrompt = `You are an elite academic professor and revision architect.
Synthesize the standard university academic curriculum and core examination topics for: "${rootName}".

Generate an EXHAUSTIVE revision dossier containing THREE parts in a single JSON object:
1. "summary": An array of 5 to 6 in-depth academic modules covering the university syllabus for "${rootName}", each with:
   - "title": Clear topic name
   - "definition": A 2 to 4 line definition in simple, clear language
   - "mainPoints": Array of 3-4 concise takeaway bullets
   - "example": A real-world practical example in simple language
   - "formula": Equations/percentages/standards or null
   - "examTip": High-yield exam tip or memory trick
2. "mindmap": A structured hierarchical mindmap with root "${rootName}" and 4 to 6 branches, each with 3 to 4 technical leaf terms with metrics (NO generic placeholders like "Definitions" or "Framework").
3. "questions": 5 challenging multiple-choice questions with options, correct index, and explanations.

Respond strictly with valid JSON:
{
  "summary": [...],
  "mindmap": { "root": "${rootName}", "branches": [...] },
  "questions": [...]
}`;

      rawText = await callGeminiAPI({
        activeKey,
        prompt: fallbackPrompt,
        temperature: 0.2,
        maxTokens: 5000,
        responseMimeType: 'application/json'
      });
    } else {
      throw err;
    }
  }

  const parsed = robustParseJson(rawText);

  if (!parsed || (!parsed.summary && !parsed.mindmap)) {
    console.error('Failed to parse Gemini output:', rawText);
    throw new Error('AI could not parse structured concepts from this document. Please verify your Gemini API key or document formatting.');
  }

  const rawSummary = (Array.isArray(parsed.summary) && parsed.summary.length > 0)
    ? parsed.summary
    : [{ title: `Core Synthesis: ${rootName}`, definition: 'Synthesized high-yield lecture framework.', content: 'Synthesized high-yield lecture framework.', formula: null }];

  const summary = rawSummary.map(s => ({
    title: s.title || 'Core Topic',
    definition: s.definition || s.content || 'Core concept definition.',
    content: s.definition || s.content || 'Core concept definition.',
    mainPoints: (Array.isArray(s.mainPoints) && s.mainPoints.length > 0)
      ? s.mainPoints
      : ((Array.isArray(s.keyPoints) && s.keyPoints.length > 0) ? s.keyPoints : ['Foundational Principle', 'Implementation Rule']),
    keyPoints: (Array.isArray(s.mainPoints) && s.mainPoints.length > 0)
      ? s.mainPoints
      : ((Array.isArray(s.keyPoints) && s.keyPoints.length > 0) ? s.keyPoints : ['Foundational Principle', 'Implementation Rule']),
    example: s.example || null,
    formula: s.formula || null,
    examTip: s.examTip || null
  }));

  // Build concept-specific mindmap branches dynamically from the synthesized summary if model returned generic labels
  const rawBranches = parsed.mindmap?.branches;
  const isGeneric = !rawBranches || 
    !Array.isArray(rawBranches) || 
    rawBranches.length === 0 ||
    rawBranches.some(b => ['Core Foundations', 'Methodology & Processes', 'Analysis & Evaluation', 'Key Principles'].includes(b?.name));

  const mindmap = (!isGeneric && Array.isArray(rawBranches) && rawBranches.length > 0)
    ? parsed.mindmap
    : {
        root: rootName,
        branches: summary.map((s, idx) => {
          let children = [];
          if (Array.isArray(s.mainPoints) && s.mainPoints.length > 0) {
            children = s.mainPoints.map(kp => kp.replace(/^[•\-\*\d\.\s]+/, '').slice(0, 42)).slice(0, 4);
          } else {
            const subPoints = (s.definition || s.content || '')
              .split(/[.;]/)
              .map(t => t.trim())
              .filter(t => t.length > 6 && t.length < 50);
            children = subPoints.length >= 2 ? subPoints.slice(0, 3) : ['Core Mechanisms', 'Implementation Rules'];
          }

          return {
            name: `${idx + 1}. ${s.title.replace(/^\d+[\.\s]*/, '').slice(0, 38)}`,
            children
          };
        })
      };

  const questions = Array.isArray(parsed.questions) ? parsed.questions : [];

  // Generate a clean, human-readable directory tree in text (Normal Mode)
  const normalModeTree = [
    `📁 ${rootName}`,
    ...mindmap.branches.flatMap((b, bIdx) => {
      const isLastBranch = bIdx === mindmap.branches.length - 1;
      const branchPrefix = isLastBranch ? '  └── 📂 ' : '  ├── 📂 ';
      const childIndent = isLastBranch ? '        ' : '  │     ';
      const lines = [`${branchPrefix}${b.name}`];
      (b.children || []).forEach((c, cIdx) => {
        const isLastChild = cIdx === (b.children.length - 1);
        const childPrefix = isLastChild ? '└── 📄 ' : '├── 📄 ';
        lines.push(`${childIndent}${childPrefix}${c}`);
      });
      if (!isLastBranch) lines.push('  │');
      return lines;
    })
  ].join('\n');

  // Generate comprehensive, textbook-grade markdown representation
  const markdownContent = [
    `# 🧠 ${rootName}`,
    ``,
    `*Story-based concise notes • Visual Mindmap • Practical Examples • 5–10 mark exam preparation*`,
    `*Generated automatically by Rivis AI Study Partner from \`${noteTitle}\`.*`,
    ``,
    `---`,
    ``,
    `## 🗺️ Visual Concept Mindmap`,
    ``,
    `\`\`\`text`,
    normalModeTree,
    `\`\`\``,
    ``,
    `---`,
    ``,
    `## 📌 High-Yield Topics & Real-World Examples`,
    ``,
    ...summary.map((s, idx) => [
      `### 📘 ${idx + 1}. ${s.title.replace(/^\d+[\.\s]*/, '')}`,
      ``,
      `**Exam Definition:**`,
      `> ${s.definition || s.content}`,
      ``,
      `**Main Points:**`,
      ...(s.mainPoints || s.keyPoints || []).map(kp => `- ${kp}`),
      ``,
      ...(s.example ? [
        `**💡 Real-World Example (Simple Language):**`,
        `> ${s.example}`,
        ``
      ] : []),
      s.formula ? `> 📐 **Rule / Standard / Law:** \`${s.formula}\`\n` : ``,
      s.examTip ? `> 🎯 **Exam Pro-Tip:** ${s.examTip}\n` : ``,
      `---`,
      ``
    ]).flat(),
    ...(questions.length > 0 ? [
      `## 🎯 Active-Recall Retention Practice`,
      ``,
      ...questions.map((q, qIdx) => [
        `#### Q${qIdx + 1}. ${q.question}`,
        ...q.options.map((opt, oIdx) => `- [${oIdx === q.correct ? 'x' : ' '}] **${String.fromCharCode(65 + oIdx)}.** ${opt}`),
        ``,
        `> **Explanation:** ${q.explanation}`,
        ``
      ]).flat(),
      `---`
    ] : []),
    `*Rivis AI Notes Vault • Study Smarter with Rivisonly*`
  ].join('\n');

  return {
    summary,
    mindmap,
    questions,
    markdownContent
  };
}
