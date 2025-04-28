<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function __construct(private UserService $userService = new UserService())
    {
        //
    }

    public function index(): JsonResponse
    {
        $users = $this->userService->getAllUsers();

        return UserResource::collection($users)
            ->additional([
                'message' => 'Users retrieved successfully',
            ])
            ->response()
            ->setStatusCode(200);
    }

    public function show(User $user): JsonResponse
    {
        return (new UserResource($this->userService->getUserDetail($user)))
            ->additional([
                'message' => 'User retrieved successfully',
            ])
            ->response()
            ->setStatusCode(200);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $created = $this->userService->createUser($request->validated());
            DB::commit();

            return (new UserResource($created))
                ->additional([
                    'message' => 'User created successfully',
                ])
                ->response()
                ->setStatusCode(201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        try {
            DB::beginTransaction();
            $updated = $this->userService->updateUser($user, $request->validated());
            DB::commit();

            return (new UserResource($updated))
                ->additional([
                    'message' => 'User updated successfully',
                ])
                ->response()
                ->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(User $user): JsonResponse
    {
        abort_if($user->id === Auth::user()->id, 403, 'You cannot delete your own account');

        try {
            DB::beginTransaction();
            $deleted = $this->userService->deleteUser($user);
            DB::commit();

            return (new UserResource($deleted))
                ->additional([
                    'message' => 'User deleted successfully',
                ])
                ->response()
                ->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
