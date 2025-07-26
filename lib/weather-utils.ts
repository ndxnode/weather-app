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
  // Always return the same light blue gradient like London's clear sky
  return {
    gradient: 'bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500',
    isDark: false
  };
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
  // Add defensive checks for invalid values
  if (typeof sunrise !== 'number' || typeof sunset !== 'number' || typeof timezone !== 'number') {
    console.warn('Invalid parameters passed to isNightTime:', { sunrise, sunset, timezone });
    return false; // Default to daytime if data is invalid
  }
  
  if (sunrise <= 0 || sunset <= 0) {
    console.warn('Invalid sunrise/sunset times:', { sunrise, sunset });
    return false;
  }
  
  const now = Math.floor(Date.now() / 1000);
  const localTime = now + timezone;
  
  return localTime < sunrise || localTime > sunset;
}

export function formatTime(timestamp: number, timezone: number): string {
  // Add defensive checks for invalid values
  if (typeof timestamp !== 'number' || typeof timezone !== 'number') {
    console.warn('Invalid parameters passed to formatTime:', { timestamp, timezone });
    return '--:--';
  }
  
  if (timestamp <= 0) {
    console.warn('Invalid timestamp:', timestamp);
    return '--:--';
  }
  
  try {
    const date = new Date((timestamp + timezone) * 1000);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date created from timestamp:', timestamp + timezone);
      return '--:--';
    }
    
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '--:--';
  }
}