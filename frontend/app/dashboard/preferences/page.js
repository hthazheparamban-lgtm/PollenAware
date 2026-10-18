
"use client";

import { useEffect, useState } from "react";

export default function PreferencesPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [preferredLocation, setPreferredLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split(".")[1])).userId;
    } catch (error) {
      console.error("Token error:", error);
      return null;
    }
  };

  const loadPreferences = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${id}/preferences`
      );

      if (response.status === 404) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load preferences.");
      }

      setNotificationsEnabled(data.notifications_enabled ?? true);
      setPreferredLocation(data.preferred_location || "");
    } catch (error) {
      console.error("Load preferences error:", error);
      setMessage(error.message || "Unable to load preferences.");
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

    const userId = getUserIdFromToken();

    if (!userId) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    loadPreferences(userId);
  }, []);

  const savePreferences = async () => {
    const userId = getUserIdFromToken();

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationsEnabled,
            preferredLocation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save preferences.");
      }

      setNotificationsEnabled(
        data.notifications_enabled ?? notificationsEnabled
      );
      setPreferredLocation(
        data.preferred_location ?? preferredLocation
      );
      setMessage("Your preferences have been saved successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Save preferences error:", error);
      setMessage(error.message || "Unable to save preferences.");
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
            Loading your preferences...
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
              <span className="block text-lg font-bold">PollenAware</span>
              <span className="block text-xs text-stone-500">
                Your environment, understood
              </span>
            </span>
          </a>

          <a
            href="/dashboard"
            className="rounded-xl border border-[#e1e5dc] px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-[#f3f5ed]"
          >
            ← <span className="hidden sm:inline">Back to dashboard</span>
            <span className="sm:hidden">Back</span>
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#65836a]">
          YOUR ACCOUNT
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Preferences
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
          Personalise your PollenAware experience by managing your
          preferred location and notification settings.
        </p>

        <section className="relative mt-8 overflow-hidden rounded-[26px] bg-[#234c39] p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full border border-white/10" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl">
              ⚙
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100/70">
                PERSONAL SETTINGS
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Your experience, your way.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/80">
                Keep your location up to date and choose whether you
                want to receive allergy risk notifications.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-5">
          {/* Notification settings */}
          <div className="rounded-[26px] border border-[#e5e9df] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf3e8] text-2xl text-[#376649]">
                ♧
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  Notification settings
                </h2>
                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Control your notification preference.
                </p>
              </div>
            </div>

            <label className="mt-6 flex cursor-pointer items-center justify-between gap-5 rounded-2xl border border-[#e5e9df] bg-[#fafbf8] p-4 sm:p-5">
              <span>
                <span className="block text-sm font-semibold">
                  Enable notifications
                </span>
                <span className="mt-1 block text-sm leading-5 text-stone-500">
                  {notificationsEnabled
                    ? "Notifications are enabled in your preferences."
                    : "Notifications are disabled in your preferences."}
                </span>
              </span>

              <span className="relative inline-flex shrink-0 items-center">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(event) => {
                    setNotificationsEnabled(event.target.checked);
                    setMessage("");
                  }}
                  className="peer sr-only"
                />
                <span className="h-7 w-12 rounded-full bg-stone-300 transition peer-checked:bg-[#376649] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#376649]" />
                <span className="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
          </div>

          {/* Location settings */}
          <div className="rounded-[26px] border border-[#e5e9df] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-amber-800">
                ⌖
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  Preferred location
                </h2>
                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Manage the location saved to your profile.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold"
              >
                City or location
              </label>

              <input
                id="location"
                type="text"
                value={preferredLocation}
                onChange={(event) => {
                  setPreferredLocation(event.target.value);
                  setMessage("");
                }}
                placeholder="e.g. Thessaloniki"
                className="w-full rounded-xl border border-[#dfe5d9] bg-[#fafbf8] px-4 py-3.5 text-sm text-[#24372d] outline-none transition placeholder:text-stone-400 focus:border-[#789477] focus:ring-4 focus:ring-[#eaf1e8]"
              />

              <p className="mt-2 text-xs leading-5 text-stone-400">
                Enter the location you want to keep in your user profile.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#e5e9df] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="max-w-md text-sm leading-6 text-stone-500">
            Remember to save your changes so your preferences are stored.
          </p>

          <button
            onClick={savePreferences}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#234c39] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#193c2b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving changes..." : "Save preferences →"}
          </button>
        </div>

        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`mt-5 rounded-xl border p-4 text-sm leading-6 ${
              messageType === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-[#d6e6cf] bg-[#f0f7eb] text-[#285439]"
            }`}
          >
            {messageType === "error" ? "!" : "✓"} {message}
          </div>
        )}

        <section className="mt-6 flex items-start gap-4 rounded-2xl border border-[#e5e9df] bg-[#edf2e8] p-5 sm:p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-[#376649]">
            ✦
          </span>
          <div>
            <h3 className="text-sm font-bold">Your preferences</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              These settings are saved to your user profile. The current
              environmental and risk assessment pages still use their
              configured Thessaloniki coordinates until location-based
              requests are connected to this preference.
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
