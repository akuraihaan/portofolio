<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LoginHistoryController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\PortfolioProfileController;
use App\Http\Controllers\Admin\ProfessionalTitleController;
use App\Http\Controllers\Admin\ResumeController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SiteSettingsController;
use App\Http\Controllers\Admin\SocialLinkController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicResumeController;
use App\Http\Controllers\SecurityController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/resume/download/{language?}', PublicResumeController::class)->name('resume.download');

Route::get('/styles.css', fn () => response()->file(base_path('../styles.css'), ['Content-Type' => 'text/css']))
    ->where('any', '.*');
Route::get('/script.js', fn () => response()->file(base_path('../script.js'), ['Content-Type' => 'application/javascript']))
    ->where('any', '.*');

Route::get('/dashboard', fn () => to_route('admin.dashboard'))->middleware(['auth', 'verified', 'user.active', 'admin.access'])->name('dashboard');

Route::middleware(['auth', 'verified', 'user.active', 'activity', 'admin.access'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', DashboardController::class)->middleware('permission:dashboard.view')->name('dashboard');

        Route::get('/users', [UserController::class, 'index'])->middleware('permission:users.view')->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->middleware('permission:users.create')->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->middleware('permission:users.create')->name('users.store');
        Route::get('/users/{user}', [UserController::class, 'show'])->middleware('permission:users.view')->name('users.show');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->middleware('permission:users.update')->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->middleware('permission:users.update')->name('users.update');
        Route::patch('/users/{user}/permissions', [UserController::class, 'updatePermissions'])->middleware('permission:users.assign-permission')->name('users.permissions');
        Route::patch('/users/{user}/status', [UserController::class, 'changeStatus'])->middleware('permission:users.change-status')->name('users.status');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('permission:users.delete')->name('users.destroy');
        Route::post('/users/{user}/restore', [UserController::class, 'restore'])->middleware('permission:users.restore')->name('users.restore');
        Route::delete('/users/{user}/force', [UserController::class, 'forceDestroy'])->middleware('permission:users.force-delete')->name('users.force');

        Route::get('/roles', [RoleController::class, 'index'])->middleware('permission:roles.view')->name('roles.index');
        Route::post('/roles', [RoleController::class, 'store'])->middleware('permission:roles.create')->name('roles.store');
        Route::put('/roles/{role}', [RoleController::class, 'update'])->middleware('permission:roles.update')->name('roles.update');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->middleware('permission:roles.delete')->name('roles.destroy');

        Route::get('/permissions', [PermissionController::class, 'index'])->middleware(['permission:permissions.view', 'super.admin'])->name('permissions.index');
        Route::post('/permissions', [PermissionController::class, 'store'])->middleware(['permission:permissions.create', 'super.admin'])->name('permissions.store');
        Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->middleware(['permission:permissions.update', 'super.admin'])->name('permissions.update');
        Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->middleware(['permission:permissions.delete', 'super.admin'])->name('permissions.destroy');

        Route::get('/login-history', [LoginHistoryController::class, 'index'])->middleware('permission:login-history.view')->name('login-history.index');

        Route::get('/settings', [SiteSettingsController::class, 'edit'])->middleware('permission:site-settings.view')->name('settings.edit');
        Route::put('/settings', [SiteSettingsController::class, 'update'])->middleware('permission:site-settings.update')->name('settings.update');

        Route::get('/portfolio-profile', [PortfolioProfileController::class, 'edit'])->middleware('permission:profile.view')->name('portfolio-profile.edit');
        Route::patch('/portfolio-profile', [PortfolioProfileController::class, 'update'])->middleware('permission:profile.update')->name('portfolio-profile.update');

        Route::get('/professional-titles', [ProfessionalTitleController::class, 'index'])->middleware('permission:professional-titles.manage')->name('professional-titles.index');
        Route::post('/professional-titles', [ProfessionalTitleController::class, 'store'])->middleware('permission:professional-titles.manage')->name('professional-titles.store');
        Route::put('/professional-titles/{professionalTitle}', [ProfessionalTitleController::class, 'update'])->middleware('permission:professional-titles.manage')->name('professional-titles.update');
        Route::delete('/professional-titles/{professionalTitle}', [ProfessionalTitleController::class, 'destroy'])->middleware('permission:professional-titles.manage')->name('professional-titles.destroy');

        Route::get('/social-links', [SocialLinkController::class, 'index'])->middleware('permission:social-links.manage')->name('social-links.index');
        Route::post('/social-links', [SocialLinkController::class, 'store'])->middleware('permission:social-links.manage')->name('social-links.store');
        Route::put('/social-links/{socialLink}', [SocialLinkController::class, 'update'])->middleware('permission:social-links.manage')->name('social-links.update');
        Route::delete('/social-links/{socialLink}', [SocialLinkController::class, 'destroy'])->middleware('permission:social-links.manage')->name('social-links.destroy');

        Route::get('/resumes', [ResumeController::class, 'index'])->middleware('permission:resumes.manage')->name('resumes.index');
        Route::post('/resumes', [ResumeController::class, 'store'])->middleware('permission:resumes.manage')->name('resumes.store');
        Route::delete('/resumes/{resume}', [ResumeController::class, 'destroy'])->middleware('permission:resumes.manage')->name('resumes.destroy');
    });

Route::middleware(['auth', 'verified', 'user.active', 'activity'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/security', [SecurityController::class, 'index'])->name('profile.security');
    Route::delete('/profile/security/other-sessions', [SecurityController::class, 'destroyOtherSessions'])->name('profile.security.other-sessions');
    Route::delete('/profile/security/{session}', [SecurityController::class, 'destroy'])->name('profile.security.destroy');
});

require __DIR__.'/auth.php';
