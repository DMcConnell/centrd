import { useEffect, useRef } from 'react';
import { analytics } from '../utils/analytics';

interface GameEvent {
  event: string;
  mode?: 'daily' | 'zen';
  difficulty?: 'easy' | 'medium' | 'hard';
  score?: number;
  perfect?: boolean;
  puzzleIndex?: number;
  totalScore?: number;
  averageScore?: number;
  perfectCount?: number;
  streak?: number;
  tutorialStep?: string;
  [key: string]: string | number | boolean | undefined;
}

export function useAnalytics() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      // Initialize analytics following the guide's best practices
      analytics.initialize().catch((error) => {
        console.warn('Failed to initialize analytics:', error);
        // Don't throw - allow the app to continue functioning
      });
      initializedRef.current = true;
    }
  }, []);

  // Return wrapped methods that include error handling
  return {
    trackGameStarted: (
      mode: 'daily' | 'zen',
      difficulty?: 'easy' | 'medium' | 'hard',
    ) => {
      try {
        analytics.trackGameStarted(mode, difficulty);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    },
    trackPuzzleCompleted: (
      score: number,
      puzzleIndex: number,
      mode: 'daily' | 'zen',
    ) => {
      try {
        analytics.trackPuzzleCompleted(score, puzzleIndex, mode);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    },
    trackGameCompleted: (
      mode: 'daily' | 'zen',
      totalScore: number,
      puzzleCount: number,
      perfectCount: number,
      difficulty?: 'easy' | 'medium' | 'hard',
      streak?: number,
    ) => {
      try {
        analytics.trackGameCompleted(
          mode,
          totalScore,
          puzzleCount,
          perfectCount,
          difficulty,
          streak,
        );
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    },
    trackTutorialEvent: (
      action: 'started' | 'completed' | 'skipped',
      step?: string,
    ) => {
      try {
        analytics.trackTutorialEvent(action, step);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    },
    trackPerfectScore: (mode: 'daily' | 'zen', puzzleIndex: number) => {
      try {
        analytics.trackPerfectScore(mode, puzzleIndex);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    },
    trackStreakMilestone: (streak: number) => {
      try {
        analytics.trackStreakMilestone(streak);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    },
    trackEvent: (eventName: string, data?: Partial<GameEvent>) => {
      try {
        analytics.trackEvent(eventName, data);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    },
    trackCustomEvent: (eventName: string, url?: string) => {
      try {
        analytics.trackCustomEvent(eventName, url);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    },
  };
}
