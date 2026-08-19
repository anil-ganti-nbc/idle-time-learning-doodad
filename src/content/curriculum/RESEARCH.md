# Curriculum research ledger

Authoritative machine-readable notes live in [`sources.ts`](./sources.ts).
Each entry records a source URL, institution, the courses/modules it informed,
and the *structural* lesson taken from it. Course prose and assignments were
not copied.

## How sources were used

Dead Air University is micro-learning in irregular gaps, not a semester.
Where a university course spends weeks on one mechanism, we keep one teachable
concept. Where two reputable curricula agree on order, we follow that order.
Where they disagree, prerequisite logic wins.

### Agreements we kept

- Architecture: ISA and caches before ILP; GPUs after a sequential core and a
  data-parallel idea exist (MIT 6.823, Stanford CS149, NVIDIA CUDA guide).
- Semiconductors: unit processes before lithography-as-identity; High-NA after
  EUV is thinkable (MIT 6.152J / 6.774, ASML).
- OS: hardware/software contract, then VM/concurrency, then persistence
  (MIT 6.1810 / xv6). Foundations stop at kernel, syscalls, processes,
  isolation, and the first look at interrupts and IPC.
- Networking: packets and a reliable byte stream before BGP (Stanford CS144).
- Compilers: lex/parse/types before IR/opt, backend last (Stanford CS143,
  CMU 15-411).
- ML: supervised linear models before nets; nets and sequences before
  attention; LLMs as a destination (Stanford CS229, CS224N).
- Horology: whole movement, then train, then winding/setting, then escapement,
  then chronometry/chronograph (HSNY 101–104, WOSTEP).
- Music: elements and rhythm/pitch before function; voice leading before
  analysis; chromaticism as the bridge to heavy music (MIT 21M.051/301/302/350).
- Death metal: listening literacy and construction as separate courses;
  technique assumes music-theory foundations (MIT Heavy Metal 101, Berklee).

### Where we diverge from semester courses

- No lab weeks, problem sets, or lecture numbers.
- One concept is a 5–30 minute unit, not a lecture.
- Music theory is aimed at later death-metal construction, not a chorale exam.
- CS224N in recent years compresses RNNs; we still teach sequence models
  before attention so attention has a problem to solve.
- Module order is a hint. The prerequisite graph is authoritative.

### Cross-course edges that are intellectually real

- GPU architecture depends on CPU pipeline + data-parallel work.
- OS TLB shootdown depends on the CPU TLB concept.
- Compiler scheduling/vectorization depend on pipelines and SIMD.
- Death-metal harmony depends on intervals and modes, not on blast beats.
- Lithography depends on a wafer and on planarity.
- EUV depends on DUV (and therefore Rayleigh): it is a later light source,
  and "why refractive optics die" is only a sentence after lenses exist.
- High-NA is a new scanner family after ordinary NA exists, not a bigger number
  on the same tool (ASML EXE platform notes).
- Nanosheet GAA and backside power are device/routing successors, not lithography
  slogans (imec).
- Transformers depend on backprop and sequence models.
