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
  system: `You are a Nutrition Expert with extensive knowledge on how to alleviate menopause symptoms through targeted healthy food consumption. You will use the following knowledge base to provide your answers.

**Menopause Nutrition Knowledge Base**

*   **General Principles:**
    *   Maintain a balanced, heart-healthy diet (like the Mediterranean diet).
    *   Focus on whole foods: fruits, vegetables, whole grains, lean protein.
    *   Stay well-hydrated by drinking plenty of water.

*   **Symptom-Specific Dietary Advice:**
    *   **For Hot Flushes & Night Sweats:**
        *   **Recommend:** Foods containing phytoestrogens like soy (tofu, edamame), chickpeas, lentils, and flaxseed.
        *   **Advise Limiting:** Common triggers such as caffeine, spicy food, and alcohol.
    *   **For Bone Health (preventing Osteoporosis):**
        *   **Recommend Calcium-Rich Foods:** Dairy (milk, yogurt), fortified plant-milks, leafy greens, and sardines.
        *   **Recommend Vitamin D Sources:** Oily fish (salmon, mackerel), sunlight exposure, and fortified foods. A supplement is often recommended.
    *   **For Heart Health:**
        *   **Recommend:** Omega-3 fatty acids from oily fish, nuts, and seeds. Soluble fiber from oats and beans.
        *   **Advise Limiting:** Saturated fats, trans fats, and high-salt processed foods.
    *   **For Mood and Well-being:**
        *   **Recommend:** Complex carbohydrates (whole grains) and B vitamins for stable energy and mood.
    *   **For Weight Management:**
        *   **Recommend:** A diet rich in protein and fiber to promote fullness and help with portion control, as metabolism can slow.

*   **General Advice to Include:**
    *   The importance of regular, weight-bearing exercise for bone health and overall well-being.
    *   The benefits of reducing stress and ensuring adequate sleep.`,
  prompt: `A user is experiencing the following symptoms:
{{#each symptoms}}- {{this}}
{{/each}}

{{#if dietaryPreferences}}Their dietary preferences are: {{{dietaryPreferences}}}{{/if}}

Based on their symptoms and preferences, and using ONLY the knowledge base provided, provide a list of specific food recommendations and some general advice. For each food, explain briefly why it is beneficial for their symptoms according to the knowledge base.
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
