
"use client";

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Newspaper, ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  tags: string[];
};

type Article = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  dataAiHint: string;
  excerpt: string;
};

export default function MyContentPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch Applied Jobs
      const fetchAppliedJobs = async () => {
        setLoadingJobs(true);
        try {
          const applicationsQuery = query(collection(db, "jobApplications"), where("userId", "==", user.uid));
          const appSnapshot = await getDocs(applicationsQuery);
          const jobIds = appSnapshot.docs.map(d => d.data().jobId);
          
          if (jobIds.length > 0) {
            const jobPromises = jobIds.map(jobId => getDoc(doc(db, "jobs", jobId)));
            const jobDocs = await Promise.all(jobPromises);
            const jobsData = jobDocs
              .filter(doc => doc.exists())
              .map(doc => ({ id: doc.id, ...doc.data() } as Job));
            setAppliedJobs(jobsData);
          } else {
            setAppliedJobs([]);
          }
        } catch (error) {
          console.error("Error fetching applied jobs:", error);
        } finally {
          setLoadingJobs(false);
        }
      };

      // Fetch Saved Articles
      const fetchSavedArticles = async () => {
        setLoadingArticles(true);
        try {
            const savedQuery = query(collection(db, 'savedArticles'), where('userId', '==', user.uid));
            const savedSnapshot = await getDocs(savedQuery);
            const articleIds = savedSnapshot.docs.map(d => d.data().articleId);

            if (articleIds.length > 0) {
              const articlePromises = articleIds.map(id => getDoc(doc(db, 'articles', id)));
              const articleDocs = await Promise.all(articlePromises);
              const articlesData = articleDocs
                .filter(doc => doc.exists())
                .map(doc => ({ id: doc.id, ...doc.data() } as Article));
              setSavedArticles(articlesData);
            } else {
                setSavedArticles([]);
            }
        } catch (error) {
          console.error("Error fetching saved articles:", error);
        } finally {
          setLoadingArticles(false);
        }
      };
      
      fetchAppliedJobs();
      fetchSavedArticles();
    } else if (!loadingAuth) {
        setLoadingJobs(false);
        setLoadingArticles(false);
    }
  }, [user, loadingAuth]);

  if (loadingAuth) {
      return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-40 w-full" />
          </div>
      )
  }

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">Please <Link href="/login" className="underline text-primary">log in</Link> to view your content.</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold font-headline mb-8">My Content</h1>
        <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="jobs"><Briefcase className="mr-2" /> Applied Jobs</TabsTrigger>
                <TabsTrigger value="articles"><Newspaper className="mr-2" /> Saved Articles</TabsTrigger>
            </TabsList>
            <TabsContent value="jobs">
                <div className="space-y-4">
                    {loadingJobs ? (
                         Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="h-40 w-full" />)
                    ) : appliedJobs.length > 0 ? (
                        appliedJobs.map(job => (
                           <Card key={job.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                        <CardTitle className="text-lg">{job.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            {job.company}
                                            <span className="flex items-center gap-1 text-xs">
                                            <MapPin className="h-3 w-3" /> {job.location}
                                            </span>
                                        </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.tags.map(tag => (
                                        <Badge key={tag} variant="outline">{tag}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">You haven't applied for any jobs yet.</p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href="/jobs">Browse Opportunities</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="articles">
                 <div className="space-y-4">
                    {loadingArticles ? (
                        Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="h-40 w-full" />)
                    ) : savedArticles.length > 0 ? (
                        savedArticles.map(article => (
                           <Card key={article.id} className="overflow-hidden flex flex-col">
                               <Image 
                                 src={article.imageUrl}
                                 alt={article.title}
                                 width={800}
                                 height={400}
                                 className="w-full h-40 object-cover"
                                 data-ai-hint={article.dataAiHint}
                               />
                               <CardHeader>
                                   <CardTitle className="text-lg">{article.title}</CardTitle>
                                   <CardDescription>By {article.author}</CardDescription>
                               </CardHeader>
                               <CardContent className='flex-grow'>
                                  <p className="text-muted-foreground text-sm line-clamp-3">{article.excerpt}</p>
                               </CardContent>
                               <CardFooter>
                                   <Button asChild variant="secondary" size="sm" className='w-full'>
                                       <Link href={`/articles/${article.id}`}>Read Full Article <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                   </Button>
                               </CardFooter>
                            </Card>
                        ))
                    ) : (
                         <div className="text-center py-10">
                            <p className="text-muted-foreground">You haven't saved any articles yet.</p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href="/articles">Explore Articles</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
