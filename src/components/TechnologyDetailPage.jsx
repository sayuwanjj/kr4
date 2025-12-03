import React, { useState, useEffect } from 'react';
import './TechnologyDetailPage.css';

function TechnologyDetailPage({ 
  technology, 
  onStatusChange, 
  onNotesChange, 
  onDeadlineChange,
  onAddResource,
  onRemoveResource,
  onDelete,
  onBack 
}) {
  const [notes, setNotes] = useState(technology.notes || '');
  const [deadline, setDeadline] = useState(technology.deadline || '');
  const [resourceUrl, setResourceUrl] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Синхронизируем локальное состояние с пропсом
  useEffect(() => {
    setNotes(technology.notes || '');
    setDeadline(technology.deadline || '');
  }, [technology.id]);

  const handleSaveNotes = () => {
    onNotesChange(technology.id, notes);
    setIsEditingNotes(false);
  };

  const handleDeadlineChange = (e) => {
    const newDeadline = e.target.value;
    setDeadline(newDeadline);
    onDeadlineChange(technology.id, newDeadline);
  };

  const handleAddResource = () => {
    if (resourceUrl.trim()) {
      onAddResource(technology.id, resourceUrl.trim());
      setResourceUrl('');
    }
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(technology.id, newStatus);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту технологию? Все заметки и ссылки будут утеряны.')) {
      onDelete(technology.id);
    }
  };

  const getStatusText = (statusKey) => {
    const statusMap = {
      'not-started': 'Не начат',
      'in-progress': 'В работе',
      'completed': 'Выполнено'
    };
    return statusMap[statusKey] || statusKey;
  };

  const getStatusClass = (statusKey) => {
    return `status-${statusKey.replace('-', '')}`;
  };

  const isDeadlineOverdue = deadline && new Date(deadline) < new Date() && technology.status !== 'completed';
  const daysUntilDeadline = deadline ? Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="detail-page">
      {/* Заголовок с кнопкой назад */}
      <div className="detail-header">
        <button className="btn-back" onClick={onBack} title="Вернуться назад">
          ← Назад к списку
        </button>
        <h1 className="detail-title">{technology.title}</h1>
        <button 
          className="btn-delete-tech"
          onClick={handleDelete}
          title="Удалить технологию"
        >
          🗑️ Удалить
        </button>
      </div>

      <div className="detail-container">
        {/* Левая колонка - основная информация */}
        <div className="detail-main">
          {/* Описание */}
          <section className="detail-section">
            <h2>Описание</h2>
            <p className="description-text">{technology.description}</p>
          </section>

          {/* Заметки */}
          <section className="detail-section notes-section">
            <div className="section-header">
              <h2>Личные заметки</h2>
              <button 
                className={`btn-toggle-edit ${isEditingNotes ? 'editing' : ''}`}
                onClick={() => setIsEditingNotes(!isEditingNotes)}
              >
                {isEditingNotes ? '✓ Готово' : '✎ Редактировать'}
              </button>
            </div>
            
            {isEditingNotes ? (
              <div className="notes-editor">
                <textarea
                  className="notes-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Добавьте вашу заметку: конспект, код, команды, ссылки на решённые задачи..."
                />
                <div className="notes-actions">
                  <button className="btn btn-primary" onClick={handleSaveNotes}>
                    Сохранить заметку
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsEditingNotes(false)}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className={`notes-display ${notes ? 'has-notes' : 'empty-notes'}`}>
                {notes ? (
                  <div className="notes-content">
                    {notes.split('\n').map((line, idx) => (
                      <div key={idx} className="notes-line">
                        {line || '\n'}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Нет заметок. Нажмите «Редактировать», чтобы добавить свои заметки.</p>
                )}
              </div>
            )}
          </section>

          {/* Полезные ссылки */}
          <section className="detail-section resources-section">
            <div className="section-header">
              <h2>Полезные ссылки</h2>
              <span className="resource-count">{(technology.resources || []).length}</span>
            </div>

            <div className="resource-input">
              <input
                type="url"
                className="resource-url-input"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddResource()}
                placeholder="https://example.com/resource"
              />
              <button className="btn btn-primary" onClick={handleAddResource}>
                + Добавить ссылку
              </button>
            </div>

            {(technology.resources || []).length > 0 ? (
              <ul className="resources-list">
                {technology.resources.map((resource, idx) => (
                  <li key={idx} className="resource-item">
                    <a href={resource} target="_blank" rel="noopener noreferrer" className="resource-link">
                      {resource}
                    </a>
                    <button
                      className="btn-remove-resource"
                      onClick={() => onRemoveResource(technology.id, resource)}
                      title="Удалить ссылку"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-message">Ссылки ещё не добавлены</p>
            )}
          </section>
        </div>

        {/* Правая колонка - управление статусом и сроками */}
        <aside className="detail-sidebar">
          {/* Статус */}
          <section className="sidebar-section">
            <h3>Статус</h3>
            <div className={`current-status ${getStatusClass(technology.status)}`}>
              {getStatusText(technology.status)}
            </div>
            <div className="status-buttons">
              <button
                className={`btn-status ${technology.status === 'not-started' ? 'active' : ''}`}
                onClick={() => handleStatusChange('not-started')}
              >
                ○ Не начат
              </button>
              <button
                className={`btn-status ${technology.status === 'in-progress' ? 'active' : ''}`}
                onClick={() => handleStatusChange('in-progress')}
              >
                ◐ В работе
              </button>
              <button
                className={`btn-status ${technology.status === 'completed' ? 'active' : ''}`}
                onClick={() => handleStatusChange('completed')}
              >
                ◉ Выполнено
              </button>
            </div>
          </section>

          {/* Дедлайн */}
          <section className="sidebar-section deadline-section">
            <h3>Срок завершения</h3>
            <input
              type="date"
              className={`deadline-input ${isDeadlineOverdue ? 'overdue' : ''}`}
              value={deadline}
              onChange={handleDeadlineChange}
            />
            {deadline && (
              <div className="deadline-info">
                {isDeadlineOverdue && technology.status !== 'completed' ? (
                  <div className="deadline-overdue">
                    ⚠️ Просрочено на {Math.abs(daysUntilDeadline)} дн.
                  </div>
                ) : daysUntilDeadline >= 0 ? (
                  <div className="deadline-upcoming">
                    📅 Осталось {daysUntilDeadline} дн.
                  </div>
                ) : (
                  <div className="deadline-passed">
                    ✓ Срок пройден
                  </div>
                )}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

export default TechnologyDetailPage;