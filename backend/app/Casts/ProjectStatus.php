<?php

namespace App\Casts;

use App\Enums\ProjectStatusesEnum;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class ProjectStatus implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return ProjectStatusesEnum::from($value);
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if (is_string($value) && ProjectStatusesEnum::tryFrom($value) === null) {
            throw new \InvalidArgumentException("Invalid project status: $value");
        }

        if ($value instanceof ProjectStatusesEnum) {
            $value = $value->value;
        }

        return $value;
    }
}
