<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'full_name', 'display_name', 'professional_title', 'short_bio', 'full_bio', 'hero_heading',
        'hero_description', 'profile_image', 'about_image', 'email', 'phone', 'city', 'country',
        'availability_status', 'availability_text', 'birth_date', 'years_experience', 'projects_completed',
        'clients_served', 'is_active',
    ];

    protected function casts(): array
    {
        return ['birth_date' => 'date', 'is_active' => 'boolean'];
    }
}
