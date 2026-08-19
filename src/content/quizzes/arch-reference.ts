import type { QuizItemDraft } from "@/lib/learning/types";
import { d } from "../lesson";

/** Specialist drafts for occupancy / divergence / scheduler. Not full lessons. */
export const ARCH_REFERENCE_DRAFTS: Record<string, [QuizItemDraft, QuizItemDraft, QuizItemDraft]> = {
  "gpu-occupancy": [
    {
      id: "occ1",
      stem: "Occupancy is primarily limited by:",
      correctAnswer: "How many warps can live on an SM given registers and shared memory",
      distractors: [
        d("The host CPU clock that launched the kernel", "misapplied", "Host frequency does not size the SM’s files."),
        d("Whether the kernel source was written in C++", "nearby", "Language is not the resource budget."),
        d("The number of PCIe lanes to the device", "subtle", "Link width is off-chip, not occupancy."),
      ],
      correctExplanation: "Occupancy is a resident-warp budget, not a marketing occupancy percentage in isolation.",
      objectiveIds: ["Define occupancy as how many warps can reside given registers and shared memory"],
      prerequisiteConceptIds: ["gpu-warps", "gpu-exec-resources"],
      difficultyTier: 4,
      cognitiveType: "integrate",
    },
    {
      id: "occ2",
      stem: "Raising occupancy can fail to raise throughput when:",
      correctAnswer: "The kernel is already limited by something other than waiting on memory",
      distractors: [
        d("The warps happen to have registers allocated", "misconception", "Having registers is normal, not a limiter by itself."),
        d("The grid was launched with more than one block", "nearby", "Multiple blocks are the usual case."),
        d("The device happens to speak the CUDA ISA", "subtle", "The vendor ISA is not the bottleneck story."),
      ],
      correctExplanation: "Occupancy buys latency hiding. If you are math-bound or uncoalesced, more warps may not help.",
      objectiveIds: ["Predict when more resident warps stop raising throughput"],
      prerequisiteConceptIds: ["gpu-warps", "gpu-exec-resources"],
      difficultyTier: 4,
      cognitiveType: "diagnose",
    },
    {
      id: "occ3",
      stem: "A kernel that uses almost the whole register file per thread typically:",
      correctAnswer: "Limits how many warps can reside, so latency hiding gets thinner",
      distractors: [
        d("Automatically becomes faster because registers beat DRAM", "reversed", "Per-thread richness can starve residency."),
        d("Forces the hardware warp width down to 16", "misapplied", "Warp width is a machine constant."),
        d("Disables the SM’s shared-memory file entirely", "subtle", "Shared memory is a separate budget."),
      ],
      correctExplanation: "Register pressure and occupancy trade. More state per thread, fewer residents.",
      objectiveIds: ["Define occupancy as how many warps can reside given registers and shared memory"],
      prerequisiteConceptIds: ["gpu-warps"],
      difficultyTier: 4,
      cognitiveType: "tradeoff",
    },
  ],
  "gpu-divergence": [
    {
      id: "div1",
      stem: "Control divergence hurts when:",
      correctAnswer: "Threads that share a warp take different paths and both sides must issue",
      distractors: [
        d("Two different warps happen to take different paths", "nearby", "Inter-warp independence is not divergence."),
        d("The kernel was written with no branches at all", "reversed", "No branches means no divergent paths."),
        d("Shared memory on the SM is already full", "misapplied", "That is an occupancy/resource limit."),
      ],
      correctExplanation: "One shared program counter, two passes, a mask.",
      objectiveIds: ["Locate divergence inside one warp, not across warps"],
      prerequisiteConceptIds: ["gpu-warps", "gpu-simt"],
      difficultyTier: 4,
      cognitiveType: "integrate",
    },
    {
      id: "div2",
      stem: "A warp with 20 lanes taking sqrt and 12 taking else pays:",
      correctAnswer: "Both paths’ issue time, with inactive lanes masked on each pass",
      distractors: [
        d("Only the majority path’s issue time", "reversed", "Both sides run."),
        d("A grid-wide barrier across every block", "nearby", "A branch is not a grid sync."),
        d("A host-side context switch on the CPU", "subtle", "This is SM issue, not OS scheduling."),
      ],
      correctExplanation: "You wrote scalar if/else. You paid a SIMD-shaped bill.",
      objectiveIds: ["Diagnose the issue cost of a mixed if/else"],
      prerequisiteConceptIds: ["gpu-simt"],
      difficultyTier: 4,
      cognitiveType: "diagnose",
    },
    {
      id: "div3",
      stem: "Sorting threads so similar predicates sit in the same warp is trying to:",
      correctAnswer: "Reduce intra-warp path mixing without changing the math",
      distractors: [
        d("Change the device ISA the kernel was compiled for", "misapplied", "Layout is not an ISA change."),
        d("Increase DRAM latency on purpose", "reversed", "The goal is issue efficiency, not slower memory."),
        d("Replace occupancy accounting with ILP", "subtle", "This is a divergence layout trick."),
      ],
      correctExplanation: "You cannot delete the branch; you can stop mixing both sides in one PC.",
      objectiveIds: ["Locate divergence inside one warp, not across warps"],
      prerequisiteConceptIds: ["gpu-warps", "gpu-occupancy"],
      difficultyTier: 4,
      cognitiveType: "tradeoff",
    },
  ],
  "gpu-scheduler": [
    {
      id: "sch1",
      stem: "A warp scheduler’s job is mainly to:",
      correctAnswer: "Pick which ready warp issues next given stalls, caches, and issue width",
      distractors: [
        d("Compile the kernel on the host before launch", "misapplied", "The scheduler is hardware, not nvcc."),
        d("Allocate the CPU core’s reorder buffer", "nearby", "ROBs are a CPU-core structure."),
        d("Choose the CUDA stream on the host queue", "subtle", "Streams are a host launch queue."),
      ],
      correctExplanation: "Ready versus stalled warps are the occupancy you already paid for.",
      objectiveIds: ["State what the warp scheduler actually chooses"],
      prerequisiteConceptIds: ["gpu-divergence", "gpu-occupancy"],
      difficultyTier: 5,
      cognitiveType: "integrate",
    },
    {
      id: "sch2",
      stem: "A greedy scheduler that always prefers the oldest ready warp can still lose when:",
      correctAnswer: "That warp’s next memory touch fights a cache already owned by a younger warp",
      distractors: [
        d("Warps on this machine happen to be 32 wide", "misconception", "Width is constant."),
        d("The kernel happens to use IEEE floats", "nearby", "Datatype is not the scheduling conflict."),
        d("The host CPU happens to be idle", "subtle", "Host idleness is not an SM issue."),
      ],
      correctExplanation: "Issue order interacts with caches. Oldest-first is a heuristic, not a law.",
      objectiveIds: ["Diagnose how issue order interacts with caches and stalls"],
      prerequisiteConceptIds: ["gpu-occupancy", "gpu-divergence"],
      difficultyTier: 5,
      cognitiveType: "diagnose",
    },
    {
      id: "sch3",
      stem: "Occupancy, divergence, and the scheduler interact because:",
      correctAnswer: "Residency creates candidates; divergence creates stalls; the scheduler spends the leftover issue slots",
      distractors: [
        d("They are three marketing names for the same IPC number", "reversed", "They are coupled but not synonyms."),
        d("The compiler fuses them into one ISA control bit", "misapplied", "These are runtime/hardware facts."),
        d("Only High-NA lithography changes how they behave", "subtle", "Manufacturing is a different course."),
      ],
      correctExplanation: "Specialist GPU performance is the product of who is resident, who is masked, and who issues.",
      objectiveIds: ["State what the warp scheduler actually chooses"],
      prerequisiteConceptIds: ["gpu-occupancy", "gpu-divergence", "gpu-warps"],
      difficultyTier: 5,
      cognitiveType: "tradeoff",
    },
  ],
};

export function referenceDraftsFor(conceptId: string) {
  return ARCH_REFERENCE_DRAFTS[conceptId];
}
