<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\ApiController;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends ApiController
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
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
     * Send a reset link to the given user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function forgot(Request $request)
    {
        $rules = [
            'email' => 'required|email',
            'redirect_url' => 'required|url'
        ];
        $this->validate($request, $rules);

        // $this->validateEmail($request);

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        // $response = $this->broker()->sendResetLink(
        //     $this->credentials($request)
        // );

        $credentials = request()->validate(['email' => 'required|email']);
        $response = Password::sendResetLink($credentials);

        switch ($response) {
            case Password::RESET_THROTTLED:
                $message = 'Espere un minuto y vuelva a intentarlo';
                $code = 409;
                break;
            case Password::INVALID_USER:
                $message = "No hay ninguna cuenta asociada con {$request->input('email')}";
                $code = 404;
                break;
            case Password::RESET_LINK_SENT:
                $message = '¡Notificación de recuperación de contraseña enviada!';
                $code = 200;
                break;
            default:
                $message = 'No hemos podido enviar el correo de recuperación de contraseña';
                $code = 409;
                break;
        }

        $code = 200;
        return $code == 200
            ? $this->successResponse(['message' => $message], $code)
            : $this->errorResponse($message, $code);
    }
}
