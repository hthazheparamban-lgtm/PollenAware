"use client";

import { useEffect, useState } from "react";

export default function PreferencesPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [preferredLocation, setPreferredLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId;
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

      if (response.status === 404) {
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load preferences"
        );
      }

      setNotificationsEnabled(
        data.notifications_enabled ?? true
      );

      setPreferredLocation(
        data.preferred_location || ""
      );
    } catch (error) {
      console.error("Load preferences error:", error);
      setMessage("Unable to load preferences.");
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
        throw new Error(
          data.message || "Unable to save preferences"
        );
      }

      setNotificationsEnabled(
        data.notifications_enabled ?? notificationsEnabled
      );

      setPreferredLocation(
        data.preferred_location ?? preferredLocation
      );

      setMessage("Preferences saved successfully.");
    } catch (error) {
      console.error("Save preferences error:", error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">
          Loading preferences...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
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

      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            User Preferences
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage your notification and location preferences.
          </p>

          <div className="mt-8">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(event) =>
                  setNotificationsEnabled(event.target.checked)
                }
                className="h-5 w-5"
              />

              <div>
                <p className="font-medium text-slate-800">
                  Enable notifications
                </p>

                <p className="text-sm text-slate-500">
                  Receive allergy risk notifications.
                </p>
              </div>
            </label>
          </div>

          <div className="mt-6">
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Preferred Location
            </label>

            <input
              id="location"
              type="text"
              value={preferredLocation}
              onChange={(event) =>
                setPreferredLocation(event.target.value)
              }
              placeholder="e.g. Thessaloniki"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            onClick={savePreferences}
            disabled={saving}
            className="mt-8 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-slate-600">
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}