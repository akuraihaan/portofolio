<?php

namespace App\Http\Controllers;

use App\Models\Resume;
use Illuminate\Support\Facades\Storage;

class PublicResumeController extends Controller
{
    public function __invoke(?string $language = null)
    {
        $resume = Resume::query()->where('is_active', true)->when($language, fn ($query) => $query->where('language', $language))->where(function ($query) { $query->whereNull('published_at')->orWhere('published_at', '<=', now()); })->latest('published_at')->firstOrFail();
        $resume->increment('download_count');
        abort_unless(Storage::disk('local')->exists($resume->file_path), 404);
        return Storage::disk('local')->download($resume->file_path, str($resume->title)->slug().'.pdf');
    }
}
