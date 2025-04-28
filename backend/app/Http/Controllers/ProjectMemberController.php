<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectMember\DestroyProjectMemberRequest;
use App\Http\Requests\ProjectMember\StoreProjectMemberRequest;
use App\Http\Resources\ProjectMemberResource;
use App\Models\Project;
use App\Services\Contracts\ProjectMemberServiceInterface;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectMemberController extends Controller
{
    public function __construct(
        private ProjectMemberServiceInterface $projectMemberService = new ProjectService()
    ) {
        //
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Project $project)
    {
        return ProjectMemberResource::collection($this->projectMemberService->getAllMembers($project))
            ->additional([
                'message' => 'Project members retrieved successfully',
            ])
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Project $project, StoreProjectMemberRequest $request)
    {
        try {
            DB::beginTransaction();
            $member = $this->projectMemberService->addMember($project, $request);
            DB::commit();

            return (new ProjectMemberResource($member))
                ->additional([
                    'message' => 'Project member added successfully',
                ])
                ->response()
                ->setStatusCode(201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to add project member',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, DestroyProjectMemberRequest $request)
    {
        try {
            DB::beginTransaction();
            $deleted = $this->projectMemberService->removeMember($project, $request->user_id);
            DB::commit();

            return (new ProjectMemberResource($deleted))
                ->additional([
                    'message' => 'Project member removed successfully',
                ])
                ->response()
                ->setStatusCode(200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to remove project member',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
