<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'description' => $this->faker->paragraph(1),
            'stock' => $this->faker->numberBetween(1, 10),
            'unit_price' => $this->faker->randomFloat(2,1,50000),
            'status' => $this->faker->randomElement([Product::PRODUCT_AVAILABLE, Product::PRODUCT_NOT_AVAILABLE]),
            'thumbnail' => 'https://source.unsplash.com/random',
        ];
    }
}
