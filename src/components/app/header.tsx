
"use client";

import Link from "next/link";
import { BrainCircuit, LogOut, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  }

  const countries = [
    { name: 'Italy', code: 'it' },
    { name: 'Netherlands', code: 'nl' },
    { name: 'Sweden', code: 'se' },
    { name: 'Lebanon', code: 'lb' },
    { name: 'Tunisia', code: 'tn' },
    { name: 'Morocco', code: 'ma' },
  ];

  if (pathname === '/login') return null;

  return (
    <header className="w-full px-4 md:px-6 h-16 flex items-center bg-card border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">
            SkillBridge
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Globe className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Select Language/Country</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {countries.map(country => (
                        <DropdownMenuItem key={country.code}>
                            {country.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {loading ? (
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            ) : user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
                                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">My Account</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/dashboard/portfolio')}>
                          Portfolio
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                </Button>
            )}
        </div>
      </div>
    </header>
  );
}
