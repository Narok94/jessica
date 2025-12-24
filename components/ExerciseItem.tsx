
import React, { useState } from 'react';
import { Exercise } from '../types';
import { ChevronDown, ChevronUp, Timer, CheckCircle2 } from 'lucide-react';

interface ExerciseItemProps {
  exercise: Exercise;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [completedSets, setCompletedSets] = useState<boolean[]>(new Array(exercise.sets).fill(false));

  const toggleSet = (index: number) => {
    const newSets = [...completedSets];
    newSets[index] = !newSets[index];
    setCompletedSets(newSets);
  };

  return (
    <div className={`glass-card rounded-[1.8rem] border border-white/5 overflow-hidden mb-3 transition-all ${isOpen ? 'ring-1 ring-emerald-500/30' : ''}`}>
      <div 
        className="p-5 flex items-center justify-between cursor-pointer active:bg-white/5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-base font-bold text-white truncate">{exercise.name}</h3>
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{exercise.muscleGroup} • {exercise.sets}x{exercise.reps}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center text-emerald-500/80 text-[10px] font-black">
            <Timer size={14} className="mr-1" />
            {exercise.rest}s
          </div>
          {isOpen ? <ChevronUp size={18} className="text-zinc-600" /> : <ChevronDown size={18} className="text-zinc-600" />}
        </div>
      </div>

      {isOpen && (
        <div className="px-5 pb-5 pt-3 animate-fade bg-black/20">
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
            {Array.from({ length: exercise.sets }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => toggleSet(idx)}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                  completedSets[idx] 
                  ? 'bg-emerald-500 border-emerald-400 text-zinc-900 shadow-md shadow-emerald-500/20' 
                  : 'bg-zinc-800/40 border-white/5 text-zinc-500'
                }`}
              >
                {completedSets[idx] ? <CheckCircle2 size={14} /> : `Série ${idx + 1}`}
              </button>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
             <input 
               type="number" 
               placeholder="Kg" 
               className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-emerald-500 text-white font-bold placeholder:text-zinc-700"
             />
             <button className="bg-white text-zinc-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
               Salvar
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
