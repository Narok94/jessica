
import React, { useState, useEffect } from 'react';
import { Exercise, SetPerformance } from '../types';
import { ChevronDown, Timer, CheckCircle2, Weight, Hash, Zap } from 'lucide-react';

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
  
  // Inicializa a performance com o número de séries do exercício
  const [performance, setPerformance] = useState<SetPerformance[]>(() => {
    if (initialPerformance && initialPerformance.length > 0) return initialPerformance;
    
    return new Array(exercise.sets).fill(null).map(() => ({
      weight: savedWeight || 0,
      reps: parseInt(exercise.reps) || 0,
      completed: false
    }));
  });

  const updateSet = (index: number, updates: Partial<SetPerformance>) => {
    const newPerf = [...performance];
    newPerf[index] = { ...newPerf[index], ...updates };
    setPerformance(newPerf);
    onSaveProgress(exercise.id, newPerf);
    
    if (updates.completed && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  const allSetsDone = performance.every(p => p.completed);

  return (
    <div className={`glass-card rounded-[2.2rem] border transition-all duration-300 mb-3 overflow-hidden ${
      isOpen 
      ? 'border-emerald-500/40 bg-zinc-900/95 ring-1 ring-emerald-500/10' 
      : 'border-white/5'
    } ${allSetsDone && !isOpen ? 'opacity-60 grayscale-[0.3]' : 'opacity-100'}`}>
      
      {/* Header Ergonômico */}
      <div 
        className="p-5 flex items-center justify-between cursor-pointer active:bg-white/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
             <h3 className={`text-lg font-black tracking-tight leading-none truncate ${allSetsDone ? 'text-zinc-500 line-through' : 'text-white'}`}>
              {exercise.name}
            </h3>
            {allSetsDone && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {performance.filter(p => p.completed).length}/{exercise.sets} CONCLUÍDAS
            </p>
            {savedWeight && !isOpen && (
              <span className="text-[9px] font-black bg-white/5 text-zinc-400 px-2 py-0.5 rounded-md">
                ÚLTIMO: {savedWeight}kg
              </span>
            )}
          </div>
        </div>
        
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-emerald-500 text-zinc-900 rotate-180 shadow-lg shadow-emerald-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
          <ChevronDown size={20} strokeWidth={3} />
        </div>
      </div>

      {/* Logger por Série */}
      {isOpen && (
        <div className="px-5 pb-6 pt-2 animate-slide-up space-y-4 bg-gradient-to-b from-transparent to-black/20">
          
          <div className="flex items-center justify-between px-2 text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            <span className="w-8">SET</span>
            <span className="flex-1 text-center">CARGA (KG)</span>
            <span className="flex-1 text-center">REPS</span>
            <span className="w-12">STATUS</span>
          </div>

          <div className="space-y-2">
            {performance.map((set, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-2 p-2 rounded-2xl border transition-all ${
                  set.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-zinc-900 border-white/5'
                }`}
              >
                {/* Número da Série */}
                <div className="w-8 h-12 flex items-center justify-center bg-zinc-800/50 rounded-xl text-xs font-black text-zinc-500">
                  {idx + 1}
                </div>

                {/* Input de Carga */}
                <div className="flex-1 relative">
                  <input 
                    type="number" 
                    inputMode="decimal"
                    value={set.weight || ''}
                    disabled={set.completed}
                    onChange={(e) => updateSet(idx, { weight: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-3 text-center text-sm font-black text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                {/* Input de Reps */}
                <div className="flex-1 relative">
                  <input 
                    type="number" 
                    inputMode="numeric"
                    value={set.reps || ''}
                    disabled={set.completed}
                    onChange={(e) => updateSet(idx, { reps: parseInt(e.target.value) || 0 })}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-3 text-center text-sm font-black text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                {/* Botão Check - Super proeminente para o polegar */}
                <button
                  onClick={() => updateSet(idx, { completed: !set.completed })}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                    set.completed 
                    ? 'bg-emerald-500 text-zinc-900 shadow-lg shadow-emerald-500/20' 
                    : 'bg-zinc-800 text-zinc-600'
                  }`}
                >
                  <CheckCircle2 size={24} strokeWidth={set.completed ? 3 : 2} />
                </button>
              </div>
            ))}
          </div>

          {/* Dica de IA Contextual */}
          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 flex items-start gap-3">
            <Zap size={16} className="text-indigo-500 mt-1 shrink-0" />
            <p className="text-[10px] font-bold text-zinc-400 leading-relaxed">
              Mantenha o controle na descida. O descanso ideal agora é de <span className="text-indigo-400">{exercise.rest}s</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
