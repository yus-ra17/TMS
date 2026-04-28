import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export function Navbar() {
  const { email, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/projects" className="nav-brand">TMS</Link>
      <div className="nav-right">
        <span className="nav-email">{email}</span>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>
    </nav>
  );
}
