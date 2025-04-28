<?php

namespace App\Http\Requests\ProjectTask;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
