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
            selectedMode === 'zen' ? 'selected' : ''
          }`}
          onClick={() => onModeSelect('zen')}
        >
          <div className='mode-title'>Zen Mode</div>
          <div className='mode-description'>Solve puzzles one at a time at your own pace</div>
          <div className='mode-count'>5 puzzles</div>
        </button>
        <button
          className={`mode-option ${
            selectedMode === 'daily' ? 'selected' : ''
          }`}
          onClick={() => onModeSelect('daily')}
        >
          <div className='mode-title'>Daily Challenge</div>
          <div className='mode-description'>Today's puzzle challenge for everyone</div>
          <div className='mode-count'>6 puzzles</div>
        </button>
      </div>
    </div>
  );
};
