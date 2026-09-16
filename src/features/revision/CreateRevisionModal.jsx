import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { Brain, Plus, Sparkles, BookOpen } from 'lucide-react';

export default function CreateRevisionModal({ isOpen, onClose, defaultSubject = 'Organic Chemistry II', onCreate }) {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState(defaultSubject === 'All Subjects' ? 'Organic Chemistry II' : defaultSubject);
  const [customSubject, setCustomSubject] = useState('');
  const [modality, setModality] = useState('ai-points'); // 'ai-points' | 'ai-quiz' | 'manual' | 'hybrid'
  const [interval, setInterval] = useState('Day 3');
  const [priority, setPriority] = useState('High Priority');
  const [description, setDescription] = useState('');

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTopic('');
      setSubject(defaultSubject === 'All Subjects' ? 'Organic Chemistry II' : defaultSubject);
      setCustomSubject('');
      setModality('ai-points');
      setInterval('Day 3');
      setDescription('');
    }
  }, [isOpen, defaultSubject]);

  if (!isOpen) return null;

  const subjectOptions = [
    'Organic Chemistry II',
    'Linear Algebra',
    'Cognitive Neuroscience',
    'Create New Subject...'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const finalSubject = subject === 'Create New Subject...' ? (customSubject.trim() || 'General Science') : subject;

    const newRevisionItem = {
      id: `rev-${Date.now()}`,
      subject: finalSubject,
      topic: topic.trim(),
      type: modality === 'manual' ? 'manual' : 'ai',
      badge: modality === 'ai-quiz' ? 'AI Quiz Sprint' : modality === 'manual' ? 'Manual Task' : 'AI Key Points',
      priority,
      progress: `${interval} Spaced Window`,
      decayScore: 95,
      decayStatus: 'fresh',
      decayColor: '#2d7d46',
      description: description.trim() || `User scheduled spaced revision task for ${topic.trim()}.`,
      sourcesScanned: 3,
      tokensVectorized: 8400,
      noteFileId: 'file-1',
      noteFileName: `${topic.trim().replace(/\s+/g, '_')}.doc`,
      proficiencyScore: 75,
      keyPoints: [
        {
          title: 'Core Concept Definition',
          content: description.trim() || `Primary theoretical foundation and key principles for ${topic.trim()}.`
        },
        {
          title: 'High-Yield Recall Anchor',
          content: 'Key formulas, mechanisms, and edge-case exceptions for exam mastery.'
        }
      ]
    };

    if (onCreate) {
      onCreate(newRevisionItem);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-4">
        
        {/* Header */}
        <div className="border-b border-[rgb(var(--color-border))] pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#9e3c26] dark:text-[#ffb4a3] uppercase font-bold mb-1">
            <Plus size={14} />
            <span>NEW REVISION TASK</span>
          </div>
          <h3 className="text-xl font-bold text-[rgb(var(--color-text))]">
            Schedule Topic for Revision
          </h3>
          <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
            Configure an adaptive Ebbinghaus spaced repetition card to anchor this topic in long-term memory.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Topic Title */}
          <div>
            <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
              Topic or Chapter Title *
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Unit 4: Enolates & Aldol Condensations"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
            />
          </div>

          {/* Subject Dropdown & Interval & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                Discipline / Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))]"
              >
                {subjectOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                Spaced Interval
              </label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))]"
              >
                <option value="Day 1">Day 1 (Next-Day)</option>
                <option value="Day 3">Day 3 (First Decay)</option>
                <option value="Day 7">Day 7 (Consolidation)</option>
                <option value="Day 14">Day 14 (Encoding)</option>
                <option value="Day 30">Day 30 (Permanent)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))]"
              >
                <option value="High Priority">High Priority</option>
                <option value="Standard Pace">Standard</option>
                <option value="Deep Archive">Archive</option>
              </select>
            </div>
          </div>

          {subject === 'Create New Subject...' && (
            <div>
              <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
                New Subject Name
              </label>
              <input
                type="text"
                required
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="e.g. Molecular Biochemistry"
                className="w-full px-3 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))]"
              />
            </div>
          )}

          {/* Revision Modality Selection (The 3 Options) */}
          <div>
            <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1.5 font-semibold">
              Primary Revision Modality
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setModality('ai-points')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  modality === 'ai-points'
                    ? 'border-[#9e3c26] bg-[#9e3c26]/10 text-[rgb(var(--color-text))] shadow-xs'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-[rgb(var(--color-text))] mb-1">
                  <Brain size={14} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
                  <span>AI Key Points</span>
                </div>
                <p className="text-[10px] leading-relaxed">
                  High-yield synthesis bullets & formulas.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setModality('ai-quiz')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  modality === 'ai-quiz'
                    ? 'border-[#9e3c26] bg-[#9e3c26]/10 text-[rgb(var(--color-text))] shadow-xs'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-[rgb(var(--color-text))] mb-1">
                  <Sparkles size={14} className="text-[rgb(var(--color-tertiary))]" />
                  <span>AI Practice Quiz</span>
                </div>
                <p className="text-[10px] leading-relaxed">
                  Interactive sprint to test proficiency.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setModality('manual')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  modality === 'manual'
                    ? 'border-[#9e3c26] bg-[#9e3c26]/10 text-[rgb(var(--color-text))] shadow-xs'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-muted))]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-[rgb(var(--color-text))] mb-1">
                  <BookOpen size={14} className="text-amber-600 dark:text-amber-400" />
                  <span>Manual Read</span>
                </div>
                <p className="text-[10px] leading-relaxed">
                  Direct note study & tactile reader.
                </p>
              </button>
            </div>
          </div>

          {/* Description / Summary Context */}
          <div>
            <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1 font-semibold">
              Brief Context or Formula Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Focus on kinetic vs thermodynamic enolate formation with LDA..."
              className="w-full px-3.5 py-2 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] focus:outline-none focus:ring-1 focus:ring-[#9e3c26]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] text-white text-xs font-semibold shadow-md shadow-[#9e3c26]/20 cursor-pointer"
            >
              Schedule in Revision Queue
            </button>
          </div>

        </form>

      </div>
    </Modal>
  );
}
