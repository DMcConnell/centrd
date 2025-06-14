# Geometric Median Game - Project Plan

## 1. Game Overview

### Core Concept
A tranquil, browser-based puzzle game where players identify the geometric median (center point) of randomly placed dots on a grid. Players click where they believe the optimal point is, then see the actual solution and receive a score based on accuracy.

### Design Philosophy
- Relaxed, laid-back gameplay with no time pressure
- Clean, minimalist aesthetic with soft, calming visuals
- Intuitive mechanics that are easy to learn but challenging to master
- Separate difficulty tracks for different skill levels

## 2. Visual Design

### Aesthetic Direction
- Clean minimalist design with soft, calming elements
- Precise grid structure with gentle visual treatments
- Tranquil atmosphere throughout
- Smooth, subtle animations
- No harsh edges or aggressive colors

### Color Palette
- **Background**: Soft off-white (#FAF9F6)
- **Grid Lines**: Subtle light gray (#E0E0E0)
- **Dots**: Soft blue (#6B9BD1), coral (#FF9B9B), or mint (#9BD1C8)
- **User Guess**: Gentle purple with opacity (#B19CD9, 70% opacity)
- **Correct Answer**: Soft gold (#FFD700, 80% opacity)
- **Text**: Dark gray (#333333) for readable contrast

### Visual Elements
- Grid cells with subtle hover effects (slight scale + soft glow)
- Dots with barely perceptible floating animation
- Smooth color transitions throughout
- Gentle ripple effects on interactions
- Clear visual hierarchy

## 3. Game Mechanics

### Gameplay Loop
1. Grid appears with randomly placed dots
2. Player analyzes the pattern and clicks their guess
3. Reveal animation shows the correct answer
4. Score displays based on distance from optimal cell
5. Player continues to next puzzle or views final results

### Scoring System
- **Metric Options** (selectable in settings):
  - Euclidean distance (default) - straight-line distance
  - Manhattan distance - grid steps in cardinal directions only
  - Chebyshev distance - maximum of horizontal/vertical distance
- Golf-style scoring (lower is better)
- Perfect guess = 0 points
- Score = distance from optimal cell
- Each difficulty maintains separate high scores

## 4. Game Modes

### Sequential Challenge
- 5 or 10 puzzles played one after another
- Immediate reveal and scoring after each guess
- No returning to previous puzzles
- Running total displayed
- Final summary screen with average score

### Multi-Grid Challenge
- 4 or 8 puzzles displayed simultaneously
- Player places guesses on all grids
- "Submit All" button reveals all answers at once
- Combined scoring shows total and average distance
- Tests pattern recognition across multiple puzzles

## 5. Difficulty Levels

### Easy
- Grid: 5×5 to 7×7
- Dots: 3-4
- Ideal for learning game mechanics

### Medium
- Grid: 8×8 to 12×12
- Dots: 5-7
- Balanced challenge for regular play

### Hard
- Grid: 13×13 to 20×20
- Dots: 8-12
- Complex spatial reasoning required

**Note**: Each difficulty level maintains completely separate score tracking. Scores between difficulties are not comparable.

## 6. Tutorial System

### First-Time Player Flow

1. **Welcome Screen**
   - "Find the center point that's closest to all the dots"
   - "Let's try a simple example!"

2. **Tutorial Puzzle 1: Obvious Pattern**
   - 3×3 grid with 3 dots in clear triangle formation
   - Dots pulse gently to draw attention
   - Player clicks their guess
   - Visual lines animate from correct answer to each dot
   - "The closer you are, the better your score!"

3. **Tutorial Puzzle 2: Non-Obvious Pattern**
   - 4×4 grid with asymmetric dot placement
   - "Sometimes the center isn't where you'd expect"
   - Player guesses, then sees reveal
   - "The best spot minimizes total distance to all dots"

4. **Mode Selection Introduction**
   - Visual preview of both modes
   - Sequential: "Solve one at a time"
   - Multi-grid: "Solve several at once"

5. **Difficulty Preview**
   - Show example grid sizes
   - "Start with Easy to get comfortable"
   - "Each difficulty tracks scores separately"

6. **Ready to Play**
   - "You can change settings anytime"
   - "Now, let's play!"

### Tutorial Principles
- Minimal text, maximum visual demonstration
- Skippable for returning players
- Guaranteed solvable patterns
- Clear progression from obvious to subtle

## 7. User Experience

### Game States
1. **Main Menu**: Mode and difficulty selection
2. **Tutorial**: First-time player introduction (skippable)
3. **Playing**: Active puzzle interaction
4. **Reveal**: Answer display with visual feedback
5. **Puzzle Complete**: Individual score display
6. **Session Complete**: Final results and high scores

### Interactive Feedback
- Grid cells highlight softly on hover
- Click produces gentle ripple animation
- Dots float subtly to feel alive
- Smooth transitions between all states
- Clear visual distinction between user guess and correct answer

### Score Display
- Immediate score after each reveal
- Format: "Distance: 2.83" or "Perfect!" for zero
- Running total in sequential mode
- Average calculation in multi-grid mode
- Best scores shown for current difficulty only

### Animation Design
- Gentle fade-in for dot placement
- Smooth color transitions on hover
- Elegant ripple effect from correct answer on reveal
- Soft pulsing on interactive elements
- Graceful fade transitions between puzzles
- Score counter smoothly increments

## 8. Technical Architecture

### Tech Stack
- React 18+ with TypeScript
- Vite for build tooling
- CSS Modules or Styled Components
- Docker for containerization

### Component Structure
```
src/
├── components/
│   ├── Game/
│   │   ├── GameBoard.tsx
│   │   ├── Grid.tsx
│   │   ├── Cell.tsx
│   │   └── Dot.tsx
│   ├── UI/
│   │   ├── ScoreDisplay.tsx
│   │   ├── ModeSelector.tsx
│   │   └── DifficultySelector.tsx
│   └── Layout/
│       ├── Header.tsx
│       └── GameContainer.tsx
├── hooks/
│   ├── useGameState.ts
│   └── useScoring.ts
├── utils/
│   ├── gridCalculations.ts
│   └── randomGeneration.ts
└── types/
    └── game.types.ts
```

## 9. Core Algorithms

### Geometric Median Calculation
- For each grid cell, calculate sum of distances to all dots
- Find cell(s) with minimum total distance
- Cache calculations for performance
- Handle ties by accepting any optimal solution

### Random Dot Generation
- Ensure no overlapping dots
- Minimum one cell spacing between dots
- Avoid patterns that create ambiguous solutions
- Use deterministic seeding for future daily challenges

## 10. Edge Cases & Error Handling

### Gameplay Edge Cases

1. **Multiple Optimal Solutions**
   - Accept any cell with minimum distance as correct
   - Highlight all optimal cells on reveal
   - Display: "Multiple perfect answers!"

2. **Linear Dot Arrangements**
   - Ensure clear visual feedback for median line
   - Consider preventing in random generation

3. **Dense Dot Clusters**
   - Maintain visual clarity with opacity
   - Enforce minimum spacing in generation

### User Experience Safeguards

1. **Accidental Clicks**
   - Brief confirmation animation before reveal
   - "Submit All" button in multi-grid mode

2. **Visual Clarity**
   - Clear grid boundaries
   - Sufficient contrast for all elements
   - Distinct visual states for dots, guesses, and solutions

3. **Score Understanding**
   - Green/positive coloring for low scores
   - Red/negative coloring for high scores
   - "Perfect!" celebration for zero distance

## 11. Responsive Design

### Desktop (1024px+)
- Full-sized grids as specified
- Hover effects enabled
- Side-by-side layout for multi-grid mode

### Tablet (768px - 1023px)
- Adjusted cell sizing for touch
- 2×2 layout for 4-grid mode
- Maintained visual clarity

### Mobile (< 768px)
- Dynamic cell sizing to fit screen
- Touch-optimized interactions
- Single column for multi-grid mode
- Landscape orientation support

## 12. Deployment

### Docker Configuration
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

### Deployment Options
- Static hosting (Vercel, Netlify)
- Self-hosted with Docker
- CDN distribution for assets

## 13. Implementation Phases

### Phase 1: Core MVP
- Basic grid and dot rendering
- Click to select mechanism
- Euclidean distance scoring only
- Sequential mode with 5 puzzles
- Three difficulty levels
- Basic animations

### Phase 2: Enhanced Features
- Multi-grid mode
- All distance calculation options
- Complete animation system
- Settings menu with persistence
- Local high score tracking
- Tutorial system

### Phase 3: Polish
- Sound effects (optional, off by default)
- Daily challenge mode
- Achievement system
- Performance optimizations
- Advanced accessibility features

## 14. Future Considerations

### Potential Enhancements
- Puzzle sharing via URL
- Speed run mode for experienced players
- Custom puzzle creator
- Colorblind mode with shapes
- Global leaderboards (with backend)
- Progressive difficulty adjustment

### Performance Goals
- 60 FPS on all animations
- Instant response to user input
- Efficient rendering for 20×20 grids
- Smooth experience on 5-year-old devices

## 15. Success Metrics

### User Experience Goals
- Intuitive enough to play without reading instructions
- Relaxing experience with no frustration points
- Clear visual feedback for all actions
- Consistent difficulty progression
- High replay value through randomization