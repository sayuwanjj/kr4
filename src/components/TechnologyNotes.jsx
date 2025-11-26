import React from 'react';
import './TechnologyNotes.css';

function TechnologyNotes({ notes, onNotesChange, techId }) {
  return (
    <div className="notes-section">
      <div className="notes-header">
        <h4>📝 Мои заметки:</h4>
      </div>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(techId, e.target.value)}
        placeholder="Записывайте сюда важные моменты, примеры кода, вопросы..."
        rows="3"
        className="notes-textarea"
      />
      <div className="notes-footer">
        <div className="notes-hint">
          {notes.length > 0 
            ? `✓ Заметка сохранена (${notes.length} символов)` 
            : '+ Добавьте заметку'}
        </div>
        <div className="notes-char-count">
          {notes.length} / 500
        </div>
      </div>
    </div>
  );
}

export default TechnologyNotes;
