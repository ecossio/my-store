<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $this->validateLogin($request);
        if (Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'access_token' => $request->user()->createToken($request->email)->plainTextToken,
                'message' => 'success'
            ]);
        }

        return response()->json([
            'message' => 'Unauthorized'
        ], Response::HTTP_UNAUTHORIZED);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $tokenId = explode('|', $request->bearerToken())[0];
            $user->tokens()->where('id', $tokenId)->delete();
        }

        return response()->json([], 204);
    }

    public function validateLogin(Request $request)
    {
        return $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            // 'name' => 'required'
        ]);
    }
}
