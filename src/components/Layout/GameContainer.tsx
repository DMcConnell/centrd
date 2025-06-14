import React, { useState } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useScoring } from '../../hooks/useScoring';
import { GameBoard } from '../Game/GameBoard';
import { ModeSelector } from '../UI/ModeSelector';
import { DifficultySelector } from '../UI/DifficultySelector';
import { ScoreDisplay } from '../UI/ScoreDisplay';
import { Tutorial } from '../UI/Tutorial';
import type { GameMode, Difficulty } from '../../types/game.types';
import './GameContainer.css';

export const GameContainer: React.FC = () => {
  const {
    gameState,
    startNewGame,
    makeGuess,
    nextPuzzle,
    submitAllGuesses,
    viewFinalScore,
    closeTutorial,
  } = useGameState();

  const { refreshHighScores } = useScoring();

  const [selectedMode, setSelectedMode] = useState<GameMode>('sequential');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>('easy');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartGame = () => {
    startNewGame(selectedMode, selectedDifficulty);
    setIsPlaying(true);
  };

  const handlePlayAgain = () => {
    setIsPlaying(false);
    refreshHighScores();
  };

  if (gameState.showTutorial) {
    return <Tutorial onComplete={closeTutorial} />;
  }

  if (!isPlaying) {
    return (
      <div className='game-container'>
        <div className='game-setup'>
          <ModeSelector
            selectedMode={selectedMode}
            onModeSelect={setSelectedMode}
          />
          <DifficultySelector
            selectedDifficulty={selectedDifficulty}
            onDifficultySelect={setSelectedDifficulty}
          />
          <button className='start-button' onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState.isComplete && gameState.mode === 'sequential') {
    return (
      <div className='game-container'>
        <ScoreDisplay gameState={gameState} onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  if (
    gameState.isComplete &&
    gameState.mode === 'multi-grid' &&
    gameState.isRevealing
  ) {
    return (
      <div className='game-container'>
        <ScoreDisplay gameState={gameState} onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  return (
    <div className='game-container'>
      <div className='game-info'>
        <span>
          Mode: {gameState.mode === 'sequential' ? 'Sequential' : 'Multi-Grid'}
        </span>
        <span>Difficulty: {gameState.difficulty}</span>
        {gameState.mode === 'sequential' && (
          <span>
            Puzzle: {gameState.currentPuzzleIndex + 1} /{' '}
            {gameState.puzzles.length}
          </span>
        )}
      </div>
      <GameBoard
        gameState={gameState}
        onCellClick={makeGuess}
        onNextPuzzle={nextPuzzle}
        onSubmitAll={submitAllGuesses}
        onViewFinalScore={viewFinalScore}
      />
    </div>
  );
};
