import test from "node:test";
import assert from "node:assert/strict";
import worker from "../worker/index.js";

test("unknown vocabulary endpoint authenticates and dispatches a bounded record to History", async () => {
  const originalFetch = globalThis.fetch;
  let dispatched = null;
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), "https://api.github.com/repos/Amir-Studio/History/dispatches");
    dispatched = JSON.parse(options.body);
    return new Response(null, { status: 204 });
  };
  try {
    const request = new Request("https://worker.test/vocabulary/unknown", {
      method: "POST",
      headers: { "content-type": "application/json", "x-vocabulary-secret": "test-shared-secret" },
      body: JSON.stringify({
        term: "stagflation",
        language: "en",
        context: "The report discusses stagflation and weak output.",
        source_url: "https://example.com/report",
        source_title: "Economic report",
        domain: ["economy"],
        captured_at: "2026-11-16T00:00:00Z"
      })
    });
    const response = await worker.fetch(request, {
      HISTORY_VOCABULARY_SECRET: "test-shared-secret",
      HISTORY_GITHUB_TOKEN: "test-github-token"
    });
    const body = await response.json();
    assert.equal(response.status, 202);
    assert.equal(body.status, "queued");
    assert.equal(dispatched.event_type, "unknown-vocabulary");
    assert.equal(dispatched.client_payload.record.term, "stagflation");
    assert.equal(dispatched.client_payload.record.language, "en");
    assert.equal(dispatched.client_payload.record.context, "The report discusses stagflation and weak output.");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("unknown vocabulary endpoint rejects unauthenticated requests", async () => {
  const request = new Request("https://worker.test/vocabulary/unknown", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ term: "stagflation", language: "en", context: "example" })
  });
  const response = await worker.fetch(request, {
    HISTORY_VOCABULARY_SECRET: "configured-secret",
    HISTORY_GITHUB_TOKEN: "test-github-token"
  });
  assert.equal(response.status, 401);
});

test("unknown vocabulary endpoint rejects unsafe source URLs", async () => {
  const request = new Request("https://worker.test/vocabulary/unknown", {
    method: "POST",
    headers: { "content-type": "application/json", "x-vocabulary-secret": "configured-secret" },
    body: JSON.stringify({ term: "stagflation", language: "en", context: "example", source_url: "javascript:alert(1)" })
  });
  const response = await worker.fetch(request, {
    HISTORY_VOCABULARY_SECRET: "configured-secret",
    HISTORY_GITHUB_TOKEN: "test-github-token"
  });
  assert.equal(response.status, 400);
});

test("unknown vocabulary endpoint rejects oversized streamed bodies without content-length", async () => {
  const request = new Request("https://worker.test/vocabulary/unknown", {
    method: "POST",
    headers: { "content-type": "application/json", "x-vocabulary-secret": "configured-secret" },
    body: JSON.stringify({ term: "x", language: "en", context: "a".repeat(12000) })
  });
  const response = await worker.fetch(request, {
    HISTORY_VOCABULARY_SECRET: "configured-secret",
    HISTORY_GITHUB_TOKEN: "test-github-token"
  });
  assert.equal(response.status, 413);
});

test("unknown vocabulary endpoint requires JSON content type", async () => {
  const request = new Request("https://worker.test/vocabulary/unknown", {
    method: "POST",
    headers: { "content-type": "text/plain", "x-vocabulary-secret": "configured-secret" },
    body: '{"term":"stagflation","language":"en","context":"example"}'
  });
  const response = await worker.fetch(request, {
    HISTORY_VOCABULARY_SECRET: "configured-secret",
    HISTORY_GITHUB_TOKEN: "test-github-token"
  });
  assert.equal(response.status, 415);
});
