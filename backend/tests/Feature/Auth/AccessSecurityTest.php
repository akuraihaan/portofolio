<?php

namespace Tests\Feature\Auth;

use App\Enums\UserStatus;
use App\Models\LoginHistory;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AccessSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Permission::create(['name' => 'dashboard.view', 'guard_name' => 'web']);
        Permission::create(['name' => 'users.delete', 'guard_name' => 'web']);
        Role::create(['name' => 'Super Admin', 'guard_name' => 'web']);
        Role::create(['name' => 'Admin', 'guard_name' => 'web']);
        Role::create(['name' => 'Editor', 'guard_name' => 'web']);
    }

    public function test_inactive_accounts_are_rejected_and_recorded(): void
    {
        $user = User::factory()->inactive()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
        $this->assertDatabaseHas('login_histories', ['email' => $user->email, 'failure_reason' => 'account_unavailable', 'was_successful' => false]);
    }

    public function test_successful_login_updates_account_and_history(): void
    {
        $user = User::factory()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'password']);

        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user->refresh()->last_login_at);
        $this->assertTrue(LoginHistory::where('user_id', $user->id)->where('was_successful', true)->exists());
    }

    public function test_account_without_dashboard_permission_receives_forbidden(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/admin/dashboard')->assertForbidden();
    }

    public function test_registration_route_can_be_disabled_at_runtime(): void
    {
        Config::set('portfolio.registration_enabled', false);

        $this->get('/register')->assertNotFound();
        $this->post('/register', [])->assertNotFound();
    }

    public function test_last_super_admin_cannot_be_deactivated(): void
    {
        $superAdmin = User::factory()->create(['status' => UserStatus::ACTIVE]);
        $superAdmin->assignRole('Super Admin');

        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);
        app(UserService::class)->changeStatus($superAdmin, UserStatus::INACTIVE, $superAdmin);
    }
}
