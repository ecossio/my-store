<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    const PRODUCT_AVAILABLE = 'available';
    const PRODUCT_NOT_AVAILABLE = 'not available';

    protected $fillable = [
        'name',
        'description',
        'stock',
        'unit_price',
        'status',
        'thumbnail',
    ];

    /**
     * Model relationships
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
}
