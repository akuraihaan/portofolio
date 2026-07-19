<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSiteSettingsRequest;
use App\Services\ActivityLogService;
use App\Services\SettingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class SiteSettingsController extends Controller
{
    public function __construct(private readonly SettingService $settings, private readonly ActivityLogService $activity)
    {
    }

    public function edit(): View
    {
        return view('admin.settings.edit', ['settings' => $this->settings->all()->mapWithKeys(fn ($setting) => [$setting->key => app(SettingService::class)->get($setting->key)])->all()]);
    }

    public function update(UpdateSiteSettingsRequest $request): RedirectResponse
    {
        $data = $request->validated();
        foreach ($data as $key => $value) {
            $type = in_array($key, [
                'contact_form_enabled', 'blog_enabled', 'testimonials_enabled', 'services_enabled',
                'analytics_enabled', 'registration_enabled', 'show_theme_switcher',
                'show_language_switcher', 'maintenance_mode',
            ], true) ? 'boolean' : 'string';
            $this->settings->set($key, $type === 'boolean' ? (bool) $value : $value, $this->groupFor($key), $type);
        }
        $this->activity->record('settings-updated', 'site-settings', null, $request, null, array_keys($data));

        return back()->with('status', 'Pengaturan bworiey berhasil diperbarui.');
    }

    private function groupFor(string $key): string
    {
        return match (true) {
            in_array($key, ['public_email', 'business_email', 'phone', 'whatsapp', 'city', 'country'], true) => 'contact',
            in_array($key, ['default_meta_title', 'default_meta_description', 'default_canonical_url', 'google_site_verification', 'bing_site_verification'], true) => 'seo',
            in_array($key, ['default_theme', 'default_language', 'show_theme_switcher', 'show_language_switcher'], true) => 'appearance',
            in_array($key, ['maintenance_mode', 'contact_form_enabled', 'blog_enabled', 'testimonials_enabled', 'services_enabled', 'analytics_enabled', 'registration_enabled'], true) => 'system',
            default => 'identity',
        };
    }
}
