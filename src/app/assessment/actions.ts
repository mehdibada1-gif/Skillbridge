"use server";

import { skillAssessmentCategorization } from '@/ai/flows/skill-assessment-categorization';
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from 'firebase/firestore';
import { z } from 'zod';

const assessmentSchema = z.object({
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
  userId: z.string(),
});

type AssessmentInput = Omit<z.infer<typeof assessmentSchema>, 'userId'>;

type ActionResult = {
  success: boolean;
  skills: string[];
  reasoning: string;
  error?: string;
}

export async function analyzeSkillsAction(userId: string, data: AssessmentInput): Promise<ActionResult> {
  const input = { ...data, userId };
  const validation = assessmentSchema.safeParse(input);

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
        const normalizedSkill = skill.trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        if (normalizedSkill) {
            allSkills.add(normalizedSkill);
        }
      });
      allReasoning.push(result.reasoning);
    });
    
    const combinedReasoning = `Based on your answers, we've identified several key skill areas:\n\n` + allReasoning.join('\n\n');
    const finalSkills = Array.from(allSkills);

    // Save skills to user's Firestore document
    if (validation.data.userId && finalSkills.length > 0) {
      const userDocRef = doc(db, "users", validation.data.userId);
      await updateDoc(userDocRef, {
        skills: finalSkills
      });
    }


    if (allSkills.size === 0) {
        return {
            success: true,
            skills: [],
            reasoning: "We couldn't identify specific skills from your answers. You might want to provide more detailed responses about your experiences and goals."
        }
    }

    return {
      success: true,
      skills: finalSkills,
      reasoning: combinedReasoning,
    };

  } catch (error) {
    console.error("AI skill analysis failed:", error);
    return { success: false, skills: [], reasoning: "", error: "An unexpected error occurred during analysis." };
  }
}
