// 'use server';
/**
 * @fileOverview An AI assistant that provides helpful and personalized responses to wellbeing questions.
 *
 * - getAiAssistantResponse - A function that generates responses to user questions.
 * - AiAssistantInput - The input type for the getAiAssistantResponse function.
 * - AiAssistantOutput - The return type for the getAiAssistantResponse function.
 */

'use server';
import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AiAssistantInputSchema = z.object({
  question: z.string().describe('The user question about wellbeing.'),
});
export type AiAssistantInput = z.infer<typeof AiAssistantInputSchema>;

const AiAssistantOutputSchema = z.object({
  answer: z.string().describe('The AI assistant response to the question.'),
});
export type AiAssistantOutput = z.infer<typeof AiAssistantOutputSchema>;

export async function getAiAssistantResponse(input: AiAssistantInput): Promise<AiAssistantOutput> {
  return aiAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAssistantPrompt',
  input: {
    schema: z.object({
      question: z.string().describe('The user question about wellbeing.'),
    }),
  },
  output: {
    schema: z.object({
      answer: z.string().describe('The AI assistant response to the question.'),
    }),
  },
  prompt: `You are a wellbeing assistant. A user has asked the following question: {{{question}}}. Provide a helpful and personalized response.`,
});

const aiAssistantFlow = ai.defineFlow<
  typeof AiAssistantInputSchema,
  typeof AiAssistantOutputSchema
>({
  name: 'aiAssistantFlow',
  inputSchema: AiAssistantInputSchema,
  outputSchema: AiAssistantOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
}
);
