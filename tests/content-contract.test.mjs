import test from 'node:test'
import assert from 'node:assert/strict'
import { CONTENT_STATUSES, normalizeContentStatus, validateContentPayload } from '../js/content-schema.js'

test('content status contract includes every lifecycle state', () => {
  assert.deepEqual(CONTENT_STATUSES, ['draft', 'published', 'hidden', 'archived'])
  assert.equal(normalizeContentStatus('PUBLISHED'), 'published')
  assert.equal(normalizeContentStatus('unknown'), 'draft')
})

test('content validation rejects incomplete records', () => {
  const result = validateContentPayload('projects', { title: '', slug: '' })
  assert.equal(result.ok, false)
  assert.equal(result.errors.length, 2)
})

test('content validation accepts a publishable record', () => {
  const result = validateContentPayload('projects', { title: 'Project', slug: 'project', status: 'published', sort_order: 0 })
  assert.equal(result.ok, true)
})

test('content validation rejects malformed links and slugs', () => {
  const result = validateContentPayload('projects', { title: 'Project', slug: 'bad slug', project_url: 'javascript:alert(1)', status: 'published' })
  assert.equal(result.ok, false)
  assert.match(result.errors.join(' '), /Slug|project_url/)
})
