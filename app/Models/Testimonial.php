<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_name',
        'company',
        'message',
        'photo',
        'rating',
        'status',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

   // In App/Models/Testimonial.php
protected $appends = ['photo_url'];

public function getPhotoUrlAttribute(): ?string
{
    return $this->photo ?? null;
}

}