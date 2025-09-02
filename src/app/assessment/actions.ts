"use server";

import { skillAssessmentCategorization } from '@/ai/flows/skill-assessment-categorization';
import { z } from 'zod';

const assessmentSchema = z.object({
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  }))
});

type AssessmentInput = z.infer<typeof assessmentSchema>;

type ActionResult = {
  success: boolean;
  skills: string[];
  reasoning: string;
  error?: string;
}

export async function analyzeSkillsAction(data: AssessmentInput): Promise<ActionResult> {
  const validation = assessmentSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, skills: [], reasoning: "", error: "Invalid input data." };
  }
  
  try {
    const analysisPromises = validation.data.answers.map(item => 
      skillAssessmentCategorization({
        question: item.question,
        answer: item.answer,
      })
    );

    const results = await Promise.all(analysisPromises);

    const allSkills = new Set<string>();
    const allReasoning: string[] = [];

    results.forEach(result => {
      result.skillCategories.forEach(skill => {
        // Simple normalization
        const normalizedSkill = skill.trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        if (normalizedSkill) {
            allSkills.add(normalizedSkill);
        }
      });
      allReasoning.push(result.reasoning);
    });
    
    const combinedReasoning = `Based on your answers, we've identified several key skill areas:\n\n` + allReasoning.join('\n\n');

    if (allSkills.size === 0) {
        return {
            success: true,
            skills: [],
            reasoning: "We couldn't identify specific skills from your answers. You might want to provide more detailed responses about your experiences and goals."
        }
    }

    return {
      success: true,
      skills: Array.from(allSkills),
      reasoning: combinedReasoning,
    };

  } catch (error) {
    console.error("AI skill analysis failed:", error);
    return { success: false, skills: [], reasoning: "", error: "An unexpected error occurred during analysis." };
  }
}
