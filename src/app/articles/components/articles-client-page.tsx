
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, doc, setDoc, deleteDoc, where, query, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export type Article = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  dataAiHint: string;
  excerpt: string;
};

type ArticlesClientPageProps = {
    initialArticles: Article[];
}

export default function ArticlesClientPage({ initialArticles }: ArticlesClientPageProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(false); // Initially false as data is passed in
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();
  const [savedArticleIds, setSavedArticleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSavedArticles = async () => {
      if (!user) return;
      try {
          const savedQuery = query(collection(db, "savedArticles"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(savedQuery);
          const ids = new Set(querySnapshot.docs.map(doc => doc.data().articleId));
          setSavedArticleIds(ids);
      } catch (error) {
          console.error("Error fetching saved articles:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not fetch your saved articles." });
      }
    };
    
    if(user) {
        fetchSavedArticles();
    }
  }, [user, toast]);

  const handleSaveClick = async (article: Article) => {
      if (!user) {
          router.push("/login");
          return;
      }

      const isSaved = savedArticleIds.has(article.id);
      const savedArticleRef = doc(db, "savedArticles", `${user.uid}_${article.id}`);

      try {
          if (isSaved) {
              await deleteDoc(savedArticleRef);
              setSavedArticleIds(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(article.id);
                  return newSet;
              });
              toast({ title: "Article Unsaved", description: `"${article.title}" has been removed from your list.`});
          } else {
              await setDoc(savedArticleRef, {
                  userId: user.uid,
                  articleId: article.id,
                  articleTitle: article.title,
                  savedAt: new Date()
              });
              setSavedArticleIds(prev => new Set(prev).add(article.id));
              toast({ title: "Article Saved!", description: `"${article.title}" has been added to your list.`});
          }
      } catch (error) {
          toast({ variant: "destructive", title: "Error", description: "Could not update your saved articles."});
      }
  }

  if (loading) {
    return (
        <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-28" />
            </CardFooter>
            </Card>
        ))}
        </div>
    )
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => {
        const isSaved = savedArticleIds.has(article.id);
        return (
          <Card key={article.id} className="overflow-hidden flex flex-col">
            <Image 
              src={article.imageUrl}
              alt={article.title}
              width={800}
              height={400}
              className="w-full h-48 object-cover"
              data-ai-hint={article.dataAiHint}
            />
            <CardHeader>
              <CardTitle className="text-xl">{article.title}</CardTitle>
              <CardDescription>By {article.author} on {new Date(article.date).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm">{article.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button asChild>
                <Link href={`/articles/${article.id}`}>
                  Read More <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleSaveClick(article)} disabled={loadingAuth}>
                  {isSaved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5 text-muted-foreground"/>}
                  <span className="sr-only">{isSaved ? 'Unsave Article' : 'Save Article'}</span>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  );
}
