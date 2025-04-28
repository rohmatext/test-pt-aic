<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectTask;
use App\Repositories\Contracts\ProjectTaskRepositoryInterface;
use App\Repositories\ProjectTaskRepository;
use App\Services\Contracts\ProjectTaskServiceInterface;
use Illuminate\Support\Facades\Auth;

class ProjectTaskService implements ProjectTaskServiceInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private ProjectTaskRepositoryInterface $projectTaskRepository = new ProjectTaskRepository()
    ) {
        //
    }

    public function getAllTasks()
    {
        return $this->projectTaskRepository->findAll();
    }

    public function getTaskByProjectModel(Project $project)
    {
        return $this->projectTaskRepository->findByProjectModel($project);
    }

    public function createTask(array $data)
    {
        return $this->projectTaskRepository->create([
            'user_id' => Auth::id(),
            'project_id' => $data['project_id'],
            'description' => $data['description'],
            'task_date' => $data['task_date'],
            'hours' => $data['hours'],
        ]);
    }

    public function updateTask(ProjectTask $task, array $data)
    {
        return $this->projectTaskRepository->updateByModel($task, [
            'description' => $data['description'],
            'task_date' => $data['task_date'],
            'hours' => $data['hours'],
        ]);
    }

    public function deleteTask(ProjectTask $task)
    {
        return $this->projectTaskRepository->deleteByModel($task);
    }
}
