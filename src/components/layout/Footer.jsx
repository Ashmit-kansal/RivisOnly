import React from 'react';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="mt-16 pb-10 border-t border-[rgb(var(--color-border))] py-8 text-center text-xs font-mono text-[rgb(var(--color-muted))] transition-colors">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo className="w-5 h-5 rounded" />
          <span className="font-semibold text-[rgb(var(--color-text))] font-sans">Rivisonly</span>
          <span className="hidden sm:inline">— Your AI Study Partner & Real-Time Focus Space</span>
        </div>
        <div>
          © {new Date().getFullYear()} RIVISONLY STUDIO. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
