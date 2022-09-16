<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\Api\ApiController;

class ResetPasswordController extends ApiController
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Reset the given user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function doReset(Request $request)
    {
        $credentials = request()->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|confirmed'
        ]);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $response = Password::reset($credentials, function ($user, $password) {
            $user->password = bcrypt($password);
            $user->save();
        });

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        switch ($response) {
            case Password::INVALID_TOKEN:
                $message = 'Token invalido';
                $code = 403;
                break;
            case Password::INVALID_USER:
                $message = "{$request->input('email')} no corresponde al token";
                $code = 409;
                break;
            case Password::PASSWORD_RESET:
                $message = 'Tu contraseña ha sido actualizada';
                $code = 200;
                break;
            default:
                $message = 'Error inesperado';
                $code = 500;
                break;
        }

        return $code == 200
            ? $this->successResponse(['message' => $message], $code)
            : $this->errorResponse($message, $code);
    }
}
