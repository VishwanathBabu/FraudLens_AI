# FraudLens AI

React-based credit card fraud detection system.

🛡️ FraudLens AI: Advanced Neural Fraud Detection Dashboard
FraudLens AI is a high-performance, real-time credit card fraud detection dashboard. It leverages the power of Gemini 3 Flash to perform deep neural auditing of financial transactions, providing instant risk scores and human-readable reasoning for suspicious activities.
🚀 Key Features
Neural Risk Auditing: Real-time transaction analysis powered by the Gemini API, trained to recognize complex fraud patterns (based on Kartik2112 dataset features).
Explainable AI (XAI): Doesn't just flag transactions—it provides detailed "Key Signals" explaining the specific logic behind every risk score.
Geospatial Intelligence: Analyzes the distance and relationship between cardholder location and merchant coordinates.
Identity Synthesis: Evaluates occupation, age, and demographic metadata to identify behavioral anomalies.
Interactive Testing: Built-in scenario randomizer to test high-risk vs. low-risk transaction profiles instantly.
Modern UX: A beautiful, responsive "Glassmorphism" interface built with React, Tailwind CSS, and Lucide Icons.
🛠️ Tech Stack
Framework: React 19 (TypeScript)
AI Engine: Google Gemini 3 Flash
Styling: Tailwind CSS (Dark Mode optimized)
Icons: Lucide React
Deployment: Vite-ready ESM architecture
📖 How It Works
The dashboard takes raw transaction signals—amount, category, merchant location, and cardholder metadata—and passes them to a specialized prompt engineered for the Gemini 3 Flash model. The model acts as an expert financial auditor, returning a structured risk profile including probability scores, severity levels, and specific behavioral reasoning.
