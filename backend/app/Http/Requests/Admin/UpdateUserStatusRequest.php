<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateUserStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('users.change-status') ?? false;
    }

    public function rules(): array
    {
        return ['status' => ['required', new Enum(UserStatus::class)]];
    }
}
