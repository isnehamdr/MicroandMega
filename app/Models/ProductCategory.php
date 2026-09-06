<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductCategory extends Model
{
      use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'title',
        'content',
        'featured_image',
        'icon_image',
        'parent_id',
        'order',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($productcategory) {
            if (empty($productcategory->slug) && !empty($productcategory->name)) {
                $productcategory->slug = self::generateUniqueSlug($productcategory->name);
            }
        });

        static::updating(function ($productcategory) {
            if ($productcategory->isDirty('name') && !empty($productcategory->name)) {
                $productcategory->slug = self::generateUniqueSlug($productcategory->name, $productcategory->id);
            }
        });
    }

    protected static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        if ($base === '') $base = 'category';

        $slug = $base;
        $counter = 2;

        while (self::withTrashed()
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()
        ) {
            $slug = $base . '-' . $counter++;
        }

        return $slug;
    }


    // A category has many products
    public function products()
    {
        return $this->hasMany(Product::class, 'product_category_id');
    }

    public function parent()
    {
        return $this->belongsTo(ProductCategory::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(ProductCategory::class, 'parent_id');
    }

   
}
