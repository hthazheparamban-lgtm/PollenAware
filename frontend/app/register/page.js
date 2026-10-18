"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputClass =
    "w-full rounded-xl border border-[#dce4da] bg-[#fcfdfb] px-4 py-3.5 text-sm text-[#203b2c] outline-none transition placeholder:text-[#a1aaa1] focus:border-[#52785b] focus:ring-4 focus:ring-[#52785b]/10";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create the user profile.
      const userResponse = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          location,
        }),
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(userData.message || "Unable to create your account.");
      }

      const userId = userData.id;

      if (!userId) {
        throw new Error(
          "The User Service did not return a user ID. Please check its response."
        );
      }

      // Step 2: Register authentication credentials.
      const authResponse = await fetch(
        "http://localhost:3002/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            email,
            password,
          }),
        }
      );

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        console.error("Authentication response:", {
          status: authResponse.status,
          data: authData,
        });

        throw new Error(
          authData.message || "Unable to register authentication credentials."
        );
      }

      setSuccess("Account created successfully! Redirecting to sign in...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8f4] px-4 py-10">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#dce8dc] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#e8e9d8] opacity-70 blur-3xl" />

      <div className="relative w-full max-w-lg">
        {/* Brand */}
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234c39] text-2xl text-white shadow-md">
              <span aria-hidden="true">✿</span>
            </div>

            <span className="text-3xl font-bold tracking-tight text-[#234c39]">
              PollenAware
            </span>
          </a>

          <p className="mt-3 text-sm text-[#657267]">
            Personalised allergy monitoring
          </p>
        </div>

        {/* Registration card */}
        <div className="rounded-3xl border border-[#e4e9e1] bg-white p-7 shadow-xl shadow-[#234c39]/5 sm:p-9">
          <div className="mb-7">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#68816d]">
              Get started
            </p>

            <h1 className="text-3xl font-bold text-[#203b2c]">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#748076]">
              Set up your profile to explore environmental conditions and
              personalised allergy risk information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[#35483a]"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                required
                className={inputClass}
              />
            </div>

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
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-[#35483a]"
              >
                Preferred location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                autoComplete="address-level2"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Thessaloniki, Greece"
                required
                className={inputClass}
              />

              <p className="mt-2 text-xs leading-5 text-[#879187]">
                You can update your preferred location later in your profile.
              </p>
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
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-[#35483a]"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your password again"
                minLength={8}
                required
                className={inputClass}
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-800"
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#234c39] px-4 py-3.5 font-semibold text-white shadow-md shadow-[#234c39]/10 transition hover:bg-[#193b2b] focus:outline-none focus:ring-4 focus:ring-[#52785b]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e8ece6]" />
            <span className="text-xs text-[#98a198]">
              ALREADY REGISTERED?
            </span>
            <div className="h-px flex-1 bg-[#e8ece6]" />
          </div>

          <p className="text-center text-sm text-[#748076]">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-[#315f43] underline-offset-4 transition hover:text-[#193b2b] hover:underline"
            >
              Sign in
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