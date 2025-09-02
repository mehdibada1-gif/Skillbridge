import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import DashboardNav from "@/components/app/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <DashboardNav />
      </Sidebar>
      <SidebarInset className="bg-background">
          {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
