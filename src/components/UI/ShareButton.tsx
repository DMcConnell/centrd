import React, { useState } from 'react';
import type { DailyScore } from '../../types/game.types';
import './ShareButton.css';

interface ShareButtonProps {
  results: DailyScore;
  streak: number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ results, streak }) => {
  const [showCopied, setShowCopied] = useState(false);
  
  const shareText = `🎯 Geometric Median Daily ${results.date}
Average: ${results.averageScore.toFixed(2)}
Perfect: ${results.perfectCount}/6
Streak: ${streak} day${streak !== 1 ? 's' : ''}`;

  const handleShare = async () => {
    try {
      if (navigator.share && /mobile/i.test(navigator.userAgent)) {
        await navigator.share({ text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (error) {
      console.warn('Share failed:', error);
      // Fallback: just copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (clipboardError) {
        console.error('Clipboard write failed:', clipboardError);
      }
    }
  };

  return (
    <button className='share-button' onClick={handleShare}>
      {showCopied ? '✓ Copied!' : 'Share Results'}
    </button>
  );
};