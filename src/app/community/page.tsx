
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCommunityUsers, type CommunityUser } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Linkedin, Mail, MapPin } from "lucide-react";
import AppHeader from "@/components/app/header";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function CommunityPage() {
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const fetchedUsers = await getCommunityUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleContactClick = () => {
      if (!user) {
          router.push('/login');
      } else {
          // Future messaging functionality can be added here.
      }
  }

  return (
    <>
      <AppHeader />
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold font-headline mb-2">Community Hub</h1>
        <p className="text-muted-foreground mb-8">
          Connect with other learners and builders on the platform.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.id}/100/100`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            {user.country && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3"/> {user.country}
                                </p>
                            )}
                          </div>
                          <Button asChild variant="ghost" size="icon" className="flex-shrink-0">
                            <Link href={`/portfolio/${user.id}`}>
                              <span className="sr-only">View Profile</span>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <Button variant="outline" size="sm" onClick={handleContactClick} disabled={!!user}>
                                <Mail className="mr-2"/> Contact
                            </Button>
                            {user.linkedinUrl && (
                                <Button asChild variant="secondary" size="sm">
                                    <Link href={user.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="mr-2" /> LinkedIn
                                    </Link>
                                </Button>
                            )}
                        </div>
                      </div>
                  </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
