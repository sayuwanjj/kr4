import React, { useState, useEffect } from 'react';
import './App.css';
import useTechnologies from './hooks/useTechnologies';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import SearchBox from './components/SearchBox';
import TechnologyDetailPage from './components/TechnologyDetailPage';
import Modal from './components/Modal';

function App() {
  const { 
    technologies, 
    importError,
    importSuccess,
    updateStatus, 
    updateAllStatus, // Импортируем новую функцию
    updateNotes, 
    updateDeadline,
    addResource,
    removeResource,
    addTechnology,
    deleteTechnology,
    updateTechnology,
    exportToJSON,
    importFromJSON,
    resetAllData,
    calculateProgress,
    clearImportNotifications
  } = useTechnologies();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechId, setSelectedTechId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [editingTech, setEditingTech] = useState(null);
  
  // Состояние для новой технологии
  const [newTech, setNewTech] = useState({
    title: '',
    description: ''
  });

  // ✅ Переход на страницу с деталями технологии
  const handleCardClick = (techId) => {
    setSelectedTechId(techId);
  };

  // ✅ Возврат на главную страницу
  const handleBackFromDetail = () => {
    setSelectedTechId(null);
  };

  // ✅ Обработчик добавления новой технологии
  const handleAddTechnology = () => {
    if (newTech.title.trim()) {
      addTechnology(newTech);
      setNewTech({ title: '', description: '' });
      setShowAddModal(false);
    }
  };

  // ✅ Обработчик удаления технологии
  const handleDeleteTechnology = (techId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
      deleteTechnology(techId);
      if (selectedTechId === techId) {
        setSelectedTechId(null);
      }
    }
  };

  // ✅ Обработчик редактирования технологии
  const handleEditTechnology = () => {
    if (editingTech && editingTech.title.trim()) {
      updateTechnology(editingTech.id, {
        title: editingTech.title,
        description: editingTech.description
      });
      setShowEditModal(false);
      setEditingTech(null);
    }
  };

  // ✅ Открытие модального окна редактирования
  const handleOpenEditModal = (tech, e) => {
    e.stopPropagation();
    setEditingTech({ ...tech });
    setShowEditModal(true);
  };

  // ✅ Обработчик импорта JSON
  const handleImportJSON = async (file) => {
    setImportStatus({ type: 'loading', message: 'Загрузка файла...' });
    
    try {
      const result = await importFromJSON(file);
      setImportStatus({ 
        type: 'success', 
        message: `Успешно импортировано ${result.technologies.length} технологий` 
      });
      setImportPreview(result);
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatus(null);
      }, 2000);
    } catch (error) {
      setImportStatus({ 
        type: 'error', 
        message: error.message,
        details: error.validationErrors 
      });
    }
  };

  // ✅ Обработчик выбора файла для импорта
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImportJSON(file);
    }
    e.target.value = null; // Сброс input
  };

  // ✅ Открытие модального окна импорта
  const handleOpenImportModal = () => {
    setShowImportModal(true);
    setImportStatus(null);
    setImportPreview(null);
  };

  // ✅ Закрытие уведомлений об импорте
  const handleCloseNotification = () => {
    clearImportNotifications();
  };

  // Эффект для отображения уведомлений об импорте
  useEffect(() => {
    let errorTimer;
    let successTimer;
    
    if (importError) {
      errorTimer = setTimeout(() => {
        clearImportNotifications();
      }, 5000);
    }
    
    if (importSuccess) {
      successTimer = setTimeout(() => {
        clearImportNotifications();
      }, 3000);
    }
    
    return () => {
      clearTimeout(errorTimer);
      clearTimeout(successTimer);
    };
  }, [importError, importSuccess, clearImportNotifications]);

  // ✅ Обработчик для "Отметить все как выполненные"
  const handleMarkAllCompleted = () => {
    updateAllStatus('completed');
  };

  // ✅ Обработчик для "Сбросить все статусы"
  const handleResetAll = () => {
    updateAllStatus('not-started');
  };

  // Получить выбранную технологию для детальной страницы
  const selectedTechnology = technologies.find(tech => tech.id === selectedTechId);

  // Если выбрана технология - показываем детальную страницу
  if (selectedTechnology) {
    return (
      <TechnologyDetailPage
        technology={selectedTechnology}
        onStatusChange={updateStatus}
        onNotesChange={updateNotes}
        onDeadlineChange={updateDeadline}
        onAddResource={addResource}
        onRemoveResource={removeResource}
        onDelete={handleDeleteTechnology}
        onBack={handleBackFromDetail}
      />
    );
  }

  // Главная страница
  const getFilteredTechnologies = () => {
    let filtered = technologies;
    
    switch (activeFilter) {
      case 'not-started':
        filtered = filtered.filter(tech => tech.status === 'not-started');
        break;
      case 'in-progress':
        filtered = filtered.filter(tech => tech.status === 'in-progress');
        break;
      case 'completed':
        filtered = filtered.filter(tech => tech.status === 'completed');
        break;
      default:
        break;
    }

    if (searchQuery) {
      filtered = filtered.filter(tech =>
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredTechnologies = getFilteredTechnologies();
  const progress = calculateProgress();

  return (
    <div className="app">
      <ProgressHeader technologies={technologies} />
      
      {/* Уведомления об импорте */}
      {importError && (
        <div className="notification error">
          <span>❌ Ошибка импорта: {importError.message || importError}</span>
          <button onClick={handleCloseNotification}>✕</button>
        </div>
      )}
      
      {importSuccess && (
        <div className="notification success">
          <span>✅ {importSuccess.message || 'Данные успешно импортированы'}</span>
          <button onClick={handleCloseNotification}>✕</button>
        </div>
      )}
      
      <div className="app-content">
        <div className="filters-section">
          <h2>Фильтры</h2>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Все ({technologies.length})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'not-started' ? 'active' : ''}`}
              onClick={() => setActiveFilter('not-started')}
            >
              Не начато ({technologies.filter(t => t.status === 'not-started').length})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setActiveFilter('in-progress')}
            >
              В процессе ({technologies.filter(t => t.status === 'in-progress').length})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              Завершено ({technologies.filter(t => t.status === 'completed').length})
            </button>
          </div>
        </div>

        <SearchBox 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultsCount={filteredTechnologies.length}
        />

        <QuickActions 
          technologies={technologies}
          onAddClick={() => setShowAddModal(true)}
          onImportClick={handleOpenImportModal}
          onExportClick={exportToJSON}
          onMarkAllCompleted={handleMarkAllCompleted}
          onResetAll={handleResetAll}
          onResetAllData={resetAllData}
        />

        <section className="technologies-section">
          <h2>Технологии к изучению</h2>
          {filteredTechnologies.length > 0 ? (
            <div className="technologies-grid">
              {filteredTechnologies.map(tech => (
                <div key={tech.id} onClick={() => handleCardClick(tech.id)}>
                  <TechnologyCard
                    id={tech.id}
                    title={tech.title}
                    description={tech.description}
                    status={tech.status}
                    onStatusChange={updateStatus}
                    onDelete={handleDeleteTechnology}
                    onEdit={(e) => handleOpenEditModal(tech, e)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              {searchQuery ? 'По вашему запросу ничего не найдено' : 'Нет технологий для отображения'}
            </div>
          )}
        </section>

        {/* Модальное окно добавления новой технологии */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="➕ Добавить новую технологию"
        >
          <div className="modal-form">
            <div className="form-group">
              <label htmlFor="tech-title">Название технологии*</label>
              <input
                id="tech-title"
                type="text"
                value={newTech.title}
                onChange={(e) => setNewTech({...newTech, title: e.target.value})}
                placeholder="Например: React Hooks"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tech-description">Описание</label>
              <textarea
                id="tech-description"
                value={newTech.description}
                onChange={(e) => setNewTech({...newTech, description: e.target.value})}
                placeholder="Краткое описание технологии..."
                rows="4"
                className="form-textarea"
              />
            </div>
            
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleAddTechnology}
                disabled={!newTech.title.trim()}
              >
                Добавить
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </Modal>

        {/* Модальное окно редактирования технологии */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="✏️ Редактировать технологию"
        >
          {editingTech && (
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="edit-tech-title">Название технологии*</label>
                <input
                  id="edit-tech-title"
                  type="text"
                  value={editingTech.title}
                  onChange={(e) => setEditingTech({...editingTech, title: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-tech-description">Описание</label>
                <textarea
                  id="edit-tech-description"
                  value={editingTech.description}
                  onChange={(e) => setEditingTech({...editingTech, description: e.target.value})}
                  rows="4"
                  className="form-textarea"
                />
              </div>
              
              <div className="modal-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleEditTechnology}
                  disabled={!editingTech.title.trim()}
                >
                  Сохранить изменения
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Модальное окно импорта JSON */}
        <Modal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          title="📥 Импорт данных из JSON"
        >
          <div className="import-modal-content">
            {importStatus?.type === 'loading' && (
              <div className="import-status loading">
                <div className="spinner"></div>
                <p>{importStatus.message}</p>
              </div>
            )}
            
            {importStatus?.type === 'success' && (
              <div className="import-status success">
                <div className="status-icon">✅</div>
                <h3>Импорт выполнен успешно!</h3>
                <p>{importStatus.message}</p>
                {importPreview && (
                  <div className="import-preview">
                    <h4>Импортированные данные:</h4>
                    <ul>
                      <li>Технологий: {importPreview.technologies.length}</li>
                      {importPreview.metadata?.name && (
                        <li>Название: {importPreview.metadata.name}</li>
                      )}
                      {importPreview.metadata?.exportedAt && (
                        <li>Дата экспорта: {new Date(importPreview.metadata.exportedAt).toLocaleDateString()}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {importStatus?.type === 'error' && (
              <div className="import-status error">
                <div className="status-icon">❌</div>
                <h3>Ошибка импорта</h3>
                <p className="error-message">{importStatus.message}</p>
                {importStatus.details && (
                  <div className="error-details">
                    <h4>Детали ошибки:</h4>
                    <ul>
                      {Array.isArray(importStatus.details) 
                        ? importStatus.details.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))
                        : <li>{importStatus.details}</li>
                      }
                    </ul>
                  </div>
                )}
                <div className="import-help">
                  <h4>Требования к файлу:</h4>
                  <ul>
                    <li>Формат: JSON (.json)</li>
                    <li>Максимальный размер: 5MB</li>
                    <li>Должен содержать массив технологий или объект с полем "technologies"</li>
                    <li>Каждая технология должна иметь "title" и "description"</li>
                    <li>Статусы: "not-started", "in-progress", "completed"</li>
                  </ul>
                </div>
              </div>
            )}
            
            {!importStatus && (
              <>
                <div className="import-instructions">
                  <p>Выберите файл JSON для импорта данных дорожной карты.</p>
                  <div className="file-format-info">
                    <h4>Поддерживаемые форматы:</h4>
                    <ul>
                      <li>Массив объектов технологий</li>
                      <li>Объект с полем "technologies" (массив)</li>
                      <li>Файлы, экспортированные из этого приложения</li>
                    </ul>
                  </div>
                </div>
                
                <div className="import-actions">
                  <label className="btn btn-primary file-input-label">
                    📁 Выбрать файл
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="file-input"
                    />
                  </label>
                  
                  <div className="sample-download">
                    <p>Пример структуры файла:</p>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        const sampleData = {
                          roadmapName: "Пример дорожной карты",
                          technologies: [
                            {
                              id: 1,
                              title: "Пример технологии",
                              description: "Описание технологии",
                              status: "not-started",
                              notes: "",
                              deadline: "",
                              resources: []
                            }
                          ]
                        };
                        
                        const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'sample_roadmap.json';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      📄 Скачать пример
                    </button>
                  </div>
                </div>
              </>
            )}
            
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowImportModal(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default App;