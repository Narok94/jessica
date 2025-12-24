
import { WorkoutRoutine } from '../types';

export const initialWorkouts: WorkoutRoutine[] = [
  {
    id: 'a',
    title: 'Treino A - Superiores (Peito/Ombro/Tríceps)',
    description: 'Foco em membros superiores e força de empurrar.',
    color: 'emerald',
    exercises: [
      { id: 'a1', name: 'Supino Reto (Halter)', muscleGroup: 'Peitoral', sets: 3, reps: '12', rest: 60 },
      { id: 'a2', name: 'Supino Inclinado (Halter)', muscleGroup: 'Peitoral Superior', sets: 3, reps: '12', rest: 60 },
      { id: 'a3', name: 'Desenvolvimento (Halter)', muscleGroup: 'Ombros', sets: 3, reps: '12', rest: 60 },
      { id: 'a4', name: 'Elevação Lateral', muscleGroup: 'Ombros', sets: 3, reps: '15', rest: 45 },
      { id: 'a5', name: 'Tríceps Pulley', muscleGroup: 'Tríceps', sets: 3, reps: '12', rest: 45 },
      { id: 'a6', name: 'Tríceps Corda', muscleGroup: 'Tríceps', sets: 3, reps: '12', rest: 45 }
    ]
  },
  {
    id: 'b',
    title: 'Treino B - Inferiores (Quadríceps/Adutores)',
    description: 'Foco em membros inferiores anterior.',
    color: 'blue',
    exercises: [
      { id: 'b1', name: 'Agachamento Livre', muscleGroup: 'Quadríceps', sets: 3, reps: '12', rest: 90 },
      { id: 'b2', name: 'Leg Press 45', muscleGroup: 'Membros Inferiores', sets: 3, reps: '15', rest: 90 },
      { id: 'b3', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '15', rest: 60 },
      { id: 'b4', name: 'Cadeira Adutora', muscleGroup: 'Adutores', sets: 3, reps: '15', rest: 60 },
      { id: 'b5', name: 'Panturrilha em pé', muscleGroup: 'Panturrilha', sets: 3, reps: '20', rest: 45 }
    ]
  },
  {
    id: 'c',
    title: 'Treino C - Superiores (Costas/Bíceps/Trapézio)',
    description: 'Foco em tração e bíceps.',
    color: 'orange',
    exercises: [
      { id: 'c1', name: 'Puxada Aberta', muscleGroup: 'Dorsais', sets: 3, reps: '12', rest: 60 },
      { id: 'c2', name: 'Remada Baixa', muscleGroup: 'Dorsais', sets: 3, reps: '12', rest: 60 },
      { id: 'c3', name: 'Remada Unilateral', muscleGroup: 'Dorsais', sets: 3, reps: '12', rest: 60 },
      { id: 'c4', name: 'Encolhimento (Halter)', muscleGroup: 'Trapézio', sets: 3, reps: '15', rest: 45 },
      { id: 'c5', name: 'Rosca Direta (Polia)', muscleGroup: 'Bíceps', sets: 3, reps: '12', rest: 60 },
      { id: 'c6', name: 'Rosca Martelo (Halter)', muscleGroup: 'Bíceps', sets: 3, reps: '12', rest: 60 }
    ]
  },
  {
    id: 'd',
    title: 'Treino D - Inferiores (Posterior/Glúteo)',
    description: 'Foco em cadeia posterior.',
    color: 'purple',
    exercises: [
      { id: 'd1', name: 'Stiff', muscleGroup: 'Posterior de Coxa', sets: 3, reps: '12', rest: 60 },
      { id: 'd2', name: 'Mesa Flexora', muscleGroup: 'Posterior de Coxa', sets: 3, reps: '15', rest: 60 },
      { id: 'd3', name: 'Cadeira Flexora', muscleGroup: 'Posterior de Coxa', sets: 3, reps: '15', rest: 60 },
      { id: 'd4', name: 'Elevação Pélvica', muscleGroup: 'Glúteos', sets: 3, reps: '15', rest: 90 },
      { id: 'd5', name: 'Panturrilha Sentado', muscleGroup: 'Panturrilha', sets: 3, reps: '20', rest: 45 }
    ]
  }
];
