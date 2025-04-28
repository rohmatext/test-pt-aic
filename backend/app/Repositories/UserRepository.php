<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function findAll(array $filters)
    {
        return User::query()
            ->with('roles')
            ->when(
                $filters['search'],
                fn($query, $search) => $query->whereAny(['name', 'email'], 'like', "%{$search}%")
            )
            ->when(
                $filters['role'],
                fn($query, $role) => $query->role($role)
            )
            ->latest('created_at')
            ->paginate(20);
    }

    public function findById(int $id)
    {
        return User::find($id);
    }

    public function findByModel(User $user)
    {
        return $user;
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(int $id, array $data)
    {
        return tap(User::find($id))->update($data);
    }

    public function updateByModel(User $user, array $data)
    {
        return tap($user)->update($data);
    }

    public function deleteByModel(User $user)
    {
        return tap($user)->delete();
    }

    public function delete(int $id)
    {
        return tap(User::find($id))->delete();
    }
}
