
import { WorkoutRoutine } from '../types';

export const initialWorkouts: WorkoutRoutine[] = [
  {
    id: 'segunda-superior',
    title: 'Segunda - Superior',
    description: 'Foco em braços, peito e costas.',
    color: 'blue',
    exercises: [
      { id: 's1', name: 'Flexão de Braços', muscleGroup: 'Peito', sets: 3, reps: '12-15', rest: 60 },
      { id: 's2', name: 'Flexão Diamante', muscleGroup: 'Tríceps', sets: 3, reps: '10-12', rest: 60 },
      { id: 's3', name: 'Remada com Toalha', muscleGroup: 'Costas', sets: 3, reps: '15', rest: 60 },
      { id: 's4', name: 'Mergulho no Banco', muscleGroup: 'Tríceps', sets: 3, reps: '12-15', rest: 60 },
      { id: 's5', name: 'Polichinelos', muscleGroup: 'Cardio', sets: 3, reps: '45s', rest: 30 }
    ]
  },
  {
    id: 'terca-inferior',
    title: 'Terça - Inferior',
    description: 'Foco em pernas e glúteos.',
    color: 'emerald',
    exercises: [
      { id: 't1', name: 'Agachamento Búlgaro', muscleGroup: 'Quadríceps/Glúteo', sets: 3, reps: '10/10', rest: 60 },
      { id: 't2', name: 'Agachamento Sumô com Salto', muscleGroup: 'Pernas', sets: 3, reps: '12-15', rest: 60 },
      { id: 't3', name: 'Elevação Pélvica Unilateral', muscleGroup: 'Glúteo', sets: 3, reps: '12/12', rest: 60 },
      { id: 't4', name: 'Panturrilha Unilateral', muscleGroup: 'Panturrilha', sets: 3, reps: '15/15', rest: 45 }
    ]
  },
  {
    id: 'quarta-core-cardio',
    title: 'Quarta - Core/Cardio',
    description: 'Foco em abdômen e queima calórica.',
    color: 'orange',
    exercises: [
      { id: 'q1', name: 'Burpees', muscleGroup: 'Cardio', sets: 3, reps: '10-12', rest: 60 },
      { id: 'q2', name: 'Prancha Toque no Ombro', muscleGroup: 'CORE', sets: 3, reps: '20', rest: 45 },
      { id: 'q3', name: 'Abdominal Canivete', muscleGroup: 'Abdomen', sets: 3, reps: '15', rest: 45 },
      { id: 'q4', name: 'Mountain Climbers', muscleGroup: 'CORE/Cardio', sets: 3, reps: '45s', rest: 45 }
    ]
  },
  {
    id: 'quinta-full-body',
    title: 'Quinta - Full Body',
    description: 'Treino de corpo todo.',
    color: 'purple',
    exercises: [
      { id: 'qi1', name: 'Sprawl', muscleGroup: 'Full Body', sets: 3, reps: '12', rest: 60 },
      { id: 'qi2', name: 'Avanço Alternado', muscleGroup: 'Pernas', sets: 3, reps: '20', rest: 60 },
      { id: 'qi3', name: 'Flexão com Toque no Joelho', muscleGroup: 'Peito/CORE', sets: 3, reps: '12', rest: 60 },
      { id: 'qi4', name: 'Ponte com Marcha', muscleGroup: 'Glúteo/CORE', sets: 3, reps: '15', rest: 60 }
    ]
  },
  {
    id: 'sexta-exaustao',
    title: 'Sexta - Exaustão',
    description: 'Série final para queima total.',
    color: 'red',
    exercises: [
      { id: 'sx1', name: 'Agachamento Isométrico', muscleGroup: 'Pernas', sets: 3, reps: '45-60s', rest: 45 },
      { id: 'sx2', name: 'Flexão Sustentada', muscleGroup: 'Superior', sets: 3, reps: '30s', rest: 45 },
      { id: 'sx3', name: 'Prancha Lateral', muscleGroup: 'CORE', sets: 3, reps: '30s/30s', rest: 45 },
      { id: 'sx4', name: 'Corrida Estacionária', muscleGroup: 'Cardio', sets: 3, reps: '60s', rest: 30 }
    ]
  }
];
