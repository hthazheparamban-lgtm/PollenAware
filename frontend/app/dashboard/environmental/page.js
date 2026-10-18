
"use client";

import { useEffect, useState } from "react";

const pollenTypes = [
  {
    name: "Grass pollen",
    key: "grass_pollen_category",
    symbol: "✳",
    description: "Grass-related pollen conditions",
    tint: "bg-emerald-50 text-emerald-800",
  },
  {
    name: "Tree pollen",
    key: "tree_pollen_category",
    symbol: "♧",
    description: "Tree-related pollen conditions",
    tint: "bg-lime-50 text-lime-800",
  },
  {
    name: "Weed pollen",
    key: "weed_pollen_category",
    symbol: "❋",
    description: "Weed-related pollen conditions",
    tint: "bg-amber-50 text-amber-800",
  },
];

function getCategoryStyle(category) {
  const value = String(category || "").toLowerCase();

  if (
    value.includes("high") ||
    value.includes("very high")
  ) {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  if (value.includes("moderate") || value.includes("medium")) {
    return "bg-amber-50 text-amber-800 ring-amber-200";
  }

  if (value.includes("low") || value.includes("very low")) {
    return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  }

  return "bg-stone-100 text-stone-600 ring-stone-200";
}

function formatValue(value, suffix = "") {
  if (value === null || value === undefined || value === "") {
    return "Unavailable";
  }

  return `${value}${suffix}`;
}

export default function EnvironmentalPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadEnvironmentalData = async () => {
      setLoading(true);
      setMessage("");

      try {
        const response = await fetch(
          "http://localhost:3003/environmental-data/external?latitude=40.6401&longitude=22.9444"
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load environmental data."
          );
        }

        if (!cancelled) {
          setData(result);
        }
      } catch (error) {
        console.error("Environmental data error:", error);

        if (!cancelled) {
          setMessage(
            error.message || "Unable to load environmental data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadEnvironmentalData();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#24372d]">
      {/* Header */}
      <header className="border-b border-[#e5e9df] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#234c39] text-2xl text-white">
              ✳
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight">
                PollenAware
              </span>
              <span className="block text-xs text-stone-500">
                Your environment, understood
              </span>
            </span>
          </a>

          <a
            href="/dashboard"
            className="rounded-xl border border-[#e1e5dc] px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-[#f3f5ed] hover:text-[#234c39]"
          >
            <span aria-hidden="true">← </span>
            <span className="hidden sm:inline">Back to dashboard</span>
            <span className="sm:hidden">Back</span>
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Page heading */}
        <section className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#65836a]">
              ENVIRONMENTAL MONITORING
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Environmental data
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
              Explore the available pollen and weather information
              used by PollenAware.
            </p>
          </div>

          <button
            onClick={() => setRetryKey((current) => current + 1)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#234c39] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#193c2b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span aria-hidden="true">↻</span>
            {loading ? "Loading..." : "Refresh data"}
          </button>
        </section>

        {/* Location banner */}
        <section className="relative mt-8 overflow-hidden rounded-[26px] bg-[#234c39] p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-1 -top-8 h-36 w-36 rounded-full border border-white/10" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl">
              ☀
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100/70">
                MONITORED LOCATION
              </p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                Thessaloniki, Greece
              </h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50/80">
                Environmental data retrieved for the configured
                location.
              </p>
              <p className="mt-3 text-xs text-emerald-100/70">
                40.6401° N · 22.9444° E
              </p>
            </div>
          </div>
        </section>

        {/* Loading state */}
        {loading && (
          <section className="mt-8 rounded-2xl border border-[#e5e9df] bg-white p-10 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />
            <p className="font-semibold">Retrieving environmental data</p>
            <p className="mt-2 text-sm text-stone-500">
              Connecting to the environmental monitoring service...
            </p>
          </section>
        )}

        {/* Error state */}
        {!loading && message && (
          <section
            role="alert"
            className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6"
          >
            <h2 className="font-bold text-red-800">
              Environmental data unavailable
            </h2>
            <p className="mt-2 text-sm leading-6 text-red-700">
              {message}
            </p>
            <button
              onClick={() => setRetryKey((current) => current + 1)}
              className="mt-4 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Try again
            </button>
          </section>
        )}

        {/* Data */}
        {!loading && !message && data && (
          <>
            {/* Pollen cards */}
            <section className="mt-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#65836a]">
                  POLLEN OVERVIEW
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Pollen conditions
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  Categories returned by the environmental service.
                </p>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                {pollenTypes.map((pollen) => {
                  const category = data[pollen.key];

                  return (
                    <article
                      key={pollen.name}
                      className="rounded-2xl border border-[#e5e9df] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${pollen.tint}`}
                        >
                          {pollen.symbol}
                        </div>

                        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                          POLLEN
                        </span>
                      </div>

                      <h3 className="mt-5 text-lg font-bold">
                        {pollen.name}
                      </h3>

                      <p className="mt-1 text-sm text-stone-500">
                        {pollen.description}
                      </p>

                      <div className="mt-5 border-t border-[#edf0e9] pt-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                          Reported category
                        </p>

                        <span
                          className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-sm font-bold ring-1 ring-inset ${getCategoryStyle(category)}`}
                        >
                          {category || "Unavailable"}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Weather */}
            <section className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#65836a]">
                LOCAL CONDITIONS
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Weather overview
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                Weather information returned by the environmental service.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-[#e5e9df] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500">
                      Temperature
                    </span>
                    <span className="text-xl">☀</span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-tight">
                    {formatValue(data.temperature, "°C")}
                  </p>
                  <p className="mt-2 text-xs text-stone-400">
                    Reported temperature
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5e9df] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500">
                      Feels like
                    </span>
                    <span className="text-xl">≈</span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-tight">
                    {formatValue(data.feels_like_temperature, "°C")}
                  </p>
                  <p className="mt-2 text-xs text-stone-400">
                    Feels-like temperature
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5e9df] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500">
                      Humidity
                    </span>
                    <span className="text-xl">♧</span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-tight">
                    {formatValue(data.humidity, "%")}
                  </p>
                  <p className="mt-2 text-xs text-stone-400">
                    Relative humidity
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5e9df] bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500">
                      Conditions
                    </span>
                    <span className="text-xl">☁</span>
                  </div>
                  <p className="mt-4 break-words text-xl font-semibold">
                    {formatValue(data.weather_condition)}
                  </p>
                  <p className="mt-2 text-xs text-stone-400">
                    Reported weather
                  </p>
                </div>
              </div>
            </section>

            {/* Additional data */}
            <section className="mt-8 rounded-[26px] border border-[#e5e9df] bg-white p-6 sm:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#65836a]">
                  ADDITIONAL MEASUREMENTS
                </p>
                <h2 className="mt-2 text-xl font-semibold">
                  More environmental details
                </h2>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                <div className="border-b border-[#edf0e9] pb-5 sm:border-b-0 sm:border-r sm:pb-0">
                  <p className="text-sm text-stone-500">
                    Precipitation probability
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatValue(data.precipitation_probability, "%")}
                  </p>
                </div>

                <div className="border-b border-[#edf0e9] pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pl-5">
                  <p className="text-sm text-stone-500">
                    Wind speed
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatValue(data.wind_speed)}
                  </p>
                </div>

                <div className="sm:pl-5">
                  <p className="text-sm text-stone-500">
                    UV index
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatValue(data.uv_index)}
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="mt-6 flex items-start gap-4 rounded-2xl border border-[#e5e9df] bg-[#edf2e8] p-5 sm:p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-[#376649]">
                ✦
              </span>
              <div>
                <h3 className="text-sm font-bold">
                  Understanding your environmental data
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  These measurements describe the information returned by
                  the environmental service. Pollen categories alone do
                  not establish an individual's clinical allergy risk.
                  Use the Risk Assessment page to view the application's
                  prototype risk estimate.
                </p>
              </div>
            </section>
          </>
        )}

        <footer className="py-8 text-center text-xs text-stone-400">
          PollenAware · Personalised environmental allergy monitoring
        </footer>
      </div>
    </main>
  );
}
