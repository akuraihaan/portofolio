<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSocialLinkRequest;
use App\Http\Requests\Admin\UpdateSocialLinkRequest;
use App\Models\SocialLink;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class SocialLinkController extends Controller
{
    public function __construct(private readonly ActivityLogService $activity) {}
    public function index(): View { return view('admin.social-links.index', ['links' => SocialLink::orderBy('sort_order')->orderBy('id')->paginate(15)]); }
    public function store(StoreSocialLinkRequest $request): RedirectResponse { $link = SocialLink::create($request->validated()); $this->activity->record('created', 'social-links', $link, $request); return back()->with('status', 'Social link berhasil dibuat.'); }
    public function update(UpdateSocialLinkRequest $request, SocialLink $socialLink): RedirectResponse { $socialLink->update($request->validated()); $this->activity->record('updated', 'social-links', $socialLink, $request); return back()->with('status', 'Social link berhasil diperbarui.'); }
    public function destroy(SocialLink $socialLink, \Illuminate\Http\Request $request): RedirectResponse { $socialLink->delete(); $this->activity->record('deleted', 'social-links', null, $request); return back()->with('status', 'Social link dihapus.'); }
}
