import React from 'react';
import type { Position, Puzzle } from '../../types/game.types';
import { Cell } from './Cell';
import { Dot } from './Dot';
import './Grid.css';

interface GridProps {
  puzzle: Puzzle;
  onCellClick: (position: Position) => void;
  disabled?: boolean;
  cellSize?: number;
}

export const Grid: React.FC<GridProps> = ({
  puzzle,
  onCellClick,
  disabled = false,
  cellSize = 50,
}) => {
  const { gridSize, dots, userGuess, correctAnswer } = puzzle;

  const cells: React.ReactElement[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const position = { x, y };
      const isUserGuess = userGuess?.x === x && userGuess?.y === y;
      const isCorrectAnswer = correctAnswer?.x === x && correctAnswer?.y === y;

      cells.push(
        <Cell
          key={`${x}-${y}`}
          position={position}
          size={cellSize}
          onClick={onCellClick}
          isUserGuess={isUserGuess}
          isCorrectAnswer={isCorrectAnswer}
          disabled={disabled || !!userGuess}
        />,
      );
    }
  }

  return (
    <div
      className='grid-container'
      style={{
        width: `${gridSize * cellSize}px`,
        height: `${gridSize * cellSize}px`,
      }}
    >
      <div
        className='grid'
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        }}
      >
        {cells}
      </div>
      <div className='dots-container'>
        {dots.map((dot, index) => (
          <Dot
            key={index}
            position={dot}
            cellSize={cellSize}
            color={
              index % 3 === 0
                ? '#6B9BD1'
                : index % 3 === 1
                ? '#FF9B9B'
                : '#9BD1C8'
            }
          />
        ))}
      </div>
    </div>
  );
};
