<?php

namespace App\Http\Controllers;

use App\Enums\ProjectStatusesEnum;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Requests\Project\UpdateProjectStatusRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Services\Contracts\ProjectServiceInterface;
use App\Services\ProjectService;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    public function __construct(
        private ProjectServiceInterface $projectService = new ProjectService()
    ) {
        //
    }
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $projects = $this->projectService->getAllProjects();

        return ProjectResource::collection($projects)
            ->additional([
                'message' => 'Projects retrieved successfully',
            ])
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $created = $this->projectService->createProject($request->validated());
            DB::commit();

            return (new ProjectResource($created))
                ->additional([
                    'message' => 'Project created successfully',
                ])
                ->response()
                ->setStatusCode(201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create project',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): JsonResponse
    {
        return (new ProjectResource($this->projectService->getProjectDetail($project)))
            ->additional([
                'message' => 'Project retrieved successfully',
            ])
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        try {
            DB::beginTransaction();
            $updated = $this->projectService->updateProject($project, $request->validated());
            DB::commit();

            return (new ProjectResource($updated))
                ->additional([
                    'message' => 'Project updated successfully',
                ])
                ->response()
                ->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to load project members',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateStatus(UpdateProjectStatusRequest $request, Project $project)
    {
        try {
            DB::beginTransaction();
            $updated = $this->projectService->updateProjectStatus($project, ProjectStatusesEnum::from($request->status));
            DB::commit();

            return (new ProjectResource($updated))
                ->additional([
                    'message' => 'Project status updated successfully',
                ])
                ->response()
                ->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update project status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): JsonResponse
    {
        abort_if(in_array($project->status, [ProjectStatusesEnum::COMPLETED, ProjectStatusesEnum::CANCELLED]), 403, 'You cannot delete a completed or cancelled project');
        abort_if($project->members()->count() > 0, 403, 'You cannot delete a project with members');

        DB::beginTransaction();
        try {
            $deleted = $this->projectService->deleteProject($project);
            DB::commit();

            return (new ProjectResource($deleted))
                ->additional([
                    'message' => 'Project deleted successfully',
                ])
                ->response()
                ->setStatusCode(200);
        } catch (\Exception $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete project',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
