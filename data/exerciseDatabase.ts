
import { getExerciseGifUrl } from '../src/utils/exerciseUtils';

export interface BaseExercise {
  name: string;
  muscleGroup: string;
  defaultSets: number;
  defaultReps: string;
  defaultRest: number;
  image?: string;
}

export const exerciseDatabase: BaseExercise[] = [
  // PEITO
  { name: 'Supino Máquina', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Supino Máquina') },
  { name: 'Supino Reto Barra', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Supino Reto Barra') },
  { name: 'Supino Inclinado Barra', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Supino Inclinado Barra') },
  { name: 'Supino Inclinado iso articulado deitado (shua)', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Supino inclinado iso articulado deitado (shua)') },
  { name: 'Crucifixo Máquina', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Crucifixo Máquina') },
  { name: 'Crucifixo Banco Halteres', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Crucifixo Banco Halteres') },
  { name: 'Flexão de Braços', muscleGroup: 'Peito', defaultSets: 3, defaultReps: 'Máx', defaultRest: 60, image: getExerciseGifUrl('Flexão de Braços') },
  { name: 'Peck Deck (Voador)', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Peck Deck') },
  { name: 'Supino Reto Halteres', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Supino Reto Halteres') },
  { name: 'Supino Inclinado Halteres', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Supino Inclinado Halteres') },

  { name: 'Supino Máquina', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Supino Máquina') },
  { name: 'Crucifixo máquina', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Crucifixo máquina') },
  { name: 'Supino inclinado iso articulado deitado (shua)', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Supino inclinado iso articulado deitado (shua)') },

  // COSTAS
  { name: 'Puxada anterior', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Puxada anterior') },
  { name: 'Puxada frente', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Puxada frente') },
  { name: 'Pulley anterior aberta', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Pulley anterior aberta') },
  { name: 'Puxada supinada', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Puxada supinada') },
  { name: 'Remada articulada neutra', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Remada articulada neutra') },
  { name: 'Remada baixa peg. neutra', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Remada baixa peg. neutra') },
  { name: 'Remada baixa', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Remada baixa') },
  { name: 'Puxada Triângulo', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Puxada Triângulo') },
  { name: 'Remada Curvada Barra', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '8-12', defaultRest: 90, image: getExerciseGifUrl('Remada Curvada Barra') },
  { name: 'Remada Cavalinho', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '8-12', defaultRest: 90, image: getExerciseGifUrl('Remada Cavalinho') },

  // OMBROS
  { name: 'Elevação lateral', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Elevação lateral') },
  { name: 'Elevação frontal', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Elevação frontal') },
  { name: 'Elevação lateral c/ halter 0º-180º neutra', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Elevação lateral c/ halter 0º-180º neutra') },
  { name: 'Desenvolvimento Máquina', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Desenvolvimento Máquina') },
  { name: 'Crucifixo inverso máquina pronada', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Crucifixo inverso máquina pronada') },
  { name: 'Remada Alta Kettlebell', muscleGroup: 'Trapézio/Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Remada Alta Kettlebell') },
  { name: 'Desenvolvimento Arnold', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Desenvolvimento Arnold') },

  // BÍCEPS
  { name: 'Rosca direta', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca direta') },
  { name: 'Rosca alternada', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca alternada') },
  { name: 'Rosca martelo no cross corda', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca martelo no cross corda') },
  { name: 'Rosca direta pulley', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca direta pulley') },
  { name: 'Rosca direta barra w', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca direta barra w') },
  { name: 'Rosca direta pegada aberta', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca direta pegada aberta') },
  { name: 'Rosca direta pegada fechada', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca direta pegada fechada') },
  { name: 'Biceps concentrado', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Biceps concentrado') },
  { name: 'Biceps polia alta', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Biceps polia alta') },
  { name: 'Rosca concentrada', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca concentrada') },
  { name: 'Rosca martelo', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca martelo') },
  { name: 'Rosca no Cabo Deitado', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca no Cabo Deitado') },
  { name: 'Rosca Scott', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Rosca Scott') },

  // TRÍCEPS
  { name: 'Tríceps no cross', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Tríceps no cross') },
  { name: 'Tríceps corda', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Tríceps corda') },
  { name: 'Tríceps francês', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Tríceps francês') },
  { name: 'Tríceps testa', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Tríceps testa') },

  // PERNAS
  { name: 'Leg press', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 90, image: getExerciseGifUrl('Leg press') },
  { name: 'Agachamento livre', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 90, image: getExerciseGifUrl('Agachamento livre') },
  { name: 'Agachamento Livre Banco', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Agachamento Livre Banco') },
  { name: 'Cadeira extensora', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Cadeira extensora') },
  { name: 'Cadeira flexora', muscleGroup: 'Posterior', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Cadeira flexora') },
  { name: 'Cadeira Adutora', muscleGroup: 'Adutores', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Cadeira Adutora') },
  { name: 'Afundo', muscleGroup: 'Pernas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Afundo') },
  { name: 'Panturrilha em pe', muscleGroup: 'Panturrilha', defaultSets: 3, defaultReps: '15', defaultRest: 45, image: getExerciseGifUrl('Panturrilha em pe') },
  { name: 'Panturrilha em pé inclinado', muscleGroup: 'Panturrilha', defaultSets: 3, defaultReps: '15', defaultRest: 45, image: getExerciseGifUrl('Panturrilha em pé inclinado') },

  // ABDÔMEN / CORE
  { name: 'Abdomen Reto', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '15-20', defaultRest: 45, image: getExerciseGifUrl('Abdomen Reto') },
  { name: 'Abdomen Infra (Pingus)', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '15-20', defaultRest: 45, image: getExerciseGifUrl('Abdomen Infra (Pingus)') },
  { name: 'Prancha', muscleGroup: 'CORE', defaultSets: 3, defaultReps: '60s', defaultRest: 45, image: getExerciseGifUrl('Prancha') },
];
