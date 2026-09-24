import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Sparkles, Mail, Lock, User, BookOpen, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function SignupModal() {
  const { showSignup, setShowSignup, setShowLogin, signup, loginAsDemo } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subjectPreference, setSubjectPreference] = useState('Organic Chemistry II');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signup({ name, email, password, subjectPreference });
      if (!res.success) {
        setError(res.error || 'Failed to create account. Please check your details.');
      } else {
        setName('');
        setEmail('');
        setPassword('');
        setError('');
      }
    } catch {
      setError('An unexpected error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setShowSignup(false);
  };

  return (
    <Modal isOpen={showSignup} onClose={handleClose} maxWidth="max-w-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] mb-3">
          <UserPlus size={22} />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text))]">Create Scholar Account</h3>
        <p className="text-sm text-[rgb(var(--color-muted))] mt-1">
          Begin your synchronized spaced learning journey
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Hypatia of Alexandria"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/30 focus:border-[rgb(var(--color-primary))]"
              autoFocus
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
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/30 focus:border-[rgb(var(--color-primary))] appearance-none cursor-pointer"
            >
              <option value="Organic Chemistry II">Organic Chemistry II</option>
              <option value="Linear Algebra">Linear Algebra</option>
              <option value="Cognitive Neuroscience">Cognitive Neuroscience</option>
              <option value="Macroeconomics">Macroeconomics</option>
              <option value="Computer Science">Computer Science & Algorithms</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] mb-1">
            Master Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" size={16} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/30 focus:border-[rgb(var(--color-primary))]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] cursor-pointer p-1"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-xl bg-[rgb(var(--color-primary))] hover:brightness-105 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-[rgb(var(--color-primary))]/20 transition-all cursor-pointer active:scale-[0.99]"
        >
          {loading ? 'Initializing Vault...' : 'Create Vault & Start Practicing'}
          <ArrowRight size={16} />
        </button>

        <div className="relative py-0.5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[rgb(var(--color-border))]" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-wider">
            <span className="bg-[rgb(var(--color-card))] px-2 text-[rgb(var(--color-muted))]">OR</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setError('');
            loginAsDemo();
          }}
          className="w-full py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container-high))] text-[rgb(var(--color-text))] font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-[rgb(var(--color-border))]"
        >
          <Sparkles size={14} className="text-[rgb(var(--color-primary))]" />
          Preview with Demo Account (Lv. 14 Scholar)
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-[rgb(var(--color-border))] text-center text-xs text-[rgb(var(--color-muted))]">
        Already registered?{' '}
        <button
          type="button"
          onClick={() => {
            setError('');
            setShowSignup(false);
            setShowLogin(true);
          }}
          className="text-[rgb(var(--color-primary))] font-semibold hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[rgb(var(--color-muted))]">
        <ShieldCheck size={13} className="text-emerald-500" />
        <span>Local & private repository synchronization</span>
      </div>
    </Modal>
  );
}
