<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingsRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->can('site-settings.update') ?? false; }

    public function rules(): array
    {
        return [
            'site_name' => ['nullable', 'string', 'max:120'], 'studio_name' => ['nullable', 'string', 'max:120'],
            'site_tagline' => ['nullable', 'string', 'max:180'], 'site_description' => ['nullable', 'string', 'max:500'],
            'public_email' => ['nullable', 'email', 'max:255'], 'business_email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:60'], 'whatsapp' => ['nullable', 'string', 'max:60'],
            'city' => ['nullable', 'string', 'max:80'], 'country' => ['nullable', 'string', 'max:80'],
            'default_meta_title' => ['nullable', 'string', 'max:180'], 'default_meta_description' => ['nullable', 'string', 'max:320'],
            'default_canonical_url' => ['nullable', 'url', 'max:500'], 'google_site_verification' => ['nullable', 'string', 'max:255'],
            'bing_site_verification' => ['nullable', 'string', 'max:255'], 'default_theme' => ['required', 'in:dark,light'],
            'default_language' => ['required', 'in:id,en'], 'availability_status' => ['nullable', 'string', 'max:60'],
            'availability_label' => ['nullable', 'string', 'max:120'], 'hero_badge' => ['nullable', 'string', 'max:120'],
            'hero_title' => ['nullable', 'string', 'max:180'], 'hero_subtitle' => ['nullable', 'string', 'max:180'],
            'hero_description' => ['nullable', 'string', 'max:500'], 'contact_form_enabled' => ['nullable', 'boolean'],
            'blog_enabled' => ['nullable', 'boolean'], 'testimonials_enabled' => ['nullable', 'boolean'],
            'services_enabled' => ['nullable', 'boolean'], 'analytics_enabled' => ['nullable', 'boolean'],
            'registration_enabled' => ['nullable', 'boolean'], 'show_theme_switcher' => ['nullable', 'boolean'],
            'show_language_switcher' => ['nullable', 'boolean'], 'maintenance_mode' => ['nullable', 'boolean'],
        ];
    }
}
