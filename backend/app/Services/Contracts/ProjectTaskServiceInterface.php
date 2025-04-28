<?php

namespace App\Services\Contracts;

use App\Models\Project;
use App\Models\ProjectTask;

interface ProjectTaskServiceInterface
{
    public function getAllTasks();
    public function getTaskByProjectModel(Project $project);
    public function createTask(array $data);
    public function updateTask(ProjectTask $task, array $data);
    public function deleteTask(ProjectTask $task);
}
