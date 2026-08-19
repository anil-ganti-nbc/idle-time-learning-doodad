import type { Lesson } from "@/lib/learning/types";
import { L, d, item } from "../lesson";

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
];
