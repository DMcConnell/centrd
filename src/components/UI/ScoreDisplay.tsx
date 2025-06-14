import React from 'react';
import { GameState } from '../../types/game.types';
import { useScoring } from '../../hooks/useScoring';
import './ScoreDisplay.css';

interface ScoreDisplayProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ gameState, onPlayAgain }) => {
  const { getBestScoreForDifficulty, getHighScoresForDifficulty } = useScoring();
  const { totalScore, puzzles, difficulty } = gameState;
  const averageScore = totalScore / puzzles.length;
  const bestScore = getBestScoreForDifficulty(difficulty);
  const highScores = getHighScoresForDifficulty(difficulty);

  const perfectCount = puzzles.filter(p => p.score === 0).length;

  return (
    <div className="score-display-container">
      <h2>Game Complete!</h2>
      
      <div className="score-summary">
        <div className="score-item">
          <span className="score-label">Average Distance:</span>
          <span className="score-value">{averageScore.toFixed(2)}</span>
        </div>
        
        <div className="score-item">
          <span className="score-label">Perfect Guesses:</span>
          <span className="score-value">{perfectCount} / {puzzles.length}</span>
        </div>

        {bestScore !== null && (
          <div className="score-item">
            <span className="score-label">Best Score ({difficulty}):</span>
            <span className="score-value">{bestScore.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="puzzle-breakdown">
        <h3>Puzzle Breakdown</h3>
        {puzzles.map((puzzle, index) => (
          <div key={puzzle.id} className="puzzle-score">
            <span>Puzzle {index + 1}:</span>
            <span className={puzzle.score === 0 ? 'perfect' : ''}>
              {puzzle.score === 0 ? 'Perfect!' : puzzle.score?.toFixed(2) || 'N/A'}
            </span>
          </div>
        ))}
      </div>

      {highScores.length > 0 && (
        <div className="high-scores">
          <h3>Top Scores ({difficulty})</h3>
          <ol>
            {highScores.slice(0, 5).map((score, index) => (
              <li key={index} className={score === averageScore ? 'current-score' : ''}>
                {score.toFixed(2)}
              </li>
            ))}
          </ol>
        </div>
      )}

      <button className="play-again-button" onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  );
};