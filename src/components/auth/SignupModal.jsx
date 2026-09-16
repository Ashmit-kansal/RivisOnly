import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Sparkles, Mail, Lock, User, BookOpen, ArrowRight } from 'lucide-react';

export default function SignupModal() {
  const { showSignup, setShowSignup, setShowLogin, signup } = useAuth();
  const [name, setName] = useState('Arjun Sharma');
  const [email, setEmail] = useState('arjun@rivisonly.app');
  const [subjectPreference, setSubjectPreference] = useState('Organic Chemistry II');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      signup({ name, email, subjectPreference });
      setLoading(false);
    }, 400);
  };

  return (
    <Modal isOpen={showSignup} onClose={() => setShowSignup(false)} maxWidth="max-w-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] mb-3">
          <UserPlus size={22} />
        </div>
        <h3 className="text-2xl font-bold tracking-tight">Create Scholar Account</h3>
        <p className="text-sm text-[rgb(var(--color-muted))] mt-1">
          Begin your synchronized spaced learning journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" size={16} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Hypatia of Alexandria"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/30 focus:border-[rgb(var(--color-primary))]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] mb-1">
            Academic Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" size={16} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scholar@university.edu"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/30 focus:border-[rgb(var(--color-primary))]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] mb-1">
            Primary Discipline Focus
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" size={16} />
            <select
              value={subjectPreference}
              onChange={(e) => setSubjectPreference(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/30 focus:border-[rgb(var(--color-primary))] appearance-none"
            >
              <option value="Organic Chemistry II">Organic Chemistry II</option>
              <option value="Linear Algebra">Linear Algebra</option>
              <option value="Cognitive Neuroscience">Cognitive Neuroscience</option>
              <option value="Macroeconomics">Macroeconomics</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" size={16} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/30 focus:border-[rgb(var(--color-primary))]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-xl bg-[rgb(var(--color-primary))] hover:brightness-95 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-[rgb(var(--color-primary))]/20 transition-all cursor-pointer"
        >
          {loading ? 'Initializing Vault...' : 'Create Vault & Start Practicing'}
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[rgb(var(--color-border))] text-center text-xs text-[rgb(var(--color-muted))]">
        Already registered?{' '}
        <button
          type="button"
          onClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          className="text-[rgb(var(--color-primary))] font-semibold hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </Modal>
  );
}
