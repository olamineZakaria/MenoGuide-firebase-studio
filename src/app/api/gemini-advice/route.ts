import { NextRequest, NextResponse } from 'next/server';

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  location: string;
}

interface UserContext {
  symptoms?: string[];
  age?: number;
  language?: 'en' | 'fr' | 'both';
}

interface RequestBody {
  weather: WeatherData;
  userContext?: UserContext;
}

export async function POST(request: NextRequest) {
  console.log('GOOGLE_AI_API_KEY value:', process.env.GOOGLE_AI_API_KEY);
  try {
    const body: RequestBody = await request.json();
    const { weather, userContext = {} } = body;

    // Debug: Log the API key presence (do not log the full key for security)
    console.log('GOOGLE_AI_API_KEY present:', !!process.env.GOOGLE_AI_API_KEY);

    // Build the prompt for Gemini
    const prompt = buildWeatherAdvicePrompt(weather, userContext);

    // Call Google AI API directly
    const apiKey = process.env.GOOGLE_AI_API_KEY || 'AIzaSyAdsxYKprtGR6wf_ofOY1FhQj9C0_sEyw8';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google AI API error:', response.status, errorText);
      // Debug: Log the full response object
      console.error('Full response object:', response);
      throw new Error(`Google AI API error: ${response.status}`);
    }

    const data = await response.json();
    const advice = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate advice at this time.';

    return NextResponse.json({ 
      advice,
      weather: weather,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini advice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate weather advice', details: String(error) },
      { status: 500 }
    );
  }
}

function buildWeatherAdvicePrompt(weather: WeatherData, userContext: UserContext): string {
  const { temp, humidity, windSpeed, description, location } = weather;
  const { symptoms = [], age, language = 'en' } = userContext;

  const languageInstruction = language === 'fr' 
    ? 'Réponds en français uniquement.'
    : language === 'both'
    ? 'Provide advice in both English and French, separated by "---"'
    : 'Provide advice in English.';

  const symptomsContext = symptoms.length > 0 
    ? `\nUser is experiencing: ${symptoms.join(', ')}.`
    : '';

  const ageContext = age 
    ? `\nUser age: ${age} years old.`
    : '';

  return `You are a menopause wellness expert providing weather-based advice for women experiencing menopause symptoms.

Current weather in ${location}:
- Temperature: ${temp}°C
- Humidity: ${humidity}%
- Wind Speed: ${windSpeed} km/h
- Weather: ${description}${symptomsContext}${ageContext}

${languageInstruction}

Provide a short, practical, and comforting weather-based wellness tip specifically for menopause symptoms. Focus on:
- How the weather affects common menopause symptoms (hot flashes, mood, sleep, etc.)
- Practical clothing or activity suggestions
- Self-care tips relevant to the weather conditions
- Encouraging and supportive tone

Keep the advice concise (2-3 sentences) and actionable.`;
} 