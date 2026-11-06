<?php

namespace Database\Seeders;

use App\Services\SettingService;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(SettingService $settings): void
    {
        $defaults = [
            'site_name' => [null, 'identity', 'string'],
            'studio_name' => [null, 'identity', 'string'],
            'site_tagline' => [null, 'identity', 'string'],
            'site_description' => [null, 'identity', 'string'],
            'public_email' => [null, 'contact', 'string'], 'business_email' => [null, 'contact', 'string'],
            'phone' => [null, 'contact', 'string'], 'whatsapp' => [null, 'contact', 'string'],
            'city' => [null, 'contact', 'string'], 'country' => [null, 'contact', 'string'],
            'default_theme' => ['dark', 'appearance', 'string'], 'default_language' => ['id', 'appearance', 'string'],
            'show_theme_switcher' => [true, 'appearance', 'boolean'], 'show_language_switcher' => [false, 'appearance', 'boolean'],
            'availability_status' => [null, 'identity', 'string'], 'availability_label' => [null, 'identity', 'string'],
            'hero_badge' => [null, 'identity', 'string'], 'hero_title' => [null, 'identity', 'string'],
            'hero_subtitle' => [null, 'identity', 'string'], 'hero_description' => [null, 'identity', 'string'],
            'default_meta_title' => [null, 'seo', 'string'],
            'default_meta_description' => [null, 'seo', 'string'],
            'default_canonical_url' => [null, 'seo', 'string'], 'google_site_verification' => [null, 'seo', 'string'], 'bing_site_verification' => [null, 'seo', 'string'],
            'registration_enabled' => [false, 'system', 'boolean'], 'contact_form_enabled' => [false, 'system', 'boolean'],
            'blog_enabled' => [false, 'system', 'boolean'], 'testimonials_enabled' => [false, 'system', 'boolean'],
            'services_enabled' => [false, 'system', 'boolean'], 'analytics_enabled' => [false, 'system', 'boolean'], 'maintenance_mode' => [false, 'system', 'boolean'],
        ];

        foreach ($defaults as $key => [$value, $group, $type]) {
            if (! SiteSetting::query()->where('key', $key)->exists()) {
                $settings->set($key, $value, $group, $type);
            }
        }
    }
}
