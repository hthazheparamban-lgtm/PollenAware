
"use client";

import { useEffect, useState } from "react";

const allergyOptions = [
  {
    name: "Grass",
    symbol: "✳",
    description: "Grass pollen exposure",
    tint: "bg-emerald-50 text-emerald-800",
  },
  {
    name: "Tree",
    symbol: "♧",
    description: "Tree pollen exposure",
    tint: "bg-lime-50 text-lime-800",
  },
  {
    name: "Weed",
    symbol: "❋",
    description: "Weed pollen exposure",
    tint: "bg-amber-50 text-amber-800",
  },
];

export default function AllergyPage() {
  const [userId, setUserId] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const loadAllergies = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${id}/allergies`
      );

      if (response.status === 404) {
        setAllergies([]);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load allergy profile."
        );
      }

      setAllergies(data.allergies || []);
    } catch (error) {
      console.error("Load allergies error:", error);
      setMessage("Unable to load your allergy profile. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (!payload.userId) {
        throw new Error("User ID missing from token.");
      }

      setUserId(payload.userId);
      loadAllergies(payload.userId);
    } catch (error) {
      console.error("Token error:", error);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  const toggleAllergy = (allergy) => {
    setAllergies((current) =>
      current.includes(allergy)
        ? current.filter((item) => item !== allergy)
        : [...current, allergy]
    );

    setMessage("");
  };

  const saveAllergies = async () => {
    if (!userId) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/allergies`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ allergies }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save allergy profile."
        );
      }

      setAllergies(data.allergies || []);
      setMessage("Your allergy profile has been saved successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Save allergies error:", error);
      setMessage(error.message || "Unable to save your changes.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f4]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />
          <p className="text-sm text-stone-500">
            Loading your allergy profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#24372d]">
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

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#65836a]">
            YOUR PERSONAL PROFILE
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Allergy profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
            Tell PollenAware which pollen types are relevant to you.
            Your selections are used by the application when preparing
            personalised allergy risk assessments.
          </p>
        </div>

        {/* Intro banner */}
        <section className="relative overflow-hidden rounded-[26px] bg-[#234c39] p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-1 -top-9 h-32 w-32 rounded-full border border-white/10" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl">
              ♧
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold sm:text-xl">
                Make your profile your own
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80">
                Select every pollen type that applies to you. You can
                return at any time to update your selections.
              </p>
            </div>
          </div>
        </section>

        {/* Allergy selection */}
        <section className="mt-8 rounded-[26px] border border-[#e5e9df] bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                Which pollen affects you?
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Choose one or more options below.
              </p>
            </div>

            <span className="rounded-full bg-[#edf3e8] px-3 py-1.5 text-xs font-bold text-[#376649]">
              {allergies.length} selected
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {allergyOptions.map((allergy) => {
              const selected = allergies.includes(allergy.name);

              return (
                <label
                  key={allergy.name}
                  className={`group relative flex min-h-48 cursor-pointer flex-col rounded-2xl border p-5 transition duration-200 hover:-translate-y-0.5 ${
                    selected
                      ? "border-[#789477] bg-[#f0f5ec] shadow-sm"
                      : "border-[#e5e9df] bg-white hover:border-[#bdceb7] hover:bg-[#fafbf8]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleAllergy(allergy.name)}
                    className="sr-only"
                  />

                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${allergy.tint}`}
                    >
                      {allergy.symbol}
                    </span>

                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs transition ${
                        selected
                          ? "border-[#376649] bg-[#376649] text-white"
                          : "border-stone-300 text-transparent group-hover:border-[#789477]"
                      }`}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {allergy.name} pollen
                  </h3>

                  <p className="mt-1 text-sm text-stone-500">
                    {allergy.description}
                  </p>

                  <p
                    className={`mt-auto pt-4 text-xs font-bold ${
                      selected ? "text-[#376649]" : "text-stone-400"
                    }`}
                  >
                    {selected ? "Selected" : "Select this option"}
                  </p>
                </label>
              );
            })}
          </div>

          <div className="mt-7 flex flex-col gap-4 border-t border-[#edf0e9] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-xs leading-5 text-stone-500">
              Your selections can be changed whenever your profile needs
              updating. Save your changes to store them.
            </p>

            <button
              onClick={saveAllergies}
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#234c39] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#193c2b] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving changes...
                </>
              ) : (
                <>
                  Save allergy profile
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                messageType === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-[#d6e6cf] bg-[#f0f7eb] text-[#285439]"
              }`}
            >
              <span className="font-bold" aria-hidden="true">
                {messageType === "error" ? "!" : "✓"}
              </span>
              <p>{message}</p>
            </div>
          )}
        </section>

        {/* Helpful note */}
        <section className="mt-6 flex items-start gap-4 rounded-2xl border border-[#e5e9df] bg-[#edf2e8] p-5 sm:p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-[#376649]">
            ✦
          </span>
          <div>
            <h3 className="text-sm font-bold">
              A note about personalised risk
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              PollenAware provides prototype risk estimates based on
              the application's scoring rules and available information.
              These estimates are not clinically validated and should
              not replace professional medical advice.
            </p>
          </div>
        </section>

        <footer className="py-8 text-center text-xs text-stone-400">
          PollenAware · Personalised environmental allergy monitoring
        </footer>
      </div>
    </main>
  );
}
