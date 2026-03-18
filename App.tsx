import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  LayoutDashboard, 
  History as HistoryIcon, 
  Bot, 
  User as UserIcon, 
} from 'lucide-react';
import { useStore } from './store';
import { AppTab, User } from './types';
import { ToastProvider, useToast } from './components/ui/Toast';
import { DashboardSkeleton } from './components/ui/Skeleton';

// Views
import { DashboardView } from './components/views/DashboardView';
import { WorkoutView } from './components/views/WorkoutView';
import { HistoryView } from './components/views/HistoryView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { ProfileView } from './components/views/ProfileView';

const AppContent: React.FC = () => {
  const { 
    user, 
    isLoggedIn, 
    activeTab, 
    selectedWorkout, 
    isWorkoutActive, 
    currentSessionProgress,
    workoutStartTime,
    allWorkouts,
    setUser, 
    setIsLoggedIn, 
    setActiveTab, 
    setSelectedWorkout,
    setCurrentSessionProgress,
    setIsWorkoutActive,
    setWorkoutStartTime,
    addToast,
    setAddToast
  } = useStore();

  const { addToast: toastFn } = useToast();

  useEffect(() => {
    setAddToast(toastFn);
  }, [toastFn, setAddToast]);

  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Auto-save logic
  useEffect(() => {
    if (isWorkoutActive && user && selectedWorkout) {
      const interval = setInterval(() => {
        const sessionData = {
          workoutId: selectedWorkout.id,
          progress: currentSessionProgress,
          startTime: workoutStartTime,
          timestamp: Date.now()
        };
        localStorage.setItem(`tatugym_active_session_${user.username.toLowerCase()}`, JSON.stringify(sessionData));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isWorkoutActive, user, selectedWorkout, currentSessionProgress, workoutStartTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const remembered = localStorage.getItem('tatugym_remembered');
      if (remembered) {
        const userData = JSON.parse(remembered);
        const profile = localStorage.getItem(`tatugym_user_profile_${userData.username.toLowerCase()}`);
        const finalUser = profile ? JSON.parse(profile) : userData;
        setUser(finalUser);
        setIsLoggedIn(true);
        
        // Restore active session if exists and recent (within 5 mins)
        const activeSession = localStorage.getItem(`tatugym_active_session_${finalUser.username.toLowerCase()}`);
        if (activeSession) {
          const session = JSON.parse(activeSession);
          if (Date.now() - session.timestamp < 300000) {
            const workout = allWorkouts[finalUser.username.toLowerCase() as keyof typeof allWorkouts]?.find(w => w.id === session.workoutId);
            if (workout) {
              setSelectedWorkout(workout);
              setCurrentSessionProgress(session.progress);
              setWorkoutStartTime(session.startTime);
              setIsWorkoutActive(true);
              setActiveTab(AppTab.WORKOUT);
              if (addToast) addToast('Sessão de treino restaurada!', 'info');
            }
          }
        }
      }
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const lowerUser = username.toLowerCase();
    
    if (allWorkouts[lowerUser as keyof typeof allWorkouts]) {
      const profile = localStorage.getItem(`tatugym_user_profile_${lowerUser}`);
      let userData: User;
      
      if (profile) {
        userData = JSON.parse(profile);
      } else {
        userData = {
          username: lowerUser,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          totalWorkouts: 0,
          history: [],
          weights: {},
          checkIns: [],
          streak: 0,
          badges: [],
          isProfileComplete: true
        };
      }
      
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('tatugym_remembered', JSON.stringify(userData));
      if (addToast) addToast(`Bem-vindo de volta, ${userData.name}!`, 'success');
    } else {
      if (addToast) addToast('Usuário não encontrado.', 'error');
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="inline-flex p-5 rounded-[2.5rem] bg-blue-600 shadow-2xl shadow-blue-600/30 transform -rotate-6">
              <Dumbbell size={48} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none">Tatu <span className="text-blue-500">Gym</span> Pro</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] mt-3 text-[10px]">Evolução de alta performance.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="glass-card p-8 rounded-[2.5rem] space-y-6 border border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Usuário</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                placeholder="Seu nome de usuário"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 uppercase tracking-[0.4em] active:scale-95 transition-all text-xs"
            >
              ACESSAR SISTEMA
            </button>
          </form>
          
          <p className="text-center text-zinc-600 text-[9px] font-bold uppercase tracking-widest">Acesso restrito a membros autorizados.</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    if (selectedWorkout) return <WorkoutView />;
    
    switch (activeTab) {
      case AppTab.DASHBOARD: return <DashboardView />;
      case AppTab.HISTORY: return <HistoryView />;
      case AppTab.AI_ASSISTANT: return <AIAssistantView />;
      case AppTab.PROFILE: return <ProfileView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-32">
      <div className="max-w-4xl mx-auto p-6">
        {renderView()}
      </div>

      {/* Navigation Bar */}
      {!selectedWorkout && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
          <div className="glass-card rounded-[2.5rem] p-2 flex items-center justify-between border border-white/10 shadow-2xl shadow-black/50">
            {[
              { id: AppTab.DASHBOARD, icon: LayoutDashboard, label: 'Home' },
              { id: AppTab.HISTORY, icon: HistoryIcon, label: 'Histórico' },
              { id: AppTab.AI_ASSISTANT, icon: Bot, label: 'AI' },
              { id: AppTab.PROFILE, icon: UserIcon, label: 'Perfil' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-[2rem] transition-all duration-300 ${
                  activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110' 
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <item.icon size={22} strokeWidth={activeTab === item.id ? 3 : 2} />
                <span className="text-[8px] font-black uppercase tracking-widest mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
