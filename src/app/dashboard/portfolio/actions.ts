
"use server";

import { auth, db, storage } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().max(280, { message: "Bio cannot be longer than 280 characters."}).optional(),
  photo: z.string().optional(), // base64 encoded image
  linkedinUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type ProfileInput = z.infer<typeof profileSchema>;

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function updateProfile(userId: string, data: ProfileInput): Promise<ActionResult> {
  try {
    if (!userId) {
      throw new Error("User not authenticated.");
    }
    
    const validation = profileSchema.safeParse(data);
    if (!validation.success) {
      const errorMessages = Object.values(validation.error.flatten().fieldErrors).join(', ');
      return { success: false, error: errorMessages };
    }
    
    const userDocRef = doc(db, "users", userId);
    const { name, bio, linkedinUrl, photo } = validation.data;
    
    // Only include fields that are allowed to be updated.
    const updateData: { [key: string]: any } = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;

    if (photo && photo.startsWith('data:image/')) {
        const storageRef = ref(storage, `profile-pictures/${userId}`);
        const uploadResult = await uploadString(storageRef, photo, 'data_url');
        const downloadURL = await getDownloadURL(uploadResult.ref);
        updateData.photoURL = downloadURL;
    }

    await updateDoc(userDocRef, updateData);

    return { success: true };
  } catch (error: any) {
    console.error("Profile update failed:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
