<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\User\UserController;
use App\Http\Controllers\Api\V1\Product\ProductController;
use App\Http\Controllers\Api\V1\Category\CategoryController;
use App\Http\Controllers\Api\V1\Customer\CustomerWishlistController;
use App\Http\Controllers\Api\V1\Product\ProductCategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('auth/login', [AuthController::class, 'login']);
Route::get('categories', [CategoryController::class, 'index']);
Route::apiResource('products', ProductController::class, ['only' => ['index', 'show']]);
Route::get('products.categories', [ProductCategoryController::class, 'index']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);

    Route::get('users/me', [UserController::class, 'me']);
    Route::group(['prefix' => 'users/{user}'], function () {
        Route::match(['put', 'patch'], 'update_profile', [UserController::class, 'update']);
        Route::match(['put', 'patch'], 'update_password', [UserController::class, 'updatePassword']);
        Route::match(['put', 'patch'], 'update_email', [UserController::class, 'updateEmail']);
        Route::post('update_profile_picture', [UserController::class, 'updateProfilePicture']);
    });

    Route::apiResource('products', ProductController::class, ['except' => ['index', 'show']]);
    Route::apiResource('wishlists', CustomerWishlistController::class, ['only' => ['index', 'store']]);
    Route::delete('wishlists/{product}', [CustomerWishlistController::class, 'destroy']);
});
