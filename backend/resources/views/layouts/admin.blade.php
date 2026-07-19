<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @php($studioName = app(\App\Services\SettingService::class)->get('studio_name', config('app.name', 'bworiey')))
    <title>{{ $title ?? 'Admin · '.$studioName }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-[#0e100f] text-[#fffce1] antialiased">
    <div x-data="{ sidebarOpen: false }" class="min-h-screen lg:flex">
        <div x-show="sidebarOpen" x-cloak @click="sidebarOpen = false" class="fixed inset-0 z-30 bg-black/60 lg:hidden"></div>
        <aside :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'" class="fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-[#42433d] bg-[#191919] transition-transform duration-200 lg:static">
            <div class="flex items-center gap-3 border-b border-[#42433d] px-6 py-6">
                <span class="grid h-9 w-9 place-items-center rounded-full bg-[#abff84] font-semibold text-[#0e100f]">{{ mb_strtoupper(mb_substr($studioName, 0, 1)) }}</span>
                <div><p class="font-semibold tracking-tight">{{ $studioName }}</p><p class="text-xs text-[#7c7c6f]">Control room</p></div>
            </div>
            <nav class="flex-1 space-y-1 overflow-y-auto px-4 py-6" aria-label="Admin navigation">
                <p class="mb-3 px-3 text-[11px] uppercase tracking-[.18em] text-[#7c7c6f]">Workspace</p>
                @can('dashboard.view') <a href="{{ route('admin.dashboard') }}" class="admin-nav-link {{ request()->routeIs('admin.dashboard') ? 'is-active' : '' }}">Overview <span>↗</span></a> @endcan
                @can('users.view') <a href="{{ route('admin.users.index') }}" class="admin-nav-link {{ request()->routeIs('admin.users.*') ? 'is-active' : '' }}">Users <span>01</span></a> @endcan
                @can('roles.view') <a href="{{ route('admin.roles.index') }}" class="admin-nav-link {{ request()->routeIs('admin.roles.*') ? 'is-active' : '' }}">Roles <span>02</span></a> @endcan
                @can('permissions.view') <a href="{{ route('admin.permissions.index') }}" class="admin-nav-link {{ request()->routeIs('admin.permissions.*') ? 'is-active' : '' }}">Permissions <span>03</span></a> @endcan
                @can('login-history.view') <a href="{{ route('admin.login-history.index') }}" class="admin-nav-link {{ request()->routeIs('admin.login-history.*') ? 'is-active' : '' }}">Login history <span>04</span></a> @endcan
                @can('site-settings.view') <a href="{{ route('admin.settings.edit') }}" class="admin-nav-link {{ request()->routeIs('admin.settings.*') ? 'is-active' : '' }}">Site settings <span>05</span></a> @endcan
                @can('profile.view') <a href="{{ route('admin.portfolio-profile.edit') }}" class="admin-nav-link {{ request()->routeIs('admin.portfolio-profile.*') ? 'is-active' : '' }}">Portfolio profile <span>06</span></a> @endcan
                @can('professional-titles.manage') <a href="{{ route('admin.professional-titles.index') }}" class="admin-nav-link {{ request()->routeIs('admin.professional-titles.*') ? 'is-active' : '' }}">Professional titles <span>07</span></a> @endcan
                @can('social-links.manage') <a href="{{ route('admin.social-links.index') }}" class="admin-nav-link {{ request()->routeIs('admin.social-links.*') ? 'is-active' : '' }}">Social links <span>08</span></a> @endcan
                @can('resumes.manage') <a href="{{ route('admin.resumes.index') }}" class="admin-nav-link {{ request()->routeIs('admin.resumes.*') ? 'is-active' : '' }}">Resumes <span>09</span></a> @endcan
                <p class="mb-3 mt-8 px-3 text-[11px] uppercase tracking-[.18em] text-[#7c7c6f]">Account</p>
                <a href="{{ route('profile.edit') }}" class="admin-nav-link {{ request()->routeIs('profile.edit') ? 'is-active' : '' }}">Profile <span>↗</span></a>
                <a href="{{ route('profile.security') }}" class="admin-nav-link {{ request()->routeIs('profile.security*') ? 'is-active' : '' }}">Security <span>↗</span></a>
            </nav>
            <div class="border-t border-[#42433d] p-4">
                <div class="mb-3 flex items-center gap-3 rounded-lg bg-[#0e100f] p-3">
                    <img src="{{ auth()->user()->avatar_url }}" alt="" class="h-9 w-9 rounded-full object-cover">
                    <div class="min-w-0"><p class="truncate text-sm font-medium">{{ auth()->user()->name }}</p><p class="truncate text-xs text-[#7c7c6f]">{{ auth()->user()->getRoleNames()->join(', ') }}</p></div>
                </div>
                <form method="POST" action="{{ route('logout') }}">@csrf<button class="w-full rounded-full border border-[#fffce1] px-4 py-2 text-sm font-medium transition hover:bg-[#fffce1] hover:text-[#0e100f]">Log out</button></form>
            </div>
        </aside>
        <div class="min-w-0 flex-1">
            <header class="flex items-center justify-between border-b border-[#42433d] bg-[#0e100f] px-5 py-5 sm:px-8 lg:px-12">
                <div class="flex items-center gap-3"><button @click="sidebarOpen = true" class="rounded-full border border-[#42433d] px-3 py-2 text-sm lg:hidden" aria-label="Open navigation">Menu</button><span class="text-sm text-[#7c7c6f]">{{ now()->format('D, d M Y') }}</span></div>
                <a href="{{ url('/') }}" class="text-sm text-[#abff84] transition hover:opacity-70">View public site ↗</a>
            </header>
            @if (session('status')) <div class="mx-5 mt-5 rounded-lg border border-[#0ae448]/40 bg-[#0ae448]/10 px-4 py-3 text-sm text-[#abff84] sm:mx-8 lg:mx-12">{{ session('status') }}</div> @endif
            <main class="p-5 sm:p-8 lg:p-12">{{ $slot }}</main>
        </div>
    </div>
</body>
</html>
