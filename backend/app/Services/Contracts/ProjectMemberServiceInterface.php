<?php

namespace App\Services\Contracts;

use App\Models\Project;
use Illuminate\Http\Request;

interface ProjectMemberServiceInterface
{
    public function getAllMembers(Project $project);

    public function addMember(Project $project, Request $request);

    public function removeMember(Project $project, $userId);
}
