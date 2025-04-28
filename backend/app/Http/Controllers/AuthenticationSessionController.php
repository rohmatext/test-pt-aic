<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthenticationSessionController extends Controller
{
    public function store(LoginRequest $request): JsonResponse
    {
        $token = $request->user()->createToken('api');

        return response()->json([
            'message' => 'Successfully logged in',
            'token' => $token->plainTextToken
        ]);
    }


    public function destroy(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }
}
