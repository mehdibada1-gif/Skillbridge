"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { type LearningModule } from "@/lib/mock-data";
import { Skeleton } from '@/components/ui/skeleton';


type LearningPath = {
  name: string;
  modules: LearningModule[];
}

function DashboardPage() {
  const searchParams = useSearchParams();
  const skillsParam = searchParams.get('skills');
  const reasoningParam = searchParams.get('reasoning');
  const skills = skillsParam ? skillsParam.split(',') : [];

  const [recommendedPaths, setRecommendedPaths] = useState<Map<string, LearningModule[]>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPaths = async () => {
      setLoading(true);
      const paths = new Map<string, LearningModule[]>();
      
      try {
        const learningPathsCollection = collection(db, "learningPaths");

        if (skills.length > 0) {
          const pathPromises = skills.map(skill => {
            const docId = skill.trim().toLowerCase().replace(/\s+/g, '-');
            return getDoc(doc(learningPathsCollection, docId));
          });
          const pathSnapshots = await Promise.all(pathPromises);
          
          pathSnapshots.forEach((docSnap, index) => {
            if (docSnap.exists()) {
              const pathData = docSnap.data() as LearningPath;
              paths.set(pathData.name, pathData.modules);
            }
          });
        }
        
        if (paths.size === 0) {
          const defaultPathSnap = await getDoc(doc(learningPathsCollection, 'default'));
          if(defaultPathSnap.exists()) {
            const pathData = defaultPathSnap.data() as LearningPath;
            paths.set(pathData.name, pathData.modules);
          }
        }
      } catch (error) {
        console.error("Error fetching learning paths:", error);
      }
      
      setRecommendedPaths(paths);
      setLoading(false);
    };

    fetchLearningPaths();

  }, [skillsParam]); // Re-run when skills change

  
  if (skills.length === 0 && !loading) {
    return (
       <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-card">
            <h2 className="text-2xl font-bold font-headline mb-4">Welcome to Your Dashboard!</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
            Start your journey by discovering your unique skills. Our assessment will create a personalized learning path just for you.
            </p>
            <Button asChild size="lg">
            <Link href="/assessment">
                Take the Skill Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Your Skill Analysis</CardTitle>
            <CardDescription>
              Based on your answers, here are the key skills we've identified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reasoningParam}</p>
          </CardContent>
        </Card>
      )}
      
      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">
          {skills.length > 0 ? "Your Personalized Learning Paths" : "Getting Started"}
        </h2>
        <div className="space-y-6">
          {loading ? (
             Array.from({ length: 2 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            Array.from(recommendedPaths.entries()).map(([skill, modules]) => (
              <Card key={skill}>
                <CardHeader>
                  <CardTitle>{skill}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {modules.map((mod, index) => (
                       <li key={index} className="flex items-start gap-4">
                          <div className="bg-primary/10 text-primary rounded-full p-2 mt-1">
                              <BookOpen className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                              <h4 className="font-semibold">{mod.title}</h4>
                              <p className="text-sm text-muted-foreground">{mod.type} &middot; {mod.duration}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                              <ArrowRight className="h-4 w-4" />
                          </Button>
                       </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


export default function DashboardPageWrapper() {
  return (
      <Suspense fallback={<div className="p-4 sm:p-6 lg:p-8">Loading...</div>}>
          <DashboardPage />
      </Suspense>
  )
}
