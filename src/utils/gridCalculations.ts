import type { Position, DistanceMetric } from '../types/game.types';

export function calculateDistance(
  p1: Position,
  p2: Position,
  metric: DistanceMetric = 'euclidean',
): number {
  const dx = Math.abs(p1.x - p2.x);
  const dy = Math.abs(p1.y - p2.y);

  switch (metric) {
    case 'euclidean':
      return Math.sqrt(dx * dx + dy * dy);
    case 'manhattan':
      return dx + dy;
    case 'chebyshev':
      return Math.max(dx, dy);
    default:
      return Math.sqrt(dx * dx + dy * dy);
  }
}

export function calculateTotalDistance(
  point: Position,
  dots: Position[],
  metric: DistanceMetric,
): number {
  return dots.reduce(
    (total, dot) => total + calculateDistance(point, dot, metric),
    0,
  );
}

export function findGeometricMedian(
  gridSize: number,
  dots: Position[],
  metric: DistanceMetric,
): Position[] {
  let minDistance = Infinity;
  const optimalPoints: Position[] = [];

  // Calculate total distance for each cell in the grid
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const point = { x, y };
      const totalDistance = calculateTotalDistance(point, dots, metric);

      if (totalDistance < minDistance) {
        minDistance = totalDistance;
        optimalPoints.length = 0;
        optimalPoints.push(point);
      } else if (Math.abs(totalDistance - minDistance) < 0.0001) {
        // Handle floating point precision
        optimalPoints.push(point);
      }
    }
  }

  return optimalPoints;
}

export function isOptimalSolution(
  guess: Position,
  dots: Position[],
  gridSize: number,
  metric: DistanceMetric,
): boolean {
  const optimalPoints = findGeometricMedian(gridSize, dots, metric);
  return optimalPoints.some(
    (point) => point.x === guess.x && point.y === guess.y,
  );
}
