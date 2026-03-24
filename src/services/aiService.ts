import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ExerciseGuidance {
  name: string;
  setup: string[];
  execution: string[];
  commonMistakes: string[];
  breathing: string;
  proTips: string[];
}

export const getExerciseGuidance = async (exerciseName: string): Promise<ExerciseGuidance> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Forneça um guia técnico detalhado para a execução do exercício: ${exerciseName}. 
    O guia deve ser em português do Brasil e focado em musculação técnica.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          setup: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Passos para preparar o exercício (ajuste de banco, pegada, etc.)"
          },
          execution: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Passos detalhados da fase concêntrica e excêntrica"
          },
          commonMistakes: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Erros comuns que podem causar lesão ou reduzir eficiência"
          },
          breathing: { 
            type: Type.STRING,
            description: "Instrução de respiração durante o movimento"
          },
          proTips: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Dicas avançadas para maximizar o recrutamento muscular"
          }
        },
        required: ["name", "setup", "execution", "commonMistakes", "breathing", "proTips"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Resposta da IA vazia.");
  }

  return JSON.parse(response.text);
};
