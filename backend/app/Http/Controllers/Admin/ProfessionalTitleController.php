<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProfessionalTitleRequest;
use App\Http\Requests\Admin\UpdateProfessionalTitleRequest;
use App\Models\ProfessionalTitle;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class ProfessionalTitleController extends Controller
{
    public function __construct(private readonly ActivityLogService $activity) {}

    public function index(): View { return view('admin.professional-titles.index', ['titles' => ProfessionalTitle::orderBy('sort_order')->orderBy('id')->paginate(15)]); }
    public function store(StoreProfessionalTitleRequest $request): RedirectResponse { $title = ProfessionalTitle::create($request->validated()); if ($title->is_primary) ProfessionalTitle::whereKeyNot($title->id)->update(['is_primary' => false]); $this->activity->record('created', 'professional-titles', $title, $request); return back()->with('status', 'Judul profesional berhasil dibuat.'); }
    public function update(UpdateProfessionalTitleRequest $request, ProfessionalTitle $professionalTitle): RedirectResponse { $professionalTitle->update($request->validated()); if ($professionalTitle->is_primary) ProfessionalTitle::whereKeyNot($professionalTitle->id)->update(['is_primary' => false]); $this->activity->record('updated', 'professional-titles', $professionalTitle, $request); return back()->with('status', 'Judul profesional berhasil diperbarui.'); }
    public function destroy(ProfessionalTitle $professionalTitle, \Illuminate\Http\Request $request): RedirectResponse { $professionalTitle->delete(); $this->activity->record('deleted', 'professional-titles', null, $request); return back()->with('status', 'Judul profesional dihapus.'); }
}
