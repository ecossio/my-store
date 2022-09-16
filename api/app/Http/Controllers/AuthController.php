<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
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
            return new JsonResponse(['message' => 'Credenciales incorrectas'], Response::HTTP_FORBIDDEN);
        }
        return new Response(['message' => 'Credenciales incorrectas'], Response::HTTP_FORBIDDEN);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        if ($request->expectsJson()) {
            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        }

        return new Response('', Response::HTTP_NO_CONTENT);
    }
}
