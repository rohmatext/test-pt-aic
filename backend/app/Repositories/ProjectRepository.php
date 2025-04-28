<?php

namespace App\Repositories;

use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use App\Repositories\Contracts\ProjectMemberRepositoryInterface;
use App\Repositories\Contracts\ProjectRepositoryInterface;

class ProjectRepository implements ProjectRepositoryInterface, ProjectMemberRepositoryInterface
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
        logger()->info($filters);
        return Project::query()
            ->when(
                $filters['search'],
                fn($query, $search) => $query->whereAny(['title', 'description'], 'like', "%{$search}%")
            )
            ->when(
                $filters['status'],
                fn($query, $status) => $query->where('status', $status)
            )
            ->when(
                $filters['member_id'],
                fn($query, $user_id) => $query->whereHas('members', fn($query) => $query->where('user_id', $user_id))
            )
            ->latest('created_at')
            ->paginate(20);
    }

    public function findById(int $id)
    {
        return Project::find($id);
    }

    public function findByModel(Project $project)
    {
        return $project;
    }

    public function create(array $data)
    {
        return Project::create($data);
    }

    public function update(int $id, array $data)
    {
        return tap(Project::find($id))->update($data);
    }

    public function updateByModel(Project $project, array $data)
    {
        return tap($project)->update($data);
    }

    public function deleteByModel(Project $project)
    {
        return tap($project)->delete();
    }

    public function delete(int $id)
    {
        return tap(Project::find($id))->delete();
    }

    public function createMember(Project $project, User $user, array $data)
    {
        return ProjectMember::create(array_merge($data, ['project_id' => $project->id, 'user_id' => $user->id]));
    }

    public function deleteMember(Project $project, User $user)
    {
        return tap(ProjectMember::where('project_id', $project->id)
            ->where('user_id', $user->id)
            ->first())
            ->delete();
    }

    public function findAllMembers(Project $project)
    {
        return ProjectMember::query()
            ->with(['user', 'project'])
            ->where('project_id', $project->id)
            ->get();
    }
}
