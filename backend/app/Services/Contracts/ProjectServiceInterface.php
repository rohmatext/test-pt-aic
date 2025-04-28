<?php

namespace App\Services\Contracts;

use App\Enums\ProjectStatusesEnum;
use App\Models\Project;

interface ProjectServiceInterface
{
    public function getAllProjects();

    public function getProjectById(int $userId);

    public function getProjectDetail(Project $project);

    public function createProject(array $data);

    public function updateProject(Project $project, array $data);

    public function updateProjectStatus(Project $project, ProjectStatusesEnum $status);

    public function deleteProject(Project $project);
}
