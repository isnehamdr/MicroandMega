<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_amount',
        'usage_limit',
        'used_count',
        'expires_at',
        'status',
    ];

    protected $casts = [
        'status'     => 'boolean',
        'expires_at' => 'date',
    ];

    public function isValidFor(int $subtotal): array
    {
        if (!$this->status) {
            return [false, 'This coupon is inactive.'];
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return [false, 'This coupon has expired.'];
        }

        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return [false, 'This coupon has reached its usage limit.'];
        }

        if ($this->min_order_amount && $subtotal < $this->min_order_amount) {
            return [false, "Minimum order of Rs. {$this->min_order_amount} required for this coupon."];
        }

        return [true, null];
    }

    public function calculateDiscount(int $subtotal): int
    {
        if ($this->type === 'percent') {
            return (int) round(($subtotal * $this->value) / 100);
        }

        return min($this->value, $subtotal);
    }
}