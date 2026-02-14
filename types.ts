
export interface TransactionData {
  // Transaction Details
  amt: number;
  category: string;
  trans_date_trans_time: string;
  
  // Cardholder Details
  gender: 'M' | 'F';
  city: string;
  state: string;
  job: string;
  dob: string;
  
  // Merchant Details
  merchant: string;
  merch_lat: number;
  merch_long: number;
  
  // Location Signals
  lat: number;
  long: number;
  city_pop: number;
}

export interface PredictionResult {
  isFraud: boolean;
  probability: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  reasoning: string[];
  features: {
    hour: number;
    day: number;
    month: number;
    age: number;
    distance_km: number;
  };
}

export enum TransactionCategory {
  ENTERTAINMENT = 'entertainment',
  FOOD_DINING = 'food_dining',
  GAS_TRANSPORT = 'gas_transport',
  GROCERY_NET = 'grocery_net',
  GROCERY_POS = 'grocery_pos',
  HEALTH_FITNESS = 'health_fitness',
  HOME = 'home',
  KIDS_PETS = 'kids_pets',
  MISC_NET = 'misc_net',
  MISC_POS = 'misc_pos',
  PERSONAL_CARE = 'personal_care',
  SHOPPING_NET = 'shopping_net',
  SHOPPING_POS = 'shopping_pos',
  TRAVEL = 'travel'
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
