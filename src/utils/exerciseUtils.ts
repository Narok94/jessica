
/**
 * Normaliza o nome do exercício para o padrão de arquivo do GitHub
 * Ex: "Supino Reto" -> "supino-reto"
 */
export const normalizeExerciseName = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, "-")           // Espaços para hifens
    .replace(/[^a-z0-9-]/g, "")     // Remove caracteres especiais
    .replace(/-+/g, "-")            // Remove hifens duplos
    .trim();
};

/**
 * Retorna a URL do GIF do exercício no repositório do GitHub
 */
export const getExerciseGifUrl = (exerciseName: string): string => {
  const normalized = normalizeExerciseName(exerciseName);
  return `https://raw.githubusercontent.com/Narok94/tatu-gym-assets/main/${normalized}.gif`;
};
