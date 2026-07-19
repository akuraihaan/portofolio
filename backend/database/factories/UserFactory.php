<?php

namespace Database\Factories;

use App\Models\User;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'status' => UserStatus::ACTIVE,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function active(): static { return $this->state(['status' => UserStatus::ACTIVE]); }
    public function inactive(): static { return $this->state(['status' => UserStatus::INACTIVE]); }
    public function suspended(): static { return $this->state(['status' => UserStatus::SUSPENDED]); }
    public function pending(): static { return $this->state(['status' => UserStatus::PENDING]); }

    public function superAdmin(): static
    {
        return $this->afterCreating(fn (User $user) => $user->assignRole('Super Admin'));
    }

    public function admin(): static
    {
        return $this->afterCreating(fn (User $user) => $user->assignRole('Admin'));
    }

    public function editor(): static
    {
        return $this->afterCreating(fn (User $user) => $user->assignRole('Editor'));
    }
}
