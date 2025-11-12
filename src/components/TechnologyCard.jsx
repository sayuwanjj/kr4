function TechnologyCard({ title, description, status }) {
  let statusLabel;
  let statusClass;
  let progressPercent;

  if (status === 'not-started') {
    statusLabel = 'Не начато';
    statusClass = 'status-not-started';
    progressPercent = '0%';
  } else if (status === 'in-progress') {
    statusLabel = 'В процессе';
    statusClass = 'status-in-progress';
    progressPercent = '21%';
  } else if (status === 'completed') {
    statusLabel = 'Изучено';
    statusClass = 'status-completed';
    progressPercent = '100%';
  } else {
    statusLabel = 'Неизвестно';
    statusClass = '';
    progressPercent = '0%';
  }

  return (
    <div className={`technology-card ${statusClass}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <span>Статус: {statusLabel}</span>
      
      {/* Прогресс бар */}
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <span className="progress-text">{progressPercent}</span>
      </div>
    </div>
  );
}

export default TechnologyCard;
