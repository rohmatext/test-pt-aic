<?php

namespace App\Http\Requests\ProjectMember;

use App\Enums\RolesEnum;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectMemberRequest extends FormRequest
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
            'user_id' => [
                'required',
                Rule::unique(ProjectMember::class)->where('project_id', $this->route('project')->id),
                function ($attribute, $value, $fail) {
                    if (!User::where('id', $value)->role(RolesEnum::EMPLOYEE->value)->exists()) {
                        return $fail(__('validation.exists', ['attribute' => str($attribute)->replace('_', ' ')]));
                    }
                }
            ],
            'hourly_rate' => ['required', 'numeric', 'min:1000', 'max:10000000'],
        ];
    }
}
