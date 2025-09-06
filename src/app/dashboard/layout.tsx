
import AppHeader from "@/components/app/header";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
       <AppHeader />
       <Suspense>
         {children}
       </Suspense>
    </>
  );
}
