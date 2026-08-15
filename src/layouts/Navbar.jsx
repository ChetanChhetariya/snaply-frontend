import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCurrentUserId } from '../utils/Auth';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useAuth();
  const currentUserId = getCurrentUserId();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    { path: '/feed', label: 'Feed', icon: Home },
    { path: '/create-post', label: 'Create', icon: PlusSquare },
    { path: `/profile/${currentUserId}`, label: 'Profile', icon: User },
  ];

  if (!token) {
    return (
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center px-6">
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent"
        >
          Snaply
        </Link>
        <div className="ml-auto flex items-center gap-5">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Log in
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white active:scale-95 transition-transform"
          >
            Sign up
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-60 flex-col border-r border-slate-100 bg-white/70 backdrop-blur-md px-4 py-6 z-50">
        <Link
          to="/feed"
          className="text-2xl font-extrabold bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent mb-8 px-2"
        >
          Snaply
        </Link>

        <div className="flex flex-col gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                isActive(path)
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} strokeWidth={2} />
              {label}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-500 hover:bg-slate-50 hover:text-rose-600 transition-colors"
        >
          <LogOut size={20} strokeWidth={2} />
          Log out
        </button>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-50 flex items-center justify-around">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={label}
            to={path}
            className={`flex flex-col items-center gap-0.5 ${
              isActive(path) ? 'text-rose-600' : 'text-slate-400'
            }`}
          >
            <Icon size={22} strokeWidth={2} />
          </Link>
        ))}
        <button onClick={handleLogout} className="flex flex-col items-center gap-0.5 text-slate-400">
          <LogOut size={22} strokeWidth={2} />
        </button>
      </nav>
    </>
  );
}

export default Navbar;