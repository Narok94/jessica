
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { jessicaWorkouts, henriqueWorkouts } from './data/workoutData';
import { AppTab, WorkoutRoutine, User, WorkoutHistoryEntry, SetPerformance } from './types';
import { ExerciseItem } from './components/ExerciseItem';
import { 
  Dumbbell, 
  ChevronRight, 
  Bot,
  Settings,
  Zap,
  Activity,
  History,
  CheckCircle2,
  Flame,
  Check,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  Star,
  Quote,
  Clock,
  TrendingUp,
  Award,
  // Fixed: Added Calendar to the imports from lucide-react
  Calendar
} from 'lucide-react';

declare var confetti: any;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ user: '', pass: '', remember: false });
  
  const [user, setUser] = useState<User | null>(null);

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

  const initialWorkouts = useMemo(() => {
    if (!user) return [];
    const name = user.username.toLowerCase();
    if (name === 'henrique') return henriqueWorkouts;
    if (name === 'jessica') return jessicaWorkouts;
    return [];
  }, [user]);

  useEffect(() => {
    const saved = localStorage.getItem('tatugym_remembered');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLoginData({ user: parsed.user, pass: parsed.pass, remember: true });
      handleLogin(parsed.user, parsed.pass, false);
    }
  }, []);

  useEffect(() => {
    if (user && selectedWorkout) {
      localStorage.setItem(`tatugym_active_session_${user.username}`, JSON.stringify({
        workoutId: selectedWorkout.id,
        progress: currentSessionProgress,
        timestamp: new Date().toISOString()
      }));
    } else if (user) {
      localStorage.removeItem(`tatugym_active_session_${user.username}`);
    }
  }, [selectedWorkout, currentSessionProgress, user]);

  const handleLogin = (usernameInput: string, passwordInput: string, manual: boolean) => {
    const u = usernameInput.trim().toLowerCase();
    if ((u === 'jessica' || u === 'henrique') && passwordInput === '9860') {
      const storageKey = `tatugym_user_profile_${u}`;
      const savedUser = localStorage.getItem(storageKey);
      let userData: User;
      if (savedUser) {
        userData = JSON.parse(savedUser);
      } else {
        userData = {
          username: u.charAt(0).toUpperCase() + u.slice(1),
          name: u.charAt(0).toUpperCase() + u.slice(1),
          weight: 0,
          height: 0,
          sex: u === 'henrique' ? 'masculino' : 'feminino',
          streak: 0,
          totalWorkouts: 0,
          checkIns: [],
          isProfileComplete: false,
          weights: {},
          history: []
        };
      }
      setUser(userData);
      setIsLoggedIn(true);
      const activeSession = localStorage.getItem(`tatugym_active_session_${userData.username}`);
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        const workoutsSet = u === 'henrique' ? henriqueWorkouts : jessicaWorkouts;
        const workout = workoutsSet.find(w => w.id === parsed.workoutId);
        if (workout) {
          setSelectedWorkout(workout);
          setCurrentSessionProgress(parsed.progress);
          setActiveTab(AppTab.WORKOUT);
        }
      } else {
        setActiveTab(userData.isProfileComplete ? AppTab.DASHBOARD : AppTab.ONBOARDING);
      }
      if (manual && loginData.remember) {
        localStorage.setItem('tatugym_remembered', JSON.stringify({ user: usernameInput, pass: passwordInput }));
      }
    } else if (manual) {
      alert('Dados incorretos.');
    }
  };

  const triggerConfetti = () => {
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#6366f1', '#fbbf24']
      });
    }
  };

  const handleUpdateProfile = (newData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...newData };
    setUser(updated);
    localStorage.setItem(`tatugym_user_profile_${user.username.toLowerCase()}`, JSON.stringify(updated));
  };

  const handleManualCheckIn = () => {
    if (!user) return;
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
    if (!selectedWorkout || !user) return;
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
      checkIns: newCheckIns,
      streak: user.streak + 1
    });
    triggerConfetti();
    localStorage.removeItem(`tatugym_active_session_${user.username}`);
    setSelectedWorkout(null);
    setCurrentSessionProgress({});
    setActiveTab(AppTab.DASHBOARD);
  };

  const calculateIMC = () => {
    if (!user || !user.weight || !user.height) return { val: '0', status: 'N/A' };
    const h = user.height > 3 ? user.height / 100 : user.height;
    const imc = user.weight / (h * h);
    let status = 'Normal';
    if (imc < 18.5) status = 'Baixo';
    else if (imc > 25 && imc < 30) status = 'Sobrepeso';
    else if (imc >= 30) status = 'Obeso';
    return { val: imc.toFixed(1), status };
  };

  const renderDashboard = () => {
    if (!user) return null;
    const imcInfo = calculateIMC();
    const today = new Date().toISOString().split('T')[0];
    const isCheckedInToday = user.checkIns?.includes(today);

    // Lógica simples para barra semanal
    const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const currentDay = new Date().getDay();
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - currentDay);
    
    const weekActivity = weekDays.map((label, idx) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + idx);
        const iso = d.toISOString().split('T')[0];
        return { label, active: user.checkIns?.includes(iso), today: iso === today };
    });

    return (
      <div className="space-y-6 pb-28 pt-2 animate-slide-up">
        {/* Header Superior */}
        <div className="flex justify-between items-center px-1">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">TATU <span className="text-emerald-500">GYM</span></h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{greeting}, {user.name}!</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-orange-500/10 px-4 py-2 rounded-2xl flex items-center gap-2 border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <Flame size={16} className="text-orange-500 fill-orange-500" />
                <span className="text-orange-500 font-black text-sm">{user.streak || 0}</span>
             </div>
             <button onClick={() => setActiveTab(AppTab.SETTINGS)} className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 border border-white/5"><Settings size={20}/></button>
          </div>
        </div>
        
        {/* Card do Atleta Pro */}
        <div className="glass-card p-6 rounded-[3rem] border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[80px] rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex items-center gap-5 relative z-10">
             <div className="relative">
               <div className="w-20 h-20 rounded-[2.2rem] p-1 bg-gradient-to-tr from-emerald-500 to-indigo-500 shadow-xl">
                 <div className="w-full h-full rounded-[1.8rem] bg-zinc-900 flex items-center justify-center text-white font-black text-3xl">{user.name.charAt(0)}</div>
               </div>
               <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-zinc-900 flex items-center justify-center">
                  <Award size={12} className="text-zinc-900" />
               </div>
             </div>
             <div className="flex-1">
               <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-1">{user.name}</h1>
               <div className="flex flex-wrap items-center gap-2">
                 <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">NÍVEL ELITE</span>
                 <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{user.weight} KG</span>
               </div>
             </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5">
             <div className="text-center">
                <div className="text-xl font-black text-white leading-none">{user.totalWorkouts || 0}</div>
                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">TREINOS</div>
             </div>
             <div className="text-center border-x border-white/5">
                <div className="text-xl font-black text-emerald-500 leading-none">{imcInfo.val}</div>
                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">IMC</div>
             </div>
             <div className="text-center">
                <div className="text-xl font-black text-indigo-500 leading-none">{user.history?.length || 0}</div>
                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">RECORDS</div>
             </div>
          </div>
        </div>

        {/* Atividade Semanal */}
        <div className="glass-card p-6 rounded-[2.5rem] space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2"><Calendar size={12}/> FREQUÊNCIA SEMANAL</h2>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">OBJETIVO: 6/7</span>
           </div>
           <div className="flex justify-between items-center px-2">
              {weekActivity.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                   <div className={`w-9 h-12 rounded-xl flex items-center justify-center transition-all ${
                     day.active 
                     ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' 
                     : day.today ? 'bg-zinc-800 text-white border border-emerald-500/30 ring-2 ring-emerald-500/10' : 'bg-zinc-900 text-zinc-600 border border-white/5'
                   }`}>
                      <span className="text-xs font-black">{day.label}</span>
                   </div>
                   {day.active && <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>}
                </div>
              ))}
           </div>
        </div>

        {/* Quick Action / Check-in */}
        {!isCheckedInToday && (
           <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 p-[2px] rounded-[2rem] shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform">
              <button 
                onClick={handleManualCheckIn}
                className="w-full bg-zinc-950 rounded-[1.9rem] py-5 flex items-center justify-center gap-3"
              >
                <Zap size={20} className="text-emerald-500" fill="currentColor" />
                <span className="text-sm font-black text-white uppercase tracking-[0.2em]">CHECK-IN HOJE</span>
              </button>
           </div>
        )}

        {/* Lista de Treinos Otimizada */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">PRÓXIMAS SESSÕES</h2>
            <TrendingUp size={16} className="text-zinc-700" />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {initialWorkouts.map((workout) => (
              <div 
                key={workout.id} 
                onClick={() => { setSelectedWorkout(workout); setActiveTab(AppTab.WORKOUT); }} 
                className="glass-card p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group hover:bg-zinc-800/80"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-zinc-950 font-black text-2xl shadow-xl bg-emerald-500 group-hover:scale-110 transition-transform`}>
                    {workout.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight leading-none mb-1.5">{workout.title}</h3>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{workout.exercises.length} EXERCÍCIOS</span>
                        <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">~45 MIN</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                    <ChevronRight size={20} strokeWidth={3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWorkoutMode = () => {
    if (!selectedWorkout || !user) return null;
    const totalSets = selectedWorkout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const completedSets = (Object.values(currentSessionProgress) as SetPerformance[][]).reduce((acc, perf) => acc + perf.filter(p => p.completed).length, 0);
    const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    return (
      <div className="space-y-4 pb-44 pt-2 animate-slide-up">
        <div className="flex items-center justify-between px-1">
          <button onClick={() => { if(confirm('Sair do treino?')) { setSelectedWorkout(null); setActiveTab(AppTab.DASHBOARD); } }} className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest py-3 active:opacity-50"><ChevronLeft size={18}/> CANCELAR</button>
          <div className="text-right">
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 justify-end">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div> SESSÃO ATIVA
             </p>
             <p className="text-xs font-black text-white mt-0.5">{progressPercent}% CONCLUÍDO</p>
          </div>
        </div>

        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 mb-6">
           <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
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
            className={`w-full font-black py-7 rounded-[2.8rem] shadow-2xl uppercase tracking-[0.3em] active:scale-95 flex items-center justify-center gap-4 text-sm transition-all border-b-4 ${
              completedSets > 0 
              ? 'bg-emerald-500 text-zinc-950 border-emerald-700 shadow-emerald-500/30' 
              : 'bg-zinc-800 text-zinc-600 border-zinc-900 opacity-50 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 size={24} strokeWidth={4} /> FINALIZAR TREINO
          </button>
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    if (!user) return null;
    return (
      <div className="space-y-6 pb-28 pt-4 animate-slide-up">
        <div className="flex items-center justify-between px-1">
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">MEU <span className="text-emerald-500">HISTÓRICO</span></h1>
            <div className="bg-zinc-900 p-2 rounded-xl text-zinc-500"><Activity size={20}/></div>
        </div>
        
        {user.history.length === 0 ? (
          <div className="glass-card p-16 rounded-[3rem] text-center border border-white/5">
             <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-zinc-800 mx-auto mb-6"><History size={40} /></div>
             <p className="text-zinc-500 text-xs font-black uppercase tracking-widest leading-relaxed">Nenhum treino registrado.<br/>Comece sua jornada hoje!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {user.history.map((entry) => (
              <div key={entry.id} className="glass-card p-6 rounded-[2.5rem] space-y-5 border-l-4 border-l-emerald-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{entry.workoutTitle}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-zinc-600" />
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">
                        {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                  </div>
                  <div className="bg-emerald-500 text-zinc-950 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20">
                     COMPLETE
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-white/5">
                  {entry.exercises.map((ex, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-zinc-300 uppercase truncate pr-4">{ex.name}</span>
                        <span className="text-[9px] font-black text-zinc-600 uppercase whitespace-nowrap">{ex.performance.length} SÉRIES</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ex.performance.map((s, si) => (
                          <div key={si} className="text-[9px] font-bold bg-zinc-900 text-white px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1">
                             <span className="text-emerald-500">{si+1}</span>
                             <span>{s.weight}kg × {s.reps}</span>
                          </div>
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
  };

  const renderAIAssistant = () => (
    <div className="flex flex-col h-[calc(100vh-12rem)] pb-28 pt-4 animate-slide-up">
       <div className="flex items-center gap-4 mb-8 px-1">
          <div className="w-14 h-14 bg-indigo-500 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40"><Bot size={32}/></div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">TATU <span className="text-indigo-500">AI</span></h1>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">PERSONAL TRAINER INTELIGENTE</span>
          </div>
       </div>
       <div className="flex-1 overflow-y-auto space-y-5 px-1 scrollbar-hide pb-6">
          {chatMessages.length === 0 && (
             <div className="glass-card border-white/5 rounded-[3rem] p-10 text-center space-y-5">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto border border-indigo-500/20"><Quote size={28}/></div>
                <div>
                    <p className="text-white font-black text-lg">Olá {user?.name}!</p>
                    <p className="text-zinc-500 text-sm font-medium mt-2 leading-relaxed">Qual é o foco de hoje? Posso ajustar seu volume de treino ou tirar dúvidas técnicas.</p>
                </div>
             </div>
          )}
          {chatMessages.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[2.2rem] text-sm font-bold shadow-2xl leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-white/10'}`}>
                   {msg.text}
                </div>
             </div>
          ))}
          {isChatLoading && (
              <div className="flex justify-start">
                  <div className="bg-zinc-900 p-5 rounded-[2.2rem] rounded-tl-none border border-white/10">
                      <div className="flex gap-1">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                  </div>
              </div>
          )}
       </div>
       <div className="mt-4 flex gap-3 p-2 glass-card rounded-[2.5rem] border-white/10">
          <input 
            value={chatInput} 
            onChange={e => setChatInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
            placeholder="Dúvida técnica ou motivação..." 
            className="flex-1 bg-transparent px-6 py-4 text-sm font-bold text-white outline-none placeholder:text-zinc-700" 
          />
          <button 
            onClick={handleSendMessage} 
            disabled={isChatLoading || !chatInput.trim()}
            className="w-14 h-14 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all disabled:opacity-50"
          >
            <ChevronRight size={28} strokeWidth={3} />
          </button>
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
      setChatMessages(prev => [...prev, { role: 'model', text: "Conexão interrompida. Tente novamente." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const renderOnboarding = () => (
    <div className="space-y-10 py-10 animate-slide-up h-full overflow-y-auto no-scrollbar">
      <div className="text-center space-y-4">
        <div className="mx-auto w-24 h-24 bg-emerald-500 rounded-[3rem] flex items-center justify-center shadow-2xl mb-8 transform rotate-12 glow-emerald"><Zap size={48} className="text-zinc-950" fill="currentColor" /></div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">BEM-VINDO AO <span className="text-emerald-500">PRO</span></h1>
        <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.3em] px-14 leading-relaxed">VAMOS CONFIGURAR SEU PERFIL PARA RESULTADOS DE ELITE.</p>
      </div>
      <div className="glass-card p-10 rounded-[3.5rem] space-y-8 border-white/10">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-4 tracking-[0.2em]">PESO ATUAL (KG)</label>
          <input type="number" inputMode="decimal" step="0.1" value={user?.weight || ''} onChange={e => handleUpdateProfile({ weight: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900 border border-white/5 rounded-[2rem] p-7 text-white font-black text-2xl outline-none focus:border-emerald-500/50 transition-colors" placeholder="0.0" />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-4 tracking-[0.2em]">ALTURA (M)</label>
          <input type="number" inputMode="decimal" step="0.01" value={user?.height || ''} onChange={e => handleUpdateProfile({ height: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900 border border-white/5 rounded-[2rem] p-7 text-white font-black text-2xl outline-none focus:border-emerald-500/50 transition-colors" placeholder="1.70" />
        </div>
      </div>
      <button onClick={() => { if (!user?.weight || !user?.height) return alert('Diga-nos seu peso e altura para começar.'); handleUpdateProfile({ isProfileComplete: true }); setActiveTab(AppTab.DASHBOARD); }} className="w-full bg-white text-zinc-950 font-black py-7 rounded-[2.5rem] shadow-2xl uppercase tracking-[0.4em] active:scale-95 text-sm transition-transform">INICIAR JORNADA</button>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 pb-28 pt-4 animate-slide-up">
      <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">PERFIL</h1>
      <div className="glass-card p-8 rounded-[3rem] space-y-8 border-white/10">
         <div className="flex items-center gap-6">
           <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-zinc-900">{user?.name.charAt(0)}</div>
           <div>
             <h3 className="text-2xl font-black text-white uppercase tracking-tight">{user?.name}</h3>
             <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">ATLETA PREMIUM</span>
           </div>
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/80 p-6 rounded-[1.8rem] border border-white/5">
              <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-widest">PESO MÉDIO</p>
              <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black text-white">{user?.weight}</p>
                  <span className="text-[10px] font-bold text-zinc-500">KG</span>
              </div>
            </div>
            <div className="bg-zinc-900/80 p-6 rounded-[1.8rem] border border-white/5">
              <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-widest">ESTATURA</p>
              <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black text-white">{user?.height}</p>
                  <span className="text-[10px] font-bold text-zinc-500">M</span>
              </div>
            </div>
         </div>
         <div className="pt-4 space-y-3">
             <button className="w-full bg-zinc-900/50 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/5 text-zinc-400">Editar Dados Antropométricos</button>
             <button onClick={() => { setIsLoggedIn(false); setUser(null); }} className="w-full bg-zinc-900/50 text-red-500/80 py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] active:scale-95 border border-red-500/10 flex items-center justify-center gap-3 text-[11px]"><LogOut size={16}/> DESCONECTAR</button>
         </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 relative">
        <div className="w-full max-w-sm space-y-12 animate-fade relative z-10">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-emerald-500 rounded-[3rem] flex items-center justify-center shadow-2xl mb-10 transform rotate-6 glow-emerald transition-transform hover:scale-110 duration-500"><Dumbbell size={48} className="text-zinc-950" strokeWidth={3} /></div>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none italic">TATU<span className="text-emerald-500">GYM</span></h1>
            <p className="text-zinc-600 text-[11px] font-black uppercase tracking-[0.5em] mt-4">Personal Intelligence Pro</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(loginData.user, loginData.pass, true); }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-6">ACESSO ATLETA</label>
              <input type="text" value={loginData.user} onChange={e => setLoginData({...loginData, user: e.target.value})} className="w-full bg-zinc-900/80 border border-white/5 rounded-[2.2rem] p-7 text-white text-center font-black text-lg outline-none focus:border-emerald-500/50 transition-all" placeholder="" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-6">CÓDIGO SEGURANÇA</label>
              <input type="password" value={loginData.pass} onChange={e => setLoginData({...loginData, pass: e.target.value})} className="w-full bg-zinc-900/80 border border-white/5 rounded-[2.2rem] p-7 text-white text-center font-black text-lg outline-none focus:border-emerald-500/50 transition-all" placeholder="" />
            </div>
            <div className="flex items-center gap-3 px-6 py-2">
              <input type="checkbox" id="remember" checked={loginData.remember} onChange={e => setLoginData({...loginData, remember: e.target.checked})} className="w-5 h-5 rounded-lg bg-zinc-900 border-white/10 accent-emerald-500" />
              <label htmlFor="remember" className="text-[11px] font-black text-zinc-500 uppercase tracking-widest cursor-pointer select-none">Manter sessão ativa</label>
            </div>
            <button className="w-full bg-white text-zinc-950 font-black py-7 rounded-[2.5rem] shadow-2xl uppercase tracking-[0.4em] active:scale-95 text-sm transition-transform hover:bg-emerald-500 duration-300">ENTRAR NO ECOSSISTEMA</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative px-6 pt-10 overflow-x-hidden no-scrollbar">
      <main className="animate-fade">
        {activeTab === AppTab.ONBOARDING ? renderOnboarding() : (
          activeTab === AppTab.DASHBOARD ? renderDashboard() : 
          (activeTab === AppTab.WORKOUT && selectedWorkout) ? renderWorkoutMode() : 
          activeTab === AppTab.HISTORY ? renderHistory() : 
          activeTab === AppTab.AI_ASSISTANT ? renderAIAssistant() :
          activeTab === AppTab.SETTINGS ? renderSettings() : null
        )}
      </main>

      {activeTab !== AppTab.ONBOARDING && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[24rem] bg-zinc-950/90 backdrop-blur-3xl border border-white/10 p-3 rounded-[3.5rem] flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
          <button onClick={() => { setActiveTab(AppTab.DASHBOARD); setSelectedWorkout(null); }} className={`p-4 rounded-[2rem] transition-all active:scale-90 ${activeTab === AppTab.DASHBOARD || activeTab === AppTab.WORKOUT ? 'bg-emerald-500 text-zinc-950 scale-110 shadow-lg shadow-emerald-500/30' : 'text-zinc-600'}`}><Dumbbell size={24} strokeWidth={3} /></button>
          <button onClick={() => { setActiveTab(AppTab.HISTORY); setSelectedWorkout(null); }} className={`p-4 rounded-[2rem] transition-all active:scale-90 ${activeTab === AppTab.HISTORY ? 'bg-emerald-500 text-zinc-950 scale-110 shadow-lg shadow-emerald-500/30' : 'text-zinc-600'}`}><History size={24} strokeWidth={3} /></button>
          <button onClick={() => { setActiveTab(AppTab.AI_ASSISTANT); setSelectedWorkout(null); }} className={`p-4 rounded-[2rem] transition-all active:scale-90 ${activeTab === AppTab.AI_ASSISTANT ? 'bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/40' : 'text-zinc-600'}`}><Bot size={24} strokeWidth={3} /></button>
          <button onClick={() => { setActiveTab(AppTab.SETTINGS); setSelectedWorkout(null); }} className={`p-4 rounded-[2rem] transition-all active:scale-90 ${activeTab === AppTab.SETTINGS ? 'bg-emerald-500 text-zinc-950 scale-110 shadow-lg shadow-emerald-500/30' : 'text-zinc-600'}`}><UserIcon size={24} strokeWidth={3} /></button>
        </nav>
      )}
    </div>
  );
};

export default App;
