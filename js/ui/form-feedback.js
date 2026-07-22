export function setFormSubmitting(form, submitting, label = 'Mengirim…') {
  const button = form?.querySelector('button[type="submit"]')
  if (!button) return
  if (submitting) {
    button.dataset.defaultLabel = button.textContent
    button.disabled = true
    button.setAttribute('aria-busy', 'true')
    button.textContent = label
  } else {
    button.disabled = false
    button.removeAttribute('aria-busy')
    button.textContent = button.dataset.defaultLabel || button.textContent
  }
}

export function setFieldError(field, message = '') {
  if (!field) return
  field.setAttribute('aria-invalid', String(Boolean(message)))
  field.closest('label')?.classList.toggle('has-error', Boolean(message))
  let feedback = field.closest('label')?.querySelector('[data-field-error]')
  if (message && !feedback) {
    feedback = document.createElement('small')
    feedback.dataset.fieldError = ''
    field.closest('label')?.append(feedback)
  }
  if (feedback) {
    feedback.textContent = message
    feedback.hidden = !message
  }
}

export function resetFormState(form, status) {
  form?.querySelectorAll('[aria-invalid="true"]').forEach(field => setFieldError(field))
  if (status) status.textContent = ''
}

