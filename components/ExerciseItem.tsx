
import React, { useState, useEffect, useRef } from 'react';
import { Exercise, SetPerformance } from '../types';
// Fixed: Added Check to the imports from lucide-react
import { ChevronDown, Timer, CheckCircle2, Zap, ArrowUpRight, Clock, Check } from 'lucide-react';

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

  const updateSet = (index: number, updates: Partial<SetPerformance>) => {
    const newPerf = [...performance];
    newPerf[index] = { ...newPerf[index], ...updates };
    setPerformance(newPerf);
    onSaveProgress(exercise.id, newPerf);
    
    if (updates.completed) {
      if (window.navigator.vibrate) window.navigator.vibrate(20);
      // Inicia timer se não for a última série
      if (index < performance.length - 1) {
        startRestTimer();
      }
    }
  };

  const allSetsDone = performance.every(p => p.completed);
  const completedCount = performance.filter(p => p.completed).length;

  return (
    <div className={`glass-card rounded-[2.5rem] border transition-all duration-500 mb-4 overflow-hidden ${
      isOpen 
      ? 'border-emerald-500/30 bg-zinc-900/95 ring-1 ring-emerald-500/5' 
      : 'border-white/5'
    } ${allSetsDone && !isOpen ? 'opacity-50' : 'opacity-100'}`}>
      
      {/* Timer de Descanso Flutuante Interno */}
      {restTimeLeft !== null && (
        <div className="bg-emerald-500 text-zinc-950 flex items-center justify-center gap-2 py-1 px-4 text-[10px] font-black uppercase tracking-widest animate-pulse">
          <Clock size={12} strokeWidth={3} /> Descanso: {restTimeLeft}s
        </div>
      )}

      {/* Header com Informações Rápidas */}
      <div 
        className="p-6 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1.5">
             <h3 className={`text-xl font-black tracking-tight leading-none truncate ${allSetsDone ? 'text-zinc-600 line-through' : 'text-white'}`}>
              {exercise.name}
            </h3>
            {allSetsDone && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-zinc-800/50 px-2 py-0.5 rounded-lg border border-white/5">
                <span className="text-[10px] font-black text-emerald-500">{completedCount}</span>
                <span className="text-[8px] font-black text-zinc-500 uppercase">/ {exercise.sets} SETS</span>
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              {exercise.reps} REPS • {exercise.rest}s
            </p>
          </div>
        </div>
        
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-500 text-zinc-900 rotate-180 shadow-lg shadow-emerald-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
          <ChevronDown size={24} strokeWidth={3} />
        </div>
      </div>

      {/* Logger Expandido */}
      {isOpen && (
        <div className="px-6 pb-8 pt-2 animate-slide-up space-y-6">
          <div className="grid grid-cols-4 gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-center px-2">
            <div>SET</div>
            <div>CARGA</div>
            <div>REPS</div>
            <div>AÇÃO</div>
          </div>

          <div className="space-y-3">
            {performance.map((set, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-3 p-3 rounded-[1.8rem] border transition-all ${
                  set.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-zinc-800/40 border-white/5'
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-zinc-900/50 rounded-xl text-xs font-black text-zinc-400">
                  {idx + 1}
                </div>

                <div className="flex-1">
                  <input 
                    type="number" 
                    inputMode="decimal"
                    value={set.weight || ''}
                    disabled={set.completed}
                    onChange={(e) => updateSet(idx, { weight: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-transparent text-center text-lg font-black text-white outline-none placeholder:text-zinc-800"
                    placeholder="0"
                  />
                  <div className="text-[8px] text-center font-black text-zinc-600 uppercase">KG</div>
                </div>

                <div className="flex-1">
                  <input 
                    type="number" 
                    inputMode="numeric"
                    value={set.reps || ''}
                    disabled={set.completed}
                    onChange={(e) => updateSet(idx, { reps: parseInt(e.target.value) || 0 })}
                    className="w-full bg-transparent text-center text-lg font-black text-white outline-none placeholder:text-zinc-800"
                    placeholder="0"
                  />
                  <div className="text-[8px] text-center font-black text-zinc-600 uppercase">REPS</div>
                </div>

                <button
                  onClick={() => updateSet(idx, { completed: !set.completed })}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                    set.completed 
                    ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/30' 
                    : 'bg-zinc-900 border border-white/10 text-zinc-700'
                  }`}
                >
                  <Check size={28} strokeWidth={4} />
                </button>
              </div>
            ))}
          </div>

          {/* Dica e Histórico Rápido */}
          <div className="flex flex-col gap-3">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[1.8rem] p-5 flex items-start gap-4">
              <Zap size={20} className="text-indigo-500 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-zinc-300 leading-relaxed uppercase tracking-wide">Dica do Personal Tatu</p>
                <p className="text-xs font-medium text-zinc-500 mt-1">Concentre na contração muscular. Mantenha o tempo de descanso de {exercise.rest}s para máxima densidade.</p>
              </div>
            </div>
            
            {savedWeight && (
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Recorde Pessoal</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-emerald-500">{savedWeight}kg</span>
                  <ArrowUpRight size={14} className="text-emerald-500" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
