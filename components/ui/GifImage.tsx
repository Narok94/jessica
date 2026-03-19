
import React, { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import { getExerciseGifUrlVariations } from '../../src/utils/exerciseUtils';

interface GifImageProps {
  exerciseName: string;
  originalUrl?: string;
  className?: string;
  fallbackSize?: number;
}

export const GifImage: React.FC<GifImageProps> = ({ exerciseName, originalUrl, className, fallbackSize = 24 }) => {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const potentialUrls = getExerciseGifUrlVariations(exerciseName, originalUrl);
    setUrls(potentialUrls);
    setCurrentUrlIndex(0);
    setHasError(false);
  }, [exerciseName, originalUrl]);

  const handleError = () => {
    if (currentUrlIndex < urls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const isVideo = (url: string) => {
    return url.toLowerCase().endsWith('.mp4');
  };

  if (hasError || urls.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900/50 rounded-lg ${className}`}>
        <Dumbbell size={fallbackSize} className="text-zinc-700" />
      </div>
    );
  }

  const currentUrl = urls[currentUrlIndex];

  if (isVideo(currentUrl)) {
    return (
      <video
        src={currentUrl}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        onError={handleError}
      />
    );
  }

  return (
    <img
      src={currentUrl}
      alt={exerciseName}
      className={className}
      onError={handleError}
      referrerPolicy="no-referrer"
    />
  );
};
