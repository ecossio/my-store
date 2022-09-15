<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory, HasUuid;

    /**
     * The name of the primary key field.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Whether or not the primary key should be incremented.
     *
     * @var boolean
     */
    public $incrementing = false;

    /**
     * The primary key type.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The relationships which should be eagerly loaded.
     *
     * @var array
     */
    protected $with = [
        'items',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'customer_id'
    ];


    /**
     * Get the total for the checkout.
     *
     * @return float
     */
    public function getTotal(): float
    {
        return round($this->items->sum('price'), 2);
    }

    public function itemExist($productId)
    {
        return $this->items->where('product_id', $productId)
            ->first();
    }


    /**
     * Model relationship
     */

    /**
     * A cart may have many line items.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }
}
