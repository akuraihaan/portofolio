<x-admin-layout title="Overview · bworiey">
    <div class="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p class="mb-3 text-sm text-[#7c7c6f]">{ Admin overview }</p><h1 class="font-display text-5xl font-semibold tracking-[-.08em] sm:text-7xl">Keep it<br><span class="text-[#abff84]">moving.</span></h1></div>
        <p class="max-w-xs text-sm leading-6 text-[#7c7c6f]">A focused control room for the people, permissions, and activity behind your portfolio.</p>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        @if ($metrics['users'] !== null)
            @foreach ([['Users', $metrics['users'], 'Total accounts'], ['Active', $metrics['active_users'], 'Can access the panel'], ['Failed logins', $metrics['failed_logins'], 'Last 7 days'], ['Roles', $metrics['roles'], 'System roles']] as [$label, $value, $caption])
                <article class="rounded-lg border border-[#42433d] bg-[#191919] p-5"><p class="text-xs uppercase tracking-[.15em] text-[#7c7c6f]">{{ $label }}</p><p class="mt-8 font-display text-5xl tracking-[-.08em] text-[#fffce1]">{{ $value }}</p><p class="mt-2 text-xs text-[#7c7c6f]">{{ $caption }}</p></article>
            @endforeach
        @else
            <article class="col-span-full rounded-lg border border-[#42433d] bg-[#191919] p-6"><p class="text-sm text-[#7c7c6f]">Editor view</p><h2 class="mt-4 font-display text-4xl tracking-[-.06em]">Your workspace is ready.</h2><p class="mt-3 max-w-xl text-sm leading-6 text-[#7c7c6f]">You only see the modules your permissions allow. Start with the content work assigned to you.</p></article>
        @endif
    </div>
    <section class="mt-10 rounded-lg border border-[#42433d] bg-[#191919]">
        <div class="flex items-center justify-between border-b border-[#42433d] px-5 py-4"><div><p class="text-sm font-medium">Recent activity</p><p class="mt-1 text-xs text-[#7c7c6f]">Security-safe audit trail</p></div>@can('activity-logs.view')<span class="rounded-full border border-[#42433d] px-3 py-1 text-xs text-[#7c7c6f]">Live log</span>@endcan</div>
        <div class="divide-y divide-[#42433d]">
            @forelse ($recentActivities as $activity)
                <div class="flex flex-col gap-2 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"><div><span class="text-[#abff84]">{{ $activity->action }}</span><span class="mx-2 text-[#7c7c6f]">·</span><span>{{ $activity->module }}</span></div><span class="text-xs text-[#7c7c6f]">{{ $activity->created_at?->diffForHumans() }}</span></div>
            @empty
                <div class="px-5 py-10 text-center text-sm text-[#7c7c6f]">No activity recorded yet.</div>
            @endforelse
        </div>
    </section>
</x-admin-layout>
