import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicSources = ['index.html', 'js/public.js', 'js/projects.js', 'js/project-detail.js', 'js/portfolio-builder.js', 'js/public-portfolio.js']

test('public source does not contain the removed local content fallback', () => {
  const source = publicSources.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n')
  assert.doesNotMatch(source, /LOCAL_FALLBACK|mergeWithLocalFallback/)
  assert.doesNotMatch(source, /Taufik Raihandani|Banjarmasin|hello@bworiey/)
})
