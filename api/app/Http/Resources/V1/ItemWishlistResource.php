<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Resources\Json\JsonResource;

class ItemWishlistResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $product = $this->product;
        return [
            'id' => $product->id,
            "name" => $product->name,
            "description" => $product->description,
            "price" => (float)$product->price,
            "images" => ["https://source.unsplash.com/random"]
        ];
    }
}
