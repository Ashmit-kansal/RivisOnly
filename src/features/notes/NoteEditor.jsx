import React from 'react';
import DocumentEditor from './DocumentEditor';
import PdfPreviewer from './PdfPreviewer';
import ImagePreviewer from './ImagePreviewer';

export default function NoteEditor({ 
  activeFile, 
  activeSubject, 
  activeFolder, 
  onSave,
  forcedViewMode 
}) {
  const fileType = (activeFile?.type || '').toLowerCase();
  const fileName = (activeFile?.name || '').toLowerCase();

  const isPdf = fileType === 'pdf' || fileName.endsWith('.pdf');
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(fileType) || /\.(png|jpg|jpeg|webp|svg)$/i.test(fileName);

  if (isPdf) {
    return (
      <PdfPreviewer
        activeFile={activeFile}
        activeSubject={activeSubject}
        activeFolder={activeFolder}
      />
    );
  }

  if (isImage) {
    return (
      <ImagePreviewer
        activeFile={activeFile}
        activeSubject={activeSubject}
        activeFolder={activeFolder}
      />
    );
  }

  // Normal Document Editor (WYSIWYG without markdown)
  return (
    <DocumentEditor
      activeFile={activeFile}
      activeSubject={activeSubject}
      activeFolder={activeFolder}
      onSave={onSave}
      initialMode={forcedViewMode === 'preview' ? 'read' : 'edit'}
    />
  );
}
