<?php

namespace App\Http\Controllers\Api\V1\Customer;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\V1\ItemWishlistResource;

class CustomerWishlistController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $wishlist = $user->wishes();
        return ItemWishlistResource::collection($wishlist);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, array(
            'product_id' => 'required',
        ));

        $customer = $request->user();
        $product_id = $request->input('product_id');
        $wishlist = $customer->wish($product_id);

        return new ItemWishlistResource($wishlist);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  integer  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $user->unwish($id);
        return $this->showMessage('Producto eliminado correctamente.');
    }
}
