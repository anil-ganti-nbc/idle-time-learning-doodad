import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { keychainSecretStore, parseSecrets, SECRET_PRIORITY, secretFor, secretPatch } from "./secrets.ts";

describe("browser secret helpers", () => {
  it("only keeps known string keys", () => {
    const parsed = parseSecrets({
      openai: " sk-live ",
      xai: "",
      extra: "drop-me",
      localBaseUrl: "http://127.0.0.1:11434/v1",
    });
    assert.equal(parsed.openai, "sk-live");
    assert.equal(parsed.xai, undefined);
    assert.equal("extra" in parsed, false);
    assert.equal(parsed.localBaseUrl, "http://127.0.0.1:11434/v1");
  });

  it("maps providers without inventing values", () => {
    assert.equal(secretFor("openai", { openai: "sk" }), "sk");
    assert.equal(secretFor("anthropic", {}), "");
    assert.deepEqual(secretPatch("gemini", "g"), { gemini: "g" });
  });

  it("leaves a keychain hook that is unused in the browser app", () => {
    assert.equal(keychainSecretStore(), null);
    assert.deepEqual(SECRET_PRIORITY, ["env", "file", "browser"]);
  });
});
