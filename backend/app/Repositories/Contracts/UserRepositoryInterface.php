<?php

namespace App\Repositories\Contracts;

use App\Models\User;

interface UserRepositoryInterface
{
    public function findAll(array $filters);

    public function findById(int $id);

    public function findByModel(User $user);

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);

    public function updateByModel(User $user, array $data);

    public function deleteByModel(User $user);
}
