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
    id: "horo-esc-5",
    conceptId: "horo-escape",
    title: "An escapement counts a spring",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "horo-tourbillon",
    diagram: "escapement",
    explanation: [
      "A mainspring wants to unwind in one rush. The escapement lets it go in ticks. A pallet fork locks and unlocks a toothed escape wheel in time with the oscillator (balance wheel and hairspring, or a pendulum). Each unlock gives the oscillator a little push — the impulse — so friction does not kill the swing.",
      "Timekeeping lives in the oscillator’s period, not in the gear train. The train just counts. If the impulse or the lock disturbs the period in a state-dependent way, the watch gains or loses with position, amplitude, and temperature.",
    ],
    example:
      "The Swiss lever escapement: two pallet jewels take turns locking the escape wheel. The impulse face gives the balance a kick through the roller jewel. You can hear this as the tick. You can see it as the seconds hand stepping.",
    whyItMatters:
      "Every ‘mechanical vs quartz’ piece that stops at ‘gears’ has missed the object. The fight is how cleanly you count a resonator.",
    quiz: [
      q("he1", "The escapement’s job is to:", ["Store energy for a week", "Release the train in ticks and impulse the oscillator", "Display the moon", "Magnetize the hairspring"], 1, "Count and sustain."),
      q("he2", "The time base is:", ["The mainspring barrel", "The oscillator’s period", "The number of jewels", "The case metal"], 1, "The train is a counter."),
      q("he3", "A state-dependent impulse error shows up as:", ["Better waterproofing", "Rate that changes with position or amplitude", "A louder rotor", "Thinner oil always helping"], 1, "Disturb the period, disturb the day."),
    ],
  }),
  L({
    id: "horo-tour-10",
    conceptId: "horo-tourbillon",
    title: "The tourbillon averages a mistake",
    durationMin: 10,
    effort: "deep",
    level: "core",
    prerequisites: ["horo-escape"],
    explanation: [
      "A pocket watch sits vertical in a vest. Gravity then biases the oscillator differently depending on which way ‘up’ is relative to the balance. Breguet’s tourbillon puts the escapement and balance in a rotating cage so that positional error is averaged around the clock — literally.",
      "On a modern wristwatch that already changes position every few minutes, the averaging argument is weaker. What remains is a demonstration of finishing, inertia management, and sometimes a residual benefit if the cage period is well chosen. Claiming a tourbillon as automatically more accurate than a well-regulated fixed escapement is a sales sentence.",
      "Complications that actually attack rate today are more often: better hairspring alloys (temperature and magnetism), free-sprung balances, silicon parts, and regulation against a timing machine in six positions. The rotating cage is the poetry.",
    ],
    example:
      "A 60-second tourbillon rotates the cage once a minute. A +8 s/d error at crown-left and a −8 s/d error at crown-right can cancel in the mean. A +8 s/d in every vertical position will not.",
    whyItMatters:
      "This is how to write about haute horology without being the press office. Name the error it averages. If you cannot, it is decoration.",
    quiz: [
      q("ht1", "A tourbillon was invented to:", ["Increase power reserve magically", "Average gravitational positional errors of a mostly-vertical watch", "Replace the hairspring", "Tell solar time"], 1, "Pocket-watch gravity."),
      q("ht2", "On the wrist the classic argument weakens because:", ["Gravity turns off", "The watch already changes orientation often", "Springs have no rate", "Cages cannot rotate"], 1, "You are already averaging."),
      q("ht3", "A tourbillon cannot cancel:", ["Errors that change sign with position", "Errors that have the same sign in all positions", "The need for oil", "The existence of a balance"], 1, "The mean of +8 and +8 is +8."),
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
    id: "mus-modes-10",
    conceptId: "mus-modes",
    title: "A mode is a tonic, not a scale shape",
    durationMin: 10,
    effort: "normal",
    level: "core",
    prerequisites: ["mus-interval"],
    explanation: [
      "Dorian, Phrygian, Mixolydian — these are not just ‘the white keys starting on D’. A mode is a hierarchy: which pitch is home, which degrees are stable, which want to move. The same pitch set with a different tonic is a different gravity well.",
      "In metal and modal jazz this matters because riffs often refuse functional V–I. A Phrygian riff with a flattened second sits on E and treats F as a neighbor, not as a key-of-C leftover. If you analyze it as C major you will invent cadences that are not there.",
      "Changing mode without changing tonic (parallel) is a color shift: C Ionian to C minor. Changing tonic without changing pitch set (relative) is a re-centering: C Ionian to A Aeolian. Those are different moves and they feel different.",
    ],
    example:
      "Sabbath’s E-minor pentatonic riffs plus a ♭2 visit is already leaning Phrygian. The home chord is still E5. Calling it ‘in G’ because the notes fit G major is a category error.",
    whyItMatters:
      "If you want to talk about why a riff feels Arabic, folk, or ‘open’, name the tonic and the characteristic degree. Otherwise you are listing notes.",
    quiz: [
      q("mm1", "Two modes sharing a pitch set differ by:", ["Tempo", "Which pitch is treated as tonic", "Time signature", "Instrumentation"], 1, "Gravity, not inventory."),
      q("mm2", "A characteristic Phrygian color is:", ["A raised 4th only", "A flattened 2nd against the tonic", "A major 7 always", "No fifth"], 1, "The ♭2 neighbor."),
      q("mm3", "Parallel major→minor keeps:", ["The tonic, changes the third (and more)", "The pitch set, changes nothing", "Only the tempo", "The lyric"], 0, "Same home, new color."),
    ],
  }),

  L({
    id: "dm-blast-5",
    conceptId: "dm-blast",
    title: "The blast beat is a grammar",
    durationMin: 5,
    effort: "light",
    level: "intro",
    prerequisites: [],
    goDeeper: "dm-harmony",
    explanation: [
      "A blast beat is a high-speed interlocking of kick, snare, and often ride/cymbal such that the ear hears a continuous roll instead of a backbeat. Common forms: traditional (kick and snare alternating), bomb blast (doubled kick under snare), and euro/hammer blast. The point is density and the removal of the rock ‘2 and 4’ as the only accent.",
      "It is not ‘playing fast’. It is a texture that lets guitars hold tremolo figures without a swinging drum arguing. Death metal’s shift from thrash’s mid-tempo d-beat to this texture is a formal change, not just BPM.",
    ],
    example:
      "Early Napalm Death and then the Florida tapes (and later Morbid Angel live) turned the blast from a hardcore burst into a section type you could write in — verse blast, half-time drop, blast again.",
    whyItMatters:
      "If you describe death metal as ‘noise’ you have not heard the grid. The blast is a grid. You can transcribe it.",
    quiz: [
      q("db1", "A blast beat typically:", ["Keeps a lazy backbeat at 80 BPM", "Stacks kick/snare/cymbal into a continuous high-speed texture", "Removes the kick drum", "Is only ride cymbal jazz"], 1, "Density as form."),
      q("db2", "Compared to thrash’s d-beat, blast sections:", ["Are slower always", "Replace the rock accent pattern with a roll-like grid", "Require a saxophone", "Forbid kick drums"], 1, "A different grammar."),
      q("db3", "A bomb blast usually means:", ["No snare", "Snare on the pulse with doubled kick underneath", "Only toms", "A studio explosion sample"], 1, "One common taxonomy."),
    ],
  }),
  L({
    id: "dm-harm-10",
    conceptId: "dm-harmony",
    title: "Death-metal harmony is cells, not songs",
    durationMin: 10,
    effort: "deep",
    level: "core",
    prerequisites: ["dm-blast"],
    goDeeper: "dm-history",
    explanation: [
      "A lot of death metal is built from short chromatic or diminished cells that get sequenced, inverted, and planed (moved in parallel). Tritone and minor-second relations do the tension that functional dominant chords do in common-practice music. Tremolo picking is articulation, not harmony — but it lets those cells stay in the air long enough to register.",
      "Riff-as-form: sections are defined by a guitar figure, not by a chord chart. The drum grammar (blast, d-beat, half-time) is a second formal axis. Vocals are often a rhythmic layer, not a melody with a hook. Analyzing this with pop verse/chorus first will fail you; start with the cell and the drum texture.",
      "Swedish (Stockholm) and Florida traditions also differ in production harmony: the Stockholm buzzsaw (HM-2, mid-scooped wall) stacks thirds into a smear; Florida recordings often leave more pick attack and separated rhythm. Same cells, different spectra.",
    ],
    example:
      "A two-bar chromatic descent on the low string, sequenced up a minor third, over a blast; then the same cell in half-time with a ride. That is a section pair. No chorus required.",
    whyItMatters:
      "This is how to write about the music as composed, not as a lifestyle appendix. Name the cell and the drum change.",
    quiz: [
      q("dh1", "Planing in this context is:", ["A woodworking term only", "Moving a voicing or cell in parallel without functional voice-leading", "Tuning down", "A mix bus"], 1, "Parallel motion as color."),
      q("dh2", "A useful first analysis step is:", ["Find the V–I", "Identify the riff cell and the drum texture", "Ignore the guitars", "Count the logo spikes"], 1, "Form lives there."),
      q("dh3", "HM-2 ‘buzzsaw’ tone is mainly:", ["A harmony theory", "A spectral/production choice that smears stacked midrange", "A drum technique", "A tempo"], 1, "It changes how cells fuse."),
    ],
  }),
  L({
    id: "dm-hist-10",
    conceptId: "dm-history",
    title: "Florida and Stockholm were two factories",
    durationMin: 10,
    effort: "normal",
    level: "intro",
    prerequisites: [],
    goDeeper: "dm-harmony",
    explanation: [
      "By the late 1980s two scenes independently finished the move out of thrash. In Florida (Tampa, Morrisound, Death, Morbid Angel, Obituary, Deicide) the doctrine was precision, palm-muted rhythm, and a dry, articulate recording of fast right hands. In Stockholm (Nihilist → Entombed, Dismember, Grave; Sunlight Studio) the doctrine was the HM-2 wall, mid-paced crush, and a wetter, dirtier spectrum.",
      "Neither scene is a purity test. They borrowed riffs, shared tape-trading, and later mixed. But if you cannot hear Morrisound versus Sunlight you will treat ‘old-school death metal’ as one object, which it was not. The later technical and dissonant turns (Gorguts, Immolation, Ulcerate) are a third factory.",
      "Genre history here is production history as much as personnel history. The desk and the pedal are part of the composition.",
    ],
    example:
      "Play Obituary’s *Cause of Death* into Entombed’s *Left Hand Path*. Same decade, same ancestor (Slayer/Celtic Frost/hardcore), two different answers about what a rhythm guitar is for.",
    whyItMatters:
      "Scene names in metal writing are often fashion. These two names are also engineering decisions you can point at.",
    quiz: [
      q("di1", "Morrisound’s Florida reputation is tied to:", ["HM-2 walls", "A drier, more articulate death-metal documentation", "Black-metal church burnings", "Only slam"], 1, "Precision as aesthetic."),
      q("di2", "Sunlight / Stockholm is associated with:", ["The HM-2 buzzsaw midrange wall", "Jazz fusion drums only", "No kick drum", "Tape-trading’s end"], 0, "A spectrum, not just a city."),
      q("di3", "Treating OSDM as one object fails because:", ["There was only one band", "Production and riff doctrine split at least two ways early", "Nobody recorded", "Death metal started in 2010"], 1, "Two factories, one name."),
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
