import { useState, useCallback } from 'react';
import type {
  GameState,
  Difficulty,
  GameMode,
  DistanceMetric,
  Position,
} from '../types/game.types';
import { PUZZLE_COUNT } from '../types/game.types';
import { generatePuzzles } from '../utils/randomGeneration';
import { getTodaysPuzzles } from '../utils/dailyPuzzles';
import {
  calculateDistance,
  findGeometricMedian,
} from '../utils/gridCalculations';

const initialState: GameState = {
  mode: 'zen',
  difficulty: 'easy',
  distanceMetric: 'euclidean',
  puzzles: [],
  currentPuzzleIndex: 0,
  totalScore: 0,
  isComplete: false,
  showTutorial: true,
  isRevealing: false,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Check if user has played before
    const hasPlayed = localStorage.getItem('hasPlayed');
    return {
      ...initialState,
      showTutorial: !hasPlayed,
    };
  });

  const startNewGame = useCallback(
    (mode: GameMode, difficulty: Difficulty) => {
      let puzzles;

      if (mode === 'daily') {
        puzzles = getTodaysPuzzles();
      } else {
        const puzzleCount = PUZZLE_COUNT[mode];
        puzzles = generatePuzzles(difficulty, puzzleCount);
      }

      setGameState({
        ...gameState,
        mode,
        difficulty,
        puzzles,
        currentPuzzleIndex: 0,
        totalScore: 0,
        isComplete: false,
        showTutorial: false,
        isRevealing: false,
      });

      localStorage.setItem('hasPlayed', 'true');
    },
    [gameState],
  );

  const makeGuess = useCallback((position: Position) => {
    setGameState((prev) => {
      const currentPuzzle = prev.puzzles[prev.currentPuzzleIndex];
      if (!currentPuzzle || currentPuzzle.userGuess) return prev;

      const optimalPoints = findGeometricMedian(
        currentPuzzle.gridSize,
        currentPuzzle.dots,
        prev.distanceMetric,
      );

      // Use the first optimal point as the correct answer
      const correctAnswer = optimalPoints[0];
      const score = calculateDistance(
        position,
        correctAnswer,
        prev.distanceMetric,
      );

      const updatedPuzzle = {
        ...currentPuzzle,
        userGuess: position,
        correctAnswer,
        score,
      };

      const updatedPuzzles = [...prev.puzzles];
      updatedPuzzles[prev.currentPuzzleIndex] = updatedPuzzle;

      const newTotalScore = prev.totalScore + score;

      return {
        ...prev,
        puzzles: updatedPuzzles,
        totalScore: newTotalScore,
        isRevealing: true,
      };
    });
  }, []);

  const nextPuzzle = useCallback(() => {
    setGameState((prev) => {
      const nextIndex = prev.currentPuzzleIndex + 1;
      const isComplete = nextIndex >= prev.puzzles.length;

      if (isComplete) {
        // Save high score
        const highScores = JSON.parse(
          localStorage.getItem('highScores') ||
            '{"easy":[],"medium":[],"hard":[]}',
        );
        const avgScore = prev.totalScore / prev.puzzles.length;
        highScores[prev.difficulty].push(avgScore);
        highScores[prev.difficulty].sort((a: number, b: number) => a - b);
        highScores[prev.difficulty] = highScores[prev.difficulty].slice(0, 10); // Keep top 10
        localStorage.setItem('highScores', JSON.stringify(highScores));
      }

      return {
        ...prev,
        currentPuzzleIndex: nextIndex,
        isComplete,
        isRevealing: false,
      };
    });
  }, []);

  const setDistanceMetric = useCallback((metric: DistanceMetric) => {
    setGameState((prev) => ({ ...prev, distanceMetric: metric }));
  }, []);

  const closeTutorial = useCallback(() => {
    setGameState((prev) => ({ ...prev, showTutorial: false }));
    localStorage.setItem('hasPlayed', 'true');
  }, []);

  return {
    gameState,
    startNewGame,
    makeGuess,
    nextPuzzle,
    setDistanceMetric,
    closeTutorial,
  };
}
