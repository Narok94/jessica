
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
    title: 'SEG: Peito e Braços',
    description: 'Foco em HIPERTROFIA. O Segredo: faça a descida bem devagar (3 segundos). Se ficar fácil, segure o elástico mais curto.',
    color: 'blue',
    exercises: [
      { id: 'hn1', name: 'Flexão no Chão (Joelhos)', muscleGroup: 'Peito', sets: 4, reps: '12-20', rest: 45, notes: 'Cotovelos a 45° do corpo (formato de "seta") para não pinçar o ombro.' },
      { id: 'hn2', name: 'Fly com Elástico/Pano', muscleGroup: 'Peito', sets: 4, reps: '12-20', rest: 45, notes: 'Aperte bem um braço contra o outro no meio do peito.' },
      { id: 'hn3', name: 'Rosca Direta (Elástico/Pano)', muscleGroup: 'Bíceps', sets: 4, reps: '12-20', rest: 45, notes: 'Pise no pano e puxe com força máxima para cima.' },
      { id: 'hn4', name: 'Tríceps Francês (Elástico)', muscleGroup: 'Tríceps', sets: 4, reps: '12-20', rest: 45, notes: 'Cotovelo apontado para o teto e bem fechado próximo à cabeça.' },
      { id: 'hn5', name: 'Remada Sentada (Pano/Elástico)', muscleGroup: 'Costas', sets: 4, reps: '12-20', rest: 45, notes: 'Passe o pano nos pés e puxe em direção ao umbigo.' }
    ]
  },
  {
    id: 'h-ter',
    title: 'TER: Pernas e Core',
    description: 'Foco em QUEIMA METABÓLICA (Meta: 14% de gordura). Com o pano, faça mais força contra a própria resistência.',
    color: 'emerald',
    exercises: [
      { id: 'hn6', name: 'Agachamento Livre', muscleGroup: 'Pernas', sets: 4, reps: '20-30', rest: 45, notes: 'Mantenha o peso nos calcanhares.' },
      { id: 'hn7', name: 'Afundo Alternado', muscleGroup: 'Pernas', sets: 4, reps: '10/10 a 15/15', rest: 45 },
      { id: 'hn8', name: 'Abdominal Crunch (Curto)', muscleGroup: 'Abdômen', sets: 4, reps: '20-30', rest: 45, notes: 'Foco total na contração abdominal.' },
      { id: 'hn9', name: 'Elevação Pélvica', muscleGroup: 'Glúteo', sets: 4, reps: '20-30', rest: 45, notes: 'Suba o quadril e aperte o glúteo no topo.' },
      { id: 'hn10', name: 'Prancha Isométrica', muscleGroup: 'CORE', sets: 4, reps: '45-60s', rest: 45 }
    ]
  },
  {
    id: 'h-qua',
    title: 'QUA: Peito e Braços',
    description: 'HIPERTROFIA. Lembre-se: Progressão de carga é a chave. Segure o elástico mais curto para mais resistência.',
    color: 'blue',
    exercises: [
      { id: 'hn1', name: 'Flexão no Chão (Joelhos)', muscleGroup: 'Peito', sets: 4, reps: '12-20', rest: 45 },
      { id: 'hn2', name: 'Fly com Elástico/Pano', muscleGroup: 'Peito', sets: 4, reps: '12-20', rest: 45 },
      { id: 'hn3', name: 'Rosca Direta (Elástico/Pano)', muscleGroup: 'Bíceps', sets: 4, reps: '12-20', rest: 45 },
      { id: 'hn4', name: 'Tríceps Francês (Elástico)', muscleGroup: 'Tríceps', sets: 4, reps: '12-20', rest: 45 },
      { id: 'hn5', name: 'Remada Sentada (Pano/Elástico)', muscleGroup: 'Costas', sets: 4, reps: '12-20', rest: 45 }
    ]
  },
  {
    id: 'h-qui',
    title: 'QUI: Pernas e Core',
    description: 'Foco em QUEIMA. Não pare! A consistência é o que vai reduzir esses 4% de gordura.',
    color: 'emerald',
    exercises: [
      { id: 'hn6', name: 'Agachamento Livre', muscleGroup: 'Pernas', sets: 4, reps: '20-30', rest: 45 },
      { id: 'hn7', name: 'Afundo Alternado', muscleGroup: 'Pernas', sets: 4, reps: '10/10 a 15/15', rest: 45 },
      { id: 'hn8', name: 'Abdominal Crunch (Curto)', muscleGroup: 'Abdômen', sets: 4, reps: '20-30', rest: 45 },
      { id: 'hn9', name: 'Elevação Pélvica', muscleGroup: 'Glúteo', sets: 4, reps: '20-30', rest: 45 },
      { id: 'hn10', name: 'Prancha Isométrica', muscleGroup: 'CORE', sets: 4, reps: '45-60s', rest: 45 }
    ]
  },
  {
    id: 'h-sex',
    title: 'SEX: Queima Total (DIA DE CHOQUE) ⚡',
    description: 'DIA DE CHOQUE! Descanso de apenas 30 segundos. Acelere o metabolismo para o final de semana.',
    color: 'red',
    exercises: [
      { id: 'hn6', name: 'Agachamento Livre', muscleGroup: 'Pernas', sets: 4, reps: 'Máximas', rest: 30 },
      { id: 'hn7', name: 'Afundo Alternado', muscleGroup: 'Pernas', sets: 4, reps: 'Máximas', rest: 30 },
      { id: 'hn8', name: 'Abdominal Crunch (Curto)', muscleGroup: 'Abdômen', sets: 4, reps: 'Máximas', rest: 30 },
      { id: 'hn9', name: 'Elevação Pélvica', muscleGroup: 'Glúteo', sets: 4, reps: 'Máximas', rest: 30 },
      { id: 'hn10', name: 'Polichinelo "Baixo"', muscleGroup: 'Cardio', sets: 4, reps: 'Máximas', rest: 30, notes: 'Sem subir braços acima da linha do ombro.' }
    ]
  }
];
