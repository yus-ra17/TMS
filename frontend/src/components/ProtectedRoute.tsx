import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

// Set VITE_DISABLE_AUTH=true in .env to preview protected pages without logging in.
const AUTH_DISABLED = import.meta.env.VITE_DISABLE_AUTH === 'true';

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token && !AUTH_DISABLED) return <Navigate to="/login" replace />;
  return <>{children ?? <Outlet />}</>;
}
