<?php

namespace App\Models;

use App\Traits\HasWishlists;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasWishlists;
    protected $table = 'users';

    const USER_CUSTOMER = false;
    const USER_ADMINISTRATOR = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'is_admin'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_admin' => 'boolean'
    ];

    /**
     * Mutators
     */
    public function setNameAttribute($valor)
    {
        $this->attributes['name'] = strtolower($valor);
    }

    public function setEmailAttribute($valor)
    {
        $this->attributes['email'] = strtolower($valor);
    }

    /**
     * Accesors
     */
    public function getNameAttribute($valor)
    {
        return ucwords($valor); //primer letra de cada palabra en mayuscula
    }

    /**
     * Functions
     */
    public function isAdmin()
    {
        return $this->is_admin == User::USER_ADMINISTRATOR;
    }
}
