<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserProfileResourse extends JsonResource
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
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'profile_picture' => $this->profile_picture ? asset("storage/profile_pictures/{$this->profile_picture}") : null,
            'wishlist' => ['total_wishes' => $this->totalWishes(), 'items' => ItemWishlistResource::collection($this->wishes())]
        ];
    }
}
