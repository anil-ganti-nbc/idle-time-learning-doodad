import type { Lesson } from "@/lib/learning/types";
import { L, q } from "../lesson";

export const CULTURE_LESSONS: Lesson[] = [
  L({
    id: "econ-ca-5",
    conceptId: "econ-ca",
    title: "Comparative advantage is opportunity cost",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "econ-money",
    explanation: [
      "You have a comparative advantage in the task where your opportunity cost is lower, not where you are absolutely faster. A surgeon who types 120 wpm should still hire a typist if an hour of surgery is worth more than an hour of typing. The typist can be worse at both and the trade still raises joint output.",
      "Ricardo’s wine-and-cloth story is this arithmetic with countries as the agents. It is not a claim that trade is kind, that adjustment is free, or that distribution inside a country is fair. Those are separate arguments people smuggle into the same sentence.",
    ],
    example:
      "England produces cloth at a lower opportunity cost in wine than Portugal does, even if Portugal is better at both. Specialize, trade, both consume more. The laid-off English vintner is a distributional fact the theorem does not erase.",
    whyItMatters:
      "Trade pieces that argue from ‘we can make it here’ are arguing absolute advantage. That is the wrong inequality. The right one is what you give up.",
    quiz: [
      q("ca1", "Comparative advantage is about:", ["Who is best in absolute terms", "Who has the lower opportunity cost", "Who has more capital always", "Who has a navy"], 1, "Relative cost, not trophies."),
      q("ca2", "A person worse at every task:", ["Cannot gain from trade", "Can still have a comparative advantage in something", "Has infinite opportunity cost", "Must be the surgeon"], 1, "The inequality can flip."),
      q("ca3", "Ricardo’s theorem is silent on:", ["Gains in joint output from specialization", "How those gains are shared, and the cost of adjustment", "Opportunity cost", "Two-good examples"], 1, "Efficiency ≠ equity."),
    ],
  }),
  L({
    id: "econ-money-10",
    conceptId: "econ-money",
    title: "Monetary policy is a transmission, not a lever",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["econ-ca"],
    goDeeper: "hist-nixon",
    explanation: [
      "A central bank’s policy rate is the price of reserves (or the target it defends). It is not the mortgage rate, the corporate bond yield, or ‘the amount of money’. Those move if and when the rest of the system transmits: banks, Treasuries, risk premia, the exchange rate, and expectations of the future path of the rate — not just today’s print.",
      "The textbook IS-LM lever is a cartoon of this. In a floor system the bank sets administered rates and the quantity of reserves can be large without forcing the rate to zero. QE is then about duration and spreads, not about ‘printing for inflation’ as a one-line mechanism. Inflation is a path of demand, supply, and expectations; the rate path is one input.",
      "When a reporter writes ‘the Fed raised rates to fight inflation’, the unfinished sentence is ‘and it expects this to slow interest-sensitive spending and cool the labor market with a lag of months’. Without the lag and the channel, the sentence is a totem.",
    ],
    example:
      "2022–23: policy rates jumped; housing and venture felt it fast; many service prices lagged. The same lever, different elasticities. A single CPI print is not the transmission.",
    whyItMatters:
      "This is how to read a central-bank decision without copying the adjective in the headline (‘hawkish surprise’). Name the channel or you are narrating vibes.",
    quiz: [
      q("mp1", "The policy rate is closest to:", ["The CPI", "The rate the central bank sets or defends in the market for reserves", "The average mortgage", "M2"], 1, "A specific price, not ‘money’."),
      q("mp2", "Transmission means:", ["The rate change instantly sets all prices", "How that rate filters into other yields, credit, FX, and spending — with lags", "Printing banknotes", "Fiscal policy"], 1, "A chain, not a wand."),
      q("mp3", "In a floor system, abundant reserves:", ["Must force the policy rate to zero", "Need not; administered rates can hold the floor", "Abolish inflation", "Replace the Treasury"], 1, "Quantity and rate are less glued than the cartoon."),
    ],
  }),




  L({
    id: "aud-freq-5",
    conceptId: "aud-freq",
    title: "Frequency response is a filter’s autobiography",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "aud-comp",
    diagram: "freq",
    explanation: [
      "A system’s frequency response says, for a sine at frequency f, how much the amplitude (and phase) changes. Speakers, rooms, mics, cables, and EQ are all filters. A ‘flat’ response means unity gain across the band you care about, not a moral virtue — a translation you can then choose to color.",
      "Decibels are ratios. +6 dB is about a doubling of voltage/amplitude; +10 dB is roughly twice as loud to a human, sometimes. Phase is not optional: two drivers that are 180° apart at a crossover will notch. A magnitude plot without phase is half a story.",
    ],
    example:
      "A cheap Bluetooth speaker with a 6 dB hump at 80 Hz and a hole at 3 kHz sounds ‘bassy’ and ‘dull’. EQ can fake the hole; it cannot invent excursion the driver does not have. The response told you the truth first.",
    whyItMatters:
      "Every review that uses ‘warm’ or ‘harsh’ is attempting to name a frequency response plus distortion. Ask for the curve.",
    quiz: [
      q("af1", "Frequency response plots:", ["Only THD", "Gain (and ideally phase) versus frequency", "The lyrics", "Bit depth"], 1, "What the filter does to sines."),
      q("af2", "+6 dB in voltage terms is about:", ["Half", "A doubling of amplitude", "Silence", "10× power exactly always"], 1, "20 log10(2) ≈ 6 dB."),
      q("af3", "A 180° phase flip at a crossover often:", ["Doubles bass usefully", "Cancels that band — a notch", "Removes the need for a cabinet", "Is inaudible by theorem"], 1, "Out of polarity."),
    ],
  }),
  L({
    id: "aud-comp-10",
    conceptId: "aud-comp",
    title: "Compression is gain that depends on yesterday",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["aud-freq"],
    explanation: [
      "A compressor reduces gain when the input exceeds a threshold, by a ratio. 4:1 means that above the threshold, 4 dB in becomes 1 dB out (in the gain-reduction story). Attack is how fast reduction arrives; release is how fast it leaves. Those times are the sound: they decide whether you hear a transient or a pump.",
      "This is not ‘making it louder’. Makeup gain does that after. Compression changes the envelope. Sidechains let a kick duck a bass. Limiters are extreme ratios with fast attack, used as a ceiling. Loudness wars were limiters plus a cultural preference for dense RMS.",
      "The mistake is treating the meter as the mix. Gain reduction of 1–3 dB on a vocal with a musically chosen release is a stabilizer. 12 dB on a whole mix with a 10 ms release is a new instrument, usually an ugly one.",
    ],
    example:
      "A vocal with 12 dB crests above the verse. Threshold just under those crests, 3:1, 10 ms attack (keep consonants), 80 ms release (breathe with the phrase). The verse and chorus sit in the same fader throw.",
    whyItMatters:
      "If you write about loudness, streaming normalization, or ‘that record punches’, you are writing about envelopes and meters (LUFS), not about a magic plugin.",
    quiz: [
      q("ac1", "Ratio 4:1 above threshold means:", ["The signal is gated off", "Excess is compressed so 4 dB in above threshold becomes ~1 dB out", "Pitch drops by 4", "Stereo becomes mono"], 1, "Slope of the transfer."),
      q("ac2", "Attack time controls:", ["EQ slope", "How quickly gain reduction arrives after a peak", "Sample rate", "Polarity"], 1, "Transients live here."),
      q("ac3", "A limiter is:", ["An expander", "A compressor with a very high ratio used as a ceiling", "A reverb", "A microphone"], 1, "Brickwall-ish."),
    ],
  }),







  L({
    id: "hist-method-5",
    conceptId: "hist-method",
    title: "A source is not a fact",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "hist-nixon",
    explanation: [
      "Historians argue from remnants: documents, objects, numbers, later testimonies. A source has a maker, a purpose, and a silence. The job is not to collect quotes. It is to say what the remnant can support and what it cannot. Chronicle (‘this happened then’) is not yet causation (‘this happened because’).",
      "Primary versus secondary is a relationship to the question, not a halo. A 1971 newspaper is primary for public rhetoric in 1971 and secondary for what the Fed staff believed in the room. Footnotes are the experiment log.",
    ],
    example:
      "A presidential speech announcing a policy is excellent evidence of the claim the government wanted heard. It is poor evidence of the policy’s effects. Those need different remnants: prices, cables, later archives.",
    whyItMatters:
      "Most viral history is a quote treated as a verdict. If you cannot name what the source is for, you are reading, not arguing.",
    quiz: [
      q("hm1", "A primary source is defined by:", ["Being old", "Its relationship to the question you are asking", "Being official", "Being a book"], 1, "Function, not age."),
      q("hm2", "Chronicle differs from causal history in that:", ["Chronicle orders events; causation claims a mechanism", "Chronicle is always false", "Causation needs no sources", "Only kings have causes"], 0, "Because is a higher claim."),
      q("hm3", "A public speech is usually strongest as evidence of:", ["Private belief of every official", "The message offered to an audience at that moment", "Long-run economic effects", "Secret cables"], 1, "It is a performance with an aim."),
    ],
  }),
  L({
    id: "hist-nixon-10",
    conceptId: "hist-nixon",
    title: "The Nixon shock was a regime change",
    durationMin: 10,
    effort: "deep",
    level: "journalist",
    prerequisites: ["hist-method"],
    explanation: [
      "On 15 August 1971 Nixon closed the gold window: the US would no longer convert foreign official dollars into gold at $35/oz. That ended the Bretton Woods promise that the dollar was a gold-anchored key currency and that other parities hung off it. The same package included a 90-day wage-price freeze and a 10% import surcharge — so it was also a political act about inflation and elections, not a seminar.",
      "The deeper bind: US deficits (Vietnam, Great Society) had produced more dollars abroad than gold at $35 could cover. Triffin’s dilemma was no longer theoretical. Surplus countries (notably France) had been asking for metal. Closing the window defaulted on a convertibility pledge to protect the remaining stock and US policy space.",
      "What followed was not instant ‘free floating forever’ as a plan. The Smithsonian attempt (December 1971) tried new parities. Those failed. By 1973 major currencies were floating. The world you write about when you write about FX reserves, petrodollars, and independent inflation policy is the one that this break made possible — not inevitable in every detail, but possible.",
    ],
    example:
      "A 1971 reader of the speech heard ‘jobs, not gold’. A French official heard a default. A later textbook heard ‘the start of fiat’. All three readings need different sources. None is the whole remnant.",
    whyItMatters:
      "Every piece that treats floating FX, modern reserve-currency politics, or 1970s inflation as weather should have to pass through this weekend. It was a choice under constraint.",
    quiz: [
      q("hn1", "Closing the gold window meant:", ["The US minted more coins", "Foreign official dollars were no longer convertible into US gold at the fixed price", "Bretton Woods was strengthened", "Wages were indexed to gold"], 1, "A convertibility default."),
      q("hn2", "Triffin’s dilemma here is that:", ["A key-currency country supplies the world with its money only by running external deficits that eventually undermine convertibility", "Gold has no industrial use", "Inflation is always monetary", "France had no gold"], 0, "Liquidity versus confidence."),
      q("hn3", "Smithsonian (1971) was:", ["The final float", "An attempt to restore a system of parities that then failed", "A trade treaty with Japan only", "The founding of the ECB"], 1, "A last fixed try."),
    ],
  }),
];
