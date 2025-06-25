"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, Snowflake, AlertTriangle, Loader2 } from "lucide-react";

interface WeatherData {
  temp: number;
  description: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow';
  advice: string;
}

const weatherIcons = {
    sun: <Sun className="w-8 h-8 text-yellow-500" />,
    cloud: <Cloud className="w-8 h-8 text-gray-500" />,
    rain: <CloudRain className="w-8 h-8 text-blue-500" />,
    snow: <Snowflake className="w-8 h-8 text-blue-200" />,
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getWeatherData = async (lat: number, lon: number) => {
        // In a real app, you would fetch from a weather API
        // For now, we'll use mock data
        await new Promise(res => setTimeout(res, 1000));
        const mockTemp = Math.floor(Math.random() * 20) + 10; // Temp between 10-30 C
        let mockWeather: WeatherData;

        if (mockTemp > 25) {
            mockWeather = { temp: mockTemp, description: 'Sunny', icon: 'sun', advice: "It's warm today. Stay hydrated to help with hot flashes." };
        } else if (mockTemp < 15) {
            mockWeather = { temp: mockTemp, description: 'Cloudy', icon: 'cloud', advice: "A bit chilly. A warm herbal tea could be comforting." };
        } else {
            mockWeather = { temp: mockTemp, description: 'Pleasant', icon: 'sun', advice: "Perfect weather for a light walk outside!" };
        }

        setWeather(mockWeather);
        setIsLoading(false);
    }


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError("Location access denied. Please enable it in your browser settings.");
          setIsLoading(false);
          // Fallback to mock data without location
          getWeatherData(0, 0);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Today's Weather & Advice</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="flex items-center justify-center h-24"><Loader2 className="w-6 h-6 animate-spin" /></div>}
        {error && !weather && <div className="flex items-center text-destructive"><AlertTriangle className="w-5 h-5 mr-2" /><p className="text-sm">{error}</p></div>}
        {weather && (
            <div className="flex items-center gap-4">
                {weatherIcons[weather.icon]}
                <div>
                    <p className="text-3xl font-bold">{weather.temp}°C</p>
                    <p className="text-muted-foreground">{weather.description}</p>
                </div>
                <div className="flex-1 pl-4 border-l">
                    <p className="text-sm text-foreground">{weather.advice}</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
