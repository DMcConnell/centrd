import React from 'react';
import type { Difficulty } from '../../types/game.types';
import { DIFFICULTY_CONFIG } from '../../types/game.types';
import './DifficultySelector.css';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onDifficultySelect: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onDifficultySelect,
}) => {
  const difficulties: {
    value: Difficulty;
    label: string;
    description: string;
  }[] = [
    {
      value: 'easy',
      label: 'Easy',
      description: `${DIFFICULTY_CONFIG.easy.minGrid}×${DIFFICULTY_CONFIG.easy.minGrid} to ${DIFFICULTY_CONFIG.easy.maxGrid}×${DIFFICULTY_CONFIG.easy.maxGrid} grid, ${DIFFICULTY_CONFIG.easy.minDots}-${DIFFICULTY_CONFIG.easy.maxDots} dots`,
    },
    {
      value: 'medium',
      label: 'Medium',
      description: `${DIFFICULTY_CONFIG.medium.minGrid}×${DIFFICULTY_CONFIG.medium.minGrid} to ${DIFFICULTY_CONFIG.medium.maxGrid}×${DIFFICULTY_CONFIG.medium.maxGrid} grid, ${DIFFICULTY_CONFIG.medium.minDots}-${DIFFICULTY_CONFIG.medium.maxDots} dots`,
    },
    {
      value: 'hard',
      label: 'Hard',
      description: `${DIFFICULTY_CONFIG.hard.minGrid}×${DIFFICULTY_CONFIG.hard.minGrid} to ${DIFFICULTY_CONFIG.hard.maxGrid}×${DIFFICULTY_CONFIG.hard.maxGrid} grid, ${DIFFICULTY_CONFIG.hard.minDots}-${DIFFICULTY_CONFIG.hard.maxDots} dots`,
    },
  ];

  return (
    <div className='difficulty-selector'>
      <h3>Difficulty</h3>
      <div className='difficulty-options'>
        {difficulties.map(({ value, label, description }) => (
          <button
            key={value}
            className={`difficulty-option ${
              selectedDifficulty === value ? 'selected' : ''
            }`}
            onClick={() => onDifficultySelect(value)}
          >
            <div className='difficulty-label'>{label}</div>
            <div className='difficulty-description'>{description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
