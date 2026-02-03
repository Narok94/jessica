
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

  useEffect(() => {
    if (restTimeLeft !== null && restTimeLeft > 0) {
      timerRef.current = window.setTimeout(() => {
        setRestTimeLeft(restTimeLeft - 1);
      }, 1000);
    } else if (restTimeLeft === 0) {
      if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
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
      // Inicia timer se não for a última série e se estiver sendo marcado como completo
      if (index < performance.length - 1 && updates.completed) {
        startRestTimer();
      }
    }
  };

  const allSetsDone = performance.every(p => p.completed);
  const completedCount = performance.filter(p => p.completed).length;

  return (
    <div className={`glass-card rounded-[2rem] border transition-all duration-500 mb-3 overflow-hidden ${
      isOpen 
      ? 'border-emerald-500/30 bg-zinc-900/90 ring-1 ring-emerald-500/5' 
      : 'border-white/5'
    } ${allSetsDone && !isOpen ? 'opacity-40' : 'opacity-100'}`}>
      
      {/* Timer de Descanso Ativo (Header Compacto) */}
      {restTimeLeft !== null && (
        <div className="bg-emerald-500 text-zinc-950 flex items-center justify-between py-1.5 px-6 text-[9px] font-black uppercase tracking-widest animate-pulse">
          <div className="flex items-center gap-2">
            <Timer size={12} strokeWidth={3} /> Descanso em curso
          </div>
          <span className="text-xs font-black">{restTimeLeft}s</span>
        </div>
      )}

      {/* Header do Exercício */}
      <div 
        className="p-5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
             <h3 className={`text-lg font-black tracking-tight leading-none truncate ${allSetsDone ? 'text-zinc-600 line-through' : 'text-white'}`}>
              {exercise.name}
            </h3>
            {allSetsDone && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-zinc-800/50 px-2 py-0.5 rounded-lg border border-white/5">
                <span className="text-[9px] font-black text-emerald-500">{completedCount}</span>
                <span className="text-[7px] font-black text-zinc-500 uppercase">/ {exercise.sets} Séries</span>
            </div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
              {exercise.reps} Reps • {exercise.rest}s
            </p>
          </div>
        </div>
        
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-500 text-zinc-900 rotate-180' : 'bg-zinc-800 text-zinc-600'}`}>
          <ChevronDown size={20} strokeWidth={3} />
        </div>
      </div>

      {/* Detalhes do Exercício */}
      {isOpen && (
        <div className="px-5 pb-6 pt-1 animate-slide-up space-y-5">
          
          {/* Widget de Cronômetro de Descanso */}
          <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${restTimeLeft !== null ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' : 'bg-zinc-900 text-zinc-500'}`}>
                   <Timer size={18} />
                </div>
                <div>
                   <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Descanso</p>
                   <p className="text-base font-black text-white">{restTimeLeft !== null ? `${restTimeLeft}s` : `${exercise.rest}s`}</p>
                </div>
             </div>
             
             <div className="flex items-center gap-2">
                {restTimeLeft !== null ? (
                   <>
                    <button 
                      onClick={cancelRestTimer}
                      className="w-10 h-10 bg-zinc-900 text-zinc-400 rounded-xl flex items-center justify-center active:scale-90 transition-all border border-white/5"
                    >
                      <X size={18} />
                    </button>
                    <button 
                      onClick={startRestTimer}
                      className="w-10 h-10 bg-emerald-500 text-zinc-950 rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <RotateCcw size={18} />
                    </button>
                   </>
                ) : (
                  <button 
                    onClick={startRestTimer}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-zinc-950 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <Play size={14} fill="currentColor" /> Iniciar
                  </button>
                )}
             </div>
          </div>

          {/* Grid de Séries */}
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] text-center px-2">
              <div>Série</div>
              <div>Carga (kg)</div>
              <div>Reps</div>
              <div>Status</div>
            </div>

            {performance.map((set, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                  set.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-800/30 border-white/5'
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-zinc-900/50 rounded-lg text-[10px] font-black text-zinc-500">
                  {idx + 1}
                </div>

                <div className="flex-1">
                  <input 
                    type="number" 
                    inputMode="decimal"
                    value={set.weight || ''}
                    disabled={set.completed}
                    onChange={(e) => updateSet(idx, { weight: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-transparent text-center text-sm font-black text-white outline-none placeholder:text-zinc-800"
                    placeholder="0"
                  />
                </div>

                <div className="flex-1">
                  <input 
                    type="number" 
                    inputMode="numeric"
                    value={set.reps || ''}
                    disabled={set.completed}
                    onChange={(e) => updateSet(idx, { reps: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-center text-sm font-black text-white outline-none placeholder:text-zinc-800"
                    placeholder="0"
                  />
                </div>

                <button
                  onClick={() => updateSet(idx, { completed: !set.completed })}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                    set.completed 
                    ? 'bg-emerald-500 text-zinc-950 shadow-lg' 
                    : 'bg-zinc-900 border border-white/10 text-zinc-700'
                  }`}
                >
                  <Check size={20} strokeWidth={4} />
                </button>
              </div>
            ))}
          </div>

          {/* Dicas e Recordes Compactos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3 flex items-start gap-3">
              <Zap size={14} className="text-indigo-500 mt-0.5" />
              <div>
                <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Tatu Insight</p>
                <p className="text-[10px] font-medium text-zinc-500 leading-tight">Mantenha a fase excêntrica controlada.</p>
              </div>
            </div>
            
            {savedWeight && (
              <div className="bg-zinc-950/40 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">PR Anterior</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-emerald-500">{savedWeight}kg</span>
                  <ArrowUpRight size={12} className="text-emerald-500" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
