import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getEffectiveGeminiKey,
  hasUserCustomKey,
  saveUserCustomKey,
  removeUserCustomKey,
  testGeminiApiKey,
  generateKeyPointsWithGemini,
  generateQuizWithGemini,
  generateMindmapAndSummaryWithGemini,
  GEMINI_STORAGE_KEY
} from '../services/geminiService';

const AIContext = createContext(null);

export function AIProvider({ children }) {
  const [userKey, setUserKey] = useState(() => {
    try {
      return localStorage.getItem(GEMINI_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [hasCustomKey, setHasCustomKey] = useState(() => hasUserCustomKey());
  const [showAISettingsModal, setShowAISettingsModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync state when storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === GEMINI_STORAGE_KEY) {
        setUserKey(e.newValue || '');
        setHasCustomKey(Boolean(e.newValue && e.newValue.trim().length > 5));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveKey = (key) => {
    saveUserCustomKey(key);
    setUserKey(key.trim());
    setHasCustomKey(true);
  };

  const removeKey = () => {
    removeUserCustomKey();
    setUserKey('');
    setHasCustomKey(false);
  };

  const validateAndSaveKey = async (key) => {
    await testGeminiApiKey(key);
    saveKey(key);
    return true;
  };

  // Wrapper for Key Points with error modal trigger
  const generateKeyPoints = async (noteTitle, noteContent, fileData = null) => {
    setIsGenerating(true);
    try {
      const points = await generateKeyPointsWithGemini({
        noteTitle,
        noteContent,
        fileData,
        customKey: userKey
      });
      return points;
    } catch (err) {
      if (err.code === 'NO_API_KEY' || err.code === 'QUOTA_EXCEEDED' || err.code === 'INVALID_KEY') {
        setShowAISettingsModal(true);
      }
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // Wrapper for Quiz with error modal trigger
  const generateQuiz = async (noteTitle, noteContent, count = 5, fileData = null) => {
    setIsGenerating(true);
    try {
      const questions = await generateQuizWithGemini({
        noteTitle,
        noteContent,
        count,
        fileData,
        customKey: userKey
      });
      return questions;
    } catch (err) {
      if (err.code === 'NO_API_KEY' || err.code === 'QUOTA_EXCEEDED' || err.code === 'INVALID_KEY') {
        setShowAISettingsModal(true);
      }
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // Wrapper for Mindmap & Summary with error modal trigger
  const generateMindmapAndSummary = async (noteTitle, noteContent, fileData = null) => {
    setIsGenerating(true);
    try {
      const result = await generateMindmapAndSummaryWithGemini({
        noteTitle,
        noteContent,
        fileData,
        customKey: userKey
      });
      return result;
    } catch (err) {
      if (err.code === 'NO_API_KEY' || err.code === 'QUOTA_EXCEEDED' || err.code === 'INVALID_KEY') {
        setShowAISettingsModal(true);
      }
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const effectiveKey = getEffectiveGeminiKey();
  const hasAnyKey = Boolean(effectiveKey);

  const value = {
    userKey,
    effectiveKey,
    hasCustomKey,
    hasAnyKey,
    showAISettingsModal,
    setShowAISettingsModal,
    saveKey,
    removeKey,
    validateAndSaveKey,
    generateKeyPoints,
    generateQuiz,
    generateMindmapAndSummary,
    isGenerating
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

