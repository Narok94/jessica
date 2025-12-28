
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

export interface WorkoutHistoryEntry {
  id: string;
  date: string; // ISO string
  workoutId: string;
  workoutTitle: string;
  exercises: {
    exerciseId: string;
    name: string;
    setsCompleted: number;
    totalSets: number;
    weight: number;
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
  weights?: Record<string, number>; // Mapping of exerciseId -> weight
  history: WorkoutHistoryEntry[];
}

export interface SocialPost {
  id: string;
  user: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  image?: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  WORKOUT = 'workout',
  HISTORY = 'history',
  AI_ASSISTANT = 'ai',
  SETTINGS = 'settings',
  ONBOARDING = 'onboarding'
}
