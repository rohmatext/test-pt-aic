<?php

namespace App\Repositories;

use App\Models\AdditionalFee;
use App\Models\Project;
use App\Models\User;
use App\Repositories\Contracts\AdditionalFeeRepositoryInterface;

class AdditionalFeeRepository implements AdditionalFeeRepositoryInterface
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
        return AdditionalFee::query()->where('project_id', $filters['project_id'])->with('user')->paginate(20);
    }

    public function findByUser(User $user)
    {
        return AdditionalFee::where('user_id', $user->id)->paginate(20);
    }

    public function findByProject(Project $project)
    {
        return AdditionalFee::where('project_id', $project->id)->paginate(20);
    }

    public function create(array $data)
    {
        return AdditionalFee::create($data);
    }

    public function update(AdditionalFee $additionalFee, array $data)
    {
        return tap($additionalFee)->update($data);
    }

    public function delete(AdditionalFee $additionalFee)
    {
        return tap($additionalFee)->delete();
    }
}
