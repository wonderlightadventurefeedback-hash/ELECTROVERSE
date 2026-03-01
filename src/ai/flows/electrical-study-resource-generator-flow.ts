'use server';
/**
 * @fileOverview A Genkit flow for generating concise study guides for electrical engineering topics.
 *
 * - generateElectricalStudyResource - A function that handles the generation of study resources.
 * - ElectricalStudyResourceGeneratorInput - The input type for the generateElectricalStudyResource function.
 * - ElectricalStudyResourceGeneratorOutput - The return type for the generateElectricalStudyResource function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ElectricalStudyResourceGeneratorInputSchema = z.object({
  topic: z.string().describe('The specific electrical engineering topic for which to generate a study guide.'),
});
export type ElectricalStudyResourceGeneratorInput = z.infer<typeof ElectricalStudyResourceGeneratorInputSchema>;

const ElectricalStudyResourceGeneratorOutputSchema = z.object({
  topic: z.string().describe('The electrical engineering topic covered in the study guide.'),
  summary: z.string().describe('A concise summary of the electrical engineering topic.'),
  keyTerms: z.array(z.string()).describe('A list of key terms and their brief definitions related to the topic.'),
  formulas: z.array(z.string()).describe('A list of important formulas related to the topic.'),
  foundationalPrinciples: z.array(z.string()).describe('A list of foundational principles and concepts related to the topic.'),
  resources: z.array(z.string()).describe('A list of academic resources or further reading suggestions.'),
});
export type ElectricalStudyResourceGeneratorOutput = z.infer<typeof ElectricalStudyResourceGeneratorOutputSchema>;

export async function generateElectricalStudyResource(
  input: ElectricalStudyResourceGeneratorInput
): Promise<ElectricalStudyResourceGeneratorOutput> {
  return electricalStudyResourceGeneratorFlow(input);
}

const electricalStudyResourceGeneratorPrompt = ai.definePrompt({
  name: 'electricalStudyResourceGeneratorPrompt',
  input: { schema: ElectricalStudyResourceGeneratorInputSchema },
  output: { schema: ElectricalStudyResourceGeneratorOutputSchema },
  prompt: `You are an expert electrical engineering professor. Your task is to create a concise study guide for the given electrical engineering topic. The study guide should include a summary, key terms, important formulas, and foundational principles. Please also suggest some academic resources for further reading.

Topic: {{{topic}}}

Please structure your response in JSON format according to the provided schema.`,
});

const electricalStudyResourceGeneratorFlow = ai.defineFlow(
  {
    name: 'electricalStudyResourceGeneratorFlow',
    inputSchema: ElectricalStudyResourceGeneratorInputSchema,
    outputSchema: ElectricalStudyResourceGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await electricalStudyResourceGeneratorPrompt(input);
    if (!output) {
      throw new Error('Failed to generate study resource.');
    }
    return output;
  }
);
