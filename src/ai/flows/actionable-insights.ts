// src/ai/flows/actionable-insights.ts
'use server';

/**
 * @fileOverview A flow for providing actionable insights based on identified SEO issues.
 *
 * - getActionableInsights - A function that generates actionable insights for SEO improvements.
 * - ActionableInsightsInput - The input type for the getActionableInsights function.
 * - ActionableInsightsOutput - The return type for the getActionableInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActionableInsightsInputSchema = z.object({
  onPageSeoData: z.string().describe('The on-page SEO data of the website.'),
  technicalSeoData: z.string().describe('The technical SEO data of the website.'),
});
export type ActionableInsightsInput = z.infer<typeof ActionableInsightsInputSchema>;

const ActionableInsightsOutputSchema = z.object({
  recommendations: z.string().describe('Specific, actionable recommendations for SEO improvements.'),
});
export type ActionableInsightsOutput = z.infer<typeof ActionableInsightsOutputSchema>;

export async function getActionableInsights(input: ActionableInsightsInput): Promise<ActionableInsightsOutput> {
  return actionableInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'actionableInsightsPrompt',
  input: {schema: ActionableInsightsInputSchema},
  output: {schema: ActionableInsightsOutputSchema},
  prompt: `You are an SEO expert providing actionable insights based on the provided SEO data.

  Based on the following On-Page SEO data:
  {{onPageSeoData}}

  And the following Technical SEO data:
  {{technicalSeoData}}

  Provide specific, actionable recommendations on what to improve and how to do it.
  Focus on the most impactful changes first. Return the recommendations in a single paragraph.
  `,
});

const actionableInsightsFlow = ai.defineFlow(
  {
    name: 'actionableInsightsFlow',
    inputSchema: ActionableInsightsInputSchema,
    outputSchema: ActionableInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
