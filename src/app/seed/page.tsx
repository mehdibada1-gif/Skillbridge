import SeedButton from "@/components/app/seed-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SeedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline">Seed Database</CardTitle>
              <CardDescription className="text-md">
                Click the button below to populate your Firestore database with mock data.
                This will add learning paths and job opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <SeedButton />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
