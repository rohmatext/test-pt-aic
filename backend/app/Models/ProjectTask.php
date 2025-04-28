<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectTask extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'user_id',
        'description',
        'task_date',
        'hours',
    ];

    protected function casts(): array
    {
        return [
            'task_date' => 'datetime:Y-m-d',
        ];
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
