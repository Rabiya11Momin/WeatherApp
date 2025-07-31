import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Clock, MapPin, Trash2 } from 'lucide-react-native';
import { StorageService } from '@/services/StorageService';
import { WeatherService } from '@/services/WeatherService';
import type { WeatherData } from '@/types/weather';

export default function HistoryScreen() {
  const [history, setHistory] = useState<string[]>([]);
  const [weatherCache, setWeatherCache] = useState<Record<string, WeatherData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const savedHistory = await StorageService.getHistory();
    setHistory(savedHistory);
    loadWeatherForCities(savedHistory);
  };

  const loadWeatherForCities = async (cities: string[]) => {
    const cache: Record<string, WeatherData> = {};
    
    for (const city of cities.slice(0, 5)) { // Load weather for last 5 cities
      try {
        const weather = await WeatherService.getWeather(city);
        cache[city] = weather;
      } catch (error) {
        // Ignore errors for cached weather
      }
    }
    
    setWeatherCache(cache);
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all search history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearHistory();
            setHistory([]);
            setWeatherCache({});
          },
        },
      ]
    );
  };

  const removeFromHistory = async (cityToRemove: string) => {
    const newHistory = history.filter(city => city !== cityToRemove);
    setHistory(newHistory);
    await StorageService.saveHistory(newHistory);
    
    const newCache = { ...weatherCache };
    delete newCache[cityToRemove];
    setWeatherCache(newCache);
  };

  const renderHistoryItem = ({ item }: { item: string }) => {
    const weather = weatherCache[item];
    
    return (
      <View style={styles.historyItem}>
        <View style={styles.historyContent}>
          <View style={styles.cityInfo}>
            <MapPin size={20} color="#3B82F6" />
            <Text style={styles.cityName}>{item}</Text>
          </View>
          
          {weather && (
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>
                {Math.round(weather.main.temp)}°C
              </Text>
              <Text style={styles.condition}>
                {weather.weather[0].description}
              </Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromHistory(item)}
        >
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Search History</Text>
            <Text style={styles.subtitle}>Your recent weather searches</Text>
          </View>
          
          {history.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
              <Trash2 size={20} color="#EF4444" />
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={80} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No search history</Text>
            <Text style={styles.emptyText}>
              Search for cities on the Weather tab to see them here
            </Text>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    marginTop: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  historyItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
  },
  weatherInfo: {
    alignItems: 'flex-end',
  },
  temperature: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  condition: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  removeButton: {
    padding: 8,
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});