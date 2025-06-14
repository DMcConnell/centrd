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
import {
  calculateDistance,
  findGeometricMedian,
} from '../utils/gridCalculations';

const initialState: GameState = {
  mode: 'sequential',
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
      const puzzleCount = PUZZLE_COUNT[mode];
      const puzzles = generatePuzzles(difficulty, puzzleCount);

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

  const makeGuess = useCallback((puzzleId: string, guess: Position) => {
    setGameState((prev) => {
      const puzzleIndex = prev.puzzles.findIndex((p) => p.id === puzzleId);
      if (puzzleIndex === -1) return prev;

      const puzzle = prev.puzzles[puzzleIndex];
      const updatedPuzzles = [...prev.puzzles];

      if (prev.mode === 'sequential') {
        // Sequential mode: immediately calculate and reveal answer
        const optimalPoints = findGeometricMedian(
          puzzle.gridSize,
          puzzle.dots,
          prev.distanceMetric,
        );
        const correctAnswer = optimalPoints[0]; // Take first optimal point
        const score = calculateDistance(
          guess,
          correctAnswer,
          prev.distanceMetric,
        );

        updatedPuzzles[puzzleIndex] = {
          ...puzzle,
          userGuess: guess,
          correctAnswer,
          score,
        };

        return {
          ...prev,
          puzzles: updatedPuzzles,
          totalScore: prev.totalScore + score,
          isRevealing: true,
        };
      } else {
        // Multi-grid mode: just store the guess, don't reveal answer yet
        updatedPuzzles[puzzleIndex] = {
          ...puzzle,
          userGuess: guess,
        };

        return {
          ...prev,
          puzzles: updatedPuzzles,
        };
      }
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

  const submitAllGuesses = useCallback(() => {
    setGameState((prev) => {
      let totalScore = 0;
      const updatedPuzzles = prev.puzzles.map((puzzle) => {
        if (!puzzle.userGuess) return puzzle;

        const optimalPoints = findGeometricMedian(
          puzzle.gridSize,
          puzzle.dots,
          prev.distanceMetric,
        );
        const correctAnswer = optimalPoints[0];
        const score = calculateDistance(
          puzzle.userGuess,
          correctAnswer,
          prev.distanceMetric,
        );
        totalScore += score;

        return {
          ...puzzle,
          correctAnswer,
          score,
        };
      });

      return {
        ...prev,
        puzzles: updatedPuzzles,
        totalScore,
        isRevealing: true,
        // Don't set isComplete yet - let user review first
      };
    });
  }, []);

  const viewFinalScore = useCallback(() => {
    setGameState((prev) => {
      // Save high score when transitioning to final score
      const highScores = JSON.parse(
        localStorage.getItem('highScores') ||
          '{"easy":[],"medium":[],"hard":[]}',
      );
      const avgScore = prev.totalScore / prev.puzzles.length;
      highScores[prev.difficulty].push(avgScore);
      highScores[prev.difficulty].sort((a: number, b: number) => a - b);
      highScores[prev.difficulty] = highScores[prev.difficulty].slice(0, 10);
      localStorage.setItem('highScores', JSON.stringify(highScores));

      return {
        ...prev,
        isComplete: true,
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
    submitAllGuesses,
    viewFinalScore,
    setDistanceMetric,
    closeTutorial,
  };
}
