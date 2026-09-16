import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Sparkles, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginModal() {
  const { showLogin, setShowLogin, setShowSignup, login } = useAuth();
  const [email, setEmail] = useState('arjun@rivisonly.app');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 400);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      login('arjun@rivisonly.app', 'demo');
      setLoading(false);
    }, 300);
  };

  return (
    <Modal isOpen={showLogin} onClose={() => setShowLogin(false)} maxWidth="max-w-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] mb-3">
          <LogIn size={22} />
        </div>
        <h3 className="text-2xl font-bold tracking-tight">Welcome Back</h3>
        <p className="text-sm text-[rgb(var(--color-muted))] mt-1">
          Access your architectural study vault and synced sessions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[rgb(var(--color-muted))] mb-1.5">
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
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[rgb(var(--color-muted))]">
              Master Password
            </label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs text-[rgb(var(--color-primary))] hover:underline">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-muted))]" size={16} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))] text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/30 focus:border-[rgb(var(--color-primary))]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-xl bg-[rgb(var(--color-primary))] hover:brightness-95 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-[rgb(var(--color-primary))]/20 transition-all cursor-pointer"
        >
          {loading ? 'Authenticating Vault...' : 'Enter Focus Studio'}
          <ArrowRight size={16} />
        </button>

        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container-high))] text-[rgb(var(--color-text))] font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-[rgb(var(--color-border))]"
        >
          <Sparkles size={14} className="text-[rgb(var(--color-primary))]" />
          Instant Demo Sign In (Lv. 14 Scholar)
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[rgb(var(--color-border))] text-center text-xs text-[rgb(var(--color-muted))]">
        Don't have a scholar vault yet?{' '}
        <button
          type="button"
          onClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          className="text-[rgb(var(--color-primary))] font-semibold hover:underline cursor-pointer"
        >
          Create an Account
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[rgb(var(--color-muted))]">
        <ShieldCheck size={13} className="text-emerald-500" />
        <span>End-to-end encrypted academic repository sync</span>
      </div>
    </Modal>
  );
}
