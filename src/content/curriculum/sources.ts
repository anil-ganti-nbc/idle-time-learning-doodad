import type { CurriculumSourceRecord } from "./schema";

/**
 * Research ledger. Each entry records what structural lesson was taken
 * from a reputable curriculum or primary source. Course prose is not copied.
 */
export const CURRICULUM_SOURCES: CurriculumSourceRecord[] = [
  {
    id: "mit-6823",
    title: "Computer System Architecture",
    url: "https://ocw.mit.edu/courses/6-823-computer-system-architecture-fall-2005/pages/syllabus/",
    institution: "MIT OCW 6.823",
    kind: "ocw",
    informed: ["cpu-foundations", "cpu-microarch"],
    notes:
      "Assumes digital-design fluency. Five sequential modules: ISA and microarchitecture, caches/VM, protection/I/O, ILP (superscalar/VLIW/vector/threads), then multiprocessors and memory models. Quizzes sit after modules, not after every micro-topic. Self-evaluation before the deep end.",
  },
  {
    id: "stanford-cs149",
    title: "Parallel Computing",
    url: "https://gfxcourses.stanford.edu/cs149/fall25/",
    institution: "Stanford CS149",
    kind: "syllabus",
    informed: ["cpu-foundations", "arch-gpu"],
    notes:
      "Why parallelism and a modern multi-core before GPU/CUDA. Locality and work distribution before occupancy jargon. GPU lecture implements an already-taught data-parallel model. Coherence/consistency come after, not as a first GPU topic.",
  },
  {
    id: "nvidia-educators",
    title: "CUDA educational resources / CUDA C++ Programming Guide",
    url: "https://developer.nvidia.com/educators/existing-courses",
    institution: "NVIDIA",
    kind: "vendor",
    informed: ["arch-gpu"],
    notes:
      "Official order: kernels and thread hierarchy, then SIMT/warps, memory spaces, then occupancy, coalescing, and divergence as performance consequences — not introductory ontology.",
  },
  {
    id: "mit-6152j",
    title: "Micro/Nano Processing Technology",
    url: "https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/pages/syllabus/",
    institution: "MIT OCW 6.152J",
    kind: "ocw",
    informed: ["semi-process", "semi-litho"],
    notes:
      "Unit-process sequence: diffusion, oxidation, photolithography, CVD/PVD, etch, metallization. Labs fabricate a device so integration is later than the individual steps. Lithography is one process among peers, not the first word.",
  },
  {
    id: "mit-6774",
    title: "Physics of Microfabrication: Front End Processing",
    url: "https://ocw.mit.edu/courses/6-774-physics-of-microfabrication-front-end-processing-fall-2004/",
    institution: "MIT OCW 6.774",
    kind: "ocw",
    informed: ["semi-process"],
    notes:
      "Front-end physics (oxidation, implant/diffusion, films) as mechanisms, separate from tool-vendor leading-edge lore. Foundations stay on wafer and film physics before EUV.",
  },
  {
    id: "asml-euv",
    title: "EUV lithography systems",
    url: "https://www.asml.com/en/products/euv-lithography-systems",
    institution: "ASML",
    kind: "vendor",
    informed: ["semi-litho", "semi-leading"],
    notes:
      "Source (CO2 + tin), multilayer mirrors, vacuum, wafer stage, NXE 0.33 NA vs EXE High-NA 0.55. High-NA is a later platform, not an entry concept. DUV still used in parallel.",
  },
  {
    id: "asml-optics",
    title: "Lithography principles: lenses and mirrors",
    url: "https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors",
    institution: "ASML",
    kind: "vendor",
    informed: ["semi-litho", "semi-leading"],
    notes:
      "Rayleigh resolution, NA, refractive DUV vs reflective EUV because materials absorb 13.5 nm. Immersion NA vs EUV NA must not be compared as raw numbers without wavelength.",
  },
  {
    id: "mit-61810",
    title: "Operating System Engineering",
    url: "https://ocw.mit.edu/courses/6-1810-operating-system-engineering-fall-2023/pages/syllabus/",
    institution: "MIT OCW 6.1810",
    kind: "ocw",
    informed: ["os-foundations", "os-concurrency", "os-storage"],
    notes:
      "xv6 as a complete small Unix: kernel, syscalls, processes, VM, filesystems, concurrency. Hardware/software contract first. Labs extend one subsystem at a time after the kernel is thinkable.",
  },
  {
    id: "mit-xv6",
    title: "xv6: a simple, Unix-like teaching operating system",
    url: "https://pdos.csail.mit.edu/6.1810/2025/xv6.html",
    institution: "MIT PDOS",
    kind: "notes",
    informed: ["os-foundations", "os-concurrency", "os-storage"],
    notes:
      "Book order: OS organization, page tables, traps, isolation, locks, scheduling, file system. Persistence after virtualization and concurrency.",
  },
  {
    id: "stanford-cs144",
    title: "Introduction to Computer Networking",
    url: "https://web.stanford.edu/class/cs144/",
    institution: "Stanford CS144",
    kind: "syllabus",
    informed: ["net-foundations", "net-transport", "net-internet"],
    notes:
      "Packets and reliable byte-stream labs before routing politics. Transport and congestion as mechanisms a sender can run without seeing the path. Internet architecture (IP, AS, BGP) is a later course, not week one.",
  },
  {
    id: "stanford-cs143",
    title: "Compilers",
    url: "https://web.stanford.edu/class/cs143/",
    institution: "Stanford CS143",
    kind: "syllabus",
    informed: ["cmp-frontend", "cmp-ir", "cmp-backend"],
    notes:
      "Project phases: lex, parse, semantic analysis, then runtime/codegen, then IR/optimization, register allocation, GC, JIT. Front-end is a real course. Optimization is not the first compiler idea.",
  },
  {
    id: "cmu-15411",
    title: "Compiler Design",
    url: "https://csd.cs.cmu.edu/15411611-compiler-design",
    institution: "CMU 15-411/611",
    kind: "syllabus",
    informed: ["cmp-ir", "cmp-backend"],
    notes:
      "IR, dataflow, and instruction selection as the intellectual center. Backend and runtime are not an afterthought once the tree exists.",
  },
  {
    id: "stanford-cs229",
    title: "Machine Learning",
    url: "https://cs229.stanford.edu/syllabus-new.html",
    institution: "Stanford CS229",
    kind: "syllabus",
    informed: ["ml-foundations", "ml-neural"],
    notes:
      "Supervised setup, linear/logistic models, then generalization, then neural nets. Unsupervised and RL later. Linear algebra and probability are assumed, not taught as LLM trivia. No transformers in the core sequence.",
  },
  {
    id: "stanford-cs224n",
    title: "Natural Language Processing with Deep Learning",
    url: "https://web.stanford.edu/class/cs224n/",
    institution: "Stanford CS224N",
    kind: "syllabus",
    informed: ["ml-neural", "ml-transformers"],
    notes:
      "Embeddings, then networks, then RNNs, then attention/transformers, then pretraining. LLMs are a destination. Assumes ML foundations already exist.",
  },
  {
    id: "hsny-edu",
    title: "HSNY NYC education (Horology 101–104)",
    url: "https://hs-ny.org/nyc-education",
    institution: "Horological Society of New York",
    kind: "syllabus",
    informed: ["horo-foundations", "horo-regulation"],
    notes:
      "101 movement mechanics before 102 gear train, 103 winding/setting, 104 escapement. Complications are not in the beginner ladder. Hands-on order: whole movement, then subsystems.",
  },
  {
    id: "wostep-training",
    title: "WOSTEP training and education",
    url: "https://www.wostep.ch/index.php/en/training-and-education",
    institution: "WOSTEP",
    kind: "syllabus",
    informed: ["horo-foundations", "horo-regulation", "horo-complications"],
    notes:
      "Long-form watchmaker training: theory and component work before chronometry adjustments and chronograph as later specializations. Timing is a discipline, not a tourbillon lecture.",
  },
  {
    id: "wostep-chrono",
    title: "WOSTEP Chronometry Adjustments / Chronograph",
    url: "https://www.wostep.ch/index.php/en/training/chronometry-adjustments",
    institution: "WOSTEP",
    kind: "syllabus",
    informed: ["horo-regulation", "horo-complications"],
    notes:
      "Regulation, isochronism, positional timing, then chronograph as a complication course. Advanced after the simple movement is honest.",
  },
  {
    id: "mit-21m051",
    title: "Fundamentals of Music",
    url: "https://ocw.mit.edu/courses/21m-051-fundamentals-of-music-spring-2007/pages/syllabus/",
    institution: "MIT OCW 21M.051",
    kind: "ocw",
    informed: ["mus-foundations"],
    notes:
      "Elements and rhythm/pitch before major/minor scales, then functional harmony last. Ear and notation travel with the theory. Harmony is not week one.",
  },
  {
    id: "mit-21m301",
    title: "Harmony and Counterpoint I",
    url: "https://ocw.mit.edu/courses/21m-301-harmony-and-counterpoint-i-spring-2005/pages/syllabus/",
    institution: "MIT OCW 21M.301",
    kind: "ocw",
    informed: ["mus-harmony"],
    notes:
      "Species counterpoint and four-part writing as the way harmonic function becomes a craft. Voice leading is a prerequisite to analysis, not a garnish.",
  },
  {
    id: "mit-21m302",
    title: "Harmony and Counterpoint II",
    url: "https://ocw.mit.edu/courses/21m-302-harmony-and-counterpoint-ii-spring-2005/pages/syllabus/",
    institution: "MIT OCW 21M.302",
    kind: "ocw",
    informed: ["mus-foundations", "mus-harmony", "mus-heavy"],
    notes:
      "Chromaticism, mixture, modulation. The bridge from common-practice function toward the chromatic vocabulary heavy music actually uses.",
  },
  {
    id: "mit-21m350",
    title: "Musical Analysis",
    url: "https://ocw.mit.edu/courses/21m-350-musical-analysis-spring-2008/pages/syllabus/",
    institution: "MIT OCW 21M.350",
    kind: "ocw",
    informed: ["mus-heavy", "dm-advanced"],
    notes:
      "Form and analysis as a method. We reuse the method on riff-based music rather than copying the repertoire.",
  },
  {
    id: "mit-metal101",
    title: "Heavy Metal 101",
    url: "https://ocw.mit.edu/courses/res-21m-001-heavy-metal-101-january-iap-2025/",
    institution: "MIT OCW RES.21M.001",
    kind: "ocw",
    informed: ["dm-history", "dm-construction", "dm-advanced"],
    notes:
      "History, listening, culture, songwriting tropes, harsh vocals, technique — not celebrity lists. Extreme metal is a sound and a construction problem.",
  },
  {
    id: "berklee-metal",
    title: "Metal Guitar",
    url: "https://online.berklee.edu/courses/metal-guitar",
    institution: "Berklee Online",
    kind: "syllabus",
    informed: ["dm-construction", "dm-advanced"],
    notes:
      "Riff vocabulary, rhythm, modes, and right-hand technique as construction skills. Depends on guitar/music fundamentals rather than reteaching intervals.",
  },
  {
    id: "berklee-guitar",
    title: "Guitar Fundamentals",
    url: "https://online.berklee.edu/courses/guitar-fundamentals",
    institution: "Berklee Online",
    kind: "syllabus",
    informed: ["mus-foundations", "dm-construction"],
    notes:
      "Technique and basic harmonic literacy that death-metal construction should assume, not duplicate.",
  },
];

export const SOURCE_MAP: Record<string, CurriculumSourceRecord> = Object.fromEntries(
  CURRICULUM_SOURCES.map((s) => [s.id, s]),
);
