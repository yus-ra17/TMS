import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { LayoutGrid, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/projects" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow group-hover:scale-105 transition-smooth">
            <LayoutGrid className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">TMS</span>
        </Link>
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-3 rounded-full bg-secondary px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground">{user.email}</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
