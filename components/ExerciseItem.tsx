
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
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({ 
  exercise, 
  onSaveProgress, 
  savedWeight,
  initialPerformance
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

  const startRestTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRestTimeLeft(exercise.rest);
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
      } else if (index < performance.length - 1) {
        startRestTimer();
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
    <div className={`glass-card rounded-2xl border transition-all duration-500 overflow-hidden relative ${
      isOpen 
      ? 'bg-white/[0.04] border-white/10' 
      : 'border-white/[0.05]'
    } ${allSetsDone && !isOpen ? 'opacity-40' : 'opacity-100'}`}>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-black italic tracking-tighter leading-none truncate transition-colors duration-300 ${allSetsDone ? 'text-emerald-500' : 'text-white'}`}>
              {exercise.name.toUpperCase()}
            </h3>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{exercise.sets} SETS</span>
               <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
               <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{exercise.reps} REPS</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <AnimatePresence>
             {allSetsDone && !isOpen && (
               <motion.div 
                 initial={{ scale: 0, rotate: -20 }}
                 animate={{ scale: 1, rotate: 0 }}
                 exit={{ scale: 0 }}
                 className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-bg shadow-[0_0_20px_rgba(16,185,129,0.3)]"
               >
                  <Check size={16} strokeWidth={4} />
               </motion.div>
             )}
           </AnimatePresence>
           <div className={`w-7 h-7 rounded-full border border-white/[0.08] flex items-center justify-center transition-all ${isOpen ? 'rotate-180 bg-white/5 text-white' : 'text-zinc-700'}`}>
             <ChevronDown size={14} strokeWidth={3} />
           </div>
        </div>
      </div>
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 border-t border-white/[0.05]' : 'max-h-0 opacity-0 pointer-events-none overflow-hidden'}`}>
        <div className="px-4 pb-6 pt-5 space-y-6">
          <div className="flex items-center justify-between bg-white/[0.01] p-3 rounded-xl border border-white/[0.03]">
             <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${restTimeLeft !== null ? 'bg-emerald-500 text-bg' : 'bg-white/[0.03] text-zinc-600'}`}>
                   <Timer size={18} strokeWidth={2.5} />
                </div>
                <div>
                   <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Rest</p>
                   <p className="text-lg font-black text-white font-mono leading-none">{restTimeLeft !== null ? `${restTimeLeft}s` : `${exercise.rest}s`}</p>
                </div>
             </div>
             <button onClick={restTimeLeft !== null ? cancelRestTimer : startRestTimer} className={`px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${restTimeLeft !== null ? 'bg-white/5 text-zinc-400' : 'bg-emerald-500 text-bg'}`}>
                {restTimeLeft !== null ? 'STOP' : 'START TIMER'}
             </button>
          </div>

          <div className="space-y-2">
            {performance.map((set, idx) => (
              <div key={idx} className={`grid grid-cols-12 items-center gap-2 p-1.5 rounded-xl border transition-all duration-300 ${set.completed ? 'bg-emerald-500/[0.02] border-emerald-500/20' : 'bg-transparent border-white/[0.04]'}`}>
                <div className="col-span-1 flex items-center justify-center font-mono text-[9px] font-black text-zinc-700">
                  {idx + 1}
                </div>
                
                <div className="col-span-4 h-10 relative">
                   <input 
                      type="number" 
                      inputMode="decimal"
                      value={set.weight === 0 ? '' : set.weight} 
                      disabled={set.completed} 
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => updateSet(idx, { weight: parseFloat(e.target.value) || 0 })} 
                      className="w-full h-full bg-white/[0.03] border border-white/[0.05] rounded-lg text-center text-sm font-bold text-white outline-none focus:border-emerald-500/30 transition-all font-mono"
                      placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-zinc-800 pointer-events-none">KG</span>
                </div>

                <div className="col-span-4 h-10 relative">
                    <input 
                      type="number" 
                      inputMode="decimal" 
                      value={set.reps === 0 ? '' : set.reps} 
                      disabled={set.completed} 
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => updateSet(idx, { reps: parseInt(e.target.value) || 0 })} 
                      className="w-full h-full bg-white/[0.03] border border-white/[0.05] rounded-lg text-center text-sm font-bold text-white outline-none focus:border-emerald-500/30 transition-all font-mono"
                      placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-zinc-800 pointer-events-none">REPS</span>
                </div>

                <div className="col-span-3 flex items-center justify-end pr-2">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateSet(idx, { completed: !set.completed })} 
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      set.completed 
                      ? 'bg-emerald-500 text-bg' 
                      : 'bg-white/[0.03] border border-white/[0.05] text-zinc-800 hover:text-zinc-400'
                    }`}
                  >
                    <Check size={18} strokeWidth={4} />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2">
             <p className="text-[10px] font-black italic text-zinc-500 leading-relaxed uppercase tracking-widest text-center opacity-60">
                {exercise.notes || 'Mantenha cadência controlada e foco total na contração.'}
             </p>
             <a 
               href={`https://www.google.com/search?q=gif+execução+exercicio+${encodeURIComponent(exercise.name)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="text-[9px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-[0.2em] text-center"
             >
               Ver tutorial técnico
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
