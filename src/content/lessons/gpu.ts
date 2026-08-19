import type { Lesson } from "@/lib/learning/types";
import { L, q } from "../lesson";

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
      q(
        "lt1",
        "A change that shrinks how long one instruction takes, without changing how many finish per cycle, primarily moved:",
        ["Throughput", "Latency", "Occupancy", "Coherence"],
        1,
        "Latency is per-item time. Throughput is completion rate.",
      ),
      q(
        "lt2",
        "A factory with a 40-minute bake and 200 loaves in the oven at once is mainly an example of:",
        [
          "Eliminating latency",
          "High throughput despite high latency",
          "A structural hazard",
          "Register renaming",
        ],
        1,
        "Each loaf still takes 40 minutes; many finish each hour.",
      ),
      q(
        "lt3",
        "Switching to another ready thread while a load is in flight is trying to protect:",
        ["The load’s latency", "Throughput while latency is paid", "DRAM capacity", "ISA compatibility"],
        1,
        "The miss is still slow. The machine keeps retiring other work.",
      ),
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
      q(
        "dp1",
        "A computation is data-parallel when:",
        [
          "It uses a GPU",
          "The same operation applies to independent elements",
          "It has a for-loop",
          "It touches DRAM",
        ],
        1,
        "The hardware property is independence, not the vendor logo.",
      ),
      q(
        "dp2",
        "`x = f(x)` each iteration is hard to parallelize because:",
        [
          "Functions are slow",
          "Each step depends on the previous result",
          "f cannot run on a SIMD unit",
          "The ISA forbids it",
        ],
        1,
        "A loop-carried dependence is a chain, not a map.",
      ),
      q(
        "dp3",
        "Rewriting a reduction as a tree of partials is an example of:",
        [
          "Raising DRAM latency",
          "Creating independence the original loop did not have",
          "Register renaming",
          "Cache coherency",
        ],
        1,
        "The algorithm manufactures parallelism. Hardware cannot invent it.",
      ),
    ],
  }),
  L({
    id: "gpu-why-throughput-10",
    conceptId: "gpu-why-throughput",
    title: "Spend silicon on ALUs, not crystal balls",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["arch-data-parallel", "cpu-pipeline"],
    goDeeper: "gpu-execution-model",
    explanation: [
      "A modern CPU core spends a startling fraction of its transistors on making *one* thread look fast: predictors, reorder buffers, huge caches, fancy prefetchers. That is the right bet when the next instruction depends on this one and the user is waiting on a single program counter.",
      "A GPU makes the opposite bet. If you have thousands of independent elements, you can run them on many simple pipelines and hide memory latency by switching to another group of threads. You spend area on ALUs and memory bandwidth, not on guessing the next branch of one lonely thread.",
      "The cost is real. GPUs are weak at divergent, pointer-chasing, or lightly parallel work. They also want you to express the map (a kernel over an index space) instead of a sequential loop the hardware must discover. The win appears only when the work matches the bet.",
    ],
    example:
      "Shading a million pixels, multiplying large matrices, or running the same force calculation on many particles: the GPU’s extra ALUs stay busy. Walking a linked list of Java objects: the CPU’s caches and predictors win, and the GPU sits on a long chain of misses.",
    whyItMatters:
      "Stories that a new laptop 'has more cores so everything is faster' collapse once you know which program is a map and which is a chain. The rest of this module is how the map is actually executed.",
    quiz: [
      q(
        "gw1",
        "A latency-optimized core spends relatively more area on:",
        [
          "Identical ALUs",
          "Prediction, reordering, and caches for one thread",
          "HBM stacks",
          "Wavefront occupancy",
        ],
        1,
        "The CPU bet is 'make this PC fast'.",
      ),
      q(
        "gw2",
        "A throughput GPU is a good match when:",
        [
          "The next instruction always depends on the last",
          "Many elements can be processed independently",
          "The working set is one cache line",
          "You need precise exceptions on every instruction",
        ],
        1,
        "Independence is what extra ALUs can spend.",
      ),
      q(
        "gw3",
        "Switching to another group of threads during a miss is buying:",
        ["Shorter DRAM latency", "Throughput while a long latency is in flight", "A larger ISA", "Coherence"],
        1,
        "The miss is still slow. Other maps keep the ALUs fed.",
      ),
    ],
  }),
  L({
    id: "gpu-execution-model-10",
    conceptId: "gpu-execution-model",
    title: "A kernel is a launch over an index space",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["gpu-why-throughput"],
    goDeeper: "gpu-simt",
    explanation: [
      "You do not hand a GPU a sequential program and hope. You write a *kernel*: a function that runs once per thread, and you *launch* it over a grid of thread blocks. Each thread knows its index (`threadIdx`, `blockIdx`) and uses that index to pick the element it owns.",
      "The hierarchy is a programming model, not yet the hardware. Threads are the finest name you write. Blocks are the unit that can share a small on-chip memory and a barrier. The grid is the whole launch. How those names map onto warps and SMs is the next concept — keep them separate for one more unit.",
      "This is why a CUDA or Metal kernel looks like a scalar function and still uses the machine. The launch geometry *is* the parallel loop. If you launch too few threads, you underfill the chip. If you launch a geometry that fights the later warp size, you waste lanes. The model came first so you could reason before counting 32s.",
    ],
    example:
      "`vectorAdd<<<blocks, threads>>>(A, B, C, N)` with each thread doing `C[i] = A[i] + B[i]` for `i = blockIdx.x * blockDim.x + threadIdx.x`. The C code is scalar. The launch is the map. A 256-thread block on a 1,000,000-element vector is a choice about occupancy and leftover threads, not about the addition itself.",
    whyItMatters:
      "Every later word — warp, occupancy, coalescing — is an implementation detail of this launch. If you skip the model, those words become vendor folklore.",
    quiz: [
      q(
        "ge1",
        "In the CUDA-style model, the function you write that runs per thread is a:",
        ["Wavefront", "Kernel", "Reorder buffer", "Page table"],
        1,
        "A kernel is the per-thread body; the launch supplies the index space.",
      ),
      q(
        "ge2",
        "A thread block is the level that can:",
        [
          "Address all of DRAM privately",
          "Share a small on-chip memory and a barrier",
          "Retire x86 instructions",
          "Replace the grid",
        ],
        1,
        "Shared memory and __syncthreads are block-scoped.",
      ),
      q(
        "ge3",
        "threadIdx / blockIdx exist so that:",
        [
          "The compiler can rename registers",
          "Each thread can compute which element it owns",
          "Warps can be 64 wide",
          "Caches stay coherent",
        ],
        1,
        "The index *is* the parallel loop variable.",
      ),
    ],
  }),
  L({
    id: "gpu-simt-10",
    conceptId: "gpu-simt",
    title: "Scalar code, lockstep hardware",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["gpu-execution-model"],
    goDeeper: "gpu-warps",
    explanation: [
      "SIMD packs several values into one register and runs one instruction on the pack. You write vectors. SIMT (single instruction, multiple threads) lets you write *scalar* thread code. The hardware still runs one instruction across a group of threads, and it *masks* the lanes that should not participate.",
      "That is why a kernel can contain `if (threadIdx.x == 0)` and still be a vector machine. The other lanes go idle under a mask; they do not take a different instruction. When the branch ends, the group reconverges. The programming model hid the pack. The energy and occupancy cost of idle lanes did not go away.",
      "People collapse SIMT into 'it's just SIMD'. The distinction matters for compilers and for divergence. SIMD that you wrote as `_mm256_add_ps` cannot silently take two control-flow paths. SIMT can look like it did — and then you pay both paths. Next unit names the group that shares the instruction: the warp or wavefront.",
    ],
    example:
      "32 threads execute `if (x[i] > 0) y[i] = sqrt(x[i]); else y[i] = 0`. If 20 lanes are positive, the hardware issues the sqrt path with 20 lanes active, then the else path with 12 active. You wrote scalar if/else. You paid a SIMD-shaped bill.",
    whyItMatters:
      "SIMT is why GPU kernels read like C and profile like vector machines. Divergence, occupancy, and 'why is my if so slow?' are all this fact wearing different hats.",
    quiz: [
      q(
        "gs1",
        "SIMT differs from explicit SIMD mainly because:",
        [
          "It uses slower ALUs",
          "You write scalar thread code; the hardware groups and masks lanes",
          "It cannot do floating point",
          "It has no registers",
        ],
        1,
        "The pack is implicit. The cost of idle lanes is not.",
      ),
      q(
        "gs2",
        "When some threads in a SIMT group take an if and others take the else:",
        [
          "Both paths run, with inactive lanes masked",
          "The GPU forks into two independent programs",
          "The compiler rejects the kernel",
          "Only the first thread’s path runs",
        ],
        0,
        "One instruction stream, two passes, a mask.",
      ),
      q(
        "gs3",
        "A kernel that looks scalar can still waste work because:",
        [
          "C cannot run on a GPU",
          "Inactive lanes in the group still occupy the instruction issue",
          "DRAM ignores masks",
          "Blocks cannot share memory",
        ],
        1,
        "Idle lanes are why divergence is a throughput tax.",
      ),
    ],
  }),
  L({
    id: "gpu-warps-10",
    conceptId: "gpu-warps",
    title: "The scheduler does not see your threads",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["gpu-simt"],
    goDeeper: "gpu-occupancy",
    explanation: [
      "Hardware groups consecutive threads into a warp (NVIDIA, typically 32) or wavefront (AMD, historically 64, now often 32). That group shares a program counter and is the unit the scheduler considers ready or stalled. You launched threads. The chip runs warps.",
      "A block whose size is not a multiple of the warp width pads out a partial warp. Those extra lanes do nothing useful and still occupy resources. A block of 1 thread and a block of 32 threads that do the same math are not the same machine: the first still occupies a warp.",
      "This is also why 'how many threads can I launch?' is the wrong first question. The occupancy question is how many *warps* can live on an SM given registers and shared memory. Divergence is a warp-local story: threads in different warps taking different branches do not mask each other.",
    ],
    example:
      "A block of 40 threads on a 32-wide warp is two warps: 32 full, 8 useful + 24 idle. A 256-thread block is exactly 8 warps. The 256 number looks nicer in a slide; the 8 is what the issue logic counts.",
    whyItMatters:
      "Occupancy, divergence, and coalescing are all warp-shaped. If you keep thinking in individual threads, those words will stay metaphorical.",
    quiz: [
      q(
        "ww1",
        "A warp (or wavefront) is primarily:",
        [
          "A programmer-declared block",
          "The hardware group that shares an instruction and is scheduled as one",
          "A DRAM page",
          "A CUDA stream",
        ],
        1,
        "The scheduler’s quantum, not the kernel’s syntax.",
      ),
      q(
        "ww2",
        "A 40-thread block on a 32-wide warp wastes lanes because:",
        [
          "40 is prime",
          "The second warp is only 8 threads and still occupies 32 lanes",
          "Blocks cannot exceed 32",
          "The compiler rounds down to 32 and drops work",
        ],
        1,
        "Partial warps still take a full issue slot.",
      ),
      q(
        "ww3",
        "Two threads in *different* warps taking opposite branches:",
        [
          "Must mask each other",
          "Do not diverge against each other; divergence is intra-warp",
          "Force a grid-wide barrier",
          "Disable coalescing permanently",
        ],
        1,
        "Divergence is a property of one shared program counter.",
      ),
    ],
  }),
];
