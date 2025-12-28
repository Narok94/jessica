
import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { ChevronDown, ChevronUp, Timer, CheckCircle2, Save } from 'lucide-react';

interface ExerciseItemProps {
  exercise: Exercise;
  onSaveProgress: (exerciseId: string, weight: number, setsCompleted: number) => void;
  savedWeight?: number;
  initialSetsCompleted?: number;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({ 
  exercise, 
  onSaveProgress, 
  savedWeight,
  initialSetsCompleted = 0 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [completedSets, setCompletedSets] = useState<boolean[]>(
    new Array(exercise.sets).fill(false).map((_, i) => i < initialSetsCompleted)
  );
  const [currentWeight, setCurrentWeight] = useState<string>(savedWeight?.toString() || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (savedWeight && currentWeight === '') setCurrentWeight(savedWeight.toString());
  }, [savedWeight]);

  const toggleSet = (index: number) => {
    const newSets = [...completedSets];
    newSets[index] = !newSets[index];
    setCompletedSets(newSets);
    
    const setsDone = newSets.filter(s => s).length;
    onSaveProgress(exercise.id, parseFloat(currentWeight) || 0, setsDone);
    
    // Haptic feedback simulation
    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  const handleSaveWeight = () => {
    const weightNum = parseFloat(currentWeight);
    const setsDone = completedSets.filter(s => s).length;
    onSaveProgress(exercise.id, weightNum || 0, setsDone);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className={`glass-card rounded-[1.5rem] border border-white/5 overflow-hidden mb-2 transition-all ${isOpen ? 'ring-1 ring-emerald-500/40 bg-zinc-900/90' : ''}`}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer active:bg-white/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-[15px] font-bold text-white truncate leading-tight">{exercise.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {exercise.sets}x{exercise.reps} • {exercise.muscleGroup}
            </p>
            {savedWeight && (
              <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-md">
                {savedWeight}kg
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center text-emerald-500/80 text-[10px] font-black bg-emerald-500/5 px-2 py-1 rounded-full">
            <Timer size={12} className="mr-1" />
            {exercise.rest}s
          </div>
          {isOpen ? <ChevronUp size={16} className="text-zinc-600" /> : <ChevronDown size={16} className="text-zinc-600" />}
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 animate-fade space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: exercise.sets }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => toggleSet(idx)}
                className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-all ${
                  completedSets[idx] 
                  ? 'bg-emerald-500 border-emerald-400 text-zinc-900 shadow-lg shadow-emerald-500/20 scale-[0.98]' 
                  : 'bg-zinc-800/60 border-white/5 text-zinc-500'
                }`}
              >
                <span className="text-[8px] font-black uppercase mb-0.5">Série</span>
                <span className="text-sm font-black">{idx + 1}</span>
                {completedSets[idx] && <CheckCircle2 size={10} className="mt-1" />}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
             <div className="relative flex-1">
               <input 
                 type="number" 
                 inputMode="decimal"
                 value={currentWeight}
                 onChange={(e) => {
                   setCurrentWeight(e.target.value);
                   onSaveProgress(exercise.id, parseFloat(e.target.value) || 0, completedSets.filter(s => s).length);
                 }}
                 placeholder="Carga (Kg)" 
                 className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 text-white font-bold placeholder:text-zinc-700"
               />
               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-zinc-600">KG</span>
             </div>
             <button 
               onClick={handleSaveWeight}
               className={`px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all flex items-center gap-2 ${
                 isSaved ? 'bg-emerald-500 text-zinc-900' : 'bg-white text-zinc-900'
               }`}
             >
               {isSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
               {isSaved ? 'OK' : 'SALVAR'}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
