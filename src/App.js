import React, { useState } from 'react';
import './App.css';
import useTechnologies from './hooks/useTechnologies';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import SearchBox from './components/SearchBox';
import TechnologyNotes from './components/TechnologyNotes';

function App() {
  // ✅ Используем новый хук с updateAllStatus
  const { technologies, updateStatus, updateAllStatus, updateNotes, progress } = useTechnologies();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotes, setShowNotes] = useState(null);

  // ✅ Передаём новую функцию вместо старой логики
  const handleMarkAllCompleted = () => {
    updateAllStatus('completed');
    console.log('✅ Все технологии отмечены как выполненные!');
  };

  const handleResetAll = () => {
    updateAllStatus('not-started');
    console.log('🔄 Все статусы сброшены!');
  };

  const filterByStatus = (statusKey) => {
    return technologies.filter(tech => tech.status === statusKey);
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

  const filteredTechnologies = getFilteredTechnologies();

  return (
    <div className="App">
      <ProgressHeader technologies={technologies} />

      <main className="main-content">
        <div className="container">
          {/* ✅ Передаём updateAllStatus */}
          <QuickActions
            technologies={technologies}
            onMarkAllCompleted={handleMarkAllCompleted}
            onResetAll={handleResetAll}
            onUpdateAll={updateAllStatus}
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
                      onStatusChange={updateStatus}
                      onToggleNotes={() => setShowNotes(showNotes === tech.id ? null : tech.id)}
                      hasNotes={!!tech.notes}
                    />
                    {showNotes === tech.id && (
                      <TechnologyNotes
                        notes={tech.notes}
                        onNotesChange={updateNotes}
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
