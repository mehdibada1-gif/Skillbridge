
"use client";

import { Toaster } from "@/components/ui/toaster"
import AppBottomNav from '@/components/app/bottom-nav';
import AppHeader from "./header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center">
        <div className="w-full max-w-sm flex-1 flex flex-col bg-background shadow-2xl relative">
            <AppHeader />
            <main className="flex-1 overflow-y-auto pb-20">
              {children}
            </main>
            <AppBottomNav />
            <Toaster />
        </div>
    </div>
  )
}
