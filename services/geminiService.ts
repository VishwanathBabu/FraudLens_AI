
import { GoogleGenAI, Type } from "@google/genai";
import { TransactionData, PredictionResult } from "../types";

export const analyzeTransaction = async (data: TransactionData): Promise<PredictionResult> => {
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  
  // Preprocessing (extracting temporal features)
  const transDate = new Date(data.trans_date_trans_time);
  const birthDate = new Date(data.dob);
  const hour = transDate.getHours();
  const day = transDate.getDay();
  const month = transDate.getMonth() + 1;
  const age = new Date().getFullYear() - birthDate.getFullYear();
  
  // Simple distance calculation (Haversine approximation for the prompt)
  const R = 6371; // Radius of the earth in km
  const dLat = (data.merch_lat - data.lat) * Math.PI / 180;
  const dLon = (data.merch_long - data.long) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(data.lat * Math.PI / 180) * Math.cos(data.merch_lat * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  const prompt = `
    You are a Fraud Detection Expert System specialized in the "Kartik2112" Kaggle Fraud Dataset.
    Analyze the following transaction data for potential fraud:
    
    TRANSACTION CONTEXT:
    - Amount: $${data.amt}
    - Category: ${data.category}
    - Time: ${hour}:00 (Hour of day)
    - Date: Day ${day} of week, Month ${month}
    - Distance to Merchant: ${distance.toFixed(2)} km
    
    CARDHOLDER PROFILE:
    - Age: ${age}
    - Gender: ${data.gender}
    - City Population: ${data.city_pop}
    - Job: ${data.job}
    - Location: ${data.city}, ${data.state}
    
    MERCHANT: ${data.merchant}
    
    BASED ON KARTIK2112 PATTERNS:
    1. Fraud often occurs at night (late hours).
    2. Fraud is more frequent in 'shopping_net', 'grocery_pos', and 'misc_net' categories.
    3. Unusually large amounts (e.g., >$500) are high risk.
    4. Large distances between merchant and cardholder are red flags.
    
    Predict if this is fraud and provide detailed reasoning.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isFraud: { type: Type.BOOLEAN },
          probability: { type: Type.NUMBER, description: "Confidence score from 0 to 1" },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
          reasoning: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          }
        },
        required: ["isFraud", "probability", "riskLevel", "reasoning"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  
  return {
    ...result,
    features: {
      hour,
      day,
      month,
      age,
      distance_km: distance
    }
  };
};
