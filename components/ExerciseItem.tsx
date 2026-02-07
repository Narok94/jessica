
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
  Trophy
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

          <div className="flex flex-col sm:flex-row gap-3">
             <div className="flex-1 bg-zinc-950/60 border border-white/5 rounded-[1.2rem] p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${restTimeLeft !== null ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500'}`}>
                      <Timer size={20} />
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Descanso</p>
                      <p className="text-base font-black text-white">{restTimeLeft !== null ? `${restTimeLeft}s` : `${exercise.rest}s`}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   {restTimeLeft !== null ? (
                      <>
                       <button onClick={cancelRestTimer} className="w-10 h-10 bg-zinc-900 text-zinc-400 rounded-xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform"><X size={18} /></button>
                       <button onClick={startRestTimer} className="w-10 h-10 bg-emerald-500 text-zinc-950 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-90 transition-transform"><RotateCcw size={18} /></button>
                      </>
                   ) : (
                     <button onClick={startRestTimer} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-zinc-950 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-emerald-500/10">
                       <Play size={12} fill="currentColor" /> Iniciar Timer
                     </button>
                   )}
                </div>
             </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-[8px] font-black text-zinc-600 uppercase tracking-widest px-2">
              <div className="col-span-1 text-center">Set</div>
              <div className="col-span-4 text-center">Peso (kg)</div>
              <div className="col-span-4 text-center">Reps</div>
              <div className="col-span-2 text-center">RPE</div>
              <div className="col-span-1 text-center">Ok</div>
            </div>

            {performance.map((set, idx) => (
              <div key={idx} className={`grid grid-cols-12 items-center gap-2 p-2 rounded-2xl border transition-all ${set.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-800/40 border-white/5'}`}>
                {/* Set Number */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-black border transition-colors ${set.completed ? 'bg-emerald-500 text-zinc-950 border-emerald-400' : 'bg-zinc-900/80 text-zinc-500 border-white/5'}`}>
                    {idx + 1}
                  </div>
                </div>

                {/* Weight Stepper */}
                <div className="col-span-4 flex items-center bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
                  <button 
                    disabled={set.completed} 
                    onClick={() => adjustValue(idx, 'weight', -1)} 
                    className="p-2 text-zinc-500 hover:text-white active:bg-zinc-800 disabled:opacity-30 transition-colors"
                  >
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <input 
                    type="number" 
                    inputMode="decimal" 
                    value={set.weight} 
                    disabled={set.completed} 
                    onChange={(e) => updateSet(idx, { weight: parseFloat(e.target.value) || 0 })} 
                    className="w-full bg-transparent text-center text-xs font-black text-white outline-none"
                  />
                  <button 
                    disabled={set.completed} 
                    onClick={() => adjustValue(idx, 'weight', 1)} 
                    className="p-2 text-zinc-500 hover:text-white active:bg-zinc-800 disabled:opacity-30 transition-colors"
                  >
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>

                {/* Reps Stepper */}
                <div className="col-span-4 flex items-center bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
                  <button 
                    disabled={set.completed} 
                    onClick={() => adjustValue(idx, 'reps', -1)} 
                    className="p-2 text-zinc-500 hover:text-white active:bg-zinc-800 disabled:opacity-30 transition-colors"
                  >
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <input 
                    type="number" 
                    inputMode="numeric" 
                    value={set.reps} 
                    disabled={set.completed} 
                    onChange={(e) => updateSet(idx, { reps: parseInt(e.target.value) || 0 })} 
                    className="w-full bg-transparent text-center text-xs font-black text-white outline-none"
                  />
                  <button 
                    disabled={set.completed} 
                    onClick={() => adjustValue(idx, 'reps', 1)} 
                    className="p-2 text-zinc-500 hover:text-white active:bg-zinc-800 disabled:opacity-30 transition-colors"
                  >
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>

                {/* RPE Selector */}
                <div className="col-span-2 flex items-center justify-center">
                  <select 
                    disabled={set.completed}
                    value={set.rpe}
                    onChange={(e) => updateSet(idx, { rpe: parseInt(e.target.value) })}
                    className="bg-zinc-900 text-white font-black text-[10px] rounded-lg border border-white/5 p-1 outline-none appearance-none text-center min-w-[34px]"
                  >
                    {[6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                {/* Completion Check */}
                <div className="col-span-1 flex items-center justify-center">
                  <button 
                    onClick={() => updateSet(idx, { completed: !set.completed })} 
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      set.completed 
                      ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' 
                      : 'bg-zinc-900 border border-white/10 text-zinc-700 hover:border-emerald-500/30'
                    }`}
                  >
                    <Check size={18} strokeWidth={4} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 flex items-start gap-3">
              <Info size={16} className="text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-[11px] font-medium text-zinc-400 leading-relaxed">
                {exercise.notes || 'Foque no controle motor. Sinta o músculo trabalhar em cada fase.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
