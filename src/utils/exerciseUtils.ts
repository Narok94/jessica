
/**
 * Utilitários para manipulação de dados de exercícios
 */

/**
 * Normaliza o nome do exercício para ser usado em URLs e IDs
 */
export const normalizeExerciseName = (name: string): string => {
  if (!name) return '';
  
  // Mapeamento manual para casos específicos conhecidos
  const manualMap: Record<string, string> = {
    'Agachamento Livre': 'agachamento-livre',
    'Agachamento no Smith': 'agachamento-smith',
    'Leg Press 45': 'leg-press-45',
    'Extensora': 'cadeira-extensora',
    'Flexora': 'cadeira-flexora',
    'Supino Reto': 'supino-reto',
    'Supino Inclinado': 'supino-inclinado',
    'Puxada Aberta': 'puxada-frente',
    'Remada Curvada': 'remada-curvada',
    'Desenvolvimento': 'desenvolvimento-ombros',
    'Elevação Lateral': 'elevacao-lateral',
    'Rosca Direta': 'rosca-direta',
    'Tríceps Corda': 'triceps-corda',
    'Tríceps Testa': 'triceps-testa',
    'Panturrilha em Pé': 'panturrilha-pe',
    'Panturrilha Sentado': 'panturrilha-sentado',
    'Abdominal Supra': 'abdominal-supra',
    'Prancha': 'prancha-abdominal'
  };

  if (manualMap[name]) return manualMap[name];

  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, "-")           // Espaços para hífens
    .replace(/[^a-z0-9-]/g, "")     // Remove caracteres especiais
    .replace(/-+/g, "-")            // Remove hífens duplos
    .replace(/^-|-$/g, "");         // Remove hífens no início/fim
};

/**
 * Gera variações de URLs para tentar carregar o GIF/Vídeo do exercício
 */
export const getExerciseGifUrlVariations = (exerciseName: string, originalUrl?: string): string[] => {
  const urls: string[] = [];
  
  // 1. Prioridade máxima: URL original se fornecida
  if (originalUrl) {
    urls.push(originalUrl);
  }

  const normalized = normalizeExerciseName(exerciseName);
  if (!normalized) return urls.length > 0 ? urls : ['https://picsum.photos/seed/gym/400/300'];

  // 2. Variações de base para o repositório de assets
  const baseVariations = [
    normalized,
    normalized.replace(/-/g, '_'),
    normalized.replace(/-/g, ''),
    normalized.split('-')[0] // Apenas a primeira palavra (ex: 'agachamento')
  ];

  const uniqueVariations = Array.from(new Set(baseVariations)).slice(0, 3);
  
  // 3. Extensões e pastas mais comuns
  const extensions = ['.gif', '.mp4', '.webp'];
  const folders = ['', 'assets/', 'gifs/'];
  
  // Construímos uma lista pequena e eficiente (máximo ~20 URLs)
  uniqueVariations.forEach(v => {
    const encoded = encodeURIComponent(v);
    folders.forEach(folder => {
      extensions.forEach(ext => {
        const filename = `${encoded}${ext}`;
        // GitHub Raw (Prioridade para arquivos diretos)
        urls.push(`https://raw.githubusercontent.com/Narok94/tatu-gym-assets/main/${folder}${filename}`);
      });
    });
  });

  // 4. Fallback final: jsDelivr de uma variação segura
  urls.push(`https://cdn.jsdelivr.net/gh/Narok94/tatu-gym-assets@main/assets/${encodeURIComponent(normalized)}.gif`);
  
  // Remove duplicatas e limita para não demorar demais
  return Array.from(new Set(urls)).slice(0, 12);
};

/**
 * Alias para getExerciseGifUrlVariations para compatibilidade com código antigo
 */
export const getExerciseGifUrl = (exerciseName: string, originalUrl?: string): string => {
  const variations = getExerciseGifUrlVariations(exerciseName, originalUrl);
  return variations[0] || 'https://picsum.photos/seed/gym/400/300';
};
