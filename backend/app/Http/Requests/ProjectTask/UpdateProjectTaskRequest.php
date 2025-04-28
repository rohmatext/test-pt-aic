<?php

namespace App\Http\Requests\ProjectTask;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateProjectTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = Auth::user();
        return in_array($user->roles->pluck('name')->first(), ['admin', 'manager']) || $user->id === $this->route('task')->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'task_date' => ['required', 'date', 'date_format:Y-m-d', 'before_or_equal:today'],
            'hours' => ['required', 'numeric', 'min:1', 'max:24'],
            'description' => ['required', 'string', 'max:255'],
        ];
    }
}
