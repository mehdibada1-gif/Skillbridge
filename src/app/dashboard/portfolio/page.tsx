import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { userPortfolio } from "@/lib/mock-data";
import { Award, CheckCircle } from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://picsum.photos/100/100" alt={userPortfolio.name} />
            <AvatarFallback>{userPortfolio.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold font-headline">{userPortfolio.name}</h1>
            <p className="text-muted-foreground mt-1">{userPortfolio.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {userPortfolio.skills.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Projects</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
