<?php

namespace App\Exceptions;

use Throwable;
use App\Traits\ApiResponser;
use Illuminate\Database\QueryException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

class Handler extends ExceptionHandler
{
    use ApiResponser;

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $e
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        $reponse = $this->handleException($request, $exception);
        return $reponse;
    }

    public function handleException($request, Throwable $exception)
    {
        if ($request->is('api/*')) {
            if ($exception instanceof ValidationException) {
                return $this->convertValidationExceptionToResponse($exception, $request);
            }

            if ($exception instanceof ModelNotFoundException) {
                $model = strtolower(class_basename($exception->getModel()));
                return $this->errorResponse("No existe ninguna instancia de {$model} con el id especificado", 404);
            }

            if ($exception instanceof AuthenticationException) {
                return $this->unauthenticated($request, $exception);
            }

            if ($exception instanceof AuthorizationException) {
                return $this->errorResponse('No posee permisos para ejecutar esta acción', 403);
            }

            if ($exception instanceof NotFoundHttpException) {
                return $this->errorResponse('No se encontró el endpoint especificado', 404);
            }

            if ($exception instanceof MethodNotAllowedHttpException) {
                return $this->errorResponse('El método especificado en la petición no es válido', 405);
            }

            if ($exception instanceof HttpException) {
                $code = $exception->getCode() == 0 ? $exception->getStatusCode() : $exception->getCode();
                return $this->errorResponse($exception->getMessage(), $code);
            }

            if ($exception instanceof QueryException) {
                if (!config('app.debug')) {
                    $dbDriver = config('database')['default'];
                    $msgError = 'QueryException: Ocurrio un error al realizar la operación, por favor consulte a soporte.';

                    switch ($dbDriver) {
                        case 'mysql':
                            $codigoError = $exception->errorInfo[1];
                            // Integrity constraint violation
                            if ($codigoError == 1451) {
                                $msgError = 'No se puede eliminar de forma permanente el recurso porque está relacionado con algún otro.';
                            }
                            break;
                        case 'pgsql':

                            $codigoError = $exception->errorInfo[0];
                            // Integrity constraint violation
                            if ($codigoError == 23503) {
                                $msgError = 'No se puede eliminar de forma permanente el recurso porque está relacionado con algún otro.';
                            }
                            break;
                        case 'sqlsrv':
                            $codigoError = $exception->errorInfo[0];
                            if ($codigoError == '08001') {
                                $msgError = 'Estamos experimentando problemas. Intente de nuevo más tarde.';
                            }
                            break;
                    }

                    return $this->errorResponse($msgError, 409);
                }

                return parent::render($request, $exception);
            }
        }

        if (config('app.debug')) {
            return parent::render($request, $exception);
        }

        return $this->errorResponse('Falla inesperada. Intente de nuevo en unos minutos', 500);
    }

    /**
     * Convert an authentication exception into a response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Auth\AuthenticationException  $exception
     * @return \Illuminate\Http\Response
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return $this->errorResponse($exception->getMessage(), 401);
    }

    /**
     * Create a response object from the given validation exception.
     *
     * @param  \Illuminate\Validation\ValidationException  $e
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function convertValidationExceptionToResponse(ValidationException $e, $request)
    {
        $errors = $e->validator->errors()->getMessages();

        if (!$request->is('api/*')) {
            return $request->ajax() ? response()->json($errors, 422) : redirect()
                ->back()
                ->withInput($request->input())
                ->withErrors($errors);
        }

        return $this->errorResponse($errors, 422);
    }
}
