
import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutRoutine } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Get workout advice based on user goal
export const getWorkoutAdvice = async (workout: WorkoutRoutine, userGoal: string) => {
  try {
    const prompt = `Analise o seguinte treino de academia e dê 3 dicas rápidas para otimizar os resultados focando em ${userGoal}.
    Treino: ${workout.title}
    Exercícios: ${workout.exercises.map(e => e.name).join(', ')}
    
    Retorne a resposta em formato JSON com as chaves: 'tips' (array de strings) e 'motivation' (string curta).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de dicas técnicas para o treino"
            },
            motivation: {
              type: Type.STRING,
              description: "Mensagem motivacional curta"
            }
          },
          required: ["tips", "motivation"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { tips: ["Mantenha a constância", "Beba água", "Descanse bem"], motivation: "Foco no progresso!" };
  }
};

// Chat with the personal trainer AI
export const chatWithPersonal = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  // Use ai.chats.create to start/continue a conversation with history
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    // In @google/genai, history is passed to create for stateful chats
    history: history as any,
    config: {
      systemInstruction: "Você é um personal trainer de elite chamado Tatu. Seja motivador, técnico e direto. Seu tom é profissional mas amigável, focado em ajudar o usuário a extrair o máximo de cada treino."
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text || "";
};
