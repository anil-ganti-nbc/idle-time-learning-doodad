import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { complete } from "./providers.ts";

describe("provider failures", () => {
  it("fails closed when OpenAI has no key", async () => {
    const r = await complete({
      provider: "openai",
      model: "gpt-4o",
      system: "sys",
      user: "hello",
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.match(r.error, /key/i);
  });

  it("fails closed when local has no base URL", async () => {
    const r = await complete({
      provider: "local",
      model: "local-model",
      system: "sys",
      user: "hello",
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.match(r.error, /base URL/i);
  });
});
