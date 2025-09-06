
"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import AppHeader from "@/components/app/header";
import { CardDescription } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

type Article = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  dataAiHint: string;
  content: string;
};

export default function ArticlePage({ params }: { params: { articleId: string } }) {
  const { articleId } = params;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        setLoading(true);
        try {
          const articleDocRef = doc(db, "articles", articleId);
          const articleDocSnap = await getDoc(articleDocRef);

          if (articleDocSnap.exists()) {
            setArticle({ id: articleDocSnap.id, ...articleDocSnap.data() } as Article);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching article:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArticle();
  }, [articleId]);
  
  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="p-4 sm:p-6 lg:p-8 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <AppHeader />
        <div className="p-4 sm:p-6 lg:p-8 text-center">
          <p>Article not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <article className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl lg:text-4xl font-bold font-headline mb-4">{article.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString()}
                </time>
            </div>
        </div>
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={1200}
          height={600}
          className="w-full h-auto rounded-lg object-cover mb-8"
          data-ai-hint={article.dataAiHint}
          priority
        />
        <div className="prose prose-lg max-w-none text-foreground prose-p:text-foreground prose-headings:text-foreground">
          {/* Using a simple paragraph for content display. For rich text, you'd use a Markdown renderer. */}
          <p>{article.content}</p>
        </div>
      </article>
    </>
  );
}
