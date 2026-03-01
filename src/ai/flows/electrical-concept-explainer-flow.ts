'use server';
/**
 * @fileOverview An AI agent that explains electrical engineering concepts.
 *
 * - explainElectricalConcept - A function that handles the explanation of electrical engineering concepts.
 * - ElectricalConceptExplainerInput - The input type for the explainElectricalConcept function.
 * - ElectricalConceptExplainerOutput - The return type for the explainElectricalConcept function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ElectricalConceptExplainerInputSchema = z.object({
  concept: z.string().describe('The electrical engineering concept to explain.'),
});
export type ElectricalConceptExplainerInput = z.infer<
  typeof ElectricalConceptExplainerInputSchema
>;

const ElectricalConceptExplainerOutputSchema = z.object({
  explanation: z.string().describe('A comprehensive explanation of the concept.'),
  definitions: z
    .string()
    .describe('Key definitions related to the concept, formatted as a list.'),
  academicResources: z
    .string()
    .describe(
      'Suggestions for academic resources (e.g., books, articles, websites) to learn more, formatted as a list.'
    ),
});
export type ElectricalConceptExplainerOutput = z.infer<
  typeof ElectricalConceptExplainerOutputSchema
>;

export async function explainElectricalConcept(
  input: ElectricalConceptExplainerInput
): Promise<ElectricalConceptExplainerOutput> {
  return electricalConceptExplainerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'electricalConceptExplainerPrompt',
  input: {schema: ElectricalConceptExplainerInputSchema},
  output: {schema: ElectricalConceptExplainerOutputSchema},
  prompt: `You are an expert electrical engineering tutor.

Your task is to provide a clear, comprehensive explanation for the given electrical engineering concept. Additionally, you should extract and list key definitions related to the concept, and suggest relevant academic resources for further study.

Concept: {{{concept}}}`,
});

const electricalConceptExplainerFlow = ai.defineFlow(
  {
    name: 'electricalConceptExplainerFlow',
    inputSchema: ElectricalConceptExplainerInputSchema,
    outputSchema: ElectricalConceptExplainerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
