import React from 'react';
import type { GameState, DailyScore } from '../../types/game.types';
import { formatDate } from '../../utils/dailyPuzzles';
import { ShareButton } from '../UI/ShareButton';
import './DailyScoreDisplay.css';

interface DailyScoreDisplayProps {
  gameState: GameState;
  dailyScore: DailyScore;
  streak: number;
  onPlayAgain: () => void;
}

function getDifficultyLabel(index: number): string {
  if (index < 2) return 'Easy';
  if (index < 4) return 'Medium';
  return 'Hard';
}

function getPuzzleNumber(index: number): string {
  return `#${(index % 2) + 1}`;
}

export const DailyScoreDisplay: React.FC<DailyScoreDisplayProps> = ({
  gameState,
  dailyScore,
  streak,
  onPlayAgain,
}) => {
  return (
    <div className='daily-score-display-container'>
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
          <span className='score-value'>{streak} day{streak !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className='puzzle-breakdown'>
        <h3>Puzzle Breakdown</h3>
        {gameState.puzzles.map((puzzle, index) => (
          <div key={puzzle.id} className='puzzle-score'>
            <span className='puzzle-label'>
              {getDifficultyLabel(index)} {getPuzzleNumber(index)}:
            </span>
            <span className={puzzle.score === 0 ? 'perfect' : 'score'}>
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