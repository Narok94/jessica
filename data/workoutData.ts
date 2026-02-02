
import { WorkoutRoutine } from '../types';

export const jessicaWorkouts: WorkoutRoutine[] = [
  {
    id: 'fortalecimento',
    title: 'Fortalecimento (CORE)',
    description: 'Foco em estabilização e controle para Fibromialgia.',
    color: 'emerald',
    exercises: [
      { id: 'f1', name: 'Pingus (Abdomen Infra)', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30 },
      { id: 'f2', name: 'Frog (Pilates)', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30 },
      { id: 'f3', name: 'One Hundred', muscleGroup: 'CORE', sets: 1, reps: '50', rest: 30 },
      { id: 'f4', name: 'Single Leg Stretch', muscleGroup: 'CORE', sets: 1, reps: '4/4', rest: 30 },
      { id: 'f5', name: 'Double Leg Stretch', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30 },
      { id: 'f6', name: 'Elevação Pélvica Solo', muscleGroup: 'Glúteo/CORE', sets: 1, reps: '8', rest: 30 }
    ]
  },
  {
    id: 'a',
    title: 'Treino A - Inferiores',
    description: 'Foco em pernas e abdômen infra.',
    color: 'blue',
    exercises: [
      { id: 'a1', name: 'Abdomen Infra', muscleGroup: 'Abdomen', sets: 3, reps: '12-15', rest: 60 },
      { id: 'a2', name: 'Agachamento Livre Banco', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60 },
      { id: 'a3', name: 'Cadeira Adutora', muscleGroup: 'Adutores', sets: 3, reps: '12-15', rest: 60 },
      { id: 'a4', name: 'Afundo', muscleGroup: 'Pernas', sets: 3, reps: '12-15', rest: 60 },
      { id: 'a5', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60 },
      { id: 'a6', name: 'Panturrilha em pé', muscleGroup: 'Panturrilha', sets: 3, reps: '15', rest: 45 }
    ]
  },
  {
    id: 'b',
    title: 'Treino B - Superiores',
    description: 'Tronco e membros superiores.',
    color: 'orange',
    exercises: [
      { id: 'b1', name: 'Abdomen Reto', muscleGroup: 'Abdomen', sets: 3, reps: '12-15', rest: 60 },
      { id: 'b2', name: 'Elevação Lateral Halteres', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60 },
      { id: 'b3', name: 'Supino Máquina', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60 },
      { id: 'b4', name: 'Desenvolvimento Máquina', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60 },
      { id: 'b5', name: 'Peck Deck', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60 },
      { id: 'b6', name: 'Remada Alta Kettlebell', muscleGroup: 'Costas/Ombro', sets: 3, reps: '12-15', rest: 60 }
    ]
  },
  {
    id: 'c',
    title: 'Treino C - Posterior e Glúteo',
    description: 'Cadeia posterior e estabilização.',
    color: 'purple',
    exercises: [
      { id: 'c1', name: 'Prancha', muscleGroup: 'CORE', sets: 3, reps: '90s', rest: 60 },
      { id: 'c2', name: 'Abdução Solo Pilates', muscleGroup: 'Quadril', sets: 3, reps: '16', rest: 60 },
      { id: 'c3', name: 'Stiff Barra', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60 },
      { id: 'c4', name: 'Gluteo Máquina Coice', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60 },
      { id: 'c5', name: 'Cadeira Flexora', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60 },
      { id: 'c6', name: 'Elevação Pélvica', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60 }
    ]
  },
  {
    id: 'd',
    title: 'Treino D - Tração e Braços',
    description: 'Costas e braços.',
    color: 'red',
    exercises: [
      { id: 'd1', name: 'Canoa Estática', muscleGroup: 'CORE', sets: 3, reps: '90s', rest: 60 },
      { id: 'd2', name: 'Puxada Supinada', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60 },
      { id: 'd3', name: 'Triceps Pulley Barra W', muscleGroup: 'Tríceps', sets: 3, reps: '12-15', rest: 60 },
      { id: 'd4', name: 'Remada Baixa Máquina', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60 },
      { id: 'd5', name: 'Rosca Direta Pulley', muscleGroup: 'Bíceps', sets: 3, reps: '12-15', rest: 60 },
      { id: 'd6', name: 'Peck Deck Invertido', muscleGroup: 'Ombro', sets: 3, reps: '12-15', rest: 60 }
    ]
  }
];

export const henriqueWorkouts: WorkoutRoutine[] = [
  {
    id: 'h-segunda',
    title: 'Segunda (Superior)',
    description: 'Flexão, Remada e Mergulho.',
    color: 'blue',
    exercises: [
      { id: 'hs1', name: 'Flexão de Braços', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60 },
      { id: 'hs2', name: 'Flexão Diamante', muscleGroup: 'Tríceps', sets: 3, reps: '10-12', rest: 60 },
      { id: 'hs3', name: 'Remada com Toalha', muscleGroup: 'Costas', sets: 3, reps: '15', rest: 60 },
      { id: 'hs4', name: 'Mergulho no Banco', muscleGroup: 'Tríceps', sets: 3, reps: '12-15', rest: 60 },
      { id: 'hs5', name: 'Polichinelos', muscleGroup: 'Cardio', sets: 3, reps: '45s', rest: 45 }
    ]
  },
  {
    id: 'h-terca',
    title: 'Terça (Inferior)',
    description: 'Agachamentos e Panturrilha.',
    color: 'emerald',
    exercises: [
      { id: 'ht1', name: 'Agachamento Búlgaro', muscleGroup: 'Quadríceps', sets: 3, reps: '10/10', rest: 60 },
      { id: 'ht2', name: 'Agachamento Sumô com Salto', muscleGroup: 'Pernas', sets: 3, reps: '12', rest: 60 },
      { id: 'ht3', name: 'Elevação Pélvica Unilateral', muscleGroup: 'Glúteo', sets: 3, reps: '12/12', rest: 60 },
      { id: 'ht4', name: 'Panturrilha Unilateral', muscleGroup: 'Panturrilha', sets: 3, reps: '15/15', rest: 45 }
    ]
  },
  {
    id: 'h-quarta',
    title: 'Quarta (Core/Cardio)',
    description: 'Burpees e Prancha.',
    color: 'orange',
    exercises: [
      { id: 'hq1', name: 'Burpees', muscleGroup: 'Cardio', sets: 3, reps: '10-12', rest: 60 },
      { id: 'hq2', name: 'Prancha Toque no Ombro', muscleGroup: 'CORE', sets: 3, reps: '20', rest: 45 },
      { id: 'hq3', name: 'Abdominal Canivete', muscleGroup: 'Abdomen', sets: 3, reps: '15', rest: 45 },
      { id: 'hq4', name: 'Mountain Climbers', muscleGroup: 'Cardio', sets: 3, reps: '45s', rest: 45 }
    ]
  },
  {
    id: 'h-quinta',
    title: 'Quinta (Full Body)',
    description: 'Corpo inteiro.',
    color: 'purple',
    exercises: [
      { id: 'hqi1', name: 'Sprawl', muscleGroup: 'Full Body', sets: 3, reps: '12', rest: 60 },
      { id: 'hqi2', name: 'Avanço Alternado', muscleGroup: 'Pernas', sets: 3, reps: '20', rest: 60 },
      { id: 'hqi3', name: 'Flexão com Toque no Joelho', muscleGroup: 'Peitoral/CORE', sets: 3, reps: '12', rest: 60 },
      { id: 'hqi4', name: 'Ponte com Marcha', muscleGroup: 'CORE', sets: 3, reps: '15', rest: 60 }
    ]
  },
  {
    id: 'h-sexta',
    title: 'Sexta (Exaustão)',
    description: 'Máxima intensidade.',
    color: 'red',
    exercises: [
      { id: 'hsx1', name: 'Agachamento Isométrico', muscleGroup: 'Pernas', sets: 3, reps: '45s', rest: 45 },
      { id: 'hsx2', name: 'Flexão Sustentada', muscleGroup: 'Peitoral', sets: 3, reps: '30s', rest: 45 },
      { id: 'hsx3', name: 'Prancha Lateral', muscleGroup: 'CORE', sets: 3, reps: '30s/30s', rest: 45 },
      { id: 'hsx4', name: 'Corrida Estacionária', muscleGroup: 'Cardio', sets: 3, reps: '60s', rest: 30 }
    ]
  }
];
