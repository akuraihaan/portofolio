<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

class SettingService
{
    private const CACHE_KEY = 'site-settings.public.v2';

    public function get(string $key, mixed $default = null): mixed
    {
        $setting = $this->all()->get($key);
        return $setting ? $this->cast($setting->value, $setting->type) : $default;
    }

    public function set(string $key, mixed $value, string $group = 'general', string $type = 'string', bool $isPublic = true): SiteSetting
    {
        $setting = SiteSetting::updateOrCreate(
            ['group' => $group, 'key' => $key],
            ['value' => $this->serialize($value, $type), 'type' => $type, 'is_public' => $isPublic],
        );
        $this->clearCache();
        return $setting;
    }

    public function getGroup(string $group): array
    {
        return SiteSetting::query()->where('group', $group)->where('is_public', true)->get()->mapWithKeys(fn (SiteSetting $setting) => [$setting->key => $this->cast($setting->value, $setting->type)])->all();
    }

    public function all()
    {
        $settings = Cache::rememberForever(self::CACHE_KEY, fn () => SiteSetting::query()
            ->where('is_public', true)
            ->get(['key', 'value', 'type'])
            ->map(fn (SiteSetting $setting) => $setting->only(['key', 'value', 'type']))
            ->all());

        return collect($settings)->map(fn (array $setting) => (object) $setting)->keyBy('key');
    }

    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    private function serialize(mixed $value, string $type): ?string
    {
        return match ($type) {
            'boolean' => $value ? '1' : '0',
            'json' => json_encode($value, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
            default => $value === null ? null : (string) $value,
        };
    }

    private function cast(?string $value, string $type): mixed
    {
        return match ($type) {
            'boolean' => $value === '1' || $value === 'true',
            'integer' => (int) $value,
            'json' => $value ? json_decode($value, true, 512, JSON_THROW_ON_ERROR) : [],
            default => $value,
        };
    }
}
