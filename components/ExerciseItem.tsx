
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Exercise, SetPerformance } from '../types';
import { 
  ChevronDown, 
  Timer, 
  CheckCircle2, 
  Zap, 
  ArrowUpRight, 
  Clock, 
  Check, 
  Play, 
  RotateCcw,
  X,
  Plus,
  Minus,
  Info,
  Trophy,
  PlayCircle,
  ExternalLink,
  Search
} from 'lucide-react';

interface ExerciseItemProps {
  exercise: Exercise;
  onSaveProgress: (exerciseId: string, performance: SetPerformance[]) => void;
  savedWeight?: number;
  initialPerformance?: SetPerformance[];
  lastPerformance?: SetPerformance[];
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({ 
  exercise, 
  onSaveProgress, 
  savedWeight,
  initialPerformance,
  lastPerformance
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState<number | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const timerRef = useRef<number | null>(null);

  const [performance, setPerformance] = useState<SetPerformance[]>(() => {
    if (initialPerformance && initialPerformance.length > 0) return initialPerformance;
    
    return new Array(exercise.sets).fill(null).map(() => ({
      weight: savedWeight || 0,
      reps: parseInt(exercise.reps) || 0,
      completed: false
    }));
  });

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
    }
    return url;
  };

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn("Audio context not supported", e);
    }
  };

  useEffect(() => {
    if (restTimeLeft !== null && restTimeLeft > 0) {
      timerRef.current = window.setTimeout(() => {
        setRestTimeLeft(restTimeLeft - 1);
      }, 1000);
    } else if (restTimeLeft === 0) {
      if (window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);
      playBeep();
      setRestTimeLeft(null);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [restTimeLeft]);

  const startRestTimer = (seconds?: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRestTimeLeft(seconds || exercise.rest);
  };

  const cancelRestTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRestTimeLeft(null);
  };

  const handleVibrate = (ms = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const updateSet = (index: number, updates: Partial<SetPerformance>) => {
    const newPerf = [...performance];
    newPerf[index] = { ...newPerf[index], ...updates };
    setPerformance(newPerf);
    onSaveProgress(exercise.id, newPerf);
    
    if (updates.completed) {
      handleVibrate(15);
      
      const allDone = newPerf.every(p => p.completed);
      if (allDone) {
        setIsFinishing(true);
        triggerLocalConfetti();
        setTimeout(() => {
          setIsFinishing(false);
          setIsOpen(false);
        }, 1200);
      } else {
        // Auto-Rest Timer: 60 seconds
        startRestTimer(60);
      }
    }
  };

  const triggerLocalConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#10b981', '#34d399', '#ffffff'],
      disableForReducedMotion: true
    });
  };

  const adjustValue = (index: number, key: 'weight' | 'reps', delta: number) => {
    const currentVal = performance[index][key] || 0;
    const newVal = Math.max(0, currentVal + delta);
    updateSet(index, { [key]: newVal });
  };

  const allSetsDone = performance.every(p => p.completed);
  const completedCount = performance.filter(p => p.completed).length;

  const isImageUrl = (url?: string) => {
    if (!url) return false;
    return url.startsWith('data:image/') || 
           url.toLowerCase().endsWith('.gif') || 
           url.toLowerCase().endsWith('.jpg') || 
           url.toLowerCase().endsWith('.jpeg') || 
           url.toLowerCase().endsWith('.png') || 
           url.toLowerCase().endsWith('.webp');
  };

  return (
    <div className={`glass-card rounded-[2rem] border transition-all duration-500 overflow-hidden relative ${
      isOpen 
      ? 'bg-slate-50 border-indigo-200 shadow-xl shadow-indigo-950/5' 
      : 'border-slate-100 shadow-sm'
    } ${allSetsDone && !isOpen ? 'opacity-50 grayscale-[0.5]' : 'opacity-100'}`}>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-black italic tracking-tighter leading-none truncate transition-colors duration-500 ${allSetsDone ? 'text-emerald-500' : 'text-slate-900 group-hover:text-indigo-600'}`}>
              {exercise.name.toUpperCase()}
            </h3>
            <div className="flex items-center gap-3 mt-2.5">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exercise.sets} SÉRIES</span>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exercise.reps} REPS</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <AnimatePresence>
             {allSetsDone && !isOpen && (
               <motion.div 
                 initial={{ scale: 0, rotate: -20 }}
                 animate={{ scale: 1, rotate: 0 }}
                 exit={{ scale: 0 }}
                 className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100"
               >
                  <Check size={20} strokeWidth={4} />
               </motion.div>
             )}
           </AnimatePresence>
           <div className={`w-10 h-10 rounded-2xl border border-slate-100 flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-300 group-hover:text-slate-600 group-hover:border-slate-300 shadow-sm bg-white'}`}>
             <ChevronDown size={20} strokeWidth={3} />
           </div>
        </div>
      </div>
      <div className={`transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0 pointer-events-none overflow-hidden'}`}>
        <div className="px-5 pb-8 pt-6 space-y-8">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 shadow-inner">
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${restTimeLeft !== null ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-300 border border-slate-100 shadow-sm'}`}>
                   <Timer size={24} strokeWidth={2.5} />
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Descanso</p>
                   <p className={`text-2xl font-black font-mono leading-none tracking-tighter ${restTimeLeft !== null ? 'text-indigo-600' : 'text-slate-900'}`}>{restTimeLeft !== null ? `${restTimeLeft}s` : `${exercise.rest}s`}</p>
                </div>
             </div>
             <button onClick={restTimeLeft !== null ? cancelRestTimer : () => startRestTimer()} className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 ${restTimeLeft !== null ? 'bg-white text-slate-400 border border-slate-200' : 'bg-indigo-600 text-white shadow-indigo-100'}`}>
                {restTimeLeft !== null ? 'PARAR' : 'DESCANSO'}
             </button>
          </div>

          <div className="space-y-3">
            {lastPerformance && lastPerformance.length > 0 && (
              <div className="flex items-center justify-between px-3 py-2 mb-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Carga Anterior</span>
                <span className="text-[10px] font-black text-indigo-600 tracking-tighter">
                  {lastPerformance.map(p => `${p.weight}kg x ${p.reps}`).join(' | ')}
                </span>
              </div>
            )}
            {performance.map((set, idx) => (
              <div key={idx} className={`grid grid-cols-12 items-center gap-3 p-2 rounded-[1.5rem] border transition-all duration-500 ${set.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="col-span-1 flex items-center justify-center font-black text-[11px] text-slate-300">
                  {idx + 1}
                </div>
                
                <div className="col-span-4 h-12 relative group/input">
                   <input 
                      type="number" 
                      inputMode="decimal"
                      value={set.weight === 0 ? '' : set.weight} 
                      disabled={set.completed} 
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => updateSet(idx, { weight: parseFloat(e.target.value) || 0 })} 
                      className="w-full h-full bg-slate-50 border border-slate-100 rounded-xl text-center text-base font-black text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:shadow-lg focus:shadow-indigo-950/5 transition-all font-mono"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 pointer-events-none group-focus-within/input:text-indigo-400">KG</span>
                </div>

                <div className="col-span-4 h-12 relative group/input">
                    <input 
                      type="number" 
                      inputMode="decimal" 
                      value={set.reps === 0 ? '' : set.reps} 
                      disabled={set.completed} 
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => updateSet(idx, { reps: parseInt(e.target.value) || 0 })} 
                      className="w-full h-full bg-slate-50 border border-slate-100 rounded-xl text-center text-base font-black text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:shadow-lg focus:shadow-indigo-950/5 transition-all font-mono"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 pointer-events-none group-focus-within/input:text-indigo-400">REPS</span>
                </div>

                <div className="col-span-3 flex items-center justify-end pr-1">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateSet(idx, { completed: !set.completed })} 
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md ${
                      set.completed 
                      ? 'bg-emerald-500 text-white shadow-emerald-100' 
                      : 'bg-white border border-slate-100 text-slate-300 hover:text-indigo-600 hover:border-indigo-200'
                    }`}
                  >
                    <Check size={24} strokeWidth={4} />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-4">
             <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[11px] font-black italic text-slate-400 leading-relaxed uppercase tracking-widest mb-1 opacity-80">NOTA DO COACH</p>
                <p className="text-[13px] font-bold text-slate-600 tracking-tight leading-relaxed">
                   {exercise.notes || 'Mantenha a cadência controlada (2s descida, 1s subida) e foco total na amplitude.'}
                </p>
             </div>
             <a 
               href={`https://www.google.com/search?q=gif+execução+exercicio+${encodeURIComponent(exercise.name)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="text-[10px] font-black text-indigo-600 hover:text-indigo-500 transition-colors uppercase tracking-[0.3em] flex items-center justify-center gap-2 group"
             >
               GUIA TÉCNICO <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
             </a>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowVideo(false)}></div>
          <div className="relative w-full max-w-4xl glass-card rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
               <div>
                 <h2 className="text-xl font-black text-white uppercase tracking-tight">{exercise.name}</h2>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Guia de Execução</p>
               </div>
               <button onClick={() => setShowVideo(false)} className="w-10 h-10 bg-zinc-900 text-zinc-400 rounded-full flex items-center justify-center hover:text-white transition-colors">
                 <X size={20} />
               </button>
            </div>
            <div className="aspect-video w-full bg-black">
              {exercise.videoUrl?.includes('embed') || exercise.videoUrl?.includes('youtube') || exercise.videoUrl?.includes('youtu.be') ? (
                <iframe 
                  src={getEmbedUrl(exercise.videoUrl)} 
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-zinc-900 p-8 text-center">
                  <Search size={48} className="text-zinc-700" />
                  <div>
                    <p className="text-white font-black uppercase tracking-widest mb-2">Vídeo não disponível</p>
                    <p className="text-zinc-500 text-xs font-medium max-w-xs mx-auto">
                      Não encontramos um vídeo direto para este exercício, mas você pode buscar no Google.
                    </p>
                  </div>
                  <a 
                    href={`https://www.google.com/search?q=gif+execução+exercicio+${encodeURIComponent(exercise.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                  >
                    Buscar no Google
                  </a>
                </div>
              )}
            </div>
            <div className="p-6 bg-zinc-900/50">
               <p className="text-zinc-400 text-sm font-medium leading-relaxed italic">
                 {exercise.notes || 'Siga as orientações do vídeo para garantir a melhor técnica e evitar lesões.'}
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
