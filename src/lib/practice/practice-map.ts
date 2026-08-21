import type { PracticeLessonRef } from "./labs";

/**
 * Editorial mapping: DAU music concept -> concrete Chudbox practice module.
 *
 * Chudbox exposes six practice surfaces (riff-cell | rhythm-grid | groove |
 * drum-feel | grouping | free). This file decides which one a lesson launches,
 * plus the tempo/lanes/constraints that make it feel like THAT lesson rather
 * than generic free play.
 *
 * Order of precedence:
 *   1. CONCEPT_OVERRIDES — explicit, for concepts whose name alone misleads
 *   2. KEYWORD_RULES     — first matching substring in the concept id
 *   3. PREFIX_DEFAULTS   — dm-* -> riff construction, mus-* -> rhythm grid
 */

export type PracticeType =
  | "riff-cell"
  | "rhythm-grid"
  | "groove"
  | "drum-feel"
  | "grouping"
  | "free";

export interface PracticeModuleSpec {
  practiceType: PracticeType;
  /** Base tempo; a deterministic per-lesson nudge is added for variety. */
  tempo: number;
  patternLength: number;
  lanes: string[];
  voices?: Record<string, string>;
  startEmpty: boolean;
  seedPreset?: "chug" | "gallop" | "breakdown" | "stomp";
  seedDrumFeel?: "straight" | "half-time" | "blast" | "hammer" | "alt-hats" | "kick-follow";
  groups?: number[];
  cellSize?: number;
  minHits: number;
  requirePlay: boolean;
  allowedTools: string[];
}

const RIFF_TOOLS = [
  "play", "steps", "pitch", "lanes", "mute", "solo", "voices",
  "ab", "copyAB", "mutate.rotate", "mutate.mirror", "mutate.sparse",
];
const GRID_TOOLS = ["play", "steps", "lanes", "mute", "solo", "tempo"];
const DRUM_TOOLS = ["play", "steps", "lanes", "mute", "solo", "drums.feel", "kick.sixteenths"];
const GROUP_TOOLS = [...GRID_TOOLS, "group", "length"];
const GROOVE_TOOLS = [
  "play", "steps", "pitch", "lanes", "mute", "solo", "voices",
  "swing", "tempo", "presets",
];
const FREE_TOOLS = ["play"];

const RIFF_VOICES = { riff: "chug", kick: "deep" };
const KIT_VOICES = { kick: "click", snare: "sharp", hat: "closed" };

function spec(partial: Partial<PracticeModuleSpec> & { practiceType: PracticeType }): PracticeModuleSpec {
  return {
    tempo: 120,
    patternLength: 16,
    lanes: ["riff", "kick"],
    startEmpty: true,
    minHits: 4,
    requirePlay: false,
    allowedTools: RIFF_TOOLS,
    ...partial,
  };
}

const MODULE_BY_TYPE: Record<PracticeType, PracticeModuleSpec> = {
  "riff-cell": spec({ practiceType: "riff-cell", voices: RIFF_VOICES }),
  "rhythm-grid": spec({
    practiceType: "rhythm-grid",
    lanes: ["kick", "snare", "hat"],
    voices: KIT_VOICES,
    minHits: 8,
    allowedTools: GRID_TOOLS,
  }),
  groove: spec({
    practiceType: "groove",
    seedPreset: "stomp",
    startEmpty: false,
    minHits: 0,
    requirePlay: true,
    allowedTools: GROOVE_TOOLS,
  }),
  "drum-feel": spec({
    practiceType: "drum-feel",
    lanes: ["kick", "snare", "hat"],
    voices: KIT_VOICES,
    minHits: 8,
    allowedTools: DRUM_TOOLS,
  }),
  grouping: spec({
    practiceType: "grouping",
    lanes: ["kick", "snare", "hat"],
    voices: KIT_VOICES,
    patternLength: 12,
    groups: [3, 3, 2],
    minHits: 6,
    allowedTools: GROUP_TOOLS,
  }),
  free: spec({
    practiceType: "free",
    startEmpty: false,
    minHits: 0,
    requirePlay: false,
    allowedTools: FREE_TOOLS,
  }),
};

/** Concepts whose id would otherwise fall into the wrong bucket. */
const CONCEPT_OVERRIDES: Record<string, PracticeModuleSpec> = {
  // Blast techniques are drum-feel first, whatever else the id says.
  "dm-blast": spec({ practiceType: "drum-feel", seedDrumFeel: "blast", tempo: 180, minHits: 12 }),
  "dm-blast-types": spec({ practiceType: "drum-feel", seedDrumFeel: "blast", tempo: 170, minHits: 12 }),
  "dm-double-kick": spec({ practiceType: "drum-feel", seedDrumFeel: "hammer", tempo: 160, minHits: 12 }),
  "dm-double-kick-hist": spec({ practiceType: "drum-feel", seedDrumFeel: "hammer", tempo: 150, minHits: 8 }),
  "dm-drum-comp": spec({ practiceType: "drum-feel", seedDrumFeel: "half-time", tempo: 120, minHits: 8 }),
  // Displacement lives on the grid even though it is a dm- concept.
  "dm-dm-displacement": spec({
    practiceType: "rhythm-grid",
    lanes: ["kick", "snare", "hat"],
    voices: KIT_VOICES,
    minHits: 8,
    allowedTools: GRID_TOOLS,
  }),
  // Odd-grouping family: give them real group seeds.
  "dm-odd-meter": spec({
    practiceType: "grouping",
    patternLength: 10,
    groups: [3, 3, 2, 2],
    tempo: 130,
  }),
  "dm-polymeter-dm": spec({
    practiceType: "grouping",
    patternLength: 12,
    groups: [3, 3, 2],
    tempo: 130,
  }),
  "dm-polyrhythm-dm": spec({
    practiceType: "grouping",
    patternLength: 12,
    groups: [3, 2],
    tempo: 120,
  }),
  "dm-metric-mod": spec({
    practiceType: "grouping",
    patternLength: 16,
    groups: [4, 3, 3, 2, 2, 2],
    tempo: 120,
  }),
  "mus-odd-meter": spec({
    practiceType: "grouping",
    patternLength: 7,
    groups: [3, 2, 2],
    tempo: 110,
  }),
  "mus-polymeter": spec({
    practiceType: "grouping",
    patternLength: 12,
    groups: [3, 3, 2],
    tempo: 110,
  }),
  "mus-hemiola": spec({
    practiceType: "grouping",
    patternLength: 12,
    groups: [3, 3],
    tempo: 100,
  }),
  "mus-polyrhythm-intro": spec({
    practiceType: "grouping",
    patternLength: 12,
    groups: [3, 2],
    tempo: 100,
  }),
  // Groove/feel pair.
  "dm-pick-hand": spec({ practiceType: "riff-cell", tempo: 160, minHits: 8 }),
  "dm-thrash-bridge": spec({ practiceType: "groove", seedPreset: "gallop", tempo: 170 }),
  "dm-contrast": spec({ practiceType: "groove", seedPreset: "breakdown", tempo: 90 }),
};

/** First keyword hit wins. Ordered most-specific first. */
const KEYWORD_RULES: Array<{ match: string[]; make: () => PracticeModuleSpec }> = [
  {
    // Listening/history/scene/production analysis: exploratory, not graded.
    match: [
      "hist", "listening", "production", "scene", "tape", "lineage", "influence",
      "compare", "live-vs", "vocal", "gore", "ossuary", "regional", "cliche",
      "analysis", "notation-limit", "virtuosity", "modern-wave", "modern-prod",
      "prog-form", "prog-hist", "song-form", "arrangement", "grind-border",
      "guitar-tune", "analysis-method", "clef", "ear-interval", "enharmonic",
    ],
    make: () => MODULE_BY_TYPE.free,
  },
  {
    match: ["blast", "double-kick", "drum"],
    make: () => MODULE_BY_TYPE["drum-feel"],
  },
  {
    match: ["odd-meter", "polymeter", "polyrhythm", "hemiola", "metric", "tech-90s", "tech-vs-func", "odd-phrasing"],
    make: () => MODULE_BY_TYPE.grouping,
  },
  {
    match: ["syncopation", "displacement", "rest", "tie-dot", "anacrusis", "beat-div", "tempo", "meter", "rhythm"],
    make: () => MODULE_BY_TYPE["rhythm-grid"],
  },
  {
    match: ["groove", "swing", "pocket", "feel"],
    make: () => MODULE_BY_TYPE.groove,
  },
  {
    match: [
      "riff", "cell", "tremolo", "chromatic", "tritone", "pedal", "power-chord",
      "drop", "palm-mute", "string-skip", "sweep", "diminished", "atonal",
      "dissonant", "harmony", "bass-role", "motif", "brutal", "melodeath",
      "semitone", "interval", "scale", "mode", "triad", "seventh", "cadence",
      "voice-lead", "inversion", "mixture", "modulation", "neapolitan", "octatonic",
      "pentatonic", "phrygian", "locrian", "major", "minor", "key", "circle",
      "function", "progress", "secondary", "nonchord", "nonfunc", "seq-harm",
      "planing", "parallel", "reduction", "species", "tension-tone", "timbre",
      "sound", "texture", "phrase", "form", "octave", "semitone",
    ],
    make: () => MODULE_BY_TYPE["riff-cell"],
  },
];

const PREFIX_DEFAULTS: Record<string, PracticeModuleSpec> = {
  dm: MODULE_BY_TYPE["riff-cell"],
  mus: MODULE_BY_TYPE["rhythm-grid"],
};

/** Small deterministic tempo nudge so sibling lessons don't feel identical. */
function tempoNudge(conceptId: string): number {
  let h = 0;
  for (let i = 0; i < conceptId.length; i += 1) h = (h * 31 + conceptId.charCodeAt(i)) % 97;
  return (h % 5) * 4 - 8; // -8..+8 BPM
}

export function moduleForConcept(conceptId: string): PracticeModuleSpec {
  const override = CONCEPT_OVERRIDES[conceptId];
  if (override) return override;

  for (const rule of KEYWORD_RULES) {
    if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.make();
  }

  const prefix = conceptId.split("-")[0] ?? "";
  const base = PREFIX_DEFAULTS[prefix] ?? MODULE_BY_TYPE.free;
  if (!base.seedPreset && !base.seedDrumFeel) {
    return { ...base, tempo: clampTempo(base.tempo + tempoNudge(conceptId)) };
  }
  return base;
}

function clampTempo(bpm: number): number {
  return Math.max(80, Math.min(240, bpm));
}

/** Build the chudbox payload fields for a lesson from its module spec. */
export function practiceFieldsForLesson(
  lesson: PracticeLessonRef,
): {
  practiceType: string;
  tempo: number;
  patternLength: number;
  allowedTools: string[];
  constraints: Record<string, unknown>;
  completionCriteria: Record<string, unknown>;
} {
  const mod = moduleForConcept(lesson.conceptId);
  const constraints: Record<string, unknown> = {
    lanes: mod.lanes,
    lockTempo: mod.practiceType !== "free",
    lockLength: mod.groups != null || mod.practiceType === "grouping",
    ...(mod.voices ? { voices: mod.voices } : {}),
    ...(mod.startEmpty ? { startEmpty: true } : {}),
    ...(mod.seedPreset ? { seedPreset: mod.seedPreset } : {}),
    ...(mod.seedDrumFeel ? { seedDrumFeel: mod.seedDrumFeel } : {}),
    ...(mod.groups ? { groups: mod.groups } : {}),
    ...(mod.cellSize ? { cellSize: mod.cellSize } : {}),
  };
  return {
    practiceType: mod.practiceType,
    tempo: clampTempo(mod.tempo + tempoNudge(lesson.conceptId)),
    patternLength: mod.patternLength,
    allowedTools: mod.allowedTools,
    constraints,
    completionCriteria: {
      ...(mod.minHits > 0 ? { minHits: mod.minHits } : {}),
      requirePlay: mod.requirePlay,
      selfReport: true,
    },
  };
}

// ---------------------------------------------------------------------------
// Horology -> Movement Bench
// ---------------------------------------------------------------------------

export type MovementBenchPracticeType =
  | "train-math"
  | "regulate"
  | "escapement"
  | "identify"
  | "complication"
  | "free";

export interface HoroModuleSpec {
  practiceType: MovementBenchPracticeType;
  parameters: Record<string, unknown>;
}

const HORO_OVERRIDES: Record<string, HoroModuleSpec> = {
  // The indexed complication must win over its foundations sibling.
  "horo-power-reserve-ind": { practiceType: "complication", parameters: {} },
  // Critical/history takes are exploration, not drills.
  "horo-tourbillon-honest": { practiceType: "free", parameters: {} },
  "horo-quartz-contrast": { practiceType: "free", parameters: {} },
  "horo-accuracy-claim": { practiceType: "free", parameters: {} },
};

/** First keyword hit wins; ordered most-specific first. */
const HORO_RULES: Array<{ match: string[]; spec: HoroModuleSpec }> = [
  {
    // Regulation bench work.
    match: [
      "rate", "regulator", "amplitude", "isochronism", "positional", "poise",
      "temp", "timing-machine", "magnet",
    ],
    spec: { practiceType: "regulate", parameters: { tolerance: 5 } },
  },
  {
    // Escapement geometry and beat work.
    match: [
      "beat-error", "lock-drop", "draw", "impulse", "pallet", "lever",
      "safety", "recoil", "escape", "lubrication-escape",
    ],
    spec: { practiceType: "escapement", parameters: {} },
  },
  {
    // Train arithmetic.
    match: ["ratio", "train-math", "cannon", "wheel-pinion", "beat-rate", "gear-train", "dial-train"],
    spec: { practiceType: "train-math", parameters: { questions: 3 } },
  },
  {
    // Complication trains.
    match: [
      "date", "chrono", "calendar", "gmt", "moon", "alarm", "repeater",
      "rattrapante", "flyback", "column-wheel", "auto-winding", "rotor",
      "equation", "striking", "tourbillon", "silicon",
    ],
    spec: { practiceType: "complication", parameters: { questions: 3 } },
  },
  {
    // Part-level literacy on the bench.
    match: [
      "nomenclature", "balance", "hairspring", "barrel", "click", "jewels",
      "bridges", "stem", "keyless", "hands", "mainspring", "winding",
      "power-reserve", "movement", "setting", "endshake", "lubrication",
      "disassembly", "service", "finishing", "tools-intro", "texture",
    ],
    spec: { practiceType: "identify", parameters: { questions: 4 } },
  },
];

export function horoModuleForConcept(conceptId: string): HoroModuleSpec {
  const override = HORO_OVERRIDES[conceptId];
  if (override) return override;
  for (const rule of HORO_RULES) {
    if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
  }
  // Unknown horology concepts default to part identification on the bench.
  return { practiceType: "identify", parameters: { questions: 4 } };
}


// ---------------------------------------------------------------------------
// Semiconductors -> Fab Lab
// ---------------------------------------------------------------------------

export type FabPracticeType =
  | "rayleigh"
  | "yield"
  | "sequence"
  | "identify"
  | "free";

export interface SemiModuleSpec {
  practiceType: FabPracticeType;
  parameters: Record<string, unknown>;
}

/** First keyword hit wins; ordered most-specific first. */
const SEMI_RULES: Array<{ match: string[]; spec: SemiModuleSpec }> = [
  {
    // Litho optics and patterning arithmetic (conceptual).
    match: [
      "rayleigh", "k1", "semi-na", "high-na", "anamorphic", "multi-pattern",
      "pitch-split", "duv", "immersion", "litho", "mask", "opc", "pec",
      "ler", "focus-expose", "exposure", "overlay", "stochastic", "pellicle",
    ],
    spec: { practiceType: "rayleigh", parameters: { questions: 4 } },
  },
  {
    // Yield economics, defect classes, throughput cost.
    match: ["yield", "defect", "cost-per-wafer", "throughput"],
    spec: { practiceType: "yield", parameters: { questions: 4 } },
  },
  {
    // The integration order game teaches these units' place in the flow.
    match: [
      "integration", "gate-stack", "well", "isolation", "oxide",
      "silicide", "diffusion", "anneal", "implant",
    ],
    spec: { practiceType: "sequence", parameters: {} },
  },
];

/**
 * Everything else — unit processes (CMP/CVD/PVD), materials, EUV hardware,
 * advanced packaging — is part literacy on the bench.
 */
export function semiModuleForConcept(conceptId: string): SemiModuleSpec {
  for (const rule of SEMI_RULES) {
    if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
  }
  return { practiceType: "identify", parameters: { questions: 4 } };
}


// ---------------------------------------------------------------------------
// Microarchitecture -> Pipeline Playground
// ---------------------------------------------------------------------------

export type PipelinePracticeType =
  | "pipeline"
  | "cache"
  | "schedule"
  | "predictor"
  | "scenarios"
  | "free";

export interface PpModuleSpec {
  practiceType: PipelinePracticeType;
  parameters: Record<string, unknown>;
}

/** First keyword hit wins; ordered most-specific first. */
const PP_RULES: Array<{ match: string[]; spec: PpModuleSpec }> = [
  {
    match: ["cpu-pipeline", "cpu-hazards", "cpu-forwarding", "cpu-control-hazard", "cpu-fetch-decode"],
    spec: { practiceType: "pipeline", parameters: {} },
  },
  {
    match: [
      "cache-levels", "cache-miss", "locality", "tlb", "inclusive-cache",
      "write-policy", "mshr", "prefetch", "memory-wall",
    ],
    spec: { practiceType: "cache", parameters: {} },
  },
  {
    match: [
      "ooo-schedule", "renaming", "rob", "wakeup-select", "issue-width",
      "load-store-queue", "memory-disambig", "speculative-load", "smt",
      "precise-exceptions",
    ],
    spec: { practiceType: "schedule", parameters: { questions: 4 } },
  },
  {
    match: ["branch-prediction", "predictors", "btb", "ras"],
    spec: { practiceType: "predictor", parameters: { rounds: 10 } },
  },
];

/**
 * Everything else — coherency/consistency scenarios, GPU execution model,
 * foundations literacy — lands in the scenario deck.
 */
export function ppModuleForConcept(conceptId: string): PpModuleSpec {
  for (const rule of PP_RULES) {
    if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
  }
  return { practiceType: "scenarios", parameters: { questions: 4 } };
}


// ---------------------------------------------------------------------------
// Compilers -> Compiler Workbench
// ---------------------------------------------------------------------------

export type CwPracticeType =
  | "tokenize"
  | "parse"
  | "optimize"
  | "dataflow"
  | "backend"
  | "free";

export interface CwModuleSpec {
  practiceType: CwPracticeType;
  parameters: Record<string, unknown>;
}

/** First keyword hit wins; ordered most-specific first. */
const CW_RULES: Array<{ match: string[]; spec: CwModuleSpec }> = [
  {
    // Lexer and parser territory.
    match: [
      "token", "regex-lex", "preproc", "macro", "ambiguity", "ast",
      "parse-tree", "lr", "grammar-class", "recursive-descent",
      "error-recovery", "semantic-action", "source-loc",
    ],
    spec: { practiceType: "parse", parameters: { questions: 4 } },
  },
  {
    // Transformation legality — the flagship deck.
    match: [
      "const-fold", "cse", "dce", "licm", "loop-inv", "strength-red",
      "mem2reg", "sroa", "inlining", "ipo", "vectorize", "tailcall",
      "pass-manager", "ir-verify",
    ],
    spec: { practiceType: "optimize", parameters: { questions: 4 } },
  },
  {
    match: ["liveness", "dataflow", "ssa", "phi", "alias", "call-graph"],
    spec: { practiceType: "dataflow", parameters: { questions: 4 } },
  },
];

/**
 * The back end road — allocation, spill, isel, frames, linking, JIT, GC,
 * plus front-end name resolution — rides the backend literacy deck.
 */
export function cwModuleForConcept(conceptId: string): CwModuleSpec {
  for (const rule of CW_RULES) {
    if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
  }
  return { practiceType: "backend", parameters: { questions: 4 } };
}


// ---------------------------------------------------------------------------
// Networking -> Packet Lab
// ---------------------------------------------------------------------------

export type PacketLabPracticeType =
  | "encapsulate"
  | "handshake"
  | "congestion"
  | "routing"
  | "scenarios"
  | "free";

export interface NetModuleSpec {
  practiceType: PacketLabPracticeType;
  parameters: Record<string, unknown>;
}

/** First keyword hit wins; ordered most-specific first. */
const NET_RULES: Array<{ match: string[]; spec: NetModuleSpec }> = [
  {
    // TCP state machine and reliability.
    match: [
      "handshake", "tcp-state", "reliable", "timeout", "keepalive",
      "head-of-line", "flow-control", "fast-retransmit", "nagle",
      "tls-place",
    ],
    spec: { practiceType: "handshake", parameters: { questions: 3 } },
  },
  {
    // Sharing a pipe you cannot see.
    match: [
      "aimd", "slow-start", "congestion", "ecn", "bbr", "bufferbloat",
      "fairness-tcp",
    ],
    spec: { practiceType: "congestion", parameters: { questions: 4 } },
  },
  {
    // Prefixes, policy and paths.
    match: [
      "longest-prefix", "cidr", "forwarding-vs-routing", "bgp", "as",
      "igp", "ospf", "anycast", "hijack", "rpki", "peering", "transit",
      "policy-route", "ixp", "sdn", "mpls",
    ],
    spec: { practiceType: "routing", parameters: { questions: 4 } },
  },
  {
    // Headers, frames, links, sizes.
    match: [
      "layering", "packet", "ethernet", "ip", "mac", "arp", "checksum",
      "endian-wire", "mtu", "fragment", "switching", "wifi-vs-wired",
    ],
    spec: { practiceType: "encapsulate", parameters: { questions: 4 } },
  },
];

/**
 * Everything else — DNS, NAT, DHCP, CDN, QUIC, sockets, measurement —
 * rides the scenario deck.
 */
export function netModuleForConcept(conceptId: string): NetModuleSpec {
  for (const rule of NET_RULES) {
    if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
  }
  return { practiceType: "scenarios", parameters: { questions: 4 } };
}


// ---------------------------------------------------------------------------
// Operating systems -> OS Lab
// ---------------------------------------------------------------------------

export type OsPracticeType =
  | "scheduler"
  | "sync"
  | "vm"
  | "storage"
  | "scenarios"
  | "free";

export interface OsModuleSpec {
  practiceType: OsPracticeType;
  parameters: Record<string, unknown>;
}

const OS_RULES: Array<{ match: string[]; spec: OsModuleSpec }> = [
  {
    match: [
      "os-sched", "os-preempt", "os-fairness", "os-priority-inv",
      "os-realtime", "os-latency-sched", "os-load-balance",
      "os-scheduler-class", "os-context-switch",
    ],
    spec: { practiceType: "scheduler", parameters: { questions: 3 } },
  },
  {
    match: [
      "os-race", "os-lock", "os-semaphore", "os-condvar", "os-deadlock",
      "os-atomic", "os-sleep-lock", "os-seqcst", "os-fork", "os-cow",
    ],
    spec: { practiceType: "sync", parameters: { questions: 4 } },
  },
  {
    match: [
      "os-vm", "os-page-fault", "os-page-table", "os-tlb-os", "os-swap",
      "os-mmap", "os-numa",
    ],
    spec: { practiceType: "vm", parameters: { questions: 3 } },
  },
  {
    match: [
      "os-inode", "os-journal", "os-crash-consist", "os-dir", "os-fs-layout",
      "os-buffer-cache", "os-block-dev", "os-mount", "os-vfs",
    ],
    spec: { practiceType: "storage", parameters: { questions: 3 } },
  },
];

/** The rest — syscalls, isolation, containers, devices — rides the deck. */
export function osModuleForConcept(conceptId: string): OsModuleSpec {
  for (const rule of OS_RULES) {
    if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
  }
  return { practiceType: "scenarios", parameters: { questions: 5 } };
}

// ---------------------------------------------------------------------------
// Machine learning -> ML Lab
// ---------------------------------------------------------------------------

export type MlPracticeType =
  | "gradient"
  | "traineval"
  | "neuron"
  | "attention"
  | "scenarios"
  | "free";

export interface MlModuleSpec {
  practiceType: MlPracticeType;
  parameters: Record<string, unknown>;
}

const ML_RULES: Array<{ match: string[]; spec: MlModuleSpec }> = [
  {
    match: [
      "ml-gd", "ml-convex", "ml-feature-scale", "ml-sgd-mom", "ml-linear-reg",
      "ml-logistic", "ml-loss",
    ],
    spec: { practiceType: "gradient", parameters: { questions: 3 } },
  },
  {
    match: [
      "ml-overfit", "ml-train-val-test", "ml-early-stop", "ml-regularization",
      "ml-dropout", "ml-crossval", "ml-bias-variance", "ml-generalization",
      "ml-metrics-class", "ml-baselines", "ml-iid",
    ],
    spec: { practiceType: "traineval", parameters: { questions: 4 } },
  },
  {
    match: [
      "ml-neuron", "ml-activation", "ml-backprop", "ml-autodiff", "ml-vanish",
      "ml-vanishing", "ml-softmax", "ml-ce-loss", "ml-cnn", "ml-mlp",
      "ml-depth", "ml-init", "ml-batchnorm", "ml-emb-intro", "ml-word2vec",
      "ml-repr", "ml-transfer", "ml-seq-rnn",
    ],
    spec: { practiceType: "neuron", parameters: { questions: 3 } },
  },
  {
    match: [
      "ml-qkv", "ml-self-attn", "ml-attention", "ml-multihead", "ml-positional",
      "ml-kv-cache", "ml-context", "ml-transformer", "ml-sparsity-attn",
      "ml-encoder-decoder",
    ],
    spec: { practiceType: "attention", parameters: { questions: 4 } },
  },
];

/** Foundations and LLM-practice concepts ride the scenario deck. */
export function mlModuleForConcept(conceptId: string): MlModuleSpec {
  for (const rule of ML_RULES) {
    if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
  }
  return { practiceType: "scenarios", parameters: { questions: 5 } };
}
