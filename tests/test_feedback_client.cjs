const assert = require('node:assert/strict');
const { test } = require('node:test');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../scripts/feedback-api.js'), 'utf8');

function setup(fetch, from = 'https://dchai.ru/about/author.html?token=secret#part') {
  const page = { value: '' };
  const button = { disabled: true, textContent: 'Send' };
  const notice = { hidden: true, textContent: '' };
  const values = { kind: 'suggestion', name: 'Test', replyEmail: '', message: 'Test message 123', website: '', consent: 'yes' };
  let submit, resets = 0, calls = 0;
  const form = {
    dataset: { busy: 'Sending', success: 'Saved: ', rate: 'Rate limit', error: 'Unconfirmed' },
    querySelector: () => button,
    addEventListener: (type, handler) => { assert.equal(type, 'submit'); submit = handler; },
    reportValidity: () => true,
    reset: () => { resets++; values.message = ''; page.value = ''; }
  };
  vm.runInNewContext(source, {
    document: { getElementById: id => ({'feedback-form': form, 'feedback-notice': notice, 'feedback-page-url': page})[id] },
    location: { origin: 'https://dchai.ru', search: '?from=' + encodeURIComponent(from) },
    URL, URLSearchParams, AbortController, setTimeout, clearTimeout,
    FormData: class { get(key) { return key === 'pageUrl' ? page.value : values[key]; } },
    fetch: (...args) => { calls++; return fetch(...args); }
  });
  return { page, button, notice, form, values, submit: () => submit({preventDefault() {}}), calls: () => calls, resets: () => resets };
}
const accepted = () => ({status: 201, json: async () => ({ok: true, status: 'accepted', id: 'test-id'})});

test('201 sends only expected fields and clears message after acceptance', async () => {
  const s = setup(async (url, opts) => {
    assert.equal(url, '/api/feedback');
    assert.equal(opts.method, 'POST');
    assert.equal(opts.credentials, 'omit');
    assert.equal(opts.redirect, 'error');
    assert.equal(opts.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(opts.body), {kind:'suggestion',name:'Test',replyEmail:'',pageUrl:'https://dchai.ru/about/author.html',message:'Test message 123',website:'',consent:true,consentVersion:'feedback-2026-11-27-v1'});
    return accepted();
  });
  assert.equal(s.button.disabled, false);
  await s.submit();
  assert.equal(s.notice.textContent, 'Saved: test-id');
  assert.equal(s.notice.hidden, false);
  assert.equal(s.resets(), 1);
  assert.equal(s.page.value, 'https://dchai.ru/about/author.html');
  assert.equal(s.button.disabled, false);
});
for (const status of [400, 429, 500, 200]) {
  test('HTTP '+status+' retains input and does not report success', async () => {
    const s = setup(async () => ({status, json: async () => ({ok:true,status:'accepted',id:'wrong'})}));
    await s.submit();
    assert.equal(s.notice.textContent, status === 429 ? 'Rate limit' : 'Unconfirmed');
    assert.equal(s.values.message, 'Test message 123');
    assert.equal(s.resets(), 0);
    assert.equal(s.button.disabled, false);
  });
}
test('network failure retains input', async () => {
  const s = setup(async () => { throw new Error('offline'); });
  await s.submit();
  assert.equal(s.notice.textContent, 'Unconfirmed');
  assert.equal(s.resets(), 0);
});
test('malformed response is not success', async () => {
  const s = setup(async () => ({status:201,json:async()=>({ok:true})}));
  await s.submit();
  assert.equal(s.notice.textContent, 'Unconfirmed');
  assert.equal(s.resets(), 0);
});
test('double submit while pending issues only one request', async () => {
  let finish;
  const s = setup(() => new Promise(resolve => {finish = resolve;}));
  const pending = s.submit();
  assert.equal(s.button.disabled, true);
  await s.submit();
  assert.equal(s.calls(), 1);
  finish(accepted());
  await pending;
  assert.equal(s.button.disabled, false);
});
test('foreign source URL ignored and invalid form never submitted', async () => {
  const s = setup(async () => accepted(), 'https://example.com/private');
  assert.equal(s.page.value, '');
  s.form.reportValidity = () => false;
  await s.submit();
  assert.equal(s.calls(), 0);
});
