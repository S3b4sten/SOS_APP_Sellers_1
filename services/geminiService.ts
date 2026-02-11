import { GoogleGenAI, Type } from "@google/genai";
import { GeminiSuggestion } from "../types";

export const getAIListingHelp = async (imageBase64: string, itemName?: string): Promise<GeminiSuggestion & { name: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyse cette image d'un article retourné.
  1. Identifie précisément l'objet et donne un nom clair et concis (max 40 caractères).
  2. Suggère un prix de revente juste en EUR pour un magasin de déstockage (reste réaliste pour un article d'occasion/retourné).
  3. Écris une description courte et accrocheuse en 2 phrases, en français, axée sur ses caractéristiques et sa valeur.
  4. Classe l'objet dans une catégorie (ex. Électronique, Maison, Cuisine, Mode, Jouets).
  ${itemName ? `Note: l'utilisateur pense que cet objet pourrait être "${itemName}".` : ""}
  Réponds uniquement en JSON.`;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: imageBase64.split(',')[1] || imageBase64,
    },
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }, imagePart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          suggestedPrice: { type: Type.NUMBER },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ["name", "suggestedPrice", "description", "category"],
      },
    },
  });

  try {
    const result = JSON.parse(response.text || '{}');
    return result as GeminiSuggestion & { name: string };
  } catch (e) {
    return {
      name: itemName || "Objet non identifié",
      suggestedPrice: 50,
      description: "Super objet en excellent état, une affaire à saisir !",
      category: "Divers"
    };
  }
};
