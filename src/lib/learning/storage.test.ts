import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  inspectStorage,
  liveStorage,
  memoryStorage,
  persistStorage,
  probeWebStorage,
  secretsStorage,
} from "./storage.ts";

describe("storage fallbacks", () => {
  it("round-trips a memory store", () => {
    const store = memoryStorage({ a: "1" });
    assert.equal(store.getItem("a"), "1");
    store.setItem("b", "2");
    assert.equal(store.getItem("b"), "2");
    store.removeItem("a");
    assert.equal(store.getItem("a"), null);
  });

  it("treats a throwing store as unavailable", () => {
    const throwing = {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
      removeItem() {
        throw new Error("blocked");
      },
    };
    assert.equal(probeWebStorage(throwing), false);
  });

  it("uses memory on Node / SSR where Web Storage is missing", () => {
    const report = inspectStorage();
    assert.equal(report.local, "memory");
    assert.equal(report.session, "memory");
    assert.equal(report.available, false);
    assert.equal(typeof window, "undefined");
  });

  it("still reads and writes through the memory fallbacks", () => {
    persistStorage().setItem("k", "v");
    assert.equal(persistStorage().getItem("k"), "v");
    secretsStorage().setItem("s", "1");
    assert.equal(secretsStorage().getItem("s"), "1");
    liveStorage().setItem("live", "yes");
    assert.equal(liveStorage().getItem("live"), "yes");
  });
});
