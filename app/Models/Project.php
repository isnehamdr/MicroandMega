<?php
// app/Models/Project.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'name',
        'description',
        'image',
        'client_name',
        'category',
        'status',
        'slug',
        'location',
        'rating',
        'order',        // ✅ Added order field
        'year',
        'contract_type',
    ];

    protected $casts = [
        'rating' => 'integer',
        'order' => 'integer',  // ✅ Cast order to integer
    ];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ?? null;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($project) {
            if (!$project->name) {
                $project->name = $project->title;
            }
            
            $slug = Str::slug($project->title);
            $count = static::where('slug', 'LIKE', "{$slug}%")->count();
            $project->slug = $count ? "{$slug}-{$count}" : $slug;
            
            if (!$project->year) {
                $project->year = date('Y');
            }
            
            if (!$project->contract_type) {
                $project->contract_type = 'Full Project';
            }
            
            if (!$project->location) {
                $project->location = 'Various Locations';
            }
            
            // Keep rating but default to 0 if not provided
            if (!$project->rating) {
                $project->rating = 0;
            }
            
            // Default order to 0
            if ($project->order === null) {
                $project->order = 0;
            }
        });

        static::created(function ($project) {
            $slug = Str::slug($project->title) . '-' . $project->id;
            $project->slug = $slug;
            $project->saveQuietly();
        });
        
        static::updating(function ($project) {
            if ($project->isDirty('title') && !$project->isDirty('name')) {
                $project->name = $project->title;
            }
        });
    }
}