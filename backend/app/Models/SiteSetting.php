<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = ['group', 'key', 'value', 'type', 'is_public', 'is_translatable'];

    protected function casts(): array
    {
        return ['is_public' => 'boolean', 'is_translatable' => 'boolean'];
    }
}
