
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  rest: number;
  notes?: string;
  image?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
  color: string;
}

export interface User {
  username: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  streak: number;
  goalStreak?: number;
  totalWorkouts: number;
  goalWorkouts?: number;
  checkIns: string[];
  avatar?: string;
  isProfileComplete: boolean; // Novo campo
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
  SOCIAL = 'social',
  AI_ASSISTANT = 'ai',
  SETTINGS = 'settings',
  ONBOARDING = 'onboarding' // Nova aba interna
}
