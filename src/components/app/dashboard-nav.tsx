"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { BrainCircuit, LayoutDashboard, User, Briefcase } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/dashboard/portfolio", icon: <User />, label: "My Portfolio" },
  { href: "/dashboard/jobs", icon: <Briefcase />, label: "Opportunities" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            SkillBridge
          </span>
        </Link>
        <SidebarTrigger className="hidden md:flex" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: "right", align: "center" }}
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
