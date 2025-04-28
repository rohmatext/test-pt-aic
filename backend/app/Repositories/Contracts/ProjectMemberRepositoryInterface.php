<?php

namespace App\Repositories\Contracts;

use App\Models\Project;
use App\Models\User;

interface ProjectMemberRepositoryInterface
{
    public function findAllMembers(Project $project);

    public function createMember(Project $project, User $user, array $data);

    public function deleteMember(Project $project, User $user);
}
