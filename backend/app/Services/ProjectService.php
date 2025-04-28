<?php

namespace App\Services;

use App\Enums\ProjectStatusesEnum;
use App\Models\Project;
use App\Repositories\Contracts\ProjectMemberRepositoryInterface;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Repositories\ProjectRepository;
use App\Services\Contracts\ProjectMemberServiceInterface;
use App\Services\Contracts\ProjectServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectService implements ProjectServiceInterface, ProjectMemberServiceInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private ProjectRepositoryInterface $projectRepository = new ProjectRepository(),
        private ProjectMemberRepositoryInterface $projectMemberRepository = new ProjectRepository()
    ) {
        //
    }

    public function getAllProjects()
    {
        $filters = [
            'search' => request('search'),
            'status' => ProjectStatusesEnum::tryFrom(request('status'))?->value,
            'member_id' => Auth::user()->roles->pluck('name')?->first() === 'employee' ? Auth::id() : null,
        ];

        return $this->projectRepository->findAll($filters);
    }

    public function getProjectById(int $id)
    {
        return $this->projectRepository->findById($id);
    }

    public function getProjectDetail(Project $project)
    {
        return $this->projectRepository->findByModel($project);
    }

    public function createProject(array $data)
    {
        return $this->projectRepository->create([
            'user_id' => Auth::id(),
            'title' => $data['title'],
            'description' => $data['description'],
            'status' => ProjectStatusesEnum::ON_GOING,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
        ]);
    }

    public function updateProject(Project $project, array $data)
    {
        return $this->projectRepository->updateByModel($project, [
            'title' => $data['title'],
            'description' => $data['description'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
        ]);
    }

    public function updateProjectStatus(Project $project, ProjectStatusesEnum $status)
    {
        return $this->projectRepository->updateByModel($project, [
            'status' => $status->value,
        ]);
    }

    public function deleteProject(Project $project)
    {
        return $this->projectRepository->deleteByModel($project);
    }


    public function getAllMembers(Project $project)
    {
        return $this->projectMemberRepository->findAllMembers($project);
    }

    public function addMember(Project $project, Request $request)
    {
        $userService = new UserService();
        $user = $userService->getUserById($request->user_id);

        return $this->projectMemberRepository->createMember($project, $user, [
            'hourly_rate' => $request->hourly_rate
        ]);
    }

    public function removeMember(Project $project, $userId)
    {
        $userService = new UserService();
        $user = $userService->getUserById($userId);

        return $this->projectMemberRepository->deleteMember($project, $user);
    }
}
