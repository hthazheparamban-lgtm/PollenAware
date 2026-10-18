
"use client";

import { useEffect, useState } from "react";

function getRiskStyle(level) {
  const value = String(level || "").toLowerCase();

  if (value.includes("high")) {
    return {
      panel: "border-rose-200 bg-rose-50",
      text: "text-rose-800",
      icon: "!",
      label: "Higher risk category",
    };
  }

  if (value.includes("moderate") || value.includes("medium")) {
    return {
      panel: "border-amber-200 bg-amber-50",
      text: "text-amber-800",
      icon: "◈",
      label: "Moderate risk category",
    };
  }

  if (value.includes("low")) {
    return {
      panel: "border-emerald-200 bg-emerald-50",
      text: "text-emerald-800",
      icon: "✓",
      label: "Lower risk category",
    };
  }

  return {
    panel: "border-[#e5e9df] bg-[#f7f8f4]",
    text: "text-[#376649]",
    icon: "♡",
    label: "Assessment result",
  };
}

export default function RiskAssessmentPage() {
  const [loading, setLoading] = useState(true);
  const [assessing, setAssessing] = useState(false);
  const [assessment, setAssessment] = useState(null);
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

  const loadLatestAssessment = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3004/risk-assessments/${userId}`
      );

      if (!response.ok) {
        throw new Error("Unable to load previous assessments.");
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setAssessment(data[0]);
      }
    } catch (error) {
      console.error("Load assessment error:", error);
      setMessage(error.message);
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
        { method: "POST" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create risk assessment."
        );
      }

      setAssessment(data);
      setMessage("Your risk assessment has been completed successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Risk assessment error:", error);
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setAssessing(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f4]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />
          <p className="text-sm text-stone-500">
            Loading your assessment...
          </p>
        </div>
      </main>
    );
  }

  const riskStyle = assessment
    ? getRiskStyle(assessment.risk_level)
    : null;

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
          PERSONALISED MONITORING
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Allergy risk assessment
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
          Review the latest risk estimate generated using your allergy
          profile and environmental information.
        </p>

        <section className="relative mt-8 overflow-hidden rounded-[26px] bg-[#234c39] p-6 text-white sm:p-9">
          <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full border border-white/10" />
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100/70">
                YOUR ENVIRONMENT, YOUR PROFILE
              </p>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                Understand your risk.
              </h2>
              <p className="mt-3 text-sm leading-6 text-emerald-50/80">
                Generate an updated assessment using the application's
                current environmental data and prototype scoring rules.
              </p>
            </div>

            <button
              onClick={createAssessment}
              disabled={assessing}
              className="rounded-xl bg-[#e4edcf] px-5 py-3.5 text-sm font-bold text-[#234c39] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {assessing ? "Calculating..." : "↻ Refresh assessment"}
            </button>
          </div>
        </section>

        {assessment ? (
          <section className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#65836a]">
                  LATEST RESULT
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Your assessment
                </h2>
              </div>
              <span className="text-xs text-stone-400">
                Prototype risk estimate
              </span>
            </div>

            <div className={`mt-5 rounded-[26px] border p-6 sm:p-8 ${riskStyle.panel}`}>
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-[0.16em] ${riskStyle.text}`}>
                    RISK LEVEL
                  </p>
                  <h3 className={`mt-3 text-4xl font-semibold tracking-tight sm:text-5xl ${riskStyle.text}`}>
                    {assessment.risk_level || "Unavailable"}
                  </h3>
                  <p className={`mt-3 text-sm ${riskStyle.text}`}>
                    {riskStyle.label}
                  </p>
                </div>

                <div className={`flex h-20 w-20 items-center justify-center rounded-3xl border border-current/10 bg-white/70 text-4xl ${riskStyle.text}`}>
                  {riskStyle.icon}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#e5e9df] bg-white p-6">
                <p className="text-sm font-medium text-stone-500">
                  Risk score
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-tight">
                  {assessment.risk_score ?? "—"}
                </p>
                <p className="mt-2 text-xs leading-5 text-stone-400">
                  Score produced by the application's assessment algorithm.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5e9df] bg-white p-6">
                <p className="text-sm font-medium text-stone-500">
                  Assessment location
                </p>
                <p className="mt-3 text-lg font-semibold">
                  Thessaloniki, Greece
                </p>
                <p className="mt-2 text-xs leading-5 text-stone-400">
                  Latitude: {assessment.latitude ?? "—"}
                  <br />
                  Longitude: {assessment.longitude ?? "—"}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-8 rounded-[26px] border border-[#e5e9df] bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#edf3e8] text-3xl text-[#376649]">
              ♡
            </div>
            <h2 className="mt-5 text-lg font-bold">
              No assessment available yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
              Generate an assessment to view the risk estimate returned
              by the PollenAware service.
            </p>
          </section>
        )}

        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`mt-5 rounded-xl border p-4 text-sm ${
              messageType === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-[#d6e6cf] bg-[#f0f7eb] text-[#285439]"
            }`}
          >
            {message}
          </div>
        )}

        <section className="mt-8 flex items-start gap-4 rounded-2xl border border-[#e5e9df] bg-[#edf2e8] p-5 sm:p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-[#376649]">
            ✦
          </span>
          <div>
            <h3 className="text-sm font-bold">Important information</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              This assessment uses prototype scoring rules and has not
              been clinically validated. It is for demonstrating the
              application's functionality and is not a medical diagnosis
              or a substitute for professional medical advice.
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
