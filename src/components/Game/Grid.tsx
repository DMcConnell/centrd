import React, { useEffect, useState } from 'react';
import type { Position, Puzzle } from '../../types/game.types';
import { Cell } from './Cell';
import { Dot } from './Dot';
import './Grid.css';

interface GridProps {
  puzzle: Puzzle;
  onCellClick: (position: Position) => void;
  disabled?: boolean;
  cellSize?: number;
}

// Expanded color palette with 15 unique, accessible colors
const DOT_COLORS = [
  '#6B9BD1', // Soft blue
  '#FF9B9B', // Coral
  '#9BD1C8', // Mint
  '#FFB366', // Orange
  '#B19CD9', // Purple
  '#66D9EF', // Cyan
  '#F8BBD9', // Pink
  '#A8E6CF', // Light green
  '#FFD93D', // Yellow
  '#FF8A80', // Light red
  '#8FA8BE', // Steel blue
  '#DDA0DD', // Plum
  '#98FB98', // Pale green
  '#F0E68C', // Khaki
  '#FFA07A', // Light salmon
];

const useViewportSize = () => {
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      // Debounce resize events to prevent excessive re-renders
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewportSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return viewportSize;
};

const calculateOptimalCellSize = (
  gridSize: number,
  viewportWidth: number,
  viewportHeight: number,
  maxCellSize: number = 60,
  minCellSize: number = 20,
): number => {
  // Determine if we're on mobile
  const isMobile = viewportWidth <= 768;
  const isSmallMobile = viewportWidth <= 480;

  // Account for padding, margins, and other UI elements based on screen size
  // These values should match the CSS padding in GameContainer
  let reservedWidth: number;
  let reservedHeight: number;

  if (isSmallMobile) {
    // GameContainer padding: 15px 5px, so 10px total horizontal padding
    // Plus some margin for safe area
    reservedWidth = 20;
    reservedHeight = 300; // More space needed for mobile UI (header, game-info, buttons)
  } else if (isMobile) {
    // GameContainer padding: 20px 10px, so 20px total horizontal padding
    reservedWidth = 30;
    reservedHeight = 270; // Mobile UI takes more vertical space
  } else {
    // GameContainer padding: 40px 20px, so 40px total horizontal padding
    reservedWidth = 60;
    reservedHeight = 220; // Desktop UI is more compact
  }

  const availableWidth = viewportWidth - reservedWidth;
  const availableHeight = viewportHeight - reservedHeight;

  // Calculate the maximum cell size that fits in both dimensions
  const maxCellByWidth = Math.floor(availableWidth / gridSize);
  const maxCellByHeight = Math.floor(availableHeight / gridSize);

  // Use the smaller of the two to ensure it fits in both dimensions
  const calculatedSize = Math.min(maxCellByWidth, maxCellByHeight);

  // Adjust max/min cell sizes based on screen size
  const adjustedMaxSize = isMobile ? Math.min(maxCellSize, 45) : maxCellSize;
  const adjustedMinSize = isSmallMobile
    ? Math.max(minCellSize, 15)
    : minCellSize;

  // Add a small safety margin to ensure the grid fits comfortably
  const safetyMargin = 0.98; // Use 98% of calculated size for safety (was 95%)
  const safeSize = Math.floor(calculatedSize * safetyMargin);

  // Clamp between min and max sizes
  return Math.max(adjustedMinSize, Math.min(adjustedMaxSize, safeSize));
};

export const Grid: React.FC<GridProps> = ({
  puzzle,
  onCellClick,
  disabled = false,
  cellSize: propCellSize,
}) => {
  const { gridSize, dots, userGuess, correctAnswer } = puzzle;
  const viewportSize = useViewportSize();

  // Calculate dynamic cell size, but allow override via props
  const calculatedCellSize = calculateOptimalCellSize(
    gridSize,
    viewportSize.width,
    viewportSize.height,
  );

  const cellSize = propCellSize || calculatedCellSize;

  const cells: React.ReactElement[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const position = { x, y };
      const isUserGuess = userGuess?.x === x && userGuess?.y === y;
      const isCorrectAnswer = correctAnswer?.x === x && correctAnswer?.y === y;
      const hasDot = dots.some((dot) => dot.x === x && dot.y === y);

      cells.push(
        <Cell
          key={`${x}-${y}`}
          position={position}
          size={cellSize}
          onClick={onCellClick}
          isUserGuess={isUserGuess}
          isCorrectAnswer={isCorrectAnswer}
          disabled={disabled || !!userGuess || hasDot}
          hasDot={hasDot}
        />,
      );
    }
  }

  return (
    <div
      className='grid-container'
      style={{
        width: `${gridSize * cellSize}px`,
        height: `${gridSize * cellSize}px`,
      }}
    >
      <div
        className='grid'
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        }}
      >
        {cells}
      </div>
      <div className='dots-container'>
        {dots.map((dot, index) => (
          <Dot
            key={index}
            position={dot}
            cellSize={cellSize}
            color={DOT_COLORS[index % DOT_COLORS.length]}
          />
        ))}
      </div>
    </div>
  );
};
