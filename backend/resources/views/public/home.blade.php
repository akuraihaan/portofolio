@php
    $studioName = $settings['studio_name'] ?? $settings['site_name'] ?? 'bworiey';
    $siteTitle = $settings['default_meta_title'] ?? $studioName;
    $siteDescription = $settings['default_meta_description'] ?? $settings['site_description'] ?? 'Portfolio digital bworiey.';
    $displayName = $profile?->display_name ?: $profile?->full_name ?: $studioName;
    $heroTitle = $profile?->hero_heading ?: ($settings['hero_title'] ?? 'Konten belum tersedia.');
    $heroDescription = $profile?->hero_description ?: ($settings['hero_description'] ?? 'Konten belum tersedia.');
    $email = $profile?->email ?: ($settings['public_email'] ?? $settings['business_email'] ?? null);
    $location = collect([$profile?->city ?: ($settings['city'] ?? null), $profile?->country ?: ($settings['country'] ?? null)])->filter()->join(', ');
    $titleList = $titles->pluck('title')->values()->all();
@endphp
<!doctype html>
<html lang="{{ $settings['default_language'] ?? 'id' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="{{ $siteDescription }}">
    <meta name="theme-color" content="#0e100f">
    @if ($settings['default_canonical_url'] ?? false)<link rel="canonical" href="{{ $settings['default_canonical_url'] }}">@endif
    <meta property="og:title" content="{{ $siteTitle }}">
    <meta property="og:description" content="{{ $siteDescription }}">
    <meta property="og:type" content="website">
    <title>{{ $siteTitle }}</title>
    <link rel="stylesheet" href="{{ url('/styles.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    @if ($settings['google_site_verification'] ?? false)<meta name="google-site-verification" content="{{ $settings['google_site_verification'] }}">@endif
</head>
<body>
    <div class="noise" aria-hidden="true"></div>
    <div class="announcement">
        <span>{{ $settings['availability_label'] ?? 'bworiey' }}</span>
        <a href="#contact">Mulai percakapan <span aria-hidden="true">↗</span></a>
    </div>

    <header class="site-header" data-header>
        <a class="brand" href="#top" aria-label="{{ $studioName }} home">
            <span class="brand__mark">{{ mb_strtoupper(mb_substr($studioName, 0, 1)) }}</span>
            <span>{{ $studioName }}</span>
        </a>
        <nav class="desktop-nav" aria-label="Navigasi utama">
            <a href="#about">Tentang</a><a href="#titles">Keahlian</a><a href="#contact">Kontak</a>
        </nav>
        <div class="header-actions">
            @if (($settings['show_theme_switcher'] ?? true))
                <button class="icon-button theme-toggle" type="button" data-theme-toggle aria-label="Ganti tema" title="Ganti tema"><span class="theme-toggle__sun" aria-hidden="true">☼</span><span class="theme-toggle__moon" aria-hidden="true">◐</span></button>
            @endif
            <a class="button button--small button--gradient" href="#contact">Mari bicara <span aria-hidden="true">↗</span></a>
            <button class="icon-button menu-toggle" type="button" data-menu-toggle aria-label="Buka menu" aria-expanded="false"><span></span><span></span></button>
        </div>
        <nav class="mobile-nav" data-mobile-nav aria-label="Navigasi mobile"><a href="#about">Tentang <span>01</span></a><a href="#titles">Keahlian <span>02</span></a><a href="#contact">Kontak <span>03</span></a></nav>
    </header>

    <main id="top">
        <section class="hero section-shell" aria-labelledby="hero-title">
            <div class="hero__copy" data-reveal>
                <p class="eyebrow"><span class="eyebrow__braces">{</span> {{ $settings['hero_badge'] ?? 'Portfolio' }} <span class="eyebrow__braces">}</span></p>
                <h1 id="hero-title">{{ $heroTitle }}</h1>
                <div class="hero__bottom">
                    <p class="hero__intro">{{ $heroDescription }} @if (count($titleList)) <span class="accent-green" data-role data-roles='@json($titleList)'></span>@endif</p>
                    <a class="button button--large" href="#about">Jelajahi profil <span aria-hidden="true">↘</span></a>
                </div>
            </div>
            <div class="hero__visual" data-reveal data-reveal-delay="150">
                <div class="hero__visual-label"><span>01</span><span>{{ $studioName }}</span></div>
                <div class="hero__orb hero__orb--pink" aria-hidden="true"></div><div class="hero__orb hero__orb--blue" aria-hidden="true"></div><div class="hero__orb hero__orb--green" aria-hidden="true"></div>
                <div class="hero__portrait" aria-label="Visual profil {{ $displayName }}" @if ($profile?->profile_image) style="background-image:url('{{ asset('storage/'.$profile->profile_image) }}');background-size:cover;background-position:center" @endif><span class="hero__portrait-initials">{{ mb_strtoupper(mb_substr($displayName, 0, 2)) }}</span><span class="hero__portrait-caption">{{ $profile?->professional_title ?: 'Portfolio digital' }}</span></div>
                <div class="hero__stamp"><span>{{ $location ?: 'Digital studio' }}</span><span>—</span><span>{{ $settings['default_language'] ?? 'id' }}</span></div>
                <div class="hero__scroll-cue"><span class="hero__scroll-line"></span> Scroll untuk menjelajah</div>
            </div>
        </section>

        <div class="marquee" aria-label="Informasi studio"><div class="marquee__track"><span>{{ $studioName }}</span><b>✳</b><span>{{ $settings['site_tagline'] ?? 'Portfolio digital' }}</span><b>✳</b><span>{{ $settings['availability_status'] ?? 'Available' }}</span><b>✳</b><span>{{ $location ?: 'Remote friendly' }}</span><b>✳</b><span>{{ $studioName }}</span><b>✳</b></div></div>

        <section class="statement section-shell section-shell--narrow" id="about" aria-labelledby="about-title">
            <div class="section-intro" data-reveal><span class="section-number">02 / 04</span><p class="eyebrow"><span class="eyebrow__braces">{</span> Tentang <span class="eyebrow__braces">}</span></p></div>
            <div class="statement__content" data-reveal data-reveal-delay="100"><h2 id="about-title">{{ $profile?->short_bio ?: 'Konten belum tersedia.' }}</h2><div class="statement__aside"><p>{{ $profile?->full_bio ?: 'Konten belum tersedia.' }}</p>@if ($resume)<a class="text-link" href="{{ route('resume.download', ['language' => $resume->language]) }}">Unduh CV <span aria-hidden="true">↗</span></a>@endif</div></div>
        </section>

        <section class="capabilities section-shell" id="titles" aria-labelledby="titles-title">
            <div class="section-intro" data-reveal><span class="section-number">03 / 04</span><p class="eyebrow"><span class="eyebrow__braces">{</span> Judul profesional <span class="eyebrow__braces">}</span></p></div>
            <div class="section-heading section-heading--split" data-reveal><h2 id="titles-title">Keahlian<br><span class="accent-green">{{ $studioName }}.</span></h2><p>{{ $settings['site_description'] ?? 'Konten belum tersedia.' }}</p></div>
            <div class="capability-list">
                @forelse ($titles as $index => $title)
                    <article class="capability capability--{{ ['orange', 'pink', 'lilac', 'blue'][$index % 4] }}" data-reveal><div class="capability__visual capability__visual--{{ ['orange', 'pink', 'lilac', 'blue'][$index % 4] }}" aria-hidden="true"><span>{{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}</span><i></i><i></i><i></i></div><div class="capability__content"><div class="capability__meta"><span class="category-label">{{ $title->is_primary ? 'Primary' : 'Focus' }}</span><span>{{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}</span></div><h3>{{ $title->title }}</h3><p>{{ $title->description ?: 'Konten belum tersedia.' }}</p></div></article>
                @empty
                    <article class="capability capability--blue" data-reveal><div class="capability__content"><h3>Konten belum tersedia.</h3><p>Tambahkan judul profesional melalui panel admin.</p></div></article>
                @endforelse
            </div>
        </section>

        <section class="contact section-shell" id="contact" aria-labelledby="contact-title"><div class="contact__glow" aria-hidden="true"></div><div class="contact__content" data-reveal><p class="eyebrow"><span class="eyebrow__braces">{</span> Kontak <span class="eyebrow__braces">}</span></p><h2 id="contact-title">Mari buat<br><span class="hero__outline">sesuatu</span><br><span class="accent-green">berarti.</span></h2><p class="contact__description">{{ $settings['site_tagline'] ?? 'Konten belum tersedia.' }}</p>@if ($email)<a class="button button--large button--gradient" href="mailto:{{ $email }}">{{ $email }} <span aria-hidden="true">↗</span></a>@endif</div><div class="contact-form" data-reveal data-reveal-delay="150"><div class="form-heading"><span>Informasi kontak</span><span>{{ $location ?: 'Konten belum tersedia.' }}</span></div>@if ($profile?->phone ?: ($settings['phone'] ?? null))<p>{{ $profile?->phone ?: $settings['phone'] }}</p>@endif @if ($profile?->availability_text ?: ($settings['availability_label'] ?? null))<p>{{ $profile?->availability_text ?: $settings['availability_label'] }}</p>@endif @forelse ($socialLinks as $link)<p><a class="text-link" href="{{ $link->url }}" @if ($link->open_in_new_tab) target="_blank" rel="noreferrer" @endif>{{ $link->label }} <span aria-hidden="true">↗</span></a></p>@empty<p>Konten belum tersedia.</p>@endforelse</div></section>
    </main>

    <footer class="site-footer"><div class="footer__top section-shell"><a class="brand" href="#top" aria-label="Kembali ke atas"><span class="brand__mark">{{ mb_strtoupper(mb_substr($studioName, 0, 1)) }}</span><span>{{ $studioName }}</span></a><p>{{ $settings['site_tagline'] ?? 'Portfolio digital' }}<br>{{ $location }}</p>@if ($email)<button class="text-link footer__email" type="button" data-copy-email data-email="{{ $email }}">Salin email <span aria-hidden="true">↗</span></button>@endif</div><div class="footer__bottom section-shell"><span>© <span data-year></span> {{ $displayName }}</span><div><a href="#about">Tentang</a><a href="#titles">Keahlian</a><a href="#contact">Kontak</a></div><div>@foreach ($socialLinks as $link)<a href="{{ $link->url }}" @if ($link->open_in_new_tab) target="_blank" rel="noreferrer" @endif>{{ $link->label }} ↗</a>@endforeach</div></div></footer>
    <script type="module" src="{{ url('/script.js') }}"></script>
</body>
</html>
