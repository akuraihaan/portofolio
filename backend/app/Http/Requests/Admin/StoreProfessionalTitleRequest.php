<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfessionalTitleRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->can('professional-titles.manage') ?? false; }
    public function rules(): array { return ['title' => ['required', 'string', 'max:180'], 'description' => ['nullable', 'string', 'max:500'], 'is_active' => ['nullable', 'boolean'], 'is_primary' => ['nullable', 'boolean'], 'sort_order' => ['nullable', 'integer', 'min:0']]; }
}
