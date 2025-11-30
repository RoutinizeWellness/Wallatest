import { GoogleGenAI, Type } from "@google/genai";
import { Listing } from "../types";

// NOTE: In a production environment, API calls should be proxied through a backend (Convex)
// to protect the API Key. For this demo, we use the key from the environment directly.
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key missing. AI features will run in mock mode.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Analyzes an image to suggest listing details.
 */
export const analyzeItemImage = async (base64Image: string): Promise<Partial<Listing> | null> => {
  const ai = getAiClient();
  
  // Mock fallback if no API key
  if (!ai) {
    await new Promise(r => setTimeout(r, 1500));
    return {
      title: "Cámara Vintage Analógica",
      description: "Cámara clásica en buen estado. Ideal para coleccionistas o amantes de la fotografía retro. Parece ser un modelo de los años 80.",
      price: 45,
      category: "Fotografía",
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Eres un experto vendedor de segunda mano. Analiza esta imagen y genera un título atractivo (max 50 caracteres), una descripción detallada (max 200 caracteres), una categoría sugerida y un precio estimado en EUR para venderlo rápido. Responde en JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            price: { type: Type.NUMBER },
          },
          required: ["title", "description", "category", "price"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (error) {
    console.error("Error generating listing details:", error);
  }
  return null;
};

/**
 * Suggests chat replies based on conversation history.
 */
export const suggestChatReplies = async (
  lastMessage: string, 
  productContext: string
): Promise<string[]> => {
  const ai = getAiClient();

  if (!ai) {
    return ["¡Hola! ¿Sigue disponible?", "¿El precio es negociable?", "Me interesa, ¿haces envíos?"];
  }

  try {
    const prompt = `
      Contexto: Venta de un producto de segunda mano: "${productContext}".
      Último mensaje recibido: "${lastMessage}".
      
      Genera 3 respuestas cortas, educadas y estratégicas para continuar la negociación. 
      Devuélvelas en un array JSON de strings.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (error) {
    console.error("Error generating replies:", error);
  }

  return [];
};

/**
 * Chatbot logic using gemini-3-pro-preview
 */
export const getBotResponse = async (history: { role: 'user' | 'model'; text: string }[], newMessage: string): Promise<string> => {
  const ai = getAiClient();

  if (!ai) {
    return "Hola, soy Wallabot. Parece que no tengo configurada mi API Key, pero estoy aquí para ayudarte a comprar y vender de forma segura.";
  }

  try {
    // Construct the conversation history for the model
    // Note: 'model' role is correct for Gemini, 'assistant' is OpenAI style
    const contents = [
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: newMessage }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: contents,
      config: {
        systemInstruction: "Eres Wallabot, el asistente virtual inteligente de Wallaplus. Ayudas a los usuarios con dudas sobre la app, consejos para vender mejor sus productos, tips de seguridad para evitar estafas y soporte general. Eres amable, conciso y utilizas emojis ocasionalmente. Si te preguntan por precios, dales rangos estimados genéricos.",
      }
    });

    return response.text || "Lo siento, no he podido procesar tu solicitud en este momento.";
  } catch (error) {
    console.error("Error in bot response:", error);
    return "Lo siento, ha ocurrido un error al conectar con mis circuitos neuronales.";
  }
};