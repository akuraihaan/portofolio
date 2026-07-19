<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfessionalTitle extends Model
{
    protected $fillable = ['title', 'description', 'is_active', 'is_primary', 'sort_order'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'is_primary' => 'boolean'];
    }
}
