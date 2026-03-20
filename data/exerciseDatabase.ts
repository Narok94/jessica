
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
  { name: 'Supino Reto Barra', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Supino Reto Barra') },
  { name: 'Supino Inclinado Barra', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Supino Inclinado Barra') },
  { name: 'Supino Reto Halteres', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Supino Reto Halteres') },
  { name: 'Supino Inclinado Halteres', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Supino Inclinado Halteres') },
  { name: 'Supino Máquina', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Supino Máquina') },
  { name: 'Crucifixo Máquina', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Crucifixo Máquina') },
  { name: 'Crucifixo Banco Halteres', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Crucifixo Banco Halteres') },
  { name: 'Peck Deck (Voador)', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Peck Deck') },
  { name: 'Flexão de Braços', muscleGroup: 'Peito', defaultSets: 3, defaultReps: 'Máx', defaultRest: 60, image: getExerciseGifUrl('Flexão de Braços') },
  { name: 'Crossover Polia Alta', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Crossover Polia Alta') },
  { name: 'Dips (Paralelas)', muscleGroup: 'Peito/Tríceps', defaultSets: 3, defaultReps: 'Máx', defaultRest: 90, image: getExerciseGifUrl('Dips') },

  // COSTAS
  { name: 'Puxada Frente Aberta', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Puxada Frente Aberta') },
  { name: 'Puxada Triângulo', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Puxada Triângulo') },
  { name: 'Puxada Supinada', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Puxada Supinada') },
  { name: 'Remada Baixa', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Remada Baixa') },
  { name: 'Remada Curvada Barra', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '8-12', defaultRest: 90, image: getExerciseGifUrl('Remada Curvada Barra') },
  { name: 'Remada Unilateral (Serrote)', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Remada Unilateral') },
  { name: 'Remada Articulada', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Remada Articulada') },
  { name: 'Pulldown Corda', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Pulldown Corda') },
  { name: 'Barra Fixa', muscleGroup: 'Costas', defaultSets: 3, defaultReps: 'Máx', defaultRest: 90, image: getExerciseGifUrl('Barra Fixa') },
  { name: 'Levantamento Terra', muscleGroup: 'Costas/Pernas', defaultSets: 3, defaultReps: '6-8', defaultRest: 120, image: getExerciseGifUrl('Levantamento Terra') },

  // OMBROS
  { name: 'Desenvolvimento Halteres', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Desenvolvimento Halteres') },
  { name: 'Desenvolvimento Máquina', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Desenvolvimento Máquina') },
  { name: 'Elevação Lateral', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Elevação Lateral') },
  { name: 'Elevação Frontal', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Elevação Frontal') },
  { name: 'Crucifixo Inverso', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Crucifixo Inverso') },
  { name: 'Remada Alta', muscleGroup: 'Ombros/Trapézio', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Remada Alta') },
  { name: 'Encolhimento', muscleGroup: 'Trapézio', defaultSets: 3, defaultReps: '15-20', defaultRest: 60, image: getExerciseGifUrl('Encolhimento') },

  // BÍCEPS
  { name: 'Rosca Direta Barra', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Rosca Direta Barra') },
  { name: 'Rosca Alternada', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Rosca Alternada') },
  { name: 'Rosca Martelo', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Rosca Martelo') },
  { name: 'Rosca Scott', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Rosca Scott') },
  { name: 'Rosca Concentrada', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca Concentrada') },
  { name: 'Rosca Direta Polia', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Rosca Direta Polia') },

  // TRÍCEPS
  { name: 'Tríceps Pulley (Corda)', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Tríceps Corda') },
  { name: 'Tríceps Pulley (Barra)', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Tríceps Barra') },
  { name: 'Tríceps Testa', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Tríceps Testa') },
  { name: 'Tríceps Francês', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Tríceps Francês') },
  { name: 'Tríceps Coice', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Tríceps Coice') },
  { name: 'Mergulho no Banco', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Tríceps Banco') },

  // PERNAS (QUADRÍCEPS)
  { name: 'Agachamento Livre', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Agachamento Livre') },
  { name: 'Leg Press 45', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 90, image: getExerciseGifUrl('Leg Press 45') },
  { name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Cadeira Extensora') },
  { name: 'Hack Machine', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Hack Machine') },
  { name: 'Agachamento Sumô', muscleGroup: 'Quadríceps/Glúteos', defaultSets: 3, defaultReps: '12-15', defaultRest: 90, image: getExerciseGifUrl('Agachamento Sumô') },
  { name: 'Agachamento Hack', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Agachamento Hack') },
  { name: 'Sissy Squat', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Sissy Squat') },
  { name: 'Afundo com Halteres', muscleGroup: 'Quadríceps/Glúteos', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Afundo com Halteres') },
  { name: 'Agachamento Búlgaro', muscleGroup: 'Quadríceps/Glúteos', defaultSets: 3, defaultReps: '10-12', defaultRest: 60, image: getExerciseGifUrl('Agachamento Búlgaro') },

  // PERNAS (POSTERIOR)
  { name: 'Cadeira Flexora', muscleGroup: 'Posterior', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Cadeira Flexora') },
  { name: 'Mesa Flexora', muscleGroup: 'Posterior', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Mesa Flexora') },
  { name: 'Stiff Barra', muscleGroup: 'Posterior', defaultSets: 3, defaultReps: '10-12', defaultRest: 90, image: getExerciseGifUrl('Stiff Barra') },
  { name: 'Flexora em Pé', muscleGroup: 'Posterior', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Flexora em Pé') },

  // GLÚTEOS
  { name: 'Elevação Pélvica', muscleGroup: 'Glúteos', defaultSets: 3, defaultReps: '12-15', defaultRest: 90, image: getExerciseGifUrl('Elevação Pélvica') },
  { name: 'Cadeira Abdutora', muscleGroup: 'Glúteos', defaultSets: 3, defaultReps: '15-20', defaultRest: 60, image: getExerciseGifUrl('Cadeira Abdutora') },
  { name: 'Glúteo Cabo (Coice)', muscleGroup: 'Glúteos', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Glúteo Cabo') },
  { name: 'Abdução de Quadril com Cabo', muscleGroup: 'Glúteos', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Abdução de Quadril com Cabo') },
  { name: 'Abdução de Quadril com Ponte', muscleGroup: 'Glúteos', defaultSets: 3, defaultReps: '15-20', defaultRest: 60, image: getExerciseGifUrl('Abdução de Quadril com Ponte') },
  { name: 'Glúteo Máquina', muscleGroup: 'Glúteos', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Glúteo Máquina') },

  // ADUTORES
  { name: 'Cadeira Adutora', muscleGroup: 'Adutores', defaultSets: 3, defaultReps: '15-20', defaultRest: 60, image: getExerciseGifUrl('Cadeira Adutora') },
  { name: 'Adução na Polia', muscleGroup: 'Adutores', defaultSets: 3, defaultReps: '12-15', defaultRest: 60, image: getExerciseGifUrl('Adução na Polia') },

  // PANTURRILHA
  { name: 'Panturrilha em Pé', muscleGroup: 'Panturrilha', defaultSets: 4, defaultReps: '15-20', defaultRest: 45, image: getExerciseGifUrl('Panturrilha em Pé') },
  { name: 'Panturrilha Sentado', muscleGroup: 'Panturrilha', defaultSets: 4, defaultReps: '15-20', defaultRest: 45, image: getExerciseGifUrl('Panturrilha Sentado') },

  // ABDÔMEN
  { name: 'Abdominal Supra', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '20-30', defaultRest: 45, image: getExerciseGifUrl('Abdominal Supra') },
  { name: 'Abdominal Infra', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '15-20', defaultRest: 45, image: getExerciseGifUrl('Abdominal Infra') },
  { name: 'Abdominal Bicicleta', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '20-30', defaultRest: 45, image: getExerciseGifUrl('Abdominal Bicicleta') },
  { name: 'Prancha Abdominal', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '45-60s', defaultRest: 45, image: getExerciseGifUrl('Prancha') },
  { name: 'Abdominal Máquina', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '15-20', defaultRest: 60, image: getExerciseGifUrl('Abdominal Máquina') },

  // ALONGAMENTO
  { name: 'Alongamento de Peitoral', muscleGroup: 'Alongamento', defaultSets: 1, defaultReps: '30s', defaultRest: 0, image: getExerciseGifUrl('Alongamento de Peitoral') },
  { name: 'Alongamento de Quadríceps', muscleGroup: 'Alongamento', defaultSets: 1, defaultReps: '30s', defaultRest: 0, image: getExerciseGifUrl('Alongamento de Quadríceps') },
  { name: 'Alongamento de Posterior', muscleGroup: 'Alongamento', defaultSets: 1, defaultReps: '30s', defaultRest: 0, image: getExerciseGifUrl('Alongamento de Posterior') },
  { name: 'Alongamento de Glúteos', muscleGroup: 'Alongamento', defaultSets: 1, defaultReps: '30s', defaultRest: 0, image: getExerciseGifUrl('Alongamento de Glúteos') },
  { name: 'Alongamento de Ombros', muscleGroup: 'Alongamento', defaultSets: 1, defaultReps: '30s', defaultRest: 0, image: getExerciseGifUrl('Alongamento de Ombros') },
];
