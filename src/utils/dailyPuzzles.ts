import type { Puzzle, Difficulty, Position } from '../types/game.types';
import { DIFFICULTY_CONFIG } from '../types/game.types';

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 2147483647;
    return this.seed / 2147483647;
  }
}

function hashDate(date: string): number {
  return date.split('-').reduce((hash, part) => hash * 31 + parseInt(part), 0);
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function subtractDays(dateISO: string, days: number): string {
  const date = new Date(dateISO);
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

function generateRandomDots(
  gridSize: number,
  dotCount: number,
  rng: SeededRandom
): Position[] {
  const dots: Position[] = [];
  const usedPositions = new Set<string>();
  const maxAttempts = 100;
  let attempts = 0;

  while (dots.length < dotCount && attempts < maxAttempts) {
    const x = Math.floor(rng.next() * gridSize);
    const y = Math.floor(rng.next() * gridSize);
    const key = `${x},${y}`;

    if (!usedPositions.has(key) && isValidDotPosition(x, y, dots)) {
      dots.push({ x, y });
      usedPositions.add(key);
    }
    attempts++;
  }

  return dots;
}

function isValidDotPosition(
  x: number,
  y: number,
  existingDots: Position[]
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

function generateDailyPuzzle(difficulty: Difficulty, rng: SeededRandom): Puzzle {
  const config = DIFFICULTY_CONFIG[difficulty];
  const gridSize =
    Math.floor(rng.next() * (config.maxGrid - config.minGrid + 1)) +
    config.minGrid;
  const dotCount =
    Math.floor(rng.next() * (config.maxDots - config.minDots + 1)) +
    config.minDots;

  return {
    id: `daily-${rng.next().toString(36).substr(2, 9)}`,
    gridSize,
    dots: generateRandomDots(gridSize, dotCount, rng),
  };
}

export function getTodaysPuzzles(): Puzzle[] {
  const today = getTodayISO();
  const seed = hashDate(today);
  const rng = new SeededRandom(seed);

  return [
    generateDailyPuzzle('easy', rng),    // Puzzle 1
    generateDailyPuzzle('easy', rng),    // Puzzle 2
    generateDailyPuzzle('medium', rng),  // Puzzle 3
    generateDailyPuzzle('medium', rng),  // Puzzle 4
    generateDailyPuzzle('hard', rng),    // Puzzle 5
    generateDailyPuzzle('hard', rng),    // Puzzle 6
  ];
}

export function formatDate(dateISO: string): string {
  const date = new Date(dateISO);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export function calculateCurrentStreak(scores: { [date: string]: { completed: boolean } }): number {
  const today = getTodayISO();
  let streak = 0;
  let checkDate = today;

  while (scores[checkDate]?.completed) {
    streak++;
    checkDate = subtractDays(checkDate, 1);
  }

  return streak;
}