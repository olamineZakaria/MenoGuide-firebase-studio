'use server';

/**
 * @fileOverview AI chat interface using Google Vertex AI Reasoning Engines to answer user questions and provide advice, using collected and persistent data as a tool.
 *
 * - chatWithHistory - A function that handles the chat with history process.
 * - ChatWithHistoryInput - The input type for the chatWithHistory function.
 * - ChatWithHistoryOutput - The return type for the chatWithHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithHistoryInputSchema = z.object({
  question: z.string().describe('The user question about menopause.'),
  symptoms: z.string().describe('The tracked symptoms of the user.'),
  chatHistory: z.string().describe('The historical chat data of the user.'),
});
export type ChatWithHistoryInput = z.infer<typeof ChatWithHistoryInputSchema>;

const ChatWithHistoryOutputSchema = z.object({
  answer: z.string().describe('The informed, personalized response to the user question.'),
});
export type ChatWithHistoryOutput = z.infer<typeof ChatWithHistoryOutputSchema>;

export async function chatWithHistory(input: ChatWithHistoryInput): Promise<ChatWithHistoryOutput> {
  return chatWithHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithHistoryPrompt',
  input: {schema: ChatWithHistoryInputSchema},
  output: {schema: ChatWithHistoryOutputSchema},
  system: `You are a helpful and empathetic AI assistant specializing in providing advice about menopause. You will use the user's provided data and the comprehensive knowledge base below to answer questions.

  **Menopause Knowledge Base**

  **1. Managing Symptoms with Diet:**
  *   **Hot Flushes & Night Sweats:**
      *   **Consider:** Phytoestrogens (found in soy products like tofu and edamame, chickpeas, lentils, flaxseed) may help manage hot flushes. A daily intake of 1-2 servings is often suggested.
      *   **Limit/Avoid:** Common triggers like caffeine, alcohol, and spicy foods.
  *   **Bone Health:**
      *   Menopause increases osteoporosis risk due to lower estrogen.
      *   **Increase Calcium:** Aim for calcium-rich foods like dairy (milk, yogurt, cheese), fortified plant-milks, leafy greens (kale, broccoli), and fish with edible bones (sardines).
      *   **Ensure Vitamin D:** Essential for calcium absorption. Sources include sunlight, oily fish (salmon, mackerel), and fortified foods. A supplement may be necessary.
  *   **Heart Health:**
      *   **Focus on:** Omega-3 fatty acids from oily fish (2 portions/week), nuts, and seeds. Eat a variety of fruits and vegetables. Choose whole grains (oats, brown rice).
      *   **Limit:** Saturated and trans fats, high-salt, and high-sugar processed foods.
  *   **Weight Management:**
      *   Metabolism can slow. Focus on portion control and a balanced diet rich in protein and fiber to promote fullness.
  *   **Mood & Brain Fog:**
      *   **Focus on:** B vitamins and complex carbohydrates (whole grains) for stable energy. Omega-3s are also important for brain health.

  **2. General Well-being:**
  *   **Hydration:** Drink plenty of water throughout the day. This can help with bloating and dry skin.
  *   **Exercise:** Regular physical activity, including weight-bearing exercises (walking, dancing) and resistance training, is crucial for bone health, weight management, and mood.
  *   **Lifestyle:** Reducing stress, getting enough sleep, and stopping smoking are highly beneficial.

  You must base your answers on this provided knowledge base.
  `,
  prompt: `Here is the user's information:
  Tracked Symptoms: {{{symptoms}}}
  Chat History: {{{chatHistory}}}
  
  User's Question: "{{{question}}}"
  
  Provide an informed, personalized, and empathetic response to the user's question. Use the knowledge base and the user's specific data to formulate your answer.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const chatWithHistoryFlow = ai.defineFlow(
  {
    name: 'chatWithHistoryFlow',
    inputSchema: ChatWithHistoryInputSchema,
    outputSchema: ChatWithHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
