import { NextRequest, NextResponse } from 'next/server';
import { WeatherData } from '@/lib/types';

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'OpenWeather API key is not configured' },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'City not found. Please check the spelling and try again.' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch weather data' },
        { status: response.status }
      );
    }

    const weatherData: WeatherData = await response.json();
    
    // Validate essential fields exist
    if (!weatherData.weather || !weatherData.main || !weatherData.sys) {
      return NextResponse.json(
        { error: 'Invalid weather data received from API' },
        { status: 502 }
      );
    }
    
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout. Please try again.' },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}