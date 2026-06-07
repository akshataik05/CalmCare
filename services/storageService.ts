import { MoodEntry, ChatMessage, UserProfile } from '../types';

const KEYS = {
  MOOD_LOGS: 'aura_mood_logs',
  CHAT_HISTORY: 'aura_chat_history',
  USER_PROFILE: 'aura_user_profile',
};

export const storageService = {
  getMoodLogs: (): MoodEntry[] => {
    try {
      const item = localStorage.getItem(KEYS.MOOD_LOGS);
      return item ? JSON.parse(item) : [];
    } catch (e) {
      console.error('Failed to load mood logs', e);
      return [];
    }
  },

  saveMoodLog: (entry: MoodEntry) => {
    try {
      const logs = storageService.getMoodLogs();
      const updated = [...logs, entry];
      localStorage.setItem(KEYS.MOOD_LOGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save mood log', e);
      return [];
    }
  },

  getChatHistory: (): ChatMessage[] => {
    try {
      const item = localStorage.getItem(KEYS.CHAT_HISTORY);
      return item ? JSON.parse(item) : [];
    } catch (e) {
      console.error('Failed to load chat history', e);
      return [];
    }
  },

  saveChatHistory: (messages: ChatMessage[]) => {
    try {
      // Limit history to last 50 messages to save space/context window
      const trimmed = messages.slice(-50);
      localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  },

  getUserProfile: (): UserProfile | null => {
    try {
      const item = localStorage.getItem(KEYS.USER_PROFILE);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  },

  saveUserProfile: (profile: UserProfile) => {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  },
  
  clearData: () => {
      localStorage.removeItem(KEYS.MOOD_LOGS);
      localStorage.removeItem(KEYS.CHAT_HISTORY);
      localStorage.removeItem(KEYS.USER_PROFILE);
  }
};
