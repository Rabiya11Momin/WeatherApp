import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'weather_search_history';
const MAX_HISTORY_ITEMS = 20;

export class StorageService {
  static async getHistory(): Promise<string[]> {
    try {
      const history = await AsyncStorage.getItem(HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading search history:', error);
      return [];
    }
  }

  static async addToHistory(city: string): Promise<void> {
    try {
      const history = await this.getHistory();
      
      // Remove city if it already exists
      const filteredHistory = history.filter(
        item => item.toLowerCase() !== city.toLowerCase()
      );
      
      // Add city to the beginning
      const newHistory = [city, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  static async saveHistory(history: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }
}