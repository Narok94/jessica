
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store';
import { ChevronLeft, Clock, CheckCircle2, Play, LayoutDashboard, Quote, Camera, Download, Trash2, Share2, Dumbbell } from 'lucide-react';
import { ExerciseItem } from '../ExerciseItem';
import { SetPerformance, WorkoutHistoryEntry, AppTab, CardioSession } from '../../types';
import { Timer, Wind, X } from 'lucide-react';

export const WorkoutView: React.FC = () => {
  const { 
    selectedWorkout, 
    user, 
    showSummary, 
    isWorkoutActive, 
    elapsedTime, 
    currentSessionProgress,
    currentCardioProgress,
    workoutDuration,
    lastWorkoutVolume,
    setIsWorkoutActive,
    setWorkoutStartTime,
    setElapsedTime,
    setCurrentSessionProgress,
    setCurrentCardioProgress,
    setShowSummary,
    setLastWorkoutVolume,
    setWorkoutDuration,
    updateUserProfile,
    triggerConfetti,
    setActiveTab,
    setSelectedWorkout,
    workoutStartTime
  } = useStore();

  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);
  const [showCardioModal, setShowCardioModal] = React.useState(false);
  const [cardioInput, setCardioInput] = React.useState({ exercise: 'Esteira', duration: 15 });

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        console.log('Wake Lock isActive');
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Wake Lock was released');
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  useEffect(() => {
    if (isWorkoutActive && workoutStartTime) {
      requestWakeLock();
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    } else {
      releaseWakeLock();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      releaseWakeLock();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isWorkoutActive, workoutStartTime, setElapsedTime]);

  if (!selectedWorkout || !user) return null;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  const handleVibrate = (ms = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const startWorkout = () => {
    handleVibrate(20);
    setIsWorkoutActive(true);
    setWorkoutStartTime(Date.now());
    setElapsedTime(0);
  };

  const calculateVolume = () => {
    let total = 0;
    (Object.values(currentSessionProgress) as SetPerformance[][]).forEach((perf) => {
      if (perf) {
        perf.filter(p => p.completed).forEach(p => {
          total += (p.weight * p.reps);
        });
      }
    });
    return total;
  };

  const handleSaveProgress = (exerciseId: string, performance: SetPerformance[]) => {
    setCurrentSessionProgress({ ...currentSessionProgress, [exerciseId]: performance });
  };

  const handleFinishWorkout = () => {
    if (!selectedWorkout || !user || !workoutStartTime) return;
    const today = new Date().toISOString().split('T')[0];
    const volume = calculateVolume();
    setLastWorkoutVolume(volume);
    
    const duration = Math.floor((Date.now() - workoutStartTime) / 1000);
    setWorkoutDuration(duration);
    setIsWorkoutActive(false);

    const historyEntry: WorkoutHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      workoutId: selectedWorkout.id,
      workoutTitle: selectedWorkout.title,
      duration: duration,
      exercises: selectedWorkout.exercises.map(ex => ({
        exerciseId: ex.id,
        name: ex.name,
        performance: currentSessionProgress[ex.id] || []
      })),
      cardio: currentCardioProgress ? { ...currentCardioProgress } : undefined
    };

    const newWeights: Record<string, number> = { ...(user.weights || {}) };
    
    Object.entries(currentSessionProgress).forEach(([id, perf]) => {
      const p = perf as SetPerformance[];
      const lastWeight = p.filter(item => item.completed).reverse()[0]?.weight;
      if (lastWeight) newWeights[id] = lastWeight;
    });

    const newCheckIns = user.checkIns.includes(today) ? user.checkIns : [...user.checkIns, today];
    
    updateUserProfile({ 
      history: [historyEntry, ...user.history],
      totalWorkouts: (user.totalWorkouts || 0) + 1,
      weights: newWeights,
      checkIns: newCheckIns,
      streak: (user.streak || 0) + 1
    });

    triggerConfetti();
    localStorage.removeItem(`tatugym_active_session_${user.username.toLowerCase()}`);
    setShowSummary(true);
  };

  const closeSummary = () => {
    setCapturedImage(null);
    setShowSummary(false);
    setSelectedWorkout(null);
    setCurrentSessionProgress({});
    setCurrentCardioProgress(null);
    setWorkoutStartTime(null);
    setWorkoutDuration(null);
    setElapsedTime(0);
    setIsWorkoutActive(false);
    setActiveTab(AppTab.DASHBOARD);
  };

  const exitWorkout = () => {
      setSelectedWorkout(null);
      setShowSummary(false);
      setActiveTab(AppTab.DASHBOARD);
  };

  const cancelWorkout = () => {
    if(confirm('Tem certeza que deseja descarar este treino? Todo o progresso desta sessão será perdido.')) { 
      if (user) {
        localStorage.removeItem(`tatugym_active_session_${user.username.toLowerCase()}`);
      }
      setSelectedWorkout(null);
      setCurrentSessionProgress({});
      setCurrentCardioProgress(null);
      setWorkoutStartTime(null);
      setElapsedTime(0);
      setIsWorkoutActive(false);
      setActiveTab(AppTab.DASHBOARD);
    }
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadSummaryImage = () => {
    if (!canvasRef.current || !capturedImage) return;
    setIsGeneratingImage(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = capturedImage;

    img.onload = () => {
      // Set canvas size to match image or a standard social media size
      const targetWidth = 1080;
      const targetHeight = 1350; // 4:5 aspect ratio
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw background image (proportional crop)
      const imgAspect = img.width / img.height;
      const targetAspect = targetWidth / targetHeight;
      let drawW, drawH, drawX, drawY;

      if (imgAspect > targetAspect) {
        drawH = targetHeight;
        drawW = targetHeight * imgAspect;
        drawX = (targetWidth - drawW) / 2;
        drawY = 0;
      } else {
        drawW = targetWidth;
        drawH = targetWidth / imgAspect;
        drawX = 0;
        drawY = (targetHeight - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Dark Overlay at bottom for better readability
      const gradient = ctx.createLinearGradient(0, targetHeight * 0.4, 0, targetHeight);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.7, 'rgba(0,0,0,0.6)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, targetHeight * 0.4, targetWidth, targetHeight * 0.6);

      // Add "TATU GYM" Branding (TOP LEFT)
      ctx.font = '900 40px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('TATU GYM', 60, 100);
      
      // PINK Accent Spot
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(60, 115, 60, 8);

      // Infer Focus
      const focusText = selectedWorkout.title.toLowerCase().includes('superior') ? 'SUPERIORES' :
                        selectedWorkout.title.toLowerCase().includes('inferior') || selectedWorkout.title.toLowerCase().includes('perna') ? 'INFERIORES' :
                        selectedWorkout.title.toLowerCase().includes('cardio') || selectedWorkout.title.toLowerCase().includes('aeró') ? 'AERÓBICO' :
                        selectedWorkout.title.toLowerCase().includes('abd') ? 'ABDÔMEN' : 'COMPLETO';

      // Focus Tag (BOTTOM)
      ctx.font = '900 24px sans-serif';
      ctx.fillStyle = '#EC4899';
      ctx.fillText(focusText, 60, targetHeight - 480);

      // Add Workout Title
      ctx.font = 'italic 900 90px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(selectedWorkout.title.toUpperCase(), 60, targetHeight - 380);

      // Stats Label
      ctx.font = '900 24px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText('DURAÇÃO TOTAL', 60, targetHeight - 270);

      // Elapsed Time
      ctx.font = '900 120px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(workoutDuration ? formatTime(workoutDuration) : '00:00', 60, targetHeight - 150);

      // PRO PERFORMANCE branding (BOTTOM RIGHT)
      ctx.save();
      ctx.translate(targetWidth - 60, targetHeight - 150);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '900 20px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.textAlign = 'right';
      ctx.fillText('PRO PERFORMANCE', 0, 0);
      ctx.restore();

      // Trigger download
      const link = document.createElement('a');
      link.download = `tatu-gym-victory-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsGeneratingImage(false);
      handleVibrate(30);
    };
  };

  if (showSummary) {
    return (
      <div className="max-w-xl mx-auto space-y-8 animate-slide-up py-6 text-center pb-24">
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-accent rounded-[2.5rem] flex items-center justify-center shadow-2xl transform rotate-12 animate-fade">
              <CheckCircle2 size={48} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-ink uppercase tracking-tighter italic leading-none">Missão <span className="text-accent">Cumprida!</span></h1>
              <p className="text-secondary text-[10px] font-black uppercase tracking-[0.3em] mt-3">Seu desempenho foi registrado com sucesso.</p>
            </div>
          </div>

         {/* Victory Photo Section */}
         <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
               <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Victory Photo</span>
               {capturedImage && (
                 <button onClick={() => setCapturedImage(null)} className="text-secondary hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                 </button>
               )}
            </div>
            
            {!capturedImage ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[4/5] glass-card rounded-[2.5rem] border-dashed border-line flex flex-col items-center justify-center gap-4 group transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-ink/[0.03] flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/10 transition-all">
                  <Camera size={32} className="text-secondary group-hover:text-accent" />
                </div>
                <p className="text-[10px] font-black text-secondary uppercase tracking-widest group-hover:text-ink">Registrar Vitória</p>
              </button>
            ) : (
              <div className="relative group rounded-[2.5rem] overflow-hidden border border-line">
                <img src={capturedImage} alt="Victory" className="w-full aspect-[4/5] object-cover" />
                
                {/* HUD Preview */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                  {/* Top Branding */}
                  <div className="text-left">
                    <p className="text-white font-black text-xl tracking-tighter uppercase leading-none">TATU GYM</p>
                    <div className="w-10 h-1 bg-accent mt-2"></div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-accent font-black text-xs uppercase tracking-widest mb-1">
                        {selectedWorkout.title.toLowerCase().includes('superior') ? 'SUPERIORES' :
                         selectedWorkout.title.toLowerCase().includes('inferior') || selectedWorkout.title.toLowerCase().includes('perna') ? 'INFERIORES' :
                         selectedWorkout.title.toLowerCase().includes('cardio') || selectedWorkout.title.toLowerCase().includes('aeró') ? 'AERÓBICO' :
                         selectedWorkout.title.toLowerCase().includes('abd') ? 'ABDÔMEN' : 'COMPLETO'}
                      </p>
                      <h2 className="text-white font-black text-4xl tracking-tighter uppercase italic leading-none">{selectedWorkout.title}</h2>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="text-left">
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">DURAÇÃO TOTAL</p>
                        <p className="text-5xl font-black text-white leading-none font-mono tracking-tighter">
                          {workoutDuration ? formatTime(workoutDuration) : '00:00'}
                        </p>
                      </div>
                      <div className="rotate-90 origin-bottom-right translate-x-2 text-white/20 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        PRO PERFORMANCE
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                   <button 
                     onClick={downloadSummaryImage}
                     disabled={isGeneratingImage}
                     className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
                   >
                     {isGeneratingImage ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Download size={24} />}
                   </button>
                </div>
              </div>
            )}

            {capturedImage && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={downloadSummaryImage}
                disabled={isGeneratingImage}
                className="w-full py-4 bg-accent/10 border border-accent/20 text-accent font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                {isGeneratingImage ? (
                  <>GERANDO... <div className="w-4 h-4 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div></>
                ) : (
                  <>EXPORTAR FOTO DE VITÓRIA <Download size={18} /></>
                )}
              </motion.button>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageCapture} 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
            />
            <canvas ref={canvasRef} className="hidden" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-8 rounded-[2.5rem] bg-accent/5">
               <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2">Duração da Sessão</p>
               <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl font-black text-ink italic tracking-tighter">{workoutDuration ? formatTime(workoutDuration) : '00:00'}</span>
                  <Clock size={24} className="text-accent" />
               </div>
            </div>
            {currentCardioProgress && (
               <div className="glass-card p-8 rounded-[2.5rem] bg-highlight/5 border border-highlight/10">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2">Aeróbico</p>
                  <div className="flex items-center justify-center gap-3">
                     <span className="text-3xl font-black text-ink italic tracking-tighter">{currentCardioProgress.duration}min</span>
                     <Wind size={24} className="text-highlight" />
                  </div>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1">{currentCardioProgress.exercise}</p>
               </div>
            )}
         </div>

         <div className="glass-card p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden">
            <Quote className="absolute -top-4 -left-4 text-accent/5 w-24 h-24" />
            <div className="relative z-10">
               <p className="text-ink font-bold italic text-lg leading-relaxed">
                 "A constância é a mãe da evolução. Parabéns por hoje."
               </p>
            </div>
         </div>

         <button 
           onClick={closeSummary} 
           className="w-full bg-accent text-white font-black py-5 rounded-[1.8rem] shadow-xl uppercase tracking-[0.4em] active:scale-95 text-[10px] transition-all flex items-center justify-center gap-3"
         >
           <LayoutDashboard size={18} /> Voltar para o Dashboard
         </button>
      </div>
    );
  }

  const totalSets = selectedWorkout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSets = (Object.values(currentSessionProgress) as SetPerformance[][]).reduce((acc, perf) => acc + (perf ? perf.filter(p => p.completed).length : 0), 0);
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div className="space-y-6 animate-slide-up pb-64">
      <header className="flex items-center justify-between sticky top-0 z-50 bg-bg/80 backdrop-blur-xl py-4 border-b border-line -mx-4 px-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={exitWorkout} className="w-10 h-10 flex items-center justify-center text-secondary hover:text-ink transition-all glass-card rounded-xl active:scale-95">
            <ChevronLeft size={18}/>
          </button>
          <div className="min-w-0">
            <h1 className="text-base font-black text-ink italic truncate leading-none uppercase tracking-tighter">{selectedWorkout.title}</h1>
            {isWorkoutActive && (
              <span className="text-[10px] font-mono text-secondary mt-1 block tracking-tight uppercase">SESSÃO ATIVA</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isWorkoutActive ? (
             <>
               <div className="px-3 py-1.5 glass-card rounded-lg">
                  <span className="text-xl font-bold text-ink font-mono leading-none tracking-tight">{formatTime(elapsedTime)}</span>
               </div>
               <button 
                 onClick={handleFinishWorkout}
                 className="px-4 py-1.5 bg-accent text-white font-black text-[10px] uppercase tracking-widest rounded-lg active:scale-95 transition-all shadow-lg"
               >
                 FINALIZAR
               </button>
             </>
          ) : (
            <button 
              onClick={startWorkout}
              className="px-6 py-2.5 bg-accent text-white font-black text-[10px] uppercase tracking-widest rounded-lg active:scale-95 transition-all shadow-lg"
            >
              INICIAR TREINO
            </button>
          )}
        </div>
      </header>

      {isWorkoutActive && (
        <div className="space-y-8 animate-fade px-4">
          <div className="flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-secondary uppercase tracking-widest">Séries Concluídas</span>
                <span className="text-xl font-black text-ink leading-none mt-1">{completedSets} / {totalSets}</span>
             </div>
             <div className="text-right">
                <span className="text-[9px] font-black text-secondary uppercase tracking-widest">Tempo de Treino</span>
                <span className="block text-xl font-black text-accent leading-none mt-1">{formatTime(elapsedTime)}</span>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4 items-start pb-40">
            {selectedWorkout.exercises.map((ex, idx) => {
              // Find previous performance for this exercise from user history
              const lastWorkoutWithEx = user.history?.find(h => 
                h.exercises.some(he => he.exerciseId === ex.id && he.performance.some(p => p.completed))
              );
              const lastPerf = lastWorkoutWithEx?.exercises.find(he => he.exerciseId === ex.id)?.performance.filter(p => p.completed);

              return (
                <motion.div
                  key={ex.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (idx * 0.05) }}
                >
                  <ExerciseItem 
                    exercise={ex} 
                    onSaveProgress={handleSaveProgress} 
                    savedWeight={user.weights?.[ex.id]} 
                    initialPerformance={currentSessionProgress[ex.id]}
                    lastPerformance={lastPerf}
                  />
                </motion.div>
              );
            })}

            {/* Cardio Section Trigger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              {currentCardioProgress ? (
                 <div className="glass-card p-6 rounded-[2rem] border-accent/20 bg-accent/5 flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                          <Wind size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-accent uppercase tracking-widest leading-none mb-1">AERÓBICO CONCLUÍDO</p>
                          <h4 className="text-base font-black text-ink uppercase tracking-tighter">{currentCardioProgress.exercise}</h4>
                          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{currentCardioProgress.duration} MINUTOS</p>
                       </div>
                    </div>
                    <button 
                       onClick={() => {
                         handleVibrate(10);
                         setCurrentCardioProgress(null);
                       }}
                       className="w-10 h-10 rounded-xl bg-bg border border-line flex items-center justify-center text-secondary hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                       <Trash2 size={16} />
                    </button>
                 </div>
              ) : (
                <button 
                   onClick={() => {
                     handleVibrate(15);
                     setShowCardioModal(true);
                   }}
                   className="w-full glass-card p-8 rounded-[2rem] border-dashed border-line flex flex-col items-center justify-center gap-2 group hover:border-accent transition-all hover:bg-accent/[0.02]"
                >
                   <div className="w-12 h-12 bg-ink/[0.03] rounded-2xl flex items-center justify-center text-secondary group-hover:text-accent group-hover:scale-110 transition-all">
                      <Wind size={24} />
                   </div>
                   <p className="text-[10px] font-black text-secondary uppercase tracking-widest group-hover:text-ink">Adicionar Aeróbico</p>
                </button>
              )}
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="pt-10 flex flex-col gap-4"
            >
              <button 
                onClick={() => {
                  handleVibrate(30);
                  handleFinishWorkout();
                }}
                disabled={completedSets === 0}
                className={`w-full py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 ${
                  completedSets > 0 
                  ? 'bg-accent text-white shadow-xl' 
                  : 'bg-ink/[0.03] border border-line text-secondary cursor-not-allowed'
                }`}
              >
                FINALIZAR SESSÃO
              </button>
              <button 
                onClick={() => {
                   handleVibrate(10);
                   cancelWorkout();
                }}
                className="w-full py-3 text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                CANCELAR TREINO
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {!isWorkoutActive && (
         <div className="py-12 px-4 animate-fade">
            <div className="glass-card p-10 rounded-[2rem] text-center">
               <h2 className="text-2xl font-black italic text-ink uppercase tracking-tighter mb-2">Pronto para começar?</h2>
               <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-8">Treino {selectedWorkout.title} • {selectedWorkout.exercises.length} Exercícios</p>
               <button 
                  onClick={startWorkout}
                  className="w-full bg-accent text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.4em] active:scale-95 transition-all shadow-lg"
               >
                  INICIAR TREINO
               </button>
            </div>
         </div>
      )}

      {/* Cardio Modal */}
      <AnimatePresence>
        {showCardioModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowCardioModal(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               className="relative w-full max-w-sm glass-card bg-bg p-8 rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl border-t border-line"
             >
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                         <Wind size={20} />
                      </div>
                      <h2 className="text-xl font-black text-ink uppercase italic tracking-tighter">Aeróbico</h2>
                   </div>
                   <button onClick={() => setShowCardioModal(false)} className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-secondary">
                      <X size={20} />
                   </button>
                </div>

                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 block">Exercício</label>
                      <div className="grid grid-cols-2 gap-2">
                         {['Esteira', 'Bike', 'Elíptico', 'Escada'].map(ex => (
                            <button 
                               key={ex}
                               onClick={() => {
                                  handleVibrate(5);
                                  setCardioInput({ ...cardioInput, exercise: ex });
                               }}
                               className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${
                                  cardioInput.exercise === ex 
                                  ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' 
                                  : 'bg-ink/[0.03] border-line text-secondary'
                               }`}
                            >
                               {ex}
                            </button>
                         ))}
                      </div>
                      <input 
                         type="text" 
                         value={cardioInput.exercise}
                         onChange={(e) => setCardioInput({ ...cardioInput, exercise: e.target.value })}
                         className="w-full mt-3 bg-ink/[0.03] border border-line p-4 rounded-xl text-ink font-bold placeholder:text-secondary/50 focus:border-accent transition-all"
                         placeholder="Outro..."
                      />
                   </div>

                   <div>
                      <label className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3 block">Tempo (Minutos)</label>
                      <div className="flex items-center gap-4">
                         <input 
                            type="range" 
                            min="5" 
                            max="60" 
                            step="5"
                            value={cardioInput.duration}
                            onChange={(e) => setCardioInput({ ...cardioInput, duration: parseInt(e.target.value) })}
                            className="flex-grow accent-accent"
                         />
                         <div className="w-20 bg-ink/[0.03] border border-line p-3 rounded-xl text-center">
                            <span className="text-xl font-black text-ink font-mono">{cardioInput.duration}</span>
                            <span className="text-[8px] font-black text-secondary block -mt-1 ml-1">MIN</span>
                         </div>
                      </div>
                      <div className="flex justify-between mt-2 px-1">
                         <span className="text-[8px] font-black text-secondary uppercase">5m</span>
                         <span className="text-[8px] font-black text-secondary uppercase">30m</span>
                         <span className="text-[8px] font-black text-secondary uppercase">60m</span>
                      </div>
                   </div>

                   <button 
                      onClick={() => {
                         handleVibrate(30);
                         setCurrentCardioProgress({ ...cardioInput, completed: true });
                         setShowCardioModal(false);
                      }}
                      className="w-full bg-accent text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                      CONCLUIR CARDIO <CheckCircle2 size={18} />
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
