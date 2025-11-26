import React from 'react';
import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange }) {
  const statuses = ['not-started', 'in-progress', 'completed'];

  const handleClick = () => {
    const currentIndex = statuses.indexOf(status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];
    
    // Уведомляем родителя (App.jsx)
    if (onStatusChange) {
      onStatusChange(id, nextStatus);
    }
  };

  const getStatusText = (statusKey) => {
    const statusMap = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Завершено'
    };
    return statusMap[statusKey] || statusKey;
  };

  return (
    <div 
      className={`technology-card status-${status}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <span className="status-badge">{getStatusText(status)}</span>
      </div>
      <p className="card-description">{description}</p>
    </div>
  );
}

export default TechnologyCard;
