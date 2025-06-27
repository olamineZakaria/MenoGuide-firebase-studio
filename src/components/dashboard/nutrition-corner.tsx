"use client";

import { useEffect, useState } from "react";
import { Leaf, Loader2, Salad } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNutritionAdvice } from "@/ai/flows/nutrition-expert-flow";
import type { NutritionExpertOutput } from "@/ai/flows/nutrition-expert-flow";
import { useSymptomStore } from "@/hooks/use-symptom-store";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import type { RecipeGeneratorOutput } from "@/ai/flows/recipe-generator-flow";
import { generateRecipes } from "@/ai/flows/recipe-generator-flow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export function NutritionCorner() {
  const { symptoms } = useSymptomStore();
  const [advice, setAdvice] = useState<NutritionExpertOutput | null>(null);
  const [recipes, setRecipes] = useState<RecipeGeneratorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecipesLoading, setIsRecipesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdvice() {
      const trackedSymptoms = Object.entries(symptoms)
        .filter(([key, value]) => key !== 'otherSymptoms' && value)
        .map(([key, value]) => `${key}: ${value}`);
      
      if (trackedSymptoms.length === 0) {
        setIsLoading(false);
        setAdvice(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = await getNutritionAdvice({ symptoms: trackedSymptoms });
        setAdvice(result);
      } catch (e) {
        setError("Could not fetch nutrition advice. Please try again later.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAdvice();
  }, [symptoms]);

  const handleGenerateRecipes = async () => {
    if (!advice) return;
    setIsRecipesLoading(true);
    setRecipes(null);
    try {
      const ingredients = advice.recommendations.map(r => r.food);
      const result = await generateRecipes({ ingredients, cuisine: "Moroccan" });
      setRecipes(result);
    } catch (e) {
      console.error(e);
      setError("Failed to generate recipes. Please try again later.");
    } finally {
      setIsRecipesLoading(false);
    }
  }

  const hasSymptoms = Object.values(symptoms).some(s => s && typeof s === 'string' && s.length > 0 && s !== "");


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Salad />
            Nutrition Corner
        </CardTitle>
        <CardDescription>Dietary advice and recipes based on your symptoms.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="ml-3">Generating your nutrition advice...</p>
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
                <AlertDescription>Log your daily symptoms to receive personalized dietary advice.</AlertDescription>
            </Alert>
        )}
        {!isLoading && !error && hasSymptoms && advice && (
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2 text-primary">Food Recommendations</h4>
                    <ul className="space-y-3 text-sm">
                        {advice.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <Leaf className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                                <div><strong>{rec.food}:</strong> {rec.reason}</div>
                            </li>
                        ))}
                    </ul>
                </div>
                <Separator />
                <div>
                    <h4 className="font-semibold mb-2 text-primary">General Advice</h4>
                    <p className="text-sm text-muted-foreground">{advice.generalAdvice}</p>
                </div>
                <Separator />
                <div className="text-center pt-2">
                    <Button onClick={handleGenerateRecipes} disabled={isRecipesLoading}>
                        {isRecipesLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Salad className="mr-2 h-4 w-4" />}
                        {isRecipesLoading ? "Generating Recipes..." : "Suggest Moroccan Recipes"}
                    </Button>
                </div>

                {isRecipesLoading && (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <p className="ml-3 text-sm text-muted-foreground">Stirring up some ideas...</p>
                    </div>
                )}
                
                {recipes && recipes.recipes.length > 0 && (
                    <div className="mt-4 space-y-4">
                        <h3 className="text-lg font-semibold text-center">Your Recipe Ideas</h3>
                         <Accordion type="single" collapsible className="w-full">
                            {recipes.recipes.map((recipe, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>{recipe.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h5 className="font-semibold mb-2">Ingredients</h5>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                                    {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold mb-2">Instructions</h5>
                                                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                                    {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                                                </ol>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}

            </div>
        )}
      </CardContent>
    </Card>
  );
}
