<?php

namespace App\Traits;

use Exception;
use App\Models\Wishlist;

trait HasWishlists
{
    /**
     * Add wish to a wishlists.
     *
     * @return void
     */
    public function wish($productId = null)
    {
        if (!$productId) {
            throw new Exception('Product id not set');
        }

        if (!$this->wishExists($productId)) {
            return $this->createWish($productId);
        } else {
            return $this->findWish($productId);
        }
    }

    /**
     * Remove wish from a wishlists.
     *
     * @return void
     */
    public function unwish($productId = null)
    {
        if (!$productId) {
            throw new Exception('Product id not set');
        }

        return $this->deleteWish($productId);
    }

    /**
     * wishExists.
     *
     * @param  integer  $productId
     * @return Model|bool
     */
    private function wishExists($productId)
    {
        return Wishlist::where('user_id', $this->id)
            ->where('product_id', $productId)
            ->first();
    }

    /**
     * createWish.
     *
     * @param  integer  $productId
     * @return Model
     */
    private function createWish($productId)
    {
        $wishlist = new Wishlist();
        $wishlist->user_id = $this->id;
        $wishlist->product_id = $productId;
        $wishlist->save();

        return $wishlist;
    }

    /**
     * deleteWish.
     *
     * @param  integer  $productId
     * @return void
     */
    private function deleteWish($productId)
    {
        return Wishlist::where('user_id', $this->id)
            ->where('product_id', $productId)
            ->delete();
    }

    /**
     * findWish.
     *
     * @param  integer  $productId
     * @return Model|bool
     */
    private function findWish($productId)
    {
        return Wishlist::where('user_id', $this->id)
            ->where('product_id', $productId)
            ->first();
    }

    /**
     * Get all wishes for the user.
     */
    public function wishes()
    {
        $items = Wishlist::where('user_id', $this->id)->get();

        return $items;
    }

    /**
     * Count wishes of the user
     */
    public function totalWishes()
    {
        return Wishlist::where('user_id', $this->id)->count();
    }
}
