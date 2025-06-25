'use server';
/**
 * @fileOverview A Maestro AI agent that collects and analyzes user's daily journals.
 *
 * - analyzeJournal - A function that handles the journal analysis process.
 * - MaestroInput - The input type for the analyzeJournal function.
 * - MaestroOutput - The return type for the analyzeJournal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MaestroInputSchema = z.object({
  journal: z.string().describe("The user's daily journal entry about their food, feelings, and challenges related to menopause."),
});
export type MaestroInput = z.infer<typeof MaestroInputSchema>;

const MaestroOutputSchema = z.object({
  emotions: z.array(z.string()).describe('A list of key emotions identified from the journal entry.'),
  challenges: z.array(z.string()).describe('A list of challenges related to menopause identified from the journal entry.'),
  foodEaten: z.array(z.string()).describe('A list of foods the user consumed, as mentioned in the journal.'),
});
export type MaestroOutput = z.infer<typeof MaestroOutputSchema>;

export async function analyzeJournal(input: MaestroInput): Promise<MaestroOutput> {
  return maestroFlow(input);
}

const prompt = ai.definePrompt({
  name: 'maestroPrompt',
  input: {schema: MaestroInputSchema},
  output: {schema: MaestroOutputSchema},
  prompt: `You are Maestro, an empathetic AI assistant designed to help women navigate menopause. Your primary role is to listen and understand their daily experiences.

From the following journal entry, please extract and list the following:
1.  **Emotions**: Identify the key feelings the user has expressed.
2.  **Challenges**: Pinpoint the specific menopause-related difficulties or struggles they mentioned.
3.  **Food Eaten**: List all the food items the user said they consumed.

Analyze the entry carefully and populate the appropriate fields in the output.

Journal Entry:
{{{journal}}}
`,
});

const maestroFlow = ai.defineFlow(
  {
    name: 'maestroFlow',
    inputSchema: MaestroInputSchema,
    outputSchema: MaestroOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
