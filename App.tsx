import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  LayoutDashboard, 
  History as HistoryIcon, 
  Bot, 
  User as UserIcon,
  Lock,
  Check,
  ArrowRight,
  Users
} from 'lucide-react';
import { useStore } from './store';
import { AppTab, User } from './types';
import { ToastProvider, useToast } from './components/ui/Toast';
import { DashboardSkeleton } from './components/ui/Skeleton';
import { db, auth } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

// Views
import { DashboardView } from './components/views/DashboardView';
import { WorkoutView } from './components/views/WorkoutView';
import { HistoryView } from './components/views/HistoryView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { ProfileView } from './components/views/ProfileView';
import { TeacherView } from './components/views/TeacherView';

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
    setAddToast,
    setCustomGifs
  } = useStore();

  const { addToast: toastFn } = useToast();

  useEffect(() => {
    setAddToast(toastFn);
  }, [toastFn, setAddToast]);

  // Load custom gifs from Firestore on startup
  useEffect(() => {
    const loadCustomGifs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'exercise_gifs'));
        const gifs: Record<string, string> = {};
        querySnapshot.forEach((doc) => {
          gifs[doc.id] = doc.data().url;
        });
        setCustomGifs(gifs);
      } catch (error) {
        console.error('Error loading custom gifs:', error);
      }
    };
    loadCustomGifs();
  }, [setCustomGifs]);

  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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
      try {
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
      } catch (error) {
        console.error('Error loading remembered user:', error);
        localStorage.removeItem('tatugym_remembered');
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const lowerUser = username.trim().toLowerCase();
    const trimmedPassword = password.trim();
    
    if (allWorkouts[lowerUser] !== undefined || lowerUser === 'professor' || lowerUser === 'admin') {
      let userData: User | null = null;
      try {
        // Try to get from Firestore first
        const userDoc = await getDoc(doc(db, 'users', lowerUser));
        if (userDoc.exists()) {
          userData = userDoc.data() as User;
        } else {
          // Fallback to localStorage
          const profile = localStorage.getItem(`tatugym_user_profile_${lowerUser}`);
          if (profile) {
            userData = JSON.parse(profile);
          }
        }
      } catch (error) {
        console.error('Error parsing profile:', error);
      }

      // Password check logic
      if (userData?.password) {
        if (trimmedPassword !== userData.password) {
          if (addToast) addToast('Senha incorreta.', 'error');
          return;
        }
      } else {
        // Fallback for hardcoded users if no profile exists yet
        if (lowerUser === 'flavia' && trimmedPassword !== '6087') {
          if (addToast) addToast('Senha incorreta para Flavia.', 'error');
          return;
        }
        if (lowerUser === 'professor' && trimmedPassword !== 'admin') {
          if (addToast) addToast('Senha incorreta para Professor.', 'error');
          return;
        }
        if (lowerUser === 'admin' && trimmedPassword !== '9860') {
          if (addToast) addToast('Senha incorreta para Admin.', 'error');
          return;
        }
      }

      // If no profile exists, create default one
      if (!userData) {
        userData = {
          username: lowerUser,
          name: lowerUser === 'flavia' ? 'Flávia Reis' : lowerUser === 'professor' ? 'Professor Tatu' : lowerUser === 'admin' ? 'Administrador' : username.charAt(0).toUpperCase() + username.slice(1),
          age: lowerUser === 'flavia' ? 41 : undefined,
          goal: lowerUser === 'flavia' ? 'Saúde/ Tônus muscular' : undefined,
          totalWorkouts: 0,
          history: [],
          weights: {},
          checkIns: [],
          streak: 0,
          badges: [],
          isProfileComplete: true,
          role: (lowerUser === 'professor' || lowerUser === 'admin') ? 'teacher' : 'student'
        };
      }
      
      try {
        // Sign in anonymously to get a UID for Firestore rules
        await signInAnonymously(auth);
        
        // Save to Firestore
        await setDoc(doc(db, 'users', lowerUser), userData);
      } catch (error) {
        console.error('Error syncing with Firebase:', error);
      }

      setUser(userData);
      setIsLoggedIn(true);
      if (userData.role === 'teacher') {
        setActiveTab(AppTab.TEACHER);
      }
      if (rememberMe) {
        localStorage.setItem('tatugym_remembered', JSON.stringify(userData));
      } else {
        localStorage.removeItem('tatugym_remembered');
      }
      if (addToast) addToast(`Bem-vindo de volta, ${userData.name}!`, 'success');
    } else {
      if (addToast) addToast('Usuário não encontrado.', 'error');
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  if (!isLoggedIn) {
    const LOGIN_IMAGE = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop";
    
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row font-sans selection:bg-blue-500/30 relative overflow-hidden">
        {/* Mobile Background Image (Visible only on small screens) */}
        <div className="md:hidden absolute inset-0 z-0">
          <img 
            src={LOGIN_IMAGE} 
            alt="Gym Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-zinc-950"></div>
        </div>

        {/* Left Side - Image & Branding (Desktop) */}
        <div className="hidden md:flex md:w-3/5 relative overflow-hidden">
          <img 
            src={LOGIN_IMAGE} 
            alt="Gym Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 hover:scale-110 transition-transform duration-[10s] ease-linear"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent"></div>
          <div className="relative z-10 p-20 flex flex-col justify-between h-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="p-4 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-600/40">
                <Dumbbell size={36} className="text-white" strokeWidth={3} />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Tatu <span className="text-blue-500">Gym</span></h1>
            </motion.div>
            
            <div className="space-y-8 max-w-xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                <span className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">Alta Performance</span>
                <h2 className="text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
                  TRANSFORME <br /> 
                  SUA <span className="text-blue-500">ROTINA</span> <br />
                  EM RESULTADO.
                </h2>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-xs leading-relaxed opacity-80"
              >
                A plataforma definitiva para quem busca o próximo nível. <br />
                Treinos personalizados, acompanhamento em tempo real e IA.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-8 relative z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md space-y-8 md:space-y-12"
          >
            <div className="md:hidden flex flex-col items-center gap-4 mb-8">
               <motion.div 
                 initial={{ rotate: -10, scale: 0.8 }}
                 animate={{ rotate: 0, scale: 1 }}
                 transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                 className="p-5 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-600/30"
               >
                  <Dumbbell size={42} className="text-white" strokeWidth={3} />
               </motion.div>
               <motion.h1 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="text-4xl font-black text-white tracking-tighter italic uppercase"
               >
                 Tatu <span className="text-blue-500">Gym</span>
               </motion.h1>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <motion.h3 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic"
              >
                Acesso
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]"
              >
                Entre com suas credenciais para treinar.
              </motion.p>
            </div>

            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleLogin} 
              className="space-y-6 md:space-y-8"
            >
              <div className="space-y-4 md:space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Usuário</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-all" size={20} />
                    <input 
                      id="login-username"
                      name="username"
                      autoComplete="username"
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-4 md:p-5 pl-14 text-white font-bold outline-none focus:border-blue-500/50 focus:bg-zinc-900/60 transition-all placeholder:text-zinc-700 backdrop-blur-sm"
                      placeholder="Seu nome de usuário"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="login-password" title="Senha" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-all" size={20} />
                    <input 
                      id="login-password"
                      name="password"
                      autoComplete="current-password"
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-4 md:p-5 pl-14 text-white font-bold outline-none focus:border-blue-500/50 focus:bg-zinc-900/60 transition-all placeholder:text-zinc-700 backdrop-blur-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all duration-300 ${rememberMe ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/30' : 'border-white/10 bg-white/5 group-hover:border-white/20'}`}>
                    {rememberMe && <Check size={14} className="text-white" strokeWidth={4} />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span className="text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Lembrar</span>
                </label>
                
                <button type="button" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">Esqueci a senha</button>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 md:py-6 rounded-2xl shadow-2xl shadow-blue-600/30 uppercase tracking-[0.4em] transition-all text-xs flex items-center justify-center gap-4 group"
              >
                INICIAR SESSÃO <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-8 md:pt-10 border-t border-white/5 text-center"
            >
               <p className="text-zinc-600 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                 Acesso restrito a membros autorizados.<br />
                 <span className="text-zinc-700">© 2025 Tatu Gym Pro. Todos os direitos reservados.</span><br />
                 <span className="text-blue-500/50 mt-2 block">Professor: professor / admin | Admin: admin / 9860</span>
               </p>
            </motion.div>
          </motion.div>
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
      case AppTab.TEACHER: return <TeacherView />;
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
              ...(user?.role === 'teacher' ? [{ id: AppTab.TEACHER, icon: Users, label: 'Alunos' }] : []),
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
