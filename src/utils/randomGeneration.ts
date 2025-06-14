import type { Position, Difficulty, Puzzle } from '../types/game.types';
import { DIFFICULTY_CONFIG } from '../types/game.types';

export function generateRandomDots(
  gridSize: number,
  dotCount: number,
): Position[] {
  const dots: Position[] = [];
  const usedPositions = new Set<string>();

  while (dots.length < dotCount) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    const key = `${x},${y}`;

    // Ensure no overlapping dots and minimum spacing
    if (!usedPositions.has(key) && isValidDotPosition(x, y, dots)) {
      dots.push({ x, y });
      usedPositions.add(key);
    }
  }

  return dots;
}

function isValidDotPosition(
  x: number,
  y: number,
  existingDots: Position[],
): boolean {
  // Ensure minimum one cell spacing between dots
  for (const dot of existingDots) {
    const distance = Math.max(Math.abs(x - dot.x), Math.abs(y - dot.y));
    if (distance < 2) {
      return false;
    }
  }
  return true;
}

export function generatePuzzle(difficulty: Difficulty): Puzzle {
  const config = DIFFICULTY_CONFIG[difficulty];
  const gridSize =
    Math.floor(Math.random() * (config.maxGrid - config.minGrid + 1)) +
    config.minGrid;
  const dotCount =
    Math.floor(Math.random() * (config.maxDots - config.minDots + 1)) +
    config.minDots;

  return {
    id: Math.random().toString(36).substr(2, 9),
    gridSize,
    dots: generateRandomDots(gridSize, dotCount),
  };
}

export function generatePuzzles(
  difficulty: Difficulty,
  count: number,
): Puzzle[] {
  return Array.from({ length: count }, () => generatePuzzle(difficulty));
}
