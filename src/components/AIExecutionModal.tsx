import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, CheckCircle2, AlertCircle, Info, Wind, Zap } from 'lucide-react';
import { getExerciseGuidance, ExerciseGuidance } from '../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';

interface AIExecutionModalProps {
  exerciseName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AIExecutionModal: React.FC<AIExecutionModalProps> = ({ exerciseName, isOpen, onClose }) => {
  const [guidance, setGuidance] = useState<ExerciseGuidance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && exerciseName) {
      const fetchGuidance = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getExerciseGuidance(exerciseName);
          setGuidance(data);
        } catch (err) {
          console.error(err);
          setError('Não foi possível carregar a orientação da IA. Tente novamente.');
        } finally {
          setLoading(false);
        }
      };
      fetchGuidance();
    }
  }, [isOpen, exerciseName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Guia Técnico IA</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{exerciseName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-zinc-800 text-zinc-400 rounded-xl flex items-center justify-center hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 animate-pulse">Analisando biomecânica...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-500/50" />
              <p className="text-sm font-medium text-zinc-400 max-w-xs">{error}</p>
              <button 
                onClick={() => onClose()}
                className="px-6 py-2 bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                Fechar
              </button>
            </div>
          ) : guidance && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Setup Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Info size={18} />
                  <h4 className="text-xs font-black uppercase tracking-widest">Configuração & Preparo</h4>
                </div>
                <div className="grid gap-2">
                  {guidance.setup.map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-zinc-800/30 border border-white/5 rounded-2xl">
                      <div className="w-5 h-5 bg-zinc-800 text-zinc-500 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Execution Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Zap size={18} />
                  <h4 className="text-xs font-black uppercase tracking-widest">Execução Técnica</h4>
                </div>
                <div className="grid gap-2">
                  {guidance.execution.map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-300 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Breathing Section */}
              <section className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-3">
                <Wind size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Respiração</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">{guidance.breathing}</p>
                </div>
              </section>

              {/* Common Mistakes */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle size={18} />
                  <h4 className="text-xs font-black uppercase tracking-widest">Erros Comuns</h4>
                </div>
                <div className="grid gap-2">
                  {guidance.commonMistakes.map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-2xl">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                      <p className="text-xs text-zinc-300 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pro Tips */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Sparkles size={18} />
                  <h4 className="text-xs font-black uppercase tracking-widest">Dicas de Especialista</h4>
                </div>
                <div className="grid gap-2">
                  {guidance.proTips.map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <p className="text-xs text-zinc-300 leading-relaxed italic">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900 border-t border-white/5 text-center">
          <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
            Gerado por Inteligência Artificial • Sempre priorize a segurança
          </p>
        </div>
      </motion.div>
    </div>
  );
};
