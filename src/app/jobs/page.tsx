
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, serverTimestamp, query, where, getDocs as getAppliedDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AppHeader from "@/components/app/header";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  tags: string[];
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const fetchJobs = async () => {
    try {
      const jobsCollection = collection(db, "jobs");
      const querySnapshot = await getDocs(jobsCollection);
      const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
      if (!user) return;
      try {
        const applicationsQuery = query(collection(db, "jobApplications"), where("userId", "==", user.uid));
        const querySnapshot = await getAppliedDocs(applicationsQuery);
        const ids = new Set(querySnapshot.docs.map(doc => doc.data().jobId));
        setAppliedJobIds(ids);
      } catch (error) {
          console.error("Error fetching applied jobs:", error);
      }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if(user) {
        fetchAppliedJobs();
    }
  }, [user]);
  
  const handleApplyClick = async (job: Job) => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    if (appliedJobIds.has(job.id)) return; // Already applied

    try {
        const applicationRef = doc(db, "jobApplications", `${user.uid}_${job.id}`);
        await setDoc(applicationRef, {
            userId: user.uid,
            jobId: job.id,
            jobTitle: job.title,
            appliedAt: serverTimestamp()
        });
        
        setAppliedJobIds(prev => new Set(prev).add(job.id));
        toast({
            title: "Application Submitted!",
            description: `Your application for ${job.title} has been received.`,
        });

    } catch (error) {
         toast({
            variant: "destructive",
            title: "Application Failed",
            description: "There was an error submitting your application.",
        });
    }
  };

  return (
    <>
      <AppHeader />
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold font-headline mb-6">Opportunities</h1>
        <div className="space-y-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : jobs.map((job) => {
             const isApplied = appliedJobIds.has(job.id);
             return (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          {job.company}
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </span>
                        </CardDescription>
                      </div>
                      <Button onClick={() => handleApplyClick(job)} disabled={loadingAuth || isApplied}>
                        {isApplied ? (
                            <>
                                <Check className="h-4 w-4 mr-2" /> Applied
                            </>
                        ) : (
                            <>
                                Apply <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                        )}
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
            )
          })}
        </div>
      </div>
    </>
  );
}
