<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadResumeRequest;
use App\Models\Resume;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

class ResumeController extends Controller
{
    public function __construct(private readonly ActivityLogService $activity) {}
    public function index(): View { return view('admin.resumes.index', ['resumes' => Resume::latest()->paginate(15)]); }
    public function store(UploadResumeRequest $request): RedirectResponse { $data = $request->validated(); $data['file_path'] = $request->file('file')->store('resumes'); unset($data['file']); $resume = Resume::create($data); if ($resume->is_active) Resume::whereKeyNot($resume->id)->update(['is_active' => false]); $this->activity->record('uploaded', 'resumes', $resume, $request); return back()->with('status', 'CV berhasil diunggah.'); }
    public function destroy(Request $request, Resume $resume): RedirectResponse { Storage::disk('local')->delete($resume->file_path); $resume->delete(); $this->activity->record('deleted', 'resumes', null, $request); return back()->with('status', 'CV dihapus.'); }
}
