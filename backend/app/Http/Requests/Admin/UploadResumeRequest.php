<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UploadResumeRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->can('resumes.manage') ?? false; }
    public function rules(): array { return ['title' => ['required', 'string', 'max:120'], 'language' => ['required', 'in:id,en'], 'version' => ['nullable', 'string', 'max:40'], 'file' => ['required', 'file', 'mimes:pdf', 'max:10240'], 'is_active' => ['nullable', 'boolean'], 'published_at' => ['nullable', 'date']]; }
}
