import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";

import { login as loginApi } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginApi(email, password);

      login(data.token);
      navigate("/feed");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-app-background px-4 py-10 sm:px-6 lg:py-16">
  
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-orange-200/25 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-violet-100/20 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-152px)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_420px] lg:gap-20">
          <section className="hidden lg:block">
            <div className="max-w-xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text-secondary shadow-soft">
                <Sparkles className="h-4 w-4 text-brand-primary" />
                Your social world, beautifully connected
              </div>

              <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-text-primary xl:text-6xl">
                Share moments.
                <span className="block bg-gradient-to-r from-brand-primary via-rose-500 to-brand-secondary bg-clip-text text-transparent">
                  Stay connected.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-text-secondary">
                Snaply gives you a simple, vibrant place to share what matters,
                discover people, and stay connected with your community.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-soft">
                  <p className="text-sm font-bold text-text-primary">
                    Share
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Your moments
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-soft">
                  <p className="text-sm font-bold text-text-primary">
                    Connect
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    With your people
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-soft">
                  <p className="text-sm font-bold text-text-primary">
                    Discover
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Something new
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full">
            <div className="mx-auto w-full max-w-md rounded-[28px] border border-border bg-white p-6 shadow-card sm:p-8">
              
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-md">
                  <span className="text-xl font-black text-white">S</span>
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
                  Welcome to Snaply
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                  Log in to continue to your Snaply account.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-100 bg-error-soft px-4 py-3 text-sm font-medium text-error"
                >
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-7 flex flex-col gap-5"
              >

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
                    />

                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      className="h-12 w-full rounded-xl border border-border bg-surface-soft pl-12 pr-4 text-sm font-medium text-text-primary placeholder:text-text-muted transition-all duration-200 focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-soft"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-text-primary"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <Lock
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="h-12 w-full rounded-xl border border-border bg-surface-soft pl-12 pr-12 text-sm font-medium text-text-primary placeholder:text-text-muted transition-all duration-200 focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-soft"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-brand-soft hover:text-brand-primary focus-visible:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  size="lg"
                  className="mt-1"
                >
                  {loading ? "Logging in..." : "Log in"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-7 border-t border-border pt-6 text-center">
                <p className="text-sm text-text-secondary">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-bold text-brand-primary transition-colors hover:text-brand-hover"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-text-muted">
              By continuing, you agree to use Snaply responsibly.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Login;