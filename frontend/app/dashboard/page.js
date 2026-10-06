"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:3002/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

     if (!response.ok) {
  console.error("Auth check failed:", response.status);
  setUser(null);
  return;
}

const data = await response.json();

setUser(data.user);
} catch (error) {
  console.error("Dashboard authentication error:", error);
} finally {
  setLoading(false);
}
    };

    getUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-slate-900">
            PollenAware
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-900">
          Welcome to PollenAware
        </h2>

        {user && (
          <p className="mt-2 text-slate-600">
            Signed in as {user.email}
          </p>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Allergy Profile
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Manage your allergy information.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Environmental Data
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              View pollen and weather conditions.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">
              Risk Assessment
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Check your personalised allergy risk.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}