
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
    id: 'h-seg',
    title: 'SEG (Superior)',
    description: 'Foco em peitoral e tríceps.',
    color: 'blue',
    exercises: [
      { id: 'hs1', name: 'Flexão Clássica', muscleGroup: 'Peitoral', sets: 4, reps: '10-12', rest: 45 },
      { id: 'hs2', name: 'Tríceps na Parede (Testa)', muscleGroup: 'Tríceps', sets: 4, reps: '10-12', rest: 30 },
      { id: 'hs3', name: 'Mergulho no Banco (Dips)', muscleGroup: 'Tríceps', sets: 4, reps: '10-12', rest: 45 },
      { id: 'hs4', name: 'Flexão Inclinada (Mãos no sofá)', muscleGroup: 'Peitoral', sets: 3, reps: '12', rest: 30 }
    ]
  },
  {
    id: 'h-ter',
    title: 'TER (Inferior)',
    description: 'Pernas e glúteos intensos.',
    color: 'emerald',
    exercises: [
      { id: 'ht1', name: 'Agachamento Búlgaro', muscleGroup: 'Pernas', sets: 4, reps: '15/15', rest: 45 },
      { id: 'ht2', name: 'Agachamento Sumô', muscleGroup: 'Pernas', sets: 4, reps: '30', rest: 45 },
      { id: 'ht3', name: 'Afundo Alternado', muscleGroup: 'Pernas', sets: 4, reps: '20', rest: 30 },
      { id: 'ht4', name: 'Panturrilha Unilateral', muscleGroup: 'Panturrilha', sets: 4, reps: 'Falha', rest: 30 }
    ]
  },
  {
    id: 'h-qua',
    title: 'QUA (Core/HIIT)',
    description: 'Abdômen e queima calórica.',
    color: 'orange',
    exercises: [
      { id: 'hq1', name: 'Abdominal Canivete', muscleGroup: 'Abdômen', sets: 4, reps: '20', rest: 30 },
      { id: 'hq2', name: 'Prancha Abdominal', muscleGroup: 'CORE', sets: 4, reps: '1 min', rest: 30 },
      { id: 'hq3', name: 'Bicicleta Abdominal', muscleGroup: 'Abdômen', sets: 4, reps: '1 min', rest: 30 },
      { id: 'hq4', name: 'Corrida Estacionária', muscleGroup: 'Cardio', sets: 5, reps: '1 min', rest: 30 }
    ]
  },
  {
    id: 'h-qui',
    title: 'QUI (Full Body)',
    description: 'Trabalho de corpo inteiro.',
    color: 'purple',
    exercises: [
      { id: 'hqi1', name: 'Agachamento com Salto', muscleGroup: 'Pernas/Cardio', sets: 4, reps: '20', rest: 45 },
      { id: 'hqi2', name: 'Flexão Aberta', muscleGroup: 'Peitoral', sets: 3, reps: '10-12', rest: 45 },
      { id: 'hqi3', name: 'Ponte para Glúteo', muscleGroup: 'Glúteo', sets: 4, reps: '25', rest: 30 },
      { id: 'hqi4', name: 'Polichinelos', muscleGroup: 'Cardio', sets: 4, reps: '1 min', rest: 30 }
    ]
  },
  {
    id: 'h-sex',
    title: 'SEX (Exaustão)',
    description: 'Isometria e alta intensidade.',
    color: 'red',
    exercises: [
      { id: 'hsx1', name: 'Agachamento Isométrico', muscleGroup: 'Pernas', sets: 4, reps: 'Falha', rest: 30 },
      { id: 'hsx2', name: 'Flexão Isométrica (90°)', muscleGroup: 'Peitoral', sets: 3, reps: '20-30s', rest: 30 },
      { id: 'hsx3', name: 'Prancha Lateral', muscleGroup: 'CORE', sets: 3, reps: '45s/45s', rest: 15 },
      { id: 'hsx4', name: 'Burpee Adaptado', muscleGroup: 'Cardio', sets: 4, reps: '10-12', rest: 45 }
    ]
  },
  {
    id: 'h-sab',
    title: 'SÁB (HIIT/Queima)',
    description: 'Finalização da semana.',
    color: 'pink',
    exercises: [
      { id: 'hsb1', name: 'Mountain Climbers', muscleGroup: 'Cardio', sets: 5, reps: '45s', rest: 15 },
      { id: 'hsb2', name: 'Agachamento Lateral', muscleGroup: 'Pernas', sets: 4, reps: '20', rest: 30 },
      { id: 'hsb3', name: 'Abdominal Infra', muscleGroup: 'Abdômen', sets: 4, reps: '20', rest: 30 },
      { id: 'hsb4', name: 'Trote ou Caminhada Rápida', muscleGroup: 'Cardio', sets: 1, reps: '20 min', rest: 0 }
    ]
  }
];
