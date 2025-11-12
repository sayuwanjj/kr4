function ProgressHeader({ technologies }) {
  // Расчет статистики
  const totalTechnologies = technologies.length;
  const completedTechnologies = technologies.filter(tech => tech.status === 'completed').length;
  const inProgressTechnologies = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStartedTechnologies = technologies.filter(tech => tech.status === 'not-started').length;
  
  // Расчет процента выполнения
  const progressPercentage = totalTechnologies > 0 
    ? Math.round((completedTechnologies / totalTechnologies) * 100) 
    : 0;

  // Определение статуса прогресса
  let progressStatus;
  if (progressPercentage === 0) {
    progressStatus = 'not-started';
  } else if (progressPercentage === 100) {
    progressStatus = 'completed';
  } else {
    progressStatus = 'in-progress';
  }

  return (
    <div className={`progress-header ${progressStatus}`}>
      <div className="header-content">
        <h1>📚 Дорожная карта изучения React</h1>
        
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">Всего технологий</span>
            <span className="stat-value">{totalTechnologies}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Изучено</span>
            <span className="stat-value completed">{completedTechnologies}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">В процессе</span>
            <span className="stat-value in-progress">{inProgressTechnologies}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Не начато</span>
            <span className="stat-value not-started">{notStartedTechnologies}</span>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-label">Прогресс обучения</span>
            <span className="progress-percent">{progressPercentage}%</span>
          </div>
          
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="progress-message">
            {progressPercentage === 0 && <p>🚀 Начните своё обучение React!</p>}
            {progressPercentage > 0 && progressPercentage < 100 && <p>💪 Вы на правильном пути! Продолжайте обучение.</p>}
            {progressPercentage === 100 && <p>🎉 Поздравляем! Вы изучили все технологии!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;