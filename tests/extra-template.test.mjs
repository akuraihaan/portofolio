import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeAppearance, heroCards, cardsMarkup, accentTextColor, printPortfolio } from '../js/extra-template.js'
import { createPortfolioPreviewMarkup, normalizeBuilderData, normalizeState } from '../js/portfolio-builder.js'
import { getRoute } from '../js/router.js'

test('appearance clamps crop positions and rejects unsafe styles', () => {
  const config = normalizeAppearance({ template: 'extra', accent: 'red;background:url(x)', focalX: -20, focalY: 500, crops: { p: { x: 'bad', y: 500 } }, cards: [null] })
  assert.equal(config.accent, '#0075de'); assert.equal(config.focalX, 0); assert.equal(config.focalY, 100)
  assert.deepEqual(config.crops.p, { x: 50, y: 100 }); assert.deepEqual(config.cards, [])
})
test('hero cards omit absent data, drafts, scheduled projects and hidden cards, and preserve order', () => {
  const config = normalizeAppearance({ cards: [{ source: 'role', label: 'Profesi' }, { source: 'custom', label: 'Rahasia', value: 'hidden', visible: false }, { source: 'projects', label: 'Proyek' }, { label: 'A', value: '<script>' }, { label: 'B', value: 'B' }, { label: 'C', value: 'C' }] })
  const cards = heroCards(config, { projects: [{ status: 'draft' }, { status: 'published' }, { status: 'published', published_at: '2999-01-01' }] })
  assert.deepEqual(cards.map(c => c.label), ['Proyek', 'A', 'B']); assert.equal(cards[0].value, '1')
  assert.ok(cardsMarkup(cards).includes('&lt;script&gt;')); assert.ok(!cardsMarkup(cards).includes('<script>'))
})
test('accent button chooses readable text for light and dark fills', () => {
  assert.equal(accentTextColor('#ffffff'), '#000000'); assert.equal(accentTextColor('#02093a'), '#ffffff')
})
test('existing version routes remain valid; malformed and nested routes are 404', () => {
  assert.equal(getRoute('/p/extra').name, 'portfolioVersion'); assert.equal(getRoute('/portfolio/extra').name, 'portfolioVersion')
  assert.equal(getRoute('/projects/example/invalid').name, 'notFound'); assert.equal(getRoute('/projects/%zz').name, 'notFound')
})

test('Extra web and print markup use the selected version content and a correct contact link', () => {
  globalThis.window = { location: { origin: 'https://portfolio.example.test' } }
  const data = normalizeBuilderData({ settings: { data: { owner_email: 'owner@example.test' } }, profile: { full_name: 'Test Owner' }, sections: { data: [{ section_key: 'projects', title: 'Projects' }, { section_key: 'contact', title: 'Contact' }] }, projects: { data: [{ id: 'a', slug: 'selected', title: 'Selected content', status: 'published' }, { id: 'b', slug: 'excluded', title: 'Excluded content', status: 'published' }] } })
  const state = normalizeState({ theme: 'extra', slug: 'web', selected_projects: ['a'] }, data)
  const markup = createPortfolioPreviewMarkup(state, data, { publicView: true })
  assert.ok(markup.includes('data-document-theme="extra"')); assert.ok(markup.includes('Selected content')); assert.ok(!markup.includes('Excluded content'))
  assert.ok(markup.includes('href="mailto:owner@example.test"')); assert.ok(markup.includes('https://portfolio.example.test/portfolio/web'))
  delete globalThis.window
})

test('printing waits for fonts and images and clears print mode after the dialog', async () => {
  const order = []; let cleanup
  globalThis.document = { body: { classList: { add: c => order.push(c), remove: c => order.push('remove:' + c) } }, fonts: { ready: Promise.resolve().then(() => order.push('fonts')) }, images: [{ loading: 'lazy', decode: async () => { order.push('image') } }] }
  globalThis.window = { addEventListener: (name, fn) => { cleanup = fn }, print: () => order.push('print') }
  globalThis.requestAnimationFrame = fn => fn()
  await printPortfolio('qa-print')
  assert.ok(order.indexOf('fonts') < order.indexOf('print')); assert.ok(order.indexOf('image') < order.indexOf('print')); assert.equal(document.images[0].loading, 'eager')
  cleanup(); assert.equal(order.at(-1), 'remove:qa-print')
  delete globalThis.document; delete globalThis.window; delete globalThis.requestAnimationFrame
})
