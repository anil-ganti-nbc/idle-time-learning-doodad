import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { describe, it } from "node:test";

import { decodeChudboxPracticeQuery, decodeCwPracticeQuery, decodeFabPracticeQuery, decodeMlPracticeQuery, decodeMovementBenchPracticeQuery, decodeOsPracticeQuery, decodePipelinePracticeQuery, decodePlPracticeQuery } from "../../../../dau-practice-labs/src/practice-labs/index.ts";

import { buildPracticeRequestForLesson, launchUrlForLesson, practiceLabsForLesson } from "./labs.ts";
import { cwModuleForConcept, horoModuleForConcept, mlModuleForConcept, moduleForConcept, netModuleForConcept, osModuleForConcept, ppModuleForConcept, semiModuleForConcept } from "./practice-map.ts";

/**
 * Exhaustive content-driven conformance: every music (mus / dm) lesson in the
 * curriculum must resolve to a practice module whose launch URL chudbox's
 * own schema accepts. New lessons are automatically covered.
 */

const LESSONS_DIR = join(dirname(new URL(import.meta.url).pathname), "..", "..", "content", "lessons");

interface LessonRef {
  id: string;
  conceptId: string;
  title: string;
  course: string;
}

function collectMusicLessons(): LessonRef[] {
  return collectLessons((conceptId) => conceptId.startsWith("mus-") || conceptId.startsWith("dm-"));
}

function collectHoroLessons(): LessonRef[] {
  return collectLessons((conceptId) => conceptId.startsWith("horo-"));
}

function collectLessons(keep: (conceptId: string) => boolean): LessonRef[] {
  const out: LessonRef[] = [];
  for (const entry of readdirSync(LESSONS_DIR)) {
    const dir = join(LESSONS_DIR, entry);
    if (!statSync(dir).isDirectory()) continue;
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      let parsed: unknown;
      try {
        parsed = JSON.parse(readFileSync(join(dir, file), "utf8"));
      } catch {
        continue;
      }
      if (!parsed || typeof parsed !== "object" || !("lessons" in parsed)) continue;
      const courseId = (parsed as { courseId?: string }).courseId ?? entry;
      for (const lesson of (parsed as { lessons: Array<Record<string, unknown>> }).lessons) {
        const conceptId = String(lesson.conceptId ?? "");
        if (!keep(conceptId)) continue;
        out.push({
          id: String(lesson.id),
          conceptId,
          title: String(lesson.title ?? ""),
          course: courseId,
        });
      }
    }
  }
  return out;
}

const ALL = collectMusicLessons();
const HORO = collectHoroLessons();

describe("per-lesson practice modules", () => {
  it("found music lessons to map (content sanity)", () => {
    assert.ok(ALL.length >= 150, `expected ~156 music lessons, found ${ALL.length}`);
  });

  it("every music lesson resolves to one of the six chudbox practice types", () => {
    const valid = new Set(["riff-cell", "rhythm-grid", "groove", "drum-feel", "grouping", "free"]);
    for (const lesson of ALL) {
      const mod = moduleForConcept(lesson.conceptId);
      assert.ok(
        valid.has(mod.practiceType),
        `${lesson.conceptId}: invalid practiceType ${mod.practiceType}`,
      );
    }
  });

  it("analysis/history concepts get exploratory free play, not graded drills", () => {
    for (const id of ["dm-history", "dm-lineage", "dm-tape-trading", "dm-production-listen"]) {
      assert.equal(moduleForConcept(id).practiceType, "free", `${id} should be free`);
    }
  });

  it("blast/double-kick concepts land on the drum machine with feels", () => {
    assert.equal(moduleForConcept("dm-blast").seedDrumFeel, "blast");
    assert.equal(moduleForConcept("dm-double-kick").seedDrumFeel, "hammer");
  });

  it("odd-meter concepts carry real group seeds", () => {
    const odd = moduleForConcept("mus-odd-meter");
    assert.equal(odd.practiceType, "grouping");
    assert.deepEqual(odd.groups, [3, 2, 2]);
  });

  it("EVERY music lesson launches into a payload chudbox accepts", () => {
    const failures: string[] = [];
    for (const lesson of ALL) {
      const request = buildPracticeRequestForLesson(lesson);
      const launch = launchUrlForLesson(lesson);
      if (!launch.ok) {
        failures.push(`${lesson.id}: launch failed — ${launch.message}`);
        continue;
      }
      const token = new URL(launch.url!).searchParams.get("practice") ?? "";
      const decoded = decodeChudboxPracticeQuery(token);
      if (!decoded.ok) {
        failures.push(`${lesson.id}: chudbox rejected — ${decoded.message}`);
        continue;
      }
      if (decoded.data.practiceType !== request.practiceType) {
        failures.push(`${lesson.id}: practiceType drifted in encode/decode`);
      }
    }
    assert.equal(failures.length, 0, `${failures.length}/${ALL.length} lessons failed:\n${failures.slice(0, 20).join("\n")}`);
  });

  it("sibling lessons of the same concept produce identical deterministic modules", () => {
    const a = buildPracticeRequestForLesson({ id: "dm-riff-cell-5", conceptId: "dm-riff-cell", title: "Short figure" });
    const b = buildPracticeRequestForLesson({ id: "dm-riff-cell-10", conceptId: "dm-riff-cell", title: "Repeat, shift" });
    assert.equal(a.practiceType, b.practiceType);
    assert.equal(a.parameters.tempo, b.parameters.tempo);
  });

  it("routes horology to movement-bench and music to chudbox", () => {
    const horo = buildPracticeRequestForLesson({ id: "horo-rate-10", conceptId: "horo-rate", title: "Seconds per day on the ticket" });
    assert.equal(horo.labId, "movement-bench");
    assert.equal(horo.practiceType, "regulate");

    const music = buildPracticeRequestForLesson({ id: "dm-riff-cell-10", conceptId: "dm-riff-cell", title: "Repeat, shift, or mutate" });
    assert.equal(music.labId, "chudbox");
  });

  it("regulation concepts regulate; complications complicate", () => {
    assert.equal(horoModuleForConcept("horo-amplitude").practiceType, "regulate");
    assert.equal(horoModuleForConcept("horo-positional").practiceType, "regulate");
    assert.equal(horoModuleForConcept("horo-chrono").practiceType, "complication");
    assert.equal(horoModuleForConcept("horo-column-wheel").practiceType, "complication");
    assert.equal(horoModuleForConcept("horo-power-reserve-ind").practiceType, "complication");
    assert.equal(horoModuleForConcept("horo-beat-error").practiceType, "escapement");
    assert.equal(horoModuleForConcept("horo-train-math").practiceType, "train-math");
    assert.equal(horoModuleForConcept("horo-tourbillon-honest").practiceType, "free");
  });

  it("EVERY horology lesson launches into a payload movement-bench accepts", () => {
    assert.ok(HORO.length >= 80, `expected ~82 horo lessons, found ${HORO.length}`);
    const failures: string[] = [];
    for (const lesson of HORO) {
      const launch = launchUrlForLesson(lesson);
      if (!launch.ok) {
        failures.push(`${lesson.id}: launch failed — ${launch.message}`);
        continue;
      }
      const token = new URL(launch.url!).searchParams.get("practice") ?? "";
      const decoded = decodeMovementBenchPracticeQuery(token);
      if (!decoded.ok) {
        failures.push(`${lesson.id}: movement-bench rejected — ${decoded.message}`);
        continue;
      }
      if (!decoded.data.lessonId.startsWith(`${decoded.data.conceptId}-`)) {
        failures.push(`${lesson.id}: id pairing drifted`);
      }
    }
    assert.equal(failures.length, 0, `${failures.length}/${HORO.length} horo lessons failed:\n${failures.slice(0, 20).join("\n")}`);
  });

  it("music lessons still route away from movement-bench", () => {
    for (const lesson of ALL.slice(0, 20)) {
      const labs = practiceLabsForLesson(lesson.course, lesson.conceptId);
      assert.ok(!labs.some((lab) => lab.labId === "movement-bench"), `${lesson.id} must not hit the bench`);
    }
  });

  // ----- Fab Lab (semi-*) -----

  it("routes semiconductors to fab-lab with sensible modules", () => {
    const litho = buildPracticeRequestForLesson({ id: "semi-rayleigh-10", conceptId: "semi-rayleigh", title: "Resolution is three knobs" });
    assert.equal(litho.labId, "fab-lab");
    assert.equal(litho.practiceType, "rayleigh");

    assert.equal(semiModuleForConcept("semi-yield-model").practiceType, "yield");
    assert.equal(semiModuleForConcept("semi-defect-class").practiceType, "yield");
    assert.equal(semiModuleForConcept("semi-integration").practiceType, "sequence");
    assert.equal(semiModuleForConcept("semi-gate-stack").practiceType, "sequence");
    assert.equal(semiModuleForConcept("semi-cmp").practiceType, "identify");
    assert.equal(semiModuleForConcept("semi-euv-source").practiceType, "identify");
  });

  it("EVERY semiconductor lesson launches into a payload fab-lab accepts", () => {
    const SEMI = collectLessons((conceptId) => conceptId.startsWith("semi-"));
    assert.ok(SEMI.length >= 80, `expected ~86 semi lessons, found ${SEMI.length}`);
    const failures: string[] = [];
    for (const lesson of SEMI) {
      const launch = launchUrlForLesson(lesson);
      if (!launch.ok) {
        failures.push(`${lesson.id}: launch failed — ${launch.message}`);
        continue;
      }
      const token = new URL(launch.url!).searchParams.get("practice") ?? "";
      const decoded = decodeFabPracticeQuery(token);
      if (!decoded.ok) {
        failures.push(`${lesson.id}: fab-lab rejected — ${decoded.message}`);
        continue;
      }
      if (!decoded.data.lessonId.startsWith(`${decoded.data.conceptId}-`)) {
        failures.push(`${lesson.id}: id pairing drifted`);
      }
    }
    assert.equal(failures.length, 0, `${failures.length}/${SEMI.length} semi lessons failed:\n${failures.slice(0, 20).join("\n")}`);
  });

  it("each family stays on its own machine", () => {
    for (const lesson of ALL.slice(0, 30)) {
      const labs = practiceLabsForLesson(lesson.course, lesson.conceptId);
      assert.ok(!labs.some((lab) => lab.labId === "fab-lab"), `${lesson.id} must not hit the fab`);
    }
    for (const lesson of collectLessons((c) => c.startsWith("horo-")).slice(0, 20)) {
      const labs = practiceLabsForLesson(lesson.course, lesson.conceptId);
      assert.ok(!labs.some((lab) => lab.labId === "chudbox" || lab.labId === "fab-lab"), `${lesson.id} misrouted`);
    }
  });
});

  // ----- Pipeline Playground (cpu/gpu/arch) -----

  it("routes microarchitecture to pipeline-playground with sensible modules", () => {
    const pipe = buildPracticeRequestForLesson({ id: "cpu-pipeline-10", conceptId: "cpu-pipeline", title: "Overlap is not a shorter instruction" });
    assert.equal(pipe.labId, "pipeline-playground");
    assert.equal(pipe.practiceType, "pipeline");

    assert.equal(ppModuleForConcept("cpu-cache-miss").practiceType, "cache");
    assert.equal(ppModuleForConcept("cpu-rob").practiceType, "schedule");
    assert.equal(ppModuleForConcept("cpu-branch-prediction").practiceType, "predictor");
    assert.equal(ppModuleForConcept("gpu-divergence").practiceType, "scenarios");
    assert.equal(ppModuleForConcept("arch-latency-throughput").practiceType, "scenarios");
  });

  it("EVERY cpu/gpu/arch lesson launches into a payload pipeline-playground accepts", () => {
    const PP = collectLessons((c) => c.startsWith("cpu-") || c.startsWith("gpu-") || c.startsWith("arch-"));
    assert.ok(PP.length >= 85, `expected ~89 microarch lessons, found ${PP.length}`);
    const failures: string[] = [];
    for (const lesson of PP) {
      const launch = launchUrlForLesson(lesson);
      if (!launch.ok) {
        failures.push(`${lesson.id}: launch failed — ${launch.message}`);
        continue;
      }
      const token = new URL(launch.url!).searchParams.get("practice") ?? "";
      const decoded = decodePipelinePracticeQuery(token);
      if (!decoded.ok) {
        failures.push(`${lesson.id}: pipeline-playground rejected — ${decoded.message}`);
        continue;
      }
      if (!decoded.data.lessonId.startsWith(`${decoded.data.conceptId}-`)) {
        failures.push(`${lesson.id}: id pairing drifted`);
      }
    }
    assert.equal(failures.length, 0, `${failures.length}/${PP.length} microarch lessons failed:\n${failures.slice(0, 20).join("\n")}`);
  });

  it("all four families stay on their own machines", () => {
    for (const lesson of collectLessons((c) => c.startsWith("semi-")).slice(0, 15)) {
      const labs = practiceLabsForLesson(lesson.course, lesson.conceptId);
      assert.ok(!labs.some((lab) => lab.labId === "pipeline-playground"), `${lesson.id} must not hit the playground`);
    }
    for (const lesson of collectLessons((c) => c.startsWith("horo-")).slice(0, 15)) {
      const labs = practiceLabsForLesson(lesson.course, lesson.conceptId);
      assert.ok(!labs.some((lab) => lab.labId === "pipeline-playground"), `${lesson.id} must not hit the playground`);
    }
  });

  // ----- Compiler Workbench (cmp-*) -----

  it("routes compilers to compiler-workbench with sensible modules", () => {
    const opt = buildPracticeRequestForLesson({ id: "cmp-const-fold-10", conceptId: "cmp-const-fold", title: "Arithmetic the compiler already sees" });
    assert.equal(opt.labId, "compiler-workbench");
    assert.equal(opt.practiceType, "optimize");

    assert.equal(cwModuleForConcept("cmp-token").practiceType, "parse");
    assert.equal(cwModuleForConcept("cmp-lr").practiceType, "parse");
    assert.equal(cwModuleForConcept("cmp-dce").practiceType, "optimize");
    assert.equal(cwModuleForConcept("cmp-liveness").practiceType, "dataflow");
    assert.equal(cwModuleForConcept("cmp-spill").practiceType, "backend");
    assert.equal(cwModuleForConcept("cmp-jit").practiceType, "backend");
  });

  it("EVERY compiler lesson launches into a payload compiler-workbench accepts", () => {
    const CMP = collectLessons((c) => c.startsWith("cmp-"));
    assert.ok(CMP.length >= 70, `expected ~78 cmp lessons, found ${CMP.length}`);
    const failures: string[] = [];
    for (const lesson of CMP) {
      const launch = launchUrlForLesson(lesson);
      if (!launch.ok) {
        failures.push(`${lesson.id}: launch failed — ${launch.message}`);
        continue;
      }
      const token = new URL(launch.url!).searchParams.get("practice") ?? "";
      const decoded = decodeCwPracticeQuery(token);
      if (!decoded.ok) {
        failures.push(`${lesson.id}: compiler-workbench rejected — ${decoded.message}`);
        continue;
      }
      if (!decoded.data.lessonId.startsWith(`${decoded.data.conceptId}-`)) {
        failures.push(`${lesson.id}: id pairing drifted`);
      }
    }
    assert.equal(failures.length, 0, `${failures.length}/${CMP.length} cmp lessons failed:\n${failures.slice(0, 20).join("\n")}`);
  });

  it("five families, five machines, no cross-talk", () => {
    const checks: Array<[string, string]> = [
      ["mus-", "compiler-workbench"], ["dm-", "fab-lab"], ["horo-", "pipeline-playground"],
      ["semi-", "chudbox"], ["cpu-", "movement-bench"],
    ];
    for (const [prefix, wrongLab] of checks) {
      for (const lesson of collectLessons((c) => c.startsWith(prefix)).slice(0, 10)) {
        const labs = practiceLabsForLesson(lesson.course, lesson.conceptId);
        assert.ok(!labs.some((lab) => lab.labId === wrongLab), `${lesson.id} must not hit ${wrongLab}`);
      }
    }
  });

  // ----- Packet Lab (net-*) -----

  it("routes networking to packet-lab with sensible modules", () => {
    const hs = buildPracticeRequestForLesson({ id: "net-handshake-10", conceptId: "net-handshake", title: "Three packets to agree a starting sequence" });
    assert.equal(hs.labId, "packet-lab");
    assert.equal(hs.practiceType, "handshake");

    assert.equal(netModuleForConcept("net-aimd").practiceType, "congestion");
    assert.equal(netModuleForConcept("net-longest-prefix").practiceType, "routing");
    assert.equal(netModuleForConcept("net-mtu").practiceType, "encapsulate");
    assert.equal(netModuleForConcept("net-dns-intro").practiceType, "scenarios");
  });

  it("EVERY networking lesson launches into a payload packet-lab accepts", () => {
    const NET = collectLessons((c) => c.startsWith("net-"));
    assert.ok(NET.length >= 70, `expected ~78 net lessons, found ${NET.length}`);
    const failures: string[] = [];
    for (const lesson of NET) {
      const launch = launchUrlForLesson(lesson);
      if (!launch.ok) {
        failures.push(`${lesson.id}: launch failed — ${launch.message}`);
        continue;
      }
      const token = new URL(launch.url!).searchParams.get("practice") ?? "";
      const decoded = decodePlPracticeQuery(token);
      if (!decoded.ok) {
        failures.push(`${lesson.id}: packet-lab rejected — ${decoded.message}`);
        continue;
      }
      if (!decoded.data.lessonId.startsWith(`${decoded.data.conceptId}-`)) {
        failures.push(`${lesson.id}: id pairing drifted`);
      }
    }
    assert.equal(failures.length, 0, `${failures.length}/${NET.length} net lessons failed:\n${failures.slice(0, 20).join("\n")}`);
  });

  it("six families, six machines, no cross-talk", () => {
    const checks: Array<[string, string]> = [
      ["mus-", "packet-lab"], ["semi-", "chudbox"], ["cpu-", "fab-lab"],
      ["cmp-", "movement-bench"], ["horo-", "compiler-workbench"],
    ];
    for (const [prefix, wrongLab] of checks) {
      for (const lesson of collectLessons((c) => c.startsWith(prefix)).slice(0, 10)) {
        const labs = practiceLabsForLesson(lesson.course, lesson.conceptId);
        assert.ok(!labs.some((lab) => lab.labId === wrongLab), `${lesson.id} must not hit ${wrongLab}`);
      }
    }
  });

  // ----- OS Lab (os-*) -----

  it("routes operating systems to os-lab with sensible modules", () => {
    const race = buildPracticeRequestForLesson({ id: "os-race-10", conceptId: "os-race", title: "Who ran first is the answer" });
    assert.equal(race.labId, "os-lab");
    assert.equal(race.practiceType, "sync");

    assert.equal(osModuleForConcept("os-preempt").practiceType, "scheduler");
    assert.equal(osModuleForConcept("os-page-fault").practiceType, "vm");
    assert.equal(osModuleForConcept("os-journal").practiceType, "storage");
    assert.equal(osModuleForConcept("os-container").practiceType, "scenarios");
  });

  it("EVERY os lesson launches into a payload os-lab accepts", () => {
    const OS = collectLessons((c) => c.startsWith("os-"));
    assert.ok(OS.length >= 65, `expected ~82 os lessons (by unique concept), found ${OS.length}`);
    const failures: string[] = [];
    for (const lesson of OS) {
      const launch = launchUrlForLesson(lesson);
      if (!launch.ok) { failures.push(`${lesson.id}: launch failed — ${launch.message}`); continue; }
      const token = new URL(launch.url!).searchParams.get("practice") ?? "";
      const decoded = decodeOsPracticeQuery(token);
      if (!decoded.ok) failures.push(`${lesson.id}: os-lab rejected — ${decoded.message}`);
    }
    assert.equal(failures.length, 0, `${failures.length}/${OS.length} os lessons failed:\n${failures.slice(0, 20).join("\n")}`);
  });

  // ----- ML Lab (ml-*) -----

  it("routes machine learning to ml-lab with sensible modules", () => {
    const gd = buildPracticeRequestForLesson({ id: "ml-gd-10", conceptId: "ml-gd", title: "Step opposite the gradient" });
    assert.equal(gd.labId, "ml-lab");
    assert.equal(gd.practiceType, "gradient");

    assert.equal(mlModuleForConcept("ml-overfit").practiceType, "traineval");
    assert.equal(mlModuleForConcept("ml-backprop").practiceType, "neuron");
    assert.equal(mlModuleForConcept("ml-qkv").practiceType, "attention");
    assert.equal(mlModuleForConcept("ml-hallucination").practiceType, "scenarios");
  });

  it("EVERY ml lesson launches into a payload ml-lab accepts", () => {
    const ML = collectLessons((c) => c.startsWith("ml-"));
    assert.ok(ML.length >= 70, `expected ~83 ml lessons (by unique concept), found ${ML.length}`);
    const failures: string[] = [];
    for (const lesson of ML) {
      const launch = launchUrlForLesson(lesson);
      if (!launch.ok) { failures.push(`${lesson.id}: launch failed — ${launch.message}`); continue; }
      const token = new URL(launch.url!).searchParams.get("practice") ?? "";
      const decoded = decodeMlPracticeQuery(token);
      if (!decoded.ok) failures.push(`${lesson.id}: ml-lab rejected — ${decoded.message}`);
    }
    assert.equal(failures.length, 0, `${failures.length}/${ML.length} ml lessons failed:\n${failures.slice(0, 20).join("\n")}`);
  });

  it("eight families, eight machines — spot-check the last two", () => {
    for (const lesson of collectLessons((c) => c.startsWith("semi-")).slice(0, 5)) {
      const labs = practiceLabsForLesson(lesson.course, lesson.conceptId);
      assert.ok(!labs.some((lab) => lab.labId === "os-lab" || lab.labId === "ml-lab"), `${lesson.id} misrouted`);
    }
  });
