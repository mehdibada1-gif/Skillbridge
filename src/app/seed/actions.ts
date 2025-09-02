"use server";

import { db } from "@/lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore";
import { learningPaths, jobOpportunities } from "@/lib/mock-data";

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function seedDatabase(): Promise<ActionResult> {
  try {
    const batch = writeBatch(db);

    // Seed Learning Paths
    const learningPathsCollection = collection(db, "learningPaths");
    for (const [pathKey, modules] of Object.entries(learningPaths)) {
      const docRef = doc(learningPathsCollection, pathKey.replace(/\s+/g, '-').toLowerCase());
      batch.set(docRef, { name: pathKey, modules });
    }

    // Seed Job Opportunities
    const jobsCollection = collection(db, "jobs");
    jobOpportunities.forEach((job) => {
      const docRef = doc(jobsCollection); // Auto-generate ID
      batch.set(docRef, job);
    });

    await batch.commit();

    return { success: true };
  } catch (error: any) {
    console.error("Database seeding failed:", error);
    return { success: false, error: error.message || "An unexpected error occurred during seeding." };
  }
}
