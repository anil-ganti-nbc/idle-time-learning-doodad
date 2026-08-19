/**
 * Writes modular course manifests under src/content/curriculum/data/.
 * Authoring format is compact; runtime loads validated JSON.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { technicalCourses } from "./curriculum-cs.mjs";
import { systemsCourses } from "./curriculum-systems.mjs";
import { kernelCourses } from "./curriculum-kernel.mjs";
import { remainingCourses } from "./curriculum-more.mjs";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../src/content/curriculum/data");
mkdirSync(outDir, { recursive: true });

const ids = new Set();
function take(id) {
  if (ids.has(id)) throw new Error(`duplicate concept ${id}`);
  ids.add(id);
  return id;
}

function concept(id, name, moduleId, tier, prereqs, summary, extra = {}) {
  return {
    id: take(id),
    name,
    moduleId,
    tier,
    prerequisites: prereqs,
    summary,
    parentId: extra.parent,
    objectives: extra.obj,
    estimatedMinutes: extra.min ?? 10,
    sourceIds: extra.src,
  };
}

const COURSES = [
  {
    id: "cpu-foundations",
    title: "Computer Architecture Foundations",
    categoryId: "cpu",
    description:
      "What a machine is optimizing, how instructions mean work, and why pipelines and caches exist before anyone says out-of-order.",
    curriculumVersion: 1,
    orderHint: 0,
    difficultyRange: [0, 2],
    entryRequirements: [],
    sourceReferences: [
      {
        id: "mit-6823",
        title: "MIT 6.823 Computer System Architecture",
        url: "https://ocw.mit.edu/courses/6-823-computer-system-architecture-fall-2005/pages/syllabus/",
        kind: "ocw",
        notes: "ISA and caches/VM before ILP. Module quizzes, not micro-topic quizzes.",
      },
      {
        id: "stanford-cs149",
        title: "Stanford CS149 Parallel Computing",
        url: "https://gfxcourses.stanford.edu/cs149/fall25/",
        kind: "syllabus",
        notes: "Latency/throughput and data-parallel thinking before GPU vocabulary.",
      },
    ],
    modules: [
      {
        id: "cpu-f-perf",
        title: "What the machine is optimizing",
        blurb: "Latency, throughput, and why some work is wide.",
        order: 0,
        prerequisites: [],
        spineIds: ["arch-latency-throughput"],
        learningObjectives: ["Separate latency from throughput", "Recognize data-parallel work"],
        sourceIds: ["stanford-cs149"],
      },
      {
        id: "cpu-f-isa",
        title: "Instructions and execution",
        blurb: "ISA as a contract, not a brand.",
        order: 1,
        prerequisites: ["cpu-f-perf"],
        spineIds: ["cpu-isa"],
        learningObjectives: ["Say what an ISA guarantees", "Walk one instruction through fetch and execute"],
      },
      {
        id: "cpu-f-pipe",
        title: "Keeping a sequential core busy",
        blurb: "Pipelines and the hazards that empty them.",
        order: 2,
        prerequisites: ["cpu-f-isa"],
        spineIds: ["cpu-pipeline", "cpu-hazards"],
        learningObjectives: ["Explain overlap without shrinking latency", "Name the three hazard classes"],
      },
      {
        id: "cpu-f-mem",
        title: "Locality before coherence",
        blurb: "Caches and virtual addresses as mechanisms.",
        order: 3,
        prerequisites: ["cpu-f-pipe"],
        spineIds: ["cpu-locality", "cpu-cache-levels"],
        learningObjectives: ["Use locality to explain a cache", "Separate virtual addresses from physical lines"],
      },
    ],
    concepts: [
      concept("arch-latency-throughput", "Latency versus throughput", "cpu-f-perf", 0, [], "How long one thing takes versus how much work finishes per unit time.", { obj: ["Distinguish latency from throughput with a concrete pipeline or factory example", "Explain why raising clock or width can move one without the other"] }),
      concept("arch-data-parallel", "Data-parallel work", "cpu-f-perf", 0, ["arch-latency-throughput"], "The same operation over many independent elements, versus one long dependent chain.", { parent: "arch-latency-throughput", obj: ["Recognize when a computation is data-parallel", "Contrast that with a sequential dependence a GPU cannot wish away"] }),
      concept("cpu-amdahl", "Amdahl and the serial leftover", "cpu-f-perf", 1, ["arch-data-parallel"], "Speedup is owned by the part you cannot parallelize.", { parent: "arch-data-parallel" }),
      concept("cpu-perf-metrics", "CPI, IPC, and why clock is not the story", "cpu-f-perf", 1, ["arch-latency-throughput"], "Performance as work per time, factored into frequency and useful work per cycle."),
      concept("cpu-isa", "Instruction set architecture", "cpu-f-isa", 1, ["arch-latency-throughput"], "The programmer-visible contract: operations, registers, memory, and exceptions.", { obj: ["Separate ISA from a particular microarchitecture"] }),
      concept("cpu-von-neumann", "Stored-program machine", "cpu-f-isa", 1, ["cpu-isa"], "Instructions live in the same memory as data, with all the consequences."),
      concept("cpu-fetch-decode", "Fetch, decode, execute", "cpu-f-isa", 1, ["cpu-isa"], "The sequential loop a pipeline will later overlap."),
      concept("cpu-alu-vs-control", "Datapath versus control", "cpu-f-isa", 1, ["cpu-fetch-decode"], "Where the bits are transformed versus who decides the next transform."),
      concept("cpu-addressing", "Addressing modes", "cpu-f-isa", 1, ["cpu-isa"], "How an instruction names the data it wants."),
      concept("cpu-risc-cisc", "RISC and CISC as encoding bets", "cpu-f-isa", 1, ["cpu-isa"], "Dense encodings versus regular pipelines — not a moral ranking."),
      concept("cpu-endian", "Endianness", "cpu-f-isa", 1, ["cpu-isa"], "Byte order as a convention that becomes a bug when ignored."),
      concept("cpu-interrupts-lite", "Exceptions and interrupts", "cpu-f-isa", 2, ["cpu-fetch-decode"], "Leaving the instruction stream because the world, or the program, demanded it."),
      concept("cpu-mmio", "Memory-mapped I/O", "cpu-f-isa", 2, ["cpu-isa"], "Devices that look like addresses."),
      concept("cpu-pipeline", "Instruction pipelines", "cpu-f-pipe", 1, ["arch-latency-throughput"], "Breaking instruction execution into overlapping stages.", { parent: "arch-latency-throughput", obj: ["Explain how overlap raises throughput without shrinking per-instruction latency", "Name why a bubble exists"] }),
      concept("cpu-hazards", "Pipeline hazards", "cpu-f-pipe", 2, ["cpu-pipeline"], "Data, control, and structural stalls that break ideal overlap.", { parent: "cpu-pipeline", obj: ["Name the three hazard classes", "Say what forwarding can and cannot fix"] }),
      concept("cpu-forwarding", "Result forwarding", "cpu-f-pipe", 2, ["cpu-hazards"], "Bypassing the register file so a dependent instruction need not wait for writeback.", { parent: "cpu-hazards" }),
      concept("cpu-control-hazard", "Control hazards", "cpu-f-pipe", 2, ["cpu-hazards"], "Not knowing the next PC until the branch resolves.", { parent: "cpu-hazards" }),
      concept("cpu-ilp-idea", "Instruction-level parallelism as slack", "cpu-f-pipe", 2, ["cpu-pipeline", "arch-data-parallel"], "Independent instructions nearby in one thread — the raw material of later OOO."),
      concept("cpu-locality", "Temporal and spatial locality", "cpu-f-mem", 1, ["arch-latency-throughput"], "Why the next access is often near, or the same as, the last one."),
      concept("cpu-cache-levels", "The cache hierarchy", "cpu-f-mem", 2, ["cpu-locality"], "L1/L2/L3 as a latency-capacity trade, not three unrelated boxes.", { parent: "cpu-locality" }),
      concept("cpu-cache-miss", "Hits, misses, and miss types", "cpu-f-mem", 2, ["cpu-cache-levels"], "Compulsory, capacity, and conflict — different failures, different fixes.", { parent: "cpu-cache-levels" }),
      concept("cpu-write-policy", "Write-through and write-back", "cpu-f-mem", 2, ["cpu-cache-levels"], "When a store dirties a line versus when it updates memory."),
      concept("cpu-virtual-addr", "Virtual addresses", "cpu-f-mem", 2, ["cpu-isa"], "The names a process uses, mapped later onto physical lines."),
      concept("cpu-tlb", "The TLB as a cache of translations", "cpu-f-mem", 2, ["cpu-virtual-addr", "cpu-cache-levels"], "A miss here is not a cache miss."),
      concept("cpu-memory-wall", "The memory wall", "cpu-f-mem", 2, ["cpu-cache-levels", "cpu-perf-metrics"], "Why processors started hiding latency instead of waiting honestly."),
    ],
  },
  ...technicalCourses(concept),
  ...systemsCourses(concept),
  ...kernelCourses(concept),
  ...remainingCourses(concept),
];

function writeAll() {
  const index = [];
  const imports = [];
  const names = [];
  for (const spec of COURSES) {
    const file = `${spec.id}.json`;
    writeFileSync(join(outDir, file), `${JSON.stringify(spec, null, 2)}\n`);
    index.push(spec.id);
    const ident = spec.id.replace(/[^a-zA-Z0-9]/g, "_");
    imports.push(`import ${ident} from "./${file}" with { type: "json" };`);
    names.push(ident);
  }
  writeFileSync(
    join(outDir, "manifest.json"),
    `${JSON.stringify({ courses: index, generatedAt: new Date().toISOString() }, null, 2)}\n`,
  );
  const registry = `/* Generated by scripts/generate-curriculum.mjs — do not edit by hand. */
import type { CourseManifest } from "../schema";
${imports.join("\n")}

export const MANIFESTS = [
  ${names.join(",\n  ")},
] as unknown as CourseManifest[];

export const MANIFEST_IDS = ${JSON.stringify(index, null, 2)} as const;
`;
  writeFileSync(join(outDir, "registry.ts"), registry);
  console.log(`wrote ${COURSES.length} courses, ${ids.size} concepts`);
}

writeAll();
export { COURSES, concept, ids, writeAll };
