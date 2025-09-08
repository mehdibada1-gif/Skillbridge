
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ArticlesClientPage from "./components/articles-client-page";
import { Article } from "./components/articles-client-page";

async function getArticles(): Promise<Article[]> {
  try {
    const articlesCollection = collection(db, "articles");
    const q = query(articlesCollection, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const articlesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
    return articlesData;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold font-headline mb-2">Articles & Insights</h1>
      <p className="text-muted-foreground mb-8">
        Explore tips, stories, and advice to help you on your career journey.
      </p>
      <ArticlesClientPage initialArticles={articles} />
    </div>
  );
}
