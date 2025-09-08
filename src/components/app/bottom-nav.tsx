
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, User, Briefcase, Users, Newspaper, Bookmark, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

const publicNavItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/articles", icon: Newspaper, label: "Articles" },
  { href: "/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/community", icon: Users, label: "Community" },
];

const privateNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/my-content", icon: Bookmark, label: "My Content" },
  { href: "/dashboard/portfolio", icon: User, label: "Portfolio" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function AppBottomNav() {
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
       <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-16 bg-card border-t z-10">
         <div className="h-full flex justify-around items-center animate-pulse">
            <div className="h-8 w-16 bg-muted rounded-md"></div>
            <div className="h-8 w-16 bg-muted rounded-md"></div>
            <div className="h-8 w-16 bg-muted rounded-md"></div>
            <div className="h-8 w-16 bg-muted rounded-md"></div>
         </div>
       </footer>
    )
  }

  const navItems = user ? privateNavItems : publicNavItems;
  
  return (
    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-16 bg-card border-t z-10">
      <nav className="h-full">
        <ul className="h-full flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <li key={item.href} className="h-full">
                <Link href={item.href} className="h-full flex flex-col justify-center items-center gap-1 w-20 text-center">
                  <item.icon className={cn("h-6 w-6", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs",  isActive ? "text-primary" : "text-muted-foreground")}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
