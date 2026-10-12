"use client";

import { useEffect, useState } from "react";

const allergyOptions = ["Grass", "Tree", "Weed"];

export default function AllergyPage() {
  const [userId, setUserId] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
          data.message || "Unable to load allergy profile"
        );
      }

      setAllergies(data.allergies || []);
    } catch (error) {
      console.error("Load allergies error:", error);
      setMessage("Unable to load allergy profile.");
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

      setUserId(payload.userId);

      loadAllergies(payload.userId);
    } catch (error) {
      console.error("Token error:", error);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  const toggleAllergy = (allergy) => {
    setAllergies((current) => {
      if (current.includes(allergy)) {
        return current.filter((item) => item !== allergy);
      }

      return [...current, allergy];
    });
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
          body: JSON.stringify({
            allergies,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save allergy profile"
        );
      }

      setAllergies(data.allergies || []);
      setMessage("Allergy profile saved successfully.");
    } catch (error) {
      console.error("Save allergies error:", error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">
          Loading allergy profile...
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
            Allergy Profile
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Select the pollen types you are allergic to.
          </p>

          <div className="mt-8 space-y-4">
            {allergyOptions.map((allergy) => (
              <label
                key={allergy}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={allergies.includes(allergy)}
                  onChange={() => toggleAllergy(allergy)}
                  className="h-5 w-5"
                />

                <span className="font-medium text-slate-800">
                  {allergy} pollen
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={saveAllergies}
            disabled={saving}
            className="mt-8 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Allergy Profile"}
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