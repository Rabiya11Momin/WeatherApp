import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Search, MapPin, Thermometer, Eye, Wind, Cloud } from 'lucide-react-native';
import { WeatherCard } from '@/components/WeatherCard';
import { WeatherService } from '@/services/WeatherService';
import { StorageService } from '@/services/StorageService';
import type { WeatherData } from '@/types/weather';

export default function WeatherScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchWeather = async () => {
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const weatherData = await WeatherService.getWeather(city.trim());
      setWeather(weatherData);
      await StorageService.addToHistory(city.trim());
      setCity('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getGradientColors = () => {
    if (!weather) return ['#3B82F6', '#1E40AF'];
    
    const condition = weather.weather[0].main.toLowerCase();
    switch (condition) {
      case 'clear':
        return ['#F59E0B', '#D97706'];
      case 'clouds':
        return ['#6B7280', '#4B5563'];
      case 'rain':
        return ['#1F2937', '#111827'];
      case 'snow':
        return ['#E5E7EB', '#D1D5DB'];
      default:
        return ['#3B82F6', '#1E40AF'];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Weather App</Text>
            <Text style={styles.subtitle}>Get weather for any city</Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter city name..."
                placeholderTextColor="#9CA3AF"
                value={city}
                onChangeText={setCity}
                onSubmitEditing={searchWeather}
                returnKeyType="search"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity 
              style={[styles.searchButton, loading && styles.searchButtonDisabled]}
              onPress={searchWeather}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {weather && (
            <View style={styles.weatherContainer}>
              <WeatherCard weather={weather} />
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Eye size={20} color="#ffffff" />
                    <Text style={styles.detailLabel}>Visibility</Text>
                    <Text style={styles.detailValue}>
                      {(weather.visibility / 1000).toFixed(1)} km
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Wind size={20} color="#ffffff" />
                    <Text style={styles.detailLabel}>Wind Speed</Text>
                    <Text style={styles.detailValue}>
                      {weather.wind.speed.toFixed(1)} m/s
                    </Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Thermometer size={20} color="#ffffff" />
                    <Text style={styles.detailLabel}>Feels Like</Text>
                    <Text style={styles.detailValue}>
                      {Math.round(weather.main.feels_like)}°C
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MapPin size={20} color="#ffffff" />
                    <Text style={styles.detailLabel}>Humidity</Text>
                    <Text style={styles.detailValue}>
                      {weather.main.humidity}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {!weather && !loading && !error && (
            <View style={styles.emptyState}>
              <Cloud size={80} color="rgba(255, 255, 255, 0.3)" />
              <Text style={styles.emptyText}>Search for a city to see weather</Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    height: '100%',
  },
  searchButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  weatherContainer: {
    gap: 20,
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  detailValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    gap: 16,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 18,
    textAlign: 'center',
  },
});