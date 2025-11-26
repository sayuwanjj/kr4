import { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAll, technologies, onUpdateAll }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState('');

  // ✅ Обработчик для "Отметить всё как выполненные"
  const handleMarkAllCompleted = () => {
    if (onUpdateAll) {
      onUpdateAll('completed');
    } else if (onMarkAllCompleted) {
      onMarkAllCompleted();
    }
  };

  // ✅ Обработчик для "Сбросить все статусы"
  const handleResetAll = () => {
    if (onUpdateAll) {
      onUpdateAll('not-started');
    } else if (onResetAll) {
      onResetAll();
    }
  };

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toLocaleString('ru-RU'),
      totalTechnologies: technologies.length,
      completed: technologies.filter(t => t.status === 'completed').length,
      inProgress: technologies.filter(t => t.status === 'in-progress').length,
      notStarted: technologies.filter(t => t.status === 'not-started').length,
      technologies: technologies
    };

    const dataStr = JSON.stringify(data, null, 2);
    setExportData(dataStr);
    setShowExportModal(true);

    // Копируем в буфер обмена
    navigator.clipboard.writeText(dataStr);
    console.log('✅ Данные скопированы в буфер обмена');
  };

  return (
    <div className="quick-actions">
      <h3>🚀 Быстрые действия</h3>
      <div className="action-buttons">
        <button
          onClick={handleMarkAllCompleted}
          className="btn btn-success"
          title="Отметить все технологии как выполненные"
        >
          ✅ Отметить всё как выполненные
        </button>
        <button
          onClick={handleResetAll}
          className="btn btn-warning"
          title="Сбросить статусы всех технологий"
        >
          🔄 Сбросить все статусы
        </button>
        <button
          onClick={handleExport}
          className="btn btn-info"
          title="Экспортировать данные в JSON"
        >
          📤 Экспорт данных
        </button>
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
            rows="10"
          />

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
