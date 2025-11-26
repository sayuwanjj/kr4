import React, { useState } from 'react';
import './App.css';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';

function App() {
  const [technologies, setTechnologies] = useState([
    {
      id: 1,
      title: 'React Components',
      description: 'Базовые компоненты React и их жизненный цикл',
      status: 'not-started'
    },
    {
      id: 2,
      title: 'JSX Syntax',
      description: 'Синтаксис JSX и преобразование в JavaScript',
      status: 'not-started'
    },
    {
      id: 3,
      title: 'State & Props',
      description: 'Управление состоянием и передача props',
      status: 'not-started'
    },
    {
      id: 4,
      title: 'Hooks',
      description: 'useState, useEffect и другие хуки React',
      status: 'not-started'
    },
    {
      id: 5,
      title: 'Event Handling',
      description: 'Обработка событий в React компонентах',
      status: 'not-started'
    },
    {
      id: 6,
      title: 'Form Validation',
      description: 'Валидация форм и обработка пользовательского ввода',
      status: 'not-started'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  // Обработчик изменения статуса карточки
  const handleStatusChange = (id, newStatus) => {
    setTechnologies(prevTechs =>
      prevTechs.map(tech =>
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // Отметить все как выполненные
  const handleMarkAllCompleted = () => {
    setTechnologies(prevTechs =>
      prevTechs.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // Сбросить все статусы
  const handleResetAll = () => {
    setTechnologies(prevTechs =>
      prevTechs.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // Случайный выбор следующей технологии
  const handleRandomNext = () => {
    const notCompleted = technologies.filter(t => t.status !== 'completed');
    
    if (notCompleted.length > 0) {
      const randomTech = notCompleted[Math.floor(Math.random() * notCompleted.length)];
      handleStatusChange(randomTech.id, 'in-progress');
    }
  };

  // Фильтрация технологий
  const getFilteredTechnologies = () => {
    switch (activeFilter) {
      case 'not-started':
        return technologies.filter(tech => tech.status === 'not-started');
      case 'in-progress':
        return technologies.filter(tech => tech.status === 'in-progress');
      case 'completed':
        return technologies.filter(tech => tech.status === 'completed');
      default:
        return technologies;
    }
  };

  // Подсчет технологий по статусам
  const filterByStatus = (statusKey) => {
    return technologies.filter(tech => tech.status === statusKey);
  };

  const filteredTechnologies = getFilteredTechnologies();

  return (
    <div className="App">
      <ProgressHeader technologies={technologies} />

      <main className="main-content">
        <div className="container">
          {/* Быстрые действия */}
          <QuickActions 
            technologies={technologies}
            onMarkAllCompleted={handleMarkAllCompleted}
            onResetAll={handleResetAll}
            onRandomNext={handleRandomNext}
          />

          {/* Фильтры */}
          <section className="filters-section">
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
                Не начато ({filterByStatus('not-started').length})
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
                onClick={() => setActiveFilter('in-progress')}
              >
                В процессе ({filterByStatus('in-progress').length})
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveFilter('completed')}
              >
                Завершено ({filterByStatus('completed').length})
              </button>
            </div>
          </section>

          {/* Карточки технологий */}
          <section className="technologies-section">
            <h2>Технологии к изучению</h2>
            {filteredTechnologies.length > 0 ? (
              <div className="technologies-grid">
                {filteredTechnologies.map(tech => (
                  <TechnologyCard
                    key={tech.id}
                    id={tech.id}
                    title={tech.title}
                    description={tech.description}
                    status={tech.status}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>В этой категории нет технологий</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
