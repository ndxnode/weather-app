"use client";

import { WeatherCard } from "@/components/weather-card";
import { CitySearch } from "@/components/city-search";
import { ForecastCard } from "@/components/forecast-card";
import { WeatherData, ForecastData } from "@/lib/types";
import { getWeatherBackground, isNightTime } from "@/lib/weather-utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

async function fetchWeather(city: string): Promise<WeatherData> {
  const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch weather data. Please check your API key or city name.");
  }

  return res.json();
}

async function fetchForecast(city: string): Promise<ForecastData> {
  const res = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch forecast data.");
  }

  return res.json();
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Removed currentCity state as it's not needed

  const loadWeatherData = async (city: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch both current weather and forecast in parallel
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetchWeather(city),
        fetchForecast(city)
      ]);
      
      setWeatherData(weatherResponse);
      setForecastData(forecastResponse);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : 'An error occurred');
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData("New York");
  }, []);

  // Get dynamic background based on weather conditions
  const background = weatherData ? (() => {
    const isNight = isNightTime(
      weatherData.sys.sunrise, 
      weatherData.sys.sunset, 
      weatherData.timezone
    );
    
    return getWeatherBackground(
      weatherData.weather[0].main, 
      weatherData.weather[0].id, 
      isNight
    );
  })() : { gradient: 'bg-gradient-to-br from-blue-500 to-purple-600', isDark: true };

  const textColor = background.isDark ? 'text-white' : 'text-gray-900';

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-900 to-gray-900 text-white p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <h1 className="text-2xl font-bold mb-4">Unable to load weather data</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <CitySearch 
            onCitySelect={loadWeatherData} 
            isLoading={isLoading}
            isDark={true}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${background.gradient} ${textColor} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">Weather</h1>
          {weatherData && (
            <p className={`text-lg md:text-xl ${background.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {weatherData.name}, {weatherData.sys.country}
            </p>
          )}
        </motion.div>

        <div className="flex flex-col items-center space-y-8">
          <CitySearch 
            onCitySelect={loadWeatherData} 
            isLoading={isLoading}
            isDark={background.isDark}
          />

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
            </motion.div>
          ) : weatherData ? (
            <div className="w-full space-y-8">
              <div className="flex justify-center">
                <WeatherCard weatherData={weatherData} />
              </div>
              {forecastData && (
                <ForecastCard 
                  forecastData={forecastData} 
                  isDark={background.isDark}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
