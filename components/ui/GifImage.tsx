
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
  const [retryCount, setRetryCount] = useState(0);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derivamos as URLs diretamente das props/store para evitar loops de estado
  const normalized = normalizeExerciseName(exerciseName);
  const customGif = customGifs[normalized];
  
  // Usamos a função robusta de variações para garantir o carregamento
  const variations = getExerciseGifUrlVariations(exerciseName, originalUrl);
  
  const urls = customGif ? [customGif, ...variations] : variations;
  const currentUrl = urls[currentUrlIndex] || urls[0];

  // Resetar estado quando o exercício muda ou um novo GIF customizado aparece
  useEffect(() => {
    setCurrentUrlIndex(0);
    setRetryCount(0);
    setHasError(false);
    setIsLoading(true);
  }, [exerciseName, customGif]);

  // Timeout de segurança para cada tentativa de URL
  useEffect(() => {
    if (isLoading && !hasError && currentUrl) {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      
      loadTimeoutRef.current = setTimeout(() => {
        if (isLoading) {
          console.warn(`[GifImage] Timeout no carregamento de: ${currentUrl}`);
          handleError();
        }
      }, 3000); 
    }
    
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [currentUrl, isLoading, hasError]);

  const handleLoad = () => {
    console.log(`[GifImage] Sucesso (${exerciseName}): ${currentUrl}`);
    setIsLoading(false);
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
  };

  const handleError = () => {
    console.warn(`[GifImage] Falha (${exerciseName}): ${currentUrl}`);

    if (currentUrlIndex < urls.length - 1) {
      console.log(`[GifImage] Tentando próxima URL...`);
      setCurrentUrlIndex(prev => prev + 1);
      setRetryCount(0);
      setIsLoading(true);
    } else if (retryCount < 1) {
      console.log(`[GifImage] Retentando última URL uma vez...`);
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
    } else {
      console.error(`[GifImage] Todas as opções falharam para: ${exerciseName}`);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const isVideo = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.mp4') || lowerUrl.includes('.mp4?') || lowerUrl.includes('video%2fmp4');
  };

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-zinc-900 rounded-2xl gap-2 ${className}`}>
        <Dumbbell size={fallbackSize} className="text-zinc-700" />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setHasError(false);
            setIsLoading(true);
            setCurrentUrlIndex(0);
            setRetryCount(0);
          }}
          className="text-[8px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-zinc-900">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-900">
          <Loader2 className="text-emerald-500 animate-spin" size={24} />
        </div>
      )}
      
      {isVideo(currentUrl) ? (
        <video
          key={`${currentUrl}-${retryCount}`}
          src={currentUrl}
          className={`${className} w-full h-full object-cover`}
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
          className={`${className} w-full h-full object-cover`}
          onLoad={handleLoad}
          onError={handleError}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
};
