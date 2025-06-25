'use server';
/**
 * @fileOverview A Life Coach AI agent to help users manage emotional stress during menopause.
 *
 * - getCoachingResponse - A function that provides a coaching response.
 * - LifeCoachInput - The input type for the getCoachingResponse function.
 * - LifeCoachOutput - The return type for the getCoachingResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LifeCoachInputSchema = z.object({
  userStatement: z.string().describe("The user's statement about their feelings or a situation they are facing."),
  chatHistory: z.string().optional().describe('The recent history of the conversation.'),
});
export type LifeCoachInput = z.infer<typeof LifeCoachInputSchema>;

const LifeCoachOutputSchema = z.object({
  coachResponse: z.string().describe("The coach's response, typically an open-ended question to encourage reflection."),
});
export type LifeCoachOutput = z.infer<typeof LifeCoachOutputSchema>;

export async function getCoachingResponse(input: LifeCoachInput): Promise<LifeCoachOutput> {
  return lifeCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lifeCoachPrompt',
  input: {schema: LifeCoachInputSchema},
  output: {schema: LifeCoachOutputSchema},
  prompt: `You are a Life Coach who helps users deal with emotional outbursts or stress related to menopause. You leverage life coaching principles, which means you NEVER give direct advice. Instead, you guide the user to their own solutions by asking powerful, open-ended questions that promote reflection and self-discovery.

Your response should always be a question.

{{#if chatHistory}}
Recent conversation:
{{{chatHistory}}}
{{/if}}

User says: "{{{userStatement}}}"

Based on their statement, what is one thoughtful, open-ended question you can ask to help them explore their feelings and find their own way forward?
`,
});

const lifeCoachFlow = ai.defineFlow(
  {
    name: 'lifeCoachFlow',
    inputSchema: LifeCoachInputSchema,
    outputSchema: LifeCoachOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
