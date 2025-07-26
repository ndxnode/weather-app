"use client";

import React from "react";
import { motion } from "framer-motion";
import { ForecastData, ForecastItem } from "@/lib/types";
import { getWeatherIcon } from "@/lib/weather-utils";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface ForecastCardProps {
  forecastData: ForecastData;
  isDark?: boolean;
}

interface DailyForecast {
  date: string;
  day: string;
  temp_min: number;
  temp_max: number;
  weather: {
    main: string;
    id: number;
    description: string;
  };
}

export function ForecastCard({ forecastData, isDark = true }: ForecastCardProps) {
  if (!forecastData) return null;

  // Process 5-day forecast data (API returns data every 3 hours)
  const dailyForecasts: DailyForecast[] = [];
  const processedDates = new Set<string>();

  forecastData.list.forEach((item: ForecastItem) => {
    const date = new Date(item.dt * 1000);
    const dateString = date.toDateString();
    
    if (!processedDates.has(dateString) && dailyForecasts.length < 5) {
      processedDates.add(dateString);
      
      // Get all items for this date to find min/max temps
      const dayItems = forecastData.list.filter(i => {
        const itemDate = new Date(i.dt * 1000);
        return itemDate.toDateString() === dateString;
      });

      const temps = dayItems.map(i => i.main.temp);
      const temp_min = Math.min(...temps);
      const temp_max = Math.max(...temps);

      // Use the weather from the middle of the day (closest to noon)
      const noonItem = dayItems.reduce((closest, current) => {
        const currentHour = new Date(current.dt * 1000).getHours();
        const closestHour = new Date(closest.dt * 1000).getHours();
        return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
      });

      dailyForecasts.push({
        date: dateString,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        temp_min: Math.round(temp_min),
        temp_max: Math.round(temp_max),
        weather: {
          main: noonItem.weather[0].main,
          id: noonItem.weather[0].id,
          description: noonItem.weather[0].description
        }
      });
    }
  });

  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryTextColor = isDark ? 'text-gray-300' : 'text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-4xl mx-auto mt-8"
    >
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl">
        <CardContent className="p-6">
          <div className={`flex items-center gap-2 mb-6 ${textColor}`}>
            <CalendarDays size={20} />
            <h3 className="text-lg font-semibold">5-Day Forecast</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {dailyForecasts.map((day, index) => {
              const WeatherIcon = getWeatherIcon(day.weather.main, day.weather.id);
              
              return (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className={`
                    text-center p-4 rounded-lg 
                    bg-white/10 backdrop-blur-sm 
                    hover:bg-white/20 transition-colors
                    ${textColor}
                  `}
                >
                  <p className={`font-medium mb-2 ${index === 0 ? 'text-blue-400' : ''}`}>
                    {index === 0 ? 'Today' : day.day}
                  </p>
                  
                  <div className="flex justify-center mb-3">
                    <WeatherIcon 
                      size={32} 
                      className={`${isDark ? 'text-white' : 'text-gray-800'} drop-shadow-sm`} 
                    />
                  </div>
                  
                  <p className={`text-xs capitalize mb-2 ${secondaryTextColor} leading-tight`}>
                    {day.weather.description}
                  </p>
                  
                  <div className="space-y-1">
                    <p className="font-bold text-lg">
                      {day.temp_max}°
                    </p>
                    <p className={`text-sm ${secondaryTextColor}`}>
                      {day.temp_min}°
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}