import React from 'react';
import './SearchBox.css';

function SearchBox({ searchQuery, onSearchChange, resultsCount }) {
  return (
    <div className="search-box-wrapper">
      <div className="search-box">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Поиск по названию или описанию..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          <svg 
            className="search-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <ircle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <div className="search-info">
          <span className="results-count">
            {searchQuery ? `Найдено: ${resultsCount}` : 'Введите текст для поиска'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
