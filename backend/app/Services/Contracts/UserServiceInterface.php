<?php

namespace App\Services\Contracts;

use App\Models\User;

interface UserServiceInterface
{
    public function getAllUsers();

    public function getUserDetail(User $user);

    public function createUser(array $data);

    public function updateUser(User $user, array $data);

    public function deleteUser(User $user);

    public function changeUserPassword(User $user, array $data);
}
