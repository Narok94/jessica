import React from 'react';
import { useStore } from '../../store';
import { AppTab } from '../../types';
import { Dumbbell, Shield, Scale, Ruler, Play } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, allWorkouts, setActiveTab, setSelectedWorkout, setIsWorkoutActive, setWorkoutStartTime, logout } = useStore();
  
  if (!user) return null;

  const handleVibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // Profile biometrics and metadata
  const getBiometrics = () => {
    const usernameLower = user.username.toLowerCase();
    
    // Default values if not specified in user profile
    let defaultWeight = '75.0';
    let defaultHeight = '1.75';
    let defaultLevel = 'Atleta';
    
    if (usernameLower === 'henrique') {
      defaultWeight = '84.5';
      defaultHeight = '1.81';
      defaultLevel = 'Atleta Avançado';
    } else if (usernameLower === 'flavia' || usernameLower === 'flávia') {
      defaultWeight = '62.0';
      defaultHeight = '1.65';
      defaultLevel = 'Atleta Intermediário';
    } else if (usernameLower === 'jessica' || usernameLower === 'jéssica') {
      defaultWeight = '60.0';
      defaultHeight = '1.68';
      defaultLevel = 'Atleta Avançado';
    }

    return {
      weight: user.weight !== undefined && user.weight !== null ? user.weight.toString() : defaultWeight,
      height: user.height !== undefined && user.height !== null ? user.height.toString() : defaultHeight,
      level: user.goal || defaultLevel,
      initial: user.name ? user.name.charAt(0).toUpperCase() : (user.username ? user.username.charAt(0).toUpperCase() : 'U')
    };
  };
  const bio = getBiometrics();

  // Weekly consistency
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday...
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjustment for monday
    const monday = new Date(today.setDate(diff));
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };
  
  const weekDates = getWeekDates();
  const weekDays = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  const currentWeekWorkoutsCount = weekDates.filter(date => user.checkIns?.includes(date)).length;
  // If the user hasn't made check-ins yet because they just loaded the app, default to 3/5
  const displayCount = user.checkIns && user.checkIns.length > 0 ? currentWeekWorkoutsCount : 3;

  // Active workout
  const workouts = allWorkouts[user.username.toLowerCase() as keyof typeof allWorkouts] || [];
  const currentWorkout = workouts[0] || {
    title: 'Treino D - Deltóides e Trapézio',
    description: 'Hipertrofia de Ombros, Correção de Postura',
    exercises: [
      { name: 'Elevação Lateral', sets: [{}, {}, {}] },
      { name: 'Desenvolvimento Militar', sets: [{}, {}, {}] },
      { name: 'Elevação Frontal', sets: [{}, {}, {}] }
    ]
  };

  const workoutTitle = currentWorkout.title;
  const workoutFocus = currentWorkout.description;
  const exercisesCount = currentWorkout.exercises?.length || 0;
  const seriesTotais = currentWorkout.exercises ? currentWorkout.exercises.reduce((acc: number, ex: any) => acc + (ex.sets?.length || 0), 0) : 18;

  const startActiveWorkout = () => {
    handleVibrate();
    if (workouts.length > 0) {
      setSelectedWorkout(workouts[0]);
    } else {
      setActiveTab(AppTab.WORKOUT);
    }
  };

  return (
    <div className="h-full max-h-full overflow-hidden flex flex-col justify-between py-1 px-0.5 bg-transparent text-white font-sans antialiased selection:bg-[#FF5F00]/30 select-none">
      
      {/* Cards Grouped at Top */}
      <div className="flex flex-col gap-2.5 py-1 shrink-0">
        {/* HEADER MINIMIZADO */}
        <div className="px-1.5 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-xl font-[950] italic uppercase tracking-tight text-white leading-none">
              TATU <span className="text-[#FF5F00]">GYM</span>
            </h1>
            <p className="text-white/40 text-[8.5px] mt-1 uppercase tracking-widest font-mono font-black leading-none">
              Estética Máxima Performance
            </p>
          </div>
          <button 
            onClick={() => {
              handleVibrate();
              logout();
            }} 
            className="text-[8px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors py-1 px-2 border border-white/5 rounded-lg bg-white/[0.01]"
          >
            SAIR
          </button>
        </div>

        {/* BIOMETRIA EM LINHA ÚNICA COMPACTA - OTIMIZADA E ALINHADA NA MESMA LIGA */}
        <div className="px-1.5 shrink-0">
          <div className="bg-[#0c0c0c]/90 border border-white/5 py-3 px-3.5 rounded-xl flex items-center justify-between gap-3 text-xs shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FF5F00]/10 border border-[#FF5F00]/20 flex items-center justify-center text-[#FF5F00] font-[950] italic text-sm shrink-0">
                {bio.initial}
              </div>
              <div className="min-w-0">
                <h2 className="font-extrabold text-white leading-tight text-sm tracking-wide truncate">{user.name}</h2>
                <p className="text-[9.5px] text-white/40 leading-none mt-1 font-semibold uppercase truncate">{bio.level}</p>
              </div>
            </div>
            
            <div className="flex gap-3 items-center border-l border-white/5 pl-3.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#FF5F00]" />
                <span className="font-mono font-[900] text-sm text-white leading-none">
                  {bio.weight}<span className="text-[9px] text-[#FF5F00] font-black ml-0.5">KG</span>
                </span>
              </div>
              <span className="text-white/10 text-xs font-bold leading-none">|</span>
              <div className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-[#FF5F00]" />
                <span className="font-mono font-[900] text-sm text-white leading-none">
                  {bio.height}<span className="text-[9px] text-[#FF5F00] font-black ml-0.5">M</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* VISÃO GERAL DE PERFORMANCE (CONSISTÊNCIA SEMANAL EXTRA COMPACTA) */}
        <div className="px-1.5 shrink-0">
          <div className="bg-[#0c0c0c]/90 border border-white/5 p-3.5 rounded-xl space-y-2.5 shadow-md">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[9px] font-black italic uppercase text-[#FF5F00] tracking-widest leading-none">Minha Consistência</h3>
              <span className="text-[8px] font-mono text-white/40 uppercase font-black">Últimos 7 dias</span>
            </div>
            
            <div className="space-y-2.5">
              {/* Grid dos Dias */}
              <div className="grid grid-cols-7 gap-1.5">
                {weekDays.map((dia, idx) => {
                  let treinou = false;
                  if (user.checkIns && user.checkIns.length > 0) {
                    const dateStr = weekDates[idx];
                    treinou = user.checkIns.includes(dateStr);
                  } else {
                    treinou = idx >= 1 && idx <= 4;
                  }
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <span className="text-[8.5px] font-black font-mono text-white/45 leading-none">{dia}</span>
                      <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all ${
                        treinou 
                          ? 'bg-[#FF5F00] text-black shadow-[0_0_8px_rgba(255,95,0,0.4)] border border-[#FF5F00]' 
                          : 'bg-white/[0.02] border border-white/5 text-white/10'
                      }`}>
                        {treinou ? <Dumbbell className="w-3.5 h-3.5 text-black fill-black" strokeWidth={3.5} /> : <Shield className="w-3.5 h-3.5 text-white/10" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Sub-legendas */}
              <div className="flex gap-3 justify-center text-[8px] text-white/30 font-black tracking-wider uppercase font-mono">
                <span>A - Peito</span>
                <span>B - Costas</span>
                <span>R - Repouso</span>
              </div>
            </div>

            {/* Barra de Progresso da Meta */}
            <div className="border-t border-white/5 pt-2.5 space-y-1.5">
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-[#FF5F00] h-full rounded-full shadow-[0_0_5px_rgba(255,95,0,0.5)] transition-all duration-500"
                  style={{ width: `${Math.min(100, (displayCount / 5) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase font-mono text-white/40 tracking-wider">
                <span>Meta Semanal: 5 dias</span>
                <span className="text-[#FF5F00] font-black">
                  {displayCount >= 5 ? 'meta atingida! 🔥' : `Progresso: ${displayCount}/5`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO CARD DO TREINO OTIMIZADO */}
        <div className="px-1.5 shrink-0">
          <div className="bg-[#0c0c0c]/90 border border-white/5 p-3.5 rounded-xl space-y-3 shadow-md">
            <div className="flex justify-between items-center">
              <p className="text-[9px] font-black italic uppercase text-[#FF5F00] tracking-widest leading-none">PRÓXIMA SESSÃO</p>
              <span className="text-[8px] font-mono font-black text-[#FF5F00] uppercase bg-[#FF5F00]/10 border border-[#FF5F00]/25 px-2 py-0.5 rounded leading-none shrink-0">
                {seriesTotais} Séries Totais
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-[950] text-white uppercase italic tracking-tight leading-snug">{workoutTitle}</h4>
              {workoutFocus && (
                <p className="text-[9.53px] text-zinc-400 mt-1 font-semibold italic leading-normal truncate">{workoutFocus}</p>
              )}
            </div>
            
            <div className="flex justify-between items-center text-[8px] text-white/40 pt-2.5 border-t border-white/5 font-sans font-black uppercase tracking-wider leading-none">
              <span>Metodologia Avançada</span>
              <span className="text-[#FF5F00] font-black shrink-0">
                {exercisesCount} Exercícios Compactos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTÃO FLAMEJANTE MASSIVO DE INICIALIZAÇÃO ALINHADO AO LIMITE INFERIOR */}
      <div className="px-1.5 shrink-0 pb-1 mt-auto">
        <button
          onClick={startActiveWorkout}
          className="w-full bg-[#FF5F00] hover:bg-[#ff7722] text-[#050505] font-[950] italic uppercase py-3.5 rounded-xl text-xs shadow-[0_0_20px_rgba(255,95,0,0.3)] active:scale-[0.97] transition-all transform flex justify-center items-center gap-2 tracking-widest cursor-pointer font-sans shrink-0 uppercase"
        >
          <Play className="w-3.5 h-3.5 fill-[#050505] text-[#050505]" /> INICIAR SESSÃO DE TREINO
        </button>
      </div>
      
    </div>
  );
};
