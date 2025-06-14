import React from 'react';
import type { GameMode } from '../../types/game.types';
import './ModeSelector.css';

interface ModeSelectorProps {
  selectedMode: GameMode;
  onModeSelect: (mode: GameMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  onModeSelect,
}) => {
  return (
    <div className='mode-selector'>
      <h3>Game Mode</h3>
      <div className='mode-options'>
        <button
          className={`mode-option ${
            selectedMode === 'sequential' ? 'selected' : ''
          }`}
          onClick={() => onModeSelect('sequential')}
        >
          <div className='mode-title'>Sequential</div>
          <div className='mode-description'>Solve one puzzle at a time</div>
          <div className='mode-count'>5 puzzles</div>
        </button>
        <button
          className={`mode-option ${
            selectedMode === 'multi-grid' ? 'selected' : ''
          }`}
          onClick={() => onModeSelect('multi-grid')}
        >
          <div className='mode-title'>Multi-Grid</div>
          <div className='mode-description'>Solve several puzzles at once</div>
          <div className='mode-count'>4 puzzles</div>
        </button>
      </div>
    </div>
  );
};
