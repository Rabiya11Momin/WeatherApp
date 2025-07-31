import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Droplets } from 'lucide-react-native';
import type { WeatherData } from '@/types/weather';

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const getWeatherEmoji = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'drizzle':
        return '🌦️';
      case 'thunderstorm':
        return '⛈️';
      case 'snow':
        return '❄️';
      case 'mist':
      case 'fog':
        return '🌫️';
      default:
        return '🌤️';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.locationContainer}>
        <MapPin size={16} color="rgba(255, 255, 255, 0.8)" />
        <Text style={styles.location}>
          {weather.name}, {weather.sys.country}
        </Text>
      </View>

      <View style={styles.mainWeather}>
        <Text style={styles.emoji}>
          {getWeatherEmoji(weather.weather[0].main)}
        </Text>
        <Text style={styles.temperature}>
          {Math.round(weather.main.temp)}°C
        </Text>
      </View>

      <Text style={styles.description}>
        {weather.weather[0].description}
      </Text>

      <View style={styles.tempRange}>
        <Text style={styles.tempRangeText}>
          H: {Math.round(weather.main.temp_max)}°
        </Text>
        <Text style={styles.tempRangeText}>
          L: {Math.round(weather.main.temp_min)}°
        </Text>
      </View>

      <View style={styles.humidity}>
        <Droplets size={16} color="rgba(255, 255, 255, 0.8)" />
        <Text style={styles.humidityText}>
          {weather.main.humidity}% humidity
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  location: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
  mainWeather: {
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  temperature: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginBottom: 16,
  },
  tempRange: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  tempRangeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  humidity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  humidityText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});