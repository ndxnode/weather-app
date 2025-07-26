"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CitySearchProps {
  onCitySelect: (city: string) => void;
  isLoading?: boolean;
  isDark?: boolean;
}

export function CitySearch({ onCitySelect, isLoading = false, isDark = true }: CitySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular cities for quick access
  const popularCities = [
    "New York", "London", "Tokyo", "Paris", "Sydney", 
    "Los Angeles", "Berlin", "Dubai", "Singapore", "Amsterdam"
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    if (value.length > 2) {
      // Filter popular cities that match the search term
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onCitySelect(searchTerm.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city: string) => {
    setSearchTerm(city);
    onCitySelect(city);
    setShowSuggestions(false);
  };

  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const placeholderColor = isDark ? 'placeholder:text-gray-400' : 'placeholder:text-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm sm:max-w-md mx-auto relative"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`
              w-full pl-12 pr-16 py-3 
              backdrop-blur-lg bg-white/10 border-white/20 
              ${textColor} ${placeholderColor}
              focus:bg-white/20 focus:border-white/40
              transition-all duration-200
            `}
            disabled={isLoading}
          />
          <Search 
            size={20} 
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} 
          />
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !searchTerm.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 border-white/20"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
          </Button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg shadow-2xl z-50"
          >
            {suggestions.map((city, index) => (
              <button
                key={city}
                type="button"
                onClick={() => handleSuggestionClick(city)}
                className={`
                  w-full text-left px-4 py-3 flex items-center gap-2
                  hover:bg-white/20 transition-colors
                  ${textColor}
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === suggestions.length - 1 ? 'rounded-b-lg' : 'border-b border-white/10'}
                `}
              >
                <MapPin size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                {city}
              </button>
            ))}
          </motion.div>
        )}
      </form>

      {/* Popular cities quick access */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Popular cities:
        </p>
        <div className="flex flex-wrap gap-2">
          {popularCities.slice(0, 5).map((city) => (
            <button
              key={city}
              onClick={() => handleSuggestionClick(city)}
              disabled={isLoading}
              className={`
                px-3 py-1 text-sm rounded-full
                backdrop-blur-sm bg-white/10 border border-white/20
                hover:bg-white/20 transition-colors
                ${textColor}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {city}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}