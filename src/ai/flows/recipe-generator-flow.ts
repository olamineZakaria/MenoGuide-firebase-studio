'use server';
/**
 * @fileOverview A Recipe Generator AI agent that provides recipes based on ingredients.
 *
 * - generateRecipes - A function that provides recipes.
 * - RecipeGeneratorInput - The input type for the generateRecipes function.
 * - RecipeGeneratorOutput - The return type for the generateRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RecipeGeneratorInputSchema = z.object({
  ingredients: z.array(z.string()).describe('A list of healthy ingredients.'),
  cuisine: z.string().optional().describe('The desired cuisine style (e.g., Moroccan, Mediterranean).'),
});
export type RecipeGeneratorInput = z.infer<typeof RecipeGeneratorInputSchema>;

const RecipeGeneratorOutputSchema = z.object({
  recipes: z.array(z.object({
    title: z.string().describe('The name of the recipe.'),
    ingredients: z.array(z.string()).describe('List of ingredients for the recipe.'),
    instructions: z.array(z.string()).describe('Step-by-step instructions to prepare the recipe.'),
  })).describe('A list of generated recipes.'),
});
export type RecipeGeneratorOutput = z.infer<typeof RecipeGeneratorOutputSchema>;

export async function generateRecipes(input: RecipeGeneratorInput): Promise<RecipeGeneratorOutput> {
  return recipeGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recipeGeneratorPrompt',
  input: {schema: RecipeGeneratorInputSchema},
  output: {schema: RecipeGeneratorOutputSchema},
  prompt: `You are a creative and experienced chef specializing in healthy, flavorful cuisine. A user is looking for recipe ideas to help manage menopause symptoms.

Your task is to create 2-3 simple, healthy, and delicious recipes.

**Instructions:**
1.  Use the provided list of **Key Ingredients** as the foundation for your recipes.
2.  If a specific **Cuisine** is mentioned, tailor the recipes to that style. If not, create generally healthy and appealing recipes.
3.  For each recipe, provide a clear title, a list of all necessary ingredients, and step-by-step instructions.
4.  Ensure the recipes are straightforward and easy for a home cook to follow.

**Key Ingredients:**
{{#each ingredients}}
- {{{this}}}
{{/each}}

{{#if cuisine}}
**Cuisine Style:** {{{cuisine}}}
{{/if}}

Please generate the recipes.
`,
});

const recipeGeneratorFlow = ai.defineFlow(
  {
    name: 'recipeGeneratorFlow',
    inputSchema: RecipeGeneratorInputSchema,
    outputSchema: RecipeGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
