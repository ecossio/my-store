<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Cart\CartController;
use App\Http\Controllers\Api\V1\Cart\CartItemController;
use App\Http\Controllers\Api\V1\User\UserController;
use App\Http\Controllers\Api\V1\Product\ProductController;
use App\Http\Controllers\Api\V1\Category\CategoryController;
use App\Http\Controllers\Api\V1\Customer\CustomerWishlistController;
use App\Http\Controllers\Api\V1\Product\ProductCategoryController;
use App\Http\Controllers\Api\V1\RegisterController;

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
Route::post('auth/register', [RegisterController::class, 'store']);
Route::name('auth.password.forgot')->post('auth/password-forgot', 'App\Http\Controllers\Api\V1\ForgotPasswordController@forgot');
Route::name('auth.password.reset')->put('auth/password-reset', 'App\Http\Controllers\Api\V1\ResetPasswordController@doReset');

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
    Route::delete('wishlists/{id}', [CustomerWishlistController::class, 'destroy']);

    Route::group(['prefix' => 'carts'], function () {
        Route::post('', [CartController::class, 'store'])->name('cart.store');
        Route::get('{cart}', [CartController::class, 'show'])->name('cart.show');
        Route::put('{cart}', [CartController::class, 'update'])->name('cart.update');
        Route::delete('{cart}', [CartController::class, 'destroy'])->name('cart.destroy');

        Route::post('{cart}/items', [CartItemController::class, 'store'])->name('cart.items.store');
        Route::put('{cart}/items/{item}', [CartItemController::class, 'update'])->name('cart.items.update');
        Route::delete('{cart}/items/{item}', [CartItemController::class, 'destroy'])->name('cart.items.destroy');
        // Route::post('{cart}/discount', [CheckoutDiscountController::class, 'store'])->name('cart.discount');
    });
});
