export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'sequential' | 'multi-grid';
export type DistanceMetric = 'euclidean' | 'manhattan' | 'chebyshev';

export interface Position {
  x: number;
  y: number;
}

export interface GridConfig {
  size: number;
  dotCount: number;
}

export interface Puzzle {
  id: string;
  gridSize: number;
  dots: Position[];
  userGuess?: Position;
  correctAnswer?: Position;
  score?: number;
}

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  distanceMetric: DistanceMetric;
  puzzles: Puzzle[];
  currentPuzzleIndex: number;
  totalScore: number;
  isComplete: boolean;
  showTutorial: boolean;
  isRevealing: boolean;
}

export interface HighScores {
  easy: number[];
  medium: number[];
  hard: number[];
}

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { minGrid: number; maxGrid: number; minDots: number; maxDots: number }
> = {
  easy: { minGrid: 5, maxGrid: 7, minDots: 3, maxDots: 4 },
  medium: { minGrid: 8, maxGrid: 12, minDots: 5, maxDots: 7 },
  hard: { minGrid: 13, maxGrid: 20, minDots: 8, maxDots: 12 },
};

export const PUZZLE_COUNT = {
  sequential: 5,
  'multi-grid': 4,
};
