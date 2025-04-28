<?php

namespace App\Services;

use App\Enums\RolesEnum;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\UserRepository;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Support\Facades\Hash;

class UserService implements UserServiceInterface
{
    public function __construct(
        private UserRepositoryInterface $userRepository = new UserRepository()
    ) {
        //
    }


    public function getAllUsers()
    {
        $filters = [
            'search' => request('search'),
            'role' => RolesEnum::tryFrom(request('role'))?->value,
        ];

        return $this->userRepository->findAll($filters);
    }

    public function getUserById(int $id)
    {
        return $this->userRepository->findById($id);
    }

    public function getUserDetail(User $user)
    {
        return $this->userRepository->findByModel($user);
    }

    public function createUser(array $data)
    {
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make('password'),
        ]);

        $user->assignRole($data['role']);

        return $user;
    }

    public function updateUser(User $user, array $data)
    {
        return $this->userRepository->updateByModel($user, [
            'name' => $data['name'],
            'email' => $data['email'],
        ]);
    }

    public function deleteUser(User $user)
    {
        return $this->userRepository->deleteByModel($user);
    }

    public function changeUserPassword(User $user, array $data)
    {
        return $this->userRepository->updateByModel($user, [
            'password' => Hash::make($data['password']),
        ]);
    }
}
