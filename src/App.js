import React, { useState, useEffect } from 'react';
import './App.css';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import SearchBox from './components/SearchBox';
import TechnologyNotes from './components/TechnologyNotes';

function App() {
  const [technologies, setTechnologies] = useState([
    {
      id: 1,
      title: 'React Components',
      description: 'Базовые компоненты React и их жизненный цикл',
      status: 'not-started',
      notes: ''
    },
    {
      id: 2,
      title: 'JSX Syntax',
      description: 'Синтаксис JSX и преобразование в JavaScript',
      status: 'not-started',
      notes: ''
    },
    {
      id: 3,
      title: 'State & Props',
      description: 'Управление состоянием и передача props',
      status: 'not-started',
      notes: ''
    },
    {
      id: 4,
      title: 'Hooks',
      description: 'useState, useEffect и другие хуки React',
      status: 'not-started',
      notes: ''
    },
    {
      id: 5,
      title: 'Event Handling',
      description: 'Обработка событий в React компонентах',
      status: 'not-started',
      notes: ''
    },
    {
      id: 6,
      title: 'Form Validation',
      description: 'Валидация форм и обработка пользовательского ввода',
      status: 'not-started',
      notes: ''
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotes, setShowNotes] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ ЗАГРУЖАЕМ ИЗ LOCALSTORAGE ПРИ ПЕРВОМ РЕНДЕРЕ
  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setTechnologies(parsedData);
        console.log('✅ Данные загружены из localStorage!');
      } catch (error) {
        console.error('❌ Ошибка при загрузке:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // ✅ СОХРАНЯЕМ В LOCALSTORAGE ПРИ ЛЮБОМ ИЗМЕНЕНИИ
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('techTrackerData', JSON.stringify(technologies));
      console.log('💾 Данные сохранены в localStorage!');
    }
  }, [technologies, isLoaded]);

  const handleStatusChange = (id, newStatus) => {
    setTechnologies(prevTechs =>
      prevTechs.map(tech =>
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  const updateTechnologyNotes = (techId, newNotes) => {
    setTechnologies(prevTech =>
      prevTech.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  const handleMarkAllCompleted = () => {
    setTechnologies(prevTechs =>
      prevTechs.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  const handleResetAll = () => {
    setTechnologies(prevTechs =>
      prevTechs.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  const handleRandomNext = () => {
    const notCompleted = technologies.filter(t => t.status !== 'completed');
    if (notCompleted.length > 0) {
      const randomTech = notCompleted[Math.floor(Math.random() * notCompleted.length)];
      handleStatusChange(randomTech.id, 'in-progress');
    }
  };

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

  const filterByStatus = (statusKey) => {
    return technologies.filter(tech => tech.status === statusKey);
  };

  const filteredTechnologies = getFilteredTechnologies();

  return (
    <div className="App">
      <ProgressHeader technologies={technologies} />

      <main className="main-content">
        <div className="container">
          <QuickActions 
            technologies={technologies}
            onMarkAllCompleted={handleMarkAllCompleted}
            onResetAll={handleResetAll}
            onRandomNext={handleRandomNext}
          />

          <SearchBox 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultsCount={filteredTechnologies.length}
          />

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

          <section className="technologies-section">
            <h2>Технологии к изучению</h2>
            {filteredTechnologies.length > 0 ? (
              <div className="technologies-grid">
                {filteredTechnologies.map(tech => (
                  <div key={tech.id} className="tech-card-wrapper">
                    <TechnologyCard
                      id={tech.id}
                      title={tech.title}
                      description={tech.description}
                      status={tech.status}
                      onStatusChange={handleStatusChange}
                      onToggleNotes={() => setShowNotes(showNotes === tech.id ? null : tech.id)}
                      hasNotes={!!tech.notes}
                    />
                    {showNotes === tech.id && (
                      <TechnologyNotes
                        notes={tech.notes}
                        onNotesChange={updateTechnologyNotes}
                        techId={tech.id}
                      />
                    )}
                  </div>
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
