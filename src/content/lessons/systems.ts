import type { Lesson } from "@/lib/learning/types";
import { L, q } from "../lesson";

export const SYSTEMS_LESSONS: Lesson[] = [
  L({
    id: "net-stack-5",
    conceptId: "net-stack",
    title: "Layers are contracts",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "net-congestion",
    explanation: [
      "The textbook OSI stack is a teaching aid. The running internet is closer to: link delivers frames on a local medium, IP delivers packets between hosts, UDP/TCP deliver datagrams or byte streams between ports, TLS authenticates and encrypts a stream, and the application lies about all of it.",
      "A layer is a promise about what the layer above does not have to know. IP does not promise order or reliability. TCP does, on top of IP, by inventing sequence numbers and retransmission. When people say ‘the network lost my message’, they usually mean a layer that never promised delivery.",
    ],
    example:
      "DNS over UDP can lose a query and the resolver just retries. HTTP/3 runs over QUIC, which reimplements reliability and congestion control on UDP because the middleboxes ossified TCP.",
    whyItMatters:
      "Debugging and regulation both fail when you blame the wrong layer. A TLS certificate error is not an IP routing error, and a BGP leak is not a CSS bug.",
    quiz: [
      q("ns1", "IP promises:", ["In-order reliable delivery", "Best-effort packet delivery between hosts", "Encrypted streams", "Exactly-once RPC"], 1, "Everything else is someone else’s job."),
      q("ns2", "TCP exists to:", ["Route between ASes", "Provide a reliable, ordered byte stream over unreliable IP", "Replace Ethernet", "Name hosts"], 1, "Sequence numbers, ACKs, retransmission."),
      q("ns3", "QUIC rides UDP mainly because:", ["UDP is faster in silicon always", "Middleboxes treat unknown TCP extensions badly; UDP is a freer user-space playground", "IP is deprecated", "TLS cannot run on TCP"], 1, "Ossification, plus handshake fusion."),
    ],
  }),
  L({
    id: "net-cc-10",
    conceptId: "net-congestion",
    title: "Congestion control is a distributed argument",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["net-stack"],
    goDeeper: "net-bgp",
    explanation: [
      "A sender does not know the path capacity. It infers it from loss, delay, or explicit marks (ECN). Classic Reno treats loss as ‘slow down’. BBR treats rising delay and delivery rate as the signal and tries to sit at the pipe’s BDP. Both can be wrong: Wi-Fi loss is not always congestion; bufferbloat makes delay a lying signal.",
      "Fairness is emergent and fragile. Two flows sharing a bottleneck should each get about half if they use compatible rules. A more aggressive variant, or a UDP sender with no control, eats the rest. This is why ‘fairness’ in QUIC and in data-center transports (DCTCP, Swift) is a research object, not a moral property of packets.",
      "The buffer in the middle is part of the algorithm. An oversized buffer (bufferbloat) hides loss and stores delay. Your video call then ‘has latency’ that is actually a standing queue.",
    ],
    example:
      "A home router with 100 ms of standing queue makes every ACK late. Cubic TCP fills that buffer; latency-sensitive flows die. Cake/FQ-CoDel on the uplink often fixes ‘my internet is slow’ without buying bandwidth.",
    whyItMatters:
      "When a CDN or a mobile carrier changes default congestion control, they change how the internet feels. That is a protocol story, not a marketing speed-tier story.",
    quiz: [
      q("cc1", "Reno-style control treats packet loss as:", ["A routing change always", "A congestion signal to reduce window", "Proof the peer is down", "A TLS failure"], 1, "That assumption is the design."),
      q("cc2", "Bufferbloat is:", ["Too little RAM in a phone", "Excess queuing that turns a bottleneck into delay instead of honest loss/marks", "A BGP leak", "DNSSEC"], 1, "The buffer becomes the RTT."),
      q("cc3", "BBR’s distinctive idea is to:", ["Ignore delivery rate", "Use delay and observed bandwidth rather than loss alone", "Disable ACK clocks", "Replace IP"], 1, "Model the pipe, don’t wait for a drop."),
    ],
  }),
  L({
    id: "net-bgp-20",
    conceptId: "net-bgp",
    title: "BGP is policy with a reachability rumor",
    durationMin: 20,
    effort: "deep",
    level: "journalist",
    prerequisites: ["net-stack"],
    explanation: [
      "BGP is how autonomous systems tell each other which prefixes they can reach. It is not a shortest-path protocol in the OSPF sense. A route is a prefix plus an AS path plus a pile of attributes. Operators apply policy: prefer this transit, never route that prefix to this peer, pad the path to be less attractive.",
      "The safety properties are weak. A more-specific prefix wins. A leak (announcing a route you should only have used for yourself) can pull traffic into a small network and blackhole it. RPKI can sign ‘this AS is allowed to originate this prefix’ — origin validation — but it does not, by itself, stop every path manipulation.",
      "When a newspaper says ‘the internet broke in country X’, ask: origin hijack, leak, cable cut, or DNS? Those have different actors and different fixes. Only some of them are BGP.",
    ],
    example:
      "In 2008, Pakistan Telecom advertised a more-specific YouTube prefix to stop local access. The route escaped to peers. YouTube died globally for the more-specific. That is longest-match plus transitive trust, not a hacker in a hoodie.",
    whyItMatters:
      "Geopolitics, outages, and ‘why is this CDN slow from here’ are often path-selection stories. If you cannot say prefix, AS path, and more-specific, you will copy the press release.",
    quiz: [
      q("bg1", "A more-specific prefix wins because:", ["BGP prefers longer AS paths", "Forwarding uses longest-prefix match", "RPKI forbids aggregates", "TCP retransmits it"], 1, "Routing table lookup, not politics."),
      q("bg2", "A route leak is typically:", ["A physical cable cut", "Announcing a route beyond the intended policy boundary", "A TLS downgrade", "An MTU blackhole only"], 1, "Policy failure, often accidental."),
      q("bg3", "RPKI origin validation tells you:", ["The entire AS path is honest", "The originating AS is authorized for the prefix", "The cable is intact", "Latency will be low"], 1, "Origin, not path."),
    ],
  }),

  L({
    id: "cmp-front-5",
    conceptId: "cmp-front",
    title: "Lex, parse, then stop guessing",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "cmp-ssa",
    explanation: [
      "A compiler front end turns bytes into a tree. The lexer groups characters into tokens (identifiers, numbers, `if`). The parser checks whether that token stream belongs to the language and builds a syntax tree. Name resolution and type checking then hang meaning on the tree.",
      "These stages exist so later passes do not argue about spelling. Once you have an AST (or a HIR), an optimizer can treat `x + 1` as a node, not as three characters. Error quality lives here: a parser that resynchronizes after a missing semicolon is a product feature, not a CS footnote.",
    ],
    example:
      "`if x = 1` in a language that uses `==` for comparison fails at parse or type-check depending on whether assignment is an expression. The diagnostic is the compiler’s entire user interface for that moment.",
    whyItMatters:
      "‘The compiler is slow’ is often ‘the front end parsed the world because of header graphs or monomorphization’, not ‘LLVM is thinking hard’. Know which end you are blaming.",
    quiz: [
      q("cf1", "The lexer’s output is:", ["Machine code", "A token stream", "A register assignment", "A binary image"], 1, "Words, not meanings."),
      q("cf2", "Type checking usually runs:", ["Before lexing", "After a tree exists, on names that have been resolved", "In the linker", "In the TLB"], 1, "You need a structure to check."),
      q("cf3", "An AST exists so that:", ["The CPU can fetch faster", "Later passes operate on meaning, not characters", "Disk stays warm", "BGP can route types"], 1, "A stable IR for the rest of the pipe."),
    ],
  }),
  L({
    id: "cmp-ssa-10",
    conceptId: "cmp-ssa",
    title: "SSA: every name is written once",
    durationMin: 10,
    effort: "deep",
    level: "core",
    prerequisites: ["cmp-front"],
    goDeeper: "cmp-alloc",
    explanation: [
      "Static single assignment form gives each assignment a fresh name: `x1 = …; x2 = …`. At control-flow joins, a φ-function picks which name arrives: `x3 = φ(x1, x2)`. The point is not the Greek letter. The point is that def-use chains become explicit, so constant propagation, dead code, and GVN are graph walks instead of iterative dataflow soup.",
      "Mem2reg promotes stack slots to SSA values when the compiler can prove they do not escape. That one pass is why `-O1` sometimes looks like a different language. What remains in memory is what had to: address taken, volatile, atomic, interprocedural mystery.",
      "SSA is not assembly. You still have to leave it — destroy φs, assign registers, emit moves on edges. People who paste LLVM IR into a discussion and call it ‘what the CPU does’ are one lowering late.",
    ],
    example:
      "`x = 1; if (c) x = 2; return x;` becomes `x1 = 1; x2 = 2; x3 = φ(x1, x2); return x3`. A later pass that knows `c` is true rewrites the φ to `x2` and deletes `x1`.",
    whyItMatters:
      "Modern optimizer talk (LLVM, GCC, cranelift, MLIR) is SSA talk. If you cannot read a φ, you cannot read a missed-optimization bug.",
    quiz: [
      q("ss1", "A φ-node exists to:", ["Call a function named phi", "Merge different SSA names of one variable at a join", "Allocate a register", "Parse tokens"], 1, "Joins need an explicit choice."),
      q("ss2", "mem2reg is powerful because:", ["It deletes the stack", "It turns eligible memory slots into SSA values the rest of the optimizer can see", "It writes object files", "It predicts branches"], 1, "Values beat loads."),
      q("ss3", "SSA must be destroyed before emit because:", ["CPUs do not have φ instructions or infinite names", "Linkers forbid it", "φ is patented", "ELF cannot store graphs"], 0, "Lower to moves and real registers."),
    ],
  }),
  L({
    id: "cmp-alloc-20",
    conceptId: "cmp-alloc",
    title: "Register allocation is a packing problem with a gun",
    durationMin: 20,
    effort: "deep",
    level: "journalist",
    prerequisites: ["cmp-ssa"],
    explanation: [
      "You have more live values than architectural registers. Allocation assigns values to registers or spills them to the stack. The classic model is interference: two values that are live at the same time cannot share a register. That is graph coloring, approximately, except the graph changes when you spill (you insert loads and stores, which create new short live ranges).",
      "Linear-scan allocators trade optimality for compile time and are why JIT compile times stay tolerable. On a static compiler, a graph-coloring or PBQP allocator plus careful live-range splitting is often worth it. Calling convention constraints (arguments in fixed regs, callee-saved vs caller-saved) are precoloring: some nodes already have a crayon.",
      "A ‘bad codegen’ report that shows a storm of stack traffic on a hot loop is frequently register pressure, not a missing peephole. Inlining, vectorization, and scalar evolution can raise pressure until the allocator gives up. That is a global budget, not a local insult.",
    ],
    example:
      "Unrolling a 4-wide float loop 8 times can create 32 live accumulators. x86-64 has 16 XMM/YMM names in the ABI-visible set (more with AVX-512). The allocator spills. The unroll that ‘should be faster’ is now bound on stack bandwidth.",
    whyItMatters:
      "This is how to read compiler release notes about ‘better allocation on AArch64’ and why a microbenchmark lied after you added one more temporary.",
    quiz: [
      q("ra1", "Two SSA values interfere when:", ["They have the same type", "Their live ranges overlap", "They are constants", "They are in different functions"], 1, "They would clobber each other in one register."),
      q("ra2", "A spill is:", ["Deleting the value", "Holding the value in memory for a while because no register is free", "Inlining", "A linker error"], 1, "Reload later."),
      q("ra3", "Precoloring models:", ["Comments in the AST", "ABI constraints that pin some values to specific registers", "Cache colors", "MESI states"], 1, "Arguments, return regs, callee-saved."),
    ],
  }),
];
