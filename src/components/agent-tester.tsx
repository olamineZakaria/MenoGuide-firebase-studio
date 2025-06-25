"use client";

import { useState } from "react";
import { analyzeJournal, MaestroOutput } from "@/ai/flows/maestro-flow";
import { getNutritionAdvice, NutritionExpertOutput } from "@/ai/flows/nutrition-expert-flow";
import { getCoachingResponse } from "@/ai/flows/life-coach-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";

const allSymptoms = [
    "Hot Flushes", "Night Sweats", "Weight Gain", "Mood Swings", "Brain Fog", "Poor Sleep"
];

interface CoachMessage {
    role: 'user' | 'coach';
    content: string;
}

export function AgentTester() {
    // Maestro State
    const [journal, setJournal] = useState("Today was tough. I felt really irritable and couldn't focus at work. I had a salad for lunch but then binged on chocolate this afternoon. I'm also struggling with hot flashes again.");
    const [maestroResult, setMaestroResult] = useState<MaestroOutput | null>(null);
    const [isMaestroLoading, setIsMaestroLoading] = useState(false);

    // Nutrition Expert State
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["Hot Flushes", "Weight Gain"]);
    const [dietaryPreferences, setDietaryPreferences] = useState("vegetarian");
    const [nutritionResult, setNutritionResult] = useState<NutritionExpertOutput | null>(null);
    const [isNutritionLoading, setIsNutritionLoading] = useState(false);

    // Life Coach State
    const [coachHistory, setCoachHistory] = useState<CoachMessage[]>([
        { role: 'coach', content: "Welcome! I'm here to listen. What's on your mind today?" }
    ]);
    const [coachInput, setCoachInput] = useState("");
    const [isCoachLoading, setIsCoachLoading] = useState(false);

    const handleMaestro = async () => {
        setIsMaestroLoading(true);
        setMaestroResult(null);
        try {
            const result = await analyzeJournal({ journal });
            setMaestroResult(result);
        } catch (error) {
            console.error("Maestro Error:", error);
        }
        setIsMaestroLoading(false);
    };

    const handleNutrition = async () => {
        setIsNutritionLoading(true);
        setNutritionResult(null);
        try {
            const result = await getNutritionAdvice({ symptoms: selectedSymptoms, dietaryPreferences });
            setNutritionResult(result);
        } catch (error) {
            console.error("Nutrition Expert Error:", error);
        }
        setIsNutritionLoading(false);
    };
    
    const handleSymptomChange = (symptom: string) => {
        setSelectedSymptoms(prev => 
            prev.includes(symptom) 
            ? prev.filter(s => s !== symptom)
            : [...prev, symptom]
        );
    }

    const handleCoachSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coachInput.trim() || isCoachLoading) return;

        const newUserMessage: CoachMessage = { role: 'user', content: coachInput };
        
        const currentHistoryWithUserMessage = [...coachHistory, newUserMessage];
        setCoachHistory(currentHistoryWithUserMessage);
        const historyForPrompt = coachHistory; // Send history before new user message
        setCoachInput("");
        setIsCoachLoading(true);

        try {
            const historyString = historyForPrompt
                .map(msg => `${msg.role === 'coach' ? 'Coach' : 'User'}: ${msg.content}`)
                .join('\n');

            const result = await getCoachingResponse({ 
                userStatement: newUserMessage.content,
                chatHistory: historyString,
            });
            
            const coachMessage: CoachMessage = { role: 'coach', content: result.coachResponse };
            setCoachHistory(prev => [...prev, coachMessage]);

        } catch (error) {
            console.error("Life Coach Error:", error);
            const errorMessage: CoachMessage = { role: 'coach', content: "Sorry, I'm having trouble connecting right now." };
            setCoachHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsCoachLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Maestro Card */}
            <Card>
                <CardHeader>
                    <CardTitle>1. Maestro: Journal Analysis</CardTitle>
                    <CardDescription>Enter a journal entry to test how Maestro extracts information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="journal">Journal Entry</Label>
                        <Textarea id="journal" value={journal} onChange={(e) => setJournal(e.target.value)} rows={5} placeholder="Today was tough..." />
                    </div>
                    <Button onClick={handleMaestro} disabled={isMaestroLoading} className="w-full">
                        {isMaestroLoading ? <Loader2 className="animate-spin" /> : "Analyze Journal"}
                    </Button>
                    {maestroResult && (
                        <div className="p-4 bg-muted rounded-md space-y-3 text-sm mt-4">
                            <div><h4 className="font-semibold">Emotions:</h4><p>{maestroResult.emotions.join(', ')}</p></div>
                            <div><h4 className="font-semibold">Challenges:</h4><p>{maestroResult.challenges.join(', ')}</p></div>
                            <div><h4 className="font-semibold">Food Eaten:</h4><p>{maestroResult.foodEaten.join(', ')}</p></div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Nutrition Expert Card */}
            <Card>
                <CardHeader>
                    <CardTitle>2. Nutrition Expert</CardTitle>
                    <CardDescription>Select symptoms and preferences to get dietary advice.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Symptoms</Label>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {allSymptoms.map(symptom => (
                                <div key={symptom} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`nutri-${symptom}`} 
                                        checked={selectedSymptoms.includes(symptom)}
                                        onCheckedChange={() => handleSymptomChange(symptom)}
                                    />
                                    <label htmlFor={`nutri-${symptom}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{symptom}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="diet">Dietary Preferences</Label>
                        <Input id="diet" value={dietaryPreferences} onChange={(e) => setDietaryPreferences(e.target.value)} placeholder="e.g., vegetarian, gluten-free" />
                    </div>
                    <Button onClick={handleNutrition} disabled={isNutritionLoading} className="w-full">
                        {isNutritionLoading ? <Loader2 className="animate-spin" /> : "Get Nutrition Advice"}
                    </Button>
                    {nutritionResult && (
                        <div className="p-4 bg-muted rounded-md space-y-4 text-sm mt-4">
                            <div>
                                <h4 className="font-semibold mb-2">Recommendations:</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    {nutritionResult.recommendations.map((rec, i) => (
                                        <li key={i}><strong>{rec.food}:</strong> {rec.reason}</li>
                                    ))}
                                </ul>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">General Advice:</h4>
                                <p>{nutritionResult.generalAdvice}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Life Coach Card */}
            <Card>
                <CardHeader>
                    <CardTitle>3. Life Coach</CardTitle>
                    <CardDescription>Have a reflective coaching conversation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <ScrollArea className="h-64 w-full rounded-md border p-4">
                        <div className="space-y-4">
                            {coachHistory.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'coach' && <div className="flex h-8 w-8 shrink-0 rounded-full bg-primary/20 items-center justify-center text-primary">C</div>}
                                    <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'bg-muted'
                                    }`}>
                                        {msg.role === 'coach' ? <p className="italic">"{msg.content}"</p> : <p>{msg.content}</p>}
                                    </div>
                                     {msg.role === 'user' && <div className="flex h-8 w-8 shrink-0 rounded-full bg-muted items-center justify-center">U</div>}
                                </div>
                            ))}
                            {isCoachLoading && (
                                <div className="flex items-start gap-2">
                                     <div className="flex h-8 w-8 shrink-0 rounded-full bg-primary/20 items-center justify-center text-primary">C</div>
                                    <div className="rounded-lg bg-muted px-3 py-2">
                                       <Loader2 className="w-5 h-5 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <form onSubmit={handleCoachSubmit} className="flex items-center gap-2">
                        <Input 
                            value={coachInput} 
                            onChange={(e) => setCoachInput(e.target.value)} 
                            placeholder="Share your thoughts..."
                            disabled={isCoachLoading}
                            autoComplete="off"
                        />
                        <Button type="submit" disabled={isCoachLoading}>
                            {isCoachLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
