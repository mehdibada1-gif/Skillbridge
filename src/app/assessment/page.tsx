import SkillAssessmentForm from "@/components/app/skill-assessment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppHeader from "@/components/app/header";

export default function AssessmentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline">Skill Assessment</CardTitle>
              <CardDescription className="text-md">
                Answer a few questions to help us understand your skills and interests.
                This will help us build your personalized learning journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SkillAssessmentForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
