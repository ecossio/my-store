<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $this->validateLogin($request);
        if (Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'access_token' => $request->user()->createToken($request->email)->plainTextToken,
                'message' => 'success'
            ], Response::HTTP_OK);
        }

        return response()->json([
            'message' => 'Credenciales incorrectas'
        ], Response::HTTP_UNAUTHORIZED);
    }

    public function logout(Request $request)
    {
        $user = $request->user;
        if ($user) {
            $user->currentAccessToken()->delete();
        }

        return response()->json([], Response::HTTP_NO_CONTENT);
    }

    public function validateLogin(Request $request)
    {
        return $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    }
}
