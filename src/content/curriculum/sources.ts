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
    informed: ["cpu-foundations", "cpu-microarch", "arch-gpu"],
    notes:
      "Assumes digital-design fluency. Five sequential modules: ISA and microarchitecture, caches/VM, protection/I/O, ILP (superscalar/VLIW/vector/threads), then multiprocessors and memory models. Quizzes sit after modules, not after every micro-topic. Self-evaluation before the deep end.",
  },
  {
    id: "stanford-cs149",
    title: "Parallel Computing",
    url: "https://gfxcourses.stanford.edu/cs149/fall25/",
    institution: "Stanford CS149",
    kind: "syllabus",
    informed: ["cpu-foundations", "cpu-microarch", "arch-gpu"],
    notes:
      "Why parallelism and a modern multi-core before GPU/CUDA. Locality and work distribution before occupancy jargon. GPU lecture implements an already-taught data-parallel model. Coherence/consistency come after, not as a first GPU topic.",
  },
  {
    id: "intel-sdm",
    title: "Intel 64 and IA-32 Architectures Software Developer's Manual",
    url: "https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html",
    institution: "Intel",
    kind: "vendor",
    informed: ["cpu-microarch"],
    notes:
      "Architectural visibility of store buffers, serializing instructions, and the x86 TSO-like model. Used only for mechanism names and ordering facts, not copied text. Microcode assists as implementation of complex ISA ops.",
  },
  {
    id: "arm-arm",
    title: "Arm Architecture Reference Manual",
    url: "https://developer.arm.com/documentation/ddi0487/latest/",
    institution: "Arm",
    kind: "vendor",
    informed: ["cpu-microarch"],
    notes:
      "Weaker default ordering than x86; explicit barriers. Used to contrast TSO with a relaxed model after coherence is already thinkable.",
  },
  {
    id: "nvidia-educators",
    title: "CUDA C++ Programming Guide",
    url: "https://docs.nvidia.com/cuda/cuda-c-programming-guide/",
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
    id: "saltzer-e2e",
    title: "End-to-end arguments in system design",
    url: "https://web.mit.edu/Saltzer/www/publications/endtoend/endtoend.pdf",
    institution: "Saltzer, Reed, Clark",
    kind: "notes",
    informed: ["net-foundations"],
    notes:
      "Functions that only the endpoints can implement correctly. Used for the argument, not as a slogan against any in-network help.",
  },
  {
    id: "rfc791",
    title: "Internet Protocol",
    url: "https://www.rfc-editor.org/rfc/rfc791",
    institution: "IETF",
    kind: "notes",
    informed: ["net-foundations"],
    notes:
      "IPv4 addressing, TTL, fragmentation, and ICMP's neighbor relationship. Used for mechanism names and header jobs, not RFC-number trivia.",
  },
  {
    id: "rfc9293",
    title: "Transmission Control Protocol",
    url: "https://www.rfc-editor.org/rfc/rfc9293",
    institution: "IETF",
    kind: "notes",
    informed: ["net-transport"],
    notes:
      "Connection state, handshake, windows, retransmission. Used for protocol semantics, not a flag catalogue.",
  },
  {
    id: "rfc5681",
    title: "TCP Congestion Control",
    url: "https://www.rfc-editor.org/rfc/rfc5681",
    institution: "IETF",
    kind: "notes",
    informed: ["net-transport"],
    notes:
      "Slow start, congestion avoidance, fast retransmit/recovery as mechanisms a sender runs without seeing the path.",
  },
  {
    id: "rfc9000",
    title: "QUIC: A UDP-Based Multiplexed and Secure Transport",
    url: "https://www.rfc-editor.org/rfc/rfc9000",
    institution: "IETF",
    kind: "notes",
    informed: ["net-transport"],
    notes:
      "Transport over UDP so the protocol can change without the kernel. Streams as the answer to head-of-line blocking.",
  },
  {
    id: "rfc4271",
    title: "A Border Gateway Protocol 4 (BGP-4)",
    url: "https://www.rfc-editor.org/rfc/rfc4271",
    institution: "IETF",
    kind: "notes",
    informed: ["net-internet"],
    notes:
      "Path-vector reachability plus attributes. Policy, not shortest path. Used for decision order and AS-path, not message formats.",
  },
  {
    id: "rfc1034",
    title: "Domain Names — Concepts and Facilities",
    url: "https://www.rfc-editor.org/rfc/rfc1034",
    institution: "IETF",
    kind: "notes",
    informed: ["net-foundations", "net-internet"],
    notes:
      "Hierarchy, resolvers, and caches. First-look DNS stays on names-to-addresses; the later course treats the system.",
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
    id: "dragon-book",
    title: "Compilers: Principles, Techniques, and Tools",
    institution: "Aho, Lam, Sethi, Ullman",
    kind: "textbook",
    informed: ["cmp-frontend", "cmp-ir"],
    notes:
      "Lexers as regular languages, parsers as CFGs, then semantic analysis and intermediate code. Used for mechanism names and the source→tokens→tree pipeline, not theorem lists.",
  },
  {
    id: "llvm-langref",
    title: "LLVM Language Reference Manual",
    url: "https://llvm.org/docs/LangRef.html",
    institution: "LLVM Project",
    kind: "vendor",
    informed: ["cmp-ir", "cmp-backend"],
    notes:
      "SSA values, φ-nodes, types, and well-formedness as a real IR contract. Used for representation facts, not opcode trivia.",
  },
  {
    id: "gcc-internals",
    title: "GNU Compiler Collection Internals",
    url: "https://gcc.gnu.org/onlinedocs/gccint/",
    institution: "GCC",
    kind: "vendor",
    informed: ["cmp-ir", "cmp-backend"],
    notes:
      "Gimple/RTL as another industrial IR family, plus instruction selection and RTL-level local rewrites. Mechanisms, not flag lists.",
  },
  {
    id: "sysv-abi",
    title: "System V Application Binary Interface AMD64",
    url: "https://gitlab.com/x86-psABIs/x86-64-ABI",
    institution: "x86-64 psABI",
    kind: "notes",
    informed: ["cmp-backend"],
    notes:
      "Argument registers, caller/callee-saved, and the stack frame a call leaves. Used as one concrete ABI, not the only possible one.",
  },
  {
    id: "itanium-cxx-abi",
    title: "Itanium C++ ABI",
    url: "https://itanium-cxx-abi.github.io/cxx-abi/",
    institution: "Itanium C++ ABI",
    kind: "notes",
    informed: ["cmp-backend"],
    notes:
      "Exception personality, unwind tables, and landing pads as the zero-cost model. Tables, not a setjmp in every frame.",
  },
  {
    id: "jvm-spec",
    title: "The Java Virtual Machine Specification",
    url: "https://docs.oracle.com/javase/specs/jvms/se21/html/index.html",
    institution: "Oracle / JCP",
    kind: "notes",
    informed: ["cmp-backend"],
    notes:
      "Runtime representation, garbage collection roots, and the idea of compiling while the program already runs. Used for runtime/JIT mechanisms, not Java trivia.",
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
  {
    id: "asml-high-na",
    title: "High-NA EUV: TWINSCAN EXE platform",
    url: "https://www.asml.com/en/products/euv-lithography-systems/twinscan-exe-5000",
    institution: "ASML",
    kind: "vendor",
    informed: ["semi-leading"],
    notes:
      "0.55 NA as a new scanner family: anamorphic projection so reticles stay a workable size, half-size exposure field, faster stages. Used for platform consequences, not model-name trivia.",
  },
  {
    id: "imec-nanosheet",
    title: "Entering the nanosheet transistor era",
    url: "https://www.imec-int.com/en/articles/entering-nanosheet-transistor-era-0",
    institution: "imec",
    kind: "notes",
    informed: ["semi-leading"],
    notes:
      "Nanosheet GAA as the fin successor; stacked sheets for width and electrostatics; forksheet and CFET as later vertical complementary scaling. Mechanisms, not a node slogan.",
  },
  {
    id: "imec-bspdn",
    title: "How to power chips from the backside",
    url: "https://www.imec-int.com/en/articles/how-power-chips-backside",
    institution: "imec",
    kind: "notes",
    informed: ["semi-leading"],
    notes:
      "Backside power decouples power delivery from front-side signal routing. Alignment through the thinned wafer and the new via stack are the bill, not a free routing lunch.",
  },
];

export const SOURCE_MAP: Record<string, CurriculumSourceRecord> = Object.fromEntries(
  CURRICULUM_SOURCES.map((s) => [s.id, s]),
);
