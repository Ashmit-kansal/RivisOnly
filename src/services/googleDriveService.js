/**
 * Google Drive REST API v3 Integration Service
 */

export const GOOGLE_MIME_TYPES = {
  FOLDER: 'application/vnd.google-apps.folder',
  DOCUMENT: 'application/vnd.google-apps.document',
  SPREADSHEET: 'application/vnd.google-apps.spreadsheet',
  PRESENTATION: 'application/vnd.google-apps.presentation',
  PDF: 'application/pdf',
  MARKDOWN: 'text/markdown',
  PLAIN_TEXT: 'text/plain',
};

/**
 * Returns a human-friendly category and badge color for a given Google Drive mimeType
 */
export function getFileTypeDetails(mimeType = '', name = '') {
  const ext = (name.split('.').pop() || '').toLowerCase();

  if (mimeType === GOOGLE_MIME_TYPES.FOLDER) {
    return { category: 'folder', label: 'Folder', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
  }
  if (mimeType === GOOGLE_MIME_TYPES.DOCUMENT || ['doc', 'docx'].includes(ext)) {
    return { category: 'doc', label: 'Google Doc', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
  }
  if (mimeType === GOOGLE_MIME_TYPES.PDF || ext === 'pdf') {
    return { category: 'pdf', label: 'PDF Document', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
  }
  if (mimeType === GOOGLE_MIME_TYPES.PRESENTATION || ['ppt', 'pptx'].includes(ext)) {
    return { category: 'slide', label: 'Google Slides', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
  }
  if (mimeType === GOOGLE_MIME_TYPES.SPREADSHEET || ['xls', 'xlsx', 'csv'].includes(ext)) {
    return { category: 'sheet', label: 'Google Sheet', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
  }
  if (mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) {
    return { category: 'image', label: 'Image', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' };
  }
  if (mimeType.includes('text') || ['md', 'txt'].includes(ext)) {
    return { category: 'text', label: 'Notes Text', color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' };
  }
  return { category: 'file', label: 'File', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
}

/**
 * Format bytes to readable string (e.g. 2.4 MB)
 */
export function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '';
  const num = parseInt(bytes, 10);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(0)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Fetch files and folders from Google Drive API v3
 */
export async function listGoogleDriveFiles({
  token,
  folderId = 'root',
  searchQuery = '',
  filterCategory = 'all',
  scopeAll = false
}) {
  if (!token) {
    throw new Error('Google Drive access token missing. Please connect your Google account.');
  }

  const queryParts = ['trashed = false'];

  // Search by name if provided
  if (searchQuery && searchQuery.trim()) {
    const escaped = searchQuery.trim().replace(/['\\]/g, '');
    queryParts.push(`name contains '${escaped}'`);
  } else if (!scopeAll && folderId) {
    // Navigate by folder hierarchy when not in global search mode
    queryParts.push(`'${folderId}' in parents`);
  }

  // Filter category
  if (filterCategory === 'docs') {
    queryParts.push(`(mimeType = '${GOOGLE_MIME_TYPES.DOCUMENT}' or mimeType contains 'text')`);
  } else if (filterCategory === 'pdfs') {
    queryParts.push(`mimeType = '${GOOGLE_MIME_TYPES.PDF}'`);
  } else if (filterCategory === 'slides') {
    queryParts.push(`mimeType = '${GOOGLE_MIME_TYPES.PRESENTATION}'`);
  } else if (filterCategory === 'folders') {
    queryParts.push(`mimeType = '${GOOGLE_MIME_TYPES.FOLDER}'`);
  }

  const q = queryParts.join(' and ');
  const fields = 'nextPageToken, files(id, name, mimeType, iconLink, webViewLink, thumbnailLink, modifiedTime, size, shared, parents)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&orderBy=folder,name&pageSize=100`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('AUTH_EXPIRED: Your Google Drive session has expired. Please re-authenticate.');
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Google Drive query failed (${res.status})`);
  }

  const data = await res.json();
  const rawFiles = data.files || [];

  // Sort folders first, then alphabetically
  return rawFiles.sort((a, b) => {
    const isAFolder = a.mimeType === GOOGLE_MIME_TYPES.FOLDER;
    const isBFolder = b.mimeType === GOOGLE_MIME_TYPES.FOLDER;
    if (isAFolder && !isBFolder) return -1;
    if (!isAFolder && isBFolder) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Fetches file binary data as a base64 encoded string
 * Essential for multimodal AI ingestion (PDFs, images, slides)
 */
export async function fetchDriveFileBase64(token, fileId, preferredMime = 'application/pdf') {
  if (!token || !fileId) return null;
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Failed to load file media (${res.status})`);
  const blob = await res.blob();

  // Ensure mimeType is valid for AI ingestion (Google Drive alt=media often defaults to application/octet-stream)
  let safeMime = preferredMime || 'application/pdf';
  if (blob.type && blob.type !== 'application/octet-stream' && blob.type.includes('/')) {
    safeMime = blob.type;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === 'string') {
        const base64 = dataUrl.split(',')[1];
        resolve({
          base64,
          mimeType: safeMime,
          size: blob.size
        });
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Exports a Google Slide / presentation as a PDF in base64 format for multimodal AI
 */
export async function exportDriveFileAsPdfBase64(token, fileId) {
  if (!token || !fileId) return null;
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Failed to export presentation as PDF (${res.status})`);
  const blob = await res.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl === 'string') {
        const base64 = dataUrl.split(',')[1];
        resolve({
          base64,
          mimeType: 'application/pdf',
          size: blob.size
        });
      } else {
        reject(new Error('Failed to convert exported PDF to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Unified content fetcher supporting multimodal PDF, Google Docs/Slides/Sheets & Plaintext
 * Returns { text: string, fileData: { base64: string, mimeType: string, size: number } | null }
 */
export async function fetchDriveFileFullContent(token, file) {
  if (!token || !file?.id) return { text: '', fileData: null };

  const isPdf = file.mimeType === 'application/pdf' || /\.pdf$/i.test(file.name);
  const isSlide = file.mimeType === GOOGLE_MIME_TYPES.PRESENTATION;
  const isDoc = file.mimeType === GOOGLE_MIME_TYPES.DOCUMENT;
  const isSheet = file.mimeType === GOOGLE_MIME_TYPES.SPREADSHEET;

  // 1. PDF -> fetch binary bytes as base64 for Gemini Multimodal
  if (isPdf) {
    try {
      const fileData = await fetchDriveFileBase64(token, file.id);
      return { text: '', fileData };
    } catch (err) {
      console.warn('Could not fetch PDF base64:', err);
    }
  }

  // 2. Google Slides -> export as PDF for visual layout & text comprehension
  if (isSlide) {
    try {
      const fileData = await exportDriveFileAsPdfBase64(token, file.id);
      return { text: '', fileData };
    } catch (err) {
      console.warn('PDF export failed for slides, trying text export:', err);
      try {
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const text = await res.text();
          return { text, fileData: null };
        }
      } catch {}
    }
  }

  // 3. Google Docs -> export as plain text
  if (isDoc) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const text = await res.text();
        return { text, fileData: null };
      }
    } catch (err) {
      console.warn('Could not export Doc as text:', err);
    }
  }

  // 4. Google Sheets -> export as CSV
  if (isSheet) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/csv`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const text = await res.text();
        return { text, fileData: null };
      }
    } catch (err) {
      console.warn('Could not export Sheet as CSV:', err);
    }
  }

  // 5. Plain text / Markdown / Source code / JSON / CSV
  const isTextLike =
    file.mimeType?.includes('text') ||
    file.mimeType?.includes('json') ||
    file.mimeType?.includes('javascript') ||
    /\.(md|txt|json|js|jsx|ts|tsx|py|html|css|csv|c|cpp|java|sh|yaml|yml)$/i.test(file.name);

  if (isTextLike) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const text = await res.text();
        return { text, fileData: null };
      }
    } catch (err) {
      console.warn('Could not extract raw text from file:', err);
    }
  }

  return {
    text: `Academic lecture document titled "${file.name}".`,
    fileData: null
  };
}

/**
 * Fetches the text content of a Drive file for AI summarization & quiz generation
 */
export async function fetchDriveFileTextContent(token, file) {
  const content = await fetchDriveFileFullContent(token, file);
  return content.text || `Academic document titled "${file.name}".`;
}

/**
 * Fetches file binary data as a Blob (e.g. for image preview or direct download)
 */
export async function fetchDriveFileBlob(token, fileId) {
  if (!token || !fileId) return null;
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Failed to load file media (${res.status})`);
  return await res.blob();
}

/**
 * Returns optimal iframe preview URL depending on file mimeType
 */
export function getDrivePreviewUrl(fileId, mimeType = '') {
  if (!fileId) return '';
  if (mimeType === GOOGLE_MIME_TYPES.DOCUMENT) {
    return `https://docs.google.com/document/d/${fileId}/preview`;
  }
  if (mimeType === GOOGLE_MIME_TYPES.SPREADSHEET) {
    return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
  }
  if (mimeType === GOOGLE_MIME_TYPES.PRESENTATION) {
    return `https://docs.google.com/presentation/d/${fileId}/preview`;
  }
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Creates a new folder in Google Drive
 */
export async function createDriveFolder({ token, name, parentFolderId = 'root' }) {
  if (!token) throw new Error('Google Drive access token missing.');
  if (!name || !name.trim()) throw new Error('Please enter a folder name.');

  const metadata = {
    name: name.trim(),
    mimeType: GOOGLE_MIME_TYPES.FOLDER,
    ...(parentFolderId && parentFolderId !== 'root' ? { parents: [parentFolderId] } : {})
  };

  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 403 && (err.error?.message?.includes('insufficient') || err.error?.message?.includes('scope'))) {
      throw new Error('Permission denied. Please disconnect and reconnect Google Drive to allow folder creation.');
    }
    throw new Error(err.error?.message || `Failed to create folder (${res.status})`);
  }

  return await res.json();
}

/**
 * Uploads a local file (PDF, Doc, Image, Markdown, text, etc.) to Google Drive using multipart upload
 */
export async function uploadDriveFile({ token, file, parentFolderId = 'root' }) {
  if (!token) throw new Error('Google Drive access token missing.');
  if (!file) throw new Error('No file selected for upload.');

  const metadata = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    ...(parentFolderId && parentFolderId !== 'root' ? { parents: [parentFolderId] } : {})
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();
  const fileData = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const mediaHeader = `--${boundary}\r\nContent-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`;

  const encoder = new TextEncoder();
  const metadataBytes = encoder.encode(metadataPart);
  const mediaHeaderBytes = encoder.encode(mediaHeader);
  const closeDelimiterBytes = encoder.encode(closeDelimiter);

  const totalLength = metadataBytes.length + mediaHeaderBytes.length + fileData.byteLength + closeDelimiterBytes.length;
  const combined = new Uint8Array(totalLength);

  let offset = 0;
  combined.set(metadataBytes, offset);
  offset += metadataBytes.length;
  combined.set(mediaHeaderBytes, offset);
  offset += mediaHeaderBytes.length;
  combined.set(new Uint8Array(fileData), offset);
  offset += fileData.byteLength;
  combined.set(closeDelimiterBytes, offset);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: combined
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to upload file (${res.status})`);
  }

  return await res.json();
}

/**
 * Deletes a file permanently or moves it to trash in Google Drive
 */
export async function deleteDriveFile(token, fileId) {
  if (!token || !fileId) return false;
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // 204 No Content is standard success response for DELETE in Google Drive v3
    return res.ok || res.status === 204 || res.status === 404;
  } catch (err) {
    console.warn('Failed to delete Drive file:', err);
    return false;
  }
}


