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
        'first_name',
        'last_name',
        'email',
        'password',
        'profile_picture'
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
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $redirect_url = request()->input('redirect_url');
        $this->notify(new \App\Notifications\MailResetPasswordNotification($token, $redirect_url));
    }

    /**
     * Mutators
     */
    public function setFirstNameAttribute($valor)
    {
        $this->attributes['first_name'] = mb_strtolower($valor);
    }

    public function setLastNameAttribute($valor)
    {
        $this->attributes['last_name'] = mb_strtolower($valor);
    }

    public function setEmailAttribute($valor)
    {
        $this->attributes['email'] = mb_strtolower($valor);
    }

    /**
     * Accesors
     */
    public function getFirstNameAttribute($valor)
    {
        return ucwords($valor); //primer letra de cada palabra en mayuscula
    }

    public function getLastNameAttribute($valor)
    {
        return ucwords($valor);
    }

    /**
     * Functions
     */
    public function isAdmin()
    {
        return $this->is_admin == User::USER_ADMINISTRATOR;
    }
}
