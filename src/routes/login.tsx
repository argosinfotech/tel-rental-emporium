import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: `Sign In — ${BRAND.name}` },
      {
        name: "description",
        content: `Sign in to your ${BRAND.name} account.`,
      },
      { property: "og:title", content: `Sign In — ${BRAND.name}` },
      {
        property: "og:description",
        content: `Sign in to your ${BRAND.name} account.`,
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
    if (
      email.trim().toLowerCase() === DUMMY_EMAIL &&
      password === DUMMY_PASSWORD
    ) {
      setError("");
      navigate({ to: "/dashboard" });
    } else {
      setError("Invalid email or password. Try support@tel.com / admin@123");
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#f3f6f9]">
      <div className="relative h-[280px] overflow-hidden sm:h-[380px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/auth-one-bg.jpg)" }}
        />
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `linear-gradient(to left, ${BRAND.primary}, #0a9d8a)`,
          }}
        />
        <div className="relative z-10 px-4 pt-12 text-center sm:pt-16">
          <h1 className="text-2xl font-semibold tracking-wide text-white sm:text-4xl">
            {BRAND.nameUpper}
          </h1>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 leading-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="h-auto w-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#f3f6f9"
              d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-20 -mt-24 flex flex-1 justify-center px-4 sm:-mt-32">
        <div className="mb-8 w-full max-w-[420px] rounded-md bg-white p-8 shadow-[0_5px_20px_rgba(18,38,63,0.08)] sm:p-10">
          <div className="text-center">
            <h2
              className="text-lg font-semibold"
              style={{ color: BRAND.primary }}
            >
              Welcome Back !
            </h2>
            <p className="mt-1 text-sm text-[#878a99]">Sign in to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#212529]"
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
                className="w-full rounded-md border border-[#ced4da] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-[#adb5bd] focus:border-[#0b8a7a] focus:ring-2 focus:ring-[#0b8a7a]/20"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#212529]"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-[#878a99] hover:underline"
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
                  className="w-full rounded-md border border-[#ced4da] bg-white px-3 py-2.5 pr-10 text-sm outline-none placeholder:text-[#adb5bd] focus:border-[#0b8a7a] focus:ring-2 focus:ring-[#0b8a7a]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#878a99] hover:text-[#495057]"
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
              className="w-full rounded-md py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: BRAND.primary }}
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
              className="w-full rounded-md border border-dashed border-[#0b8a7a]/40 bg-[#0b8a7a]/5 px-3 py-2.5 text-center transition-colors hover:bg-[#0b8a7a]/10"
            >
              <span className="block text-xs font-medium text-[#0b8a7a]">
                Demo login — click to autofill
              </span>
              <span className="mt-0.5 block text-xs text-[#878a99]">
                {DUMMY_EMAIL} / {DUMMY_PASSWORD}
              </span>
            </button>
          </form>
        </div>
      </div>

      <footer className="pb-8 pt-2 text-center text-sm text-[#878a99]">
        © 2026 {BRAND.nameUpper}
      </footer>
    </div>
  );
}
