
"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";

export type CommunityUser = {
    id: string;
    name: string;
    email: string;
    bio: string;
    skills: string[];
    photoURL?: string;
    linkedinUrl?: string;
    country?: string;
};

export async function getCommunityUsers(): Promise<CommunityUser[]> {
    try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection);
        const querySnapshot = await getDocs(q);
        
        const users = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || "Anonymous",
                email: data.email || "",
                bio: data.bio || "No bio yet.",
                skills: data.skills || [],
                photoURL: data.photoURL,
                linkedinUrl: data.linkedinUrl,
                country: data.country
            }
        });

        return users;

    } catch (error) {
        console.error("Error fetching community users:", error);
        return [];
    }
}
