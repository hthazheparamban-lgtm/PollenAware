"use client";

import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
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

  const loadNotifications = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/notifications/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load notifications"
        );
      }

      setNotifications(data);
    } catch (error) {
      console.error("Load notifications error:", error);
      setMessage("Unable to load notifications.");
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
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update notification"
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
      setMessage(error.message);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">
          Loading notifications...
        </p>
      </main>
    );
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Notifications
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Allergy risk alerts and other notifications.
              </p>
            </div>

            {unreadCount > 0 && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                {unreadCount} unread
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="mt-8 rounded-xl border border-slate-200 p-6 text-center">
              <p className="font-medium text-slate-800">
                No notifications
              </p>

              <p className="mt-2 text-sm text-slate-500">
                You do not have any allergy risk notifications yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-xl border p-5 ${
                    notification.read
                      ? "border-slate-200 bg-white"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {notification.title}
                        </h3>

                        {!notification.read && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-slate-700">
                        {notification.message}
                      </p>

                      <div className="mt-3 text-xs text-slate-500">
                        <p>
                          Risk: {notification.risk_level}{" "}
                          (Score: {notification.risk_score})
                        </p>

                        <p className="mt-1">
                          {new Date(
                            notification.created_at
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {!notification.read && (
                      <button
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        disabled={updating === notification.id}
                        className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                      >
                        {updating === notification.id
                          ? "Updating..."
                          : "Mark as Read"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
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