
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AppHeader from "@/components/app/header";

export default function KnowledgeBasePage() {
  const faqItems = [
    {
      question: "What is SkillBridge?",
      answer: "SkillBridge is a platform designed to help young individuals identify their skills, access personalized learning paths, and connect with job or social impact opportunities. It uses AI to create a tailored experience for each user."
    },
    {
      question: "How do I get started?",
      answer: "Start by navigating to the '/login' page to create an account. Once registered, you will be redirected to the dashboard. To get a personalized experience, take the skill assessment by clicking on 'Take the Skill Assessment' from the dashboard or visiting the '/assessment' page directly."
    },
    {
      question: "How does the Skill Assessment work?",
      answer: "The skill assessment asks you three open-ended questions about your experiences and aspirations. Our AI analyzes your answers to identify your key skills and create a set of personalized learning paths for you, which you can see on your dashboard."
    },
    {
      question: "What is the purpose of the '/seed' page?",
      answer: "The '/seed' page is a utility for developers or administrators. It populates the Firestore database with initial mock data, such as learning paths and job opportunities. This is necessary to ensure the application has content to display when you first set it up. You only need to do this once."
    },
    {
      question: "How do I see my recommended learning paths and jobs?",
      answer: "After completing the skill assessment, your dashboard ('/dashboard') will be updated to show your identified skills and a list of recommended learning paths. The 'Opportunities' page ('/dashboard/jobs') will show job listings that may be relevant to your skills."
    },
    {
      question: "How is my data stored and is it secure?",
      answer: "Your application data, including user accounts, skills, and learning progress, is stored in Google Cloud Firestore. We have implemented Firestore Security Rules to protect your data, ensuring that users can only access their own information."
    },
    {
      question: "Which countries and languages are supported?",
      answer: "The app is designed for an international audience, with a focus on Italy, the Netherlands, Sweden, Lebanon, Tunisia, and Morocco. You can use the globe icon in the header to switch between languages/countries, although full translation is a feature planned for future development."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Knowledge Base & FAQ</CardTitle>
            <CardDescription>
              Find answers to common questions about the SkillBridge platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
