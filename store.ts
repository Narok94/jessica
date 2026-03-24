
import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { User, WorkoutRoutine, AppTab, SetPerformance, WorkoutHistoryEntry, Badge } from './types';
import { jessicaWorkouts, henriqueWorkouts, mariaWorkouts, flaviaWorkouts } from './data/workoutData';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  activeTab: AppTab;
  selectedWorkout: WorkoutRoutine | null;
  currentSessionProgress: Record<string, SetPerformance[]>;
  isWorkoutActive: boolean;
  workoutStartTime: number | null;
  elapsedTime: number;
  showSummary: boolean;
  lastWorkoutVolume: number;
  workoutDuration: number | null;
  chatMessages: { role: 'user' | 'model'; text: string }[];
  isChatLoading: boolean;
  selectedStudent: string | null;
  allWorkouts: Record<string, WorkoutRoutine[]>;

  // Actions
  setUser: (user: User | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setActiveTab: (tab: AppTab) => void;
  setSelectedWorkout: (workout: WorkoutRoutine | null) => void;
  setSelectedStudent: (student: string | null) => void;
  setAllWorkouts: (workouts: AppState['allWorkouts']) => void;
  setCurrentSessionProgress: (progress: Record<string, SetPerformance[]>) => void;
  setIsWorkoutActive: (isActive: boolean) => void;
  setWorkoutStartTime: (time: number | null) => void;
  setElapsedTime: (time: number) => void;
  setShowSummary: (show: boolean) => void;
  setLastWorkoutVolume: (volume: number) => void;
  setWorkoutDuration: (duration: number | null) => void;
  setChatMessages: (messages: { role: 'user' | 'model', text: string }[]) => void;
  setIsChatLoading: (isLoading: boolean) => void;
  updateUserProfile: (newData: Partial<User>) => void;
  checkAchievements: () => void;
  handleManualCheckIn: () => void;
  triggerConfetti: () => void;
  addToast?: (message: string, type: 'success' | 'error' | 'info') => void;
  setAddToast: (fn: (message: string, type: 'success' | 'error' | 'info') => void) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  activeTab: AppTab.DASHBOARD,
  selectedWorkout: null,
  currentSessionProgress: {},
  isWorkoutActive: false,
  workoutStartTime: null,
  elapsedTime: 0,
  showSummary: false,
  lastWorkoutVolume: 0,
  workoutDuration: null,
  chatMessages: [],
  isChatLoading: false,
  selectedStudent: null,
  allWorkouts: (() => {
    const saved = localStorage.getItem('tatugym_all_workouts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading workouts:', e);
      }
    }
    return {
      henrique: henriqueWorkouts,
      jessica: jessicaWorkouts,
      maria: mariaWorkouts,
      flavia: flaviaWorkouts
    };
  })(),
  addToast: undefined,

  setUser: (user) => {
    set({ user });
    if (user) {
      // Load active session if exists
      const progress = localStorage.getItem(`tatugym_active_progress_${user.username.toLowerCase()}`);
      const status = localStorage.getItem(`tatugym_active_status_${user.username.toLowerCase()}`);
      const start = localStorage.getItem(`tatugym_active_start_${user.username.toLowerCase()}`);
      
      if (progress) set({ currentSessionProgress: JSON.parse(progress) });
      if (status) set({ isWorkoutActive: JSON.parse(status) });
      if (start) set({ workoutStartTime: JSON.parse(start) });
    }
  },
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedWorkout: (selectedWorkout) => set({ selectedWorkout }),
  setSelectedStudent: (selectedStudent) => set({ selectedStudent }),
  setAllWorkouts: (allWorkouts) => {
    set({ allWorkouts });
    localStorage.setItem('tatugym_all_workouts', JSON.stringify(allWorkouts));
  },
  setCurrentSessionProgress: (currentSessionProgress) => {
    set({ currentSessionProgress });
    const { user } = get();
    if (user) {
      localStorage.setItem(`tatugym_active_progress_${user.username.toLowerCase()}`, JSON.stringify(currentSessionProgress));
    }
  },
  setIsWorkoutActive: (isWorkoutActive) => {
    set({ isWorkoutActive });
    const { user } = get();
    if (user) {
      localStorage.setItem(`tatugym_active_status_${user.username.toLowerCase()}`, JSON.stringify(isWorkoutActive));
    }
  },
  setWorkoutStartTime: (workoutStartTime) => {
    set({ workoutStartTime });
    const { user } = get();
    if (user) {
      localStorage.setItem(`tatugym_active_start_${user.username.toLowerCase()}`, JSON.stringify(workoutStartTime));
    }
  },
  setElapsedTime: (elapsedTime) => set({ elapsedTime }),
  setShowSummary: (showSummary) => set({ showSummary }),
  setLastWorkoutVolume: (lastWorkoutVolume) => set({ lastWorkoutVolume }),
  setWorkoutDuration: (workoutDuration) => set({ workoutDuration }),
  setChatMessages: (chatMessages) => set({ chatMessages }),
  setIsChatLoading: (isChatLoading) => set({ isChatLoading }),
  setAddToast: (fn) => set({ addToast: fn }),

  logout: async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Error signing out:', e);
    }
    set({ 
      user: null, 
      isLoggedIn: false, 
      activeTab: AppTab.DASHBOARD,
      selectedWorkout: null,
      isWorkoutActive: false,
      currentSessionProgress: {},
      workoutStartTime: null
    });
    localStorage.removeItem('tatugym_remembered');
  },

  updateUserProfile: (newData) => {
    const { user } = get();
    if (!user) return;
    const updatedUser = { ...user, ...newData };
    set({ user: updatedUser });
    localStorage.setItem(`tatugym_user_profile_${user.username.toLowerCase()}`, JSON.stringify(updatedUser));
    get().checkAchievements();
  },

  handleManualCheckIn: () => {
    const { user, updateUserProfile, triggerConfetti } = get();
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    if (user.checkIns.includes(today)) {
      return;
    }
    const newCheckIns = [...user.checkIns, today];
    updateUserProfile({ 
      checkIns: newCheckIns,
      streak: (user.streak || 0) + 1 
    });
    triggerConfetti();
  },

  triggerConfetti: () => {
    confetti({ 
      particleCount: 150, 
      spread: 80, 
      origin: { y: 0.6 }, 
      colors: ['#10b981', '#6366f1', '#fbbf24'] 
    });
  },

  checkAchievements: () => {
    const { user } = get();
    if (!user) return;

    const newBadges: Badge[] = [...(user.badges || [])];
    const now = new Date().toISOString();

    // 1. First Workout
    if (user.totalWorkouts >= 1 && !newBadges.find(b => b.id === 'first_workout')) {
      newBadges.push({
        id: 'first_workout',
        name: 'Primeiro Passo',
        description: 'Concluiu seu primeiro treino.',
        icon: 'Rocket',
        unlockedAt: now
      });
    }

    // 2. 10 Workouts
    if (user.totalWorkouts >= 10 && !newBadges.find(b => b.id === 'ten_workouts')) {
      newBadges.push({
        id: 'ten_workouts',
        name: 'Constância',
        description: 'Concluiu 10 treinos.',
        icon: 'Trophy',
        unlockedAt: now
      });
    }

    // 3. 7 Day Streak
    if (user.streak >= 7 && !newBadges.find(b => b.id === 'seven_day_streak')) {
      newBadges.push({
        id: 'seven_day_streak',
        name: 'Fogo no Sangue',
        description: 'Manteve uma sequência de 7 dias.',
        icon: 'Flame',
        unlockedAt: now
      });
    }

    if (newBadges.length !== (user.badges || []).length) {
      set({ user: { ...user, badges: newBadges } });
      localStorage.setItem(`tatugym_user_profile_${user.username.toLowerCase()}`, JSON.stringify({ ...user, badges: newBadges }));
    }
  }
}));
