
import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink
} from 'lucide-react';

declare var confetti: any;

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
      rpe: 8,
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

  const updateSet = (index: number, updates: Partial<SetPerformance>) => {
    const newPerf = [...performance];
    newPerf[index] = { ...newPerf[index], ...updates };
    setPerformance(newPerf);
    onSaveProgress(exercise.id, newPerf);
    
    if (updates.completed) {
      if (window.navigator.vibrate) window.navigator.vibrate(20);
      
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
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#ffffff'],
        disableForReducedMotion: true
      });
    }
  };

  const adjustValue = (index: number, key: 'weight' | 'reps' | 'rpe', delta: number) => {
    const currentVal = performance[index][key] || 0;
    const newVal = Math.max(0, currentVal + delta);
    updateSet(index, { [key]: newVal });
  };

  const allSetsDone = performance.every(p => p.completed);
  const completedCount = performance.filter(p => p.completed).length;

  return (
    <div className={`glass-card rounded-[2rem] border transition-all duration-500 mb-4 overflow-hidden relative ${
      isOpen 
      ? 'border-emerald-500/40 bg-zinc-900/95 ring-1 ring-emerald-500/10' 
      : 'border-white/5'
    } ${allSetsDone && !isOpen ? 'opacity-50 grayscale-[0.2] scale-[0.98]' : 'opacity-100 scale-100'} 
      ${isFinishing ? 'scale-[1.03] !border-emerald-400 !bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)] z-10' : ''}`}
    >
      <style>{`
        @keyframes success-pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .animate-success { animation: success-pulse 1.2s cubic-bezier(0.66, 0, 0, 1); }
      `}</style>
      
      {isFinishing && <div className="absolute inset-0 animate-success pointer-events-none rounded-[2rem]" />}

      {restTimeLeft !== null && (
        <div className="bg-emerald-500 text-zinc-950 flex items-center justify-between py-1.5 px-5 text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">
          <div className="flex items-center gap-2">
            <Timer size={12} strokeWidth={3} /> Descanso em curso
          </div>
          <span className="text-sm font-black">{restTimeLeft}s</span>
        </div>
      )}

      <div 
        className="p-5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2.5 mb-1">
             <h3 className={`text-lg font-black tracking-tight leading-none truncate transition-all duration-300 ${allSetsDone ? 'text-emerald-500 line-through' : 'text-white'}`}>
              {exercise.name}
            </h3>
            {allSetsDone && <CheckCircle2 size={20} className="text-emerald-500 shrink-0 animate-[bounce_0.6s_infinite]" />}
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-colors ${allSetsDone ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-zinc-800/80 border-white/5'}`}>
                <span className={`text-[10px] font-black ${allSetsDone ? 'text-emerald-400' : 'text-emerald-500'}`}>{completedCount}</span>
                <span className="text-[9px] font-black text-zinc-500 uppercase">/ {exercise.sets} séries</span>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {exercise.reps} reps
            </p>
          </div>
        </div>
        
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-500 text-zinc-950 rotate-180 shadow-lg shadow-emerald-500/20' : 'bg-zinc-800/50 text-zinc-500'}`}>
          <ChevronDown size={20} strokeWidth={3} />
        </div>
      </div>

      {isOpen && (
        <div className="px-5 pb-6 pt-2 animate-slide-up space-y-6">
          {allSetsDone && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex items-center justify-center gap-2 animate-[pulse_2s_infinite]">
              <Trophy size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Parabéns! Exercício Finalizado</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
             <div className="bg-zinc-950/80 border border-white/10 rounded-[1.5rem] p-4 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-4">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${restTimeLeft !== null ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/30' : 'bg-zinc-900 text-zinc-600 border border-white/5'}`}>
                      <Timer size={28} strokeWidth={2.5} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-0.5">Descanso</p>
                      <p className="text-2xl font-black text-white leading-none">{restTimeLeft !== null ? `${restTimeLeft}s` : `${exercise.rest}s`}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   {restTimeLeft !== null ? (
                      <>
                       <button onClick={cancelRestTimer} className="w-12 h-12 bg-zinc-900 text-zinc-400 rounded-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform hover:text-white hover:border-white/20"><X size={22} /></button>
                       <button onClick={startRestTimer} className="w-12 h-12 bg-emerald-500 text-zinc-950 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-90 transition-transform hover:bg-emerald-400"><RotateCcw size={22} /></button>
                      </>
                   ) : (
                     <button onClick={startRestTimer} className="flex items-center gap-3 px-6 py-4 bg-emerald-500 text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-emerald-500/20 hover:bg-emerald-400">
                       <Play size={16} fill="currentColor" /> Iniciar Timer
                     </button>
                   )}
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] px-3">
              <div className="col-span-1 text-center">Set</div>
              <div className="col-span-4 text-center">Peso (kg)</div>
              <div className="col-span-4 text-center">Reps</div>
              <div className="col-span-2 text-center">RPE</div>
              <div className="col-span-1 text-center">Ok</div>
            </div>

            {performance.map((set, idx) => (
              <div key={idx} className={`grid grid-cols-12 items-center gap-3 p-3 rounded-[1.8rem] border transition-all duration-300 ${set.completed ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'bg-zinc-900/40 border-white/10 shadow-md'}`}>
                {/* Set Number */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black border transition-all duration-300 ${set.completed ? 'bg-emerald-500 text-zinc-950 border-emerald-400 scale-110' : 'bg-zinc-800/80 text-zinc-500 border-white/5'}`}>
                    {idx + 1}
                  </div>
                </div>

                {/* Weight Stepper */}
                <div className={`col-span-4 flex items-center rounded-2xl border transition-all duration-300 overflow-hidden h-12 ${set.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-800/50 border-white/10'}`}>
                  <button 
                    disabled={set.completed} 
                    onClick={() => adjustValue(idx, 'weight', -1)} 
                    className="flex-1 h-full flex items-center justify-center text-zinc-500 hover:text-white active:bg-white/5 disabled:opacity-30 transition-all"
                  >
                    <Minus size={16} strokeWidth={3} />
                  </button>
                  <input 
                    type="number" 
                    inputMode="decimal" 
                    value={set.weight} 
                    disabled={set.completed} 
                    onChange={(e) => updateSet(idx, { weight: parseFloat(e.target.value) || 0 })} 
                    className="w-12 bg-transparent text-center text-sm font-black text-white outline-none"
                  />
                  <button 
                    disabled={set.completed} 
                    onClick={() => adjustValue(idx, 'weight', 1)} 
                    className="flex-1 h-full flex items-center justify-center text-zinc-500 hover:text-white active:bg-white/5 disabled:opacity-30 transition-all"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>

                {/* Reps Stepper */}
                <div className={`col-span-4 flex items-center rounded-2xl border transition-all duration-300 overflow-hidden h-12 ${set.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-800/50 border-white/10'}`}>
                  <button 
                    disabled={set.completed} 
                    onClick={() => adjustValue(idx, 'reps', -1)} 
                    className="flex-1 h-full flex items-center justify-center text-zinc-500 hover:text-white active:bg-white/5 disabled:opacity-30 transition-all"
                  >
                    <Minus size={16} strokeWidth={3} />
                  </button>
                  <input 
                    type="number" 
                    inputMode="numeric" 
                    value={set.reps} 
                    disabled={set.completed} 
                    onChange={(e) => updateSet(idx, { reps: parseInt(e.target.value) || 0 })} 
                    className="w-12 bg-transparent text-center text-sm font-black text-white outline-none"
                  />
                  <button 
                    disabled={set.completed} 
                    onClick={() => adjustValue(idx, 'reps', 1)} 
                    className="flex-1 h-full flex items-center justify-center text-zinc-500 hover:text-white active:bg-white/5 disabled:opacity-30 transition-all"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>

                {/* RPE Selector */}
                <div className="col-span-2 flex items-center justify-center">
                  <select 
                    disabled={set.completed}
                    value={set.rpe}
                    onChange={(e) => updateSet(idx, { rpe: parseInt(e.target.value) })}
                    className={`w-full h-12 text-white font-black text-xs rounded-2xl border transition-all outline-none appearance-none text-center ${set.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-800/50 border-white/10'}`}
                  >
                    {[6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                {/* Completion Check */}
                <div className="col-span-1 flex items-center justify-center">
                  <button 
                    onClick={() => updateSet(idx, { completed: !set.completed })} 
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      set.completed 
                      ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/30 scale-110' 
                      : 'bg-zinc-800 border border-white/10 text-zinc-700 hover:border-emerald-500/50 hover:text-emerald-500/50'
                    }`}
                  >
                    <Check size={22} strokeWidth={4} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {exercise.videoUrl && (
              <button 
                onClick={() => setShowVideo(true)}
                className="w-full bg-zinc-900 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-all">
                    <PlayCircle size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Tutorial em Vídeo</p>
                    <p className="text-[8px] font-bold text-zinc-500 uppercase">Assista a execução correta</p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
              </button>
            )}

            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 flex items-start gap-3">
              <Info size={16} className="text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-[11px] font-medium text-zinc-400 leading-relaxed">
                {exercise.notes || 'Foque no controle motor. Sinta o músculo trabalhar em cada fase.'}
              </p>
            </div>
          </div>
        </div>
      )}

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
                <video src={exercise.videoUrl} controls className="w-full h-full" autoPlay></video>
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
