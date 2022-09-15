<?php

namespace App\Http\Controllers\Api\V1\Cart;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Requests\CartCreateRequest;
use App\Http\Controllers\Api\ApiController;

class CartController extends ApiController
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\CartCreateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CartCreateRequest $request)
    {
        $user = $request->user();
        $cart = Cart::whereCustomerId($user->id)->first();

        if (!$cart) {
            $cart = Cart::create(['customer_id' => $user->id]);
        }

        return $this->successResponse(['data' => $cart], Response::HTTP_OK);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Cart  $cart
     * @return \Illuminate\Http\Response
     */
    public function show(Cart $cart)
    {
        return $this->successResponse(['data' => $cart], Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Cart  $cart
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Cart $cart)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Cart  $cart
     * @return \Illuminate\Http\Response
     */
    public function destroy(Cart $cart)
    {
        $cart->delete();
        return $this->successResponse([], Response::HTTP_NO_CONTENT);
    }
}
