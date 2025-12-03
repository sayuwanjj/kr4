import React from 'react';
import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange, onDelete, onEdit }) {
  const getStatusText = (statusKey) => {
    const statusMap = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Завершено'
    };
    return statusMap[statusKey] || statusKey;
  };

  // Обработчик удаления
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  // Обработчик редактирования
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(e);
    }
  };

  return (
    <div className={`technology-card status-${status}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="card-actions">
          <div className="action-buttons">
            <button 
              className="action-btn edit-btn"
              onClick={handleEdit}
              title="Редактировать"
            >
              ✏️
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={handleDelete}
              title="Удалить"
            >
              🗑️
            </button>
          </div>
          <span className="status-badge">{getStatusText(status)}</span>
        </div>
      </div>
      <p className="card-description">{description}</p>
      <div className="card-footer">
        <div className="status-controls">
          <button 
            className={`status-btn ${status === 'not-started' ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onStatusChange(id, 'not-started'); }}
          >
            ○
          </button>
          <button 
            className={`status-btn ${status === 'in-progress' ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onStatusChange(id, 'in-progress'); }}
          >
            ◐
          </button>
          <button 
            className={`status-btn ${status === 'completed' ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onStatusChange(id, 'completed'); }}
          >
            ◉
          </button>
        </div>
      </div>
    </div>
  );
}

export default TechnologyCard;