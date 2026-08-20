import assert from "node:assert/strict";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { keySourceMap, resolveLocalBaseUrl, resolveProviderKey } from "./keys.server.ts";

describe("server key resolution", () => {
  it("prefers environment over a user-supplied browser key", () => {
    const prev = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "env-openai";
    try {
      const resolved = resolveProviderKey("openai", "browser-openai");
      assert.equal(resolved.source, "env");
      assert.equal(resolved.key, "env-openai");
    } finally {
      if (prev === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = prev;
    }
  });

  it("uses a local secrets file before the browser fallback", () => {
    const prevKey = process.env.ANTHROPIC_API_KEY;
    const prevFile = process.env.DAU_SECRETS_FILE;
    const path = join(tmpdir(), `dau-secrets-test-${Date.now()}.json`);
    writeFileSync(path, JSON.stringify({ anthropic: "file-anthropic" }));
    delete process.env.ANTHROPIC_API_KEY;
    process.env.DAU_SECRETS_FILE = path;
    try {
      const resolved = resolveProviderKey("anthropic", "browser-anthropic");
      assert.equal(resolved.source, "file");
      assert.equal(resolved.key, "file-anthropic");
    } finally {
      unlinkSync(path);
      if (prevKey === undefined) delete process.env.ANTHROPIC_API_KEY;
      else process.env.ANTHROPIC_API_KEY = prevKey;
      if (prevFile === undefined) delete process.env.DAU_SECRETS_FILE;
      else process.env.DAU_SECRETS_FILE = prevFile;
    }
  });

  it("falls back to the user key and never publishes values in status", () => {
    const prev = process.env.GEMINI_API_KEY;
    const prevGoogle = process.env.GOOGLE_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    try {
      const resolved = resolveProviderKey("gemini", "browser-gemini");
      assert.equal(resolved.source, "user");
      assert.equal(resolved.key, "browser-gemini");
      const sources = keySourceMap();
      assert.ok(sources.gemini === "env" || sources.gemini === "file" || sources.gemini === "none");
      assert.equal(JSON.stringify(sources).includes("browser-gemini"), false);
    } finally {
      if (prev === undefined) delete process.env.GEMINI_API_KEY;
      else process.env.GEMINI_API_KEY = prev;
      if (prevGoogle === undefined) delete process.env.GOOGLE_API_KEY;
      else process.env.GOOGLE_API_KEY = prevGoogle;
    }
  });

  it("rejects a browser-supplied non-loopback local URL", () => {
    const prev = process.env.DAU_LOCAL_BASE_URL;
    delete process.env.DAU_LOCAL_BASE_URL;
    try {
      const resolved = resolveLocalBaseUrl("http://169.254.169.254/latest/meta-data");
      assert.equal(resolved.source, "user");
      assert.equal(resolved.url, undefined);
      assert.match(resolved.error ?? "", /loopback/i);
    } finally {
      if (prev === undefined) delete process.env.DAU_LOCAL_BASE_URL;
      else process.env.DAU_LOCAL_BASE_URL = prev;
    }
  });

  it("trusts an operator env local URL that is not loopback", () => {
    const prev = process.env.DAU_LOCAL_BASE_URL;
    process.env.DAU_LOCAL_BASE_URL = "http://ollama.internal:11434/v1/";
    try {
      const resolved = resolveLocalBaseUrl("http://127.0.0.1:9/v1");
      assert.equal(resolved.source, "env");
      assert.equal(resolved.url, "http://ollama.internal:11434/v1");
      assert.equal(resolved.error, undefined);
    } finally {
      if (prev === undefined) delete process.env.DAU_LOCAL_BASE_URL;
      else process.env.DAU_LOCAL_BASE_URL = prev;
    }
  });
});
