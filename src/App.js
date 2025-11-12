// Файл: App.jsx (исправленный)

import './App.css';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import './components/ProgressHeader.css';
import './components/TechnologyCard.css';

function App() {
  const technologies = [
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов', status: 'completed' },
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX', status: 'in-progress' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов', status: 'not-started' }
  ];

  return (
    <div className="App">
      <ProgressHeader technologies={technologies} />
      
      <div className="technologies-container">
        {technologies.map(tech => (
          <TechnologyCard
            key={tech.id}
            title={tech.title}
            description={tech.description}
            status={tech.status}
            
          />
        ))}
      </div>
    </div>
  );
}

export default App;
