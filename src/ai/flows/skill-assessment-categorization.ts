'use server';

/**
 * @fileOverview A skill assessment AI agent that categorizes user answers and maps them to relevant skill categories.
 *
 * - skillAssessmentCategorization - A function that handles the skill assessment categorization process.
 * - SkillAssessmentCategorizationInput - The input type for the skillAssessmentCategorization function.
 * - SkillAssessmentCategorizationOutput - The return type for the skillAssessmentCategorization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillAssessmentCategorizationInputSchema = z.object({
  question: z.string().describe('The skill assessment question asked to the user.'),
  answer: z.string().describe('The user provided answer to the skill assessment question.'),
});
export type SkillAssessmentCategorizationInput = z.infer<typeof SkillAssessmentCategorizationInputSchema>;

const SkillAssessmentCategorizationOutputSchema = z.object({
  skillCategories: z
    .array(z.string())
    .describe('An array of skill categories relevant to the user answer.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the skill category assignments based on the user answer.'),
});
export type SkillAssessmentCategorizationOutput = z.infer<typeof SkillAssessmentCategorizationOutputSchema>;

export async function skillAssessmentCategorization(
  input: SkillAssessmentCategorizationInput
): Promise<SkillAssessmentCategorizationOutput> {
  return skillAssessmentCategorizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillAssessmentCategorizationPrompt',
  input: {schema: SkillAssessmentCategorizationInputSchema},
  output: {schema: SkillAssessmentCategorizationOutputSchema},
  prompt: `You are an AI assistant specialized in categorizing user answers from skill assessment quizzes into relevant skill categories.

  Given the following question and the user's answer, identify the most relevant skill categories and explain your reasoning.

  Question: {{{question}}}
  Answer: {{{answer}}}

  Output the skill categories as a JSON array and provide a brief explanation for each category assignment.
  Make sure the categories in the array are very succinct and to the point.
  Ensure that the "reasoning" field justifies how the answer relates to the assigned skill categories, and also lists all the categories that are included in the skillCategories array.
  `,
});

const skillAssessmentCategorizationFlow = ai.defineFlow(
  {
    name: 'skillAssessmentCategorizationFlow',
    inputSchema: SkillAssessmentCategorizationInputSchema,
    outputSchema: SkillAssessmentCategorizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

