
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initialWorkouts } from './data/workoutData';
import { AppTab, WorkoutRoutine, User, WorkoutHistoryEntry, SetPerformance } from './types';
import { ExerciseItem } from './components/ExerciseItem';
import { 
  Dumbbell, 
  ChevronRight, 
  Bot,
  Settings,
  UserCircle,
  Zap,
  Activity,
  History,
  Calendar,
  CheckCircle2,
  Trash2,
  Trophy,
  Flame,
  Check,
  Scale,
  Ruler,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  Star,
  Quote,
  Target,
  Clock
} from 'lucide-react';

declare var confetti: any;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ user: '', pass: '', remember: false });
  
  const [user, setUser] = useState<User>({
    username: 'Jessica',
    name: 'Jéssica Zanateli',
    age: 36,
    weight: 0,
    height: 0,
    sex: 'feminino',
    goalIMC: 22,
    goal: 'Condicionamento Físico / Retomada',
    streak: 0,
    goalStreak: 20,
    totalWorkouts: 0,
    goalWorkouts: 20,
    checkIns: [],
    avatar: '',
    isProfileComplete: false,
    weights: {},
    history: []
  });

  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutRoutine | null>(null);
  const [currentSessionProgress, setCurrentSessionProgress] = useState<Record<string, SetPerformance[]>>({});

  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  // Carregamento inicial de dados
  useEffect(() => {
    const saved = localStorage.getItem('tatugym_remembered');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLoginData({ user: parsed.user, pass: parsed.pass, remember: true });
    }
    
    const savedUser = localStorage.getItem('tatugym_user_profile');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(prev => ({ ...prev, ...parsedUser }));
      if (parsedUser.isProfileComplete && activeTab === AppTab.ONBOARDING) {
        setActiveTab(AppTab.DASHBOARD);
      }
    }

    // Restaurar treino em andamento
    const activeSession = localStorage.getItem('tatugym_active_session');
    if (activeSession) {
      const parsed = JSON.parse(activeSession);
      const workout = initialWorkouts.find(w => w.id === parsed.workoutId);
      if (workout) {
        setSelectedWorkout(workout);
        setCurrentSessionProgress(parsed.progress);
        setActiveTab(AppTab.WORKOUT);
      }
    }
  }, []);

  // Sincronizar treino em andamento com LocalStorage
  useEffect(() => {
    if (selectedWorkout) {
      localStorage.setItem('tatugym_active_session', JSON.stringify({
        workoutId: selectedWorkout.id,
        progress: currentSessionProgress,
        timestamp: new Date().toISOString()
      }));
    } else {
      localStorage.removeItem('tatugym_active_session');
    }
  }, [selectedWorkout, currentSessionProgress]);

  const triggerConfetti = () => {
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#6366f1', '#fbbf24']
      });
    }
  };

  const handleUpdateProfile = (newData: Partial<User>) => {
    const updated = { ...user, ...newData };
    setUser(updated);
    localStorage.setItem('tatugym_user_profile', JSON.stringify(updated));
  };

  const handleManualCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (user.checkIns.includes(today)) return;
    const newCheckIns = [...user.checkIns, today];
    handleUpdateProfile({ checkIns: newCheckIns });
    triggerConfetti();
  };

  const handleSaveProgress = (exerciseId: string, performance: SetPerformance[]) => {
    setCurrentSessionProgress(prev => ({ ...prev, [exerciseId]: performance }));
  };

  const handleFinishWorkout = () => {
    if (!selectedWorkout) return;
    const today = new Date().toISOString().split('T')[0];
    
    const historyEntry: WorkoutHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      workoutId: selectedWorkout.id,
      workoutTitle: selectedWorkout.title,
      exercises: selectedWorkout.exercises.map(ex => ({
        exerciseId: ex.id,
        name: ex.name,
        performance: currentSessionProgress[ex.id] || []
      }))
    };

    const newWeights: Record<string, number> = { ...(user.weights || {}) };
    
    (Object.entries(currentSessionProgress) as [string, SetPerformance[]][]).forEach(([id, perf]) => {
      const lastWeight = perf.filter(p => p.completed).reverse()[0]?.weight;
      if (lastWeight) newWeights[id] = lastWeight;
    });

    const newCheckIns = user.checkIns.includes(today) ? user.checkIns : [...user.checkIns, today];

    handleUpdateProfile({ 
      history: [historyEntry, ...user.history],
      totalWorkouts: (user.totalWorkouts || 0) + 1,
      weights: newWeights,
      checkIns: newCheckIns
    });

    triggerConfetti();
    localStorage.removeItem('tatugym_active_session');
    setSelectedWorkout(null);
    setCurrentSessionProgress({});
    setActiveTab(AppTab.DASHBOARD);
  };

  const calculateIMC = () => {
    if (!user.weight || !user.height) return { val: '0', targetWeight: 0, goalDiff: 0 };
    const h = user.height > 3 ? user.height / 100 : user.height;
    const imc = user.weight / (h * h);
    const tw = (user.goalIMC || 22) * (h * h);
    return { val: imc.toFixed(1), targetWeight: tw, goalDiff: user.weight - tw };
  };

  const renderDashboard = () => {
    const imcInfo = calculateIMC();
    const isCheckedInToday = user.checkIns?.includes(new Date().toISOString().split('T')[0]);

    return (
      <div className="space-y-6 pb-28 pt-2 animate-slide-up">
        <div className="flex justify-between items-center px-1">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">TATU <span className="text-emerald-500">GYM</span></h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{greeting}, Jéssica!</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-orange-500/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-orange-500/20">
              <Flame size={14} className="text-orange-500 fill-orange-500" />
              <span className="text-orange-500 font-black text-xs">{user.streak || 0}</span>
            </div>
            <button onClick={() => setActiveTab(AppTab.SETTINGS)} className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 active:scale-90 transition-all border border-white/5"><Settings size={18}/></button>
          </div>
        </div>
        
        {/* Card do Atleta */}
        <div className="glass-card p-5 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full"></div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="w-18 h-18 rounded-[1.8rem] p-0.5 bg-gradient-to-tr from-emerald-500 to-indigo-500 shadow-xl">
               <div className="w-full h-full rounded-[1.6rem] bg-zinc-900 flex items-center justify-center text-zinc-600 font-black text-2xl">{user.name.charAt(0)}</div>
             </div>
             <div className="flex-1">
               <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{user.name.split(' ')[0]}</h1>
               <div className="flex items-center gap-2 mt-1">
                 <span className="text-emerald-400 text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10">ATLETA ELITE</span>
                 <span className="text-zinc-500 text-[8px] font-black uppercase tracking-widest">♀️ {user.weight}kg</span>
               </div>
             </div>
             <div className="text-right">
                <div className="text-2xl font-black text-emerald-500 tracking-tighter leading-none">{user.totalWorkouts || 0}</div>
                <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">SESSÕES</div>
             </div>
          </div>
        </div>

        {/* Check-in e Progresso */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-5 rounded-[2.2rem] flex flex-col justify-between">
            <h2 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Star size={10} className="text-yellow-500"/> HOJE</h2>
            <div className="mt-4">
              {isCheckedInToday ? (
                <div className="flex items-center gap-2 text-emerald-500">
                  <Check size={16} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase">TREINADO</span>
                </div>
              ) : (
                <button onClick={handleManualCheckIn} className="w-full bg-emerald-500 text-zinc-900 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95">CHECK-IN</button>
              )}
            </div>
          </div>
          <div className="glass-card p-5 rounded-[2.2rem] flex flex-col justify-between">
            <h2 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Activity size={10} className="text-indigo-500"/> IMC</h2>
            <div className="mt-4">
              <span className="text-xl font-black text-white">{imcInfo.val}</span>
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">MÉDIA</span>
            </div>
          </div>
        </div>

        {/* Lista de Treinos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">ESCOLHER TREINO</h2>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          {initialWorkouts.map((workout) => (
            <div key={workout.id} onClick={() => { setSelectedWorkout(workout); setActiveTab(AppTab.WORKOUT); }} className={`p-5 rounded-[2.2rem] border flex items-center justify-between active:scale-[0.97] transition-all cursor-pointer group shadow-lg ${workout.id === 'fortalecimento' ? 'bg-emerald-500/10 border-emerald-500/20 glow-emerald' : 'glass-card border-white/5'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner ${workout.id === 'fortalecimento' ? 'bg-emerald-500 text-zinc-900' : 'bg-zinc-800 border border-white/5'}`}>
                  {workout.id === 'fortalecimento' ? <Zap size={22} fill="currentColor" /> : workout.title.charAt(7)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight leading-none mb-1">{workout.title}</h3>
                  <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">{workout.exercises.length} EXERCÍCIOS</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWorkoutMode = () => {
    if (!selectedWorkout) return null;
    
    const totalSets = selectedWorkout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const completedSets = (Object.values(currentSessionProgress) as SetPerformance[][]).reduce((acc, perf) => acc + perf.filter(p => p.completed).length, 0);
    const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    return (
      <div className="space-y-4 pb-44 pt-2 animate-slide-up">
        <div className="flex items-center justify-between px-1">
          <button onClick={() => { if(confirm('Sair do treino?')) { setSelectedWorkout(null); setActiveTab(AppTab.DASHBOARD); } }} className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-black uppercase tracking-widest py-2 active:opacity-50"><ChevronLeft size={16}/> ABANDONAR</button>
          <div className="text-right">
             <div className="flex items-center gap-1.5 justify-end">
                <Clock size={10} className="text-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">TREINO SALVO</p>
             </div>
             <p className="text-xs font-black text-white">{progressPercent}% CONCLUÍDO</p>
          </div>
        </div>

        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 mb-4">
           <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="space-y-2">
          {selectedWorkout.exercises.map(ex => (
            <ExerciseItem 
              key={ex.id} 
              exercise={ex} 
              onSaveProgress={handleSaveProgress} 
              savedWeight={user.weights?.[ex.id]} 
              initialPerformance={currentSessionProgress[ex.id]}
            />
          ))}
        </div>

        <div className="fixed bottom-24 left-0 right-0 px-6 max-w-md mx-auto z-40">
          <button 
            onClick={handleFinishWorkout} 
            disabled={completedSets === 0} 
            className={`w-full font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-[0.25em] active:scale-95 flex items-center justify-center gap-4 text-sm transition-all border-b-4 ${
              completedSets > 0 
              ? 'bg-emerald-500 text-zinc-950 border-emerald-600 shadow-emerald-500/20' 
              : 'bg-zinc-800 text-zinc-600 border-zinc-900 opacity-50'
            }`}
          >
            <CheckCircle2 size={24} strokeWidth={3} /> FINALIZAR SESSÃO
          </button>
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-6 pb-28 pt-4 animate-slide-up">
      <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">MEU <span className="text-emerald-500">HISTÓRICO</span></h1>
      {user.history.length === 0 ? (
        <div className="glass-card p-12 rounded-[2.5rem] text-center border border-white/5">
           <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-700 mx-auto mb-4 border border-white/5"><History size={32} /></div>
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Sem registros.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {user.history.map((entry) => (
            <div key={entry.id} className="glass-card p-5 rounded-[2.2rem] space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">{entry.workoutTitle}</h3>
                  <p className="text-zinc-500 text-[9px] font-black uppercase mt-1">
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                   <span className="text-emerald-500 text-[8px] font-black uppercase">SUCESSO</span>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-white/5">
                {entry.exercises.map((ex, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="text-[11px] font-black text-zinc-400 uppercase">{ex.name}</span>
                    <div className="flex flex-wrap gap-1">
                      {ex.performance.map((s, si) => (
                        <span key={si} className="text-[9px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded-md border border-white/5">
                          {si+1}: {s.weight}kg x {s.reps}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAIAssistant = () => (
    <div className="flex flex-col h-[calc(100vh-10rem)] pb-28 pt-4 animate-slide-up">
       <div className="flex items-center gap-3 mb-6 px-1">
          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20"><Bot size={22}/></div>
          <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">TATU <span className="text-indigo-500">AI</span></h1>
       </div>
       <div className="flex-1 overflow-y-auto space-y-4 px-1 scrollbar-hide pb-4">
          {chatMessages.length === 0 && (
             <div className="glass-card border-white/5 rounded-[2.2rem] p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto"><Quote size={20}/></div>
                <p className="text-white font-bold text-sm">Olá Jéssica! O que vamos evoluir hoje?</p>
             </div>
          )}
          {chatMessages.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[1.8rem] text-sm font-bold shadow-xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-white/10'}`}>
                   {msg.text}
                </div>
             </div>
          ))}
       </div>
       <div className="mt-4 flex gap-2 p-1.5 glass-card rounded-[2rem]">
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Tira sua dúvida..." className="flex-1 bg-transparent px-5 py-3 text-sm font-bold text-white outline-none" />
          <button onClick={handleSendMessage} className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"><ChevronRight size={22} /></button>
       </div>
    </div>
  );

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);
    try {
      const { chatWithPersonal } = await import('./services/geminiService');
      const responseText = await chatWithPersonal(chatMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), userMsg);
      setChatMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Erro na conexão." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const renderOnboarding = () => (
    <div className="space-y-8 py-10 animate-slide-up h-full overflow-y-auto no-scrollbar">
      <div className="text-center space-y-3">
        <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-[2.2rem] flex items-center justify-center shadow-2xl mb-6 transform rotate-12 glow-emerald"><Zap size={40} className="text-zinc-900" fill="currentColor" /></div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">TATU <span className="text-emerald-500">GYM</span></h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] px-12 leading-relaxed text-center">BEM-VINDA AO SEU PERSONAL INTELIGENTE.</p>
      </div>
      <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 tracking-widest">Peso Atual (kg)</label>
          <input type="number" inputMode="decimal" step="0.1" value={user.weight || ''} onChange={e => handleUpdateProfile({ weight: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-white font-black text-xl outline-none" placeholder="0.0" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 tracking-widest">Altura (m)</label>
          <input type="number" inputMode="decimal" step="0.01" value={user.height || ''} onChange={e => handleUpdateProfile({ height: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-white font-black text-xl outline-none" placeholder="1.70" />
        </div>
      </div>
      <button onClick={() => { if (!user.weight || !user.height) return alert('Preencha os dados.'); handleUpdateProfile({ isProfileComplete: true }); setActiveTab(AppTab.DASHBOARD); }} className="w-full bg-emerald-500 text-zinc-900 font-black py-6 rounded-[2.2rem] shadow-2xl uppercase tracking-widest active:scale-95 text-sm">FINALIZAR CONFIGURAÇÃO</button>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 pb-28 pt-4 animate-slide-up">
      <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">PERFIL</h1>
      <div className="glass-card p-6 rounded-[2.5rem] space-y-6">
         <div className="flex items-center gap-4">
           <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl">{user.name.charAt(0)}</div>
           <div>
             <h3 className="text-xl font-black text-white">{user.name}</h3>
             <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Atleta Tatu Gym</p>
           </div>
         </div>
         <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">PESO</p>
              <p className="text-sm font-black text-white">{user.weight}kg</p>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">ALTURA</p>
              <p className="text-sm font-black text-white">{user.height}m</p>
            </div>
         </div>
         <button onClick={() => { setIsLoggedIn(false); localStorage.removeItem('tatugym_remembered'); }} className="w-full bg-zinc-900 text-red-500/70 py-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 border border-white/5 flex items-center justify-center gap-2 text-[10px]"><LogOut size={14}/> Sair da Conta</button>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="w-full max-w-sm space-y-8 animate-fade relative z-10">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 transform rotate-6 glow-emerald"><Dumbbell size={42} className="text-zinc-900" /></div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic">TATU<span className="text-emerald-500">GYM</span></h1>
            <p className="text-zinc-600 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Personal Inteligente</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (loginData.user.trim().toLowerCase() === 'jessica' && loginData.pass === '9860') { setIsLoggedIn(true); if (loginData.remember) localStorage.setItem('tatugym_remembered', JSON.stringify(loginData)); } else alert('Dados incorretos.'); }} className="space-y-4">
            <input type="text" value={loginData.user} onChange={e => setLoginData({...loginData, user: e.target.value})} className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-6 text-white text-center font-bold outline-none focus:border-emerald-500/50" placeholder="Usuário" />
            <input type="password" value={loginData.pass} onChange={e => setLoginData({...loginData, pass: e.target.value})} className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-6 text-white text-center font-bold outline-none focus:border-emerald-500/50" placeholder="Senha" />
            <button className="w-full bg-white text-zinc-950 font-black py-6 rounded-3xl shadow-2xl uppercase tracking-widest active:scale-95 text-sm">ENTRAR NO APP</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative px-5 pt-8 overflow-x-hidden no-scrollbar">
      <main>
        {activeTab === AppTab.ONBOARDING ? renderOnboarding() : (
          activeTab === AppTab.DASHBOARD ? renderDashboard() : 
          (activeTab === AppTab.WORKOUT && selectedWorkout) ? renderWorkoutMode() : 
          activeTab === AppTab.HISTORY ? renderHistory() : 
          activeTab === AppTab.AI_ASSISTANT ? renderAIAssistant() :
          activeTab === AppTab.SETTINGS ? renderSettings() : null
        )}
      </main>

      {activeTab !== AppTab.ONBOARDING && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[22rem] bg-zinc-900/80 backdrop-blur-2xl border border-white/10 p-2 rounded-[3.5rem] flex items-center justify-between shadow-2xl z-50">
          <button onClick={() => { setActiveTab(AppTab.DASHBOARD); }} className={`p-4 rounded-full transition-all active:scale-90 ${activeTab === AppTab.DASHBOARD || activeTab === AppTab.WORKOUT ? 'bg-emerald-500 text-zinc-950 scale-110 shadow-lg shadow-emerald-500/20' : 'text-zinc-600'}`}><Dumbbell size={22} /></button>
          <button onClick={() => { setActiveTab(AppTab.HISTORY); }} className={`p-4 rounded-full transition-all active:scale-90 ${activeTab === AppTab.HISTORY ? 'bg-emerald-500 text-zinc-950 scale-110 shadow-lg shadow-emerald-500/20' : 'text-zinc-600'}`}><History size={22} /></button>
          <button onClick={() => { setActiveTab(AppTab.AI_ASSISTANT); }} className={`p-4 rounded-full transition-all active:scale-90 ${activeTab === AppTab.AI_ASSISTANT ? 'bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/20' : 'text-zinc-600'}`}><Bot size={22} /></button>
          <button onClick={() => { setActiveTab(AppTab.SETTINGS); }} className={`p-4 rounded-full transition-all active:scale-90 ${activeTab === AppTab.SETTINGS ? 'bg-emerald-500 text-zinc-950 scale-110 shadow-lg shadow-emerald-500/20' : 'text-zinc-600'}`}><UserIcon size={22} /></button>
        </nav>
      )}
    </div>
  );
};

export default App;
