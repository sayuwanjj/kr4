import React from 'react';
import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  const getStats = () => {
    const stats = {
      total: technologies.length,
      notStarted: technologies.filter(t => t.status === 'not-started').length,
      inProgress: technologies.filter(t => t.status === 'in-progress').length,
      completed: technologies.filter(t => t.status === 'completed').length
    };
    return stats;
  };

  const stats = getStats();
  const percentComplete = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <header className="progress-header">
      <div className="header-container">
        <div className="header-title">
          <h1>🎓 Дорожная карта изучения React</h1>
          <p className="subtitle">Отслеживание вашего прогресса обучения</p>
        </div>

        <div className="progress-stats">
          <div className="stat-item">
            <span className="stat-label">Всего технологий</span>
            <span className="stat-value total">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Изучено</span>
            <span className="stat-value completed">{stats.completed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">В процессе</span>
            <span className="stat-value in-progress">{stats.inProgress}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Не начато</span>
            <span className="stat-value not-started">{stats.notStarted}</span>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-label">
            <span>Прогресс обучения</span>
            <span className="progress-percentage">{percentComplete}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <p className="progress-text">
            ✨ Вы на правильном пути! Продолжайте обучение.
          </p>
        </div>
      </div>
    </header>
  );
}

export default ProgressHeader;
