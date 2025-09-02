"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { seedDatabase } from "@/app/seed/actions";

export default function SeedButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsLoading(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        toast({
          title: "Database Seeded",
          description: "Your database has been populated with mock data.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Seeding Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleSeed} disabled={isLoading} size="lg">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Seeding...
        </>
      ) : (
        "Seed Database"
      )}
    </Button>
  );
}
