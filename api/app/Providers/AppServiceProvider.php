<?php

namespace App\Providers;

use App\Models\CartItem;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);

        CartItem::creating((function ($cartItem) {
            $cartItem->unit_price = $cartItem->product->unit_price;
            $cartItem->calculatePrice();
        }));

        CartItem::created(function ($cartItem) {
            $this->updateCartTotal($cartItem);
        });

        CartItem::updated(function ($cartItem) {
            $this->updateCartTotal($cartItem);
        });

        CartItem::deleted(function ($cartItem) {
            $this->updateCartTotal($cartItem);
        });
    }

    private function updateCartTotal(CartItem $cartItem)
    {
        $cart = $cartItem->cart;
        $cart->total = $cart->items->sum('price');
        $cart->save();
    }
}
