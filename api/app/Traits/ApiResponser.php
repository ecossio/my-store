<?php

namespace App\Traits;

trait ApiResponser
{
    // Función para retornar una respuesta exitosa
    protected function successResponse($data, $code)
    {
        return response()->json($data, $code);
    }

    // Función para retornar una respuesta de error
    protected function errorResponse($message, $code)
    {
        return response()->json(['error' => $message, 'code' => $code], $code);
    }

    // Función para retornar un mensaje
    protected function showMessage($message, $code = 200)
    {
        return $this->successResponse(['message' => $message, 'code' => $code], $code);
    }
}
