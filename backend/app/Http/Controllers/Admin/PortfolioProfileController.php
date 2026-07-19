<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePortfolioProfileRequest;
use App\Models\Profile;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

class PortfolioProfileController extends Controller
{
    public function __construct(private readonly ActivityLogService $activity)
    {
    }

    public function edit(): View
    {
        return view('admin.portfolio-profile.edit', ['profile' => Profile::firstOrCreate([], ['is_active' => true])]);
    }

    public function update(UpdatePortfolioProfileRequest $request): RedirectResponse
    {
        $profile = Profile::firstOrCreate([], ['is_active' => true]);
        $data = $request->validated();
        foreach (['profile_image', 'about_image'] as $image) {
            if ($request->hasFile($image)) {
                $old = $profile->{$image};
                $data[$image] = $request->file($image)->store('profile', 'public');
                if ($old) Storage::disk('public')->delete($old);
            }
        }
        $before = $profile->only(['display_name', 'professional_title', 'email', 'is_active']);
        $profile->update($data);
        $this->activity->record('profile-content-updated', 'profile', $profile, $request, $before, $profile->only(['display_name', 'professional_title', 'email', 'is_active']));

        return back()->with('status', 'Profil portfolio berhasil diperbarui.');
    }
}
