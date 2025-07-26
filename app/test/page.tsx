'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<string>('Testing API...');
  // const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // Not needed for this test

  useEffect(() => {
    async function testAPI() {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } catch (error) {
        setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    }

    testAPI();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">OpenWeather API Test</h1>
      <div className="bg-gray-800 p-4 rounded-lg">
        <pre className="whitespace-pre-wrap break-words">
          {result}
        </pre>
      </div>
    </div>
  );
}