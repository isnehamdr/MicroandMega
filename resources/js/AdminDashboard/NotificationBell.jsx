import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bell, CheckCheck } from "lucide-react";
import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const ref = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(route("ournotifications.index"));
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unread_count || 0);
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30s so admin sees new alerts without refreshing
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await axios.patch(route("ournotifications.read", { id }));
            fetchNotifications();
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.patch(route("ournotifications.readAll"));
            fetchNotifications();
        } catch (error) {
            console.error("Error marking all as read", error);
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-bold leading-none">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white">
                        <h4 className="font-bold text-sm text-gray-800">Notifications</h4>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                            >
                                <CheckCheck size={13} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">No notifications yet</p>
                    ) : (
                        <ul>
                            {notifications.map((n) => (
                              <li
    key={n.id}
    onClick={() => {
        if (!n.read_at) handleMarkAsRead(n.id);
        if (n.data?.link) {
            setOpen(false);
            router.visit(n.data.link);
        }
    }}
    className={`px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer transition-colors ${
        n.read_at ? "bg-white" : "bg-red-50 hover:bg-red-100"
    }`}
>
                                    <p className="text-sm text-gray-700 leading-snug">
                                        {n.data?.message || "New notification"}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        {new Date(n.created_at).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}