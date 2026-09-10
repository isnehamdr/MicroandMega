<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Notifications\AdminAlertNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log as LaravelLog;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

class OrderController extends Controller
{
    // POST /checkout
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'customer_name'     => 'required|string|max:255',
                'customer_email'    => 'required|email',
                'customer_phone'    => 'nullable|string|max:30',
                'shipping_address'  => 'nullable|string',
                'coupon_code'       => 'nullable|string',
                'discount'          => 'nullable|integer|min:0',
                'shipping_fee'      => 'nullable|integer|min:0',
                'items'             => 'required|array|min:1',
                'items.*.id'        => 'required|integer|exists:products,id',
                'items.*.name'      => 'required|string',
                'items.*.image'     => 'nullable|string',
                'items.*.price'     => 'required|integer|min:0',
                'items.*.quantity'  => 'required|integer|min:1',
            ]);

            $order = DB::transaction(function () use ($validated, $request) {
                $subtotal = collect($validated['items'])
                    ->sum(fn ($item) => $item['price'] * $item['quantity']);

                $discount    = $validated['discount'] ?? 0;
                $shippingFee = $validated['shipping_fee'] ?? 0;
                $grandTotal  = max(0, $subtotal - $discount) + $shippingFee;

                $orderNumber = 'ORD-' . date('Ymd') . '-' . strtoupper(uniqid());

                $order = Order::create([
                    'order_number'     => $orderNumber,
                    'user_id'          => $request->user()?->id,
                    'customer_name'    => $validated['customer_name'],
                    'customer_email'   => $validated['customer_email'],
                    'customer_phone'   => $validated['customer_phone'] ?? null,
                    'shipping_address' => $validated['shipping_address'] ?? null,
                    'subtotal'         => $subtotal,
                    'coupon_code'      => $validated['coupon_code'] ?? null,
                    'discount'         => $discount,
                    'shipping_fee'     => $shippingFee,
                    'grand_total'      => $grandTotal,
                    'status'           => 'pending',
                ]);

                foreach ($validated['items'] as $item) {
                    OrderItem::create([
                        'order_id'      => $order->id,
                        'product_id'    => $item['id'],
                        'product_name'  => $item['name'],
                        'product_image' => $item['image'] ?? null,
                        'price'         => $item['price'],
                        'quantity'      => $item['quantity'],
                        'line_total'    => $item['price'] * $item['quantity'],
                    ]);

                    $product = Product::find($item['id']);
                    if ($product) {
                        $product->stock_quantity = max(0, $product->stock_quantity - $item['quantity']);
                        $product->recomputeStockStatus();
                        $product->save();
                    }
                }

                return $order;
            });

            // Load items for emails
            $order->load('items');

            // ── 1. Email to Customer ──────────────────────────────────────
            try {
                Mail::send('emails.order-placed', ['order' => $order], function ($message) use ($order) {
                    $message->to($order->customer_email)
                            ->subject('Order Confirmed - ' . $order->order_number);
                });
            } catch (\Exception $e) {
                LaravelLog::warning('Customer order email failed: ' . $e->getMessage());
            }

            // ── 2. Email to Admins (skip fake emails) ─────────────────────
            try {
                $admins = User::all()->filter(function ($user) {
                    return !empty($user->email)
                        && filter_var($user->email, FILTER_VALIDATE_EMAIL)
                        && !str_ends_with(strtolower($user->email), '@example.com');
                });

                foreach ($admins as $admin) {
                    Mail::send('emails.order-placed-admin', ['order' => $order], function ($message) use ($admin, $order) {
                        $message->to($admin->email)
                                ->subject('New Order Received: ' . $order->order_number);
                    });
                }
            } catch (\Exception $e) {
                LaravelLog::warning('Admin order email failed: ' . $e->getMessage());
            }

            // ── 3. Optional in-app notification (no extra mail) ───────────
            try {
                $admins = User::all()->filter(function ($user) {
                    return !empty($user->email)
                        && filter_var($user->email, FILTER_VALIDATE_EMAIL)
                        && !str_ends_with(strtolower($user->email), '@example.com');
                });

                if ($admins->isNotEmpty()) {
                    Notification::send(
                        $admins,
                        new AdminAlertNotification(
                            type: 'new_order',
                            message: "New order {$order->order_number} placed by {$order->customer_name} — Rs. {$order->grand_total}",
                            link: '/orders',
                            data: [
                                'order_id'     => $order->id,
                                'order_number' => $order->order_number,
                            ],
                            mailSubject: null
                        )
                    );
                }
            } catch (\Exception $e) {
                LaravelLog::warning('Order notification failed: ' . $e->getMessage());
            }

            return response()->json([
                'status'  => true,
                'message' => 'Order placed successfully',
                'data'    => $order,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            LaravelLog::error('Error creating order: ' . $e->getMessage());
            LaravelLog::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong while placing your order. Please try again.',
                'debug'   => app()->environment('local') ? $e->getMessage() : null,
            ], 500);
        }
    }

    // GET /ourorders
    public function index()
    {
        $orders = Order::with('items')->latest()->get();

        return response()->json([
            'status' => true,
            'data'   => $orders,
        ]);
    }

    // GET /ourorders/{id}
    public function show($id)
    {
        $order = Order::with('items')->findOrFail($id);

        return response()->json([
            'status' => true,
            'data'   => $order,
        ]);
    }

    // PUT /ourorders/{id}
    public function update(Request $request, $id)
    {
        $order = Order::with('items')->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,completed,cancelled',
        ]);

        $order->update(['status' => $validated['status']]);
        $order->refresh();
        $order->load('items');

        // Email customer about status change
        try {
            Mail::send('emails.order-status-updated', ['order' => $order], function ($message) use ($order) {
                $message->to($order->customer_email)
                        ->subject('Order Update - ' . $order->order_number . ' is now ' . ucfirst($order->status));
            });
        } catch (\Exception $e) {
            LaravelLog::warning('Order status email failed: ' . $e->getMessage());
        }

        return response()->json([
            'status'  => true,
            'message' => 'Order status updated',
            'data'    => $order,
        ]);
    }
}