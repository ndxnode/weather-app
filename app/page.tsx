"use client";

import { WeatherCard } from "@/components/weather-card";
import { CitySearch } from "@/components/city-search";
import { ForecastCard } from "@/components/forecast-card";
import { ClientOnly } from "@/components/client-only";
import { WeatherData, ForecastData } from "@/lib/types";
import { getWeatherBackground, isNightTime } from "@/lib/weather-utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WeatherCardSkeleton, ForecastCardSkeleton } from "@/components/skeleton-loader";

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
  const [background, setBackground] = useState({ gradient: 'bg-gradient-to-br from-blue-500 to-purple-600', isDark: true });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
      
      // Update background based on weather data (client-side only)
      if (weatherResponse && weatherResponse.sys && weatherResponse.weather && weatherResponse.weather[0]) {
        const isNight = isNightTime(
          weatherResponse.sys.sunrise, 
          weatherResponse.sys.sunset, 
          weatherResponse.timezone
        );
        
        const newBackground = getWeatherBackground(
          weatherResponse.weather[0].main, 
          weatherResponse.weather[0].id, 
          isNight
        );
        
        setBackground(newBackground);
      }
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : 'An error occurred');
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    loadWeatherData("New York");
  }, []);

  // Background is now managed in state to avoid hydration mismatch

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
    <main 
      className={`min-h-screen ${background.gradient} ${textColor} transition-all duration-1000`}
      suppressHydrationWarning={true}
    >
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
          {isInitialLoad && !weatherData && (
            <div className="h-6 bg-white/10 rounded-md w-48 mx-auto animate-pulse mt-2"></div>
          )}
        </motion.div>

        <div className="flex flex-col items-center space-y-8">
          <ClientOnly 
            fallback={
              <div className="w-full max-w-sm sm:max-w-md mx-auto relative">
                <div className="h-12 bg-white/10 rounded-lg animate-pulse"></div>
              </div>
            }
          >
            <CitySearch 
              onCitySelect={loadWeatherData} 
              isLoading={isLoading}
              isDark={background.isDark}
            />
          </ClientOnly>

          {isLoading ? (
            <div className="w-full space-y-8">
              <WeatherCardSkeleton />
              <ForecastCardSkeleton />
            </div>
          ) : weatherData ? (
            <ClientOnly>
              <div className="w-full space-y-8">
                <div className="flex justify-center">
                  <WeatherCard weatherData={weatherData} isDark={background.isDark} />
                </div>
                {forecastData && (
                  <ForecastCard 
                    forecastData={forecastData} 
                    isDark={background.isDark}
                  />
                )}
              </div>
            </ClientOnly>
          ) : null}
        </div>
      </div>
    </main>
  );
}
