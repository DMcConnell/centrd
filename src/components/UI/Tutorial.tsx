import React, { useState } from 'react';
import { Grid } from '../Game/Grid';
import { Puzzle, Position } from '../../types/game.types';
import './Tutorial.css';

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
      { x: 1, y: 2 }
    ]
  },
  {
    id: 'tutorial-2',
    gridSize: 4,
    dots: [
      { x: 0, y: 1 },
      { x: 3, y: 0 },
      { x: 2, y: 3 },
      { x: 1, y: 2 }
    ]
  }
];

export const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(tutorialPuzzles[0]);

  const handleCellClick = (position: Position) => {
    // For tutorial, always show the optimal solution as (1,1) for puzzle 1
    const correctAnswer = step === 0 ? { x: 1, y: 1 } : { x: 2, y: 1 };
    setCurrentPuzzle({
      ...currentPuzzle,
      userGuess: position,
      correctAnswer,
      score: Math.abs(position.x - correctAnswer.x) + Math.abs(position.y - correctAnswer.y)
    });
  };

  const nextStep = () => {
    if (step === 0) {
      setStep(1);
      setCurrentPuzzle(tutorialPuzzles[1]);
    } else if (step === 1 && currentPuzzle.userGuess) {
      setStep(2);
    } else {
      onComplete();
    }
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <h2>Welcome to Geometric Median!</h2>
        
        {step === 0 && (
          <>
            <p className="tutorial-text">
              Find the center point that's closest to all the dots.
              Let's try a simple example!
            </p>
            <div className="tutorial-grid">
              <Grid
                puzzle={currentPuzzle}
                onCellClick={handleCellClick}
                cellSize={60}
              />
            </div>
            {currentPuzzle.userGuess && (
              <div className="tutorial-feedback">
                {currentPuzzle.score === 0 ? (
                  <p className="perfect">Perfect! That's the optimal point!</p>
                ) : (
                  <p>Good try! The closer you are, the better your score!</p>
                )}
                <button className="tutorial-button" onClick={nextStep}>
                  Next Example
                </button>
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <p className="tutorial-text">
              Sometimes the center isn't where you'd expect.
              Try this asymmetric pattern!
            </p>
            <div className="tutorial-grid">
              <Grid
                puzzle={currentPuzzle}
                onCellClick={handleCellClick}
                cellSize={60}
              />
            </div>
            {currentPuzzle.userGuess && (
              <div className="tutorial-feedback">
                <p>The best spot minimizes total distance to all dots.</p>
                <button className="tutorial-button" onClick={nextStep}>
                  Continue
                </button>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <p className="tutorial-text">
              Great! You're ready to play!
            </p>
            <div className="tutorial-modes">
              <div className="mode-preview">
                <h3>Sequential Mode</h3>
                <p>Solve one puzzle at a time</p>
              </div>
              <div className="mode-preview">
                <h3>Multi-Grid Mode</h3>
                <p>Solve several puzzles at once</p>
              </div>
            </div>
            <p className="tutorial-tip">
              Start with Easy difficulty to get comfortable!
            </p>
            <button className="tutorial-button primary" onClick={onComplete}>
              Let's Play!
            </button>
          </>
        )}

        <button className="skip-button" onClick={onComplete}>
          Skip Tutorial
        </button>
      </div>
    </div>
  );
};