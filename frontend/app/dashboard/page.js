
"use client";

import { useEffect, useState } from "react";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: "◫",
    active: true,
  },
  {
    label: "Allergy profile",
    href: "/dashboard/allergy",
    icon: "✳",
  },
  {
    label: "Environmental data",
    href: "/dashboard/environmental",
    icon: "☀",
  },
  {
    label: "Risk assessment",
    href: "/dashboard/risk-assessment",
    icon: "♡",
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: "♧",
  },
  {
    label: "Preferences",
    href: "/dashboard/preferences",
    icon: "⚙",
  },
];

const features = [
  {
    number: "01",
    title: "Allergy profile",
    description:
      "Manage the pollen types that matter to you.",
    href: "/dashboard/allergy",
    icon: "✳",
    label: "Manage profile",
    tint: "bg-emerald-50 text-emerald-800",
  },
  {
    number: "02",
    title: "Environmental data",
    description:
      "Explore current pollen and weather conditions.",
    href: "/dashboard/environmental",
    icon: "☀",
    label: "Explore conditions",
    tint: "bg-amber-50 text-amber-800",
  },
  {
    number: "03",
    title: "Risk assessment",
    description:
      "Generate a personalised allergy risk assessment.",
    href: "/dashboard/risk-assessment",
    icon: "♡",
    label: "Check your risk",
    tint: "bg-rose-50 text-rose-800",
  },
  {
    number: "04",
    title: "Notifications",
    description:
      "Review your allergy alerts and recent updates.",
    href: "/dashboard/notifications",
    icon: "♧",
    label: "View notifications",
    tint: "bg-sky-50 text-sky-800",
  },
];

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
        const response = await fetch(
          "http://localhost:3002/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("token");
          window.location.href = "/login";
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
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f4]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />
          <p className="text-sm text-stone-500">
            Preparing your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#24372d]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[#e5e9df] bg-white px-5 py-7 md:flex">
          <a href="/dashboard" className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#234c39] text-2xl text-white">
              ✳
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">
                PollenAware
              </p>
              <p className="text-xs text-stone-500">
                Your environment, understood
              </p>
            </div>
          </a>

          <div className="mt-10">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Workspace
            </p>

            <nav className="space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    item.active
                      ? "bg-[#eaf1e8] text-[#234c39]"
                      : "text-stone-600 hover:bg-stone-50 hover:text-[#234c39]"
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg text-lg">
                    {item.icon}
                  </span>
                  {item.label}
                  {item.active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#467957]" />
                  )}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-auto rounded-2xl bg-[#f3f5ed] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg">
              ☘
            </div>
            <p className="text-sm font-semibold">
              A little more awareness
            </p>
            <p className="mt-2 text-xs leading-5 text-stone-600">
              Check your environmental conditions and keep your
              allergy profile up to date.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e5e9df] bg-white/90 px-5 py-4 backdrop-blur-md sm:px-8 lg:px-10">
            <a href="/dashboard" className="flex items-center gap-2 md:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#234c39] text-xl text-white">
                ✳
              </span>
              <span className="font-bold">PollenAware</span>
            </a>

            <div className="hidden md:block">
              <p className="text-xs text-stone-500">
                YOUR PERSONAL ENVIRONMENTAL SPACE
              </p>
              <p className="mt-1 text-sm font-semibold">
                Dashboard overview
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">
                  {user?.name || "PollenAware member"}
                </p>
                <p className="max-w-48 truncate text-xs text-stone-500">
                  {user?.email || ""}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e2ebdd] font-bold text-[#234c39]">
                {(user?.name || user?.email || "P")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-[#e1e5dc] px-3 py-2 text-sm font-semibold text-stone-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                Log out
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10 lg:px-10">
            {/* Welcome banner */}
            <section className="relative overflow-hidden rounded-[28px] bg-[#234c39] p-7 text-white shadow-sm sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-2 -top-10 h-52 w-52 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-[#71916a]/20 blur-2xl" />

              <div className="relative max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-50">
                  <span className="h-2 w-2 rounded-full bg-[#c6df9c]" />
                  YOUR PERSONAL ALLERGY COMPANION
                </div>

                <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Breathe easier.
                  <br />
                  <span className="font-serif italic text-[#c9dfb8]">
                    Stay informed.
                  </span>
                </h1>

                <p className="mt-5 max-w-lg text-sm leading-7 text-emerald-50/80 sm:text-base">
                  Welcome back
                  {user?.name ? `, ${user.name}` : ""}. Explore
                  environmental conditions, manage your allergy
                  profile and review your personalised risk assessment.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="/dashboard/risk-assessment"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#e4edcf] px-5 py-3 text-sm font-bold text-[#234c39] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    Check my risk
                    <span aria-hidden="true">↗</span>
                  </a>

                  <a
                    href="/dashboard/environmental"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Explore conditions
                  </a>
                </div>
              </div>
            </section>

            {/* Section heading */}
            <section className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#65836a]">
                    YOUR HEALTH, AT A GLANCE
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                    Your personal workspace
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    Everything you need, thoughtfully organised.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {features.map((feature) => (
                  <a
                    key={feature.number}
                    href={feature.href}
                    className="group flex min-h-64 flex-col rounded-2xl border border-[#e5e9df] bg-white p-5 shadow-[0_3px_12px_rgba(35,76,57,0.025)] transition duration-200 hover:-translate-y-1 hover:border-[#c7d7c2] hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${feature.tint}`}
                      >
                        {feature.icon}
                      </div>
                      <span className="text-xs font-semibold tracking-wider text-stone-400">
                        {feature.number}
                      </span>
                    </div>

                    <h3 className="mt-6 text-base font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-stone-500">
                      {feature.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-5 text-sm font-semibold text-[#376649]">
                      {feature.label}
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* Information panel */}
            <section className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-[#e5e9df] bg-white p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3e8] text-xl text-[#376649]">
                    ✦
                  </div>
                  <div>
                    <h3 className="font-bold">Make your profile personal</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-500">
                      Add the pollen types relevant to you and set your
                      preferred location to help the application use your
                      profile and environmental information in its workflow.
                    </p>
                    <a
                      href="/dashboard/allergy"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#376649] hover:text-[#234c39]"
                    >
                      Review allergy profile <span>→</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e5e9df] bg-[#edf2e8] p-6 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#65836a]">
                  A NOTE TO REMEMBER
                </p>
                <h3 className="mt-3 text-lg font-bold">
                  Information helps you prepare.
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  PollenAware provides prototype risk estimates based on
                  available environmental information and your saved
                  allergy profile. These estimates are not a medical
                  diagnosis.
                </p>
              </div>
            </section>

            <footer className="mt-10 border-t border-[#e5e9df] py-6 text-center text-xs text-stone-400">
              PollenAware · Personalised environmental allergy monitoring
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
