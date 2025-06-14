# Geometric Median Game

A tranquil, browser-based puzzle game where players identify the geometric median (center point) of randomly placed dots on a grid.

## Features

- **Two Game Modes**: Sequential (solve one at a time) and Multi-Grid (solve several at once)
- **Three Difficulty Levels**: Easy, Medium, and Hard with different grid sizes and dot counts
- **Tutorial System**: First-time players get an interactive tutorial
- **Score Tracking**: Local high scores tracked separately for each difficulty
- **Beautiful Design**: Clean, minimalist aesthetic with soft, calming visuals

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **ESLint** for code linting
- **CSS** for styling
- **Docker** for containerization

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd browser-game
```

2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The game will be available at `http://localhost:5173`

### Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Code Quality

Run ESLint to check for code issues:

```bash
npm run lint
```

### Docker Deployment

Build and run with Docker:

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

### Game Modes

- **Sequential**: Solve 5 puzzles one at a time with immediate feedback
- **Multi-Grid**: Solve 4 puzzles simultaneously, submit all guesses at once

### Difficulty Levels

- **Easy**: 5×5 to 7×7 grids with 3-4 dots
- **Medium**: 8×8 to 12×12 grids with 5-7 dots
- **Hard**: 13×13 to 20×20 grids with 8-12 dots

## Project Structure

```
src/
├── components/
│   ├── Game/           # Game-related components (Grid, Cell, Dot, GameBoard)
│   ├── Layout/         # Layout components (Header, GameContainer)
│   └── UI/             # UI components (Tutorial, Selectors, ScoreDisplay)
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (calculations, random generation)
├── App.tsx             # Main App component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
