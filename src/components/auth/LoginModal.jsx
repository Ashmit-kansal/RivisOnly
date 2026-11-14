import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { LogIn, ShieldCheck, AlertCircle, Sparkles, FolderSync, Brain } from 'lucide-react';

export default function LoginModal() {
  const { showLogin, setShowLogin, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setError('');
    setGoogleLoading(true);
    loginWithGoogle()
      .then((res) => {
        if (!res?.success) {
          setError(res?.error || 'Google Sign-in was not completed.');
        }
      })
      .catch(() => {
        setError('An error occurred during Google sign-in.');
      })
      .finally(() => {
        setGoogleLoading(false);
      });
  };

  const handleClose = () => {
    setError('');
    setShowLogin(false);
  };

  return (
    <Modal isOpen={showLogin} onClose={handleClose} maxWidth="max-w-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] mb-3.5 shadow-inner">
          <LogIn size={26} />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text))]">
          Welcome to Rivisonly
        </h3>
        <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))] mt-1.5 leading-relaxed">
          Sign in to access your synchronized study rooms, revision duels, and Google Drive notes.
        </p>
      </div>

      {error && (
        <div className="mb-5 space-y-2.5">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
          {(error.includes('blocked') || error.includes('closed') || error.includes('popup')) && (
            <button
              type="button"
              onClick={() => {
                setError('');
                setGoogleLoading(true);
                loginWithGoogle({ useRedirect: true });
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[rgb(var(--color-primary))]/10 hover:bg-[rgb(var(--color-primary))]/20 text-[rgb(var(--color-primary))] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Continue with Redirect (Bypasses Popups & Shields)</span>
            </button>
          )}
        </div>
      )}

      {/* 1-Click Google Sign In Button */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full py-3 px-4 rounded-xl border border-[rgb(var(--color-border))] bg-white dark:bg-[rgb(var(--color-container-low))] hover:bg-slate-50 dark:hover:bg-[rgb(var(--color-container))] text-[rgb(var(--color-text))] font-semibold text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        {/* Feature Highlights */}
        <div className="pt-2 space-y-2 border-t border-[rgb(var(--color-border))]/60">
          <div className="flex items-center gap-2.5 text-xs text-[rgb(var(--color-muted))]">
            <FolderSync size={14} className="text-[#9e3c26] dark:text-[#ffb4a3] shrink-0" />
            <span>Direct Google Drive integration for your lecture notes & PDFs</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[rgb(var(--color-muted))]">
            <Brain size={14} className="text-[rgb(var(--color-secondary))] shrink-0" />
            <span>Automated AI summaries, quiz generation, and active recall duels</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[rgb(var(--color-muted))]">
            <Sparkles size={14} className="text-amber-500 shrink-0" />
            <span>Zero passwords to manage • Institutional Google Workspace supported</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[rgb(var(--color-border))] flex items-center justify-center gap-1.5 text-[11px] text-[rgb(var(--color-muted))]">
        <ShieldCheck size={13} className="text-emerald-500" />
        <span>End-to-end encrypted academic sync</span>
      </div>
    </Modal>
  );
}
