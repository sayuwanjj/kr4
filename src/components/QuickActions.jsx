import { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({ 
  technologies, 
  onMarkAllCompleted, 
  onResetAll, 
  onAddClick,
  onImportClick,
  onExportClick,
  onResetAllData 
}) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState('');

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toLocaleString('ru-RU'),
      roadmapName: 'Дорожная карта изучения React',
      version: '1.0',
      totalTechnologies: technologies.length,
      completed: technologies.filter(t => t.status === 'completed').length,
      inProgress: technologies.filter(t => t.status === 'in-progress').length,
      notStarted: technologies.filter(t => t.status === 'not-started').length,
      technologies: technologies.map(tech => ({
        id: tech.id,
        title: tech.title,
        description: tech.description,
        status: tech.status,
        notes: tech.notes || '',
        deadline: tech.deadline || '',
        resources: tech.resources || []
      }))
    };

    const dataStr = JSON.stringify(data, null, 2);
    setExportData(dataStr);
    setShowExportModal(true);

    // Копируем в буфер обмена
    navigator.clipboard.writeText(dataStr);
  };

  return (
    <div className="quick-actions">
      <h3>🚀 Быстрые действия</h3>
      <div className="action-buttons">
        <button
          onClick={onAddClick}
          className="btn btn-success"
          title="Добавить новую технологию"
        >
          ＋ Добавить технологию
        </button>
        <button
          onClick={onImportClick}
          className="btn btn-import"
          title="Импортировать данные из JSON"
        >
          📥 Импорт данных
        </button>
        <button
          onClick={onExportClick}
          className="btn btn-info"
          title="Экспортировать данные в JSON"
        >
          📤 Экспорт данных
        </button>
        <button
          onClick={onMarkAllCompleted}
          className="btn btn-complete"
          title="Отметить все технологии как выполненные"
        >
          ✅ Всё выполнено
        </button>
        <button
          onClick={onResetAll}
          className="btn btn-warning"
          title="Сбросить статусы всех технологий"
        >
          🔄 Сбросить статусы
        </button>
        {onResetAllData && (
          <button
            onClick={onResetAllData}
            className="btn btn-danger"
            title="Полный сброс всех данных"
          >
            🗑️ Сбросить всё
          </button>
        )}
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="📊 Экспорт данных"
      >
        <div className="export-content">
          <p>✅ Данные успешно подготовлены для экспорта!</p>
          <p className="info-text">
            Данные скопированы в буфер обмена и готовы к использованию.
          </p>

          <textarea
            className="export-textarea"
            value={exportData}
            readOnly
            rows="12"
          />

          <div className="export-stats">
            <h4>Содержимое файла:</h4>
            <ul>
              <li>Технологий: {technologies.length}</li>
              <li>Выполнено: {technologies.filter(t => t.status === 'completed').length}</li>
              <li>В процессе: {technologies.filter(t => t.status === 'in-progress').length}</li>
              <li>Не начато: {technologies.filter(t => t.status === 'not-started').length}</li>
            </ul>
          </div>

          <div className="export-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigator.clipboard.writeText(exportData);
              }}
            >
              📋 Скопировать ещё раз
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const blob = new Blob([exportData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `roadmap_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              💾 Скачать файл
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowExportModal(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;