import type { Lesson } from "@/lib/learning/types";
import { L, q } from "../lesson";

export const SYSTEMS_LESSONS: Lesson[] = [
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
