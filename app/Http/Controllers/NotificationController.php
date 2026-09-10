<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // GET /ournotifications — latest notifications for the logged-in admin
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'status'        => true,
            'unread_count'  => $user->unreadNotifications()->count(),
            'notifications' => $user->notifications()->latest()->limit(20)->get(),
        ]);
    }

    // PATCH /ournotifications/{id}/read — mark one as read
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['status' => true]);
    }

    // PATCH /ournotifications/read-all — mark all as read
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['status' => true]);
    }
}