import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/hooks/useTheme';
import {
  BarChart3,
  CalendarRange,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Projects', url: '/projects', icon: FolderKanban },
  { title: 'My Tasks', url: '/my-tasks', icon: CheckSquare },
  { title: 'Timeline', url: '/timeline', icon: CalendarRange },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 px-2 py-2 group">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-glow group-hover:scale-105 transition-smooth">
            <LayoutGrid className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-base font-bold tracking-tight leading-none">TMS</p>
              <p className="text-[10px] text-muted-foreground mt-1">Task Management</p>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === '/dashboard'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg transition-smooth',
                          isActive
                            ? 'bg-primary-soft text-primary font-semibold'
                            : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                        )
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="justify-start gap-2 h-9"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!collapsed && <span className="text-sm">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
        </Button>

        {user && !collapsed && (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
              {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate">{user.name || user.email}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="justify-start gap-2 h-9 text-foreground/70 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
