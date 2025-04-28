<?php

namespace App\Repositories;

use App\Models\Project;
use App\Models\ProjectTask;
use App\Repositories\Contracts\ProjectTaskRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class ProjectTaskRepository implements ProjectTaskRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function findAll()
    {
        return ProjectTask::query()
            ->with(['project', 'user'])
            ->latest('created_at')
            ->paginate(20);
    }

    public function findByProjectModel(Project $project)
    {
        $filters = [
            'user_id' => Auth::user()->roles->pluck('name')?->first() === 'employee' ? Auth::id() : null,
        ];

        return ProjectTask::query()
            ->with(['project', 'user'])
            ->where('project_id', $project->id)
            ->when(
                $filters['user_id'],
                fn($query, $user_id) =>
                $query->where('user_id', $user_id)
            )
            ->latest('created_at')
            ->paginate(20);
    }

    public function findById(int $id)
    {
        return ProjectTask::find($id);
    }

    public function findByModel(ProjectTask $task)
    {
        return ProjectTask::find($task->id);
    }

    public function create(array $data)
    {
        return ProjectTask::create($data);
    }

    public function update(int $id, array $data)
    {
        return tap(ProjectTask::find($id))->update($data);
    }

    public function delete(int $id)
    {
        return tap(ProjectTask::find($id))->delete();
    }

    public function updateByModel(ProjectTask $task, array $data)
    {
        return tap($task)->update($data);
    }

    public function deleteByModel(ProjectTask $task)
    {
        return tap($task)->delete();
    }
}
