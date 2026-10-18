
"use client";

import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId;
    } catch (error) {
      console.error("Token error:", error);
      return null;
    }
  };

  const loadNotifications = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/notifications/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load notifications."
        );
      }

      setNotifications(data);
      setMessage("");
    } catch (error) {
      console.error("Load notifications error:", error);
      setMessage("Unable to load notifications. Please try again.");
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

    loadNotifications(userId);
  }, []);

  const markAsRead = async (notificationId) => {
    setUpdating(notificationId);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:3005/notifications/${notificationId}/read`,
        { method: "PUT" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update notification."
        );
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? data
            : notification
        )
      );
    } catch (error) {
      console.error("Mark notification error:", error);
      setMessage(error.message || "Unable to update notification.");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getRiskStyle = (level) => {
    const risk = String(level || "").toLowerCase();

    if (risk.includes("high")) {
      return "bg-rose-50 text-rose-700 ring-rose-200";
    }

    if (risk.includes("moderate") || risk.includes("medium")) {
      return "bg-amber-50 text-amber-800 ring-amber-200";
    }

    if (risk.includes("low")) {
      return "bg-emerald-50 text-emerald-800 ring-emerald-200";
    }

    return "bg-stone-100 text-stone-600 ring-stone-200";
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = notifications.filter(
    (notification) =>
      filter === "all" ||
      (filter === "unread" && !notification.read) ||
      (filter === "read" && notification.read)
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f4]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />
          <p className="text-sm text-stone-500">
            Loading your notifications...
          </p>
        </div>
      </main>
    );
  }

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

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Page heading */}
        <section className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#65836a]">
              YOUR PERSONAL UPDATES
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Notifications
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
              Keep track of your allergy risk alerts and stay informed
              about notifications generated by PollenAware.
            </p>
          </div>

          <button
            onClick={() => {
              const userId = getUserIdFromToken();

              if (userId) {
                setLoading(true);
                loadNotifications(userId);
              } else {
                window.location.href = "/login";
              }
            }}
            className="rounded-xl border border-[#dce5d6] bg-white px-4 py-3 text-sm font-bold text-[#376649] transition hover:bg-[#edf3e8]"
          >
            ↻ Refresh
          </button>
        </section>

        {/* Summary banner */}
        <section className="relative mt-8 overflow-hidden rounded-[26px] bg-[#234c39] p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-1 -top-8 h-36 w-36 rounded-full border border-white/10" />

          <div className="relative flex items-center justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100/70">
                NOTIFICATION CENTRE
              </p>

              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                Stay in the know.
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-emerald-50/80">
                Your notifications are gathered here so you can review
                the information relevant to your profile.
              </p>
            </div>

            <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 sm:flex">
              <span className="text-4xl">♧</span>
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3">
            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
              <p className="text-xs text-emerald-100/70">Total</p>
              <p className="mt-1 text-2xl font-semibold">
                {notifications.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
              <p className="text-xs text-emerald-100/70">Unread</p>
              <p className="mt-1 text-2xl font-semibold">
                {unreadCount}
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
              <p className="text-xs text-emerald-100/70">Read</p>
              <p className="mt-1 text-2xl font-semibold">
                {notifications.length - unreadCount}
              </p>
            </div>
          </div>
        </section>

        {/* Notifications list */}
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#65836a]">
                YOUR ACTIVITY
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Your notifications
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                Review alerts and manage their read status.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All" },
                { value: "unread", label: "Unread" },
                { value: "read", label: "Read" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    filter === option.value
                      ? "bg-[#234c39] text-white"
                      : "border border-[#e1e5dc] bg-white text-stone-600 hover:bg-[#edf3e8]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              {message}
              <button
                onClick={() => {
                  const userId = getUserIdFromToken();
                  if (userId) {
                    setLoading(true);
                    loadNotifications(userId);
                  }
                }}
                className="ml-2 font-bold underline"
              >
                Try again
              </button>
            </div>
          )}

          {filteredNotifications.length === 0 ? (
            <div className="mt-6 rounded-[26px] border border-[#e5e9df] bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#edf3e8] text-3xl text-[#376649]">
                ♧
              </div>

              <h3 className="mt-5 text-lg font-bold">
                {notifications.length === 0
                  ? "You're all caught up"
                  : `No ${filter} notifications`}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">
                {notifications.length === 0
                  ? "When notifications are generated for your account, they will appear here."
                  : "Try another filter to see your other notifications."}
              </p>

              {filter !== "all" && notifications.length > 0 && (
                <button
                  onClick={() => setFilter("all")}
                  className="mt-5 rounded-xl bg-[#234c39] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#193c2b]"
                >
                  View all notifications
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredNotifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`rounded-2xl border p-5 transition duration-200 hover:shadow-sm sm:p-6 ${
                    notification.read
                      ? "border-[#e5e9df] bg-white"
                      : "border-[#cbdcc4] bg-[#fbfdf9] shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${
                        notification.read
                          ? "bg-stone-100 text-stone-500"
                          : "bg-[#e5efdf] text-[#376649]"
                      }`}
                    >
                      {notification.read ? "✓" : "♧"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold leading-6">
                          {notification.title}
                        </h3>

                        {!notification.read && (
                          <span className="rounded-full bg-[#e5efdf] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#376649]">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {notification.message}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${getRiskStyle(notification.risk_level)}`}
                        >
                          {notification.risk_level || "Risk level unavailable"}
                        </span>

                        {notification.risk_score !== null &&
                          notification.risk_score !== undefined && (
                            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                              Score: {notification.risk_score}
                            </span>
                          )}
                      </div>

                      <p className="mt-3 text-xs text-stone-400">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>

                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        disabled={updating === notification.id}
                        className="shrink-0 rounded-xl bg-[#234c39] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#193c2b] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
                      >
                        {updating === notification.id
                          ? "Saving..."
                          : "Mark as read"}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Disclaimer */}
        <section className="mt-8 flex items-start gap-4 rounded-2xl border border-[#e5e9df] bg-[#edf2e8] p-5 sm:p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-[#376649]">
            ✦
          </span>
          <div>
            <h3 className="text-sm font-bold">
              About your allergy notifications
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Notifications reflect the prototype's risk assessment
              rules and available environmental information. They are
              not clinically validated medical advice.
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
