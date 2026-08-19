import type { Lesson } from "@/lib/learning/types";
import { L, d, item, q } from "../lesson";

export const CPU_SEMI_LESSONS: Lesson[] = [
  L({
    id: "cpu-pipeline-5",
    conceptId: "cpu-pipeline",
    title: "Why a CPU is a factory line",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: ["arch-latency-throughput"],
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
      item({
        id: "p1",
        stem: "Pipelining primarily improves which quantity?",
        correct: "Throughput / IPC",
        distractors: [
          d("Instruction latency", "reversed", "Each instruction still takes multiple stages."),
          d("Cache capacity", "nearby", "Caches are a different mechanism."),
          d("DRAM latency", "subtle", "The line does not make DRAM faster."),
        ],
        explanation: "Each instruction still takes multiple stages. Overlap raises how many finish per unit time.",
        cognitiveType: "recognize",
        objectiveIds: ["Explain how overlap raises throughput without shrinking per-instruction latency"],
        prerequisiteConceptIds: ["arch-latency-throughput"],
        difficultyTier: 1,
      }),
      item({
        id: "p2",
        stem: "A pipeline bubble is:",
        correct: "An empty stage waiting on a dependency or miss",
        distractors: [
          d("A spare physical register", "nearby", "That is a later naming leftover, not an empty stage."),
          d("A branch that was predicted taken", "misapplied", "A predicted branch may still be useful work."),
          d("A clock that ticked twice", "subtle", "An extra tick is not an empty stage."),
        ],
        explanation: "The stage has nothing useful to do until the producer finishes.",
        cognitiveType: "apply",
        objectiveIds: ["Name why a bubble exists"],
        difficultyTier: 1,
      }),
      item({
        id: "p3",
        stem: "Deeper pipelines usually:",
        correct: "Allow a higher clock at the cost of more expensive interruptions",
        distractors: [
          d("Eliminate every wait for a result", "reversed", "Depth makes waits more expensive, not gone."),
          d("Make each instruction take one stage total", "misconception", "Overlap does not shrink the stage count to one."),
          d("Remove the need for a memory system", "subtle", "Depth does not replace locality."),
        ],
        explanation: "Shorter stages clock faster; a flush wastes more in-flight work.",
        cognitiveType: "identify",
        objectiveIds: ["Explain how overlap raises throughput without shrinking per-instruction latency"],
        difficultyTier: 1,
      }),
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
      item({
        id: "h1",
        stem: "Forwarding fixes which situation?",
        correct: "A RAW hazard when the value already exists in the pipeline",
        distractors: [
          d("A cache miss", "reversed", "There is no value to forward yet."),
          d("A structural conflict on one divider", "nearby", "That is a missing unit, not a missing value."),
          d("An interrupt", "subtle", "Interrupts are control transfers, not bypass wires."),
        ],
        explanation: "Bypass wires ship an already-computed result. They cannot invent a value still in DRAM.",
        cognitiveType: "recognize",
        objectiveIds: ["Say what forwarding can and cannot fix"],
        prerequisiteConceptIds: ["cpu-pipeline"],
        difficultyTier: 2,
      }),
      item({
        id: "h2",
        stem: "A control hazard exists because:",
        correct: "The next fetch address depends on an unresolved branch",
        distractors: [
          d("Registers have names", "nearby", "That is a data/name problem."),
          d("Two instructions want the only divider", "misapplied", "That is a structural hazard."),
          d("The clock is too fast", "subtle", "Frequency is not why the next PC is unknown."),
        ],
        explanation: "Fetch cannot know the correct PC until the branch (or its predictor) speaks.",
        cognitiveType: "apply",
        objectiveIds: ["Name the three hazard classes"],
        difficultyTier: 2,
      }),
      item({
        id: "h3",
        stem: "Which stall cannot be removed by forwarding alone?",
        correct: "A load that has not yet produced a value, such as a cache miss",
        distractors: [
          d("An add whose result is already sitting at the ALU output", "reversed", "That is exactly what bypass wires fix."),
          d("Two independent adds that only share an ALU later", "nearby", "That is structural, not a missing result."),
          d("A taken branch whose target is already known", "subtle", "A known next PC is not waiting on a result."),
        ],
        explanation: "Forwarding ships a value that exists in the pipe. A miss has no value yet.",
        cognitiveType: "predict",
        objectiveIds: ["Say what forwarding can and cannot fix"],
        prerequisiteConceptIds: ["cpu-pipeline"],
        difficultyTier: 2,
      }),
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
