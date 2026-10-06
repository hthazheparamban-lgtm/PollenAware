"use client";

import { useEffect, useState } from "react";

export default function EnvironmentalPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadEnvironmentalData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3003/environmental-data/external?latitude=40.6401&longitude=22.9444"
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load environmental data"
          );
        }

        setData(result);
      } catch (error) {
        console.error("Environmental data error:", error);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadEnvironmentalData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">
          Loading environmental data...
        </p>
      </main>
    );
  }

  if (message) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-600">{message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-slate-900">
            PollenAware
          </h1>

          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Environmental Data
          </h2>

          <p className="mt-2 text-slate-500">
            Current pollen and weather information.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Pollen Levels
            </h3>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-600">
                  Grass Pollen
                </span>

                <span className="font-semibold text-slate-900">
                  {data.grass_pollen_category || "Unavailable"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">
                  Tree Pollen
                </span>

                <span className="font-semibold text-slate-900">
                  {data.tree_pollen_category || "Unavailable"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">
                  Weed Pollen
                </span>

                <span className="font-semibold text-slate-900">
                  {data.weed_pollen_category || "Unavailable"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Weather
            </h3>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-600">
                  Temperature
                </span>

                <span className="font-semibold text-slate-900">
                  {data.temperature}°C
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">
                  Feels Like
                </span>

                <span className="font-semibold text-slate-900">
                  {data.feels_like_temperature}°C
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">
                  Humidity
                </span>

                <span className="font-semibold text-slate-900">
                  {data.humidity}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">
                  Weather
                </span>

                <span className="font-semibold text-slate-900">
                  {data.weather_condition}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900">
              Additional Information
            </h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">
                  Precipitation
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {data.precipitation_probability}%
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Wind Speed
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {data.wind_speed}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  UV Index
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {data.uv_index}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}