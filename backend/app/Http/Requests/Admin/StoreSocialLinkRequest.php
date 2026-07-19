<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSocialLinkRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->can('social-links.manage') ?? false; }
    public function rules(): array { return ['platform' => ['required', 'string', 'max:60'], 'label' => ['required', 'string', 'max:80'], 'url' => ['required', 'url', 'max:500'], 'username' => ['nullable', 'string', 'max:120'], 'icon' => ['nullable', 'string', 'max:40'], 'is_active' => ['nullable', 'boolean'], 'open_in_new_tab' => ['nullable', 'boolean'], 'sort_order' => ['nullable', 'integer', 'min:0']]; }
}
