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
