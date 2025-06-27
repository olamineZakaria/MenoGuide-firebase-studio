"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Cloud, CloudRain, Snowflake, AlertTriangle, Loader2, RefreshCw, MapPin, Droplets, Wind } from "lucide-react";

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow';
  location: string;
  advice: string;
}

const weatherIcons = {
    sun: <Sun className="w-8 h-8 text-yellow-500" />,
    cloud: <Cloud className="w-8 h-8 text-gray-500" />,
    rain: <CloudRain className="w-8 h-8 text-blue-500" />,
    snow: <Snowflake className="w-8 h-8 text-blue-200" />,
}

// OpenWeatherMap API configuration
const OPENWEATHER_API_KEY = "3e178fe988b24800fa476a78092e84fa";
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

// Weather gradient styles
const weatherGradient = "bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200";

// Helper function to get weather emoji based on temperature
const getWeatherEmoji = (temp: number) => {
  if (temp > 30) return "🔥";
  if (temp > 25) return "☀️";
  if (temp > 15) return "🌤️";
  if (temp > 5) return "🌥️";
  return "❄️";
};

// Helper function to get weather icon based on OpenWeatherMap icon code
const getWeatherIconFromCode = (iconCode: string): 'sun' | 'cloud' | 'rain' | 'snow' => {
  if (iconCode.includes('01') || iconCode.includes('02')) return 'sun';
  if (iconCode.includes('03') || iconCode.includes('04')) return 'cloud';
  if (iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11')) return 'rain';
  if (iconCode.includes('13')) return 'snow';
  return 'sun';
};

// Generate AI-powered advice using Gemini
const generateAIAdvice = async (temp: number, humidity: number, windSpeed: number, description: string, location: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini-advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        weather: {
          temp,
          humidity,
          windSpeed,
          description,
          location
        },
        userContext: {
          language: 'en', // You can make this dynamic based on user preferences
          // Add user symptoms and age here when available
          // symptoms: ['hot flashes', 'mood swings'],
          // age: 45
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI advice');
    }

    const data = await response.json();
    return data.advice;
  } catch (error) {
    console.error('AI advice generation error:', error);
    // Fallback to basic advice if AI fails
    return getFallbackAdvice(temp, humidity);
  }
};

// Fallback advice function
const getFallbackAdvice = (temp: number, humidity: number): string => {
  if (temp > 25) {
    return "🔥 Hot weather alert! Stay hydrated and wear light, breathable clothing. Consider carrying a portable fan for hot flash relief.";
  } else if (temp > 15) {
    return "🌤️ Perfect weather for outdoor activities! Take a gentle walk to boost your mood and energy.";
  } else if (temp > 5) {
    return "🌥️ Cool weather - layer up for comfort! Wear breathable layers you can easily remove if hot flashes occur.";
  } else {
    return "❄️ Cold weather - stay cozy indoors! Consider gentle indoor exercises like yoga or stretching.";
  }
};

// Fetch weather data from OpenWeatherMap API
const fetchWeatherFromAPI = async (lat: number, lon: number): Promise<any> => {
  console.log("=== fetchWeatherFromAPI called ===");
  const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=en`;
  
  console.log("Making API request to:", url);
  
  try {
    const response = await fetch(url);
    console.log("API response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API response data received");
    return data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debug: Log when the widget mounts
  useEffect(() => {
    console.log("WeatherWidget mounted");
  }, []);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setIsLoading(true);
      setError(null);
      // Debug: Log coordinates before fetching
      console.log("Fetching weather for", lat, lon);
      
      // Fetch real weather data from OpenWeatherMap
      const weatherData = await fetchWeatherFromAPI(lat, lon);
      console.log("Weather API response:", weatherData);
      
      // Extract weather information
      const temp = Math.round(weatherData.main.temp);
      const humidity = weatherData.main.humidity;
      const windSpeed = Math.round(weatherData.wind.speed * 3.6); // Convert m/s to km/h
      const description = weatherData.weather[0].description;
      const iconCode = weatherData.weather[0].icon;
      const icon = getWeatherIconFromCode(iconCode);
      const locationName = weatherData.name; // Use the location name from API response
      
      // Generate AI-powered advice
      const advice = await generateAIAdvice(temp, humidity, windSpeed, description, locationName);
      
      const weatherInfo: WeatherData = {
        temp,
        humidity,
        windSpeed,
        description: description.charAt(0).toUpperCase() + description.slice(1),
        icon,
        location: locationName,
        advice
      };
      
      setWeather(weatherInfo);
      setIsLoading(false);
      setIsRefreshing(false);
      
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError("Unable to fetch weather data. Please check your connection and try again.");
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback to default location (Paris)
          fetchWeatherData(48.8566, 2.3522);
        }
      );
    } else {
      fetchWeatherData(48.8566, 2.3522);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError("Location access denied. Using default location.");
          fetchWeatherData(48.8566, 2.3522);
        }
      );
    } else {
      setError("Geolocation not supported. Using default location.");
      fetchWeatherData(48.8566, 2.3522);
    }
  }, []);

  console.log("WeatherWidget render - isLoading:", isLoading, "weather:", weather, "error:", error);

  return (
    <Card className={`shadow-lg border-0 ${weatherGradient} overflow-hidden`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Today's Weather & Advice
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-32 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Météo en cours de chargement...</p>
          </div>
        )}
        
        {error && !weather && (
          <div className="flex flex-col items-center justify-center h-32 space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <p className="text-sm text-red-600 text-center">{error}</p>
            <Button onClick={handleRefresh} size="sm" variant="outline">
              Try Again
            </Button>
          </div>
        )}
        
        {weather && (
          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {weather.location}
            </div>
            
            {/* Main Weather Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{getWeatherEmoji(weather.temp)}</div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{weather.temp}°C</p>
                  <p className="text-sm text-gray-600">{weather.description}</p>
                </div>
              </div>
              {weatherIcons[weather.icon]}
            </div>
            
            {/* Weather Details */}
            <div className="flex items-center justify-between text-sm text-gray-600 bg-white/50 rounded-lg p-3">
              <div className="flex items-center space-x-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Wind className="w-4 h-4 text-gray-500" />
                <span>{weather.windSpeed} km/h</span>
              </div>
            </div>
            
            {/* AI Advice */}
            <div className="bg-white/70 rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-700 leading-relaxed">{weather.advice}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
