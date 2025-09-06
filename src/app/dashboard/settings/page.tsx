
"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EditProfileForm from "@/components/app/edit-profile-form";
import Link from "next/link";
import { userPortfolio } from "@/lib/mock-data";


type UserProfile = {
  name: string;
  email: string;
  bio: string;
  photoURL?: string;
  linkedinUrl?: string;
};

export default function SettingsPage() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setProfile({
            name: data.name || user.displayName || "User",
            email: user.email || "",
            bio: data.bio || userPortfolio.bio,
            photoURL: data.photoURL,
            linkedinUrl: data.linkedinUrl,
          });
        } else {
          setProfile({
            name: user.displayName || "User",
            email: user.email || "",
            bio: userPortfolio.bio,
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    if(profile) {
      setProfile({ ...profile, ...updatedProfile });
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <p>Please <Link href="/login" className="underline text-primary">log in</Link> to view your settings.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Settings</CardTitle>
                <CardDescription>Update your profile and account information.</CardDescription>
            </CardHeader>
            <CardContent>
                <EditProfileForm
                    currentUser={profile}
                    userId={user.uid}
                    onProfileUpdate={handleProfileUpdate}
                />
            </CardContent>
        </Card>
    </div>
  );
}
