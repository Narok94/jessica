
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
    // Usar a mesma normalização do resto do app para bater com o ID do Firestore
    const firestoreId = normalizeExerciseName(exerciseName);
    const customGif = customGifs[firestoreId];
    
    let potentialUrls = getExerciseGifUrlVariations(exerciseName, originalUrl);
    
    if (customGif) {
      // Coloca o GIF customizado no topo da lista
      potentialUrls = [customGif, ...potentialUrls.filter(u => u !== customGif)];
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

  // Timeout para evitar ficar preso em uma URL que não carrega (ex: tela preta)
  useEffect(() => {
    if (isLoading && !hasError && urls.length > 0) {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      
      loadTimeoutRef.current = setTimeout(() => {
        if (isLoading) {
          console.warn(`[GifImage] Timeout carregando: ${urls[currentUrlIndex]}`);
          handleError();
        }
      }, 6000); // 6 segundos de timeout
    }
    
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [currentUrlIndex, urls, isLoading]);

  const handleError = () => {
    // Se for a primeira URL (provavelmente a customizada), tenta de novo 2 vezes com delay
    // Isso evita o "piscado" e dá tempo do Firebase Storage propagar o arquivo
    if (currentUrlIndex === 0 && retryCount < 2) {
      setIsLoading(true);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1500);
      return;
    }

    console.warn(`[GifImage] Falha ao carregar: ${urls[currentUrlIndex]}`);
    if (currentUrlIndex < urls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
      setRetryCount(0);
      setIsLoading(true);
    } else {
      console.error(`[GifImage] Todas as variações falharam para: ${exerciseName}`);
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
