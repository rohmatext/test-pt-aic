<?php

namespace App\Repositories\Contracts;

use App\Models\Project;

interface ProjectRepositoryInterface
{
    public function findAll(array $filters);

    public function findById(int $id);

    public function findByModel(Project $project);

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);

    public function updateByModel(Project $project, array $data);

    public function deleteByModel(Project $project);
}
