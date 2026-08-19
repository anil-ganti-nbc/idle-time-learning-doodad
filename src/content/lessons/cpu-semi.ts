import type { Lesson } from "@/lib/learning/types";
import { L, q } from "../lesson";

export const CPU_SEMI_LESSONS: Lesson[] = [
  L({
    id: "cpu-pipeline-5",
    conceptId: "cpu-pipeline",
    title: "Why a CPU is a factory line",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "cpu-hazards",
    diagram: "pipeline",
    explanation: [
      "A single instruction looks atomic from software: fetch it, do it, write the result. Hardware cannot afford that. Instruction execution is a sequence of distinct physical jobs — fetch bytes, decode them, read registers, do ALU work, access memory, write back. Each job uses different silicon.",
      "A pipeline keeps those jobs busy at once, the way a factory keeps every station occupied. While instruction N is in execute, N+1 can be decoding and N+2 can be fetching. Ideal throughput approaches one instruction per cycle even though each instruction still takes several cycles of latency.",
      "Clock speed stories hide this. Frequency is how fast a stage ticks. IPC (instructions per cycle) is how often the line actually retires useful work. Deep pipelines raise frequency by shrinking each stage, and they raise the cost of any interruption.",
    ],
    example:
      "A 5-stage RISC line (IF/ID/EX/MEM/WB) can have five instructions in flight. If every instruction is independent and hits in cache, you retire one per cycle. The moment a load’s data is needed by the next ALU op, the line bubbles — the factory waits for a part.",
    whyItMatters:
      "Almost every performance claim about a CPU — clocks, cores, ‘efficiency cores’, GPU occupancy — is a story about keeping a pipeline fed. If you only remember frequency, you will misread every chip announcement.",
    quiz: [
      q("p1", "Pipelining primarily improves which quantity?", ["Instruction latency", "Throughput / IPC", "Cache capacity", "DRAM latency"], 1, "Each instruction still takes multiple stages. Overlap raises how many finish per unit time."),
      q("p2", "A pipeline bubble is:", ["A spare physical register", "An empty stage waiting on a dependency or miss", "A branch that was predicted taken", "A SIMD lane with no work"], 1, "The stage has nothing useful to do until the producer finishes."),
      q("p3", "Deeper pipelines usually:", ["Eliminate data hazards", "Lower the cost of a mispredict", "Allow a higher clock at the cost of more expensive interruptions", "Remove the need for caches"], 2, "Shorter stages clock faster; a flush wastes more in-flight work."),
    ],
  }),
  L({
    id: "cpu-hazards-10",
    conceptId: "cpu-hazards",
    title: "The three ways a pipeline stalls",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["cpu-pipeline"],
    goDeeper: "cpu-renaming",
    diagram: "hazards",
    explanation: [
      "Ideal overlap assumes every stage always has independent work. Three classes of hazard break that. Structural: two instructions want the same unit (one divider, two divides). Data: an instruction needs a result that has not been written yet. Control: you do not know which instruction is next because of a branch.",
      "Hardware papers spend most of their pages on data and control. Forwarding (bypassing) ships a result from the ALU output back to the next instruction’s input without waiting for writeback. That kills many RAW hazards. It cannot help when the producer is a cache miss — there is no value to forward yet.",
      "Control hazards are why branch prediction exists. Until the branch resolves, the fetch stage is guessing. A wrong guess flushes every younger instruction. The longer and wider the machine, the more work that flush discards.",
    ],
    example:
      "`r1 = load [r2]; r3 = r1 + 4` cannot execute the add until the load data arrives. On an L1 hit that may be 4 cycles; on an L3 miss it may be 40; on DRAM it is hundreds. The pipeline does not ‘slow down’ uniformly — it waits on that one edge.",
    whyItMatters:
      "When a reviewer writes that a chip is ‘bad at games’ or ‘great at compiles’, they are usually pointing at how often this machine hits a hazard its predictors and caches cannot hide.",
    quiz: [
      q("h1", "Forwarding fixes which situation?", ["A cache miss", "A RAW hazard when the value already exists in the pipeline", "A structural conflict on one divider", "An interrupt"], 1, "Bypass wires ship an already-computed result. They cannot invent a value still in DRAM."),
      q("h2", "A control hazard exists because:", ["Registers have names", "The next fetch address depends on an unresolved branch", "The TLB is full", "The ROB is a queue"], 1, "Fetch cannot know the correct PC until the branch (or its predictor) speaks."),
      q("h3", "Which stall cannot be removed by a bigger register file alone?", ["WAW on the same architectural register", "A load that misses in cache", "An output dependency the renamer would kill", "Two writes to r1 in program order"], 1, "A miss is a data availability problem, not a name conflict."),
    ],
  }),
  L({
    id: "cpu-branch-10",
    conceptId: "cpu-branch-prediction",
    title: "Branch prediction is a cache for the future",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["cpu-pipeline"],
    goDeeper: "cpu-predictors",
    diagram: "branch",
    explanation: [
      "Every conditional branch is a tiny future you have not computed yet. The fetch unit cannot wait. It predicts taken or not-taken and, separately, where the target is. Those are different problems: direction is a bit; the target is an address.",
      "A 90% accurate predictor still hurts if the remaining 10% each flush 100 in-flight instructions. Modern cores advertise >95% on SPEC-like code. That number is workload-specific. Interpreters, browsers, and poorly predicted virtual calls are where the story breaks.",
      "Prediction is not magic insight. It is correlation: this branch, in this recent context, usually went that way. When the correlation dies — a new input distribution, a security domain switch — the pipeline suddenly looks much shorter.",
    ],
    example:
      "A loop branch (`i < n`) is almost always taken until the last iteration. A one-bit saturating counter learns this immediately and pays one mispredict per loop. A two-bit counter survives a single odd not-taken without flipping, which is why it became the textbook default.",
    whyItMatters:
      "Spectre made branch predictors famous for the wrong reason. For reporting and for performance work, the right reason remains: mispredicts are how control flow taxes IPC, and every ‘security mitigation’ that constrains prediction has a measurable throughput cost.",
    quiz: [
      q("b1", "Direction prediction and target prediction are separate because:", ["Taken/not-taken is one bit; the destination is an address", "Targets never repeat", "Only indirect branches have a direction", "The BTB stores flags, not PCs"], 0, "A taken branch still needs to know *where*."),
      q("b2", "A two-bit saturating counter is used so that:", ["It can store the target PC", "A single unusual outcome does not flip the prediction", "It predicts return addresses", "It replaces the BTB"], 1, "It takes two consecutive disagreements to change state."),
      q("b3", "A 97% prediction rate can still dominate runtime when:", ["Each miss is cheap", "The window is wide and each miss flushes a lot of work", "There are no branches", "The cache always hits"], 1, "Cost is miss-rate × miss-penalty. Wide/deep machines have huge penalties."),
    ],
  }),
  L({
    id: "cpu-btb-10",
    conceptId: "cpu-btb",
    title: "The BTB is not a direction predictor",
    durationMin: 10,
    effort: "deep",
    level: "journalist",
    prerequisites: ["cpu-branch-prediction"],
    goDeeper: "cpu-ras",
    diagram: "btb",
    explanation: [
      "A branch target buffer is a cache from instruction address (usually a tag on the fetch PC) to the last-seen target. It answers ‘if I fetch from here, where do I fetch next?’ before decode has even seen that the bytes are a branch.",
      "That timing is the point. Waiting for decode to notice a branch already costs a cycle in a high-frequency front end. The BTB lets fetch steer itself. Capacity, associativity, and how many branches per fetch group it can handle show up in front-end stall counters long before you look at the direction predictor.",
      "Indirect branches (function pointers, vtables, computed goto) stress the BTB because the target is data-dependent. A BTB that stores one target per branch thrashes. Some designs keep multiple targets and a chooser; some fold in path history. When a chip vendor talks about ‘indirect branch improvements’, this is the structure they mean.",
    ],
    example:
      "A bytecode interpreter’s dispatch is often `handler = table[*pc++]; goto *handler`. Every opcode is an indirect branch through the same site. A 1-target BTB is almost useless. A history-tagged indirect predictor can learn that `ADD` is often followed by `LOAD` and steer correctly.",
    whyItMatters:
      "Writeups that say ‘better branch prediction’ after a microarchitecture launch are usually mixing three boxes: BTB capacity, direction predictor, and the return stack. They miss different workloads. If you cannot name which box moved, you cannot judge the claim.",
    quiz: [
      q("t1", "The BTB’s job is primarily to:", ["Guess taken versus not-taken", "Provide a fetch redirect address early", "Rename registers", "Store return addresses only"], 1, "It is a target cache used before decode."),
      q("t2", "Indirect branches hurt a simple BTB because:", ["They are never taken", "The target varies and a single cached destination is often wrong", "They have no PC", "They cannot be cached"], 1, "One site, many destinations."),
      q("t3", "A BTB miss on an otherwise well-predicted taken branch typically costs:", ["A full pipeline flush equivalent to a direction mispredict", "A short front-end bubble until decode computes the target", "A cache writeback", "A trip to DRAM"], 1, "You still discover the branch at decode; you just steered late."),
    ],
  }),
  L({
    id: "cpu-predictors-20",
    conceptId: "cpu-predictors",
    title: "TAGE and why local history was not enough",
    durationMin: 20,
    effort: "deep",
    level: "journalist",
    prerequisites: ["cpu-branch-prediction"],
    explanation: [
      "A local predictor keeps a short history per branch: the last N outcomes of *this* site. It wins on loops and simple phases. It loses when this branch’s behavior is a function of other recent branches — the classic example is a branch inside a nested condition whose outcome correlates with an earlier test.",
      "A global predictor hashes a shared history register of recent outcomes and indexes a table of counters. That captures correlation across sites. It also aliases: unrelated branches collide in the same counter. Gshare XOR’s the history with the PC to spread them.",
      "TAGE (TAgged GEometric) is the family most high-performance cores now resemble. Several tables, each tagged, each indexed with a geometrically longer history. A hit on a longer table wins. Partial tag checks cut aliasing. Newly allocated entries are cautious. The geometric lengths exist because useful correlation lives at many timescales at once — 4 bits for a loop, 40 bits for a parser state machine.",
      "When a vendor says they ‘increased the predictor’, ask: more entries, longer histories, better allocation, or a new indirect/loop helper? Those are different silicon and different SPECint deltas.",
    ],
    example:
      "`if (a) …; if (b) …; if (a || b)` — the third test is a logical function of the first two. A local history of the third site cannot see `a` and `b`. A global/TAGE history can, which is why correlated branches are the textbook justification for global history.",
    whyItMatters:
      "Security mitigations (e.g. flushing or partitioning predictor state on domain switch) destroy exactly this long history. The performance cliff after a Spectre-era mitigation is often TAGE being reset, not the BTB being smaller.",
    quiz: [
      q("g1", "Local history fails when:", ["A branch is a loop", "This branch’s outcome depends on other recent branches", "The BTB hits", "The pipeline is short"], 1, "Local tables never see the other sites."),
      q("g2", "TAGE uses multiple geometric history lengths because:", ["Silicon cannot store one long history", "Useful correlation exists at several timescales at once", "Tags are illegal at short histories", "It predicts targets, not directions"], 1, "Loops, nested predicates, and parsers want different history depths."),
      q("g3", "Aliasing in a global predictor means:", ["Two branches share a counter and pollute each other’s state", "The BTB overflowed", "History is empty", "The RAS underflowed"], 0, "Same index, unrelated correlation."),
    ],
  }),
  L({
    id: "cpu-ras-10",
    conceptId: "cpu-ras",
    title: "Return address stacks",
    durationMin: 10,
    effort: "deep",
    level: "journalist",
    prerequisites: ["cpu-branch-prediction"],
    explanation: [
      "Returns are indirect branches, but they are not random. A CALL pushes a return PC; the matching RET should pop it. A small hardware stack, the RAS, predicts returns with near-perfect accuracy as long as call depth stays within the stack and the compiler actually uses the calling convention.",
      "Overflow and underflow are the real bugs. Deep recursion, or a flood of calls from a trampoline, wraps the RAS and starts predicting stale addresses. Unbalanced CALL/RET pairs — tail-call tricks, hand-written asm, context switches — desynchronize it. Operating systems snapshot or flush the RAS on swap so one process does not gift another a predicted target.",
      "This is also a Spectre gadget. A poisoned RAS makes RET speculate to an attacker-chosen address. That is why you will see ‘RSB stuffing’ or ‘RSB flush on context switch’ in kernel changelogs. The performance cost is a burst of return mispredicts after the stuffing.",
    ],
    example:
      "A 16-entry RAS correctly predicts a well-nested call tree of depth 16. The 17th nested call overwrites the oldest entry. When you unwind past 16, the remaining returns predict whatever the overflow wrote — often a spectacular front-end flush.",
    whyItMatters:
      "If a chip review mentions ‘worse than expected on recursion-heavy code’ or a kernel mitigation ‘costs 2% on syscall-heavy workloads’, look at the RAS before you look at the ALU.",
    quiz: [
      q("r1", "The RAS predicts returns by:", ["Hashing global history", "Pushing the link address at CALL and popping at RET", "Storing one target per binary", "Asking the BTB only"], 1, "It exploits LIFO structure, not correlation."),
      q("r2", "RAS overflow happens when:", ["Call depth exceeds the hardware stack", "A branch is not taken", "L1 misses", "The ROB fills"], 0, "Extra CALLs overwrite older return PCs."),
      q("r3", "Kernels stuff or flush the RAS on context switch to:", ["Warm the cache", "Stop one task’s return predictions from steering another", "Clear the BTB tags", "Reset the clock"], 1, "Otherwise RET speculation becomes a cross-task gadget and a mispredict source."),
    ],
  }),
  L({
    id: "cpu-rename-10",
    conceptId: "cpu-renaming",
    title: "Register renaming kills false dependencies",
    durationMin: 10,
    effort: "deep",
    level: "core",
    prerequisites: ["cpu-pipeline"],
    goDeeper: "cpu-rob",
    explanation: [
      "ISA registers are a small set of names (x86 has few; RISC-V has 32). Programs reuse them constantly. `r1 = a; use r1; r1 = b; use r1` looks like r1 is one location. The first and third writes are not a real data dependency — they just share a name. That is a WAW/WAR hazard, a *false* dependency.",
      "The renamer maps each write to a new physical register from a larger file. Readers of the old value keep the old physical. The ISA name becomes a pointer. True RAW dependencies remain; false ones disappear. Out-of-order issue can then run the second write while the first value is still in flight.",
      "When the physical file or the free list is exhausted, rename stalls even if ALUs are idle. That is a hidden capacity limit, and it is why microarchitectures advertise physical register file size next to ROB entries.",
    ],
    example:
      "Two independent `add` instructions that both dest `eax` on x86 can execute in parallel after rename, because they write p37 and p41. Without rename, the second add would wait for the first to retire, for no semantic reason.",
    whyItMatters:
      "Compiler register pressure and ISA width arguments are incomplete without the physical file. A ‘small ISA register set’ is not a death sentence if rename is wide; a huge ISA file still stalls if physicals run out.",
    quiz: [
      q("n1", "Renaming removes which dependencies?", ["True RAW data dependencies", "False WAW/WAR name dependencies", "Cache misses", "Control hazards"], 1, "It gives each write a fresh physical destination."),
      q("n2", "A rename stall with idle ALUs usually means:", ["The branch predictor failed", "The physical register file or free list is empty", "DRAM is offline", "The TLB hit"], 1, "No physical destination, no dispatch."),
      q("n3", "After rename, an ISA register name is best thought of as:", ["A physical location", "A pointer to the latest physical register for that name", "A cache tag", "A ROB index only"], 1, "The map table is the live translation."),
    ],
  }),
  L({
    id: "cpu-rob-20",
    conceptId: "cpu-rob",
    title: "The reorder buffer is the commit covenant",
    durationMin: 20,
    effort: "deep",
    level: "journalist",
    prerequisites: ["cpu-renaming"],
    goDeeper: "cpu-coherency",
    explanation: [
      "Out-of-order execution finishes instructions whenever their inputs exist. Precise exceptions and a coherent architectural state still require *program order* at retirement. The reorder buffer is the queue that restores that order. An instruction is allocated in-order at the tail, executes whenever, and commits only when it reaches the head and has completed.",
      "On a mispredict or fault, everything younger than the offending instruction is discarded. Physical registers allocated for those ops return to the free list. Stores are not released to the coherent memory system until commit — they sit in a store buffer. That is how a faulting load does not leave a half-updated heap.",
      "ROB capacity is a window size. A 400-entry ROB can have 400 ops in flight, hiding tens of nanoseconds of miss if the compiler and predictor kept them independent. A full ROB blocks rename even if execution units are hungry. Reviews that only quote ‘width’ (6-wide decode) without window size are quoting the firehose, not the tank.",
    ],
    example:
      "A load misses, 80 independent adds follow it. They execute and sit in the ROB completed. The load finally returns, the load commits, then the adds drain at a rate limited by commit width. If an interrupt arrives before the load commits, those adds never happened architecturally.",
    whyItMatters:
      "When a vendor increases ROB from 256 to 512, they are buying miss tolerance, not peak FLOPs. That number is how you should read ‘better at high-latency code’ claims.",
    quiz: [
      q("o1", "Instructions enter the ROB:", ["Whenever they finish", "In program order, at allocate", "Only on a miss", "Only branches"], 1, "Allocate is in-order; execute is not."),
      q("o2", "Stores become globally visible:", ["At execute", "When they issue to the ALU", "At or after commit, via the store buffer", "At fetch"], 2, "Otherwise a squashed path would mutate memory."),
      q("o3", "A full ROB with idle ALUs means:", ["The window cannot accept more in-flight work, often because an old instruction has not committed", "There are no instructions in the program", "The predictor is perfect", "Caches are off"], 0, "The tank is full; the firehose has to wait."),
    ],
  }),
  L({
    id: "cpu-mesi-20",
    conceptId: "cpu-coherency",
    title: "MESI, or how caches lie together",
    durationMin: 20,
    effort: "deep",
    level: "core",
    prerequisites: ["cpu-pipeline"],
    diagram: "mesi",
    explanation: [
      "Each core keeps a private cache for speed. Those copies must not disagree about the value of a line. Coherence protocols are the distributed algorithm that maintains a single-writer or multiple-reader invariant. MESI is the common vocabulary: Modified, Exclusive, Shared, Invalid.",
      "A read miss in Shared or Exclusive is cheap to satisfy. A write to a Shared line must invalidate every other copy first (or upgrade via a read-for-ownership). That round trip is why a ping-ponging atomic on one cache line destroys scaling. The line is not ‘slow’; the protocol is doing a distributed lock.",
      "MESI is about *coherence* (same address, same value, eventually). It is not *consistency* (when stores become visible relative to other addresses). x86’s TSO is a consistency model sitting on top of a coherent cache hierarchy. Confusing the two is how people misread Java memory model pieces and ARM weak-memory bugs.",
    ],
    example:
      "Two cores increment `counter++` on the same `int` without atomics. They can each hold the line in Modified at different times and drop updates. With a `lock add`, the RFO plus the lock prefix makes the read-modify-write one coherence transaction — slow, correct, and a scaling cliff.",
    whyItMatters:
      "Every ‘we sharded this counter’ or ‘false sharing’ performance note is a MESI story. If you write about multicore speedups without mentioning invalidation traffic, you are describing the wish, not the machine.",
    quiz: [
      q("c1", "A write to a line in Shared typically requires:", ["Nothing", "Invalidating or downgrading other copies (RFO)", "Flushing the ROB", "A disk sync"], 1, "Single-writer invariant."),
      q("c2", "False sharing is:", ["Two cores fighting over different variables on the same cache line", "A branch mispredict", "A TLB shootdown", "A RAID level"], 0, "The protocol cannot see your C fields, only 64-byte lines."),
      q("c3", "Coherence vs consistency:", ["They are synonyms", "Coherence is per-address agreement; consistency is ordering across addresses", "Consistency is only for disks", "MESI implements sequential consistency by itself"], 1, "MESI does not pick x86 TSO vs ARM."),
    ],
  }),

  L({
    id: "semi-litho-5",
    conceptId: "semi-litho",
    title: "Lithography is a shadow play",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "semi-euv",
    diagram: "litho",
    explanation: [
      "A chip layer is a pattern of where material should stay or go. Photolithography paints that pattern by shining light through (or reflecting it off) a mask onto photoresist. The resist’s chemical solubility changes where light landed. Develop, then etch or deposit, then strip the resist. Repeat for each layer.",
      "Resolution is not ‘smaller light = smaller transistors’ as a slogan. The Rayleigh criterion, CD = k1 · λ / NA, is the working equation. Wavelength, numerical aperture, and process factor k1 are the three knobs. For two decades the industry rode wavelength (365 → 248 → 193 nm) and then immersion, then multiple patterning, because the next wavelength was late.",
    ],
    example:
      "193 nm immersion lithography with NA 1.35 and aggressive k1 can print features well below 40 nm — but only with tricks (off-axis illumination, OPC, multipatterning) that make the mask no longer look like the wafer.",
    whyItMatters:
      "Every foundry node slide is a lithography slide in costume. If you cannot name λ, NA, and k1, you will treat ‘3 nm’ as a length rather than a marketing bundle of tricks.",
    quiz: [
      q("l1", "In CD = k1 · λ / NA, shrinking λ:", ["Always raises depth of focus", "Improves resolution if other terms hold", "Removes the need for a mask", "Makes resist irrelevant"], 1, "Smaller wavelength, smaller printable pitch, other knobs fixed."),
      q("l2", "Photoresist’s role is to:", ["Be the metal of the transistor", "Record the optical image as a chemical solubility change", "Cool the wafer", "Replace the mask"], 1, "It is the recording medium."),
      q("l3", "Multiple patterning appeared because:", ["EUV was late and 193 nm had run out of cheap resolution", "Copper was too cheap", "Masks became free", "NA cannot exceed 0.1"], 0, "It splits one dense layer into several sparser exposures."),
    ],
  }),
  L({
    id: "semi-euv-10",
    conceptId: "semi-euv",
    title: "EUV: 13.5 nm and no lenses",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["semi-litho"],
    goDeeper: "semi-na",
    diagram: "euv",
    explanation: [
      "Extreme ultraviolet lithography uses 13.5 nm light, produced by blasting tin droplets with a CO2 laser so they become a plasma that emits in that band. Almost everything absorbs EUV, including air. The entire optical path is vacuum. Refractive lenses are impossible; the tool is a chain of multilayer Bragg mirrors, each reflecting only a fraction of the light.",
      "The mask is reflective too — a patterned absorber on a multilayer mirror. There is no pellicle that is optically free; pellicles that do exist eat power and can wrinkle. Source power, mirror reflectivity, and resist dose fight each other: more photons cost more time or more laser; fewer photons cost stochastic defects.",
      "EUV did not make multipatterning vanish. It pushed the single-exposure limit down, then High-NA and more multipatterning arguments started again. Treat ‘EUV node’ as ‘this layer may be a single EUV exposure’ — not as a synonym for magic.",
    ],
    example:
      "A tin-droplet source firing 50,000 times a second, a collector mirror that degrades under tin debris, and a wafer that must still see enough photons per square nanometer of resist: that is the industrial object behind a sentence like ‘ASML shipped a High-NA tool’.",
    whyItMatters:
      "EUV availability, pellicle maturity, and source power are why a foundry’s leading node slips. Reporting that stops at ‘they use EUV now’ is stopping at the brochure.",
    quiz: [
      q("e1", "EUV tools use mirrors rather than lenses because:", ["Mirrors are cheaper", "13.5 nm is absorbed by all practical refractive materials", "Vacuum forbids glass for legal reasons", "Masks are transmissive"], 1, "There is no useful EUV glass."),
      q("e2", "The EUV light is generated by:", ["A mercury lamp", "Laser-produced tin plasma", "A synchrotron in every fab", "LEDs"], 1, "Tin droplets + CO2 laser is the HVM path."),
      q("e3", "Low photon count at the resist shows up as:", ["Higher NA", "Stochastic defects — missing contacts, broken lines", "Better overlay automatically", "Cheaper masks"], 1, "Shot noise becomes a yield term."),
    ],
  }),
  L({
    id: "semi-na-20",
    conceptId: "semi-na",
    title: "High-NA EUV spends depth of focus",
    durationMin: 20,
    effort: "deep",
    level: "journalist",
    prerequisites: ["semi-euv"],
    goDeeper: "semi-overlay",
    explanation: [
      "Numerical aperture is n · sin(θ), the sine of the half-angle the optic can accept. Resolution scales as 1/NA. Depth of focus scales roughly as λ / NA². High-NA EUV (0.55 vs today’s 0.33) is therefore not a free lunch: you print tighter pitch and you get a thinner slice of acceptable focus.",
      "ASML’s High-NA machines use an anamorphic lens: different magnification in X and Y so the reflective mask can stay a manufacturable size. The scanner field shrinks. That means more stitched exposures per layer, which hands the problem to overlay. The tool also needs a tighter focus control loop and flatter wafers.",
      "When a briefing says High-NA ‘enables 2 nm’, they mean a specific pitch for a specific layer family, at a cost in field size, throughput, and process window. They do not mean every layer on the wafer is suddenly 0.55 NA.",
    ],
    example:
      "A contact layer that was two 0.33-NA EUV exposures may become one 0.55-NA exposure — cheaper in mask count, hungrier in focus budget. A metal layer that still fits 0.33 NA will stay there because High-NA time is the scarce resource.",
    whyItMatters:
      "The interesting High-NA questions are field stitching, resist thickness (thinner for focus, worse for etch budget), and which layers actually move. ‘They bought a High-NA tool’ is not a node.",
    quiz: [
      q("na1", "Raising NA improves resolution and:", ["Improves depth of focus", "Shrinks depth of focus roughly as 1/NA²", "Removes overlay error", "Makes vacuum unnecessary"], 1, "That is the trade the name hides."),
      q("na2", "Anamorphic High-NA optics exist to:", ["Add color", "Keep the mask a workable size while increasing NA", "Eliminate mirrors", "Cool the tin source"], 1, "X and Y magnifications differ."),
      q("na3", "A smaller scanner field implies:", ["Fewer wafers ever", "More exposure shots and a tighter overlay problem at stitch boundaries", "No need for focus control", "Cheaper resists automatically"], 1, "You tile the die with more fields."),
    ],
  }),
  L({
    id: "semi-overlay-10",
    conceptId: "semi-overlay",
    title: "Overlay is a budget, not a slogan",
    durationMin: 10,
    effort: "deep",
    level: "journalist",
    prerequisites: ["semi-euv"],
    goDeeper: "semi-stochastics",
    explanation: [
      "Overlay is how well layer N sits on layer N−1. Contact over gate, via over metal, cut over fin. The error has systematic pieces (stage, lens distortion, mask writing, wafer warpage) and a random piece. Yield dies when the tail of that distribution eats the landing pad.",
      "You do not ‘have 2 nm overlay’. You have a 3σ number on a particular layer pair, after correction, on a particular scanner, on wafers that warped in the last anneal. Correction is a model: higher-order wafer alignment, per-exposure residuals, sometimes computational overlay using after-develop or after-etch metrology fed back to the scanner.",
      "High-NA’s smaller field and any multi-patterning scheme multiply the pairs you must control. A story about a node delay that mentions ‘process window’ and never mentions overlay is missing the usual villain.",
    ],
    example:
      "A via landing on a 20 nm-wide metal with 8 nm of overlay error on one side is no longer a via. It is an open or a merged neighbor. Designers fatten landing pads (via pillars, self-aligned vias) because they do not trust the tail.",
    whyItMatters:
      "This is how to read ‘yield ramp’. Not a mysterious curse — a stack of layer-pair distributions, some of which refuse to sit down.",
    quiz: [
      q("ov1", "Overlay measures:", ["Line-width roughness", "Layer-to-layer alignment", "Source power", "k1"], 1, "Did this layer land on the last one."),
      q("ov2", "A 3σ overlay spec is about:", ["The mean only", "The tail of the error distribution that eats yield", "Clock speed", "Mask cost"], 1, "Yield cares about the bad fields."),
      q("ov3", "Self-aligned vias exist because:", ["Metals cannot be etched", "Designers refuse to trust overlay tails on tiny landings", "EUV has no masks", "NA is infinite"], 1, "The process, not the designer, defines the edge."),
    ],
  }),
  L({
    id: "semi-stoch-20",
    conceptId: "semi-stochastics",
    title: "Stochastics: when photons become dice",
    durationMin: 20,
    effort: "deep",
    level: "journalist",
    prerequisites: ["semi-euv"],
    explanation: [
      "At 13.5 nm each photon carries a lot of energy, so a given dose in mJ/cm² is fewer photons than at 193 nm. Resist features are now small enough that the count of photons (and of photoacid molecules they generate) in a contact hole is a small integer. Poisson noise on a small integer is a defect: a hole that does not open, a line that pinches.",
      "Dose goes up, noise goes down, throughput goes down. Resist sensitivity goes up, noise often goes up because you used fewer photons to generate the acids. That is the RLS triangle: resolution, line-edge roughness, sensitivity — pick two. New metal-oxide resists and underlayers are attempts to change the constant, not repeal Poisson.",
      "Inspection and stochastic-aware OPC try to find the layouts that amplify noise (tiny gaps, aggressive tips). A ‘random’ killer defect on an EUV layer is often a predictable consequence of a local photon budget.",
    ],
    example:
      "A 20 nm contact printed at a dose whose mean photon count in the hole is ~100 has a 1σ of 10%. The left tail does not clear the develop threshold. Multiply by a hundred billion contacts and you have a yield model, not bad luck.",
    whyItMatters:
      "When a foundry talks about EUV ‘defectivity’ without a particle story, they may mean stochastics. The lever is dose, resist, and layout — not a cleaner cleanroom.",
    quiz: [
      q("s1", "EUV stochastics are severe because:", ["Mirrors are crooked", "Feature volumes contain few photons/acids, so Poisson noise is a defect", "Vacuum fluctuates", "Tin is expensive"], 1, "Small counts, fat relative noise."),
      q("s2", "The RLS triangle says:", ["You can freely have resolution, smoothness, and sensitivity", "Pushing sensitivity (faster resist) often costs roughness or resolution", "Overlay is a resist property", "NA cancels Poisson"], 1, "Dose, size, and LER trade."),
      q("s3", "Raising dose to fight stochastics typically:", ["Speeds the scanner", "Slows throughput because the wafer must collect more photons", "Removes the need for OPC", "Lets you skip vacuum"], 1, "Photons per second are the scarce resource."),
    ],
  }),
];
