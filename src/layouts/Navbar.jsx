import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, PlusSquare, User, LogOut } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getCurrentUserId } from "../utils/Auth";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useAuth();
  const currentUserId = getCurrentUserId();

  const navItems = [
    {
      path: "/feed",
      label: "Home",
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

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-60 border-r border-border bg-white px-4 py-6 md:flex md:flex-col">
        <Link
          to="/feed"
          className="px-3 text-2xl font-black tracking-tight text-text-primary transition-opacity hover:opacity-80"
        >
          Snaply
        </Link>

        <nav className="mt-10 flex flex-col gap-2">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);

            return (
              <Link
                key={label}
                to={path}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-brand-soft text-brand-primary"
                    : "text-text-secondary hover:bg-surface-soft hover:text-text-primary"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 2}
                  className="transition-transform duration-200 group-hover:scale-105"
                />

                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-text-secondary transition-all duration-200 hover:bg-error-soft hover:text-error"
          >
            <LogOut size={20} strokeWidth={2} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-white/95 px-2 backdrop-blur-xl md:hidden">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);

          return (
            <Link
              key={label}
              to={path}
              aria-label={label}
              className={`flex h-11 w-16 flex-col items-center justify-center rounded-2xl transition-all duration-200 ${
                active
                  ? "bg-brand-soft text-brand-primary"
                  : "text-text-muted hover:bg-surface-soft hover:text-text-primary"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
              />

              <span className="mt-0.5 text-[10px] font-semibold">
                {label}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="flex h-11 w-16 flex-col items-center justify-center rounded-2xl text-text-muted transition-all duration-200 hover:bg-error-soft hover:text-error"
        >
          <LogOut size={22} strokeWidth={2} />

          <span className="mt-0.5 text-[10px] font-semibold">
            Logout
          </span>
        </button>
      </nav>
    </>
  );
}

export default Navbar;