import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractJson } from "./json.ts";

describe("extractJson", () => {
  it("parses a raw object", () => {
    const r = extractJson('{"title":"x"}');
    assert.equal(r.ok, true);
    if (r.ok) assert.equal((r.value as { title: string }).title, "x");
  });

  it("unwraps markdown fences", () => {
    const r = extractJson("```json\n{\"a\":1}\n```");
    assert.equal(r.ok, true);
  });

  it("rejects non-json", () => {
    const r = extractJson("I am a chatbot and here is a lesson...");
    assert.equal(r.ok, false);
  });

  it("rejects broken json", () => {
    const r = extractJson("{title:}");
    assert.equal(r.ok, false);
  });
});
