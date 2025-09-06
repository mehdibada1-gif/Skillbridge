
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userPortfolio } from "@/lib/mock-data";
import { Award, CheckCircle, Edit, Linkedin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type UserProfile = {
  name: string;
  email: string;
  bio: string;
  skills: string[];
  photoURL?: string;
  linkedinUrl?: string;
};

export default function PortfolioPage() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (user) {
      setLoading(true);
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setProfile({
            name: data.name || user.displayName || "User",
            email: user.email || "",
            bio: data.bio || userPortfolio.bio,
            skills: data.skills || [],
            photoURL: data.photoURL,
            linkedinUrl: data.linkedinUrl,
          });
        } else {
           // If user doc doesn't exist, create a basic profile
          setProfile({
            name: user.displayName || "User",
            email: user.email || "",
            bio: userPortfolio.bio,
            skills: [],
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

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <Card>
          <CardContent className="p-6 relative">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            </div>
             <Skeleton className="h-10 w-10 absolute top-4 right-4" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!user || !profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <p>Please <Link href="/login" className="underline text-primary">log in</Link> to view your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <Card>
        <CardContent className="p-6 relative">
          <div className="flex flex-col items-center text-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.photoURL || user.photoURL || `https://picsum.photos/100/100`} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold font-headline">{profile.name}</h1>
              <p className="text-muted-foreground mt-2 max-w-lg mx-auto">{profile.bio}</p>
              
               {profile.linkedinUrl && (
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <Link href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </Link>
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {profile.skills.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
           <Button asChild variant="outline" size="icon" className="absolute top-4 right-4">
                <Link href="/dashboard/settings">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Profile</span>
                </Link>
            </Button>
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
