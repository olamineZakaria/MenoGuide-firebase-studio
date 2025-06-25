"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, Dumbbell, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generatePersonalizedRecommendations } from "@/ai/flows/personalized-recommendations-flow";
import type { PersonalizedRecommendationsOutput } from "@/ai/flows/personalized-recommendations-flow";
import { useSymptomStore } from "@/hooks/use-symptom-store";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Image from "next/image";

export function Recommendations() {
  const { symptoms } = useSymptomStore();
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      if (
        !symptoms.mood ||
        !symptoms.sleepQuality ||
        !symptoms.hotFlashes
      ) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = await generatePersonalizedRecommendations(symptoms);
        setRecommendations(result);
      } catch (e) {
        setError("Could not fetch recommendations. Please try again later.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecommendations();
  }, [symptoms]);

  const hasSymptoms = symptoms.mood && symptoms.sleepQuality && symptoms.hotFlashes;

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle>Your Personalized Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4">Generating your recommendations...</p>
          </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!isLoading && !error && !hasSymptoms && (
            <Alert>
                <AlertTitle>Track your symptoms!</AlertTitle>
                <AlertDescription>Log your daily symptoms to receive personalized recommendations for your well-being.</AlertDescription>
            </Alert>
        )}
        {!isLoading && !error && hasSymptoms && recommendations && (
            <div className="grid gap-6">
                <RecommendationCategory icon={FileText} title="Articles for You" items={recommendations.articles} imageHint="reading books" />
                <RecommendationCategory icon={Dumbbell} title="Suggested Exercises" items={recommendations.exercises} imageHint="woman yoga" />
                <RecommendationCategory icon={BrainCircuit} title="Meditation & Mindfulness" items={recommendations.meditations} imageHint="woman meditation" />
            </div>
        )}
      </CardContent>
    </Card>
  );
}

interface RecommendationCategoryProps {
    icon: React.ElementType;
    title: string;
    items: string[];
    imageHint: string;
}

function RecommendationCategory({ icon: Icon, title, items, imageHint }: RecommendationCategoryProps) {
    if (!items || items.length === 0) return null;

    return (
        <div>
            <h3 className="text-lg font-semibold flex items-center mb-4">
                <Icon className="w-6 h-6 mr-3 text-primary" />
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, index) => (
                    <Card key={index} className="overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
                        <Image src={`https://placehold.co/400x250.png`} alt={item} width={400} height={250} className="w-full h-32 object-cover" data-ai-hint={imageHint} />
                        <CardContent className="p-4">
                            <p className="font-medium text-sm">{item}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
