<?php

namespace App\Http\Controllers\Api\V1\Cart;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\CartItemCreateRequest;
use App\Http\Requests\CartItemUpdateRequest;
use App\Models\Product;

class CartItemController extends ApiController
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\CartItemCreateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CartItemCreateRequest $request, Cart $cart)
    {
        $data = $request->all();

        if ($cart->itemExist($data['product_id'])) {
            $item = $cart->items()->where('product_id', $data['product_id'])->firstOrFail();
            $item->quantity +=  1;
        } else {
            $item = $cart->items()->create([
                'product_id' => $data['product_id'],
                'quantity' => $data['quantity']
            ]);
        }

        $item->calculatePrice();
        $item->save();

        return $this->successResponse(['data' => $cart], Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\CartItemUpdateRequest  $request
     * @param  \App\Models\CartItem  $cartItem
     * @return \Illuminate\Http\Response
     */
    public function update(CartItemUpdateRequest $request, Cart $cart, Product $item)
    {
        $cartItem = $cart->items()->whereProductId($item->id)->first();
        $cartItem->quantity = $request->input('quantity');
        $cartItem->calculatePrice();
        $cartItem->save();
        return $this->successResponse([], Response::HTTP_NO_CONTENT);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CartItem  $cartItem
     * @return \Illuminate\Http\Response
     */
    public function destroy(Cart $cart, Product $item)
    {
        $cartItem = $cart->items()->findOrFail($item->id)->first();
        $cartItem->delete();
        return $this->successResponse([], Response::HTTP_NO_CONTENT);
    }
}
