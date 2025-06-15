import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
  const handleTitleClick = () => {
    window.location.reload();
  };

  return (
    <header className="app-header">
      <h1 
        className="game-title clickable-title"
        onClick={handleTitleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTitleClick();
          }
        }}
      >
        Geometric Median
      </h1>
      <p className="tagline">Find the perfect center point</p>
    </header>
  );
};