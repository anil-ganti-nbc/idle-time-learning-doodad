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
};

export function DiagramCaption({ children, className }: { children: ReactNode; className?: string }) {
  return <figcaption className={cn("mt-2 text-center text-sm text-muted", className)}>{children}</figcaption>;
}
