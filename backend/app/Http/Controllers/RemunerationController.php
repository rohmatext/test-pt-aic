<?php

namespace App\Http\Controllers;

use App\Http\Resources\RemunerationResource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RemunerationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Project $project)
    {
        $project->load('tasks', 'additionalFees', 'members.user');

        $tasks = $project->tasks;
        $additionalFees = $project->additionalFees;
        $members = $project->members;

        $membersCount = $members->count();
        $groupAdditionalFeeTotal = $additionalFees->whereNull('user_id')->sum('amount');
        $groupAdditionalFeePerMember = $membersCount > 0 ? $groupAdditionalFeeTotal / $membersCount : 0;

        $remunerations = $members->map(function ($member) use ($tasks, $additionalFees, $membersCount, $groupAdditionalFeeTotal, $groupAdditionalFeePerMember) {
            $user = $member->user;
            $hourlyRate = $member->hourly_rate;
            $hoursSpent = $tasks->where('user_id', $user->id)->sum('hours');
            $baseFee = $hourlyRate * $hoursSpent;

            $userAdditionalFee = $additionalFees->where('user_id', $user->id)->sum('amount');
            $totalAdditionalFee = $userAdditionalFee + $groupAdditionalFeePerMember;

            return [
                'user_id' => $member->id,
                'user' => $user,
                'hourly_rate' => $hourlyRate,
                'hours_spent' => $hoursSpent,
                'base_fee' => $baseFee,
                'additional_fees' => [
                    'user' => number_format($userAdditionalFee, 2, '.', ''),
                    'group' => [
                        'member_count' => $membersCount,
                        'total' => number_format($groupAdditionalFeeTotal, 2, '.', ''),
                        'per_member' => number_format($groupAdditionalFeePerMember, 2, '.', ''),
                    ],
                    'total' => number_format($totalAdditionalFee, 2, '.', ''),
                ],
                'total_fee' => number_format($baseFee + $totalAdditionalFee, 2, '.', ''),
            ];
        });

        $project = $project->makeHidden('tasks', 'additionalFees', 'members');

        if (Auth::user()->roles->pluck('name')->first() === 'employee') {
            $remunerations = $remunerations->where('user.id', Auth::id());
            logger()->info('Remunerations for employee', [
                'user_id' => Auth::id(),
                'remunerations' => $remunerations->toArray(),
            ]);
        }

        $project->remunerations = $remunerations;

        return (new RemunerationResource($project))
            ->additional([
                'message' => 'Remunerations retrieved successfully',
            ])
            ->response()
            ->setStatusCode(200);
    }
}
