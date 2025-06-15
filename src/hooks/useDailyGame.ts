import { useState, useCallback } from 'react';
import type { DailyData, DailyScore } from '../types/game.types';
import { getTodayISO, getTodaysPuzzles, calculateCurrentStreak } from '../utils/dailyPuzzles';

const DAILY_DATA_KEY = 'geometric-median-daily-data';

function loadDailyData(): DailyData {
  try {
    const stored = localStorage.getItem(DAILY_DATA_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading daily data:', error);
  }
  
  return {
    scores: {},
    currentStreak: 0,
  };
}

function saveDailyData(data: DailyData): void {
  try {
    localStorage.setItem(DAILY_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving daily data:', error);
  }
}

export function useDailyGame() {
  const [dailyData, setDailyData] = useState<DailyData>(() => loadDailyData());

  const getTodaysStatus = useCallback(() => {
    const today = getTodayISO();
    return dailyData.scores[today]?.completed || false;
  }, [dailyData]);

  const startDailyChallenge = useCallback(() => {
    const puzzles = getTodaysPuzzles();
    return puzzles;
  }, []);

  const completeDailyChallenge = useCallback((results: DailyScore) => {
    const newScores = { ...dailyData.scores, [results.date]: results };
    const newStreak = calculateCurrentStreak(newScores);
    
    const newData: DailyData = {
      scores: newScores,
      currentStreak: newStreak,
    };

    setDailyData(newData);
    saveDailyData(newData);
    
    return newStreak;
  }, [dailyData]);

  const getTodaysScore = useCallback(() => {
    const today = getTodayISO();
    return dailyData.scores[today];
  }, [dailyData]);

  return {
    dailyData,
    getTodaysStatus,
    startDailyChallenge,
    completeDailyChallenge,
    getTodaysScore,
  };
}