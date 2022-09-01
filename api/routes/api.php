<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\LoginController;
use App\Http\Controllers\Api\V1\Product\ProductController;
use App\Http\Controllers\Api\V1\Category\CategoryController;
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

Route::middleware('auth:sanctum')->get('/auth/me', function (Request $request) {
    return $request->user();
});

Route::post('auth/login', [LoginController::class, 'login']);
Route::middleware('auth:sanctum')->post('auth/logout', [LoginController::class, 'logout']);

Route::get('categories', [CategoryController::class, 'index']);
Route::apiResource('categories', CategoryController::class, ['except' => ['index']])->middleware('auth:sanctum');

// Route::get('products', [ProductController::class, 'index']);
Route::apiResource('products', ProductController::class, ['only' => ['index', 'show']]);
Route::apiResource('products', ProductController::class, ['except' => ['index', 'show']])->middleware('auth:sanctum');

Route::get('products.categories', [ProductCategoryController::class, 'index']);
// Route::resource('products.categories', ProductCategoryController::class, ['only' => ['index', 'update', 'destroy']]);
