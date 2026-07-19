<?php

namespace App\Http\Controllers;

use App\Models\ProfessionalTitle;
use App\Models\Profile;
use App\Models\Resume;
use App\Models\SocialLink;
use App\Services\SettingService;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function __construct(private readonly SettingService $settings)
    {
    }

    public function __invoke(): View
    {
        return view('public.home', [
            'settings' => $this->settings->all()->mapWithKeys(fn ($setting) => [$setting->key => app(SettingService::class)->get($setting->key)])->all(),
            'profile' => Profile::query()->where('is_active', true)->first(),
            'titles' => ProfessionalTitle::query()->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get(),
            'socialLinks' => SocialLink::query()->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get(),
            'resume' => Resume::query()->where('is_active', true)->where(function ($query) { $query->whereNull('published_at')->orWhere('published_at', '<=', now()); })->latest('published_at')->first(),
        ]);
    }
}
