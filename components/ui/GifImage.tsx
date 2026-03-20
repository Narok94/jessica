
import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Loader2 } from 'lucide-react';
import { getExerciseGifUrlVariations, normalizeExerciseName } from '../../src/utils/exerciseUtils';
import { useStore } from '../../store';

interface GifImageProps {
  exerciseName: string;
  originalUrl?: string;
  className?: string;
  fallbackSize?: number;
}

export const GifImage: React.FC<GifImageProps> = ({ 
  exerciseName, 
  originalUrl, 
  className = "", 
  fallbackSize = 32 
}) => {
  const { customGifs } = useStore();
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [urls, setUrls] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const firestoreId = normalizeExerciseName(exerciseName);
    const customGif = customGifs[firestoreId];
    
    // Lista simplificada de URLs para evitar spam e lentidão
    let potentialUrls: string[] = [];
    
    if (customGif) {
      // Se tem GIF customizado, ele é a única prioridade inicial
      potentialUrls = [customGif];
    } else {
      // Se não tem, tenta as 3 variações mais prováveis do GitHub
      const normalized = normalizeExerciseName(exerciseName);
      potentialUrls = [
        `https://raw.githubusercontent.com/Narok94/tatu-gym-assets/main/${encodeURIComponent(normalized)}.gif`,
        `https://raw.githubusercontent.com/Narok94/tatu-gym-assets/main/assets/${encodeURIComponent(normalized)}.gif`,
        `https://cdn.jsdelivr.net/gh/Narok94/tatu-gym-assets@main/${encodeURIComponent(normalized)}.gif`
      ];
      
      if (originalUrl && !potentialUrls.includes(originalUrl)) {
        potentialUrls.push(originalUrl);
      }
    }
    
    setUrls(prevUrls => {
      if (JSON.stringify(prevUrls) === JSON.stringify(potentialUrls)) {
        return prevUrls;
      }
      setCurrentUrlIndex(0);
      setRetryCount(0);
      setHasError(false);
      setIsLoading(true);
      return potentialUrls;
    });
  }, [exerciseName, originalUrl, customGifs]);

  // Timeout para evitar ficar preso em uma URL que não carrega
  useEffect(() => {
    if (isLoading && !hasError && urls.length > 0) {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      
      loadTimeoutRef.current = setTimeout(() => {
        if (isLoading) {
          console.warn(`[GifImage] Timeout (${urls[currentUrlIndex]})`);
          handleError();
        }
      }, 4000); 
    }
    
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [currentUrlIndex, urls, isLoading]);

  const handleError = () => {
    const firestoreId = normalizeExerciseName(exerciseName);
    const isCustom = customGifs[firestoreId] === urls[currentUrlIndex];

    // Se o GIF do Firebase falhar, tentamos 3 vezes antes de desistir e ir para o fallback
    if (isCustom && retryCount < 3) {
      console.log(`[GifImage] Retentativa ${retryCount + 1} para GIF customizado...`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setIsLoading(true);
      }, 2000);
      return;
    }

    // Se falhou o customizado após retentativas, adiciona os fallbacks do GitHub na lista
    if (isCustom && urls.length === 1) {
      console.warn(`[GifImage] GIF customizado falhou. Tentando fallbacks do GitHub...`);
      const normalized = normalizeExerciseName(exerciseName);
      const fallbacks = [
        `https://raw.githubusercontent.com/Narok94/tatu-gym-assets/main/${encodeURIComponent(normalized)}.gif`,
        `https://cdn.jsdelivr.net/gh/Narok94/tatu-gym-assets@main/${encodeURIComponent(normalized)}.gif`
      ];
      setUrls(prev => [...prev, ...fallbacks]);
      setCurrentUrlIndex(1);
      setRetryCount(0);
      setIsLoading(true);
      return;
    }

    if (currentUrlIndex < urls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
      setRetryCount(0);
      setIsLoading(true);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
  };

  const isVideo = (url: string) => {
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.mp4') || lowerUrl.includes('.mp4?') || lowerUrl.includes('video%2fmp4');
  };

  if (hasError || urls.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900/50 rounded-lg ${className}`}>
        <Dumbbell size={fallbackSize} className="text-zinc-700" />
      </div>
    );
  }

  const currentUrl = urls[currentUrlIndex];

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 z-10">
          <Loader2 className="text-emerald-500 animate-spin" size={24} />
        </div>
      )}
      
      {isVideo(currentUrl) ? (
        <video
          key={`${currentUrl}-${retryCount}`}
          src={currentUrl}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={handleLoad}
          onError={handleError}
        />
      ) : (
        <img
          key={`${currentUrl}-${retryCount}`}
          src={currentUrl}
          alt={exerciseName}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
};
