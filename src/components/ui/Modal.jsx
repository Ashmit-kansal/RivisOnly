import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl', showClose = true }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isMounted || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm transition-opacity"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
      }}
      onClick={onClose}
    >
      {/* Dialog Window */}
      <div 
        className={`relative w-full ${maxWidth} bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-2xl shadow-2xl p-6 sm:p-8 z-10 animate-fade-in-up text-[rgb(var(--color-text))] my-auto max-h-[88vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-container-high))] transition-colors cursor-pointer z-20"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}

        {title && (
          <div className="mb-5 pr-8">
            {typeof title === 'string' ? (
              <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            ) : (
              title
            )}
          </div>
        )}

        {children}
      </div>
    </div>,
    document.body
  );
}
