
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initialWorkouts } from './data/workoutData';
import { AppTab, WorkoutRoutine, User, WorkoutHistoryEntry } from './types';
import { ExerciseItem } from './components/ExerciseItem';
import { 
  Dumbbell, 
  ChevronRight, 
  Bot,
  ArrowLeft,
  Settings,
  UserCircle,
  Camera,
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
  UserCheck
} from 'lucide-react';

// Declarar a função de confete globalmente (injecão via CDN)
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
  const [currentSessionProgress, setCurrentSessionProgress] = useState<Record<string, { weight: number, setsCompleted: number }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Saudação baseada na hora
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('tatugym_remembered');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLoginData({ user: parsed.user, pass: parsed.pass, remember: true });
    }
    
    const savedUser = localStorage.getItem('tatugym_user_profile');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (!parsedUser.history) parsedUser.history = [];
      if (!parsedUser.checkIns) parsedUser.checkIns = [];
      if (!parsedUser.goalIMC) parsedUser.goalIMC = 22;
      if (!parsedUser.sex) parsedUser.sex = 'feminino';
      setUser(parsedUser);
      if (parsedUser.isProfileComplete && activeTab === AppTab.ONBOARDING) {
        setActiveTab(AppTab.DASHBOARD);
      }
    }
  }, []);

  const triggerConfetti = () => {
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b']
      });
    }
  };

  const calculateStreak = (checkIns: string[]) => {
    if (!checkIns || checkIns.length === 0) return 0;
    const sortedDates = [...new Set(checkIns)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;

    let currentStreak = 0;
    let expectedDate = sortedDates[0];
    for (let i = 0; i < sortedDates.length; i++) {
      if (sortedDates[i] === expectedDate) {
        currentStreak++;
        const d = new Date(expectedDate + 'T12:00:00');
        d.setDate(d.getDate() - 1);
        expectedDate = d.toISOString().split('T')[0];
      } else break;
    }
    return currentStreak;
  };

  const handleUpdateProfile = (newData: Partial<User>) => {
    const updated = { ...user, ...newData };
    setUser(updated);
    localStorage.setItem('tatugym_user_profile', JSON.stringify(updated));
  };

  const calculateIMC = () => {
    if (!user.weight || !user.height || user.height <= 0) return { val: 0, status: '...', color: 'text-zinc-500', goalDiff: 0, targetWeight: 0 };
    const heightInMeters = user.height > 3 ? user.height / 100 : user.height;
    const imc = user.weight / (heightInMeters * heightInMeters);
    
    // Peso para atingir a meta
    const targetWeight = (user.goalIMC || 22) * (heightInMeters * heightInMeters);
    const goalDiff = user.weight - targetWeight;

    let status = '', color = '';
    if (imc < 18.5) { status = 'Abaixo do Peso'; color = 'text-blue-400'; }
    else if (imc < 25) { status = 'Peso Ideal'; color = 'text-emerald-500'; }
    else if (imc < 30) { status = 'Sobrepeso'; color = 'text-yellow-500'; }
    else if (imc < 35) { status = 'Obesidade I'; color = 'text-orange-500'; }
    else if (imc < 40) { status = 'Obesidade II'; color = 'text-red-400'; }
    else { status = 'Obesidade III'; color = 'text-red-600'; }
    return { val: imc.toFixed(1), status, color, goalDiff, targetWeight };
  };

  const handleManualCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (user.checkIns.includes(today)) return;
    const newCheckIns = [...user.checkIns, today];
    const newStreak = calculateStreak(newCheckIns);
    handleUpdateProfile({ checkIns: newCheckIns, streak: newStreak });
    triggerConfetti();
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const handleSaveProgress = (exerciseId: string, weight: number, setsCompleted: number) => {
    setCurrentSessionProgress(prev => ({ ...prev, [exerciseId]: { weight, setsCompleted } }));
  };

  const handleFinishWorkout = () => {
    if (!selectedWorkout) return;
    const today = new Date().toISOString().split('T')[0];
    const historyEntry: WorkoutHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      workoutId: selectedWorkout.id,
      workoutTitle: selectedWorkout.title,
      exercises: selectedWorkout.exercises.map(ex => {
        const progress = currentSessionProgress[ex.id] || { weight: 0, setsCompleted: 0 };
        return { exerciseId: ex.id, name: ex.name, setsCompleted: progress.setsCompleted, totalSets: ex.sets, weight: progress.weight };
      })
    };

    const newWeights: Record<string, number> = { ...(user.weights || {}) };
    Object.entries(currentSessionProgress).forEach(([id, data]) => {
      const progress = data as { weight: number; setsCompleted: number };
      if (progress.weight > 0) newWeights[id] = progress.weight;
    });

    const newCheckIns = user.checkIns.includes(today) ? user.checkIns : [...user.checkIns, today];
    const newStreak = calculateStreak(newCheckIns);

    handleUpdateProfile({ 
      history: [historyEntry, ...user.history],
      totalWorkouts: (user.totalWorkouts || 0) + 1,
      weights: newWeights,
      checkIns: newCheckIns,
      streak: newStreak
    });

    triggerConfetti();
    setSelectedWorkout(null);
    setCurrentSessionProgress({});
    setActiveTab(AppTab.DASHBOARD);
    if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const { chatWithPersonal } = await import('./services/geminiService');
      const history = chatMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const responseText = await chatWithPersonal(history, userMsg);
      setChatMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Erro na conexão. Tenta de novo?" }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const renderDashboard = () => {
    const today = new Date().toISOString().split('T')[0];
    const isCheckedInToday = user.checkIns?.includes(today);
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      return { label: d.toLocaleDateString('pt-BR', { weekday: 'narrow' }), checked: user.checkIns?.includes(dateStr) };
    });

    const imcInfo = calculateIMC();

    return (
      <div className="space-y-6 pb-28 pt-2 animate-slide-up">
        <div className="flex justify-between items-center px-1">
          <div>
            <h1 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">TATU <span className="text-emerald-500">GYM</span></h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{greeting}, Jéssica! 👋</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-orange-500/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-orange-500/20 shadow-lg shadow-orange-500/5">
              <Flame size={14} className="text-orange-500 fill-orange-500" />
              <span className="text-orange-500 font-black text-xs">{user.streak || 0}</span>
            </div>
            <button onClick={() => setActiveTab(AppTab.SETTINGS)} className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 active:scale-90 transition-all border border-white/5"><Settings size={18}/></button>
          </div>
        </div>
        
        <div className="glass-card p-5 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full"></div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="w-18 h-18 rounded-[1.8rem] p-0.5 bg-gradient-to-tr from-emerald-500 to-indigo-500 shadow-xl">
               {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-[1.6rem] object-cover border-4 border-zinc-900" /> : <div className="w-full h-full rounded-[1.6rem] bg-zinc-900 flex items-center justify-center text-zinc-600"><UserCircle size={32} /></div>}
             </div>
             <div className="flex-1">
               <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{user.name || 'JÉSSICA'}</h1>
               <div className="flex items-center gap-2 mt-1">
                 <span className="text-emerald-400 text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10">ATLETA PRO</span>
                 <span className="text-zinc-500 text-[8px] font-black uppercase tracking-widest">{user.sex === 'masculino' ? '♂️ MASC' : '♀️ FEM'}</span>
               </div>
             </div>
             <div className="text-right">
                <div className="text-2xl font-black text-emerald-500 tracking-tighter leading-none">{user.totalWorkouts || 0}</div>
                <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">SESSÕES</div>
             </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-[2.2rem] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Star size={10} className="text-yellow-500"/> FOCO SEMANAL</h2>
            {isCheckedInToday ? <span className="text-[9px] font-black text-emerald-500 flex items-center gap-1 uppercase tracking-widest"><Check size={12} strokeWidth={3} /> CHECK-IN OK</span> : <button onClick={handleManualCheckIn} className="bg-emerald-500 text-zinc-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95">CONCLUIR AGORA</button>}
          </div>
          <div className="flex justify-between px-1">
            {last7Days.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-600">{day.label}</span>
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center border transition-all duration-500 ${day.checked ? 'bg-emerald-500 border-emerald-400 text-zinc-900 shadow-xl shadow-emerald-500/20 rotate-0' : 'bg-zinc-800/40 border-white/5 text-zinc-700'}`}>{day.checked ? <Check size={14} strokeWidth={4} /> : null}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div className="glass-card p-5 rounded-[2rem] border border-white/5 bg-gradient-to-b from-zinc-900/50 to-transparent">
              <Trophy className="text-emerald-500 mb-2" size={20} />
              <div className="text-xl font-black text-white">{Math.min(100, Math.round(((user.streak || 0) / (user.goalStreak || 20)) * 100))}%</div>
              <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">CONSTÂNCIA</div>
           </div>
           <div className="glass-card p-5 rounded-[2rem] border border-white/5 bg-gradient-to-b from-zinc-900/50 to-transparent" onClick={() => setActiveTab(AppTab.SETTINGS)}>
              <Activity className="text-indigo-500 mb-2" size={20} />
              <div className="text-xl font-black text-white">{imcInfo.val}</div>
              <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">IMC ATUAL</div>
           </div>
        </div>

        {/* Card de Meta de IMC */}
        <div className="glass-card p-5 rounded-[2.2rem] border border-white/5 space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Target size={12} className="text-emerald-500"/> META DE SHAPE</h2>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">PESO ALVO: {imcInfo.targetWeight.toFixed(1)}KG</span>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-black text-white">IMC {imcInfo.val} → {user.goalIMC}</span>
                <span className={`text-[10px] font-bold ${imcInfo.goalDiff > 0 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                   {imcInfo.goalDiff > 0 ? `Faltam ${imcInfo.goalDiff.toFixed(1)}kg` : 'Meta atingida!'}
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full border border-white/5 overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (1 - Math.abs(imcInfo.goalDiff / 20)) * 100)}%` }}></div>
              </div>
           </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">PLANO DE TREINO</h2>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">5 TREINOS</span>
          </div>
          {initialWorkouts.map((workout) => (
            <div key={workout.id} onClick={() => { setSelectedWorkout(workout); setActiveTab(AppTab.WORKOUT); }} className={`p-5 rounded-[2.2rem] border flex items-center justify-between active:scale-[0.97] transition-all cursor-pointer group shadow-lg ${workout.id === 'fortalecimento' ? 'bg-emerald-500/10 border-emerald-500/20 glow-emerald' : 'glass-card border-white/5'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner transition-transform group-hover:scale-110 ${workout.id === 'fortalecimento' ? 'bg-emerald-500 text-zinc-900' : 'bg-zinc-800 border border-white/5'}`}>
                  {workout.id === 'fortalecimento' ? <Zap size={22} fill="currentColor" /> : workout.title.split(' ')[1]}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight leading-none mb-1">{workout.title}</h3>
                  <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">{workout.exercises.length} EXERCÍCIOS • {workout.description.split(' ')[0]}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-zinc-900 transition-all">
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    const { val, status, color, targetWeight } = calculateIMC();
    return (
      <div className="space-y-6 pb-28 pt-2 animate-slide-up">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 active:scale-90 border border-white/5"><ChevronLeft size={18}/></button>
          <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">CONFIGURAÇÕES</h1>
        </div>

        <div className="glass-card p-6 rounded-[2.5rem] border border-white/5 space-y-6">
           <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Meta de IMC Desejada</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="18" 
                  max="30" 
                  step="0.5" 
                  value={user.goalIMC} 
                  onChange={e => handleUpdateProfile({ goalIMC: parseFloat(e.target.value) })}
                  className="flex-1 h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-emerald-500" 
                />
                <span className="w-12 text-center font-black text-emerald-500 text-lg">{user.goalIMC}</span>
              </div>
              <p className="text-[9px] text-zinc-500 font-bold ml-2">
                Para sua altura, IMC {user.goalIMC} equivale a <span className="text-white">{targetWeight.toFixed(1)}kg</span>.
              </p>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Sexo Biológico</label>
              <div className="grid grid-cols-2 gap-2">
                 <button 
                  onClick={() => handleUpdateProfile({ sex: 'masculino' })}
                  className={`py-3 rounded-2xl text-[11px] font-black uppercase transition-all ${user.sex === 'masculino' ? 'bg-blue-500 text-white shadow-lg' : 'bg-zinc-800 text-zinc-500 opacity-50'}`}
                 >Masculino</button>
                 <button 
                  onClick={() => handleUpdateProfile({ sex: 'feminino' })}
                  className={`py-3 rounded-2xl text-[11px] font-black uppercase transition-all ${user.sex === 'feminino' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-zinc-800 text-zinc-500 opacity-50'}`}
                 >Feminino</button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="glass-card p-5 rounded-[2rem] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-zinc-500"><Scale size={16}/><span className="text-[10px] font-black uppercase tracking-widest">Peso (kg)</span></div>
              <input type="number" inputMode="decimal" step="0.1" value={user.weight || ''} onChange={e => handleUpdateProfile({ weight: parseFloat(e.target.value) || 0 })} className="bg-transparent text-xl font-black text-white outline-none w-full" placeholder="0.0" />
           </div>
           <div className="glass-card p-5 rounded-[2rem] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-zinc-500"><Ruler size={16}/><span className="text-[10px] font-black uppercase tracking-widest">Altura (m)</span></div>
              <input type="number" inputMode="decimal" step="0.01" value={user.height || ''} onChange={e => handleUpdateProfile({ height: parseFloat(e.target.value) || 0 })} className="bg-transparent text-xl font-black text-white outline-none w-full" placeholder="0.00" />
           </div>
        </div>

        <button onClick={() => { localStorage.removeItem('tatugym_remembered'); setIsLoggedIn(false); }} className="w-full bg-zinc-900 text-zinc-400 font-black py-5 rounded-[2.2rem] flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95 text-[11px] border border-white/5 transition-all hover:bg-zinc-800"><LogOut size={18}/> Sair da Conta</button>
      </div>
    );
  };

  const renderOnboarding = () => (
    <div className="space-y-8 py-10 animate-slide-up h-full overflow-y-auto no-scrollbar">
      <div className="text-center space-y-3">
        <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-[2.2rem] flex items-center justify-center shadow-2xl mb-6 transform rotate-12 glow-emerald"><Zap size={40} className="text-zinc-900" fill="currentColor" /></div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">BEM-VINDA!</h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] px-12 leading-relaxed">VAMOS DEFINIR SUAS METAS BIOMÉTRICAS.</p>
      </div>
      
      <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 tracking-widest">Sexo</label>
          <div className="grid grid-cols-2 gap-2">
             <button onClick={() => handleUpdateProfile({ sex: 'masculino' })} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${user.sex === 'masculino' ? 'bg-blue-500 text-white' : 'bg-zinc-900 text-zinc-600'}`}>Masculino</button>
             <button onClick={() => handleUpdateProfile({ sex: 'feminino' })} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${user.sex === 'feminino' ? 'bg-indigo-500 text-white' : 'bg-zinc-900 text-zinc-600'}`}>Feminino</button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 tracking-widest">Peso (kg)</label>
          <input type="number" inputMode="decimal" step="0.1" value={user.weight || ''} onChange={e => handleUpdateProfile({ weight: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-white font-black text-xl outline-none focus:border-emerald-500" placeholder="0.0" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 tracking-widest">Altura (m)</label>
          <input type="number" inputMode="decimal" step="0.01" value={user.height || ''} onChange={e => handleUpdateProfile({ height: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-5 text-white font-black text-xl outline-none focus:border-emerald-500" placeholder="1.70" />
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-3 tracking-widest">Meta de IMC (Ideal: 21-23)</label>
          <div className="flex items-center gap-4">
            <input type="range" min="18" max="28" step="0.5" value={user.goalIMC} onChange={e => handleUpdateProfile({ goalIMC: parseFloat(e.target.value) })} className="flex-1 h-1 bg-zinc-900 rounded-full appearance-none accent-emerald-500" />
            <span className="font-black text-emerald-500 text-lg">{user.goalIMC}</span>
          </div>
        </div>
      </div>

      <button onClick={() => { if (!user.weight || !user.height) { alert('Preencha os campos.'); return; } handleUpdateProfile({ isProfileComplete: true }); setActiveTab(AppTab.DASHBOARD); }} className="w-full bg-emerald-500 text-zinc-900 font-black py-6 rounded-[2.2rem] shadow-2xl uppercase tracking-widest active:scale-95 text-sm">FINALIZAR E COMEÇAR</button>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6 pb-28 pt-4 animate-slide-up">
      <div className="flex items-baseline gap-2">
        <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">MEU <span className="text-emerald-500">HISTÓRICO</span></h1>
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
      {user.history.length === 0 ? (
        <div className="glass-card p-12 rounded-[2.5rem] border border-white/5 text-center space-y-4">
           <div className="w-16 h-16 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center text-zinc-700 mx-auto border border-white/5"><History size={32} /></div>
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Ainda sem registros. Comece hoje!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {user.history.map((entry) => (
            <div key={entry.id} className="glass-card p-5 rounded-[2.2rem] border border-white/5 space-y-4 hover:border-emerald-500/30 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">{entry.workoutTitle}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={10} /> {new Date(entry.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                   <span className="text-emerald-500 text-[8px] font-black uppercase tracking-widest">CONCLUÍDO</span>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-white/5">
                {entry.exercises.map((ex, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-zinc-400">{ex.name}</span>
                    <span className="text-[11px] font-black text-white">{ex.setsCompleted}/{ex.totalSets} <span className="text-zinc-600 mx-1">•</span> {ex.weight}kg</span>
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
       <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20"><Bot size={22}/></div>
            <div>
              <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">TATU <span className="text-indigo-500">AI</span></h1>
              <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Ativo Agora</p>
            </div>
          </div>
          <button onClick={() => setChatMessages([])} className="text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
       </div>

       <div className="flex-1 overflow-y-auto space-y-4 px-1 scrollbar-hide pb-4">
          {chatMessages.length === 0 && (
             <div className="glass-card border-white/5 rounded-[2.2rem] p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto"><Quote size={24}/></div>
                <p className="text-white font-bold text-sm">Olá Jéssica! Estou aqui para turbinar seu treino de hoje.</p>
                <div className="flex flex-wrap justify-center gap-2">
                   {["Dicas de core", "Como fazer agachamento?", "Estou com preguiça"].map(q => (
                     <button key={q} onClick={() => { setChatInput(q); }} className="text-[9px] font-black text-zinc-400 border border-white/10 px-3 py-1.5 rounded-full bg-zinc-900/50 active:scale-95">{q}</button>
                   ))}
                </div>
             </div>
          )}
          {chatMessages.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[1.8rem] text-sm font-bold shadow-xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-900/90 text-zinc-300 rounded-tl-none border border-white/10'}`}>
                   {msg.text}
                </div>
             </div>
          ))}
          {isChatLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900/90 px-5 py-3 rounded-[1.5rem] rounded-tl-none border border-white/10 flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
       </div>

       <div className="mt-4 flex gap-2 p-1.5 glass-card rounded-[2rem]">
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Pergunte qualquer coisa..." className="flex-1 bg-transparent px-5 py-3 text-sm font-bold text-white outline-none placeholder:text-zinc-600" />
          <button onClick={handleSendMessage} className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"><ChevronRight size={22} /></button>
       </div>
    </div>
  );

  const renderWorkoutMode = () => {
    if (!selectedWorkout) return null;
    
    // Calcular progresso real
    const totalSets = selectedWorkout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const completedSets = (Object.values(currentSessionProgress) as { weight: number, setsCompleted: number }[]).reduce((acc: number, data) => acc + (data.setsCompleted || 0), 0);
    const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    return (
      <div className="space-y-4 pb-44 pt-2 animate-slide-up">
        <div className="flex items-center justify-between px-1">
          <button onClick={() => { if(confirm('Sair do treino? O progresso atual será perdido.')) { setSelectedWorkout(null); setActiveTab(AppTab.DASHBOARD); } }} className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-black uppercase tracking-widest py-2 active:opacity-50"><ChevronLeft size={16}/> ABANDONAR</button>
          <div className="text-right">
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">SESSÃO ATIVA</p>
             <p className="text-xs font-black text-white">{progressPercent}% CONCLUÍDO</p>
          </div>
        </div>

        {/* Progress Bar Top */}
        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 mb-4">
           <div className="h-full bg-emerald-500 transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="flex flex-col gap-1 mb-4 px-1">
           <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{selectedWorkout.title}</h1>
           <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em]">{selectedWorkout.description}</p>
        </div>

        <div className="space-y-2">
          {selectedWorkout.exercises.map(ex => <ExerciseItem key={ex.id} exercise={ex} onSaveProgress={handleSaveProgress} savedWeight={user.weights?.[ex.id]} initialSetsCompleted={currentSessionProgress[ex.id]?.setsCompleted} />)}
        </div>

        <div className="fixed bottom-24 left-0 right-0 px-4 max-w-md mx-auto z-40">
          <button onClick={handleFinishWorkout} disabled={completedSets === 0} className={`w-full font-black py-5 rounded-[2.5rem] shadow-2xl uppercase tracking-widest active:scale-95 flex items-center justify-center gap-3 text-sm transition-all ${completedSets > 0 ? 'bg-emerald-500 text-zinc-900 shadow-emerald-500/20' : 'bg-zinc-800 text-zinc-600 opacity-50'}`}><CheckCircle2 size={22} /> FINALIZAR TREINO</button>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="w-full max-w-sm space-y-8 animate-fade relative z-10">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 transform rotate-6 glow-emerald"><Dumbbell size={42} className="text-zinc-900" /></div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic">TATU<span className="text-emerald-500">GYM</span></h1>
            <p className="text-zinc-600 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Personal Trainer Inteligente</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (loginData.user.trim().toLowerCase() === 'jessica' && loginData.pass === '9860') { setIsLoggedIn(true); if (loginData.remember) localStorage.setItem('tatugym_remembered', JSON.stringify(loginData)); if (!user.isProfileComplete) setActiveTab(AppTab.ONBOARDING); } else alert('Credenciais inválidas.'); }} className="space-y-4">
            <input type="text" inputMode="text" value={loginData.user} onChange={e => setLoginData({...loginData, user: e.target.value})} className="w-full bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 text-white outline-none focus:border-emerald-500/50 transition-all text-center font-bold tracking-wide" placeholder="Nome de Usuário" />
            <input type="password" inputMode="numeric" value={loginData.pass} onChange={e => setLoginData({...loginData, pass: e.target.value})} className="w-full bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 text-white outline-none focus:border-emerald-500/50 transition-all text-center font-bold tracking-wide" placeholder="Senha de 4 dígitos" />
            <div className="pt-2">
              <button className="w-full bg-white text-zinc-950 font-black py-6 rounded-3xl shadow-2xl shadow-white/5 uppercase tracking-widest active:scale-95 transition-all text-sm">ACESSAR PAINEL</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative px-5 pt-8 overflow-x-hidden">
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
          <button onClick={() => { setSelectedWorkout(null); setActiveTab(AppTab.DASHBOARD); }} className={`p-4 rounded-full transition-all active:scale-90 ${activeTab === AppTab.DASHBOARD || (activeTab === AppTab.WORKOUT && selectedWorkout) ? 'bg-emerald-500 text-zinc-950 shadow-xl shadow-emerald-500/20 scale-110' : 'text-zinc-600'}`}><Dumbbell size={22} /></button>
          <button onClick={() => { setSelectedWorkout(null); setActiveTab(AppTab.HISTORY); }} className={`p-4 rounded-full transition-all active:scale-90 ${activeTab === AppTab.HISTORY ? 'bg-emerald-500 text-zinc-950 shadow-xl shadow-emerald-500/20 scale-110' : 'text-zinc-600'}`}><History size={22} /></button>
          <button onClick={() => { setSelectedWorkout(null); setActiveTab(AppTab.AI_ASSISTANT); }} className={`p-4 rounded-full transition-all active:scale-90 ${activeTab === AppTab.AI_ASSISTANT ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 scale-110' : 'text-zinc-600'}`}><Bot size={22} /></button>
          <button onClick={() => { setSelectedWorkout(null); setActiveTab(AppTab.SETTINGS); }} className={`p-4 rounded-full transition-all active:scale-90 ${activeTab === AppTab.SETTINGS ? 'bg-emerald-500 text-zinc-950 shadow-xl shadow-emerald-500/20 scale-110' : 'text-zinc-600'}`}><UserIcon size={22} /></button>
        </nav>
      )}
    </div>
  );
};

export default App;
