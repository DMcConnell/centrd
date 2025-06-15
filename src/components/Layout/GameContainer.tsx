import React, { useState } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useScoring } from '../../hooks/useScoring';
import { useDailyGame } from '../../hooks/useDailyGame';
import { GameBoard } from '../Game/GameBoard';
import { ModeSelector } from '../UI/ModeSelector';
import { DifficultySelector } from '../UI/DifficultySelector';
import { ScoreDisplay } from '../UI/ScoreDisplay';
import { DailyScoreDisplay } from '../Daily/DailyScoreDisplay';
import { Tutorial } from '../UI/Tutorial';
import type { GameMode, Difficulty, DailyScore } from '../../types/game.types';
import { getTodayISO } from '../../utils/dailyPuzzles';
import './GameContainer.css';

export const GameContainer: React.FC = () => {
  const {
    gameState,
    startNewGame,
    makeGuess,
    nextPuzzle,
    closeTutorial,
  } = useGameState();

  const { refreshHighScores } = useScoring();
  
  const {
    dailyData,
    getTodaysStatus,
    startDailyChallenge,
    completeDailyChallenge,
    getTodaysScore,
  } = useDailyGame();

  const [selectedMode, setSelectedMode] = useState<GameMode>('zen');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>('easy');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartGame = () => {
    if (selectedMode === 'daily') {
      const puzzles = startDailyChallenge();
      startNewGame('daily', 'medium'); // This will initialize the game state
      // The actual puzzles will be set in the startNewGame function
    } else {
      startNewGame(selectedMode, selectedDifficulty);
    }
    setIsPlaying(true);
  };

  const handlePlayAgain = () => {
    setIsPlaying(false);
    refreshHighScores();
  };

  const handleDailyComplete = () => {
    if (gameState.mode === 'daily' && gameState.isComplete) {
      const totalScore = gameState.puzzles.reduce((sum: number, p: any) => sum + (p.score || 0), 0);
      const averageScore = totalScore / gameState.puzzles.length;
      const perfectCount = gameState.puzzles.filter((p: any) => p.score === 0).length;
      
      const dailyScore: DailyScore = {
        date: getTodayISO(),
        totalScore,
        averageScore,
        perfectCount,
        completed: true,
      };
      
      const newStreak = completeDailyChallenge(dailyScore);
      return newStreak;
    }
    return dailyData.currentStreak;
  };

  if (gameState.showTutorial) {
    return <Tutorial onComplete={closeTutorial} />;
  }

  if (!isPlaying) {
    const todayCompleted = getTodaysStatus();
    
    return (
      <div className='game-container'>
        <div className='game-setup'>
          <ModeSelector
            selectedMode={selectedMode}
            onModeSelect={setSelectedMode}
          />
          {selectedMode === 'zen' && (
            <DifficultySelector
              selectedDifficulty={selectedDifficulty}
              onDifficultySelect={setSelectedDifficulty}
            />
          )}
          {selectedMode === 'daily' && todayCompleted && (
            <div className='daily-status'>
              <p>You've already completed today's challenge!</p>
              <p>Come back tomorrow for a new puzzle.</p>
            </div>
          )}
          <button 
            className='start-button' 
            onClick={handleStartGame}
            disabled={selectedMode === 'daily' && todayCompleted}
          >
            {selectedMode === 'daily' && todayCompleted ? 'Completed Today' : 'Start Game'}
          </button>
        </div>
      </div>
    );
  }

  if (gameState.isComplete && gameState.mode === 'zen') {
    return (
      <div className='game-container'>
        <ScoreDisplay gameState={gameState} onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  if (gameState.isComplete && gameState.mode === 'daily') {
    const streak = handleDailyComplete();
    const todaysScore = getTodaysScore();
    
    if (todaysScore) {
      return (
        <div className='game-container'>
          <DailyScoreDisplay 
            gameState={gameState} 
            dailyScore={todaysScore}
            streak={streak}
            onPlayAgain={handlePlayAgain} 
          />
        </div>
      );
    }
  }

  return (
    <div className='game-container'>
      <div className='game-info'>
        <span>
          Mode: {gameState.mode === 'zen' ? 'Zen' : 'Daily Challenge'}
        </span>
        {gameState.mode === 'zen' && (
          <span>Difficulty: {gameState.difficulty}</span>
        )}
        <span>
          Puzzle: {gameState.currentPuzzleIndex + 1} /{' '}
          {gameState.puzzles.length}
        </span>
      </div>
      <GameBoard
        gameState={gameState}
        onCellClick={makeGuess}
        onNextPuzzle={nextPuzzle}
      />
    </div>
  );
};
