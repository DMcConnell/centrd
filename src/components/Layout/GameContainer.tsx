import React, { useState, useEffect, useRef } from 'react';
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
  const { gameState, startNewGame, makeGuess, nextPuzzle, closeTutorial } =
    useGameState();

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
  const [dailyCompletionStreak, setDailyCompletionStreak] = useState<number>(0);

  // Track if daily completion has been processed to prevent duplicate processing
  const dailyCompletionProcessed = useRef<string | null>(null);

  // Process daily completion when game completes
  useEffect(() => {
    if (gameState.mode === 'daily' && gameState.isComplete) {
      const gameId = `${getTodayISO()}-${gameState.totalScore}`;

      // Only process if we haven't already processed this completion
      if (dailyCompletionProcessed.current !== gameId) {
        const totalScore = gameState.puzzles.reduce(
          (sum: number, p) => sum + (p.score || 0),
          0,
        );
        const averageScore = totalScore / gameState.puzzles.length;
        const perfectCount = gameState.puzzles.filter(
          (p) => p.score === 0,
        ).length;

        const dailyScore: DailyScore = {
          date: getTodayISO(),
          totalScore,
          averageScore,
          perfectCount,
          completed: true,
        };

        const newStreak = completeDailyChallenge(dailyScore);
        setDailyCompletionStreak(newStreak);
        dailyCompletionProcessed.current = gameId;
      }
    }
  }, [
    gameState.mode,
    gameState.isComplete,
    gameState.totalScore,
    gameState.puzzles,
    completeDailyChallenge,
  ]);

  const handleStartGame = () => {
    // Reset completion tracking when starting a new game
    dailyCompletionProcessed.current = null;

    if (selectedMode === 'daily') {
      startDailyChallenge();
      startNewGame('daily', 'medium'); // This will initialize the game state
      // The actual puzzles will be set in the startNewGame function
    } else {
      startNewGame(selectedMode, selectedDifficulty);
    }
    setIsPlaying(true);
  };

  const handlePlayAgain = () => {
    setIsPlaying(false);
    dailyCompletionProcessed.current = null; // Reset completion tracking
    refreshHighScores();
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
            {selectedMode === 'daily' && todayCompleted
              ? 'Completed Today'
              : 'Start Game'}
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
    const todaysScore = getTodaysScore();

    if (todaysScore) {
      return (
        <div className='game-container'>
          <DailyScoreDisplay
            gameState={gameState}
            dailyScore={todaysScore}
            streak={dailyCompletionStreak || dailyData.currentStreak}
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
