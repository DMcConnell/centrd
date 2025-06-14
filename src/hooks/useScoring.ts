import { useState, useEffect } from 'react';
import type { HighScores, Difficulty } from '../types/game.types';

const defaultHighScores: HighScores = {
  easy: [],
  medium: [],
  hard: [],
};

export function useScoring() {
  const [highScores, setHighScores] = useState<HighScores>(defaultHighScores);

  useEffect(() => {
    const storedScores = localStorage.getItem('highScores');
    if (storedScores) {
      setHighScores(JSON.parse(storedScores));
    }
  }, []);

  const getHighScoresForDifficulty = (difficulty: Difficulty): number[] => {
    return highScores[difficulty] || [];
  };

  const getBestScoreForDifficulty = (difficulty: Difficulty): number | null => {
    const scores = highScores[difficulty];
    return scores.length > 0 ? scores[0] : null;
  };

  const refreshHighScores = () => {
    const storedScores = localStorage.getItem('highScores');
    if (storedScores) {
      setHighScores(JSON.parse(storedScores));
    }
  };

  return {
    highScores,
    getHighScoresForDifficulty,
    getBestScoreForDifficulty,
    refreshHighScores,
  };
}
