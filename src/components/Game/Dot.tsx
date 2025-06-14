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
  const style = {
    left: `${position.x * cellSize + cellSize / 2}px`,
    top: `${position.y * cellSize + cellSize / 2}px`,
    backgroundColor: color,
  };

  return <div className='dot' style={style} />;
};
