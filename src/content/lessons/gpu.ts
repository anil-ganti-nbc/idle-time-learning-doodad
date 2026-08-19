import type { Lesson } from "@/lib/learning/types";
import { L, d, item } from "../lesson";

export const GPU_LESSONS: Lesson[] = [
  L({
    id: "arch-latency-throughput-5",
    conceptId: "arch-latency-throughput",
    title: "How long versus how many",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "cpu-pipeline",
    explanation: [
      "Latency is how long one unit of work takes from start to finish. Throughput is how many units finish per unit time. They are related and they are not the same number. A bakery can take 40 minutes to bake one loaf and still sell 200 loaves an hour if 200 loaves share the oven.",
      "Hardware people mix the words because marketing likes a single speed. Clock frequency is a latency story about one stage. IPC and occupancy are throughput stories about how often useful work retires. You can raise the clock and lose throughput if every other cycle is a stall. You can lower the clock and gain throughput if you keep more work in flight.",
      "The rest of this course is techniques for buying one without pretending you bought the other. Pipelines attack throughput. Caches attack latency that would otherwise serialize the line. GPUs mostly refuse the latency game and bet that there is always another independent thread.",
    ],
    example:
      "A load from DRAM might take 300 cycles (latency). A core that only issues that load retires almost nothing. A GPU that has 20 other warps ready can keep ALUs busy for those 300 cycles (throughput). The load is still slow. The machine is not idle.",
    whyItMatters:
      "Every confused chip announcement — 'faster clocks', 'more CUDA cores', 'higher occupancy' — is a latency/throughput mix-up. If you cannot say which quantity moved, you cannot read the claim.",
    quiz: [
      item({
        id: "lt1",
        stem: "A change that shrinks how long one instruction takes, without changing how many finish per cycle, primarily moved:",
        correct: "Latency",
        distractors: [
          d("Throughput", "nearby", "Throughput is completion rate, not per-item time."),
          d("Instruction count", "misapplied", "How many instructions exist is not how long one takes."),
          d("Byte order", "subtle", "Endianness is a naming convention, not a speed."),
        ],
        explanation: "Latency is per-item time. Throughput is completion rate.",
        cognitiveType: "recognize",
        objectiveIds: ["Distinguish latency from throughput with a concrete pipeline or factory example"],
        difficultyTier: 0,
      }),
      item({
        id: "lt2",
        stem: "A factory with a 40-minute bake and 200 loaves in the oven at once is mainly an example of:",
        correct: "High throughput despite high latency",
        distractors: [
          d("Eliminating latency", "reversed", "Each loaf still takes 40 minutes."),
          d("That clock frequency is the only knob", "misapplied", "Overlap, not frequency, is doing the work here."),
          d("That the oven has no capacity limit", "nearby", "The oven size is exactly the capacity that creates throughput."),
        ],
        explanation: "Each loaf still takes 40 minutes; many finish each hour.",
        cognitiveType: "apply",
        objectiveIds: ["Distinguish latency from throughput with a concrete pipeline or factory example"],
        difficultyTier: 0,
      }),
      item({
        id: "lt3",
        stem: "Switching to another ready thread while a load is in flight is trying to protect:",
        correct: "Throughput while latency is paid",
        distractors: [
          d("The load’s latency", "reversed", "The miss is still slow; switching does not shorten it."),
          d("DRAM capacity", "nearby", "Capacity is not the quantity being hidden."),
          d("ISA compatibility", "subtle", "The ISA does not change because a warp is swapped."),
        ],
        explanation: "The miss is still slow. The machine keeps retiring other work.",
        cognitiveType: "identify",
        objectiveIds: ["Explain why raising clock or width can move one without the other"],
        difficultyTier: 0,
      }),
    ],
  }),
  L({
    id: "arch-data-parallel-5",
    conceptId: "arch-data-parallel",
    title: "The same math, many elements",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: ["arch-latency-throughput"],
    goDeeper: "gpu-why-throughput",
    explanation: [
      "Some programs are a long chain: each step needs the previous result. Some programs are a map: add one to every pixel, multiply every row of a matrix. The second kind is data-parallel. The operations are the same; the elements are independent.",
      "Independence is the property hardware can spend. If element 7 does not wait on element 3, you can run them in the same cycle on different ALUs, or stagger them so a cache miss on 3 does not stall 7. A loop-carried dependence (`x = f(x)`) is the opposite. No amount of GPU marketing deletes that edge.",
      "People say 'embarrassingly parallel' when the independence is obvious. Most real programs are mixed: a data-parallel map around a sequential reduction, or a grid of threads that must meet at a barrier. The skill is seeing which parts are maps.",
    ],
    example:
      "Colouring each pixel `out[i] = 2 * in[i]` is data-parallel. Computing a prefix sum where `out[i] = out[i-1] + in[i]` is not — unless you rewrite it with a tree of partials. The rewrite is the algorithm. The hardware only runs what you made independent.",
    whyItMatters:
      "GPUs are not faster CPUs. They are machines for data-parallel work. If you cannot point at the independent elements, you are about to be disappointed by a kernel.",
    quiz: [
      item({
        id: "dp1",
        stem: "A computation is data-parallel when:",
        correct: "The same operation applies to independent elements",
        distractors: [
          d("It uses a GPU", "misapplied", "The vendor logo is not the property."),
          d("It has a for-loop", "nearby", "Loops can be sequential chains."),
          d("It touches DRAM", "subtle", "Memory traffic is unrelated to independence."),
        ],
        explanation: "The hardware property is independence, not the vendor logo.",
        cognitiveType: "recognize",
        objectiveIds: ["Recognize when a computation is data-parallel"],
        difficultyTier: 0,
      }),
      item({
        id: "dp2",
        stem: "`x = f(x)` each iteration is hard to parallelize because:",
        correct: "Each step depends on the previous result",
        distractors: [
          d("Functions are slow", "misconception", "The cost is the dependence, not call overhead."),
          d("f cannot run on a SIMD unit", "misapplied", "f can run; it just cannot run independently."),
          d("The ISA forbids it", "subtle", "ISAs happily express sequential updates."),
        ],
        explanation: "A loop-carried dependence is a chain, not a map.",
        cognitiveType: "apply",
        objectiveIds: ["Contrast that with a sequential dependence a GPU cannot wish away"],
        prerequisiteConceptIds: ["arch-latency-throughput"],
        difficultyTier: 0,
      }),
      item({
        id: "dp3",
        stem: "Rewriting a reduction as a tree of partials is an example of:",
        correct: "Creating independence the original loop did not have",
        distractors: [
          d("Raising DRAM latency", "reversed", "The rewrite is about dependence, not making memory slower."),
          d("Changing the byte order", "nearby", "Endianness does not manufacture parallelism."),
          d("Deleting the need for a clock", "subtle", "The algorithm still runs on a timed machine."),
        ],
        explanation: "The algorithm manufactures parallelism. Hardware cannot invent it.",
        cognitiveType: "identify",
        objectiveIds: ["Contrast that with a sequential dependence a GPU cannot wish away"],
        difficultyTier: 0,
      }),
    ],
  }),
];

