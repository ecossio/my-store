<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "description" => $this->description,
            "stock" => (int)$this->stock,
            "price" => (float)$this->price,
            "status" => $this->status,
            "categories" => CategoryResource::collection($this->categories),
            "images" => [$this->thumbnail]
        ];
    }
}
