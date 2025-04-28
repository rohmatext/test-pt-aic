<?php

namespace App\Repositories\Contracts;

use App\Models\Project;
use App\Models\ProjectTask;

interface ProjectTaskRepositoryInterface
{
    public function findAll();

    public function findByProjectModel(Project $project);

    public function findById(int $id);

    public function findByModel(ProjectTask $task);

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);

    public function updateByModel(ProjectTask $task, array $data);

    public function deleteByModel(ProjectTask $task);
}
