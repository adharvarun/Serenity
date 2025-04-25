'use server';
/**
 * @fileOverview Calculates a wellbeing score based on user inputs.
 *
 * - calculateWellbeingScore - A function that calculates the wellbeing score.
 * - WellbeingScoreInput - The input type for the calculateWellbeingScore function.
 * - WellbeingScoreOutput - The return type for the calculateWellbeingScore function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const WellbeingScoreInputSchema = z.object({
  mood: z.string().describe('The user\'s mood today (e.g., happy, sad, stressed).'),
  activities: z
    .string()
    .describe(
      'A comma-separated list of activities the user participated in today (e.g., exercise, reading, socializing).'
    ),
  journalEntry: z.string().describe('A journal entry reflecting the user\'s thoughts and feelings today.'),
});
export type WellbeingScoreInput = z.infer<typeof WellbeingScoreInputSchema>;

const WellbeingScoreOutputSchema = z.object({
  wellbeingScore: z
    .number()
    .describe('A score from 1 to 100 representing the user\'s overall wellbeing, with 100 being the best.'),
  summary: z.string().describe('A brief summary of factors influencing the wellbeing score.'),
});
export type WellbeingScoreOutput = z.infer<typeof WellbeingScoreOutputSchema>;

export async function calculateWellbeingScore(input: WellbeingScoreInput): Promise<WellbeingScoreOutput> {
  return calculateWellbeingScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wellbeingScorePrompt',
  input: {
    schema: z.object({
      mood: z.string().describe('The user\'s mood today (e.g., happy, sad, stressed).'),
      activities: z
        .string()
        .describe(
          'A comma-separated list of activities the user participated in today (e.g., exercise, reading, socializing).'
        ),
      journalEntry: z.string().describe('A journal entry reflecting the user\'s thoughts and feelings today.'),
    }),
  },
  output: {
    schema: z.object({
      wellbeingScore: z
        .number()
        .describe('A score from 1 to 100 representing the user\'s overall wellbeing, with 100 being the best.'),
      summary: z.string().describe('A brief summary of factors influencing the wellbeing score.'),
    }),
  },
  prompt: `Based on the user's mood, activities, and journal entry, calculate a wellbeing score from 1 to 100.

Mood: {{{mood}}}
Activities: {{{activities}}}
Journal Entry: {{{journalEntry}}}

Provide a brief summary of the factors that influenced the score.

Wellbeing Score:`, // Ensure the prompt asks for both score and summary
});

const calculateWellbeingScoreFlow = ai.defineFlow<
  typeof WellbeingScoreInputSchema,
  typeof WellbeingScoreOutputSchema
>(
  {
    name: 'calculateWellbeingScoreFlow',
    inputSchema: WellbeingScoreInputSchema,
    outputSchema: WellbeingScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
