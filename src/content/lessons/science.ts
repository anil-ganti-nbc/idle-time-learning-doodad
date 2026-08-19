import type { Lesson } from "@/lib/learning/types";
import { L, q } from "../lesson";

export const SCIENCE_LESSONS: Lesson[] = [
  L({
    id: "ml-gd-5",
    conceptId: "ml-gd",
    title: "Gradient descent is walking downhill in the dark",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "ml-backprop",
    diagram: "gd",
    explanation: [
      "A model is a function with knobs (parameters). A loss is a number that says how wrong the function is on some data. The gradient of the loss with respect to the knobs is the direction of steepest increase. Descend by stepping the other way.",
      "You almost never use the true gradient on the whole dataset. Minibatches give a noisy estimate that is cheaper and, usefully, noisier — the noise helps escape sharp bad holes. The step size (learning rate) is the whole game: too big and you diverge; too small and you waste the afternoon.",
    ],
    example:
      "Fit `y ≈ wx` on pairs (x, y). Loss = average (wx − y)². The gradient ∂L/∂w is an average of 2x(wx − y). One step: w ← w − η times that. After enough passes, w is the least-squares slope — if η behaved.",
    whyItMatters:
      "Every training graph you see in a paper is this loop. When someone says a model ‘learned’, they mean this number went down in a way that also went down on data the optimizer had not used to step.",
    quiz: [
      q("gd1", "The gradient points:", ["Toward lower loss", "Toward steeper increase of the loss", "At the nearest integer", "At the test set"], 1, "You step opposite it."),
      q("gd2", "Minibatches are used because:", ["Full-batch is always more generalizable", "They are cheaper and the noise can help", "Gradients do not exist otherwise", "GPUs cannot add"], 1, "Cost and implicit regularization."),
      q("gd3", "A learning rate that is too large typically:", ["Guarantees the global minimum", "Makes the loss explode or oscillate", "Removes the need for data", "Computes the Hessian"], 1, "You overshoot the bowl."),
    ],
  }),
  L({
    id: "ml-bp-10",
    conceptId: "ml-backprop",
    title: "Backprop is reverse-mode autodiff",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["ml-gd"],
    goDeeper: "ml-attention",
    explanation: [
      "A neural net is a composition of simple ops. The chain rule says the derivative of the composition is a product of local Jacobians. Forward-mode autodiff pushes a derivative along with each value — cheap when you have one input and many outputs. Reverse-mode (backprop) seeds the loss with dL/dL = 1 and pushes adjoints backward — cheap when you have many inputs (parameters) and one output (the loss).",
      "That is why we backprop. Not because of a special neural-net theorem. Because parameter count ≫ 1. Frameworks build a graph (or a tape) of the forward ops and then walk it in reverse, applying each op’s vector-Jacobian product.",
      "The practical failures are not mystical: vanishing/exploding products through deep multiplies, disconnected graphs when someone called `.detach()` or used a non-differentiable index, and kernels whose VJP was never written.",
    ],
    example:
      "`y = ReLU(Wx)`. Forward: multiply, then zero the negatives. Backward: dL/dW = (dL/dy, masked by the ReLU gate) · xᵀ. The mask is the local Jacobian of ReLU. No finite differences required.",
    whyItMatters:
      "If you cannot see backprop as bookkeeping for the chain rule, you will treat training bugs as folklore. Most of them are a broken tape.",
    quiz: [
      q("bp1", "Reverse-mode autodiff is preferred in deep learning because:", ["There is one loss and millions of parameters", "There is one parameter and millions of losses", "GPUs cannot multiply", "The chain rule fails forward"], 0, "One output, many inputs."),
      q("bp2", "A vector-Jacobian product is:", ["A full Jacobian matrix always materialized", "The local backward of an op, applied to incoming adjoints", "A learning rate", "A type of attention"], 1, "You never need the whole Jacobian."),
      q("bp3", "`.detach()` / `stop_gradient` breaks training because:", ["It deletes the weights", "It cuts the tape, so adjoints do not flow", "It changes the optimizer", "It turns off the GPU"], 1, "No path, no gradient."),
    ],
  }),
  L({
    id: "ml-attn-20",
    conceptId: "ml-attention",
    title: "Attention is a soft lookup",
    durationMin: 20,
    effort: "deep",
    level: "journalist",
    prerequisites: ["ml-backprop"],
    diagram: "attention",
    explanation: [
      "For each query vector q, attention scores every key kᵢ with a dot product (usually scaled by 1/√d), softmaxes those scores, and uses them to mix the values vᵢ. It is a content-addressable read: ‘find things like this, average them.’ Multi-head just does that in several learned projections so different heads can specialize.",
      "Self-attention sets Q, K, V as projections of the same token sequence. That gives you pairwise mixing at every layer, which is why a transformer can move information across a sentence in one layer — and why compute is O(n²) in sequence length for the naive algorithm. The last three years of ‘efficient attention’ papers are almost all about not paying n², or paying it in SRAM with tiling (FlashAttention).",
      "Causal masks zero out future keys so a language model cannot read the answer while writing the question. That mask, not the softmax, is the autoregressive contract. KV cache exists because for generation the keys and values of past tokens do not change; you should not recompute them.",
    ],
    example:
      "In ‘The trophy does not fit in the suitcase because it is too big’, a head on ‘it’ can put mass on ‘trophy’ rather than ‘suitcase’. Nothing in the mechanism knows linguistics; training found a key/query geometry that makes that mix useful for next-token loss.",
    whyItMatters:
      "Context-window marketing, MoE routing, and inference-price wars all reduce to: how many tokens do you score, where do you store KV, and how tiled is the matmul. ‘The model understands’ is not a mechanism.",
    quiz: [
      q("at1", "Softmax(QKᵀ/√d) V is:", ["A convolution", "A weighted average of values, weights from query-key similarity", "A hash table with hard addressing", "Gradient descent"], 1, "Soft lookup."),
      q("at2", "Naive self-attention is O(n²) because:", ["Softmax is quadratic in d", "Every query scores every key", "The vocabulary is n²", "Layers are squared"], 1, "All pairs."),
      q("at3", "A KV cache is valid at generate time because:", ["Queries never change", "Past keys/values do not depend on future tokens under a causal mask", "Attention is not differentiable", "Batch size is 1 always"], 1, "You append, you do not recompute history."),
    ],
  }),

  L({
    id: "ast-hr-5",
    conceptId: "ast-hr",
    title: "The HR diagram is a census, not a map of space",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "ast-exo",
    explanation: [
      "Plot stellar luminosity against surface temperature (or color, or spectral type) and stars do not sprinkle at random. They sit on a main sequence, a red-giant branch, a white-dwarf cooling track. The diagram is a snapshot of many lives at once, like a city census that happens to reveal age.",
      "The main sequence is hydrogen fusion in the core. Mass sets the spot: massive stars are hot and bright and brief; M dwarfs are dim and almost immortal. Giants are what you get when the core is no longer that hydrogen engine and the envelope puffs. White dwarfs are leftover cores, cooling.",
    ],
    example:
      "A cluster’s HR diagram has a main-sequence turnoff. Stars above that mass have already left. The turnoff mass is a clock for the cluster’s age — one of the cleaner clocks we have.",
    whyItMatters:
      "When a headline says astronomers ‘weighed’ or ‘aged’ a star, they usually put it on this diagram (plus spectroscopy) and compared it to models. The diagram is the argument.",
    quiz: [
      q("hr1", "The main sequence is where stars are:", ["Dying", "Fusing hydrogen in the core", "Only made of iron", "Planets"], 1, "That is the long middle of a star’s life."),
      q("hr2", "A cluster turnoff ages the cluster because:", ["All stars form at different times always", "Higher-mass stars leave the main sequence first", "White dwarfs cannot be dated", "Color is random"], 1, "Mass–lifetime relation."),
      q("hr3", "The HR diagram’s axes are:", ["Distance vs RA", "Luminosity vs temperature (or a proxy)", "Mass vs orbital period", "Redshift vs time"], 1, "A census of state, not position."),
    ],
  }),
  L({
    id: "ast-exo-10",
    conceptId: "ast-exo",
    title: "How we know a planet is there",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["ast-hr"],
    explanation: [
      "Transit: the planet crosses the star and the star gets slightly fainter. You learn radius (from depth) and period (from repetition), not mass. Radial velocity: the star wobbles; the spectrum’s lines shift. You learn a mass function (m sin i) and period, not radius. Together they give density. Alone they lie by omission.",
      "Each method has a selection function. Transits love close-in planets on edge-on orbits. RV loves massive, close planets around quiet stars. Direct imaging loves wide, young, self-luminous giants. Microlensing loves a one-time alignment toward the bulge. A catalog is not a population until you invert those biases.",
      "False positives are the job. Eclipsing binaries, starspots, and blended background stars fake transits. Activity fakes RV. The honest papers are about vetting, not discovery selfies.",
    ],
    example:
      "A 1% dip every 3.5 days on a Sun-like star is a roughly Jupiter-radius object close in — a ‘hot Jupiter’ — or a smaller star blended in the pixel. Without a mass, or a high-resolution spectrum, you do not yet have a planet.",
    whyItMatters:
      "‘Earth-like’ in a press release often means ‘rocky-sized on a period we can detect’, not ‘habitable’. The method’s selection function wrote that sentence.",
    quiz: [
      q("ex1", "A transit depth primarily constrains:", ["Mass", "Radius ratio of planet to star", "Atmosphere always", "Age"], 1, "Blocked light ≈ area ratio."),
      q("ex2", "RV alone gives:", ["True mass always", "m sin i, missing the inclination", "Radius", "Albedo"], 1, "You see the line-of-sight wobble."),
      q("ex3", "Why catalogs are not populations:", ["Planets do not exist", "Each method sees a biased slice of period/mass/inclination", "Stars have no planets", "Kepler failed"], 1, "Invert the selection function or stay quiet."),
    ],
  }),

  L({
    id: "bio-sel-5",
    conceptId: "bio-selection",
    title: "Selection is accounting, not a ladder",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "bio-evodevo",
    explanation: [
      "Natural selection requires variation, heritability, and differential reproductive success. That is the whole machine. It does not require progress, consciousness, or a goal. A trait spreads if its bearers leave more copies, in that environment, period.",
      "Fitness is not ‘stronger’. A smaller body that breeds earlier can beat a larger one. Drift can fix a worse allele in a small population. Adaptation is an outcome you have to argue for, not a default explanation for every trait.",
    ],
    example:
      "Sickle-cell allele persists in malaria regions because heterozygotes out-reproduce both homozygotes there. In a malaria-free environment the accounting flips. Same allele, different ledger.",
    whyItMatters:
      "Almost every popular evolution sentence that uses ‘so that’ is smuggling purpose. The mechanism does not have purposes. It has rates.",
    quiz: [
      q("bs1", "Selection requires:", ["A plan", "Variation, heritability, differential success", "Only mutation", "Only time"], 1, "Three ingredients."),
      q("bs2", "Fitness in this sense is:", ["Gym strength", "Relative reproductive success", "IQ", "Lifespan alone"], 1, "Copies in the next generation."),
      q("bs3", "Drift matters most when:", ["Populations are huge and selection is strong", "Populations are small, so chance fixes alleles", "There is no DNA", "Selection is infinite"], 1, "Sampling error on allele frequencies."),
    ],
  }),
  L({
    id: "bio-evo-10",
    conceptId: "bio-evodevo",
    title: "Evo-devo: reuse the toolkit",
    durationMin: 10,
    effort: "deep",
    level: "core",
    prerequisites: ["bio-selection"],
    explanation: [
      "Animals that look nothing alike share a developmental toolkit — Hox genes, signaling pathways (Wnt, Hedgehog, BMP) — reused in new places and times. Large morphological change does not always need new proteins. It often needs a cis-regulatory tweak: express the same gene two hours later, or in a different stripe.",
      "That is why ‘irreducible’ anatomy is the wrong bet. Eyes, limbs, and segments are deep homologies plus a lot of local tinkering. The fossil record’s apparent jumps are sometimes the visible part of a regulatory change that was genetically small.",
      "The caution: homology of genes is not homology of organs. Pax6 is involved in eyes across phyla; that does not mean a fly eye and a vertebrate eye are the same organ. It means development is conservative in its parts list and creative in its recipes.",
    ],
    example:
      "A snake’s lack of limbs is not a missing limb genome. Limb-bud signaling is altered — Shh expression in the zone of polarizing activity fails to sustain a bud. The toolkit is there; the switch is not thrown.",
    whyItMatters:
      "This is the reply to both ‘evolution cannot make new body plans’ and naive just-so stories. The substrate is regulatory. The accounting is still selection.",
    quiz: [
      q("ed1", "A cis-regulatory change typically:", ["Invent a new amino-acid alphabet", "Alters when/where an existing gene is expressed", "Deletes selection", "Creates DNA from RNA only"], 1, "Same protein, different map."),
      q("ed2", "Hox genes are famous because:", ["They encode muscles", "They pattern the anterior–posterior axis and are deeply conserved", "They are only in plants", "They replace mutation"], 1, "Toolkit, not trivia."),
      q("ed3", "Shared toolkit genes imply:", ["Identical organs", "A conserved parts list that can be redeployed", "No convergent evolution", "That fossils are wrong"], 1, "Recipes diverge; ingredients rhyme."),
    ],
  }),

  L({
    id: "stat-bias-5",
    conceptId: "stat-bias",
    title: "The sample is the result",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "stat-pvalue",
    explanation: [
      "Statistics does not rescue a sample that is the wrong population. If you survey people who answer the phone at 2 pm, you have learned about people who answer the phone at 2 pm. Estimators have bias (they miss on average) and variance (they jump around). A huge biased sample is a confident wrong answer.",
      "Selection into the data is often the phenomenon. Hospital studies see sick people. Crash studies see crashed cars. GitHub studies see public repos. Ask ‘who is missing?’ before you ask ‘what is the p-value?’",
    ],
    example:
      "WWII survivorship bias: armor the planes where the returning ones were hit, and you armor the places that were not fatal. The missing data — the planes that did not return — were the signal.",
    whyItMatters:
      "Most viral charts are sampling stories in costume. The honest first sentence is who is in the denominator.",
    quiz: [
      q("sb1", "A large biased sample typically:", ["Cancels the bias", "Gives a precise estimate of the wrong thing", "Becomes a census", "Has no variance"], 1, "n kills variance, not bias."),
      q("sb2", "Survivorship bias means:", ["You only see the units that made it into the sample, and that filter is the effect", "Everyone survives", "Variance is zero", "The mean is the median"], 0, "The missing are the data."),
      q("sb3", "Before a p-value you should ask:", ["Who is in the sample, and who cannot be", "Whether the chart is 3D", "The brand of software", "If n > 30 as a ritual"], 0, "Design beats ritual."),
    ],
  }),
  L({
    id: "stat-p-10",
    conceptId: "stat-pvalue",
    title: "A p-value is not the chance you are right",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["stat-bias"],
    goDeeper: "stat-bayes",
    explanation: [
      "A p-value is P(data this extreme or more | the null model is true). It is not P(null is true | data). It is not the false-discovery rate. It is not effect size. A tiny p with a tiny effect in a huge sample is a precise irrelevance.",
      "The null is a model, including all the sampling assumptions. If those are false, the number is theater. Multiple comparisons manufacture small p’s; preregistration and holding out a confirmation set are boring because they work.",
      "Confidence intervals (or better: compatibility intervals) at least show a range of effects still on speaking terms with the data. Reporting only p < 0.05 is discarding the interesting bit: how large, and how sensitive.",
    ],
    example:
      "A drug trial, n = 80,000, finds a 0.1 mmHg blood-pressure drop, p = 0.01. The null of exactly zero is probably false. Nobody should change practice. The interval tells you the effect is real and useless.",
    whyItMatters:
      "This is the entire replication crisis in one confusion. If you write about a paper, and you only carry the p, you did not carry the claim.",
    quiz: [
      q("pv1", "p = 0.03 means:", ["The hypothesis is 97% true", "Under the null model, data this extreme would happen about 3% of the time", "There is a 3% chance of a mistake", "The effect is large"], 1, "Tail probability under a model."),
      q("pv2", "A tiny p with a tiny effect usually means:", ["Importance", "A large sample rejected a sharp null of no difference", "Fraud always", "The interval is infinite"], 1, "Distinguish detection from mattering."),
      q("pv3", "p-hacking is dangerous because:", ["It makes n smaller", "The nominal tail probability assumes a single pre-specified test", "It raises bias in the Gauss-Markov sense always", "It deletes outliers ethically"], 1, "The denominator of ‘this extreme’ changed."),
    ],
  }),
  L({
    id: "stat-bayes-20",
    conceptId: "stat-bayes",
    title: "Base rates do not care about your likelihood",
    durationMin: 20,
    effort: "deep",
    level: "journalist",
    prerequisites: ["stat-pvalue"],
    explanation: [
      "Bayes: posterior odds = prior odds × likelihood ratio. A very surprising result under the null (small p, large LR) does not make a rare claim probable unless the prior was not tiny. Medical testing is the clean version: a 99% specific test for a 0.1% disease still yields mostly false positives.",
      "In scientific literature the prior is the base rate of true hypotheses in the pile you chose to test. A field that tests 100 long shots a year will fill journals with ‘significant’ noise even with honest p < 0.05. That is Ioannidis as arithmetic, not cynicism.",
      "A useful Bayesian writeup is often just: here is a skeptical prior, here is the likelihood, here is how much you would have to already believe. You do not need a full MCMC to refuse a miracle.",
    ],
    example:
      "A mammogram 90% sensitive, 91% specific, disease base rate 1%. A positive result is still only about a 9% chance of cancer. The arithmetic is a 2×2 table. The intuition is not.",
    whyItMatters:
      "This is how to read a diagnostic, a polygraph, a ‘AI detector’, and a surprising social-science finding. Ask for the base rate or refuse the posterior.",
    quiz: [
      q("by1", "Posterior odds equal:", ["The p-value", "Prior odds times the likelihood ratio", "1 minus specificity", "The sample size"], 1, "That is the theorem."),
      q("by2", "A highly specific test for a very rare disease still yields many false positives because:", ["Sensitivity is 0", "The negative class is huge, so even a small false-positive rate outnumbers the true cases", "Bayes fails", "Hospitals round wrong"], 1, "Base rate dominates."),
      q("by3", "In a field of long-shot hypotheses, p < 0.05 results are often wrong because:", ["Frequentism is false", "The prior odds on any given hypothesis are poor, so most ‘hits’ are noise", "Journals dislike Bayes", "n is always 10"], 1, "Selection plus weak priors."),
    ],
  }),
];
