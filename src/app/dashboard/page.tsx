"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle } from "lucide-react";
import { learningPaths, type LearningModule } from "@/lib/mock-data";

function DashboardPage() {
  const searchParams = useSearchParams();
  const skillsParam = searchParams.get('skills');
  const reasoningParam = searchParams.get('reasoning');

  const skills = skillsParam ? skillsParam.split(',') : [];
  
  if (skills.length === 0) {
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

  const getLearningPath = (skill: string): LearningModule[] => {
    const foundPath = Object.keys(learningPaths).find(pathKey => 
      skill.toLowerCase().includes(pathKey.toLowerCase())
    );
    return foundPath ? learningPaths[foundPath] : [];
  };

  const recommendedPaths = new Map<string, LearningModule[]>();
  skills.forEach(skill => {
    const path = getLearningPath(skill);
    if(path.length > 0 && !recommendedPaths.has(skill)) {
      recommendedPaths.set(skill, path);
    }
  });

  if (recommendedPaths.size === 0 && learningPaths["Default"]) {
    recommendedPaths.set("Getting Started", learningPaths["Default"]);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
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
      
      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Your Personalized Learning Paths</h2>
        <div className="space-y-6">
          {Array.from(recommendedPaths.entries()).map(([skill, modules]) => (
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
          ))}
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
