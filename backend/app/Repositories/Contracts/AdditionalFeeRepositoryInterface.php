<?php

namespace App\Repositories\Contracts;

use App\Models\AdditionalFee;
use App\Models\Project;
use App\Models\User;

interface AdditionalFeeRepositoryInterface
{
    public function findAll(array $filters);

    public function findByUser(User $user);

    public function findByProject(Project $project);

    public function create(array $data);

    public function update(AdditionalFee $additionalFee, array $data);

    public function delete(AdditionalFee $additionalFee);
}
