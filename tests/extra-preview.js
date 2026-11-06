// Dev-only fixture entry. Not imported by the application or included in its build.
// The editor uses an isolated sessionStorage repository; no writes to Supabase.
import html from '../index.html?raw'
import { renderPublicContent } from '../js/public.js'
import { renderTemplateAdmin } from '../js/appearance-admin.js'
import { createPortfolioPreviewMarkup, normalizeBuilderData, normalizeState } from '../js/portfolio-builder.js'
import { initializeNavigation, initializeSectionNavigation, initializeSmoothScroll } from '../js/ui/navigation.js'
import { printPortfolio } from '../js/extra-template.js'
import { renderProject } from '../js/project-detail.js'

const key = 'extra-isolated-qa'
const photo = '/tests/extra-media.svg'
const result = data => ({ ok: true, data })
const appearance = { template: 'extra', accent: '#0075de', focalX: 50, focalY: 35, cards: [{ label: 'Bidang utama', source: 'role', visible: true }, { label: 'Proyek published', source: 'projects', visible: true }, { label: 'Ketersediaan', source: 'availability', visible: true }] }
const saved = () => JSON.parse(sessionStorage.getItem(key) || '{}')
const settings = saved()
const content = {
  settings: result({ owner_name: 'Pemilik Pengujian', appearance_published: settings.appearance_published?.value || appearance, owner_email: 'qa@example.test', site_name: 'Fixture Extra', resume_url: '/tests/extra-preview.html?version=1' }),
  profile: { full_name: 'Pemilik Pengujian', avatar_url: photo, bio: 'Saya merancang pengalaman digital yang mudah digunakan, mengembangkan website, dan mendokumentasikan proses pembelajaran. ' .repeat(3) },
  sections: result(['hero', 'about', 'skills', 'projects', 'experiences', 'educations', 'certificates', 'contact'].map((section_key, i) => ({ section_key, section_name: section_key, title: { hero: 'Pemilik Pengujian', about: 'Tentang saya', skills: 'Keahlian', projects: 'Proyek pilihan', experiences: 'Pengalaman', educations: 'Pendidikan', certificates: 'Sertifikasi', contact: 'Hubungi saya' }[section_key], description: 'Konten fixture lokal untuk memeriksa alur dan tata letak.', custom_data: section_key === 'hero' ? { roles: ['Web Developer & Learning Designer'], availability_status: 'Terbuka untuk kolaborasi' } : {}, is_visible: true, sort_order: i }))),
  projects: result([{ id: 'qa-project', status: 'published', slug: 'qa-project', title: 'Platform pembelajaran interaktif', summary: 'Studi kasus pengujian: merancang modul yang dapat digunakan pada berbagai ukuran layar.', category: 'Web Development', technologies: ['HTML', 'CSS'], thumbnail_url: photo, role: 'Developer', project_year: '2026' }]),
  skills: result([{ id: 'qa-skill', name: 'Desain antarmuka', category: 'Desain' }, { id: 'qa-skill2', name: 'JavaScript', category: 'Pengembangan' }]),
  experiences: result([{ id: 'qa-exp', company: 'Organisasi Pengujian', role_title: 'Pengembang', start_date: '2024-01-01', is_current: true, description: 'Mengembangkan aplikasi pendidikan.' }]),
  educations: result([{ id: 'qa-edu', institution: 'Institusi Pengujian', degree: 'Teknologi pendidikan', start_date: '2020-01-01', end_date: '2024-01-01' }]),
  certificates: result([{ id: 'qa-cert', title: 'Dokumen pengujian', issuer: 'Tim QA', certificate_url: photo, issue_date: '2026-01-01' }]),
  navigation: result([{ label: 'Beranda', href: '#hero', section_key: 'hero' }, { label: 'Keahlian', href: '#capabilities', section_key: 'skills' }, { label: 'Proyek', href: '#work', section_key: 'projects' }, { label: 'Kontak', href: '#contact', section_key: 'contact' }]),
  socialLinks: result([]), statistics: result([]), projectMedia: result([]), articles: result([]), services: result([]), achievements: result([]), testimonials: result([])
}
const params = new URLSearchParams(location.search)
if (params.has('detail')) {
  renderProject(content.projects.data[0], [], content)
} else if (params.has('admin')) {
  document.body.innerHTML = '<main id="admin-content" style="max-width:1100px;margin:auto;padding:24px"><h1>Editor — penyimpanan uji terisolasi</h1></main>'
  await renderTemplateAdmin({ user: { id: 'qa-admin' }, permissions: ['settings.view', 'settings.update'] }, {
    listSettings: async () => ({ data: Object.values(saved()), error: null }),
    getPublicContent: async () => content,
    saveSettings: async row => { sessionStorage.setItem(key, JSON.stringify({ ...saved(), [row.key]: structuredClone(row) })); return { error: null } },
    previewUrl: '/tests/extra-preview.html?draft=1'
  })
} else if (params.has('version')) {
  const data = normalizeBuilderData(content)
  const state = normalizeState({ theme: 'extra', title: 'Versi Web Developer — QA', slug: 'qa-extra', selected_projects: ['qa-project'], selected_skills: ['qa-skill'], selected_experiences: ['qa-exp'], selected_educations: ['qa-edu'], selected_certificates: ['qa-cert'] }, data)
  document.body.innerHTML = '<button id="qa-print">Cetak / Simpan PDF</button><button id="qa-a4">Pratinjau CSS cetak A4</button>' + createPortfolioPreviewMarkup(state, data, { publicView: true })
  document.querySelector('#qa-print').onclick = () => printPortfolio('public-print-mode')
  document.querySelector('#qa-a4').onclick = () => {
    const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules]).filter(rule => rule.conditionText === 'print').map(rule => [...rule.cssRules].map(child => child.cssText).join('\n')).join('\n')
    const style = document.createElement('style')
    style.textContent = rules + '\nbody {width:210mm;margin:auto;padding:14mm;background:white} #qa-a4 {display:none}'
    document.head.append(style)
    document.body.classList.add('public-print-mode')
  }
} else {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  parsed.querySelectorAll('script').forEach(script => script.remove())
  document.body.innerHTML = parsed.body.innerHTML
  if (params.has('draft')) content.settings.data.appearance_published = saved().appearance_draft?.value || appearance
  renderPublicContent(content)
  initializeNavigation(); initializeSectionNavigation(); initializeSmoothScroll()
}
