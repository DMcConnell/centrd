# Geometric Median Game

A tranquil, browser-based puzzle game where players identify the geometric median (center point) of randomly placed dots on a grid.

## Features

- **Two Game Modes**: Sequential (solve one at a time) and Multi-Grid (solve several at once)
- **Three Difficulty Levels**: Easy, Medium, and Hard with different grid sizes and dot counts
- **Tutorial System**: First-time players get an interactive tutorial
- **Score Tracking**: Local high scores tracked separately for each difficulty
- **Beautiful Design**: Clean, minimalist aesthetic with soft, calming visuals

## Running the Game

### Development Mode

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The game will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker

```bash
# Build Docker image
docker build -t geometric-median-game .

# Run container
docker run -p 80:80 geometric-median-game
```

The game will be available at `http://localhost`

## How to Play

1. **Objective**: Find the grid cell that minimizes the total distance to all dots
2. **Click** on the cell where you think the geometric median is located
3. **Score**: Lower scores are better (0 = perfect guess)
4. **Difficulty**: Each level has different grid sizes and number of dots

## Game Modes

- **Sequential**: Solve 5 puzzles one at a time with immediate feedback
- **Multi-Grid**: Solve 4 puzzles simultaneously, submit all guesses at once

## Technologies Used

- React 18 with TypeScript
- Vite for build tooling
- CSS for styling
- Docker for containerization