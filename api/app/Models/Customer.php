<?php

namespace App\Models;

use App\Scopes\CustomerScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends User
{
    use HasFactory;

    protected static function booted()
    {
        static::addGlobalScope(new CustomerScope);
    }

    /**
     * Model relationships
     */
    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }
}
