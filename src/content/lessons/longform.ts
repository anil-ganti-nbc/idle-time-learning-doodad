import type { Lesson } from "@/lib/learning/types";
import { L, q } from "../lesson";

export const LONGFORM_LESSONS: Lesson[] = [
  L({
    id: "cpu-window-30",
    conceptId: "cpu-rob",
    title: "The instruction window as an economy",
    durationMin: 30,
    effort: "deep",
    level: "journalist",
    prerequisites: ["cpu-renaming"],
    explanation: [
      "A modern core is not ‘faster clocks’ and not even ‘wider issue’ in isolation. It is a window: how many not-yet-retired instructions can sit in flight while the machine waits on a miss, a mispredict, or a long divider. The window is the product of several finite tables that must all have a free slot: ROB, physical registers, scheduler entries, load/store queue, fetch buffer. The first one that fills is the real width that day.",
      "This is why two chips with the same advertised 6-wide decode can feel different on a browser versus a GEMM. The browser is front-end and predictor bound; the GEMM is backend and cache bound. A larger ROB without a larger physical file just moves the stall. Vendor slides that quote one number are choosing which bottleneck to brag about.",
      "Spectre-era mitigations, SMT, and security domains tax the same tables. An RSB stuff is a burst of fake calls that occupy predictor state. An IBPB is a flush of useful history. SMT doubles the customers of one ROB and one file. When a review says ‘security tax’, try to name the table that got smaller in practice.",
      "For reporting: ask which structure grew, on which workload class, and whether the compiler or the runtime was assumed. A 512-entry ROB is a miss-tolerance story. A 20% larger BTB is a frontend-in-the-interpreter story. They are not interchangeable adjectives.",
    ],
    example:
      "A load misses 80 ns. At 4 GHz that is 320 cycles. A 4-wide machine that can keep 320 independent ops in flight can hide the miss; one that fills a 192-entry ROB at cycle 50 sits idle for the rest. The SPECint delta from ‘bigger window’ is this arithmetic on the misses that actually happen.",
    whyItMatters:
      "This is the single model that lets you read a microarchitecture launch without being towed by the slide. Name the scarce table.",
    quiz: [
      q("w1", "The effective window is limited by:", ["Clock only", "The first structure to fill among ROB, PRF, scheduler, LSQs…", "ISA register count alone", "The number of sold chips"], 1, "Min of the capacities, not the brochure max."),
      q("w2", "A bigger ROB without a bigger PRF often:", ["Always doubles IPC", "Moves the stall from allocate-at-ROB to rename", "Removes caches", "Fixes mispredicts"], 1, "You still need destinations."),
      q("w3", "SMT typically:", ["Duplicates every table perfectly", "Shares many of those tables, so one thread can starve the window of the other", "Turns off the predictor", "Makes ROB infinite"], 1, "More customers, same tank."),
    ],
  }),
  L({
    id: "semi-stack-30",
    conceptId: "semi-stochastics",
    title: "How an EUV layer actually fails",
    durationMin: 30,
    effort: "deep",
    level: "journalist",
    prerequisites: ["semi-euv"],
    explanation: [
      "A failing EUV layer is rarely ‘the tool is down’. It is a budget that went negative: photons, focus, overlay, resist thickness, etch bias. Stochastics open a contact. Overlay puts a via off the metal. High-NA’s thin process window puts a die’s edge out of focus. The same wafer can show all three, and the weekly yield meeting will argue about which histogram to believe.",
      "Metrology is part of the process, not an afterthought. Overlay residuals from the previous lot retune the scanner. After-develop inspection catches some stochastic killers; after-etch inspection catches the ones the etch amplified. A ‘random defect’ that clusters on a particular layout pattern is not random — it is a hotspot the OPC model missed.",
      "This is also a supply-chain story. Pellicle transmittance eats dose. Mask 3D effects at EUV angles distort the image so the mask shop and the OPC team are one team whether the org chart agrees. Tin debris on the collector is a scheduled degradation, not an accident. When a foundry slips a node, read the sentence after ‘EUV’ — it is usually one of these nouns.",
      "Journalist depth here means: do not explain what a transistor is. Explain which budget blew and who owns the knob. That is the actual news.",
    ],
    example:
      "A via chain fails at 0.1% on a die. Split lot: higher EUV dose cuts opens (stochastics) but drops WPH. A different split with a fatter via landing (design rule) cuts opens without dose. The cheaper fix was the landing pad, not the tool.",
    whyItMatters:
      "Node-delay journalism that stops at ‘EUV is hard’ is interchangeable with last year’s piece. The piece worth writing names the budget.",
    quiz: [
      q("sk1", "A layout-clustered ‘random’ defect is often:", ["Cosmic rays", "A hotspot — OPC or process-window failure at a local pattern", "A software license", "Tin futures"], 1, "Geometry amplified the noise."),
      q("sk2", "Pellicles affect stochastics because:", ["They add photons", "They eat transmission, so dose at the wafer drops unless you slow down", "They flatten wafers", "They set NA"], 1, "Fewer photons, fatter Poisson."),
      q("sk3", "The cheaper yield fix is sometimes:", ["Always a new scanner", "A design-rule or landing-pad change rather than more dose", "Turning off overlay", "Skipping etch"], 1, "Who owns the knob."),
    ],
  }),
];
