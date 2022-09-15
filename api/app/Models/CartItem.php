<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
    ];

    /**
     * Calculate the price for this line item based on the quantity.
     *
     * @param float|null $unitPrice
     *
     * @return \Yab\ShoppingCart\Models\CartItem
     */
    public function calculatePrice(float|null $unitPrice = null): CartItem
    {
        if (is_null($unitPrice)) {
            $unitPrice = $this->product->unit_price;
        }

        $this->unit_price = $unitPrice;
        $this->price = $unitPrice * $this->quantity;

        return $this;
    }

    /**
     * Model relationship
     */

    /**
     * A cart item belongs to a cart.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * The product that was purchased.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product(): belongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
