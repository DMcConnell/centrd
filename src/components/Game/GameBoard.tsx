import React from 'react';
import type { GameState, Position } from '../../types/game.types';
import { Grid } from './Grid';
import './GameBoard.css';

interface GameBoardProps {
  gameState: GameState;
  onCellClick: (puzzleId: string, position: Position) => void;
  onNextPuzzle: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onCellClick,
  onNextPuzzle,
}) => {
  const { puzzles, currentPuzzleIndex, isRevealing } = gameState;
  const currentPuzzle = puzzles[currentPuzzleIndex];
  
  if (!currentPuzzle) return null;

  return (
    <div className='game-board'>
      <Grid
        puzzle={currentPuzzle}
        onCellClick={(position: Position) => onCellClick(currentPuzzle.id, position)}
        disabled={isRevealing}
      />
      {currentPuzzle.score !== undefined && (
        <div className='score-display'>
          {currentPuzzle.score === 0 ? (
            <span className='perfect-score'>Perfect!</span>
          ) : (
            <span>Distance: {currentPuzzle.score.toFixed(2)}</span>
          )}
          <button className='next-button' onClick={onNextPuzzle}>
            {currentPuzzleIndex < puzzles.length - 1
              ? 'Next Puzzle'
              : 'View Results'}
          </button>
        </div>
      )}
    </div>
  );
};
