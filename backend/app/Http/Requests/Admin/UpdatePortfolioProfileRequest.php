<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePortfolioProfileRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->can('profile.update') ?? false; }

    public function rules(): array
    {
        return [
            'full_name' => ['nullable', 'string', 'max:120'], 'display_name' => ['nullable', 'string', 'max:120'],
            'professional_title' => ['nullable', 'string', 'max:180'], 'short_bio' => ['nullable', 'string', 'max:500'],
            'full_bio' => ['nullable', 'string', 'max:10000'], 'hero_heading' => ['nullable', 'string', 'max:180'],
            'hero_description' => ['nullable', 'string', 'max:1000'], 'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:60'], 'city' => ['nullable', 'string', 'max:80'], 'country' => ['nullable', 'string', 'max:80'],
            'availability_status' => ['nullable', 'string', 'max:60'], 'availability_text' => ['nullable', 'string', 'max:120'],
            'birth_date' => ['nullable', 'date'], 'years_experience' => ['nullable', 'integer', 'min:0', 'max:100'],
            'projects_completed' => ['nullable', 'integer', 'min:0'], 'clients_served' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'], 'profile_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'about_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ];
    }
}
