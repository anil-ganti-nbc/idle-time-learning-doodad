import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isLoopbackHost, parseHttpUrl, sanitizeLocalBaseUrl } from "./local-url.ts";

describe("local provider URL bounds", () => {
  it("accepts loopback http(s) for user input", () => {
    const ok = sanitizeLocalBaseUrl("http://127.0.0.1:11434/v1/", "user");
    assert.equal(ok.ok, true);
    if (ok.ok) assert.equal(ok.url, "http://127.0.0.1:11434/v1");
    assert.equal(sanitizeLocalBaseUrl("http://localhost:8080/v1", "user").ok, true);
    assert.equal(isLoopbackHost("::1"), true);
  });

  it("rejects file, credentials, and empty-invalid URLs", () => {
    assert.equal(parseHttpUrl("file:///etc/passwd").ok, false);
    assert.equal(parseHttpUrl("http://user:pass@127.0.0.1/v1").ok, false);
    assert.equal(sanitizeLocalBaseUrl("not a url", "user").ok, false);
    assert.equal(sanitizeLocalBaseUrl("   ", "user").ok, true);
  });

  it("blocks browser-supplied non-loopback hosts", () => {
    const meta = sanitizeLocalBaseUrl("http://169.254.169.254/latest/meta-data", "user");
    assert.equal(meta.ok, false);
    if (!meta.ok) assert.match(meta.error, /loopback/i);
    assert.equal(sanitizeLocalBaseUrl("http://10.0.0.8/v1", "user").ok, false);
    assert.equal(sanitizeLocalBaseUrl("https://api.openai.com/v1", "user").ok, false);
  });

  it("allows operator env/file URLs that are not loopback", () => {
    const env = sanitizeLocalBaseUrl("http://ollama.internal:11434/v1", "env");
    assert.equal(env.ok, true);
    if (env.ok) assert.equal(env.url, "http://ollama.internal:11434/v1");
    assert.equal(sanitizeLocalBaseUrl("https://llm.example.com/v1", "file").ok, true);
  });
});
