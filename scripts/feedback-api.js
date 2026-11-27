(() => {
  'use strict';
  const form = document.getElementById('feedback-form');
  const notice = document.getElementById('feedback-notice');
  const page = document.getElementById('feedback-page-url');
  if (!form || !notice || !page) return;
  const button = form.querySelector('button[type="submit"]');
  const label = button.textContent;
  const fields = ['kind', 'name', 'replyEmail', 'pageUrl', 'message', 'website'];
  try {
    const from = new URLSearchParams(location.search).get('from');
    if (from) {
      const url = new URL(from);
      if (url.origin === location.origin && !url.username && !url.password) {
        page.value = url.origin + url.pathname;
      }
    }
  } catch {}
  let busy = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    busy = true;
    button.disabled = true;
    button.textContent = form.dataset.busy;
    notice.hidden = true;
    const input = new FormData(form);
    const data = Object.fromEntries(fields.map(key => [key, String(input.get(key) || '')]));
    data.consent = input.get('consent') === 'yes';
    data.consentVersion = 'feedback-2026-11-27-v1';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST', credentials: 'omit', redirect: 'error',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data), signal: controller.signal
      });
      if (response.status === 429) {
        notice.textContent = form.dataset.rate;
        return;
      }
      const result = await response.json();
      if (response.status !== 201 || result.ok !== true ||
          result.status !== 'accepted' || typeof result.id !== 'string') {
        throw new Error('Unconfirmed submission');
      }
      notice.textContent = form.dataset.success + result.id;
      const relatedPage = page.value;
      form.reset();
      page.value = relatedPage;
    } catch {
      notice.textContent = form.dataset.error;
    } finally {
      clearTimeout(timer);
      notice.hidden = false;
      button.textContent = label;
      button.disabled = false;
      busy = false;
    }
  });
  button.disabled = false;
})();
