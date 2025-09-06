
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lightbulb, ListChecks, Award, Briefcase } from "lucide-react";
import Image from "next/image";
import AppHeader from "@/components/app/header";

export default function Home() {
  const features = [
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "AI-Powered Skill Assessment",
      description: "Our interactive quiz identifies your strengths and areas for growth to build a personalized roadmap.",
    },
    {
      icon: <ListChecks className="h-8 w-8 text-primary" />,
      title: "Personalized Learning Paths",
      description: "Receive tailored course recommendations that align with your career goals and skill gaps.",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Portfolio & Certifications",
      description: "Build a professional portfolio and earn micro-certifications to showcase your new abilities.",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: "Job & Project Matching",
      description: "Connect with real-world job opportunities and social impact projects that match your skills.",
    },
  ];

  return (
    <>
      <AppHeader />
      <main>
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                Bridge Your Skills to Your Future
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                SkillBridge empowers youth with personalized training and direct connections to social entrepreneurship and employment ecosystems.
              </p>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/assessment">
                    Start Your Skill Assessment <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                How SkillBridge Works
              </h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                A simple yet powerful path from learning to earning.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="flex items-start gap-4 p-6">
                   <div className="bg-primary/10 text-primary rounded-full p-3 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-headline mb-2">{feature.title}</CardTitle>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-muted-foreground text-sm">
                <p>
                  Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Education and Culture Executive Agency (EACEA). Neither the European Union nor EACEA can be held responsible for them.
                </p>
              </div>
              <div>
                <Image
                  src="https://dare4.masterpeace.org/wp-content/uploads/sites/19/2024/03/EN-Co-Funded-by-the-EU_PANTONE-1536x322.png"
                  alt="Co-Funded by the European Union"
                  width={1536}
                  height={322}
                  className="w-full h-auto object-contain max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full py-6 bg-card border-t">
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-center md:text-left mb-4 md:mb-0">
              © 2025 SkillBridge. All rights reserved by <a href="https://dare4.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Dare4.0</a>
            </p>
            <Image 
              src="https://dare4.masterpeace.org/wp-content/uploads/sites/19/2024/03/dare4-logos.png" 
              alt="Dare4.0 Logos"
              width={200}
              height={50}
              className="object-contain"
            />
          </div>
        </footer>
      </main>
    </>
  );
}
