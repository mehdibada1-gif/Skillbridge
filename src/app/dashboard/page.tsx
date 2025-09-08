
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardClientPage from './components/dashboard-client-page';


export default function DashboardPageWrapper() {
  return (
      <Suspense fallback={<div className="p-4 sm:p-6 lg:p-8 space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>}>
          <DashboardClientPage />
      </Suspense>
  )
}
