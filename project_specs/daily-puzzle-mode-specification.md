# Daily Puzzle Mode - Final Project Specification

## 1. Product Overview

### 1.1 Objective

Add a daily puzzle challenge feature to the existing Geometric Median game while maintaining its core philosophy of calm, elegant simplicity. Enable players to compete on shared daily puzzles and share their results.

### 1.2 Core Principles

- **Simplicity First**: No complex features that clutter the clean design
- **Calm Experience**: Maintain the tranquil, coffee-time puzzle atmosphere
- **Shared Challenge**: Everyone gets the same puzzles each day
- **Social Sharing**: Enable friendly competition through result sharing

### 1.3 Feature Scope

**What We're Adding:**

- Daily Challenge mode (6 puzzles in fixed Easy→Medium→Hard progression)
- Simple streak tracking (current streak only)
- Share button on completion screen
- Clickable header title for navigation

**What We're Removing/Changing:**

- Remove Multi-Grid mode from UI (keep code intact)
- Rename Sequential mode to Zen mode
- Update tutorial to reflect new modes

**What We're NOT Adding:**

- Calendar/historical puzzle views
- Time tracking or speed competitions
- Global leaderboards
- Achievement systems or rewards
- Complex visual enhancements

---

## 2. Technical Requirements

### 2.1 Game Mode Changes

**Updated Game Modes:**

```typescript
export type GameMode = 'zen' | 'daily'; // Remove 'multi-grid'

export const PUZZLE_COUNT = {
  zen: 5, // Renamed from 'sequential'
  daily: 6, // New daily mode
};
```

**Daily Puzzle Structure:**

- **Puzzle Order**: Always Easy (#1,#2) → Medium (#3,#4) → Hard (#5,#6)
- **Generation**: Deterministic using date-based seed (YYYY-MM-DD)
- **Consistency**: Same puzzles for all players on any given date
- **No Randomization**: Fixed difficulty progression, no shuffle

### 2.2 Data Structures

```typescript
// New types to add to game.types.ts
export interface DailyScore {
  date: string; // YYYY-MM-DD format
  totalScore: number; // Sum of all 6 puzzle scores
  averageScore: number; // totalScore / 6
  perfectCount: number; // Number of 0-distance guesses
  completed: boolean; // Full completion status
}

export interface DailyData {
  scores: { [date: string]: DailyScore };
  currentStreak: number; // Consecutive days played
}
```

### 2.3 Core Algorithms

**Deterministic Puzzle Generation:**

```typescript
// utils/dailyPuzzles.ts
export function getTodaysPuzzles(): Puzzle[] {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = hashDate(today);
  const rng = seededRandom(seed);

  return [
    generatePuzzle('easy', rng), // Puzzle 1
    generatePuzzle('easy', rng), // Puzzle 2
    generatePuzzle('medium', rng), // Puzzle 3
    generatePuzzle('medium', rng), // Puzzle 4
    generatePuzzle('hard', rng), // Puzzle 5
    generatePuzzle('hard', rng), // Puzzle 6
  ];
}

function hashDate(date: string): number {
  return date.split('-').reduce((hash, part) => hash * 31 + parseInt(part), 0);
}
```

**Streak Calculation:**

```typescript
export function calculateCurrentStreak(scores: {
  [date: string]: DailyScore;
}): number {
  const today = getTodayISO();
  let streak = 0;
  let checkDate = today;

  while (scores[checkDate]?.completed) {
    streak++;
    checkDate = subtractDays(checkDate, 1);
  }

  return streak;
}
```

---

## 3. Implementation Details

### 3.1 Component Changes

**Mode Selector Simplification:**

```typescript
// components/UI/ModeSelector.tsx
const modes = [
  {
    value: 'zen' as GameMode,
    label: 'Zen Mode',
    description: 'Solve puzzles one at a time at your own pace',
  },
  {
    value: 'daily' as GameMode,
    label: 'Daily Challenge',
    description: "Today's puzzle challenge for everyone",
  },
  // Remove multi-grid option
];
```

**Clickable Header:**

```typescript
// components/Layout/Header.tsx
export const Header: React.FC = () => {
  const handleTitleClick = () => {
    window.location.reload();
  };

  return (
    <header className='header'>
      <h1
        className='game-title clickable-title'
        onClick={handleTitleClick}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTitleClick();
          }
        }}
      >
        Geometric Median
      </h1>
      <p className='game-subtitle'>Find the perfect center point</p>
    </header>
  );
};
```

**Header Styling:**

```css
/* components/Layout/Header.css */
.clickable-title {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.clickable-title:hover {
  opacity: 0.8;
}

.clickable-title:focus {
  outline: 2px solid #6b9bd1;
  outline-offset: 2px;
}
```

### 3.2 New Components

**Daily Score Display:**

```typescript
// components/Daily/DailyScoreDisplay.tsx
export const DailyScoreDisplay: React.FC<DailyScoreProps> = ({
  gameState,
  dailyScore,
  streak,
}) => {
  return (
    <div className='score-display-container'>
      <h2>Daily Challenge Complete!</h2>
      <div className='date-display'>{formatDate(dailyScore.date)}</div>

      <div className='score-summary'>
        <div className='score-item'>
          <span className='score-label'>Average Distance:</span>
          <span className='score-value'>
            {dailyScore.averageScore.toFixed(2)}
          </span>
        </div>
        <div className='score-item'>
          <span className='score-label'>Perfect Guesses:</span>
          <span className='score-value'>{dailyScore.perfectCount} / 6</span>
        </div>
        <div className='score-item'>
          <span className='score-label'>Current Streak:</span>
          <span className='score-value'>{streak} days</span>
        </div>
      </div>

      <div className='puzzle-breakdown'>
        <h3>Puzzle Breakdown</h3>
        {gameState.puzzles.map((puzzle, index) => (
          <div key={puzzle.id} className='puzzle-score'>
            <span>
              {getDifficultyLabel(index)} {getPuzzleNumber(index)}:
            </span>
            <span className={puzzle.score === 0 ? 'perfect' : ''}>
              {puzzle.score === 0 ? 'Perfect!' : puzzle.score?.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <ShareButton results={dailyScore} streak={streak} />
      <button className='play-again-button' onClick={onPlayAgain}>
        Play Again Tomorrow
      </button>
    </div>
  );
};
```

**Share Button:**

```typescript
// components/UI/ShareButton.tsx
export const ShareButton: React.FC<{ results: DailyScore; streak: number }> = ({
  results,
  streak,
}) => {
  const shareText = `🎯 Daily Puzzle ${results.date}
Average: ${results.averageScore.toFixed(2)}
Perfect: ${results.perfectCount}/6
Streak: ${streak} days`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        // Show simple success feedback
      }
    } catch (error) {
      console.warn('Share failed:', error);
    }
  };

  return (
    <button className='share-button' onClick={handleShare}>
      Share Results
    </button>
  );
};
```

### 3.3 Hook Extensions

**Daily Game State:**

```typescript
// hooks/useDailyGame.ts
export function useDailyGame() {
  const [dailyData, setDailyData] = useState<DailyData>(() => loadDailyData());

  const getTodaysStatus = useCallback(() => {
    const today = getTodayISO();
    return dailyData.scores[today]?.completed || false;
  }, [dailyData]);

  const startDailyChallenge = useCallback(() => {
    const puzzles = getTodaysPuzzles();
    // Initialize daily game state
  }, []);

  const completeDailyChallenge = useCallback(
    (results: DailyScore) => {
      const newStreak = calculateCurrentStreak({
        ...dailyData.scores,
        [results.date]: results,
      });

      setDailyData({
        scores: { ...dailyData.scores, [results.date]: results },
        currentStreak: newStreak,
      });

      saveDailyData(dailyData);
    },
    [dailyData],
  );

  return {
    dailyData,
    getTodaysStatus,
    startDailyChallenge,
    completeDailyChallenge,
  };
}
```

### 3.4 Tutorial Updates

**Updated Tutorial Messaging:**

```typescript
// components/UI/Tutorial.tsx
const finalStep = {
  title: 'Ready to Play!',
  content: (
    <div className='tutorial-modes'>
      <div className='mode-preview'>
        <h3>Zen Mode</h3>
        <p>Solve puzzles one at a time at your own peaceful pace</p>
      </div>
      <div className='mode-preview'>
        <h3>Daily Challenge</h3>
        <p>Today's special puzzle that everyone gets to try</p>
      </div>
      <p className='tutorial-tip'>
        Start with Zen Mode to get comfortable with the game!
      </p>
    </div>
  ),
};
```

---

## 4. File Structure Changes

### 4.1 New Files to Create

```
src/
├── components/
│   ├── Daily/
│   │   ├── DailyModeSelector.tsx
│   │   └── DailyScoreDisplay.tsx
│   └── UI/
│       └── ShareButton.tsx
├── hooks/
│   └── useDailyGame.ts
└── utils/
    └── dailyPuzzles.ts
```

### 4.2 Files to Modify

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx           // Add clickable title
│   │   └── Header.css           // Add clickable styling
│   ├── UI/
│   │   ├── ModeSelector.tsx     // Remove multi-grid, rename sequential
│   │   └── Tutorial.tsx         // Update mode descriptions
│   └── Layout/
│       └── GameContainer.tsx    // Handle daily mode routing
├── hooks/
│   └── useGameState.ts          // Support zen/daily modes
├── types/
│   └── game.types.ts            // Add daily types, update GameMode
└── utils/
    └── randomGeneration.ts      // Add seeded random functions
```

---

## 5. Implementation Timeline

### Week 1: Core Simplification

- [ ] Remove multi-grid mode from UI (keep underlying code)
- [ ] Rename sequential → zen throughout codebase
- [ ] Make header title clickable with page reload functionality
- [ ] Update tutorial to reflect zen/daily mode options
- [ ] Test existing functionality remains intact

### Week 2: Daily Mode Foundation

- [ ] Implement date-based deterministic puzzle generation
- [ ] Create daily game state management
- [ ] Add daily mode option to mode selector
- [ ] Build daily game flow (6 puzzles in fixed progression)
- [ ] Add daily completion tracking to localStorage

### Week 3: Daily Mode Polish

- [ ] Create daily score display component
- [ ] Implement streak calculation and display
- [ ] Add share button functionality with proper formatting
- [ ] Test puzzle consistency across different environments
- [ ] Add accessibility features (ARIA labels, keyboard navigation)
- [ ] Final testing and bug fixes

---

## 6. Success Criteria

### 6.1 Functional Requirements

- [ ] Daily puzzles are identical for all players on same date
- [ ] Streak tracking works correctly across days
- [ ] Share functionality works on mobile and desktop
- [ ] Zen mode maintains existing sequential game experience
- [ ] Multi-grid code remains intact but inaccessible to users

### 6.2 User Experience Requirements

- [ ] Daily mode feels like natural extension of existing game
- [ ] Header title provides intuitive navigation back to menu
- [ ] Tutorial clearly explains both zen and daily modes
- [ ] Design consistency maintained throughout
- [ ] Performance remains smooth with deterministic generation

### 6.3 Technical Requirements

- [ ] Deterministic puzzle generation produces consistent results
- [ ] localStorage properly saves daily completion data
- [ ] Share functionality gracefully handles different browsers
- [ ] Accessibility standards maintained for new features
- [ ] Code remains clean and maintainable

This specification provides the complete roadmap for implementing the daily puzzle feature while simplifying the existing game modes and maintaining the core elegant design philosophy.
