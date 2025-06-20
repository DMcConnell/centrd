import React from 'react';
import type { Position } from '../../types/game.types';
import './Dot.css';

interface DotProps {
  position: Position;
  cellSize: number;
  color?: string;
}

export const Dot: React.FC<DotProps> = ({
  position,
  cellSize,
  color = '#6B9BD1',
}) => {
  // Scale dot size based on cell size - typically 30-40% of cell size
  const dotSize = Math.max(8, Math.min(20, cellSize * 0.35));

  const style = {
    left: `${position.x * cellSize + cellSize / 2}px`,
    top: `${position.y * cellSize + cellSize / 2}px`,
    width: `${dotSize}px`,
    height: `${dotSize}px`,
    backgroundColor: color,
  };

  return <div className='dot' style={style} />;
};
