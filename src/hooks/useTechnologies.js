import { useState } from 'react';
import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
];

// Функция валидации структуры импортируемых данных
const validateImportedData = (data) => {
  const errors = [];
  
  // Проверка, что это объект или массив
  if (!data || typeof data !== 'object') {
    errors.push('Файл должен содержать JSON объект или массив');
    return { isValid: false, errors, technologies: [] };
  }
  
  let technologiesArray = [];
  
  // Если данные - массив технологий
  if (Array.isArray(data)) {
    technologiesArray = data;
  } 
  // Если данные - объект с полем technologies
  else if (data.technologies && Array.isArray(data.technologies)) {
    technologiesArray = data.technologies;
  }
  // Если данные - объект с одной технологией
  else if (data.title && data.description) {
    technologiesArray = [data];
  }
  else {
    errors.push('Не найден массив technologies или объект технологии');
    return { isValid: false, errors, technologies: [] };
  }
  
  // Валидация каждой технологии
  const validatedTechnologies = [];
  
  technologiesArray.forEach((tech, index) => {
    const techErrors = [];
    
    // Проверка обязательных полей
    if (!tech.title || typeof tech.title !== 'string' || tech.title.trim() === '') {
      techErrors.push(`Технология #${index + 1}: отсутствует или некорректно название`);
    }
    
    if (!tech.description || typeof tech.description !== 'string') {
      techErrors.push(`Технология #${index + 1}: отсутствует описание`);
    }
    
    // Проверка статуса
    const validStatuses = ['not-started', 'in-progress', 'completed'];
    if (tech.status && !validStatuses.includes(tech.status)) {
      techErrors.push(`Технология #${index + 1}: некорректный статус "${tech.status}". Допустимые значения: ${validStatuses.join(', ')}`);
    }
    
    if (techErrors.length === 0) {
      // Нормализация технологии
      validatedTechnologies.push({
        id: tech.id || Date.now() + Math.random() * 1000,
        title: tech.title.trim(),
        description: tech.description,
        status: tech.status || 'not-started',
        notes: tech.notes || '',
        deadline: tech.deadline || '',
        resources: Array.isArray(tech.resources) ? tech.resources : []
      });
    } else {
      errors.push(...techErrors);
    }
  });
  
  if (validatedTechnologies.length === 0 && errors.length > 0) {
    return { isValid: false, errors, technologies: [] };
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    technologies: validatedTechnologies,
    metadata: {
      name: data.roadmapName || data.name || 'Импортированная дорожная карта',
      total: validatedTechnologies.length,
      exportedAt: data.exportedAt || new Date().toISOString()
    }
  };
};

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('techTrackerData', initialTechnologies);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(null);

  // ✅ Обновление статуса
  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // ✅ Обновление ВСЕХ статусов сразу
  const updateAllStatus = (newStatus) => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: newStatus }))
    );
  };

  // ✅ Обновление заметок
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // ✅ Обновление дедлайна
  const updateDeadline = (techId, newDeadline) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, deadline: newDeadline } : tech
      )
    );
  };

  // ✅ Добавление ресурса
  const addResource = (techId, resourceUrl) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId
          ? { ...tech, resources: [...(tech.resources || []), resourceUrl] }
          : tech
      )
    );
  };

  // ✅ Удаление ресурса
  const removeResource = (techId, resourceUrl) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId
          ? {
              ...tech,
              resources: (tech.resources || []).filter(r => r !== resourceUrl)
            }
          : tech
      )
    );
  };

  // ✅ Расчет прогресса
  const calculateProgress = () => {
    const safeTechs = Array.isArray(technologies) ? technologies : [];
    if (safeTechs.length === 0) return 0;
    const completed = safeTechs.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / safeTechs.length) * 100);
  };

  // ✅ Получение статистики
  const getStats = () => {
    const safeTechs = Array.isArray(technologies) ? technologies : [];
    
    return {
      total: safeTechs.length || 0,
      completed: safeTechs.filter(t => t.status === 'completed').length || 0,
      inProgress: safeTechs.filter(t => t.status === 'in-progress').length || 0,
      notStarted: safeTechs.filter(t => t.status === 'not-started').length || 0,
      overdue: safeTechs.filter(t => {
        if (!t.deadline || t.status === 'completed') return false;
        const deadlineDate = new Date(t.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return deadlineDate < today;
      }).length || 0
    };
  };

  // ✅ Добавление новой технологии
  const addTechnology = (newTech) => {
    setTechnologies(prev => {
      const maxId = prev.length > 0 ? Math.max(...prev.map(t => t.id)) : 0;
      const technology = {
        id: maxId + 1,
        title: newTech.title || 'Новая технология',
        description: newTech.description || '',
        status: 'not-started',
        notes: '',
        deadline: '',
        resources: []
      };
      return [...prev, technology];
    });
  };

  // ✅ Обновление технологии
  const updateTechnology = (techId, updatedFields) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, ...updatedFields } : tech
      )
    );
  };

  // ✅ Удаление технологии
  const deleteTechnology = (techId) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== techId));
  };

  // ✅ Экспорт в JSON
  const exportToJSON = () => {
    const data = {
      exportedAt: new Date().toLocaleString('ru-RU'),
      roadmapName: 'Дорожная карта изучения React',
      version: '1.0',
      technologies: Array.isArray(technologies) ? technologies : initialTechnologies,
      statistics: getStats(),
      progress: calculateProgress()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roadmap_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ✅ Импорт из JSON с валидацией и обработкой ошибок
  const importFromJSON = (file) => {
    return new Promise((resolve, reject) => {
      setImportError(null);
      setImportSuccess(null);
      
      if (!file || !file.name.endsWith('.json')) {
        const error = new Error('Выберите файл в формате JSON');
        setImportError(error.message);
        reject(error);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        const error = new Error('Файл слишком большой. Максимальный размер: 5MB');
        setImportError(error.message);
        reject(error);
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          
          // Валидация и парсинг данных
          const validationResult = validateImportedData(jsonData);
          
          if (!validationResult.isValid) {
            const error = new Error('Ошибки валидации данных:');
            error.validationErrors = validationResult.errors;
            setImportError({
              message: 'Файл содержит ошибки',
              details: validationResult.errors
            });
            reject(error);
            return;
          }
          
          // Установка импортированных технологий
          setTechnologies(validationResult.technologies);
          
          // Успешный импорт
          setImportSuccess({
            message: 'Данные успешно импортированы!',
            details: {
              importedCount: validationResult.technologies.length,
              roadmapName: validationResult.metadata.name,
              errors: validationResult.errors.length
            }
          });
          
          resolve({
            success: true,
            technologies: validationResult.technologies,
            metadata: validationResult.metadata,
            warnings: validationResult.errors
          });
          
        } catch (error) {
          const importError = new Error(`Ошибка парсинга JSON: ${error.message}`);
          setImportError(importError.message);
          reject(importError);
        }
      };
      
      reader.onerror = () => {
        const error = new Error('Ошибка чтения файла');
        setImportError(error.message);
        reject(error);
      };
      
      reader.readAsText(file);
    });
  };

  // ✅ Сброс всех данных
  const resetAllData = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
      setTechnologies(initialTechnologies);
      setImportError(null);
      setImportSuccess(null);
    }
  };

  // ✅ Очистка уведомлений об импорте
  const clearImportNotifications = () => {
    setImportError(null);
    setImportSuccess(null);
  };

  return {
    technologies: Array.isArray(technologies) ? technologies : [],
    importError,
    importSuccess,
    updateStatus,
    updateAllStatus, // Важно: экспортируем эту функцию
    updateNotes,
    updateDeadline,
    addResource,
    removeResource,
    calculateProgress,
    getStats,
    addTechnology,
    updateTechnology,
    deleteTechnology,
    exportToJSON,
    importFromJSON,
    resetAllData,
    clearImportNotifications
  };
}

export default useTechnologies;