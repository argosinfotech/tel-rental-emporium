import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — TEL Rental Store" },
      {
        name: "description",
        content: "Sign in to your TEL Rental Store account.",
      },
      { property: "og:title", content: "Sign In — TEL Rental Store" },
      {
        property: "og:description",
        content: "Sign in to your TEL Rental Store account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const DUMMY_EMAIL = "support@tel.com";
const DUMMY_PASSWORD = "admin@123";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email.trim().toLowerCase() === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      setError("");
      navigate({ to: "/" });
    } else {
      setError("Invalid email or password. Try support@tel.com / admin@123");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6fb]">
      {/* Blue hero with angled bottom edge */}
      <div className="relative bg-[#3b6fe0] pb-40 pt-16 [clip-path:polygon(0_0,100%_0,100%_78%,0_100%)]">
        <h1 className="text-center text-3xl font-semibold tracking-wide text-white sm:text-4xl">
          TEL RENTAL STORE
        </h1>
      </div>

      {/* Card overlapping the hero */}
      <div className="relative z-10 -mt-32 flex flex-1 justify-center px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-center text-xl font-semibold text-[#3b6fe0]">
            Welcome Back !
          </h2>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Sign in to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full rounded-md border border-input bg-white px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-[#3b6fe0] focus:ring-2 focus:ring-[#3b6fe0]/20"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-[#3b6fe0]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-md border border-input bg-white px-3 py-2.5 pr-10 text-sm outline-none placeholder:text-muted-foreground focus:border-[#3b6fe0] focus:ring-2 focus:ring-[#3b6fe0]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-md bg-[#3b6fe0] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f5cc4]"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail(DUMMY_EMAIL);
                setPassword(DUMMY_PASSWORD);
                setError("");
              }}
              className="w-full rounded-md border border-dashed border-[#3b6fe0]/40 bg-[#3b6fe0]/5 px-3 py-2.5 text-center transition-colors hover:bg-[#3b6fe0]/10"
            >
              <span className="block text-xs font-medium text-[#3b6fe0]">
                Demo login — click to autofill
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {DUMMY_EMAIL} / {DUMMY_PASSWORD}
              </span>
            </button>
          </form>
        </div>
      </div>

      <footer className="py-8 text-center text-xs text-muted-foreground">
        © 2026 TEL RENTAL STORE ·{" "}
        <Link to="/" className="hover:text-[#3b6fe0]">
          Back to home
        </Link>
      </footer>
    </div>
  );
}
