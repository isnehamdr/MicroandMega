<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

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
        'product_category_id',  // ← fixed (was 'category_id' pointing to old categories table)
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
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
        if ($base === '') $base = 'product';

        $slug = $base;
        $counter = 2;

       while (self::query()
    ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
    ->where('slug', $slug)
    ->exists()
) {
    $slug = $base . '-' . $counter++;
}

        return $slug;
    }

    // Product belongs to a ProductCategory
    public function productCategory()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    // Backward-compatible alias (some front-end uses product.category)
    public function category()
    {
        return $this->productCategory();
    }

    // Product has many gallery images
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id'); 
        // NOTE: if you want product images separate from category images,
        // create a separate product_images table. For now reusing ProductCategoryImage
        // with product_id is cleaner — see note below.
    }
}
