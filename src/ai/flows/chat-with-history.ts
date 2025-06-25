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
  prompt: `You are a helpful AI assistant specialized in providing advice about menopause based on user's tracked symptoms and historical chat data.

  Symptoms: {{{symptoms}}}
  Chat History: {{{chatHistory}}}
  Question: {{{question}}}
  
  Provide an informed, personalized response to the user question, taking into account the symptoms and chat history.
  `,config: {
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
