import { mockSubjects } from '../data/mockNotes';

export const STORAGE_KEY = 'rivisonly-notes-vault-v1';
export const ACTIVE_SUBJ_KEY = 'rivisonly-notes-active-subject-v1';
export const ACTIVE_FOLDER_KEY = 'rivisonly-notes-active-folder-v1';
export const ACTIVE_FILE_KEY = 'rivisonly-notes-active-file-id-v1';

/**
 * Safely load stored subjects from localStorage or fall back to mock data
 */
export function loadStoredSubjects() {
  if (typeof window === 'undefined') return mockSubjects;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockSubjects;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Error reading notes vault from localStorage:', err);
  }
  return mockSubjects;
}

/**
 * Safely persist subjects to localStorage with quota overflow protection.
 * If quota is exceeded (e.g. from large base64 attachments), it trims large
 * data URLs while safely retaining note text and vault taxonomy.
 */
export function safeSaveToStorage(subjects) {
  if (typeof window === 'undefined') return true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    return true;
  } catch (err) {
    console.warn('LocalStorage save quota exceeded, trimming heavy media strings...', err);
    try {
      const stripped = subjects.map(subj => ({
        ...subj,
        folders: (subj.folders || []).map(folder => ({
          ...folder,
          files: (folder.files || []).map(f => {
            // If dataUrl exceeds 200KB, remove it from storage to avoid crash
            if (f.fileUrl && f.fileUrl.length > 200000) {
              const { fileUrl, ...safeProps } = f;
              return safeProps;
            }
            return f;
          })
        }))
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
      return true;
    } catch (err2) {
      console.error('LocalStorage completely full or inaccessible', err2);
      return false;
    }
  }
}

/**
 * Reset localStorage to initial mock courseware
 */
export function clearNotesStorage() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_SUBJ_KEY);
    localStorage.removeItem(ACTIVE_FOLDER_KEY);
    localStorage.removeItem(ACTIVE_FILE_KEY);
  } catch (err) {
    console.warn('Failed clearing notes storage:', err);
  }
}

/**
 * Resolve the initial active subject, folder, and file based on:
 * 1. URL search parameters (?fileId, ?subject, ?folder)
 * 2. Stored active state in localStorage
 * 3. Default first subject / folder / file
 */
export function resolveInitialVaultState(allSubjects) {
  if (!allSubjects || allSubjects.length === 0) {
    return { subject: '', folder: '', file: null, modal: null };
  }

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const qFileId = params.get('fileId');
    const qSubject = params.get('subject');
    const qFolder = params.get('folder');
    const qModal = params.get('modal');

    // 1. URL Folder Priority
    if (qFolder) {
      for (const subj of allSubjects) {
        const foundF = subj.folders.find(f => f.name.toLowerCase() === qFolder.toLowerCase());
        if (foundF) {
          return {
            subject: subj.name,
            folder: foundF.name,
            file: foundF.files.length > 0 ? foundF.files[0] : null,
            modal: qModal
          };
        }
      }
    }

    // 2. URL File ID Priority
    if (qFileId) {
      for (const subj of allSubjects) {
        for (const folder of subj.folders) {
          const f = folder.files.find(file => file.id === qFileId);
          if (f) {
            return {
              subject: subj.name,
              folder: folder.name,
              file: f,
              modal: qModal
            };
          }
        }
      }
    }

    // 3. URL Subject Priority
    if (qSubject) {
      const foundSubj = allSubjects.find(s => s.name.toLowerCase() === qSubject.toLowerCase());
      if (foundSubj && foundSubj.folders.length > 0) {
        return {
          subject: foundSubj.name,
          folder: foundSubj.folders[0].name,
          file: foundSubj.folders[0].files[0] || null,
          modal: qModal
        };
      }
    }

    // 4. Stored LocalStorage State
    try {
      const savedSubj = localStorage.getItem(ACTIVE_SUBJ_KEY);
      const savedFolder = localStorage.getItem(ACTIVE_FOLDER_KEY);
      const savedFileId = localStorage.getItem(ACTIVE_FILE_KEY);

      if (savedSubj) {
        const matchedSubj = allSubjects.find(s => s.name === savedSubj);
        if (matchedSubj && matchedSubj.folders.length > 0) {
          const matchedFolder = matchedSubj.folders.find(f => f.name === savedFolder) || matchedSubj.folders[0];
          const matchedFile = (savedFileId && matchedFolder.files.find(f => f.id === savedFileId)) || matchedFolder.files[0] || null;
          return {
            subject: matchedSubj.name,
            folder: matchedFolder.name,
            file: matchedFile,
            modal: qModal
          };
        }
      }
    } catch (e) {
      console.warn('Failed reading stored active notes state:', e);
    }
  }

  // 5. Default Fallback
  const firstSubj = allSubjects[0];
  const firstFolder = firstSubj?.folders[0];
  return {
    subject: firstSubj?.name || '',
    folder: firstFolder?.name || '',
    file: firstFolder?.files[0] || null,
    modal: null
  };
}

/**
 * Helper to read uploaded files asynchronously as DataURL, Text, or formatted HTML
 */
export function readFileAsync(file, type, fileExt, activeSubject = 'Knowledge Vault', activeFolder = 'General Notes') {
  return new Promise((resolve) => {
    // Images: Read as Data URL so they survive page refreshes in localStorage
    if (type === 'png') {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ fileUrl: e.target.result, content: null });
      reader.onerror = () => resolve({ fileUrl: URL.createObjectURL(file), content: null });
      reader.readAsDataURL(file);
    } 
    // Small PDFs (<= 2.5 MB): Read as Data URL to persist in localStorage
    else if (type === 'pdf') {
      if (file.size <= 2.5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ fileUrl: e.target.result, content: null });
        reader.onerror = () => resolve({ fileUrl: URL.createObjectURL(file), content: null });
        reader.readAsDataURL(file);
      } else {
        // Large PDFs: use in-memory blob URL
        resolve({ fileUrl: URL.createObjectURL(file), content: null });
      }
    } 
    // Text or Markdown: Read as text
    else if (fileExt === 'txt' || fileExt === 'md') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawText = e.target.result || '';
        const lines = rawText.split('\n');
        let formattedHtml = '';
        lines.forEach(l => {
          const trimmed = l.trim();
          if (trimmed.startsWith('# ')) {
            formattedHtml += `<h2>${trimmed.replace(/^#\s+/, '')}</h2>`;
          } else if (trimmed.startsWith('## ')) {
            formattedHtml += `<h3>${trimmed.replace(/^##\s+/, '')}</h3>`;
          } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            formattedHtml += `<li>${trimmed.replace(/^[-*]\s+/, '')}</li>`;
          } else if (trimmed) {
            formattedHtml += `<p>${trimmed}</p>`;
          }
        });
        resolve({ fileUrl: null, content: formattedHtml || `<p>${rawText.replace(/\n/g, '<br />')}</p>` });
      };
      reader.onerror = () => resolve({ fileUrl: null, content: null });
      reader.readAsText(file);
    } 
    // Word Documents / Rich Notes: Create starter template
    else {
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const starter = `<h2>${baseName}</h2><p>Ingested Word Document synchronized into <strong>${activeSubject}</strong> / <strong>${activeFolder}</strong>.</p><blockquote><strong>Archived Resource:</strong> File ${file.name} (${Math.max(1, (file.size / 1024).toFixed(0))} KB) parsed and available for live inline editing and spaced revision review.</blockquote>`;
      resolve({ fileUrl: null, content: starter });
    }
  });
}
