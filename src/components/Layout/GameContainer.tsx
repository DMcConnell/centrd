import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useScoring } from '../../hooks/useScoring';
import { useDailyGame } from '../../hooks/useDailyGame';
import { useAnalytics } from '../../hooks/useAnalytics';
import { GameBoard } from '../Game/GameBoard';
import { ModeSelector } from '../UI/ModeSelector';
import { DifficultySelector } from '../UI/DifficultySelector';
import { ScoreDisplay } from '../UI/ScoreDisplay';
import { DailyScoreDisplay } from '../Daily/DailyScoreDisplay';
import { ShareButton } from '../UI/ShareButton';
import { Tutorial } from '../UI/Tutorial';
import type {
  GameMode,
  Difficulty,
  DailyScore,
  Position,
} from '../../types/game.types';
import { getTodayISO } from '../../utils/dailyPuzzles';
import './GameContainer.css';

export const GameContainer: React.FC = () => {
  const { gameState, startNewGame, makeGuess, nextPuzzle, closeTutorial } =
    useGameState();

  const { refreshHighScores } = useScoring();
  const analytics = useAnalytics();

  const {
    dailyData,
    getTodaysStatus,
    startDailyChallenge,
    completeDailyChallenge,
    getTodaysScore,
  } = useDailyGame();

  const [selectedMode, setSelectedMode] = useState<GameMode>('daily');
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

        // Track daily completion
        analytics.trackGameCompleted(
          'daily',
          totalScore,
          gameState.puzzles.length,
          perfectCount,
          gameState.difficulty,
          newStreak,
        );

        // Track streak milestones
        analytics.trackStreakMilestone(newStreak);
      }
    } else if (gameState.mode === 'zen' && gameState.isComplete) {
      // Track zen game completion
      const totalScore = gameState.puzzles.reduce(
        (sum: number, p) => sum + (p.score || 0),
        0,
      );
      const perfectCount = gameState.puzzles.filter(
        (p) => p.score === 0,
      ).length;

      analytics.trackGameCompleted(
        'zen',
        totalScore,
        gameState.puzzles.length,
        perfectCount,
        gameState.difficulty,
      );
    }
  }, [
    gameState.mode,
    gameState.isComplete,
    gameState.totalScore,
    gameState.puzzles,
    gameState.difficulty,
    completeDailyChallenge,
    analytics,
  ]);

  const handleStartGame = () => {
    // Reset completion tracking when starting a new game
    dailyCompletionProcessed.current = null;

    // Track game start
    analytics.trackGameStarted(selectedMode, selectedDifficulty);

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

  const handleModeChange = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  // Adapter function to bridge the makeGuess interface
  const handleCellClick = (_puzzleId: string, position: Position) => {
    makeGuess(position);
  };

  if (gameState.showTutorial) {
    return <Tutorial onComplete={closeTutorial} />;
  }

  if (!isPlaying) {
    const todayCompleted = getTodaysStatus();
    const todaysScore = getTodaysScore();

    return (
      <div className='game-container'>
        <div className='game-setup'>
          <ModeSelector
            selectedMode={selectedMode}
            onModeSelect={handleModeChange}
          />
          {selectedMode === 'zen' && (
            <DifficultySelector
              selectedDifficulty={selectedDifficulty}
              onDifficultySelect={handleDifficultyChange}
            />
          )}

          {selectedMode === 'daily' && todayCompleted && todaysScore && (
            <div className='daily-completion-card'>
              <div className='completion-header'>
                <h3>🎯 Daily Challenge Complete!</h3>
              </div>

              <div className='score-summary'>
                <div className='score-item'>
                  <span className='score-label'>Average Distance:</span>
                  <span className='score-value'>
                    {todaysScore.averageScore.toFixed(2)}
                  </span>
                </div>
                <div className='score-item'>
                  <span className='score-label'>Perfect Guesses:</span>
                  <span className='score-value'>
                    {todaysScore.perfectCount} / 6
                  </span>
                </div>
                <div className='score-item'>
                  <span className='score-label'>Current Streak:</span>
                  <span className='score-value'>
                    {dailyData.currentStreak} day
                    {dailyData.currentStreak !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedMode === 'daily' && todayCompleted && todaysScore ? (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <ShareButton
                results={todaysScore}
                streak={dailyData.currentStreak}
              />
            </div>
          ) : (
            <button
              className='start-button'
              onClick={handleStartGame}
              disabled={selectedMode === 'daily' && todayCompleted}
            >
              {selectedMode === 'daily' && todayCompleted
                ? 'Completed Today'
                : 'Start Game'}
            </button>
          )}
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
        onCellClick={handleCellClick}
        onNextPuzzle={nextPuzzle}
      />
    </div>
  );
};
