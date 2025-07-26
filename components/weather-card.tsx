"use client";

import React from "react";
import { motion } from "framer-motion";
import { WeatherData } from "@/lib/types";
import { getWeatherIcon, getWeatherBackground, isNightTime, formatTime } from "@/lib/weather-utils";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Sunrise, 
  Sunset,
  MapPin
} from "lucide-react";

type WeatherCardProps = {
  weatherData: WeatherData;
};

export function WeatherCard({ weatherData }: WeatherCardProps) {
  if (!weatherData) return null;

  // Destructure weather data
  const { temp, feels_like, humidity, pressure } = weatherData.main;
  const { speed: windSpeed } = weatherData.wind;
  const description = weatherData.weather[0].description;
  const weatherMain = weatherData.weather[0].main;
  const weatherId = weatherData.weather[0].id;
  // const visibility = weatherData.visibility / 1000; // Convert to km - for future use

  // Get weather icon component
  const WeatherIcon = getWeatherIcon(weatherMain, weatherId);

  // Check if it's night time
  const isNight = isNightTime(
    weatherData.sys.sunrise,
    weatherData.sys.sunset,
    weatherData.timezone
  );

  const background = getWeatherBackground(weatherMain, weatherId, isNight);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100 
      }}
      className="w-full max-w-sm sm:max-w-md mx-auto"
    >
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
        <CardContent className="p-6 sm:p-8">
          {/* Main weather display */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <WeatherIcon 
                size={80} 
                className={`${background.isDark ? 'text-white' : 'text-gray-800'} drop-shadow-lg`} 
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className={`text-5xl sm:text-6xl font-bold mb-2 ${background.isDark ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(temp)}°
              </h2>
              <p className={`text-xl capitalize mb-2 ${background.isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {description}
              </p>
              <p className={`text-sm flex items-center justify-center gap-1 ${background.isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <MapPin size={14} />
                {weatherData.name}, {weatherData.sys.country}
              </p>
            </motion.div>
          </div>

          {/* Weather details grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div className={`flex items-center gap-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm ${background.isDark ? 'text-white' : 'text-gray-800'}`}>
              <Thermometer size={18} className="text-orange-400" />
              <div>
                <p className="text-xs opacity-75">Feels like</p>
                <p className="font-semibold">{Math.round(feels_like)}°C</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm ${background.isDark ? 'text-white' : 'text-gray-800'}`}>
              <Droplets size={18} className="text-blue-400" />
              <div>
                <p className="text-xs opacity-75">Humidity</p>
                <p className="font-semibold">{humidity}%</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm ${background.isDark ? 'text-white' : 'text-gray-800'}`}>
              <Wind size={18} className="text-gray-400" />
              <div>
                <p className="text-xs opacity-75">Wind</p>
                <p className="font-semibold">{windSpeed} m/s</p>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm ${background.isDark ? 'text-white' : 'text-gray-800'}`}>
              <Gauge size={18} className="text-purple-400" />
              <div>
                <p className="text-xs opacity-75">Pressure</p>
                <p className="font-semibold">{pressure} hPa</p>
              </div>
            </div>
          </motion.div>

          {/* Sun times */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-between items-center pt-4 border-t border-white/20"
          >
            <div className={`flex items-center gap-2 ${background.isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <Sunrise size={16} className="text-yellow-400" />
              <div>
                <p className="text-xs opacity-75">Sunrise</p>
                <p className="text-sm font-medium">
                  {formatTime(weatherData.sys.sunrise, weatherData.timezone)}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-2 ${background.isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <Sunset size={16} className="text-orange-400" />
              <div>
                <p className="text-xs opacity-75">Sunset</p>
                <p className="text-sm font-medium">
                  {formatTime(weatherData.sys.sunset, weatherData.timezone)}
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
