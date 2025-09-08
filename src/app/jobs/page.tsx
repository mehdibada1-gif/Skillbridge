
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import JobsClientPage from "./components/jobs-client-page";
import { Job } from "./components/jobs-client-page";

async function getJobs(): Promise<Job[]> {
    try {
      const jobsCollection = collection(db, "jobs");
      const querySnapshot = await getDocs(jobsCollection);
      const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      return jobsData;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // In a real app, you'd want to handle this error more gracefully
      return [];
    }
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Opportunities</h1>
      <JobsClientPage initialJobs={jobs} />
    </div>
  );
}
