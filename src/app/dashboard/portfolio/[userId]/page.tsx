
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userPortfolio } from "@/lib/mock-data";
import { Award, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type UserProfile = {
  name: string;
  email: string;
  bio: string;
  skills: string[];
  photoURL?: string;
};

export default function UserPortfolioPage({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        setLoading(true);
        try {
          const userDocRef = doc(db, "users", userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setProfile({
              name: data.name || "User",
              email: data.email || "",
              bio: data.bio || userPortfolio.bio,
              skills: data.skills || [],
              photoURL: data.photoURL,
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <Card>
          <CardContent className="p-6 flex flex-col items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2 text-center">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <p>User profile not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.photoURL || `https://picsum.photos/seed/${userId}/100/100`} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold font-headline">{profile.name}</h1>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">{profile.bio}</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {profile.skills.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Projects</h2>
        <div className="space-y-6">
          {userPortfolio.projects.map((project, index) => (
            <Card key={index} className="overflow-hidden">
              <Image 
                src={project.imageUrl}
                alt={project.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
                data-ai-hint={project.dataAiHint}
              />
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Certifications</h2>
        <Card>
          <CardContent className="p-6">
            <ul className="space-y-4">
              {userPortfolio.certifications.map((cert, index) => (
                <li key={index} className="flex items-center gap-4">
                  <Award className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">{cert.name}</p>
                    <p className="text-sm text-muted-foreground">Issued by {cert.issuer} on {cert.date}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
