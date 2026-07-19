<?php

namespace Database\Seeders;

use App\Services\SettingService;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(SettingService $settings): void
    {
        $defaults = [
            'site_name' => ['bworiey', 'identity', 'string'],
            'studio_name' => ['bworiey', 'identity', 'string'],
            'site_tagline' => ['Portfolio digital bworiey', 'identity', 'string'],
            'site_description' => ['Portfolio dinamis bworiey. Konten publik dikelola melalui panel admin.', 'identity', 'string'],
            'public_email' => [null, 'contact', 'string'], 'business_email' => [null, 'contact', 'string'],
            'phone' => [null, 'contact', 'string'], 'whatsapp' => [null, 'contact', 'string'],
            'city' => [null, 'contact', 'string'], 'country' => [null, 'contact', 'string'],
            'default_theme' => ['dark', 'appearance', 'string'], 'default_language' => ['id', 'appearance', 'string'],
            'show_theme_switcher' => [true, 'appearance', 'boolean'], 'show_language_switcher' => [false, 'appearance', 'boolean'],
            'availability_status' => ['available', 'identity', 'string'], 'availability_label' => ['Konten publik bworiey', 'identity', 'string'],
            'hero_badge' => ['Portfolio digital', 'identity', 'string'], 'hero_title' => ['Konten belum tersedia.', 'identity', 'string'],
            'hero_subtitle' => [null, 'identity', 'string'], 'hero_description' => ['Konten belum tersedia.', 'identity', 'string'],
            'default_meta_title' => ['bworiey — Portfolio digital', 'seo', 'string'],
            'default_meta_description' => ['Portfolio dinamis bworiey dengan konten yang dapat dikelola melalui panel admin.', 'seo', 'string'],
            'default_canonical_url' => [null, 'seo', 'string'], 'google_site_verification' => [null, 'seo', 'string'], 'bing_site_verification' => [null, 'seo', 'string'],
            'registration_enabled' => [false, 'system', 'boolean'], 'contact_form_enabled' => [false, 'system', 'boolean'],
            'blog_enabled' => [false, 'system', 'boolean'], 'testimonials_enabled' => [false, 'system', 'boolean'],
            'services_enabled' => [false, 'system', 'boolean'], 'analytics_enabled' => [false, 'system', 'boolean'], 'maintenance_mode' => [false, 'system', 'boolean'],
        ];

        foreach ($defaults as $key => [$value, $group, $type]) {
            $settings->set($key, $value, $group, $type);
        }
    }
}
