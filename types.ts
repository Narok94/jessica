
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  rest: number;
  notes?: string;
  image?: string;
  videoUrl?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  color: string;
}

export interface SetPerformance {
  weight: number;
  reps: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
}

export interface WorkoutHistoryEntry {
  id: string;
  date: string; // ISO string
  workoutId: string;
  workoutTitle: string;
  exercises: {
    exerciseId: string;
    name: string;
    performance: SetPerformance[];
  }[];
}

export interface User {
  username: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  sex?: 'masculino' | 'feminino';
  goalIMC?: number;
  goal?: string;
  streak: number;
  goalStreak?: number;
  totalWorkouts: number;
  goalWorkouts?: number;
  checkIns: string[];
  avatar?: string;
  isProfileComplete: boolean;
  weights?: Record<string, number>; 
  history: WorkoutHistoryEntry[];
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  WORKOUT = 'workout',
  HISTORY = 'history',
  AI_ASSISTANT = 'ai',
  SETTINGS = 'settings',
  ONBOARDING = 'onboarding'
}
