<?php

namespace App\Services;

use App\Models\AdditionalFee;
use App\Models\Project;
use App\Models\User;
use App\Repositories\AdditionalFeeRepository;
use App\Repositories\Contracts\AdditionalFeeRepositoryInterface;
use App\Services\Contracts\AdditionalFeeServiceInterface;

class AdditionalFeeService implements AdditionalFeeServiceInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private AdditionalFeeRepositoryInterface $additionalFeeRepository = new AdditionalFeeRepository()
    ) {
        //
    }

    public function getAdditionalFees()
    {
        $filters = [
            'project_id' => request('project_id'),
        ];

        return $this->additionalFeeRepository->findAll($filters);
    }

    public function getAdditionalFeesByUser(User $user)
    {
        return $this->additionalFeeRepository->findByUser($user);
    }

    public function getAdditionalFeesByProject(Project $project)
    {
        return $this->additionalFeeRepository->findByProject($project);
    }

    public function createAdditionalFee(array $data)
    {
        return $this->additionalFeeRepository->create([
            'project_id' => $data['project_id'],
            'user_id' => $data['user_id'],
            'description' => $data['description'],
            'amount' => $data['amount'],
        ]);
    }

    public function updateAdditionalFee(AdditionalFee $additionalFee, array $data)
    {
        return $this->additionalFeeRepository->update($additionalFee, [
            'project_id' => $data['project_id'],
            'user_id' => $data['user_id'],
            'description' => $data['description'],
            'amount' => $data['amount'],
        ]);
    }

    public function deleteAdditionalFee(AdditionalFee $additionalFee)
    {
        return $this->additionalFeeRepository->delete($additionalFee);
    }
}
