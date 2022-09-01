<?php

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post('sanctum/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();

        if ($request->expectsJson()) {
            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        }
        return new Response('', Response::HTTP_NO_CONTENT);
    }

    if ($request->expectsJson()) {
        return new JsonResponse(['message' => 'Credenciales incorrectas'], Response::HTTP_UNAUTHORIZED);
    }
    return new Response(['message' => 'Credenciales incorrectas'], Response::HTTP_UNAUTHORIZED);
});

Route::post('sanctum/logout', function (Request $request) {
    Auth::guard('web')->logout();

    if ($request->expectsJson()) {
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    return new Response('', Response::HTTP_NO_CONTENT);
});
