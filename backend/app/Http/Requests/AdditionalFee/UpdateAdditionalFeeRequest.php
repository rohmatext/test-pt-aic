<?php

namespace App\Http\Requests\AdditionalFee;

use App\Models\Project;
use App\Models\ProjectMember;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdditionalFeeRequest extends FormRequest
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
            'project_id' => ['required', Rule::exists(Project::class, 'id')],
            'user_id' => ['nullable', Rule::exists(ProjectMember::class, 'user_id')->where('project_id', $this->route('project')->id)],
            'description' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:1000', 'max:10000000'],
        ];
    }
}
