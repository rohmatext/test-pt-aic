<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectTask\StoreProjectTaskRequest;
use App\Http\Requests\ProjectTask\UpdateProjectTaskRequest;
use App\Http\Resources\ProjectTaskResource;
use App\Models\Project;
use App\Models\ProjectTask;
use App\Services\Contracts\ProjectTaskServiceInterface;
use App\Services\ProjectTaskService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectTaskController extends Controller
{
    public function __construct(
        private ProjectTaskServiceInterface $projectTaskService = new ProjectTaskService()
    ) {
        //
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Project $project)
    {
        return ProjectTaskResource::collection($this->projectTaskService->getTaskByProjectModel($project))
            ->additional([
                'message' => 'Project tasks retrieved successfully',
            ])
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Project $project, StoreProjectTaskRequest $request)
    {
        try {
            DB::beginTransaction();
            $task = $this->projectTaskService->createTask([
                'project_id' => $project->id,
                ...$request->validated()
            ]);
            DB::commit();

            return (new ProjectTaskResource($task))
                ->additional([
                    'message' => 'Project task added successfully',
                ])
                ->response()
                ->setStatusCode(201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to add project task',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Project $project, ProjectTask $task)
    {
        abort_if($task->project_id !== $project->id, 403, 'You are not authorized to view this project task');

        return (new ProjectTaskResource($task))
            ->additional([
                'message' => 'Project task retrieved successfully',
            ])
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Project $project, ProjectTask $task, UpdateProjectTaskRequest $request)
    {
        abort_if($task->project_id !== $project->id, 403, 'You are not authorized to update this project task');

        try {
            DB::beginTransaction();
            $updated = $this->projectTaskService->updateTask($task, $request->validated());
            DB::commit();

            return (new ProjectTaskResource($updated))
                ->additional([
                    'message' => 'Project task updated successfully',
                ])
                ->response()
                ->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update project task',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, ProjectTask $task)
    {
        abort_if($task->project_id !== $project->id, 403, 'You are not authorized to remove this project task');

        try {
            DB::beginTransaction();
            $deleted = $this->projectTaskService->deleteTask($task);
            DB::commit();

            return (new ProjectTaskResource($deleted))
                ->additional([
                    'message' => 'Project task removed successfully',
                ])
                ->response()
                ->setStatusCode(200);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to remove project task',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
