<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\V1\UserProfileResourse;
use Illuminate\Support\Facades\Hash;

class UserController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $rules = [
            'first_name' => 'required|nullable|max:255',
            'last_name' => 'required|nullable|max:255',
        ];

        $this->validate($request, $rules);

        if ($user->first_name != $request->input('first_name')) {
            $user->first_name = $request->input('first_name');
        }

        if ($user->last_name != $request->input('last_name')) {
            $user->last_name = $request->input('last_name');
        }

        if ($user->isDirty()) {
            $user->save();
        }

        return new UserProfileResourse($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }

    /**
     * Obtiene los datos del usuario autenticado
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function me(Request $request)
    {
        $user = $request->user();
        // $user->totalWishes();

        return new UserProfileResourse($user);
        // return response()->json($user, Response::HTTP_OK);
    }

    /**
     * Updates the user email
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function updateEmail(Request $request, User $user)
    {
        $rules = [
            'email' => "required|email|confirmed|unique:users,email,{$user->id}",
            'password' => 'string|required'
        ];

        $this->validate($request, $rules);

        if (Hash::check($request->input('password'), $user->password)) {
            $user->email = $request->input('email');
            $user->save();
        } else {
            return $this->errorResponse('Password incorrect', 401);
        }

        return $this->showMessage('Email updated');
    }

    /**
     * Updates the user password
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function updatePassword(Request $request, User $user)
    {
        $rules = [
            'password' => 'string|required|confirmed',
            'current_password' => 'string|required'
        ];

        $this->validate($request, $rules);

        if (Hash::check($request->input('current_password'), $user->password)) {
            $user->password = bcrypt($request->password);
            $user->save();
        } else {
            return $this->errorResponse('Current password is incorrect', 401);
        }

        return $this->showMessage('Password updated');
    }
}
