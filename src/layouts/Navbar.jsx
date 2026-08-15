import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, PlusSquare, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUserId } from "../utils/Auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useAuth();
  const currentUserId = getCurrentUserId();

  const isPublicPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    {
      path: "/feed",
      label: "Feed",
      icon: Home,
    },
    {
      path: "/create-post",
      label: "Create",
      icon: PlusSquare,
    },
    {
      path: `/profile/${currentUserId}`,
      label: "Profile",
      icon: User,
    },
  ];

  // Public navigation for Login and Signup pages
  if (!token || isPublicPage) {
    return (
      <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center border-b border-border bg-white/90 px-4 backdrop-blur-md sm:px-6">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-text-primary"
        >
          Snaply
        </Link>

        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <Link
            to="/login"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === "/login"
                ? "text-brand-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className={`rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-95 ${
              location.pathname === "/signup" ? "ring-4 ring-brand-soft" : ""
            }`}
          >
            Sign up
          </Link>
        </div>
      </nav>
    );
  }

  // Authenticated navigation
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-60 flex-col border-r border-border bg-white/95 px-4 py-6 backdrop-blur-md md:flex">
        <Link
          to="/feed"
          className="px-2 text-2xl font-extrabold tracking-tight text-text-primary"
        >
          Snaply
        </Link>

        <div className="mt-10 flex flex-col gap-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                isActive(path)
                  ? "bg-brand-soft text-brand-primary shadow-sm"
                  : "text-text-secondary hover:bg-surface-soft hover:text-text-primary"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive(path) ? 2.5 : 2}
              />

              <span>{label}</span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary transition-all hover:bg-error-soft hover:text-error"
        >
          <LogOut size={20} strokeWidth={2} />
          <span>Log out</span>
        </button>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-white/95 px-2 backdrop-blur-xl md:hidden">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={label}
            to={path}
            aria-label={label}
            className={`flex h-11 w-14 flex-col items-center justify-center rounded-xl transition-colors ${
              isActive(path)
                ? "bg-brand-soft text-brand-primary"
                : "text-text-muted hover:bg-surface-soft hover:text-text-primary"
            }`}
          >
            <Icon
              size={22}
              strokeWidth={isActive(path) ? 2.5 : 2}
            />
          </Link>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="flex h-11 w-14 flex-col items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-error-soft hover:text-error"
        >
          <LogOut size={22} strokeWidth={2} />
        </button>
      </nav>
    </>
  );
}

export default Navbar;