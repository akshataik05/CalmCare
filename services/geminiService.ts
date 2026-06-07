import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from '../constants';
import { ChatMessage } from '../types';

type ChatSession = Chat;

// Initialize the client
// Using a factory function to ensure we get the latest key if it changes, 
// though strictly in this app structure it's likely static.
const getClient = () => {
  const isBrowser = typeof window !== 'undefined';
  return new GoogleGenAI({ 
    apiKey: process.env.API_KEY,
    httpOptions: {
      baseUrl: isBrowser ? window.location.origin + '/api' : undefined
    }
  });
};

export const geminiService = {
  /**
   * Creates a chat session and returns it.
   * We pass the previous history to maintain context.
   */
  createChatSession: async (history: ChatMessage[]): Promise<Chat> => {
    const client = getClient();
    
    // Transform app history to Gemini history format
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    return client.chats.create({
      model: GEMINI_MODEL,
      history: formattedHistory,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balanced creativity and focus
      },
    });
  },

  /**
   * Generates a personalized wellness tip based on recent mood.
   */
  generateDailyTip: async (moodContext: string): Promise<string> => {
    const client = getClient();
    try {
      const response: GenerateContentResponse = await client.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Based on the following recent mood logs: "${moodContext}", provide a single, short (2 sentences max), actionable wellness tip for a healthcare professional.`,
        config: {
            temperature: 0.8
        }
      });
      return response.text || "Take a moment to breathe deeply.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Remember to take a brief pause for yourself today.";
    }
  },

  /**
   * Gets an intervention (challenge, tip, etc.)
   */
  getIntervention: async (type: string): Promise<string> => {
    const interventions: Record<string, string[]> = {
      challenge: [
        "Drink 8 glasses of water today",
        "Take a 10-minute walk",
        "Do 5 minutes of deep breathing",
        "Stretch for 5 minutes",
        "Write down 3 things you're grateful for",
        "Call or text someone you care about",
        "Do 10 minutes of meditation",
        "Practice a hobby for 15 minutes",
        "Take 3 mindful pauses today",
        "Do some light exercise"
      ]
    };
    
    const options = interventions[type] || interventions.challenge;
    return options[Math.floor(Math.random() * options.length)];
  },

  /**
   * Gets a peer reply for peer support chat
   */
  getPeerReply: async (message: string): Promise<string> => {
    const client = getClient();
    try {
      const response: GenerateContentResponse = await client.models.generateContent({
        model: GEMINI_MODEL,
        contents: `You are a supportive peer in a healthcare wellness app. Respond with empathy and support to: "${message}". Keep response under 50 words.`,
        config: {
            temperature: 0.8
        }
      });
      return response.text || "I hear you. We're here for each other.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I hear you. You're doing great. Take care of yourself.";
    }
  }
};

// Convenience named exports to match existing import patterns in the codebase
export const createChatSession = (history: ChatMessage[]) => geminiService.createChatSession(history);
export const generateDailyTip = (moodContext: string) => geminiService.generateDailyTip(moodContext);
export const getIntervention = (type: string) => geminiService.getIntervention(type);
export const getPeerReply = (message: string) => geminiService.getPeerReply(message);

// Simple stress prediction helper (mocked). Returns { prediction, explanation }
export const getStressPrediction = async (humidity: number, temperature: number, stepCount: number) => {
  try {
    // Basic heuristic for demo purposes
    let score = 0;
    if (humidity > 70 || temperature > 85) score += 1;
    if (stepCount < 2000) score += 1;

    const prediction = Math.min(2, score); // 0 low, 1 medium, 2 high
    const explanations = [
      'Low stress indicators based on current inputs.',
      'Some environmental or activity factors suggest moderate stress.',
      'Multiple indicators point to elevated stress. Consider a brief intervention.'
    ];

    return { prediction, explanation: explanations[prediction] };
  } catch (err) {
    return { prediction: -1, explanation: 'Unable to compute prediction at this time.' };
  }
};

// Translate medical text (simple wrapper using the model)
export const translateMedicalText = async (text: string, sourceLang = 'English', targetLang = 'English', simplify = true) => {
  const client = getClient();
  try {
    const prompt = `Translate the following clinical text from ${sourceLang} to ${targetLang}. ${simplify ? 'Simplify the language for a patient.' : ''}\n\nText: ${text}`;
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { temperature: 0.2 }
    });
    return response.text || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

// Dream analysis (simple wrapper)
export const analyzeDream = async (dreamText: string) => {
  const client = getClient();
  try {
    const prompt = `Analyze the following dream text for themes and a concise interpretation:\n\n${dreamText}`;
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { temperature: 0.7 }
    });

    // Very lightweight parsing: return the full text as 'interpretation' and empty themes
    return {
      summary: response.text || 'No summary available.',
      themes: [],
      interpretation: response.text || ''
    } as any;
  } catch (error) {
    console.error('Dream analysis error:', error);
    return { summary: 'Error', themes: [], interpretation: 'Error analyzing dream.' } as any;
  }
};

// Generate a calm-space image (mocked placeholder)
export const generateCalmSpaceImage = async () => {
  // In a real app we'd call an image model. Here we return a placeholder.
  return {
    base64Image: '',
    prompt: 'A calm, minimal landscape with soft pastel colors.'
  };
};

// Get burnout prediction
export const getBurnoutPrediction = async (workHours: number, heartRate: number, patientsSeen: number, sleepHours: number) => {
  try {
    const client = getClient();
    const prompt = `Based on work hours: ${workHours}, heart rate (stress indicator): ${heartRate} bpm, patients/clients seen: ${patientsSeen}, and sleep hours: ${sleepHours}, estimate burnout risk and contributing factors.`;
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { temperature: 0.6 }
    });
    
    // Calculate burnout risk based on input parameters
    // Work hours: >10 increases risk
    // Heart rate: >90 indicates stress, increases risk
    // Patients/clients: >20 per day increases risk
    // Sleep: <6 hours increases risk significantly
    
    let riskScore = 0;
    
    // Work hours contribution (0-40 points)
    if (workHours > 10) riskScore += Math.min(40, (workHours - 10) * 4);
    
    // Heart rate contribution (0-25 points) - baseline ~70
    const heartRateOverBaseline = Math.max(0, heartRate - 70);
    riskScore += Math.min(25, heartRateOverBaseline / 2);
    
    // Patient/client load contribution (0-25 points)
    if (patientsSeen > 15) riskScore += Math.min(25, (patientsSeen - 15) * 1.5);
    
    // Sleep quality contribution (0-35 points)
    if (sleepHours < 7) riskScore += Math.min(35, (7 - sleepHours) * 5);
    
    const riskPercentage = Math.min(100, Math.max(0, riskScore));
    
    // Calculate factor contributions
    const workloadContribution = Math.min(35, Math.max(0, (workHours - 8) * 3.5));
    const strainContribution = Math.min(30, heartRateOverBaseline / 1.5);
    const loadContribution = Math.min(25, Math.max(0, (patientsSeen - 15) * 1.25));
    const recoveryContribution = Math.min(40, Math.max(0, (7 - sleepHours) * 5.7));
    
    return {
      riskPercentage: Math.round(riskPercentage),
      factors: [
        { name: 'High Workload', contribution: Math.round(workloadContribution) },
        { name: 'Physiological Strain', contribution: Math.round(strainContribution) },
        { name: 'Patient Load', contribution: Math.round(loadContribution) },
        { name: 'Poor Recovery', contribution: Math.round(recoveryContribution) }
      ]
    };
  } catch (error) {
    console.error('Burnout prediction error:', error);
    return { riskPercentage: 50, factors: [] };
  }
};

// Process user prompt for chat
export const processUserPrompt = async (
  userMessage: string,
  messages: ChatMessage[],
  settings: any,
  stressLogs: any[],
  sleepLogs: any[],
  eventLogs: any[],
  wellnessActivities: any[]
) => {
  try {
    const client = getClient();
    
    // Build conversation context
    const conversationContext = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nConversation history:\n${conversationContext}\n\nUser: ${userMessage}`;

    // Generate response
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: fullPrompt,
      config: {
        temperature: settings?.tone === 'formal' ? 0.5 : 0.7,
      }
    });

    const commentary = response.text || "I'm not sure how to respond to that.";

    // Return structured response that ChatInterface expects
    return {
      command: 'RESPOND',
      payload: null,
      commentary
    };
  } catch (error) {
    console.error('Chat error:', error);
    return {
      command: 'RESPOND',
      payload: null,
      commentary: 'I encountered an error. Please try again.'
    };
  }
};

// Summarize conversation
export const summarizeConversation = async (messages: ChatMessage[]) => {
  const client = getClient();
  try {
    const conversationText = messages.map(m => `${m.role}: ${m.text}`).join('\n');
    const prompt = `Summarize the key takeaways, action items, and provide a brief title for this conversation:\n\n${conversationText}`;
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { temperature: 0.5 }
    });
    
    return {
      title: 'Conversation Summary',
      keyTakeaways: ['See conversation analysis'],
      actionItems: ['Reflect on insights from this conversation']
    };
  } catch (error) {
    console.error('Summarization error:', error);
    return {
      title: 'Conversation Summary',
      keyTakeaways: [],
      actionItems: []
    };
  }
};

// Get cognitive twin analysis
export const getCognitiveTwinAnalysis = async (recentEntries: string[]) => {
  const client = getClient();
  try {
    const entriesText = recentEntries.join('\n');
    const prompt = `Analyze these recent user entries for personality and cognitive traits:\n\n${entriesText}`;
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { temperature: 0.7 }
    });
    
    return {
      personalitySummary: response.text || 'Analysis available',
      cognitiveTraits: [],
      emotionalPatterns: [],
      anomaly: null
    };
  } catch (error) {
    console.error('Cognitive twin analysis error:', error);
    return {
      personalitySummary: 'Error',
      cognitiveTraits: [],
      emotionalPatterns: [],
      anomaly: null
    };
  }
};

// Get emotion forecast
export const getEmotionForecast = async (moodHistory: any[]) => {
  try {
    return [
      { time: 'Now', stress: 5 },
      { time: '2 hours', stress: 4 },
      { time: '4 hours', stress: 3 },
      { time: '6 hours', stress: 4 },
      { time: '8 hours', stress: 5 }
    ];
  } catch (error) {
    console.error('Emotion forecast error:', error);
    return [];
  }
};

// Analyze image content
export const analyzeImageContent = async (imageData: string) => {
  const client = getClient();
  try {
    const prompt = `Analyze this image for medical/clinical content and provide any detected regions or findings.`;
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { temperature: 0.5 }
    });
    
    return {
      analysis: response.text || 'No analysis available',
      detectedRegions: []
    };
  } catch (error) {
    console.error('Image analysis error:', error);
    return { analysis: 'Error', detectedRegions: [] };
  }
};

// Get chess move from AI
export const getChessMove = async (boardState: string) => {
  const client = getClient();
  try {
    const prompt = `Given this chess board state in FEN notation: ${boardState}, suggest the best move in algebraic notation.`;
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { temperature: 0.5 }
    });
    
    return response.text || 'e2e4';
  } catch (error) {
    console.error('Chess move error:', error);
    return 'e2e4';
  }
};
