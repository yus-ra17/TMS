import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

export default function AppLayout() {
  const location = useLocation();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background bg-mesh">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-2 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30 px-3">
            <SidebarTrigger />
            <div className="text-sm font-medium text-muted-foreground capitalize">
              {location.pathname.split('/').filter(Boolean)[0] || 'dashboard'}
            </div>
          </header>
          <main key={location.pathname} className="flex-1 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
