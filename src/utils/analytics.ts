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

declare global {
  interface Window {
    stats_collect?: (event: string, url?: string) => void;
    collectStats?: () => void;
  }
}

class StatsAnalytics {
  private isLoaded = false;
  private isLoading = false;
  private eventQueue: GameEvent[] = [];
  private baseUrl: string;
  private retryAttempts = 0;
  private maxRetries = 3;

  constructor() {
    // Use environment variable or default to localhost
    this.baseUrl = 'http://stats.centrd.io';
  }

  async initialize(): Promise<void> {
    if (this.isLoaded || this.isLoading) return;

    this.isLoading = true;

    try {
      await this.loadStatsScript();
      this.isLoaded = true;
      this.flushEventQueue();
      console.log('📊 Stats analytics initialized');
    } catch (error) {
      console.warn('📊 Stats analytics failed to load:', error);
      // Still allow the game to function normally
    } finally {
      this.isLoading = false;
    }
  }

  private loadStatsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector(
        `script[src="${this.baseUrl}/stats.js"]`,
      );
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `${this.baseUrl}/stats.js`;
      script.async = true;
      script.charset = 'utf8';

      script.onload = () => {
        // Call collectStats as recommended in the guide
        if (window.collectStats) {
          window.collectStats();
        }
        resolve();
      };

      script.onerror = () => reject(new Error('Failed to load stats script'));

      document.head.appendChild(script);
    });
  }

  trackEvent(eventName: string, data?: Partial<GameEvent>): void {
    const event: GameEvent = {
      event: eventName,
      ...data,
    };

    if (!this.isLoaded) {
      // Queue events if not loaded yet
      this.eventQueue.push(event);

      // Try to initialize if not already trying
      if (!this.isLoading) {
        this.initialize();
      }
      return;
    }

    this.sendEvent(event);
  }

  private sendEvent(event: GameEvent): void {
    try {
      if (typeof window !== 'undefined' && window.stats_collect) {
        // Create a descriptive event name following the guide's best practices
        let eventName = event.event;

        // Add contextual information to the event name for better tracking
        if (event.mode) {
          eventName += `_${event.mode}`;
        }
        if (event.difficulty) {
          eventName += `_${event.difficulty}`;
        }
        if (event.perfect) {
          eventName += '_perfect';
        }

        window.stats_collect(eventName);

        console.log('📊 Event tracked:', eventName, event);

        // Reset retry attempts on successful send
        this.retryAttempts = 0;
      }
    } catch (error) {
      console.warn('📊 Failed to send analytics event:', error);

      // Retry logic
      if (this.retryAttempts < this.maxRetries) {
        this.retryAttempts++;
        setTimeout(() => {
          this.sendEvent(event);
        }, 1000 * this.retryAttempts); // Exponential backoff
      }
    }
  }

  private flushEventQueue(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.sendEvent(event);
      }
    }
  }

  // Safe tracking wrapper as recommended in the guide
  private safeTrack(eventName: string, url?: string): void {
    try {
      if (window.stats_collect) {
        window.stats_collect(eventName, url);
      }
    } catch (error) {
      console.warn('📊 Analytics tracking failed:', error);
      // Don't let analytics errors break the app
    }
  }

  // Convenience methods for common events
  trackGameStarted(
    mode: 'daily' | 'zen',
    difficulty?: 'easy' | 'medium' | 'hard',
  ): void {
    this.trackEvent('game_started', {
      mode,
      difficulty,
    });
  }

  trackPuzzleCompleted(
    score: number,
    puzzleIndex: number,
    mode: 'daily' | 'zen',
  ): void {
    this.trackEvent('puzzle_completed', {
      score,
      perfect: score === 0,
      puzzleIndex,
      mode,
    });
  }

  trackGameCompleted(
    mode: 'daily' | 'zen',
    totalScore: number,
    puzzleCount: number,
    perfectCount: number,
    difficulty?: 'easy' | 'medium' | 'hard',
    streak?: number,
  ): void {
    this.trackEvent('game_completed', {
      mode,
      totalScore,
      averageScore: totalScore / puzzleCount,
      perfectCount,
      difficulty,
      streak,
    });
  }

  trackTutorialEvent(
    action: 'started' | 'completed' | 'skipped',
    step?: string,
  ): void {
    this.trackEvent('tutorial_interaction', {
      tutorialStep: action,
      step,
    });
  }

  trackPerfectScore(mode: 'daily' | 'zen', puzzleIndex: number): void {
    this.trackEvent('perfect_score', {
      mode,
      puzzleIndex,
      perfect: true,
    });
  }

  trackStreakMilestone(streak: number): void {
    // Track significant streak milestones
    if (streak % 5 === 0 || streak === 1 || streak === 3 || streak === 7) {
      this.trackEvent('streak_milestone', {
        streak,
      });
    }
  }

  // Additional methods following the guide's recommendations
  trackCustomEvent(eventName: string, url?: string): void {
    this.safeTrack(eventName, url);
  }
}

// Create singleton instance
export const analytics = new StatsAnalytics();

// Don't auto-initialize here - let the hook handle it
export default analytics;
