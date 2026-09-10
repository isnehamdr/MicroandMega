<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\User;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'title',
        'content',
        'featured_image',
        'product_category_id',
        'status',
        'stock_status',
        'stock_quantity',
        'low_stock_threshold',
        'price',
    ];

    protected $casts = [
        'status'       => 'boolean',
        'stock_status' => 'string',
        'price'        => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug) && !empty($product->name)) {
                $product->slug = self::generateUniqueSlug($product->name);
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('name') && !empty($product->name)) {
                $product->slug = self::generateUniqueSlug($product->name, $product->id);
            }
        });
    }

    protected static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        if ($base === '') {
            $base = 'product';
        }

        $slug = $base;
        $counter = 2;

        while (
            self::query()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base . '-' . $counter++;
        }

        return $slug;
    }

    public function productCategory()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function category()
    {
        return $this->productCategory();
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function recomputeStockStatus(): void
    {
        $previousStatus = $this->stock_status;

        if ($this->stock_quantity <= 0) {
            $this->stock_status = 'out_of_stock';
        } elseif ($this->stock_quantity <= $this->low_stock_threshold) {
            $this->stock_status = 'low_stock';
        } else {
            $this->stock_status = 'in_stock';
        }

        $justBecameLow = $previousStatus !== $this->stock_status
            && in_array($this->stock_status, ['low_stock', 'out_of_stock']);

        if ($justBecameLow) {
            $this->notifyAdminsOfLowStock();
        }
    }

    protected function notifyAdminsOfLowStock(): void
    {
        try {
            $admins = User::all()->filter(function ($user) {
                return !empty($user->email)
                    && filter_var($user->email, FILTER_VALIDATE_EMAIL)
                    && !str_ends_with(strtolower($user->email), '@example.com');
            });

            if ($admins->isEmpty()) {
                return;
            }

            \Illuminate\Support\Facades\Notification::send(
                $admins,
                new \App\Notifications\AdminAlertNotification(
                    type: 'low_stock',
                    message: "{$this->name} is running low ({$this->stock_quantity} left).",
                    link: '/products',
                    data: [
                        'product_id'     => $this->id,
                        'stock_quantity' => $this->stock_quantity,
                    ],
                    mailSubject: 'Low Stock Alert: ' . $this->name
                )
            );
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning(
                'Low stock notification failed: ' . $e->getMessage()
            );
        }
    }
}