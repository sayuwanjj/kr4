import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
  {
    id: 1,
    title: 'React Components',
    description: 'Изучение базовых компонентов',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 2,
    title: 'JSX Syntax',
    description: 'Синтаксис JSX и преобразование в JavaScript',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 3,
    title: 'State & Props',
    description: 'Управление состоянием и передача props',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 4,
    title: 'Node.js Basics',
    description: 'Основы серверного JavaScript',
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  {
    id: 5,
    title: 'Express.js',
    description: 'Фреймворк для создания серверов',
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  {
    id: 6,
    title: 'MongoDB',
    description: 'NoSQL база данных',
    status: 'completed',
    notes: 'Завершено во время практики',
    category: 'database'
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  // ✅ Функция для обновления одной технологии
  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // ✅ Функция для обновления всех технологий сразу (НОВАЯ!)
  const updateAllStatus = (newStatus) => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: newStatus }))
    );
  };

  // ✅ Функция для обновления заметок
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // ✅ Функция для расчета общего прогресса
  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  // ✅ Функция для фильтрации по категории
  const getTechnologiesByCategory = (category) => {
    return technologies.filter(tech => tech.category === category);
  };

  // ✅ Функция для получения статистики
  const getStats = () => {
    return {
      total: technologies.length,
      completed: technologies.filter(t => t.status === 'completed').length,
      inProgress: technologies.filter(t => t.status === 'in-progress').length,
      notStarted: technologies.filter(t => t.status === 'not-started').length
    };
  };

  return {
    technologies,
    updateStatus,
    updateAllStatus,      // ✅ НОВАЯ функция для массовых операций
    updateNotes,
    progress: calculateProgress(),
    getTechnologiesByCategory,
    getStats
  };
}

export default useTechnologies;
