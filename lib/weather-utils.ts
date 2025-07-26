// lib/weather-utils.ts
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudDrizzle, 
  Wind,
  Eye,
  CloudLightning
} from "lucide-react";

export interface WeatherBackground {
  gradient: string;
  isDark: boolean;
}

export function getWeatherBackground(
  weatherMain: string, 
  weatherId: number, 
  isNight: boolean = false
): WeatherBackground {
  const main = weatherMain.toLowerCase();
  
  if (isNight) {
    switch (main) {
      case 'clear':
        return {
          gradient: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
          isDark: true
        };
      case 'clouds':
        return {
          gradient: 'bg-gradient-to-br from-gray-800 via-gray-900 to-blue-900',
          isDark: true
        };
      case 'rain':
      case 'drizzle':
        return {
          gradient: 'bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900',
          isDark: true
        };
      case 'thunderstorm':
        return {
          gradient: 'bg-gradient-to-br from-purple-900 via-gray-900 to-black',
          isDark: true
        };
      case 'snow':
        return {
          gradient: 'bg-gradient-to-br from-slate-700 via-gray-800 to-blue-900',
          isDark: true
        };
      default:
        return {
          gradient: 'bg-gradient-to-br from-gray-800 via-gray-900 to-blue-900',
          isDark: true
        };
    }
  }

  // Daytime gradients
  switch (main) {
    case 'clear':
      return {
        gradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
        isDark: false
      };
    case 'clouds':
      if (weatherId >= 802) { // Scattered/broken/overcast clouds
        return {
          gradient: 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600',
          isDark: false
        };
      }
      return {
        gradient: 'bg-gradient-to-br from-blue-300 via-gray-400 to-blue-500',
        isDark: false
      };
    case 'rain':
      return {
        gradient: 'bg-gradient-to-br from-gray-600 via-blue-600 to-gray-800',
        isDark: true
      };
    case 'drizzle':
      return {
        gradient: 'bg-gradient-to-br from-gray-400 via-blue-500 to-gray-600',
        isDark: false
      };
    case 'thunderstorm':
      return {
        gradient: 'bg-gradient-to-br from-purple-700 via-gray-700 to-gray-900',
        isDark: true
      };
    case 'snow':
      return {
        gradient: 'bg-gradient-to-br from-gray-100 via-blue-200 to-gray-300',
        isDark: false
      };
    case 'fog':
    case 'mist':
    case 'haze':
      return {
        gradient: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
        isDark: false
      };
    default:
      return {
        gradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
        isDark: false
      };
  }
}

export function getWeatherIcon(weatherMain: string, weatherId: number) {
  const main = weatherMain.toLowerCase();
  
  switch (main) {
    case 'clear':
      return Sun;
    case 'clouds':
      if (weatherId === 801) return Cloud; // Few clouds
      return Cloud; // More clouds
    case 'rain':
      if (weatherId >= 520 && weatherId <= 531) return CloudRain; // Shower rain
      return CloudRain;
    case 'drizzle':
      return CloudDrizzle;
    case 'thunderstorm':
      return CloudLightning;
    case 'snow':
      return CloudSnow;
    case 'fog':
    case 'mist':
      return Eye;
    case 'haze':
    case 'dust':
    case 'sand':
      return Eye;
    case 'squall':
    case 'tornado':
      return Wind;
    default:
      return Sun;
  }
}

export function isNightTime(sunrise: number, sunset: number, timezone: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  const localTime = now + timezone;
  
  return localTime < sunrise || localTime > sunset;
}

export function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
}