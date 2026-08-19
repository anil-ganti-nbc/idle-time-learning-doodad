import type { Course } from "@/lib/learning/types";

/**
 * Reference curriculum. Ordering is not a copy of any one syllabus.
 * Structural lessons taken from the sources below:
 *
 * MIT 6.5900 / 6.823: ISA and memory before deep ILP; GPUs after pipelining,
 *   OOO, prediction, and coherence — not as a first encounter with hardware.
 * Stanford CS149 / CMU 15-418: why parallelism and SIMD/multithreading before
 *   CUDA; GPU architecture as an implementation of a data-parallel model.
 * NVIDIA CUDA C++ Programming Guide: thread hierarchy → SIMT/warps →
 *   memory hierarchy → occupancy / divergence / scheduling as performance,
 *   not as introductory ontology.
 * Hennessy & Patterson: fundamentals (latency/throughput) before DLP/GPU.
 */
export const ARCH_GPU_COURSE: Course = {
  id: "arch-gpu",
  title: "Computer architecture — from pipelines to GPUs",
  categoryId: "cpu",
  curriculumVersion: 1,
  description:
    "A single course from sequential execution to GPU scheduling. Surprise Me may drop you here; it will not start you on occupancy.",
  entryRequirements: [],
  sourceReferences: [
    {
      title: "MIT 6.5900 / 6.823 Computer System Architecture (Fall 2024 lecture order)",
      url: "https://csg.csail.mit.edu/6.5900/lecnotes.html",
      kind: "syllabus",
      notes:
        "Caches and pipelining before OOO/renaming; branch prediction and speculation before multithreading; vectors then GPUs near the end. Assessments sit after modules, not after every micro-topic.",
    },
    {
      title: "Stanford CS149 Parallel Computing (Fall 2025)",
      url: "https://cs149.stanford.edu/",
      kind: "syllabus",
      notes:
        "Motivation and forms of parallelism (multi-core, SIMD, multithreading) before GPU/CUDA. GPU lecture implements an already-taught data-parallel model.",
    },
    {
      title: "CMU 15-418/618 Parallel Computer Architecture and Programming",
      url: "https://www.cs.cmu.edu/~418/",
      kind: "syllabus",
      notes:
        "Same lineage as CS149. Treats GPU execution as a consequence of throughput computing, not a bag of vendor terms.",
    },
    {
      title: "NVIDIA CUDA C++ Programming Guide — programming model and hardware implementation",
      url: "https://docs.nvidia.com/cuda/cuda-c-programming-guide/",
      kind: "vendor",
      notes:
        "Official order: kernels and thread hierarchy, then SIMT/warps, memory spaces, then occupancy, coalescing, and divergence as performance consequences.",
    },
    {
      title: "Hennessy & Patterson, Computer Architecture: A Quantitative Approach",
      kind: "textbook",
      notes:
        "Fundamentals of performance (latency vs throughput, locality) before ILP, then data-level parallelism / GPUs as a separate axis from a single-thread pipeline.",
    },
  ],
  modules: [
    {
      id: "arch-gpu-foundations",
      title: "What the machine is optimizing",
      blurb: "Latency, throughput, and why some work is data-parallel.",
      order: 0,
      prerequisites: [],
      conceptIds: ["arch-latency-throughput", "arch-data-parallel"],
      spineIds: ["arch-latency-throughput"],
    },
    {
      id: "arch-gpu-pipeline",
      title: "Keeping a sequential core busy",
      blurb: "Pipelines and the hazards that empty them.",
      order: 1,
      prerequisites: ["arch-gpu-foundations"],
      conceptIds: ["cpu-pipeline", "cpu-hazards"],
      spineIds: ["cpu-pipeline", "cpu-hazards"],
    },
    {
      id: "arch-gpu-ilp",
      title: "Instruction-level parallelism",
      blurb: "Prediction, renaming, and retiring work in program order.",
      order: 2,
      prerequisites: ["arch-gpu-pipeline"],
      conceptIds: ["cpu-branch-prediction", "cpu-renaming", "cpu-btb", "cpu-predictors", "cpu-ras", "cpu-rob"],
      spineIds: ["cpu-branch-prediction", "cpu-renaming"],
    },
    {
      id: "arch-gpu-locality",
      title: "Locality and shared memory",
      blurb: "Why private caches must stay honest — later GPU memories reuse this.",
      order: 3,
      prerequisites: ["arch-gpu-pipeline"],
      conceptIds: ["cpu-coherency"],
      spineIds: ["cpu-coherency"],
    },
    {
      id: "arch-gpu-simt",
      title: "GPU execution model",
      blurb: "Throughput hardware: grids, SIMT, warps.",
      order: 4,
      prerequisites: ["arch-gpu-pipeline", "arch-gpu-foundations"],
      conceptIds: ["gpu-why-throughput", "gpu-execution-model", "gpu-simt", "gpu-warps"],
      spineIds: ["gpu-why-throughput", "gpu-execution-model", "gpu-simt", "gpu-warps"],
    },
    {
      id: "arch-gpu-resources",
      title: "Resources and the memory hierarchy",
      blurb: "What a warp is competing for, and where data lives.",
      order: 5,
      prerequisites: ["arch-gpu-simt"],
      conceptIds: ["gpu-exec-resources", "gpu-memory-hierarchy", "gpu-coalescing", "gpu-occupancy"],
      spineIds: ["gpu-memory-hierarchy", "gpu-occupancy"],
    },
    {
      id: "arch-gpu-schedule",
      title: "Hiding latency, paying for divergence",
      blurb: "Scheduling interactions — the advanced end of this course.",
      order: 6,
      prerequisites: ["arch-gpu-resources"],
      conceptIds: ["gpu-divergence", "gpu-latency-hiding", "gpu-scheduler", "gpu-resource-limits"],
      spineIds: ["gpu-divergence", "gpu-latency-hiding"],
    },
  ],
};
