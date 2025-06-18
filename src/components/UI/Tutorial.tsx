import React, { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import './Tutorial.css';
import type { Puzzle, Position } from '../../types/game.types';
import { Grid } from '../Game/Grid';

interface TutorialProps {
  onComplete: () => void;
}

const tutorialPuzzles: Puzzle[] = [
  {
    id: 'tutorial-1',
    gridSize: 3,
    dots: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 2 },
    ],
  },
  {
    id: 'tutorial-2',
    gridSize: 4,
    dots: [
      { x: 0, y: 0 },
      { x: 3, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 1 },
    ],
  },
];

export const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(
    tutorialPuzzles[0],
  );
  const analytics = useAnalytics();

  // Track tutorial start on component mount
  React.useEffect(() => {
    analytics.trackTutorialEvent('started');
  }, [analytics]);

  const handleCellClick = (position: Position) => {
    // For tutorial, always show the optimal solution as (1,1) for puzzle 1
    const correctAnswer = step === 0 ? { x: 1, y: 1 } : { x: 1, y: 1 };
    setCurrentPuzzle({
      ...currentPuzzle,
      userGuess: position,
      correctAnswer,
      score:
        Math.abs(position.x - correctAnswer.x) +
        Math.abs(position.y - correctAnswer.y),
    });
  };

  const nextStep = () => {
    if (step === 0) {
      setStep(1);
      setCurrentPuzzle(tutorialPuzzles[1]);
    } else if (step === 1 && currentPuzzle.userGuess) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      analytics.trackTutorialEvent('completed');
      onComplete();
    }
  };

  const handleSkip = () => {
    analytics.trackTutorialEvent('skipped', `step_${step}`);
    onComplete();
  };

  return (
    <div className='tutorial-overlay'>
      <div className='tutorial-content'>
        <h2>Welcome to centrd.</h2>

        {step === 0 && (
          <>
            <p className='tutorial-text'>
              Find the center point that's closest to all the dots. Let's try a
              simple example!
            </p>
            <div className='tutorial-grid'>
              <Grid puzzle={currentPuzzle} onCellClick={handleCellClick} />
            </div>
            {currentPuzzle.userGuess && (
              <div className='tutorial-feedback'>
                {currentPuzzle.score === 0 ? (
                  <p className='perfect'>Perfect! That's the optimal point!</p>
                ) : (
                  <p>Good try! The closer you are, the better your score!</p>
                )}
                <button className='tutorial-button' onClick={nextStep}>
                  Next Example
                </button>
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <p className='tutorial-text'>
              Sometimes the center isn't where you'd expect. Try this asymmetric
              pattern!
            </p>
            <div className='tutorial-grid'>
              <Grid puzzle={currentPuzzle} onCellClick={handleCellClick} />
            </div>
            {currentPuzzle.userGuess && (
              <div className='tutorial-feedback'>
                <p>The best spot minimizes total distance to all dots.</p>
                <button className='tutorial-button' onClick={nextStep}>
                  Learn About Scoring
                </button>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className='tutorial-text'>
              <h3
                style={{
                  color: '#333333',
                  marginBottom: '20px',
                  fontSize: '1.5rem',
                }}
              >
                How Scoring Works
              </h3>
              <p style={{ marginBottom: '20px' }}>
                For each puzzle, your score is the <strong>distance</strong>{' '}
                from your guess to the optimal center point.
              </p>
              <p style={{ marginBottom: '20px' }}>
                <strong style={{ color: '#d32f2f' }}>
                  Lower scores are better!
                </strong>{' '}
                A perfect score of 0 means you found the exact optimal center
                point.
              </p>
              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                }}
              >
                <p style={{ margin: '0', fontWeight: '500' }}>
                  Example: If the optimal point is at (2,1) and you guess (3,2),
                  your distance score would be approximately 1.41 units.
                </p>
              </div>
              <p style={{ marginBottom: '20px' }}>
                Your final score is the <strong>average distance</strong> across
                all puzzles in a game session.
              </p>
              <p>
                The challenge is finding the point that's closest to the
                geometric median - the center that minimizes distance to all
                dots!
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className='tutorial-button' onClick={nextStep}>
                Got it!
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className='tutorial-text'>Great! You're ready to play!</p>
            <div className='tutorial-modes'>
              <div className='mode-preview'>
                <h3>Daily Challenge</h3>
                <p>Today's special puzzle that everyone gets to try</p>
              </div>
              <div className='mode-preview'>
                <h3>Zen Mode</h3>
                <p>Solve puzzles one at a time at your own peaceful pace</p>
              </div>
            </div>
            <button className='tutorial-button primary' onClick={onComplete}>
              Let's Play!
            </button>
          </>
        )}

        <button className='skip-button' onClick={handleSkip}>
          Skip Tutorial
        </button>
      </div>
    </div>
  );
};
