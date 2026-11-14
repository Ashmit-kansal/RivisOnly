import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useAI } from '../../context/AIContext';
import {
  Sparkles, Key, CheckCircle2, AlertCircle, ExternalLink,
  Eye, EyeOff, Trash2, ShieldCheck, RefreshCw, HelpCircle
} from 'lucide-react';

export default function AISettingsModal() {
  const {
    showAISettingsModal,
    setShowAISettingsModal,
    userKey,
    hasCustomKey,
    hasAnyKey,
    validateAndSaveKey,
    removeKey
  } = useAI();

  const [inputKey, setInputKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const [showFaq, setShowFaq] = useState(false);

  useEffect(() => {
    if (showAISettingsModal) {
      setInputKey(userKey || '');
      setStatusMessage(null);
    }
  }, [showAISettingsModal, userKey]);

  if (!showAISettingsModal) return null;

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!inputKey.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste your Gemini API key.' });
      return;
    }

    setTesting(true);
    setStatusMessage(null);

    try {
      await validateAndSaveKey(inputKey);
      setStatusMessage({
        type: 'success',
        text: 'API Key verified and saved successfully! You now have 1,500 free daily AI queries.'
      });
      setTimeout(() => {
        setShowAISettingsModal(false);
      }, 1500);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to validate API key. Please check Google AI Studio.'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleRemove = () => {
    if (window.confirm('Remove your personal Gemini API key and switch back to shared tier?')) {
      removeKey();
      setInputKey('');
      setStatusMessage({ type: 'info', text: 'Personal API key removed.' });
    }
  };

  return (
    <Modal
      isOpen={showAISettingsModal}
      onClose={() => setShowAISettingsModal(false)}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[rgb(var(--color-border))] pb-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#9e3c26]/10 text-[#9e3c26] dark:text-[#ffb4a3] flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
              Gemini AI & Quota Settings
            </h3>
            <p className="text-xs text-[rgb(var(--color-muted))]">
              Connect your free personal Gemini key for unlimited speed and private quota.
            </p>
          </div>
        </div>

        {/* Current Status Card */}
        <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
          hasCustomKey
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
            : hasAnyKey
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
            : 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {hasCustomKey ? (
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle size={18} className="shrink-0" />
            )}
            <div className="min-w-0">
              <p className="font-bold truncate">
                {hasCustomKey 
                  ? 'Personal Free Key Connected' 
                  : hasAnyKey 
                  ? 'Using Rivis Shared Demo Tier' 
                  : 'AI Key Required'}
              </p>
              <p className="text-[11px] opacity-85 mt-0.5 truncate">
                {hasCustomKey
                  ? '1,500 free queries/day directly from your Google account'
                  : 'Plug in your personal free key to avoid shared rate limits'}
              </p>
            </div>
          </div>

          {hasCustomKey && (
            <button
              onClick={handleRemove}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-500/20 transition-colors cursor-pointer shrink-0"
              title="Remove personal key"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* 1-Click Link to Google AI Studio */}
        <div className="p-3.5 rounded-2xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[rgb(var(--color-text))] flex items-center gap-1.5">
              <Key size={13} className="text-[#9e3c26] dark:text-[#ffb4a3]" />
              <span>Get Your 100% Free Gemini Key</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold">
              $0 / No Card Needed
            </span>
          </div>

          <ol className="text-[11px] text-[rgb(var(--color-muted))] space-y-1 list-decimal list-inside leading-relaxed">
            <li>Click the button below to open <strong>Google AI Studio</strong>.</li>
            <li>Sign in with your Google account and click <strong>"Create API Key"</strong>.</li>
            <li>Copy your key, paste it below, and click <strong>"Test & Save"</strong>.</li>
          </ol>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-[rgb(var(--color-container))] hover:bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] text-xs font-semibold text-[rgb(var(--color-text))] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <span>Open Google AI Studio</span>
            <ExternalLink size={12} className="text-[rgb(var(--color-muted))]" />
          </a>
        </div>

        {/* Input & Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-mono uppercase text-[rgb(var(--color-muted))] mb-1.5 font-semibold">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text))] font-mono focus:outline-none focus:ring-2 focus:ring-[#9e3c26]/30"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[rgb(var(--color-muted))]">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide Key' : 'Show Key'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Status Message Pill */}
          {statusMessage && (
            <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={testing || !inputKey.trim()}
              className="flex-1 py-2.5 rounded-xl bg-[#9e3c26] hover:bg-[#be543c] dark:bg-[#e26f54] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm shadow-[#9e3c26]/20 transition-all cursor-pointer"
            >
              {testing ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Verifying Key with Google...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  <span>Test & Save Key</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowAISettingsModal(false)}
              className="px-4 py-2.5 rounded-xl bg-[rgb(var(--color-container-low))] hover:bg-[rgb(var(--color-container))] border border-[rgb(var(--color-border))] text-xs font-semibold text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </form>

        {/* Why is this free Accordion */}
        <div className="border-t border-[rgb(var(--color-border))] pt-3">
          <button
            type="button"
            onClick={() => setShowFaq(!showFaq)}
            className="flex items-center gap-1.5 text-[11px] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
          >
            <HelpCircle size={12} />
            <span>Why is Google AI free for students?</span>
          </button>

          {showFaq && (
            <p className="text-[11px] text-[rgb(var(--color-muted))] mt-2 leading-relaxed bg-[rgb(var(--color-container-low))] p-3 rounded-xl border border-[rgb(var(--color-border))]">
              Google provides every standard Google account with a generous developer quota of <strong>15 requests per minute and 1,500 requests per day</strong> at <strong>$0 cost</strong> without requiring a credit card or billing setup. Your key stays stored securely in your browser's private local storage.
            </p>
          )}
        </div>

      </div>
    </Modal>
  );
}

