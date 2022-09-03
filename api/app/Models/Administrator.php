<?php

namespace App\Models;

use App\Scopes\AdminScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Administrator extends User
{
    use HasFactory;

    public static function booted()
    {
        static::addGlobalScope(new AdminScope);
    }
}
