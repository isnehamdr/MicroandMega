<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log as LaravelLog;

class CouponController extends Controller
{
    // GET /ourcoupons — admin: list all coupons
    public function index()
    {
        $coupons = Coupon::latest()->get();

        return response()->json([
            'status' => true,
            'data'   => $coupons,
        ]);
    }

    // POST /ourcoupons — admin: create
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'code'              => 'required|string|max:50|unique:coupons,code',
                'type'              => 'required|in:percent,flat',
                'value'             => 'required|integer|min:1',
                'min_order_amount'  => 'nullable|integer|min:0',
                'usage_limit'       => 'nullable|integer|min:1',
                'expires_at'        => 'nullable|date',
                'status'            => 'boolean',
            ]);

            $validated['code'] = strtoupper($validated['code']);

            $coupon = Coupon::create($validated);

            return response()->json([
                'status'  => true,
                'message' => 'Coupon created successfully',
                'data'    => $coupon,
            ], 201);
        } catch (\Exception $e) {
            LaravelLog::error('Error creating coupon: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // PUT /ourcoupons/{id} — admin: update
    public function update(Request $request, $id)
    {
        try {
            $coupon = Coupon::findOrFail($id);

            $validated = $request->validate([
                'code'              => 'required|string|max:50|unique:coupons,code,' . $id,
                'type'              => 'required|in:percent,flat',
                'value'             => 'required|integer|min:1',
                'min_order_amount'  => 'nullable|integer|min:0',
                'usage_limit'       => 'nullable|integer|min:1',
                'expires_at'        => 'nullable|date',
                'status'            => 'boolean',
            ]);

            $validated['code'] = strtoupper($validated['code']);

            $coupon->update($validated);

            return response()->json([
                'status'  => true,
                'message' => 'Coupon updated successfully',
                'data'    => $coupon->fresh(),
            ]);
        } catch (\Exception $e) {
            LaravelLog::error('Error updating coupon: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // DELETE /ourcoupons/{id} — admin: delete
    public function destroy($id)
    {
        try {
            $coupon = Coupon::findOrFail($id);
            $coupon->delete();

            return response()->json(['status' => true, 'message' => 'Coupon deleted successfully']);
        } catch (\Exception $e) {
            LaravelLog::error('Error deleting coupon: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // POST /coupons/validate — public: cart page calls this to apply a coupon
    public function validateCode(Request $request)
    {
        $validated = $request->validate([
            'code'     => 'required|string',
            'subtotal' => 'required|integer|min:0',
        ]);

        $coupon = Coupon::whereRaw('UPPER(code) = ?', [strtoupper($validated['code'])])->first();

        if (!$coupon) {
            return response()->json([
                'status'  => false,
                'message' => 'Invalid coupon code.',
            ], 404);
        }

        [$isValid, $error] = $coupon->isValidFor($validated['subtotal']);

        if (!$isValid) {
            return response()->json([
                'status'  => false,
                'message' => $error,
            ], 422);
        }

        $discount = $coupon->calculateDiscount($validated['subtotal']);

        return response()->json([
            'status' => true,
            'data'   => [
                'code'     => $coupon->code,
                'type'     => $coupon->type,
                'value'    => $coupon->value,
                'discount' => $discount,
                'label'    => $coupon->type === 'percent'
                    ? "{$coupon->value}% off"
                    : "Rs. {$coupon->value} off",
            ],
        ]);
    }
}