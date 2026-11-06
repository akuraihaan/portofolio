import { getAccessContext, hasPermission } from './auth.js'
import { listSettings, saveSettings } from './services/settings-service.js'
import { getPublicContent } from './services/public-content-service.js'
import { normalizeAppearance } from './extra-template.js'
import { escapeHtml as e } from './utils.js'

// One private settings row and one public snapshot; publishing is one atomic upsert.
export async function loadAppearancePreview(settings) {
  if (new URLSearchParams(location.search).get('appearance-preview') !== '1') return settings
  const context = await getAccessContext(true)
  if (!context?.profile?.is_active || !hasPermission(context, 'settings.view')) throw new Error('Preview memerlukan akses admin.')
  const result = await listSettings({ keys: ['appearance_draft'] })
  if (result.error) throw result.error
  return { ...settings, appearance_published: result.data?.[0]?.value || settings.appearance_published }
}

export async function renderTemplateAdmin(context, services = { listSettings, saveSettings, getPublicContent }) {
  const host = document.createElement('section')
  host.className = 'admin-card extra-editor'
  document.querySelector('#admin-content').prepend(host)
  host.innerHTML = '<h2>Desain portfolio</h2><p>Memuat draft tampilan…</p>'
  try {
    const [result, content] = await Promise.all([services.listSettings({ keys: ['appearance_draft', 'appearance_published'] }), services.getPublicContent()])
    if (result.error) throw result.error
    let config = normalizeAppearance(result.data.find(row => row.key === 'appearance_draft')?.value || result.data.find(row => row.key === 'appearance_published')?.value)
    const canManage = hasPermission(context, 'settings.update')
    const input = (name, label, value, type = 'text') => `<label class="admin-field"><span>${e(label)}</span><input name="${name}" type="${type}" value="${e(value)}" ${type === 'number' ? 'min="0" max="100"' : ''}></label>`
    const draw = () => {
      host.innerHTML = `<h2>Desain portfolio</h2><p>Draft tampilan terpisah dari tampilan publik. Foto dan bio dikelola di <a href="/admin/profile">Profil</a>; foto hero di <a href="/admin/settings">Pengaturan situs</a>. Perubahan konten mengikuti publikasi masing-masing modul.</p><form data-extra-form><fieldset ${canManage ? '' : 'disabled'}><legend>Pilihan desain</legend><div class="extra-template-options">${['default', 'extra'].map(type => `<label><input type="radio" name="template" value="${type}" ${config.template === type ? 'checked' : ''}><span class="extra-thumbnail extra-thumbnail--${type}" aria-hidden="true"><i></i><b></b><em></em></span><strong>${type === 'extra' ? 'Extra' : 'Desain saat ini'}</strong></label>`).join('')}</div><div class="admin-form-grid"><label class="admin-field"><span>Foto hero</span><select name="photoSource"><option value="profile" ${config.photoSource === 'profile' ? 'selected' : ''}>Foto profil</option><option value="hero" ${config.photoSource === 'hero' ? 'selected' : ''}>Media hero dari pengaturan situs</option></select></label>${input('focalX', 'Posisi foto horizontal (%)', config.focalX, 'number')}${input('focalY', 'Posisi foto vertikal (%)', config.focalY, 'number')}${input('accent', 'Warna aksen', config.accent, 'color')}<label class="admin-checkbox"><input type="checkbox" name="motion" ${config.motion ? 'checked' : ''}>Animasi ringan</label></div><h3>Keahlian yang disorot</h3><div class="extra-checks">${content.skills.data.map(skill => `<label><input type="checkbox" name="skillIds" value="${e(skill.id)}" ${config.skillIds.includes(String(skill.id)) ? 'checked' : ''}>${e(skill.name)}</label>`).join('') || '<p>Tambahkan dan publikasikan keahlian melalui menu Keahlian.</p>'}</div><h3>Proyek unggulan dan posisi cover</h3>${content.projects.data.map(project => `<div class="extra-project-setting"><label><input type="checkbox" name="featuredIds" value="${e(project.id)}" ${config.featuredIds.includes(String(project.id)) ? 'checked' : ''}>${e(project.title)}</label>${input('cropX_' + project.id, 'Horizontal (%)', config.crops[project.id]?.x ?? 50, 'number')}${input('cropY_' + project.id, 'Vertikal (%)', config.crops[project.id]?.y ?? 50, 'number')}</div>`).join('') || '<p>Proyek published akan tersedia di sini.</p>'}<h3>Kartu informasi hero</h3><p>Maksimal tiga kartu berisi data ditampilkan sesuai urutan.</p><div>${config.cards.map((card, i) => `<fieldset data-card="${i}"><legend>Kartu ${i + 1}</legend><div class="admin-form-grid">${input('label_' + i, 'Label', card.label)}<label class="admin-field"><span>Sumber nilai</span><select name="source_${i}">${Object.entries({ custom: 'Teks sendiri', role: 'Profesi dari hero', availability: 'Status dari hero', skills: 'Keahlian pilihan', projects: 'Jumlah proyek published' }).map(([value, label]) => `<option value="${value}" ${card.source === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label>${input('value_' + i, 'Isi (untuk teks sendiri)', card.value)}<label><input type="checkbox" name="visible_${i}" ${card.visible ? 'checked' : ''}>Tampilkan</label></div><div class="admin-row-actions"><button type="button" data-move="${i}" data-direction="-1" ${i === 0 ? 'disabled' : ''}>Naik</button><button type="button" data-move="${i}" data-direction="1" ${i === config.cards.length - 1 ? 'disabled' : ''}>Turun</button><button type="button" data-remove="${i}">Hapus kartu</button></div></fieldset>`).join('')}</div><button type="button" data-add ${config.cards.length >= 20 ? 'disabled' : ''}>Tambah kartu</button><div class="admin-form-actions"><button class="admin-secondary-button" type="submit">Simpan draft</button><button class="admin-primary-button" type="button" data-publish>Publikasikan tampilan</button><button type="button" data-preview>Preview draft tersimpan</button></div></fieldset><p role="status" data-status></p></form><div class="extra-preview-controls"><button type="button" data-size="1440">Desktop</button><button type="button" data-size="390">Mobile</button><button type="button" data-size="360">360px</button><button type="button" data-size="768">768px</button><button type="button" data-size="1024">1024px</button></div><div class="extra-preview-wrap"><iframe title="Preview draft desain portfolio" hidden></iframe></div>`
    }
    const read = () => {
      const form = host.querySelector('form'); const data = new FormData(form)
      config = normalizeAppearance({ ...config, template: data.get('template'), photoSource: data.get('photoSource'), focalX: data.get('focalX'), focalY: data.get('focalY'), accent: data.get('accent'), motion: data.has('motion'), skillIds: data.getAll('skillIds'), featuredIds: data.getAll('featuredIds'), crops: Object.fromEntries(content.projects.data.map(p => [p.id, { x: data.get('cropX_' + p.id), y: data.get('cropY_' + p.id) }])), cards: config.cards.map((card, i) => ({ label: data.get('label_' + i), value: data.get('value_' + i), source: data.get('source_' + i), visible: data.has('visible_' + i) })) })
    }
    const save = async publish => {
      if (!canManage || !host.querySelector('form').reportValidity()) return false
      read()
      const status = host.querySelector('[data-status]')
      host.querySelector('form fieldset').disabled = true
      try {
        const result = await services.saveSettings({ key: publish ? 'appearance_published' : 'appearance_draft', group_name: 'appearance', value: config, is_public: publish, updated_by: context.user.id })
        if (result.error) throw result.error
        status.textContent = publish ? 'Tampilan dipublikasikan. Muat ulang halaman publik untuk melihatnya.' : 'Draft tersimpan; tampilan publik tetap memakai publikasi terakhir.'
        return true
      } catch (error) { status.textContent = 'Gagal menyimpan tampilan: ' + (error.message || 'Periksa koneksi dan izin.'); return false }
      finally { host.querySelector('form fieldset').disabled = false }
    }
    draw()
    host.addEventListener('submit', async event => { event.preventDefault(); await save(false) })
    host.addEventListener('click', async event => {
      const button = event.target.closest('button'); if (!button) return
      if (button.dataset.size) { host.querySelector('iframe').style.width = button.dataset.size + 'px'; return }
      if (!canManage) return
      if (button.hasAttribute('data-publish')) { await save(true); return }
      if (button.hasAttribute('data-preview')) { if (await save(false)) { const frame = host.querySelector('iframe'); frame.hidden = false; frame.src = (services.previewUrl || '/?appearance-preview=1') + '&t=' + Date.now() } return }
      read()
      if (button.hasAttribute('data-add')) config.cards.push({ label: '', value: '', source: 'custom', visible: true })
      else if (button.hasAttribute('data-remove')) config.cards.splice(Number(button.dataset.remove), 1)
      else if (button.hasAttribute('data-move')) { const i = Number(button.dataset.move), j = i + Number(button.dataset.direction); if (j >= 0 && j < config.cards.length) [config.cards[i], config.cards[j]] = [config.cards[j], config.cards[i]] }
      else return
      draw()
      host.querySelector('[data-add]')?.focus()
    })
  } catch (error) { host.innerHTML = '<h2>Desain portfolio</h2><p role="alert">Pengaturan tidak dapat dimuat. ' + e(error.message) + '</p>' }
}
