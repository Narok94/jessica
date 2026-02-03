
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
  X
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
  const timerRef = useRef<number | null>(null);
  
  const [performance, setPerformance] = useState<SetPerformance[]>(() => {
    if (initialPerformance && initialPerformance.length > 0) return initialPerformance;
    
    return new Array(exercise.sets).fill(null).map(() => ({
      weight: savedWeight || 0,
      reps: parseInt(exercise.reps) || 0,
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
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn("Audio context not supported or blocked", e);
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
      if (index < performance.length - 1 && updates.completed) {
        startRestTimer();
      }
    }
  };

  const allSetsDone = performance.every(p => p.completed);
  const completedCount = performance.filter(p => p.completed).length;

  return (
    <div className={`glass-card rounded-[1.8rem] border transition-all duration-500 mb-3 overflow-hidden ${
      isOpen 
      ? 'border-emerald-500/30 bg-zinc-900/90' 
      : 'border-white/5'
    } ${allSetsDone && !isOpen ? 'opacity-40' : 'opacity-100'}`}>
      
      {restTimeLeft !== null && (
        <div className="bg-emerald-500 text-zinc-950 flex items-center justify-between py-1 px-4 text-[8px] font-black uppercase tracking-widest animate-pulse">
          <div className="flex items-center gap-1.5">
            <Timer size={10} strokeWidth={3} /> Descanso Ativo
          </div>
          <span className="text-xs font-black">{restTimeLeft}s</span>
        </div>
      )}

      <div 
        className="p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-0.5">
             <h3 className={`text-base font-black tracking-tight leading-none truncate ${allSetsDone ? 'text-zinc-600 line-through' : 'text-white'}`}>
              {exercise.name}
            </h3>
            {allSetsDone && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-zinc-800/50 px-1.5 py-0.5 rounded-lg border border-white/5">
                <span className="text-[8px] font-black text-emerald-500">{completedCount}</span>
                <span className="text-[7px] font-black text-zinc-500 uppercase">/ {exercise.sets}</span>
            </div>
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
              {exercise.reps} Reps
            </p>
          </div>
        </div>
        
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-500 text-zinc-900 rotate-180' : 'bg-zinc-800 text-zinc-600'}`}>
          <ChevronDown size={16} strokeWidth={3} />
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-5 pt-1 animate-slide-up space-y-4">
          <div className="bg-zinc-950/40 border border-white/5 rounded-xl p-3 flex items-center justify-between">
             <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${restTimeLeft !== null ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500'}`}>
                   <Timer size={16} />
                </div>
                <div>
                   <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Descanso</p>
                   <p className="text-sm font-black text-white">{restTimeLeft !== null ? `${restTimeLeft}s` : `${exercise.rest}s`}</p>
                </div>
             </div>
             
             <div className="flex items-center gap-2">
                {restTimeLeft !== null ? (
                   <>
                    <button onClick={cancelRestTimer} className="w-8 h-8 bg-zinc-900 text-zinc-400 rounded-lg flex items-center justify-center border border-white/5"><X size={14} /></button>
                    <button onClick={startRestTimer} className="w-8 h-8 bg-emerald-500 text-zinc-950 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20"><RotateCcw size={14} /></button>
                   </>
                ) : (
                  <button onClick={startRestTimer} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-zinc-950 rounded-lg font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all">
                    <Play size={10} fill="currentColor" /> Play
                  </button>
                )}
             </div>
          </div>

          <div className="space-y-1.5">
            <div className="grid grid-cols-4 gap-2 text-[7px] font-black text-zinc-600 uppercase tracking-widest text-center px-2">
              <div>Série</div>
              <div>Peso</div>
              <div>Reps</div>
              <div>Fim</div>
            </div>

            {performance.map((set, idx) => (
              <div key={idx} className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${set.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-800/30 border-white/5'}`}>
                <div className="w-7 h-7 flex items-center justify-center bg-zinc-900/50 rounded-lg text-[9px] font-black text-zinc-600">{idx + 1}</div>
                <div className="flex-1"><input type="number" inputMode="decimal" value={set.weight || ''} disabled={set.completed} onChange={(e) => updateSet(idx, { weight: parseFloat(e.target.value) || 0 })} className="w-full bg-transparent text-center text-xs font-black text-white outline-none placeholder:text-zinc-800" placeholder="0"/></div>
                <div className="flex-1"><input type="number" inputMode="numeric" value={set.reps || ''} disabled={set.completed} onChange={(e) => updateSet(idx, { reps: parseInt(e.target.value) || 0 })} className="w-full bg-transparent text-center text-xs font-black text-white outline-none placeholder:text-zinc-800" placeholder="0"/></div>
                <button onClick={() => updateSet(idx, { completed: !set.completed })} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${set.completed ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 border border-white/10 text-zinc-700'}`}><Check size={16} strokeWidth={4} /></button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-2 flex items-start gap-2">
              <Zap size={12} className="text-indigo-500 mt-0.5" />
              <p className="text-[9px] font-medium text-zinc-500 leading-tight">Mantenha a postura e respire fundo.</p>
            </div>
            {savedWeight && (
              <div className="bg-zinc-950/40 border border-white/5 rounded-xl p-2 flex items-center justify-between">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Peso Ant.</p>
                <div className="flex items-center gap-0.5"><span className="text-[10px] font-black text-emerald-500">{savedWeight}kg</span><ArrowUpRight size={10} className="text-emerald-500" /></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
