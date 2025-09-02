import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { jobOpportunities } from "@/lib/mock-data";
import { ArrowRight, MapPin } from "lucide-react";

export default function JobsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Recommended Opportunities</h1>
      <div className="space-y-6">
        {jobOpportunities.map((job, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                        {job.company}
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3"/> {job.location}
                        </span>
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <a href="#">Apply <ArrowRight className="h-4 w-4 ml-2" /></a>
                  </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
