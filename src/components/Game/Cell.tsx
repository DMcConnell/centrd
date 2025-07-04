import React from 'react';
import type { Position } from '../../types/game.types';
import './Cell.css';

interface CellProps {
  position: Position;
  size: number;
  onClick: (position: Position) => void;
  isUserGuess?: boolean;
  isCorrectAnswer?: boolean;
  isHighlighted?: boolean;
  disabled?: boolean;
  hasDot?: boolean;
}

export const Cell: React.FC<CellProps> = ({
  position,
  size,
  onClick,
  isUserGuess,
  isCorrectAnswer,
  isHighlighted,
  disabled,
  hasDot,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick(position);
    }
  };

  const classNames = [
    'cell',
    isUserGuess && 'cell-user-guess',
    isCorrectAnswer && 'cell-correct-answer',
    isHighlighted && 'cell-highlighted',
    disabled && 'cell-disabled',
    hasDot && 'cell-has-dot',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      onClick={handleClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {isUserGuess && <div className='cell-marker user-marker' />}
      {isCorrectAnswer && <div className='cell-marker correct-marker' />}
    </div>
  );
};
