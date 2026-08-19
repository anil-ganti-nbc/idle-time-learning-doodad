import type { Lesson } from "@/lib/learning/types";
import { L, q } from "../lesson";

export const LONGFORM_LESSONS: Lesson[] = [
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
