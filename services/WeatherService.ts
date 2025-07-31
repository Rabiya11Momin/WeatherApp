import type { WeatherData } from '@/types/weather';

const API_KEY = 'demo_key'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  static async getWeather(city: string): Promise<WeatherData> {
    // For demo purposes, return mock data
    // In a real app, you would make the actual API call
    if (API_KEY === 'demo_key') {
      return this.getMockWeatherData(city);
    }

    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        }
        throw new Error('Failed to fetch weather data. Please try again.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  }

  private static getMockWeatherData(city: string): WeatherData {
    // Mock data for demonstration
    const mockConditions = ['Clear', 'Clouds', 'Rain', 'Snow'];
    const randomCondition = mockConditions[Math.floor(Math.random() * mockConditions.length)];
    const baseTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C

    return {
      name: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
      main: {
        temp: baseTemp,
        feels_like: baseTemp + Math.floor(Math.random() * 5) - 2,
        temp_min: baseTemp - 3,
        temp_max: baseTemp + 4,
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
      },
      weather: [
        {
          main: randomCondition,
          description: this.getDescription(randomCondition),
          icon: this.getIcon(randomCondition),
        },
      ],
      wind: {
        speed: Math.random() * 10 + 1, // 1-11 m/s
        deg: Math.floor(Math.random() * 360),
      },
      visibility: Math.floor(Math.random() * 5000) + 5000, // 5-10km
      sys: {
        country: 'XX',
        sunrise: Date.now() / 1000 - 3600, // 1 hour ago
        sunset: Date.now() / 1000 + 3600, // 1 hour from now
      },
      dt: Math.floor(Date.now() / 1000),
    };
  }

  private static getDescription(condition: string): string {
    switch (condition) {
      case 'Clear':
        return 'clear sky';
      case 'Clouds':
        return 'few clouds';
      case 'Rain':
        return 'light rain';
      case 'Snow':
        return 'light snow';
      default:
        return 'unknown';
    }
  }

  private static getIcon(condition: string): string {
    switch (condition) {
      case 'Clear':
        return '01d';
      case 'Clouds':
        return '02d';
      case 'Rain':
        return '10d';
      case 'Snow':
        return '13d';
      default:
        return '01d';
    }
  }
}