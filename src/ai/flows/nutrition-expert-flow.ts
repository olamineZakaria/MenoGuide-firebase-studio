'use server';
/**
 * @fileOverview A Nutrition Expert AI agent that provides dietary advice for menopause symptoms.
 *
 * - getNutritionAdvice - A function that handles providing nutrition advice.
 * - NutritionExpertInput - The input type for the getNutritionAdvice function.
 * - NutritionExpertOutput - The return type for the getNutritionAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionExpertInputSchema = z.object({
  symptoms: z.array(z.string()).describe('A list of the user\'s current menopause symptoms.'),
  dietaryPreferences: z.string().optional().describe('Any dietary preferences or restrictions the user has (e.g., vegetarian, gluten-free).'),
});
export type NutritionExpertInput = z.infer<typeof NutritionExpertInputSchema>;

const NutritionExpertOutputSchema = z.object({
  recommendations: z.array(z.object({
    food: z.string().describe('A specific food or ingredient recommendation.'),
    reason: z.string().describe('The reason why this food is recommended for the specified symptoms.'),
  })).describe('A list of food recommendations.'),
  generalAdvice: z.string().describe('General dietary advice to help manage menopause symptoms.'),
});
export type NutritionExpertOutput = z.infer<typeof NutritionExpertOutputSchema>;

export async function getNutritionAdvice(input: NutritionExpertInput): Promise<NutritionExpertOutput> {
  return nutritionExpertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nutritionExpertPrompt',
  input: {schema: NutritionExpertInputSchema},
  output: {schema: NutritionExpertOutputSchema},
  prompt: `You are a Nutrition Expert with extensive knowledge on how to alleviate menopause symptoms through targeted healthy food consumption.

A user is experiencing the following symptoms:
{{#each symptoms}}- {{this}}
{{/each}}

{{#if dietaryPreferences}}Their dietary preferences are: {{{dietaryPreferences}}}{{/if}}

Based on these symptoms and preferences, provide a list of specific food recommendations and some general advice. For each food, explain briefly why it is beneficial for their symptoms.
`,
});

const nutritionExpertFlow = ai.defineFlow(
  {
    name: 'nutritionExpertFlow',
    inputSchema: NutritionExpertInputSchema,
    outputSchema: NutritionExpertOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
