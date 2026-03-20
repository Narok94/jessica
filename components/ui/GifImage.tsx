
import React, { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import { getExerciseGifUrlVariations, normalizeExerciseName } from '../../src/utils/exerciseUtils';
import { useStore } from '../../store';

interface GifImageProps {
  exerciseName: string;
  originalUrl?: string;
  className?: string;
  fallbackSize?: number;
}

export const GifImage: React.FC<GifImageProps> = ({ exerciseName, originalUrl, className, fallbackSize = 24 }) => {
  const { customGifs } = useStore();
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const normalizedName = normalizeExerciseName(exerciseName);
    const customGif = customGifs[normalizedName];
    
    let potentialUrls = getExerciseGifUrlVariations(exerciseName, originalUrl);
    
    if (customGif) {
      // Put custom GIF at the beginning
      potentialUrls = [customGif, ...potentialUrls.filter(u => u !== customGif)];
    }
    
    setUrls(potentialUrls);
    setCurrentUrlIndex(0);
    setHasError(false);
  }, [exerciseName, originalUrl, customGifs]);

  const handleError = () => {
    console.warn(`[GifImage] Falha ao carregar: ${urls[currentUrlIndex]}`);
    if (currentUrlIndex < urls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
    } else {
      console.error(`[GifImage] Todas as variações falharam para: ${exerciseName}`);
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
