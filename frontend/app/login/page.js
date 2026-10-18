"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      if (!data.token) {
        throw new Error("Authentication token was not returned.");
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8f4] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#dce8dc] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#e8e9d8] opacity-70 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234c39] text-2xl text-white shadow-md">
              ✿
            </div>

            <span className="text-3xl font-bold tracking-tight text-[#234c39]">
              PollenAware
            </span>
          </a>

          <p className="mt-3 text-sm text-[#657267]">
            Personalised allergy monitoring
          </p>
        </div>

        <div className="rounded-3xl border border-[#e4e9e1] bg-white p-7 shadow-xl shadow-[#234c39]/5 sm:p-9">
          <div className="mb-7">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#68816d]">
              Welcome back
            </p>

            <h1 className="text-3xl font-bold text-[#203b2c]">
              Sign in to your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#748076]">
              Check your local pollen conditions and personalised allergy
              risk information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#35483a]"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-[#dce4da] bg-[#fcfdfb] px-4 py-3.5 text-sm text-[#203b2c] outline-none transition placeholder:text-[#a1aaa1] focus:border-[#52785b] focus:ring-4 focus:ring-[#52785b]/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#35483a]"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-[#dce4da] bg-[#fcfdfb] px-4 py-3.5 text-sm text-[#203b2c] outline-none transition placeholder:text-[#a1aaa1] focus:border-[#52785b] focus:ring-4 focus:ring-[#52785b]/10"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#234c39] px-4 py-3.5 font-semibold text-white shadow-md transition hover:bg-[#193b2b] focus:outline-none focus:ring-4 focus:ring-[#52785b]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e8ece6]" />
            <span className="text-xs text-[#98a198]">NEW TO POLLEN AWARE?</span>
            <div className="h-px flex-1 bg-[#e8ece6]" />
          </div>

          <p className="text-center text-sm text-[#748076]">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-[#315f43] underline-offset-4 transition hover:text-[#193b2b] hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-[#879187]">
          Your personal space for environmental insights and allergy awareness.
        </p>

        <p className="mt-3 text-center text-xs text-[#9aa399]">
          © {new Date().getFullYear()} PollenAware
        </p>
      </div>
    </main>
  );
}