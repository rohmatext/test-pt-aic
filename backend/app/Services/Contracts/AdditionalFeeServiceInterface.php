<?php

namespace App\Services\Contracts;

use App\Models\AdditionalFee;
use App\Models\Project;
use App\Models\User;

interface AdditionalFeeServiceInterface
{
    public function createAdditionalFee(array $data);

    public function updateAdditionalFee(AdditionalFee $additionalFee, array $data);

    public function deleteAdditionalFee(AdditionalFee $additionalFee);

    public function getAdditionalFees();

    public function getAdditionalFeesByUser(User $user);

    public function getAdditionalFeesByProject(Project $project);
}
