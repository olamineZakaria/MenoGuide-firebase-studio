'use server';
/**
 * @fileOverview A personalized recommendations AI agent.
 *
 * - generatePersonalizedRecommendations - A function that handles the generation of personalized recommendations.
 * - PersonalizedRecommendationsInput - The input type for the generatePersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the generatePersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  mood: z.string().describe('The user\'s current mood.'),
  sleepQuality: z.string().describe('The user\'s sleep quality.'),
  hotFlashes: z.string().describe('The severity of the user\'s hot flashes.'),
  otherSymptoms: z.string().optional().describe('Any other symptoms the user is experiencing.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  articles: z.array(z.string()).describe('A list of article recommendations.'),
  exercises: z.array(z.string()).describe('A list of exercise recommendations.'),
  meditations: z.array(z.string()).describe('A list of meditation recommendations.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function generatePersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `Based on the user's tracked symptoms, generate personalized recommendations for articles, exercises, and meditations.

Symptoms:
Mood: {{{mood}}}
Sleep Quality: {{{sleepQuality}}}
Hot Flashes: {{{hotFlashes}}}
Other Symptoms: {{{otherSymptoms}}}

Recommendations:`, // Ensure the prompt ends in "Recommendations:"
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
