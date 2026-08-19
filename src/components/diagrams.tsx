import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const frame = "mt-6 overflow-hidden rounded-lg bg-raised px-4 py-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]";

export function LessonDiagram({ name }: { name?: string }) {
  if (!name) return null;
  const inner = DIAGRAMS[name];
  if (!inner) return null;
  return <figure className={frame}>{inner}</figure>;
}

const svg = "h-auto w-full text-fg";

const DIAGRAMS: Record<string, ReactNode> = {
  "latency-throughput": (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Latency versus throughput">
      <rect x="24" y="28" width="150" height="44" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="99" y="55" textAnchor="middle" fill="currentColor" fontSize="13">
        one item
      </text>
      <path d="M174 50 H230" stroke="currentColor" strokeOpacity="0.45" />
      <text x="268" y="46" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.7">
        40 min
      </text>
      <text x="268" y="64" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.5">
        latency
      </text>
      <rect x="320" y="20" width="52" height="28" rx="4" fill="currentColor" fillOpacity="0.12" />
      <rect x="378" y="20" width="52" height="28" rx="4" fill="currentColor" fillOpacity="0.12" />
      <rect x="436" y="20" width="52" height="28" rx="4" fill="currentColor" fillOpacity="0.12" />
      <rect x="320" y="56" width="52" height="28" rx="4" fill="currentColor" fillOpacity="0.12" />
      <rect x="378" y="56" width="52" height="28" rx="4" fill="currentColor" fillOpacity="0.12" />
      <rect x="436" y="56" width="52" height="28" rx="4" fill="currentColor" fillOpacity="0.12" />
      <text x="404" y="112" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.7">
        many finish / hour — throughput
      </text>
      <text x="280" y="140" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        overlap does not shorten one item
      </text>
    </svg>
  ),
  "fetch-decode": (
    <svg viewBox="0 0 560 140" className={svg} aria-label="Fetch decode execute loop">
      {["fetch", "decode", "execute", "next PC"].map((label, i) => (
        <g key={label} transform={`translate(${20 + i * 135}, 36)`}>
          <rect width="118" height="52" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <text x="59" y="32" textAnchor="middle" fill="currentColor" fontSize="14">
            {label}
          </text>
          {i < 3 && <path d="M122 26 H132" stroke="currentColor" strokeOpacity="0.45" />}
        </g>
      ))}
      <text x="280" y="122" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        the sequential loop a pipeline later overlaps
      </text>
    </svg>
  ),
  datapath: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Datapath versus control">
      <rect x="40" y="24" width="220" height="88" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="150" y="52" textAnchor="middle" fill="currentColor" fontSize="13">
        datapath
      </text>
      <text x="150" y="76" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        regs · ALU · mem ports
      </text>
      <rect x="300" y="24" width="220" height="88" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="410" y="52" textAnchor="middle" fill="currentColor" fontSize="13">
        control
      </text>
      <text x="410" y="76" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        which transform, next PC
      </text>
      <path d="M260 68 H300" stroke="currentColor" strokeOpacity="0.45" />
      <text x="280" y="138" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        values move left · decisions come from the right
      </text>
    </svg>
  ),
  locality: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Temporal and spatial locality">
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x={36 + i * 42}
          y="40"
          width="34"
          height="34"
          rx="4"
          fill={i === 4 || i === 5 || i === 6 ? "currentColor" : "none"}
          fillOpacity={i === 4 ? 0.28 : i === 5 || i === 6 ? 0.12 : 0}
          stroke="currentColor"
          strokeOpacity="0.35"
        />
      ))}
      <text x="221" y="96" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.7">
        same cell again — temporal
      </text>
      <text x="347" y="96" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.7">
        neighbours — spatial
      </text>
      <text x="280" y="132" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        a small fast memory only wins if the next access is here
      </text>
    </svg>
  ),
  hierarchy: (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Cache hierarchy">
      {[
        { y: 16, w: 120, label: "L1 · small · few cycles" },
        { y: 52, w: 220, label: "L2 · larger · slower" },
        { y: 88, w: 340, label: "L3 · larger still" },
        { y: 124, w: 480, label: "DRAM · capacity · long wait" },
      ].map((row) => (
        <g key={row.label} transform={`translate(${280 - row.w / 2}, ${row.y})`}>
          <rect width={row.w} height="28" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <text x={row.w / 2} y="19" textAnchor="middle" fill="currentColor" fontSize="12">
            {row.label}
          </text>
        </g>
      ))}
    </svg>
  ),
  pipeline: (
    <svg viewBox="0 0 560 140" className={svg} aria-label="Five-stage pipeline">
      {["IF", "ID", "EX", "MEM", "WB"].map((label, i) => (
        <g key={label} transform={`translate(${16 + i * 108}, 36)`}>
          <rect width="92" height="56" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <text x="46" y="34" textAnchor="middle" fill="currentColor" fontSize="14" fontFamily="IBM Plex Sans, sans-serif">
            {label}
          </text>
          {i < 4 && <path d="M96 28 H104" stroke="currentColor" strokeOpacity="0.45" />}
        </g>
      ))}
      <text x="280" y="124" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        one instruction occupies every stage at once
      </text>
    </svg>
  ),
  hazards: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Data hazard">
      <text x="24" y="36" fill="currentColor" fontSize="13">load r1, [r2]</text>
      <text x="24" y="70" fill="currentColor" fontSize="13">add  r3, r1, 4</text>
      <rect x="220" y="20" width="300" height="28" rx="6" fill="currentColor" fillOpacity="0.08" />
      <rect x="220" y="54" width="90" height="28" rx="6" fill="currentColor" fillOpacity="0.08" />
      <rect x="318" y="54" width="120" height="28" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeDasharray="4 3" />
      <text x="378" y="73" textAnchor="middle" fill="currentColor" fillOpacity="0.7" fontSize="11">
        stall until data
      </text>
      <text x="280" y="130" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        RAW: the add needs a value the load has not produced
      </text>
    </svg>
  ),
  branch: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Branch guess">
      <rect x="200" y="16" width="160" height="40" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="42" textAnchor="middle" fill="currentColor" fontSize="13">beq r1, r2</text>
      <path d="M280 56 L280 78" stroke="currentColor" strokeOpacity="0.4" />
      <path d="M280 78 L160 110" stroke="currentColor" strokeOpacity="0.4" />
      <path d="M280 78 L400 110" stroke="currentColor" strokeOpacity="0.4" />
      <text x="160" y="132" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.7">not taken</text>
      <text x="400" y="132" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.7">taken + target</text>
    </svg>
  ),
  btb: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Branch target buffer">
      <rect x="40" y="36" width="140" height="56" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="110" y="70" textAnchor="middle" fill="currentColor" fontSize="13">fetch PC</text>
      <path d="M180 64 H230" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="230" y="28" width="180" height="72" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="320" y="58" textAnchor="middle" fill="currentColor" fontSize="13">BTB</text>
      <text x="320" y="78" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">PC → last target</text>
      <path d="M410 64 H460" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="460" y="36" width="70" height="56" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="495" y="70" textAnchor="middle" fill="currentColor" fontSize="12">next</text>
    </svg>
  ),
  mesi: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="MESI states">
      {["M", "E", "S", "I"].map((s, i) => (
        <g key={s} transform={`translate(${48 + i * 130}, 40)`}>
          <circle cx="40" cy="36" r="28" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <text x="40" y="41" textAnchor="middle" fill="currentColor" fontSize="16">{s}</text>
        </g>
      ))}
      <text x="280" y="132" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        Modified · Exclusive · Shared · Invalid
      </text>
    </svg>
  ),
  "rename-map": (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Architectural names map to physical registers">
      <rect x="24" y="28" width="150" height="88" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="99" y="58" textAnchor="middle" fill="currentColor" fontSize="13">ISA names</text>
      <text x="99" y="80" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">r1 r2 r3 …</text>
      <path d="M174 72 H230" stroke="currentColor" strokeOpacity="0.45" />
      <text x="202" y="64" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.55">map</text>
      <rect x="230" y="28" width="150" height="88" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="305" y="58" textAnchor="middle" fill="currentColor" fontSize="13">physicals</text>
      <text x="305" y="80" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">p37 p41 p52 …</text>
      <path d="M380 72 H430" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="430" y="40" width="106" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="483" y="78" textAnchor="middle" fill="currentColor" fontSize="12">issue</text>
      <text x="280" y="140" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        a name is a pointer, not a location
      </text>
    </svg>
  ),
  "rob-queue": (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Reorder buffer">
      {["alloc", "…", "exec", "…", "commit"].map((label, i) => (
        <g key={`${label}-${i}`} transform={`translate(${20 + i * 108}, 36)`}>
          <rect width="96" height="52" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <text x="48" y="32" textAnchor="middle" fill="currentColor" fontSize="13">{label}</text>
          {i < 4 && <path d="M100 26 H108" stroke="currentColor" strokeOpacity="0.4" />}
        </g>
      ))}
      <text x="68" y="112" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">in order</text>
      <text x="284" y="112" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">any order</text>
      <text x="500" y="112" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">in order</text>
      <text x="280" y="140" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        the window restores program order at the head
      </text>
    </svg>
  ),
  "wakeup-select": (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Wakeup then select">
      <rect x="24" y="28" width="140" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="94" y="66" textAnchor="middle" fill="currentColor" fontSize="13">tag broadcast</text>
      <path d="M164 60 H214" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="214" y="28" width="140" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="284" y="66" textAnchor="middle" fill="currentColor" fontSize="13">ready bits</text>
      <path d="M354 60 H404" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="404" y="28" width="132" height="64" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="470" y="66" textAnchor="middle" fill="currentColor" fontSize="13">pick ports</text>
      <text x="280" y="124" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        wakeup marks ready · select occupies the slots
      </text>
    </svg>
  ),
  lsq: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Load and store queues beside the ROB">
      <rect x="24" y="24" width="200" height="88" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="124" y="58" textAnchor="middle" fill="currentColor" fontSize="13">ROB · program order</text>
      <text x="124" y="80" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">every op</text>
      <rect x="260" y="16" width="276" height="48" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="398" y="46" textAnchor="middle" fill="currentColor" fontSize="13">store queue · addr · data</text>
      <rect x="260" y="76" width="276" height="48" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="398" y="106" textAnchor="middle" fill="currentColor" fontSize="13">load queue · may forward</text>
      <text x="280" y="142" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        addresses arrive late · forwarding stays on this thread
      </text>
    </svg>
  ),
  "store-buffer": (
    <svg viewBox="0 0 560 140" className={svg} aria-label="Store buffer between core and cache">
      <rect x="20" y="36" width="120" height="56" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="80" y="70" textAnchor="middle" fill="currentColor" fontSize="13">core done</text>
      <path d="M140 64 H190" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="190" y="28" width="180" height="72" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="58" textAnchor="middle" fill="currentColor" fontSize="13">store buffer</text>
      <text x="280" y="78" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">forward to later load</text>
      <path d="M370 64 H420" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="420" y="36" width="120" height="56" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="480" y="70" textAnchor="middle" fill="currentColor" fontSize="13">cache</text>
    </svg>
  ),
  "two-caches": (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Two private caches, one address">
      <rect x="28" y="20" width="160" height="72" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="108" y="50" textAnchor="middle" fill="currentColor" fontSize="13">core 0 cache</text>
      <text x="108" y="70" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.65">x = 1</text>
      <rect x="372" y="20" width="160" height="72" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="452" y="50" textAnchor="middle" fill="currentColor" fontSize="13">core 1 cache</text>
      <text x="452" y="70" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.65">x = 0 ?</text>
      <rect x="180" y="108" width="200" height="28" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <text x="280" y="127" textAnchor="middle" fill="currentColor" fontSize="12">one address · one writer</text>
    </svg>
  ),
  "gpu-grid": (
    <svg viewBox="0 0 560 170" className={svg} aria-label="Grid of blocks of threads">
      <rect x="20" y="18" width="520" height="118" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <text x="280" y="38" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.7">
        grid
      </text>
      {[0, 1, 2].map((b) => (
        <g key={b} transform={`translate(${48 + b * 168}, 52)`}>
          <rect width="148" height="70" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.45" />
          <text x="74" y="18" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.7">
            block {b}
          </text>
          {[0, 1, 2, 3].map((t) => (
            <rect key={t} x={10 + t * 32} y="28" width="26" height="28" rx="3" fill="currentColor" fillOpacity="0.12" />
          ))}
        </g>
      ))}
      <text x="280" y="158" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        you launch threads and blocks · hardware groups them later
      </text>
    </svg>
  ),
  "gpu-simt": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="SIMT lockstep group">
      <text x="280" y="22" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.7">
        one instruction
      </text>
      <path d="M280 28 V44" stroke="currentColor" strokeOpacity="0.4" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i} transform={`translate(${36 + i * 64}, 52)`}>
          <rect
            width="52"
            height="52"
            rx="6"
            fill="currentColor"
            fillOpacity={i === 2 || i === 5 ? 0.06 : 0.14}
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <text x="26" y="32" textAnchor="middle" fill="currentColor" fontSize="11">
            {i === 2 || i === 5 ? "off" : "lane"}
          </text>
        </g>
      ))}
      <text x="280" y="132" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.7">
        masked lanes still occupy the issue
      </text>
      <text x="280" y="150" textAnchor="middle" fill="currentColor" fillOpacity="0.5" fontSize="11">
        scalar source · lockstep hardware
      </text>
    </svg>
  ),
  "gpu-diverge": (
    <svg viewBox="0 0 560 170" className={svg} aria-label="Divergent paths in one warp">
      <rect x="200" y="12" width="160" height="28" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="31" textAnchor="middle" fill="currentColor" fontSize="12">
        one warp PC
      </text>
      <path d="M280 40 L160 78" stroke="currentColor" strokeOpacity="0.4" />
      <path d="M280 40 L400 78" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="88" y="78" width="144" height="36" rx="6" fill="currentColor" fillOpacity="0.1" />
      <text x="160" y="101" textAnchor="middle" fill="currentColor" fontSize="12">
        if path · some lanes
      </text>
      <rect x="328" y="78" width="144" height="36" rx="6" fill="currentColor" fillOpacity="0.1" />
      <text x="400" y="101" textAnchor="middle" fill="currentColor" fontSize="12">
        else path · rest
      </text>
      <path d="M160 114 L280 142" stroke="currentColor" strokeOpacity="0.4" />
      <path d="M400 114 L280 142" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="162" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        both sides issue · then reconverge
      </text>
    </svg>
  ),
  "gpu-mem": (
    <svg viewBox="0 0 560 170" className={svg} aria-label="GPU memory hierarchy">
      {[
        { y: 16, label: "registers", note: "per thread" },
        { y: 52, label: "shared / LDS", note: "named · per block" },
        { y: 88, label: "L1 / L2", note: "hardware caches" },
        { y: 124, label: "device DRAM / HBM", note: "off-chip" },
      ].map((row) => (
        <g key={row.label} transform={`translate(80, ${row.y})`}>
          <rect width="400" height="28" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <text x="16" y="19" fill="currentColor" fontSize="13">
            {row.label}
          </text>
          <text x="384" y="19" textAnchor="end" fill="currentColor" fontSize="11" fillOpacity="0.55">
            {row.note}
          </text>
        </g>
      ))}
    </svg>
  ),
  "gpu-coalesce": (
    <svg viewBox="0 0 560 170" className={svg} aria-label="Coalesced versus scattered access">
      <text x="140" y="22" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.7">
        coalesced
      </text>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={`c${i}`} x={48 + i * 30} y="36" width="26" height="26" rx="3" fill="currentColor" fillOpacity="0.16" />
      ))}
      <rect x="44" y="72" width="188" height="22" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="138" y="87" textAnchor="middle" fill="currentColor" fontSize="11">
        one transaction
      </text>
      <text x="420" y="22" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.7">
        scattered
      </text>
      {[0, 1, 2, 3].map((i) => (
        <g key={`s${i}`}>
          <rect x={320 + i * 52} y="36" width="26" height="26" rx="3" fill="currentColor" fillOpacity="0.16" />
          <rect x={316 + i * 52} y={72 + (i % 2) * 18} width="34" height="16" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.35" />
        </g>
      ))}
      <text x="280" y="154" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        adjacent threads · adjacent addresses · few trips
      </text>
    </svg>
  ),
  "gpu-occupancy": (
    <svg viewBox="0 0 560 170" className={svg} aria-label="Occupancy as a budget">
      <rect x="24" y="20" width="160" height="100" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="104" y="44" textAnchor="middle" fill="currentColor" fontSize="12">
        registers
      </text>
      <text x="104" y="68" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        per thread × warps
      </text>
      <rect x="200" y="20" width="160" height="100" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="44" textAnchor="middle" fill="currentColor" fontSize="12">
        shared / LDS
      </text>
      <text x="280" y="68" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        per block
      </text>
      <rect x="376" y="20" width="160" height="100" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="456" y="44" textAnchor="middle" fill="currentColor" fontSize="12">
        warp slots
      </text>
      <text x="456" y="68" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        architectural cap
      </text>
      <text x="280" y="148" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        first ceiling wins · that many warps reside
      </text>
    </svg>
  ),
  litho: (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Lithography stack">
      <rect x="80" y="20" width="400" height="16" rx="2" fill="currentColor" fillOpacity="0.55" />
      <text x="280" y="16" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">mask</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={140 + i * 70} y1="36" x2={160 + i * 70} y2="70" stroke="currentColor" strokeOpacity="0.35" />
      ))}
      <rect x="80" y="70" width="400" height="22" rx="2" fill="currentColor" fillOpacity="0.2" />
      <text x="280" y="86" textAnchor="middle" fill="currentColor" fontSize="11">resist</text>
      <rect x="80" y="96" width="400" height="36" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <text x="280" y="118" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.7">wafer</text>
    </svg>
  ),
  euv: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="EUV reflective path">
      <circle cx="80" cy="80" r="16" fill="none" stroke="currentColor" strokeOpacity="0.5" />
      <text x="80" y="120" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">Sn plasma</text>
      <path d="M96 74 L200 40 L320 86 L420 50 L500 90" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      {[200, 320, 420].map((x, i) => (
        <rect key={x} x={x - 18} y={i === 1 ? 86 : 32} width="36" height="10" rx="1" fill="currentColor" fillOpacity="0.35" />
      ))}
      <rect x="488" y="90" width="40" height="28" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="508" y="134" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">wafer</text>
    </svg>
  ),
  gd: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Loss bowl">
      <path d="M40 30 Q280 220 520 30" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <circle cx="210" cy="98" r="5" fill="currentColor" />
      <path d="M210 98 L250 88" stroke="currentColor" strokeOpacity="0.7" />
      <text x="280" y="24" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.6">
        step opposite the gradient
      </text>
    </svg>
  ),
  attention: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="QKV attention">
      {["Q", "K", "V"].map((l, i) => (
        <g key={l} transform={`translate(${70 + i * 150}, 40)`}>
          <rect width="72" height="44" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <text x="36" y="28" textAnchor="middle" fill="currentColor" fontSize="16">{l}</text>
        </g>
      ))}
      <text x="280" y="124" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        softmax(QKᵀ / √d) · V
      </text>
    </svg>
  ),
  escapement: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Escapement">
      <circle cx="280" cy="70" r="36" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <circle cx="280" cy="70" r="3" fill="currentColor" />
      <path d="M280 70 L304 48" stroke="currentColor" />
      <rect x="188" y="58" width="36" height="24" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="336" y="58" width="36" height="24" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="136" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        lock · impulse · lock
      </text>
    </svg>
  ),
  freq: (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Frequency response">
      <path d="M40 110 H520" stroke="currentColor" strokeOpacity="0.25" />
      <path d="M40 20 V130" stroke="currentColor" strokeOpacity="0.25" />
      <path d="M48 80 C 140 80 180 40 260 42 C 340 44 380 90 520 96" fill="none" stroke="currentColor" strokeOpacity="0.7" />
      <text x="520" y="142" textAnchor="end" fill="currentColor" fillOpacity="0.5" fontSize="11">Hz</text>
      <text x="28" y="24" fill="currentColor" fillOpacity="0.5" fontSize="11">dB</text>
    </svg>
  ),
  "wafer-cross": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Boule sliced into a polished wafer">
      <ellipse cx="90" cy="78" rx="36" ry="52" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <text x="90" y="148" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        boule
      </text>
      <path d="M130 78 H190" stroke="currentColor" strokeOpacity="0.4" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={200 + i * 14} y="46" width="8" height="64" rx="1" fill="currentColor" fillOpacity={0.1 + i * 0.08} stroke="currentColor" strokeOpacity="0.35" />
      ))}
      <text x="222" y="148" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        slices
      </text>
      <path d="M268 78 H318" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="330" y="58" width="190" height="40" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="330" y="58" width="190" height="8" rx="2" fill="currentColor" fillOpacity="0.18" />
      <text x="425" y="84" textAnchor="middle" fill="currentColor" fontSize="12">
        polished surface
      </text>
      <text x="425" y="148" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.55">
        every later film inherits this face
      </text>
    </svg>
  ),
  "oxide-growth": (
    <svg viewBox="0 0 560 170" className={svg} aria-label="Thermal oxide consumes silicon and grows both ways">
      <rect x="40" y="70" width="220" height="60" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="150" y="106" textAnchor="middle" fill="currentColor" fontSize="13">
        Si
      </text>
      <rect x="300" y="48" width="220" height="36" rx="3" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeOpacity="0.4" />
      <text x="410" y="70" textAnchor="middle" fill="currentColor" fontSize="12">
        SiO2 grown
      </text>
      <rect x="300" y="84" width="220" height="46" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="410" y="112" textAnchor="middle" fill="currentColor" fontSize="13">
        remaining Si
      </text>
      <path d="M268 100 H292" stroke="currentColor" strokeOpacity="0.45" />
      <text x="280" y="28" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.7">
        O2 or H2O + heat
      </text>
      <text x="280" y="158" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        about 44% of the oxide thickness was silicon
      </text>
    </svg>
  ),
  "dopant-profiles": (
    <svg viewBox="0 0 560 170" className={svg} aria-label="Implant peak versus a diffusion tail from the surface">
      <path d="M40 140 H520" stroke="currentColor" strokeOpacity="0.25" />
      <path d="M60 20 V150" stroke="currentColor" strokeOpacity="0.25" />
      <path d="M60 36 C 90 36 110 50 140 90 C 180 148 240 148 320 148" fill="none" stroke="currentColor" strokeOpacity="0.75" />
      <path d="M160 140 C 200 40 260 28 320 70 C 380 112 430 140 500 148" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeDasharray="5 4" />
      <text x="150" y="28" fill="currentColor" fontSize="11" fillOpacity="0.7">
        surface source
      </text>
      <text x="360" y="48" fill="currentColor" fontSize="11" fillOpacity="0.7">
        implant peak
      </text>
      <text x="540" y="136" textAnchor="end" fill="currentColor" fontSize="11" fillOpacity="0.5">
        depth
      </text>
      <text x="48" y="18" fill="currentColor" fontSize="11" fillOpacity="0.5">
        conc.
      </text>
    </svg>
  ),
  "dep-vs-etch": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Deposition adds a film, etch removes one">
      <rect x="36" y="88" width="200" height="36" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="36" y="56" width="200" height="32" rx="3" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeOpacity="0.4" />
      <text x="136" y="76" textAnchor="middle" fill="currentColor" fontSize="12">
        added film
      </text>
      <text x="136" y="148" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        deposit / grow
      </text>
      <rect x="324" y="72" width="200" height="52" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <path d="M380 72 V124" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M468 72 V124" stroke="currentColor" strokeOpacity="0.35" />
      <text x="424" y="104" textAnchor="middle" fill="currentColor" fontSize="12">
        opening
      </text>
      <text x="424" y="148" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        etch
      </text>
    </svg>
  ),
  "etch-profile": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Isotropic undercut versus anisotropic vertical etch">
      <rect x="48" y="36" width="72" height="16" rx="2" fill="currentColor" fillOpacity="0.2" />
      <rect x="160" y="36" width="72" height="16" rx="2" fill="currentColor" fillOpacity="0.2" />
      <path d="M48 52 Q 120 120 160 52" fill="none" stroke="currentColor" strokeOpacity="0.7" />
      <text x="140" y="148" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        wet · undercut
      </text>
      <rect x="328" y="36" width="72" height="16" rx="2" fill="currentColor" fillOpacity="0.2" />
      <rect x="440" y="36" width="72" height="16" rx="2" fill="currentColor" fillOpacity="0.2" />
      <path d="M400 52 V124 H440 V52" fill="none" stroke="currentColor" strokeOpacity="0.7" />
      <text x="420" y="148" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        plasma · vertical
      </text>
    </svg>
  ),
  "cmp-flat": (
    <svg viewBox="0 0 560 150" className={svg} aria-label="CMP flattens topography">
      <path d="M40 90 L90 90 L110 50 L170 50 L190 90 L250 90" fill="none" stroke="currentColor" strokeOpacity="0.7" />
      <path d="M40 110 H250" stroke="currentColor" strokeOpacity="0.25" />
      <text x="145" y="136" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        before
      </text>
      <path d="M310 70 H520" stroke="currentColor" strokeOpacity="0.7" />
      <path d="M310 110 H520" stroke="currentColor" strokeOpacity="0.25" />
      <text x="415" y="136" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        after CMP
      </text>
    </svg>
  ),
  "contact-stack": (
    <svg viewBox="0 0 560 170" className={svg} aria-label="Silicide contact under a barrier and metal">
      <rect x="80" y="24" width="400" height="28" rx="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="42" textAnchor="middle" fill="currentColor" fontSize="12">
        metal
      </text>
      <rect x="80" y="52" width="400" height="20" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="66" textAnchor="middle" fill="currentColor" fontSize="11">
        barrier
      </text>
      <rect x="200" y="72" width="160" height="22" rx="2" fill="currentColor" fillOpacity="0.28" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="87" textAnchor="middle" fill="currentColor" fontSize="11">
        silicide
      </text>
      <rect x="80" y="94" width="400" height="40" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="118" textAnchor="middle" fill="currentColor" fontSize="12">
        silicon
      </text>
      <text x="280" y="156" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        low resistance only if the meeting is clean
      </text>
    </svg>
  ),
  "process-flow": (
    <svg viewBox="0 0 560 140" className={svg} aria-label="A simple front-end sequence">
      {["oxide", "dope", "gate", "contact"].map((label, i) => (
        <g key={label} transform={`translate(${24 + i * 134}, 36)`}>
          <rect width="118" height="52" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <text x="59" y="32" textAnchor="middle" fill="currentColor" fontSize="14">
            {label}
          </text>
          {i < 3 && <path d="M122 26 H132" stroke="currentColor" strokeOpacity="0.45" />}
        </g>
      ))}
      <text x="280" y="122" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        later heat cannot undo an earlier profile
      </text>
    </svg>
  ),
  "litho-sequence": (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Coat, expose, develop, then transfer">
      {["coat", "expose", "develop", "transfer"].map((label, i) => (
        <g key={label} transform={`translate(${24 + i * 134}, 36)`}>
          <rect width="118" height="52" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <text x="59" y="32" textAnchor="middle" fill="currentColor" fontSize="14">
            {label}
          </text>
          {i < 3 && <path d="M122 26 H132" stroke="currentColor" strokeOpacity="0.45" />}
        </g>
      ))}
      <text x="280" y="122" textAnchor="middle" fill="currentColor" fillOpacity="0.55" fontSize="12">
        the resist is a stencil · etch or implant is the device
      </text>
    </svg>
  ),
  "resist-tone": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Positive resist leaves where exposed; negative stays">
      <rect x="40" y="28" width="200" height="18" rx="2" fill="currentColor" fillOpacity="0.2" />
      <text x="140" y="20" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        light
      </text>
      <rect x="40" y="52" width="70" height="22" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="170" y="52" width="70" height="22" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="40" y="80" width="200" height="28" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <text x="140" y="128" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        positive · exposed leaves
      </text>
      <rect x="320" y="28" width="200" height="18" rx="2" fill="currentColor" fillOpacity="0.2" />
      <text x="420" y="20" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        light
      </text>
      <rect x="390" y="52" width="60" height="22" rx="2" fill="currentColor" fillOpacity="0.28" />
      <rect x="320" y="80" width="200" height="28" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <text x="420" y="128" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        negative · exposed stays
      </text>
    </svg>
  ),
  "rayleigh-knobs": (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Resolution as k1 times lambda over NA">
      <rect x="36" y="40" width="100" height="52" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="86" y="64" textAnchor="middle" fill="currentColor" fontSize="16">
        k1
      </text>
      <text x="86" y="82" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.55">
        process
      </text>
      <text x="154" y="70" fill="currentColor" fontSize="18" fillOpacity="0.45">
        ·
      </text>
      <rect x="176" y="40" width="100" height="52" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="226" y="64" textAnchor="middle" fill="currentColor" fontSize="16">
        λ
      </text>
      <text x="226" y="82" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.55">
        wavelength
      </text>
      <text x="292" y="72" fill="currentColor" fontSize="20" fillOpacity="0.45">
        /
      </text>
      <rect x="316" y="40" width="100" height="52" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="366" y="64" textAnchor="middle" fill="currentColor" fontSize="16">
        NA
      </text>
      <text x="366" y="82" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.55">
        aperture
      </text>
      <text x="440" y="72" fill="currentColor" fontSize="18" fillOpacity="0.5">
        =
      </text>
      <text x="500" y="74" textAnchor="middle" fill="currentColor" fontSize="14">
        CD
      </text>
      <text x="280" y="132" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        three knobs · not a slogan
      </text>
    </svg>
  ),
  "dof-trade": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Raising NA tightens pitch and thins the focus slice">
      <rect x="40" y="36" width="200" height="70" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M60 88 H220" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M70 56 H90 M110 56 H130 M150 56 H170 M190 56 H210" stroke="currentColor" strokeOpacity="0.7" strokeWidth="3" />
      <text x="140" y="124" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        lower NA · thicker focus
      </text>
      <rect x="320" y="28" width="200" height="86" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M340 80 H500" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M348 68 H360 M376 68 H388 M404 68 H416 M432 68 H444 M460 68 H472 M488 68 H500" stroke="currentColor" strokeOpacity="0.7" strokeWidth="2" />
      <path d="M330 52 H510" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="4 3" />
      <path d="M330 108 H510" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="4 3" />
      <text x="420" y="140" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        higher NA · thinner slice
      </text>
    </svg>
  ),
  "overlay-marks": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="This layer must sit on the last layer's marks">
      <rect x="48" y="36" width="200" height="70" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <rect x="88" y="52" width="48" height="38" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.55" />
      <rect x="160" y="52" width="48" height="38" rx="2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.45" />
      <text x="148" y="128" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        aligned
      </text>
      <rect x="312" y="36" width="200" height="70" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <rect x="352" y="52" width="48" height="38" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.55" />
      <rect x="432" y="44" width="48" height="38" rx="2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.45" />
      <text x="412" y="128" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        overlay miss
      </text>
    </svg>
  ),
  "multi-pattern": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="One drawn pitch split across two litho-etch passes">
      <path d="M48 48 H88 M112 48 H152 M176 48 H216 M240 48 H280" stroke="currentColor" strokeOpacity="0.25" strokeWidth="10" />
      <text x="164" y="84" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        drawn pitch
      </text>
      <path d="M336 36 H376 M464 36 H504" stroke="currentColor" strokeOpacity="0.75" strokeWidth="10" />
      <path d="M400 64 H440" stroke="currentColor" strokeOpacity="0.4" strokeWidth="10" />
      <text x="420" y="100" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        pass A · pass B
      </text>
      <text x="280" y="140" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        etch freezes each pass · union is the drawing
      </text>
    </svg>
  ),
  "duv-vs-euv": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="DUV refractive path versus EUV reflective path">
      <circle cx="56" cy="48" r="10" fill="none" stroke="currentColor" strokeOpacity="0.5" />
      <path d="M66 48 H130" stroke="currentColor" strokeOpacity="0.45" />
      <ellipse cx="154" cy="48" rx="16" ry="22" fill="none" stroke="currentColor" strokeOpacity="0.55" />
      <path d="M170 48 H230" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="230" y="36" width="36" height="24" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <text x="154" y="92" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        DUV · lenses
      </text>
      <circle cx="320" cy="52" r="10" fill="none" stroke="currentColor" strokeOpacity="0.5" />
      <path d="M330 48 L380 28 L440 56 L500 32" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="362" y="22" width="36" height="10" rx="1" fill="currentColor" fillOpacity="0.3" />
      <rect x="422" y="56" width="36" height="10" rx="1" fill="currentColor" fillOpacity="0.3" />
      <text x="420" y="92" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        EUV · mirrors
      </text>
      <text x="280" y="136" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        glass works at 193 nm · air and glass eat 13.5 nm
      </text>
    </svg>
  ),
  "high-na-field": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="High-NA is a new family with a smaller field">
      <rect x="40" y="28" width="200" height="80" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="56" y="44" width="168" height="48" rx="3" fill="currentColor" fillOpacity="0.1" />
      <text x="140" y="72" textAnchor="middle" fill="currentColor" fontSize="12">
        0.33 field
      </text>
      <text x="140" y="128" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        one shot · thicker focus
      </text>
      <rect x="320" y="28" width="200" height="80" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="336" y="44" width="80" height="48" rx="3" fill="currentColor" fillOpacity="0.16" />
      <rect x="424" y="44" width="80" height="48" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="4 3" />
      <text x="420" y="72" textAnchor="middle" fill="currentColor" fontSize="12">
        0.55 · stitch
      </text>
      <text x="420" y="128" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        two shots · thinner slice
      </text>
    </svg>
  ),
  "anamorphic-field": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Anamorphic demagnification keeps the mask printable">
      <rect x="48" y="36" width="140" height="80" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <text x="118" y="80" textAnchor="middle" fill="currentColor" fontSize="12">
        mask
      </text>
      <path d="M196 76 H250" stroke="currentColor" strokeOpacity="0.45" />
      <text x="222" y="68" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        4× / 8×
      </text>
      <rect x="258" y="52" width="100" height="48" rx="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.4" />
      <text x="308" y="80" textAnchor="middle" fill="currentColor" fontSize="12">
        wafer field
      </text>
      <text x="280" y="140" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        not a simple 4× shrink in both axes
      </text>
    </svg>
  ),
  "mask-3d-stack": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Absorber on a multilayer is not a 2D drawing">
      <rect x="80" y="28" width="160" height="18" rx="2" fill="currentColor" fillOpacity="0.28" />
      <text x="160" y="42" textAnchor="middle" fill="currentColor" fontSize="11">
        absorber
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="80" y={50 + i * 10} width="320" height="8" rx="1" fill="currentColor" fillOpacity={i % 2 ? 0.2 : 0.08} />
      ))}
      <text x="400" y="78" fill="currentColor" fontSize="11" fillOpacity="0.65">
        Bragg stack
      </text>
      <path d="M40 20 L120 48" stroke="currentColor" strokeOpacity="0.55" />
      <path d="M120 48 L200 20" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="4 3" />
      <text x="280" y="140" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        thickness shadows · the drawing is not the image
      </text>
    </svg>
  ),
  "stochastic-wall": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="More NA does not buy photons">
      <rect x="40" y="36" width="150" height="70" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="115" y="68" textAnchor="middle" fill="currentColor" fontSize="12">
        smaller feature
      </text>
      <text x="115" y="88" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        fewer photons
      </text>
      <rect x="210" y="36" width="140" height="70" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="68" textAnchor="middle" fill="currentColor" fontSize="12">
        more NA
      </text>
      <text x="280" y="88" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        no extra count
      </text>
      <rect x="370" y="36" width="150" height="70" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="445" y="68" textAnchor="middle" fill="currentColor" fontSize="12">
        more dose
      </text>
      <text x="445" y="88" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        fewer wafers / h
      </text>
      <text x="280" y="140" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        NA is not a photon source
      </text>
    </svg>
  ),
  "overlay-budget": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Overlay budget as a stack of small errors">
      {["stage", "mask write", "warp", "stitch"].map((label, i) => (
        <g key={label} transform={`translate(${36 + i * 130}, 36)`}>
          <rect width="112" height="52" rx="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <text x="56" y="32" textAnchor="middle" fill="currentColor" fontSize="13">
            {label}
          </text>
        </g>
      ))}
      <text x="280" y="124" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        each term is a fraction of a nanometre · the tail still eats the pad
      </text>
    </svg>
  ),
  "gag-sheet": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Nanosheets wrapped on every face">
      <rect x="70" y="36" width="22" height="80" rx="3" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="108" y="36" width="22" height="80" rx="3" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeOpacity="0.4" />
      <text x="100" y="136" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        fins · wrap three sides
      </text>
      <rect x="280" y="44" width="180" height="16" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="280" y="70" width="180" height="16" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="280" y="96" width="180" height="16" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="268" y="36" width="12" height="84" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="460" y="36" width="12" height="84" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <text x="370" y="136" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        sheets · wrap every face
      </text>
    </svg>
  ),
  "backside-power": (
    <svg viewBox="0 0 560 170" className={svg} aria-label="Power from the back, signals on the front">
      <rect x="80" y="24" width="400" height="28" rx="3" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="42" textAnchor="middle" fill="currentColor" fontSize="12">
        front-side signals
      </text>
      <rect x="80" y="56" width="400" height="36" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="78" textAnchor="middle" fill="currentColor" fontSize="12">
        devices
      </text>
      <rect x="80" y="96" width="400" height="28" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="114" textAnchor="middle" fill="currentColor" fontSize="12">
        backside power
      </text>
      <path d="M160 96 V124" stroke="currentColor" strokeOpacity="0.5" />
      <path d="M400 96 V124" stroke="currentColor" strokeOpacity="0.5" />
      <text x="280" y="152" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        power vias from the other face · the front can breathe
      </text>
    </svg>
  ),
  "chiplet-bond": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Small die assembled on a package">
      <rect x="70" y="36" width="90" height="52" rx="4" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="172" y="36" width="90" height="52" rx="4" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="274" y="36" width="70" height="52" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeOpacity="0.4" />
      <text x="207" y="66" textAnchor="middle" fill="currentColor" fontSize="12">
        chiplets
      </text>
      <rect x="56" y="96" width="448" height="22" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="112" textAnchor="middle" fill="currentColor" fontSize="11">
        interposer / hybrid bond
      </text>
      <text x="280" y="144" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        yield the small pieces · assemble the product
      </text>
    </svg>
  ),
  "user-kernel-boundary": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="User programs ask; the kernel owns the machine">
      <rect x="40" y="28" width="200" height="72" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="140" y="60" textAnchor="middle" fill="currentColor" fontSize="13">
        user programs
      </text>
      <text x="140" y="80" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        ordinary instructions
      </text>
      <path d="M240 64 H300" stroke="currentColor" strokeOpacity="0.45" />
      <text x="270" y="56" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        syscall
      </text>
      <rect x="300" y="28" width="220" height="72" rx="6" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.45" />
      <text x="410" y="60" textAnchor="middle" fill="currentColor" fontSize="13">
        kernel
      </text>
      <text x="410" y="80" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        privileged · owns devices
      </text>
      <text x="280" y="136" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        the door is narrow · the hardware enforces the split
      </text>
    </svg>
  ),
  "trap-entry": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="A trap or interrupt enters the kernel">
      <rect x="36" y="36" width="140" height="56" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="106" y="70" textAnchor="middle" fill="currentColor" fontSize="13">
        user code
      </text>
      <path d="M176 64 H250" stroke="currentColor" strokeOpacity="0.5" />
      <text x="213" y="56" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        trap
      </text>
      <rect x="250" y="28" width="130" height="72" rx="6" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.45" />
      <text x="315" y="70" textAnchor="middle" fill="currentColor" fontSize="13">
        handler
      </text>
      <path d="M380 64 H454" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="4 3" />
      <rect x="454" y="40" width="70" height="48" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <text x="489" y="68" textAnchor="middle" fill="currentColor" fontSize="12">
        device
      </text>
      <text x="280" y="136" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        program asks · or the device rings
      </text>
    </svg>
  ),
  "process-space": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Each process has its own address space">
      <rect x="40" y="28" width="200" height="88" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="140" y="54" textAnchor="middle" fill="currentColor" fontSize="13">
        process A
      </text>
      <rect x="64" y="66" width="70" height="28" rx="3" fill="currentColor" fillOpacity="0.12" />
      <rect x="146" y="66" width="70" height="28" rx="3" fill="currentColor" fillOpacity="0.12" />
      <text x="140" y="84" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.65">
        threads
      </text>
      <rect x="320" y="28" width="200" height="88" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="420" y="54" textAnchor="middle" fill="currentColor" fontSize="13">
        process B
      </text>
      <rect x="370" y="66" width="100" height="28" rx="3" fill="currentColor" fillOpacity="0.12" />
      <text x="280" y="144" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        two maps · a smash stays on its own map
      </text>
    </svg>
  ),
  "thread-share": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Threads share a map; processes do not">
      <rect x="48" y="24" width="220" height="100" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="158" y="46" textAnchor="middle" fill="currentColor" fontSize="12">
        one address space
      </text>
      <rect x="68" y="60" width="80" height="40" rx="4" fill="currentColor" fillOpacity="0.12" />
      <rect x="168" y="60" width="80" height="40" rx="4" fill="currentColor" fillOpacity="0.12" />
      <text x="108" y="84" textAnchor="middle" fill="currentColor" fontSize="12">
        T1
      </text>
      <text x="208" y="84" textAnchor="middle" fill="currentColor" fontSize="12">
        T2
      </text>
      <rect x="320" y="36" width="90" height="76" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="430" y="36" width="90" height="76" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="365" y="78" textAnchor="middle" fill="currentColor" fontSize="12">
        P1
      </text>
      <text x="475" y="78" textAnchor="middle" fill="currentColor" fontSize="12">
        P2
      </text>
      <text x="280" y="146" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        shared map versus private maps
      </text>
    </svg>
  ),
  "context-switch": (
    <svg viewBox="0 0 560 160" className={svg} aria-label="Save one thread, restore another">
      <rect x="40" y="32" width="150" height="64" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="115" y="60" textAnchor="middle" fill="currentColor" fontSize="13">
        thread A
      </text>
      <text x="115" y="80" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        registers saved
      </text>
      <path d="M190 64 H250" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="250" y="36" width="60" height="56" rx="6" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.4" />
      <text x="280" y="68" textAnchor="middle" fill="currentColor" fontSize="12">
        CPU
      </text>
      <path d="M310 64 H370" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="370" y="32" width="150" height="64" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <text x="445" y="60" textAnchor="middle" fill="currentColor" fontSize="13">
        thread B
      </text>
      <text x="445" y="80" textAnchor="middle" fill="currentColor" fontSize="11" fillOpacity="0.6">
        registers restored
      </text>
      <text x="280" y="136" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        one register file · two lives in memory
      </text>
    </svg>
  ),
  "ready-queue": (
    <svg viewBox="0 0 560 150" className={svg} aria-label="Several jobs ready so the CPU need not idle">
      <rect x="36" y="40" width="70" height="44" rx="5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="118" y="40" width="70" height="44" rx="5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="200" y="40" width="70" height="44" rx="5" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="4 3" />
      <text x="153" y="66" textAnchor="middle" fill="currentColor" fontSize="12">
        ready
      </text>
      <path d="M270 62 H330" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="330" y="36" width="90" height="52" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <text x="375" y="66" textAnchor="middle" fill="currentColor" fontSize="13">
        CPU
      </text>
      <rect x="440" y="40" width="80" height="44" rx="5" fill="none" stroke="currentColor" strokeOpacity="0.3" />
      <text x="480" y="66" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.7">
        waiting I/O
      </text>
      <text x="280" y="128" textAnchor="middle" fill="currentColor" fontSize="12" fillOpacity="0.55">
        switch so the CPU is not idle with the job
      </text>
    </svg>
  ),
};

export function DiagramCaption({ children, className }: { children: ReactNode; className?: string }) {
  return <figcaption className={cn("mt-2 text-center text-sm text-muted", className)}>{children}</figcaption>;
}
