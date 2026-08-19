import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

import { signup } from "../services/authService";
import Button from "../components/ui/Button";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await signup(username, email, password);
      setSuccess(true);
    } catch {
      setError(
        "Something went wrong, try a different email or username"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-app-background px-4 py-12 sm:px-6 lg:py-16">
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

      <div className="relative mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_420px] lg:gap-20">
          {/* Left brand section */}
          <section className="hidden lg:block">
            <div className="max-w-xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text-secondary shadow-soft">
                <Sparkles className="h-4 w-4 text-brand-primary" />
                Start your Snaply journey
              </div>

              <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-text-primary xl:text-6xl">
                Create your space.
                <span className="block bg-gradient-to-r from-brand-primary via-rose-500 to-brand-secondary bg-clip-text text-transparent">
                  Share your story.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-text-secondary">
                Join Snaply and start sharing moments, connecting with people,
                and building your own social space.
              </p>

              <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-white px-4 py-4 shadow-soft">
                  <p className="text-sm font-bold text-text-primary">
                    Create
                  </p>
                  <p className="mt-1 text-xs leading-5 text-text-muted">
                    Share moments that matter.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-white px-4 py-4 shadow-soft">
                  <p className="text-sm font-bold text-text-primary">
                    Connect
                  </p>
                  <p className="mt-1 text-xs leading-5 text-text-muted">
                    Follow the people you care about.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-white px-4 py-4 shadow-soft">
                  <p className="text-sm font-bold text-text-primary">
                    Enjoy
                  </p>
                  <p className="mt-1 text-xs leading-5 text-text-muted">
                    Discover a vibrant community.
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
                  Join Snaply
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-text-secondary">
                  Sign up and start sharing your world.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-100 bg-error-soft px-4 py-3 text-sm font-medium leading-5 text-error"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-green-100 bg-success-soft px-4 py-3 text-sm font-medium leading-5 text-success"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p>Account created successfully.</p>

                    <p className="mt-1 font-normal">
                      You can now{" "}
                      <Link
                        to="/login"
                        className="font-bold underline underline-offset-2"
                      >
                        log in
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-7 flex flex-col gap-5"
              >
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <User
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
                    />

                    <input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      required
                      className="h-12 w-full rounded-xl border border-border bg-surface-soft pl-12 pr-4 text-sm font-medium text-text-primary placeholder:text-text-muted transition-all duration-200 focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-soft"
                    />
                  </div>
                </div>

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
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
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
                  disabled={success}
                  fullWidth
                  size="lg"
                  className="mt-1"
                >
                  {loading ? "Creating account..." : "Create account"}

                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-7 border-t border-border pt-6 text-center">
                <p className="text-sm text-text-secondary">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-brand-primary transition-colors hover:text-brand-hover"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-text-muted">
              Create your account and start your Snaply journey.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Signup;