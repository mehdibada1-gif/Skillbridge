"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { analyzeSkillsAction } from "@/app/assessment/actions";

const quizQuestions = [
  {
    id: "q1",
    question: "Describe a project you've worked on, either personal or professional, that you are proud of. What was your role and what did you accomplish?",
    placeholder: "e.g., I built a website for a local charity, managed a school event, or developed a small mobile app..."
  },
  {
    id: "q2",
    question: "When faced with a complex problem, what is your typical approach to solving it? Provide an example.",
    placeholder: "e.g., I break it down into smaller parts, research potential solutions, and then test different approaches..."
  },
  {
    id: "q3",
    question: "What are your career aspirations for the next 2-3 years, and what skills do you think you need to achieve them?",
    placeholder: "e.g., I want to become a junior web developer, so I need to learn JavaScript and React. Or, I want to start my own social enterprise focused on..."
  }
];

const formSchema = z.object({
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string().min(30, { message: "Please provide a more detailed answer (at least 30 characters)." }),
  }))
});

type FormValues = z.infer<typeof formSchema>;

export default function SkillAssessmentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [user, loadingUser] = useAuthState(auth);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: quizQuestions.map(q => ({ question: q.question, answer: "" })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "answers",
  });

  async function onSubmit(data: FormValues) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "You must be logged in to submit an assessment.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeSkillsAction(user.uid, data);

      if (result.success) {
        const params = new URLSearchParams({
          skills: result.skills.join(','),
          reasoning: result.reasoning
        });
        router.push(`/dashboard?${params.toString()}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to analyze skills:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error processing your assessment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => {
          const questionInfo = quizQuestions[index];
          return (
            <FormField
              key={field.id}
              control={form.control}
              name={`answers.${index}.answer`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">{questionInfo.question}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={questionInfo.placeholder}
                      className="min-h-[120px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || loadingUser} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Submit for Analysis"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
