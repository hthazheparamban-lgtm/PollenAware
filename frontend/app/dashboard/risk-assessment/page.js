"use client";

import { useEffect, useState } from "react";

export default function RiskAssessmentPage() {
  const [loading, setLoading] = useState(true);
  const [assessing, setAssessing] = useState(false);
  const [assessment, setAssessment] = useState(null);
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

  const loadLatestAssessment = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3004/risk-assessments/${userId}`
      );

      if (!response.ok) {
        throw new Error("Unable to load risk assessments");
      }

      const data = await response.json();

      if (data.length > 0) {
        setAssessment(data[0]);
      }
    } catch (error) {
      console.error("Load assessment error:", error);
      setMessage("Unable to load previous assessment.");
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

    loadLatestAssessment(userId);
  }, []);

  const createAssessment = async () => {
    const userId = getUserIdFromToken();

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    setAssessing(true);
    setMessage("");

    try {
      const latitude = 40.6401;
      const longitude = 22.9444;

      const response = await fetch(
        `http://localhost:3004/risk-assessments/${userId}?latitude=${latitude}&longitude=${longitude}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create risk assessment"
        );
      }

      setAssessment(data);
      setMessage("Risk assessment completed successfully.");
    } catch (error) {
      console.error("Risk assessment error:", error);
      setMessage(error.message);
    } finally {
      setAssessing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">
          Loading risk assessment...
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
            Allergy Risk Assessment
          </h2>

          <p className="mt-2 text-sm text-slate-500">
           View your latest personalised allergy risk based on
your allergy profile and current environmental conditions.
          </p>

          <button
            onClick={createAssessment}
            disabled={assessing}
            className="mt-8 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {assessing
  ? "Updating Risk..."
  : "Refresh Risk Assessment"}
          </button>

          {assessment && (
            <div className="mt-8 rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Latest Risk Assessment
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Risk Level
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {assessment.risk_level}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Risk Score
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {assessment.risk_score}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Location
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  Latitude: {assessment.latitude}
                  <br />
                  Longitude: {assessment.longitude}
                </p>
              </div>
            </div>
          )}

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