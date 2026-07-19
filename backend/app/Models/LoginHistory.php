<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoginHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'email', 'ip_address', 'user_agent', 'device', 'browser',
        'platform', 'login_at', 'logout_at', 'was_successful', 'failure_reason', 'session_id',
    ];

    protected function casts(): array
    {
        return [
            'login_at' => 'datetime',
            'logout_at' => 'datetime',
            'was_successful' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function maskedIp(): string
    {
        if (! $this->ip_address) {
            return '—';
        }

        return filter_var($this->ip_address, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)
            ? preg_replace('/:[^:]+$/', ':•••', $this->ip_address)
            : preg_replace('/\.\d+$/', '.•••', $this->ip_address);
    }
}
