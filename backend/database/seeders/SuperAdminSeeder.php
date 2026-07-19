<?php

namespace Database\Seeders;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = mb_strtolower((string) env('SUPER_ADMIN_EMAIL', 'admin@example.com'));
        $password = (string) env('SUPER_ADMIN_PASSWORD', '');

        if ($password === '') {
            $this->command?->warn('SUPER_ADMIN_PASSWORD is empty; no Super Admin was seeded.');
            return;
        }

        $user = User::withTrashed()->updateOrCreate(
            ['email' => $email],
            [
                'name' => env('SUPER_ADMIN_NAME', 'bworiey Admin'),
                'password' => Hash::make($password),
                'status' => UserStatus::ACTIVE,
                'email_verified_at' => now(),
                'deleted_at' => null,
            ],
        );

        $user->syncRoles(['Super Admin']);
    }
}
