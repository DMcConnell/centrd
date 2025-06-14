import React from 'react';
import type { GameState, Position } from '../../types/game.types';
import { Grid } from './Grid';
import './GameBoard.css';

interface GameBoardProps {
  gameState: GameState;
  onCellClick: (puzzleId: string, position: Position) => void;
  onNextPuzzle: () => void;
  onSubmitAll: () => void;
  onViewFinalScore: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onCellClick,
  onNextPuzzle,
  onSubmitAll,
  onViewFinalScore,
}) => {
  const { mode, puzzles, currentPuzzleIndex, isRevealing } = gameState;

  if (mode === 'sequential') {
    const currentPuzzle = puzzles[currentPuzzleIndex];
    if (!currentPuzzle) return null;

    return (
      <div className='game-board sequential-mode'>
        <Grid
          puzzle={currentPuzzle}
          onCellClick={(position) => onCellClick(currentPuzzle.id, position)}
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
  }

  // Multi-grid mode
  const allGuessed = puzzles.every((p) => p.userGuess !== undefined);
  const cellSize = puzzles[0]?.gridSize > 10 ? 35 : 40;

  return (
    <div className='game-board multi-grid-mode'>
      <div className='grid-container-multi'>
        {puzzles.map((puzzle) => (
          <div key={puzzle.id} className='grid-wrapper'>
            <Grid
              puzzle={puzzle}
              onCellClick={(position) => onCellClick(puzzle.id, position)}
              disabled={isRevealing}
              cellSize={cellSize}
            />
            {puzzle.score !== undefined && (
              <div className='mini-score'>
                {puzzle.score === 0 ? 'Perfect!' : puzzle.score.toFixed(2)}
              </div>
            )}
          </div>
        ))}
      </div>
      {!isRevealing && (
        <button
          className='submit-all-button'
          onClick={onSubmitAll}
          disabled={!allGuessed}
        >
          Submit All ({puzzles.filter((p) => p.userGuess).length}/
          {puzzles.length})
        </button>
      )}
      {isRevealing && !gameState.isComplete && (
        <button className='view-final-score-button' onClick={onViewFinalScore}>
          View Final Score
        </button>
      )}
    </div>
  );
};
