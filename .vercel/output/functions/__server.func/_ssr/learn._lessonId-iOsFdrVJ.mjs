import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { At as array, Bt as string, Dt as _enum, Ft as number, Ht as union, It as object, Nt as literal, Ot as _null, Rt as record, Ut as unknown, jt as boolean, zt as strictObject } from "../_libs/@better-auth/core+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Route$3 } from "./router-DocPpzdv.mjs";
import { B as useCatalog, O as makeReadinessContext, V as useProgress, c as courseForConcept, t as PROMPT_VERSION } from "./use-catalog-DsTCgnv9.mjs";
import { t as HydrateGate } from "./hydrate-Ceh-ch8W.mjs";
import { n as SourceBadge, t as ProvenanceLine } from "./provenance-C96RdxDw.mjs";
import { t as Button } from "./button-CKDVl6lX.mjs";
import { a as toGenerationLog, i as generateQuiz, o as useAiContext, t as generateExplain } from "./use-ai-DoYZPk77.mjs";
import { a as getLive, s as startLive, t as bumpLiveGeneration } from "./live-DpxOBqbB.mjs";
import { t as quizContextFor } from "./quiz-context-BAIWHDkr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learn._lessonId-iOsFdrVJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var frame = "mt-6 max-w-full overflow-hidden rounded-lg bg-raised px-3 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] sm:px-4 sm:py-5";
function LessonDiagram({ name }) {
	if (!name) return null;
	const inner = DIAGRAMS[name];
	if (!inner) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
		className: frame,
		children: inner
	});
}
var svg = "h-auto w-full text-fg";
var DIAGRAMS = {
	"latency-throughput": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Latency versus throughput",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "28",
				width: "150",
				height: "44",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "99",
				y: "55",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "one item"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M174 50 H230",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "268",
				y: "46",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "40 min"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "268",
				y: "64",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.5",
				children: "latency"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "320",
				y: "20",
				width: "52",
				height: "28",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "378",
				y: "20",
				width: "52",
				height: "28",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "436",
				y: "20",
				width: "52",
				height: "28",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "320",
				y: "56",
				width: "52",
				height: "28",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "378",
				y: "56",
				width: "52",
				height: "28",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "436",
				y: "56",
				width: "52",
				height: "28",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "404",
				y: "112",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "many finish / hour — throughput"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "140",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "overlap does not shorten one item"
			})
		]
	}),
	"fetch-decode": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Fetch decode execute loop",
		children: [[
			"fetch",
			"decode",
			"execute",
			"next PC"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${20 + i * 135}, 36)`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "118",
					height: "52",
					rx: "8",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "59",
					y: "32",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "14",
					children: label
				}),
				i < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M122 26 H132",
					stroke: "currentColor",
					strokeOpacity: "0.45"
				})
			]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "122",
			textAnchor: "middle",
			fill: "currentColor",
			fillOpacity: "0.55",
			fontSize: "12",
			children: "the sequential loop a pipeline later overlaps"
		})]
	}),
	datapath: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Datapath versus control",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "24",
				width: "220",
				height: "88",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "150",
				y: "52",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "datapath"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "150",
				y: "76",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "regs · ALU · mem ports"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "300",
				y: "24",
				width: "220",
				height: "88",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "410",
				y: "52",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "control"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "410",
				y: "76",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "which transform, next PC"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M260 68 H300",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "138",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "values move left · decisions come from the right"
			})
		]
	}),
	locality: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Temporal and spatial locality",
		children: [
			Array.from({ length: 12 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 36 + i * 42,
				y: "40",
				width: "34",
				height: "34",
				rx: "4",
				fill: i === 4 || i === 5 || i === 6 ? "currentColor" : "none",
				fillOpacity: i === 4 ? .28 : i === 5 || i === 6 ? .12 : 0,
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "221",
				y: "96",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.7",
				children: "same cell again — temporal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "347",
				y: "96",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.7",
				children: "neighbours — spatial"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "a small fast memory only wins if the next access is here"
			})
		]
	}),
	hierarchy: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Cache hierarchy",
		children: [
			{
				y: 16,
				w: 120,
				label: "L1 · small · few cycles"
			},
			{
				y: 52,
				w: 220,
				label: "L2 · larger · slower"
			},
			{
				y: 88,
				w: 340,
				label: "L3 · larger still"
			},
			{
				y: 124,
				w: 480,
				label: "DRAM · capacity · long wait"
			}
		].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${280 - row.w / 2}, ${row.y})`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: row.w,
				height: "28",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: row.w / 2,
				y: "19",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: row.label
			})]
		}, row.label))
	}),
	pipeline: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Five-stage pipeline",
		children: [[
			"IF",
			"ID",
			"EX",
			"MEM",
			"WB"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${16 + i * 108}, 36)`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "92",
					height: "56",
					rx: "8",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "46",
					y: "34",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "14",
					fontFamily: "IBM Plex Sans, sans-serif",
					children: label
				}),
				i < 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M96 28 H104",
					stroke: "currentColor",
					strokeOpacity: "0.45"
				})
			]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "124",
			textAnchor: "middle",
			fill: "currentColor",
			fillOpacity: "0.55",
			fontSize: "12",
			children: "one instruction occupies every stage at once"
		})]
	}),
	hazards: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Data hazard",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "24",
				y: "36",
				fill: "currentColor",
				fontSize: "13",
				children: "load r1, [r2]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "24",
				y: "70",
				fill: "currentColor",
				fontSize: "13",
				children: "add  r3, r1, 4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "220",
				y: "20",
				width: "300",
				height: "28",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.08"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "220",
				y: "54",
				width: "90",
				height: "28",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.08"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "318",
				y: "54",
				width: "120",
				height: "28",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "378",
				y: "73",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.7",
				fontSize: "11",
				children: "stall until data"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "130",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "RAW: the add needs a value the load has not produced"
			})
		]
	}),
	branch: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Branch guess",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "16",
				width: "160",
				height: "40",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "42",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "beq r1, r2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M280 56 L280 78",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M280 78 L160 110",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M280 78 L400 110",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "160",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "not taken"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "400",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "taken + target"
			})
		]
	}),
	btb: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Branch target buffer",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "36",
				width: "140",
				height: "56",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "110",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "fetch PC"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M180 64 H230",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "230",
				y: "28",
				width: "180",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "320",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "BTB"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "320",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "PC → last target"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M410 64 H460",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "460",
				y: "36",
				width: "70",
				height: "56",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "495",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "next"
			})
		]
	}),
	mesi: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "MESI states",
		children: [[
			"M",
			"E",
			"S",
			"I"
		].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${48 + i * 130}, 40)`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "40",
				cy: "36",
				r: "28",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "40",
				y: "41",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "16",
				children: s
			})]
		}, s)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "132",
			textAnchor: "middle",
			fill: "currentColor",
			fillOpacity: "0.55",
			fontSize: "12",
			children: "Modified · Exclusive · Shared · Invalid"
		})]
	}),
	"rename-map": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Architectural names map to physical registers",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "28",
				width: "150",
				height: "88",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "99",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "ISA names"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "99",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "r1 r2 r3 …"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M174 72 H230",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "202",
				y: "64",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.55",
				children: "map"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "230",
				y: "28",
				width: "150",
				height: "88",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "305",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "physicals"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "305",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "p37 p41 p52 …"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M380 72 H430",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "430",
				y: "40",
				width: "106",
				height: "64",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "483",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "issue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "140",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "a name is a pointer, not a location"
			})
		]
	}),
	"rob-queue": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Reorder buffer",
		children: [
			[
				"alloc",
				"…",
				"exec",
				"…",
				"commit"
			].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: `translate(${20 + i * 108}, 36)`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "96",
						height: "52",
						rx: "8",
						fill: "none",
						stroke: "currentColor",
						strokeOpacity: "0.35"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "48",
						y: "32",
						textAnchor: "middle",
						fill: "currentColor",
						fontSize: "13",
						children: label
					}),
					i < 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M100 26 H108",
						stroke: "currentColor",
						strokeOpacity: "0.4"
					})
				]
			}, `${label}-${i}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "68",
				y: "112",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "in order"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "284",
				y: "112",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "any order"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "500",
				y: "112",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "in order"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "140",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "the window restores program order at the head"
			})
		]
	}),
	"wakeup-select": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Wakeup then select",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "28",
				width: "140",
				height: "64",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "94",
				y: "66",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "tag broadcast"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M164 60 H214",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "214",
				y: "28",
				width: "140",
				height: "64",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "284",
				y: "66",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "ready bits"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M354 60 H404",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "404",
				y: "28",
				width: "132",
				height: "64",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "470",
				y: "66",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "pick ports"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "124",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "wakeup marks ready · select occupies the slots"
			})
		]
	}),
	lsq: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Load and store queues beside the ROB",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "24",
				width: "200",
				height: "88",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "124",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "ROB · program order"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "124",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "every op"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "260",
				y: "16",
				width: "276",
				height: "48",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "398",
				y: "46",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "store queue · addr · data"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "260",
				y: "76",
				width: "276",
				height: "48",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "398",
				y: "106",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "load queue · may forward"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "142",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "addresses arrive late · forwarding stays on this thread"
			})
		]
	}),
	"store-buffer": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Store buffer between core and cache",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "20",
				y: "36",
				width: "120",
				height: "56",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "80",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "core done"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M140 64 H190",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "190",
				y: "28",
				width: "180",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "store buffer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "forward to later load"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M370 64 H420",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "420",
				y: "36",
				width: "120",
				height: "56",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "480",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "cache"
			})
		]
	}),
	"two-caches": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Two private caches, one address",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "20",
				width: "160",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "108",
				y: "50",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "core 0 cache"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "108",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.65",
				children: "x = 1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "372",
				y: "20",
				width: "160",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "452",
				y: "50",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "core 1 cache"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "452",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.65",
				children: "x = 0 ?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "180",
				y: "108",
				width: "200",
				height: "28",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "127",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "one address · one writer"
			})
		]
	}),
	"gpu-grid": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Grid of blocks of threads",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "20",
				y: "18",
				width: "520",
				height: "118",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "38",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "grid"
			}),
			[
				0,
				1,
				2
			].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: `translate(${48 + b * 168}, 52)`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "148",
						height: "70",
						rx: "6",
						fill: "none",
						stroke: "currentColor",
						strokeOpacity: "0.45"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: "74",
						y: "18",
						textAnchor: "middle",
						fill: "currentColor",
						fontSize: "11",
						fillOpacity: "0.7",
						children: ["block ", b]
					}),
					[
						0,
						1,
						2,
						3
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: 10 + t * 32,
						y: "28",
						width: "26",
						height: "28",
						rx: "3",
						fill: "currentColor",
						fillOpacity: "0.12"
					}, t))
				]
			}, b)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "158",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "you launch threads and blocks · hardware groups them later"
			})
		]
	}),
	"gpu-simt": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "SIMT lockstep group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "22",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "one instruction"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M280 28 V44",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			[
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: `translate(${36 + i * 64}, 52)`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "52",
					height: "52",
					rx: "6",
					fill: "currentColor",
					fillOpacity: i === 2 || i === 5 ? .06 : .14,
					stroke: "currentColor",
					strokeOpacity: "0.4"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "26",
					y: "32",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "11",
					children: i === 2 || i === 5 ? "off" : "lane"
				})]
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "masked lanes still occupy the issue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "150",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.5",
				fontSize: "11",
				children: "scalar source · lockstep hardware"
			})
		]
	}),
	"gpu-diverge": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Divergent paths in one warp",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "12",
				width: "160",
				height: "28",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "31",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "one warp issue slot"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M280 40 L160 78",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M280 40 L400 78",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "88",
				y: "78",
				width: "144",
				height: "36",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "160",
				y: "101",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "if path · some lanes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "328",
				y: "78",
				width: "144",
				height: "36",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "400",
				y: "101",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "else path · rest"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M160 114 L280 142",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M400 114 L280 142",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "162",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "both sides issue · then reconverge · Volta+ still pays this"
			})
		]
	}),
	"gpu-mem": /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "GPU memory hierarchy",
		children: [
			{
				y: 16,
				label: "registers",
				note: "per thread"
			},
			{
				y: 52,
				label: "shared / LDS",
				note: "named · per block"
			},
			{
				y: 88,
				label: "L1 / L2",
				note: "hardware caches"
			},
			{
				y: 124,
				label: "device DRAM / HBM",
				note: "off-chip"
			}
		].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(80, ${row.y})`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "400",
					height: "28",
					rx: "6",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "16",
					y: "19",
					fill: "currentColor",
					fontSize: "13",
					children: row.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "384",
					y: "19",
					textAnchor: "end",
					fill: "currentColor",
					fontSize: "11",
					fillOpacity: "0.55",
					children: row.note
				})
			]
		}, row.label))
	}),
	"gpu-coalesce": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Coalesced versus scattered access",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "22",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "coalesced"
			}),
			[
				0,
				1,
				2,
				3,
				4,
				5
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 48 + i * 30,
				y: "36",
				width: "26",
				height: "26",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.16"
			}, `c${i}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "44",
				y: "72",
				width: "188",
				height: "22",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "138",
				y: "87",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "one transaction"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "22",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "scattered"
			}),
			[
				0,
				1,
				2,
				3
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 320 + i * 52,
				y: "36",
				width: "26",
				height: "26",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.16"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 316 + i * 52,
				y: 72 + i % 2 * 18,
				width: "34",
				height: "16",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			})] }, `s${i}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "154",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "adjacent threads · adjacent addresses · few trips"
			})
		]
	}),
	"gpu-occupancy": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Occupancy as a budget",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "20",
				width: "160",
				height: "100",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "104",
				y: "44",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "registers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "104",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "per thread × warps"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "20",
				width: "160",
				height: "100",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "44",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "shared / LDS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "per block"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "376",
				y: "20",
				width: "160",
				height: "100",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "456",
				y: "44",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "warp slots"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "456",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "architectural cap"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "148",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "first ceiling wins · that many warps reside"
			})
		]
	}),
	litho: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Lithography stack",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "80",
				y: "20",
				width: "400",
				height: "16",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "16",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "mask"
			}),
			[
				0,
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: 140 + i * 70,
				y1: "36",
				x2: 160 + i * 70,
				y2: "70",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "80",
				y: "70",
				width: "400",
				height: "22",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "86",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "resist"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "80",
				y: "96",
				width: "400",
				height: "36",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "118",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.7",
				children: "wafer"
			})
		]
	}),
	euv: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "EUV reflective path",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "80",
				cy: "80",
				r: "16",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "80",
				y: "120",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "Sn plasma"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M96 74 L200 40 L320 86 L420 50 L500 90",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			[
				200,
				320,
				420
			].map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: x - 18,
				y: i === 1 ? 86 : 32,
				width: "36",
				height: "10",
				rx: "1",
				fill: "currentColor",
				fillOpacity: "0.35"
			}, x)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "488",
				y: "90",
				width: "40",
				height: "28",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "508",
				y: "134",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "wafer"
			})
		]
	}),
	gd: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Loss bowl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 30 Q280 220 520 30",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "210",
				cy: "98",
				r: "5",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M210 98 L250 88",
				stroke: "currentColor",
				strokeOpacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "24",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.6",
				children: "step opposite the gradient"
			})
		]
	}),
	attention: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "QKV attention",
		children: [[
			"Q",
			"K",
			"V"
		].map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${70 + i * 150}, 40)`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "72",
				height: "44",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "36",
				y: "28",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "16",
				children: l
			})]
		}, l)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "124",
			textAnchor: "middle",
			fill: "currentColor",
			fillOpacity: "0.55",
			fontSize: "12",
			children: "softmax(QKᵀ / √d) · V"
		})]
	}),
	escapement: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Escapement",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "280",
				cy: "70",
				r: "36",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "280",
				cy: "70",
				r: "3",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M280 70 L304 48",
				stroke: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "188",
				y: "58",
				width: "36",
				height: "24",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "336",
				y: "58",
				width: "36",
				height: "24",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fillOpacity: "0.55",
				fontSize: "12",
				children: "lock · impulse · lock"
			})
		]
	}),
	freq: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Frequency response",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 110 H520",
				stroke: "currentColor",
				strokeOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 20 V130",
				stroke: "currentColor",
				strokeOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M48 80 C 140 80 180 40 260 42 C 340 44 380 90 520 96",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "520",
				y: "142",
				textAnchor: "end",
				fill: "currentColor",
				fillOpacity: "0.5",
				fontSize: "11",
				children: "Hz"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "28",
				y: "24",
				fill: "currentColor",
				fillOpacity: "0.5",
				fontSize: "11",
				children: "dB"
			})
		]
	}),
	"wafer-cross": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Boule sliced into a polished wafer",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "90",
				cy: "78",
				rx: "36",
				ry: "52",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "90",
				y: "148",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "boule"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M130 78 H190",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			[
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 200 + i * 14,
				y: "46",
				width: "8",
				height: "64",
				rx: "1",
				fill: "currentColor",
				fillOpacity: .1 + i * .08,
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "222",
				y: "148",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "slices"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M268 78 H318",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "330",
				y: "58",
				width: "190",
				height: "40",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "330",
				y: "58",
				width: "190",
				height: "8",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.18"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "425",
				y: "84",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "polished surface"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "425",
				y: "148",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.55",
				children: "every later film inherits this face"
			})
		]
	}),
	"oxide-growth": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Thermal oxide consumes silicon and grows both ways",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "70",
				width: "220",
				height: "60",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "150",
				y: "106",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "Si"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "300",
				y: "48",
				width: "220",
				height: "36",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.14",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "410",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "SiO2 grown"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "300",
				y: "84",
				width: "220",
				height: "46",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "410",
				y: "112",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "remaining Si"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M268 100 H292",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "28",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "O2 or H2O + heat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "158",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "about 44% of the oxide thickness was silicon"
			})
		]
	}),
	"dopant-profiles": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Implant peak versus a diffusion tail from the surface",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 140 H520",
				stroke: "currentColor",
				strokeOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M60 20 V150",
				stroke: "currentColor",
				strokeOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M60 36 C 90 36 110 50 140 90 C 180 148 240 148 320 148",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.75"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M160 140 C 200 40 260 28 320 70 C 380 112 430 140 500 148",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45",
				strokeDasharray: "5 4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "150",
				y: "28",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.7",
				children: "surface source"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "360",
				y: "48",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.7",
				children: "implant peak"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "540",
				y: "136",
				textAnchor: "end",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.5",
				children: "depth"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "48",
				y: "18",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.5",
				children: "conc."
			})
		]
	}),
	"dep-vs-etch": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Deposition adds a film, etch removes one",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "88",
				width: "200",
				height: "36",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "56",
				width: "200",
				height: "32",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.14",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "136",
				y: "76",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "added film"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "136",
				y: "148",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "deposit / grow"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "324",
				y: "72",
				width: "200",
				height: "52",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M380 72 V124",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M468 72 V124",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "424",
				y: "104",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "opening"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "424",
				y: "148",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "etch"
			})
		]
	}),
	"etch-profile": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Isotropic undercut versus anisotropic vertical etch",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "48",
				y: "36",
				width: "72",
				height: "16",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "160",
				y: "36",
				width: "72",
				height: "16",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M48 52 Q 120 120 160 52",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "148",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "wet · undercut"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "328",
				y: "36",
				width: "72",
				height: "16",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "440",
				y: "36",
				width: "72",
				height: "16",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M400 52 V124 H440 V52",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "148",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "plasma · vertical"
			})
		]
	}),
	"cmp-flat": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "CMP flattens topography",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 90 L90 90 L110 50 L170 50 L190 90 L250 90",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 110 H250",
				stroke: "currentColor",
				strokeOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "145",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "before"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M310 70 H520",
				stroke: "currentColor",
				strokeOpacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M310 110 H520",
				stroke: "currentColor",
				strokeOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "415",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "after CMP"
			})
		]
	}),
	"contact-stack": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Silicide contact under a barrier and metal",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "80",
				y: "24",
				width: "400",
				height: "28",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "42",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "metal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "80",
				y: "52",
				width: "400",
				height: "20",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.2",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "66",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "barrier"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "72",
				width: "160",
				height: "22",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.28",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "87",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "silicide"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "80",
				y: "94",
				width: "400",
				height: "40",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "118",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "silicon"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "156",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "low resistance only if the meeting is clean"
			})
		]
	}),
	"process-flow": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "A simple front-end sequence",
		children: [[
			"oxide",
			"dope",
			"gate",
			"contact"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${24 + i * 134}, 36)`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "118",
					height: "52",
					rx: "8",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "59",
					y: "32",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "14",
					children: label
				}),
				i < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M122 26 H132",
					stroke: "currentColor",
					strokeOpacity: "0.45"
				})
			]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "122",
			textAnchor: "middle",
			fill: "currentColor",
			fillOpacity: "0.55",
			fontSize: "12",
			children: "later heat cannot undo an earlier profile"
		})]
	}),
	"litho-sequence": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Coat, expose, develop, then transfer",
		children: [[
			"coat",
			"expose",
			"develop",
			"transfer"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${24 + i * 134}, 36)`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "118",
					height: "52",
					rx: "8",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "59",
					y: "32",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "14",
					children: label
				}),
				i < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M122 26 H132",
					stroke: "currentColor",
					strokeOpacity: "0.45"
				})
			]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "122",
			textAnchor: "middle",
			fill: "currentColor",
			fillOpacity: "0.55",
			fontSize: "12",
			children: "the resist is a stencil · etch or implant is the device"
		})]
	}),
	"resist-tone": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Positive resist leaves where exposed; negative stays",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "28",
				width: "200",
				height: "18",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "20",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "light"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "52",
				width: "70",
				height: "22",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "170",
				y: "52",
				width: "70",
				height: "22",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "80",
				width: "200",
				height: "28",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "128",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "positive · exposed leaves"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "320",
				y: "28",
				width: "200",
				height: "18",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "20",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "light"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "390",
				y: "52",
				width: "60",
				height: "22",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.28"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "320",
				y: "80",
				width: "200",
				height: "28",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "128",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "negative · exposed stays"
			})
		]
	}),
	"rayleigh-knobs": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Resolution as k1 times lambda over NA",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "40",
				width: "100",
				height: "52",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "86",
				y: "64",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "16",
				children: "k1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "86",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.55",
				children: "process"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "154",
				y: "70",
				fill: "currentColor",
				fontSize: "18",
				fillOpacity: "0.45",
				children: "·"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "176",
				y: "40",
				width: "100",
				height: "52",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "226",
				y: "64",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "16",
				children: "λ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "226",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.55",
				children: "wavelength"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "292",
				y: "72",
				fill: "currentColor",
				fontSize: "20",
				fillOpacity: "0.45",
				children: "/"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "316",
				y: "40",
				width: "100",
				height: "52",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "366",
				y: "64",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "16",
				children: "NA"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "366",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.55",
				children: "aperture"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "440",
				y: "72",
				fill: "currentColor",
				fontSize: "18",
				fillOpacity: "0.5",
				children: "="
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "500",
				y: "74",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "14",
				children: "CD"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "three knobs · not a slogan"
			})
		]
	}),
	"dof-trade": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Raising NA tightens pitch and thins the focus slice",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "36",
				width: "200",
				height: "70",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M60 88 H220",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M70 56 H90 M110 56 H130 M150 56 H170 M190 56 H210",
				stroke: "currentColor",
				strokeOpacity: "0.7",
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "124",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "lower NA · thicker focus"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "320",
				y: "28",
				width: "200",
				height: "86",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M340 80 H500",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M348 68 H360 M376 68 H388 M404 68 H416 M432 68 H444 M460 68 H472 M488 68 H500",
				stroke: "currentColor",
				strokeOpacity: "0.7",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M330 52 H510",
				stroke: "currentColor",
				strokeOpacity: "0.2",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M330 108 H510",
				stroke: "currentColor",
				strokeOpacity: "0.2",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "140",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "higher NA · thinner slice"
			})
		]
	}),
	"overlay-marks": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "This layer must sit on the last layer's marks",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "48",
				y: "36",
				width: "200",
				height: "70",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "88",
				y: "52",
				width: "48",
				height: "38",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "160",
				y: "52",
				width: "48",
				height: "38",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "148",
				y: "128",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "aligned"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "312",
				y: "36",
				width: "200",
				height: "70",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "352",
				y: "52",
				width: "48",
				height: "38",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "432",
				y: "44",
				width: "48",
				height: "38",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "412",
				y: "128",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "overlay miss"
			})
		]
	}),
	"multi-pattern": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "One drawn pitch split across two litho-etch passes",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M48 48 H88 M112 48 H152 M176 48 H216 M240 48 H280",
				stroke: "currentColor",
				strokeOpacity: "0.25",
				strokeWidth: "10"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "164",
				y: "84",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "drawn pitch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M336 36 H376 M464 36 H504",
				stroke: "currentColor",
				strokeOpacity: "0.75",
				strokeWidth: "10"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M400 64 H440",
				stroke: "currentColor",
				strokeOpacity: "0.4",
				strokeWidth: "10"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "100",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "pass A · pass B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "140",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "etch freezes each pass · union is the drawing"
			})
		]
	}),
	"duv-vs-euv": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "DUV refractive path versus EUV reflective path",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "56",
				cy: "48",
				r: "10",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M66 48 H130",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "154",
				cy: "48",
				rx: "16",
				ry: "22",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M170 48 H230",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "230",
				y: "36",
				width: "36",
				height: "24",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "154",
				y: "92",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "DUV · lenses"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "320",
				cy: "52",
				r: "10",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M330 48 L380 28 L440 56 L500 32",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "362",
				y: "22",
				width: "36",
				height: "10",
				rx: "1",
				fill: "currentColor",
				fillOpacity: "0.3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "422",
				y: "56",
				width: "36",
				height: "10",
				rx: "1",
				fill: "currentColor",
				fillOpacity: "0.3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "92",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "EUV · mirrors"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "glass works at 193 nm · air and glass eat 13.5 nm"
			})
		]
	}),
	"high-na-field": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "High-NA is a new family with a smaller field",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "28",
				width: "200",
				height: "80",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "56",
				y: "44",
				width: "168",
				height: "48",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "72",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "0.33 field"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "128",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "one shot · thicker focus"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "320",
				y: "28",
				width: "200",
				height: "80",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "336",
				y: "44",
				width: "80",
				height: "48",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.16"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "424",
				y: "44",
				width: "80",
				height: "48",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "72",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "0.55 · stitch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "128",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "two shots · thinner slice"
			})
		]
	}),
	"anamorphic-field": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Anamorphic demagnification keeps the mask printable",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "48",
				y: "36",
				width: "140",
				height: "80",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "118",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "mask"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M196 76 H250",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "222",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "4× / 8×"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "258",
				y: "52",
				width: "100",
				height: "48",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "308",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "wafer field"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "140",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "not a simple 4× shrink in both axes"
			})
		]
	}),
	"mask-3d-stack": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Absorber on a multilayer is not a 2D drawing",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "80",
				y: "28",
				width: "160",
				height: "18",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.28"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "160",
				y: "42",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "absorber"
			}),
			[
				0,
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "80",
				y: 50 + i * 10,
				width: "320",
				height: "8",
				rx: "1",
				fill: "currentColor",
				fillOpacity: i % 2 ? .2 : .08
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "400",
				y: "78",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "Bragg stack"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 20 L120 48",
				stroke: "currentColor",
				strokeOpacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M120 48 L200 20",
				stroke: "currentColor",
				strokeOpacity: "0.35",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "140",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "thickness shadows · the drawing is not the image"
			})
		]
	}),
	"stochastic-wall": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "More NA does not buy photons",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "36",
				width: "150",
				height: "70",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "115",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "smaller feature"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "115",
				y: "88",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "fewer photons"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "210",
				y: "36",
				width: "140",
				height: "70",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "more NA"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "88",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "no extra count"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "370",
				y: "36",
				width: "150",
				height: "70",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "445",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "more dose"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "445",
				y: "88",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "fewer wafers / h"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "140",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "NA is not a photon source"
			})
		]
	}),
	"overlay-budget": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Overlay budget as a stack of small errors",
		children: [[
			"stage",
			"mask write",
			"warp",
			"stitch"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${36 + i * 130}, 36)`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "112",
				height: "52",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "56",
				y: "32",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: label
			})]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "124",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "each term is a fraction of a nanometre · the tail still eats the pad"
		})]
	}),
	"gag-sheet": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Nanosheets wrapped on every face",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "70",
				y: "36",
				width: "22",
				height: "80",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.16",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "108",
				y: "36",
				width: "22",
				height: "80",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.16",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "fins · wrap three sides"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "280",
				y: "44",
				width: "180",
				height: "16",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.2",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "280",
				y: "70",
				width: "180",
				height: "16",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.2",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "280",
				y: "96",
				width: "180",
				height: "16",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.2",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "268",
				y: "36",
				width: "12",
				height: "84",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "460",
				y: "36",
				width: "12",
				height: "84",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "370",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "sheets · wrap every face"
			})
		]
	}),
	"backside-power": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Power from the back, signals on the front",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "80",
				y: "24",
				width: "400",
				height: "28",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "42",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "front-side signals"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "80",
				y: "56",
				width: "400",
				height: "36",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "devices"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "80",
				y: "96",
				width: "400",
				height: "28",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.2",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "114",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "backside power"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M160 96 V124",
				stroke: "currentColor",
				strokeOpacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M400 96 V124",
				stroke: "currentColor",
				strokeOpacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "152",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "power vias from the other face · the front can breathe"
			})
		]
	}),
	"chiplet-bond": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Small die assembled on a package",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "70",
				y: "36",
				width: "90",
				height: "52",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.14",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "172",
				y: "36",
				width: "90",
				height: "52",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.14",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "274",
				y: "36",
				width: "70",
				height: "52",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.2",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "207",
				y: "66",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "chiplets"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "56",
				y: "96",
				width: "448",
				height: "22",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "112",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "interposer / hybrid bond"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "144",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "yield the small pieces · assemble the product"
			})
		]
	}),
	"user-kernel-boundary": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "User programs ask; the kernel owns the machine",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "28",
				width: "200",
				height: "72",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "60",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "user programs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "ordinary instructions"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M240 64 H300",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "270",
				y: "56",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "syscall"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "300",
				y: "28",
				width: "220",
				height: "72",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "410",
				y: "60",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "kernel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "410",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "privileged · owns devices"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the door is narrow · the hardware enforces the split"
			})
		]
	}),
	"trap-entry": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "A trap or interrupt enters the kernel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "36",
				width: "140",
				height: "56",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "106",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "user code"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M176 64 H250",
				stroke: "currentColor",
				strokeOpacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "213",
				y: "56",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "trap"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "250",
				y: "28",
				width: "130",
				height: "72",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "315",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "handler"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M380 64 H454",
				stroke: "currentColor",
				strokeOpacity: "0.35",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "454",
				y: "40",
				width: "70",
				height: "48",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "489",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "device"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "program asks · or the device rings"
			})
		]
	}),
	"process-space": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Each process has its own address space",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "28",
				width: "200",
				height: "88",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "54",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "process A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "64",
				y: "66",
				width: "70",
				height: "28",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "146",
				y: "66",
				width: "70",
				height: "28",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "84",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "threads"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "320",
				y: "28",
				width: "200",
				height: "88",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "54",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "process B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "370",
				y: "66",
				width: "100",
				height: "28",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "144",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "two maps · a smash stays on its own map"
			})
		]
	}),
	"thread-share": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Threads share a map; processes do not",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "48",
				y: "24",
				width: "220",
				height: "100",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "158",
				y: "46",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "one address space"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "68",
				y: "60",
				width: "80",
				height: "40",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "168",
				y: "60",
				width: "80",
				height: "40",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "108",
				y: "84",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "T1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "208",
				y: "84",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "T2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "320",
				y: "36",
				width: "90",
				height: "76",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "430",
				y: "36",
				width: "90",
				height: "76",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "365",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "P1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "475",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "P2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "146",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "shared map versus private maps"
			})
		]
	}),
	"context-switch": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Save one thread, restore another",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "32",
				width: "150",
				height: "64",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "115",
				y: "60",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "thread A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "115",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "registers saved"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M190 64 H250",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "250",
				y: "36",
				width: "60",
				height: "56",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "CPU"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M310 64 H370",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "370",
				y: "32",
				width: "150",
				height: "64",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "445",
				y: "60",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "thread B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "445",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "registers restored"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "one register file · two lives in memory"
			})
		]
	}),
	"ready-queue": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Several jobs ready so the CPU need not idle",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "40",
				width: "70",
				height: "44",
				rx: "5",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "118",
				y: "40",
				width: "70",
				height: "44",
				rx: "5",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "40",
				width: "70",
				height: "44",
				rx: "5",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "153",
				y: "66",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "ready"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M270 62 H330",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "330",
				y: "36",
				width: "90",
				height: "52",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "375",
				y: "66",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "CPU"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "440",
				y: "40",
				width: "80",
				height: "44",
				rx: "5",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "480",
				y: "66",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "waiting I/O"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "128",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "switch so the CPU is not idle with the job"
			})
		]
	}),
	"virt-translate": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "A virtual address walks a table to a frame",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "40",
				width: "110",
				height: "52",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "83",
				y: "72",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "virtual"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M138 66 H200",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "28",
				width: "150",
				height: "76",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "275",
				y: "60",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "page table"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "275",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "walk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M350 66 H412",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "412",
				y: "40",
				width: "120",
				height: "52",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "472",
				y: "72",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "frame"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the program names a page · the machine finds a frame"
			})
		]
	}),
	"tlb-shootdown": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "One core changes a map; the others must drop the old translation",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "140",
				height: "72",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "106",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "core A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "106",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "mapping changed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M176 64 H240",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "208",
				y: "56",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "shoot"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "240",
				y: "28",
				width: "120",
				height: "72",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "300",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "core B TLB"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "400",
				y: "28",
				width: "120",
				height: "72",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "460",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "core C TLB"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "stale translations must die on every core"
			})
		]
	}),
	"page-fault-path": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "A missing translation traps into the kernel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "36",
				width: "120",
				height: "56",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "88",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "load / store"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M148 64 H210",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "210",
				y: "28",
				width: "130",
				height: "72",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "275",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "no translation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "275",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "trap"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M340 64 H400",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "400",
				y: "28",
				width: "132",
				height: "72",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "466",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "kernel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "466",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "fill or kill"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "a miss is a request · not always a crash"
			})
		]
	}),
	"cow-fork": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Parent and child share a frame until a write",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "130",
				height: "64",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "101",
				y: "66",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "parent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "214",
				y: "44",
				width: "132",
				height: "48",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "74",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "shared frame"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "394",
				y: "28",
				width: "130",
				height: "64",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "459",
				y: "66",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "child"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M166 60 H214",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M346 60 H394",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "a write copies · the other side keeps the old frame"
			})
		]
	}),
	"sched-queues": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "The scheduler picks from the runnable set",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "32",
				y: "36",
				width: "70",
				height: "44",
				rx: "5",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "112",
				y: "36",
				width: "70",
				height: "44",
				rx: "5",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "192",
				y: "36",
				width: "70",
				height: "44",
				rx: "5",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "151",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "runnable"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M262 58 H318",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "318",
				y: "32",
				width: "88",
				height: "52",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "362",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "pick"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "430",
				y: "36",
				width: "98",
				height: "44",
				rx: "5",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "479",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "waiting"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "126",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "policy chooses the next owner · it does not invent cores"
			})
		]
	}),
	"race-interleave": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Two threads read the same word and both write",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "150",
				height: "72",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "111",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "thread A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "111",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "read 7 · write 8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "374",
				y: "28",
				width: "150",
				height: "72",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "449",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "thread B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "449",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "read 7 · write 8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "210",
				y: "40",
				width: "140",
				height: "48",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "word = 7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "two increments · one is lost"
			})
		]
	}),
	"lock-sleep": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Spin burns the core; sleep gives it away",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "32",
				width: "200",
				height: "72",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "spin"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "core stays busy waiting"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "320",
				y: "32",
				width: "200",
				height: "72",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "sleep"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "core runs someone else"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "long holds belong on the sleep path"
			})
		]
	}),
	"inode-dir-fd": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "A handle names an open file; a directory name names an inode",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "40",
				width: "80",
				height: "48",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "64",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "fd"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M104 64 H150",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "150",
				y: "36",
				width: "100",
				height: "56",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "200",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "open file"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M250 64 H296",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "296",
				y: "36",
				width: "90",
				height: "56",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "341",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "inode"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M386 64 H430",
				stroke: "currentColor",
				strokeOpacity: "0.35",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "430",
				y: "36",
				width: "106",
				height: "56",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "483",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "name"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the name is not the object · the inode is"
			})
		]
	}),
	"fs-layout": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Disk image: superblock, free map, inodes, data",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "40",
				width: "100",
				height: "48",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "78",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "super"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "136",
				y: "40",
				width: "100",
				height: "48",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "186",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "free map"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "244",
				y: "40",
				width: "120",
				height: "48",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "304",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "inodes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "372",
				y: "40",
				width: "160",
				height: "48",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.08",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "452",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "data"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "124",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "a linear disk wearing a filesystem"
			})
		]
	}),
	"journal-commit": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Write the intent, then the home location",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "36",
				width: "150",
				height: "64",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "111",
				y: "64",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "journal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "111",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "intent first"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M186 68 H250",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "218",
				y: "60",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "then"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "250",
				y: "36",
				width: "150",
				height: "64",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "325",
				y: "64",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "home"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "325",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "metadata / data"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "430",
				y: "44",
				width: "96",
				height: "48",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "478",
				y: "74",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "durable"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the log must land before the damage"
			})
		]
	}),
	"buffer-path": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "A write hits RAM first, then the device",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "40",
				width: "110",
				height: "52",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "83",
				y: "72",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "write()"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M138 66 H196",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "196",
				y: "32",
				width: "150",
				height: "68",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "271",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "buffer cache"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "271",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "RAM"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M346 66 H408",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "408",
				y: "40",
				width: "124",
				height: "52",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "470",
				y: "72",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "device"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "cached is not durable"
			})
		]
	}),
	"net-encap": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Encapsulation stack",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "20",
				width: "480",
				height: "32",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.08",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "41",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "data"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "56",
				width: "110",
				height: "32",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "95",
				y: "77",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "ports"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "150",
				y: "56",
				width: "370",
				height: "32",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "335",
				y: "77",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "segment"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "92",
				width: "110",
				height: "32",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "95",
				y: "113",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "IP addrs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "150",
				y: "92",
				width: "370",
				height: "32",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "335",
				y: "113",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "packet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "128",
				width: "110",
				height: "32",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "95",
				y: "149",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "MACs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "150",
				y: "128",
				width: "370",
				height: "32",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "335",
				y: "149",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "frame"
			})
		]
	}),
	"net-switch-lan": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "A switch learns which port a MAC spoke from",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "220",
				y: "56",
				width: "120",
				height: "48",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "85",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "switch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "20",
				width: "88",
				height: "36",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "72",
				y: "43",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "A :1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "104",
				width: "88",
				height: "36",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "72",
				y: "127",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "C :3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "444",
				y: "56",
				width: "88",
				height: "36",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "488",
				y: "79",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "B :2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M116 38 H220 M116 122 H220 M340 80 H444",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "148",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "A last spoke on 1 · B on 2 · flood only the unknown"
			})
		]
	}),
	"net-arp-resolve": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "ARP asks who has this IP",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "36",
				width: "140",
				height: "56",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "94",
				y: "60",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "10.0.0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "94",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "who has .9?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M164 64 H248",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "206",
				y: "56",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "broadcast"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "248",
				y: "36",
				width: "140",
				height: "56",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "318",
				y: "60",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "10.0.0.9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "318",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "aa:bb:… answers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M388 64 H436",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "436",
				y: "40",
				width: "100",
				height: "48",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "486",
				y: "69",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "cache"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "IP known · MAC not yet · then the frame can leave"
			})
		]
	}),
	"net-subnet": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "A prefix is an address plus a length",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "28",
				width: "240",
				height: "72",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "148",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "10.1.0.0/16"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "148",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "sixteen bits in common"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "300",
				y: "28",
				width: "232",
				height: "72",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "416",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "10.1.4.0/24"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "416",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "more bits · more specific"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "130",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "a length, not a class · the longer match wins"
			})
		]
	}),
	"net-nat-map": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "NAT maps many private addresses onto one public",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "20",
				y: "28",
				width: "150",
				height: "88",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "95",
				y: "56",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "10.0.0.7:4000"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "95",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "10.0.0.8:4000"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "95",
				y: "100",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.55",
				children: "private"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M170 72 H230",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "230",
				y: "36",
				width: "140",
				height: "72",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "300",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "NAT table"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "300",
				y: "88",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "203.0.113.4:…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M370 72 H430",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "430",
				y: "44",
				width: "110",
				height: "56",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "485",
				y: "76",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "public"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "144",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "no mapping · inbound has nowhere to land"
			})
		]
	}),
	"net-tcp-ack": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Sequence numbers and acknowledgements",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "80",
				y: "28",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "sender"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "460",
				y: "28",
				textAnchor: "end",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "receiver"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M80 48 H480",
				stroke: "currentColor",
				strokeOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M80 88 H480",
				stroke: "currentColor",
				strokeOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M80 128 H480",
				stroke: "currentColor",
				strokeOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M120 48 L420 88",
				stroke: "currentColor",
				strokeOpacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "270",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "seq 100"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M420 88 L160 128",
				stroke: "currentColor",
				strokeOpacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "300",
				y: "118",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "ack 200"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "152",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "what arrived · what to send next"
			})
		]
	}),
	"net-slide-win": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "A sliding window bounds data in flight",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "40",
				width: "48",
				height: "36",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "76",
				y: "40",
				width: "48",
				height: "36",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "128",
				y: "36",
				width: "260",
				height: "44",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "140",
				y: "44",
				width: "48",
				height: "28",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "196",
				y: "44",
				width: "48",
				height: "28",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "252",
				y: "44",
				width: "48",
				height: "28",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "308",
				y: "44",
				width: "48",
				height: "28",
				rx: "3",
				fill: "currentColor",
				fillOpacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "400",
				y: "40",
				width: "48",
				height: "36",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "452",
				y: "40",
				width: "48",
				height: "36",
				rx: "3",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "258",
				y: "64",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "in flight"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "116",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "ACKed · window · not yet allowed"
			})
		]
	}),
	"net-cwnd": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "A congestion window grows then cuts",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 120 H520",
				stroke: "currentColor",
				strokeOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 20 V120",
				stroke: "currentColor",
				strokeOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 110 L120 90 L200 50 L280 20 L280 70 L360 55 L440 40 L440 80 L520 68",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "36",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.7",
				children: "loss"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "140",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "probe up · cut on a signal · share the unseen pipe"
			})
		]
	}),
	"net-bloat": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "A huge buffer turns congestion into delay",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "36",
				width: "100",
				height: "56",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "90",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "sender"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M140 64 H200",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "24",
				width: "180",
				height: "88",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "216",
				y: "40",
				width: "28",
				height: "56",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "250",
				y: "40",
				width: "28",
				height: "56",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "284",
				y: "40",
				width: "28",
				height: "56",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "318",
				y: "40",
				width: "28",
				height: "56",
				rx: "2",
				fill: "currentColor",
				fillOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "290",
				y: "128",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "standing queue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M380 64 H440",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "440",
				y: "44",
				width: "88",
				height: "40",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "484",
				y: "69",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "link"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "146",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "no drop · just late"
			})
		]
	}),
	"net-as-graph": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Autonomous systems as policy islands",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "130",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "101",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "AS 1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "214",
				y: "28",
				width: "130",
				height: "72",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "279",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "AS 2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "392",
				y: "28",
				width: "130",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "457",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "AS 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M166 64 H214 M344 64 H392",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "one policy per island · a cable is not agreement"
			})
		]
	}),
	"net-bgp-path": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "BGP chooses a path by policy",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "40",
				width: "90",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "69",
				y: "67",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "you"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M114 54 H170",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M114 70 H170",
				stroke: "currentColor",
				strokeOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "170",
				y: "24",
				width: "110",
				height: "36",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "225",
				y: "47",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "65000 1 2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "170",
				y: "76",
				width: "110",
				height: "36",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "225",
				y: "99",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "80 90 2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M280 42 H340",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "340",
				y: "28",
				width: "196",
				height: "80",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "438",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "local pref first"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "438",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "then AS-path · not hops"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "138",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the longer rumor can still win"
			})
		]
	}),
	"net-peer-transit": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Peering exchanges customers; transit sells the rest",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "28",
				width: "140",
				height: "56",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "110",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "peer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "210",
				y: "28",
				width: "140",
				height: "56",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "you"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "380",
				y: "28",
				width: "140",
				height: "56",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "450",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "transit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M180 56 H210",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M350 56 H380",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "195",
				y: "112",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.7",
				children: "customers only"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "365",
				y: "112",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.7",
				children: "everyone else · paid"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "144",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "settlement-free is not a default route"
			})
		]
	}),
	"net-leak": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "A more-specific unauthorized prefix steals traffic",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "36",
				width: "150",
				height: "64",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "103",
				y: "64",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "owner"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "103",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "203.0.113.0/24"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "206",
				y: "36",
				width: "148",
				height: "64",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "64",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "hijack"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "203.0.113.0/25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M354 68 H412",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "412",
				y: "44",
				width: "120",
				height: "48",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "472",
				y: "73",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "traffic"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "more specific wins · ownership is not checked"
			})
		]
	}),
	"net-planes": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Control plane fills the table the data plane looks up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "220",
				height: "80",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "60",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "control plane"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "routing fills the table"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M256 68 H316",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "316",
				y: "28",
				width: "208",
				height: "80",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "60",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "data plane"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "82",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "lookup · next hop"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "134",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the process can die · the last table still forwards"
			})
		]
	}),
	"cmp-pipeline": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Front end pipeline from characters to a typed tree",
		children: [[
			"characters",
			"tokens",
			"tree",
			"names · types"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${18 + i * 136}, 32)`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "124",
					height: "52",
					rx: "8",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "62",
					y: "32",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "13",
					children: label
				}),
				i < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M128 26 H134",
					stroke: "currentColor",
					strokeOpacity: "0.45"
				})
			]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "118",
			textAnchor: "middle",
			fill: "currentColor",
			fillOpacity: "0.55",
			fontSize: "12",
			children: "later stages consume the tree · they do not start from bytes"
		})]
	}),
	"cmp-tokens": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Characters become classified tokens",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "90",
				y: "36",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.65",
				children: "i f   x = 1 4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M90 48 V72",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "76",
				width: "70",
				height: "36",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "59",
				y: "98",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "if"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "106",
				y: "76",
				width: "70",
				height: "36",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "141",
				y: "98",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "id x"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "188",
				y: "76",
				width: "52",
				height: "36",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "214",
				y: "98",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "="
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "252",
				y: "76",
				width: "78",
				height: "36",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "291",
				y: "98",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "int 14"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "138",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "class plus payload · the parser never re-reads the digits"
			})
		]
	}),
	"cmp-ast-drop": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Parse tree keeps punctuation the AST drops",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "24",
				width: "240",
				height: "96",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "144",
				y: "52",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "parse tree"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "144",
				y: "76",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.65",
				children: "( · + · ) kept"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M264 72 H316",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "316",
				y: "24",
				width: "220",
				height: "96",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "426",
				y: "52",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "AST"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "426",
				y: "76",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.65",
				children: "plus(x, 1)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "146",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "typechecking walks the meaning, not the parentheses"
			})
		]
	}),
	"cmp-cfg-blocks": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Basic blocks and the edges between them",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "16",
				width: "160",
				height: "40",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "42",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "entry · t1 = a + b"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M280 56 V72",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "40",
				y: "76",
				width: "180",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "130",
				y: "104",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "then · t2 = t1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "340",
				y: "76",
				width: "180",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "430",
				y: "104",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "else · t3 = 0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M220 98 H340",
				stroke: "currentColor",
				strokeOpacity: "0.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M130 120 V140 H430 V120",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "162",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "one entry · one exit · edges carry the joins"
			})
		]
	}),
	"cmp-ssa-phi": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "A phi merges two SSA names at a join",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "20",
				width: "150",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "111",
				y: "48",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "x1 = 1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "374",
				y: "20",
				width: "150",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "449",
				y: "48",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "x2 = 2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M111 64 V92 H280",
				stroke: "currentColor",
				strokeOpacity: "0.45",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M449 64 V92 H280",
				stroke: "currentColor",
				strokeOpacity: "0.45",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "190",
				y: "92",
				width: "180",
				height: "44",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "120",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "x3 = φ(x1, x2)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "158",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "one name per assignment · the join records the choice"
			})
		]
	}),
	"cmp-dataflow": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "A dataflow fact walks the graph until it settles",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "28",
				width: "140",
				height: "56",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "98",
				y: "52",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "block"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "98",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "in / gen / kill"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M168 56 H228",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "228",
				y: "28",
				width: "140",
				height: "56",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "298",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "out"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M368 56 H428",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "428",
				y: "28",
				width: "108",
				height: "56",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "482",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "next"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "122",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "repeat until the fact stops changing"
			})
		]
	}),
	"cmp-isel-tile": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "An IR operator becomes target opcodes",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "32",
				width: "180",
				height: "64",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "126",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "t = a + b"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M216 64 H276",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "276",
				y: "20",
				width: "248",
				height: "88",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "400",
				y: "52",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "leaq (%rax,%rbx), %rcx"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "400",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.65",
				children: "or add + mov"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "134",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "several legal tiles · one cheaper on this machine"
			})
		]
	}),
	"cmp-alloc-color": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Interfering live ranges cannot share a register",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "140",
				cy: "70",
				r: "36",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "140",
				y: "74",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "t1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "280",
				cy: "70",
				r: "36",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "74",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "t2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "420",
				cy: "70",
				r: "36",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "420",
				y: "74",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "t3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M176 70 H244",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M316 70 H384",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "an edge means they are live together · different colors"
			})
		]
	}),
	"cmp-frame-abi": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "A stack frame the callee and unwinder can both read",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "180",
				y: "16",
				width: "200",
				height: "28",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "35",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "incoming args"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "180",
				y: "48",
				width: "200",
				height: "28",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "67",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "return address"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "180",
				y: "80",
				width: "200",
				height: "28",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "99",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "saved rbp"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "180",
				y: "112",
				width: "200",
				height: "28",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "131",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "spills · locals"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "160",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "prologue builds it · epilogue tears it down"
			})
		]
	}),
	"cmp-gc-roots": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "GC walks from roots to find live objects",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "36",
				width: "120",
				height: "52",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "88",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "roots"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M148 62 H200",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "24",
				width: "140",
				height: "40",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "270",
				y: "49",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "live"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "76",
				width: "140",
				height: "40",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "270",
				y: "101",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "live"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "388",
				y: "50",
				width: "140",
				height: "40",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "458",
				y: "75",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.7",
				children: "unreachable"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "144",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "no matching free · liveness is reachability from roots"
			})
		]
	}),
	"ml-learn-loop": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Examples in, a rule out, then a held-out check",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "20",
				y: "28",
				width: "120",
				height: "52",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "80",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "examples"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M140 54 H188",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "188",
				y: "28",
				width: "120",
				height: "52",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "248",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "a rule"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M308 54 H356",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "356",
				y: "28",
				width: "180",
				height: "52",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "446",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "unseen rows"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "118",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the job is the new row · a recited table is storage"
			})
		]
	}),
	"horo-power-flow": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Train drives the hands; escapement regulates the train",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "16",
				y: "18",
				width: "96",
				height: "40",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "64",
				y: "43",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "spring"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M112 38 H132",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "132",
				y: "18",
				width: "96",
				height: "40",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "180",
				y: "43",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "train"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M228 38 H248",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "248",
				y: "18",
				width: "120",
				height: "40",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "308",
				y: "43",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "motion works"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M368 38 H388",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "388",
				y: "18",
				width: "156",
				height: "40",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "466",
				y: "43",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "hands"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M180 58 V88",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "132",
				y: "88",
				width: "96",
				height: "36",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "180",
				y: "111",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "escape"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M228 106 H248",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "248",
				y: "88",
				width: "160",
				height: "36",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "328",
				y: "111",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "oscillator"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "154",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the train drives the display · the oscillator regulates the train"
			})
		]
	}),
	"horo-parts": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Plate and bridges locate wheels, pinions, jewels",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "20",
				width: "488",
				height: "88",
				rx: "10",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "42",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.65",
				children: "plate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "70",
				y: "52",
				width: "110",
				height: "40",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "125",
				y: "76",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "bridge"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "210",
				y: "52",
				width: "110",
				height: "40",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "265",
				y: "76",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "wheel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "350",
				y: "52",
				width: "70",
				height: "40",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "385",
				y: "76",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "pinion"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "460",
				cy: "72",
				r: "16",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "460",
				y: "76",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "jewel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "140",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the frame locates every pivot · names come before complications"
			})
		]
	}),
	"mus-dimensions": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Pitch, duration, loudness, and timbre as independent axes",
		children: [[
			"pitch",
			"duration",
			"loudness",
			"timbre"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${24 + i * 132}, 36)`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "118",
				height: "48",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "59",
				y: "30",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: label
			})]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "122",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "change one axis · the other three can stay put"
		})]
	}),
	"mus-interval-ratio": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Octave 2:1 and fifth 3:2 as frequency ratios",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "220",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "octave 2:1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.6",
				children: "same letter · new register"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "304",
				y: "28",
				width: "220",
				height: "72",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "414",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "fifth 3:2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "414",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.6",
				children: "beats slow when just"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "count the ratio · equal temperament is a later compromise"
			})
		]
	}),
	"dm-lineage-soil": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Hardcore and thrash as soil under death metal",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "24",
				width: "150",
				height: "52",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "111",
				y: "54",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "hardcore"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "206",
				y: "24",
				width: "150",
				height: "52",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "281",
				y: "54",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "thrash"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M111 76 V100 H281 V76",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "160",
				y: "100",
				width: "240",
				height: "28",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "119",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "weight takes the job speed had"
			})
		]
	}),
	"dm-listen-layers": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Riff, kit, and vocal as equal listening layers",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "48",
				y: "20",
				width: "464",
				height: "32",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "41",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "riff cell"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "48",
				y: "60",
				width: "464",
				height: "32",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "81",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "kit grammar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "48",
				y: "100",
				width: "464",
				height: "32",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "121",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "vocal as rhythm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "150",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the mix is an argument · none of the three is decoration"
			})
		]
	}),
	"ml-gd-steps": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Gradient descent steps opposite the slope",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M40 40 Q280 20 520 120",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "160",
				cy: "36",
				r: "6",
				fill: "currentColor",
				fillOpacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "260",
				cy: "48",
				r: "6",
				fill: "currentColor",
				fillOpacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "360",
				cy: "76",
				r: "6",
				fill: "currentColor",
				fillOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M166 40 L250 50",
				stroke: "currentColor",
				strokeOpacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M266 52 L352 74",
				stroke: "currentColor",
				strokeOpacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "136",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "step opposite the gradient of a loss you can compute"
			})
		]
	}),
	"ml-splits": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Train, validation, and test keep three jobs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "28",
				width: "160",
				height: "56",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "104",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "train · fit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "28",
				width: "160",
				height: "56",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "val · choose"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "376",
				y: "28",
				width: "160",
				height: "56",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "456",
				y: "62",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "test · report"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "118",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "mixing the three jobs is the original sin"
			})
		]
	}),
	"ml-backprop-graph": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Forward values then reverse adjoints",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "24",
				width: "120",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "84",
				y: "51",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "x"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "180",
				y: "24",
				width: "120",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "240",
				y: "51",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "Wx"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "336",
				y: "24",
				width: "120",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "396",
				y: "51",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "loss"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M144 46 H180",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M300 46 H336",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M396 68 V96 H84 V68",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "forward values · reverse adjoints · one loss, many knobs"
			})
		]
	}),
	"ml-qkv": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Query scores keys and mixes values",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "28",
				width: "90",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "69",
				y: "55",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "Q"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "150",
				y: "28",
				width: "90",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "195",
				y: "55",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "K"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "276",
				y: "28",
				width: "120",
				height: "44",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "336",
				y: "55",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "softmax scores"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "432",
				y: "28",
				width: "90",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "477",
				y: "55",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "V"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "118",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "a weighted read · not a hard address"
			})
		]
	}),
	"ml-causal-mask": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 160",
		className: svg,
		"aria-label": "Causal mask hides future keys",
		children: [[
			"t1",
			"t2",
			"t3",
			"t4"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: 90 + i * 110,
			y: "28",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.6",
			children: label
		}), [
			0,
			1,
			2,
			3
		].map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: 60 + i * 110,
			y: 40 + j * 24,
			width: "60",
			height: "20",
			rx: "3",
			fill: j > i ? "none" : "currentColor",
			fillOpacity: j > i ? 0 : .12,
			stroke: "currentColor",
			strokeOpacity: j > i ? .2 : .45
		}, `${i}-${j}`))] }, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "152",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "future keys are zero · that is the autoregressive contract"
		})]
	}),
	"ml-transformer-block": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 170",
		className: svg,
		"aria-label": "Transformer block with residual and norm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "12",
				width: "160",
				height: "32",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "33",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "attn"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "56",
				width: "160",
				height: "32",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "77",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "+ residual · norm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "100",
				width: "160",
				height: "32",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "121",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "FFN + residual · norm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "158",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the skip is the path that keeps a gradient"
			})
		]
	}),
	"ml-kv-cache": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "KV cache appends past keys and values",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "220",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "past K · V"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.6",
				children: "unchanged"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "304",
				y: "28",
				width: "220",
				height: "72",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "414",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "new query"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "414",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.6",
				children: "append, do not recompute"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "causal generation makes history reusable"
			})
		]
	}),
	"ml-rag-path": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Retrieve then condition the model",
		children: [[
			"query",
			"retrieve",
			"condition",
			"decode"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${18 + i * 136}, 32)`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "124",
					height: "52",
					rx: "8",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "62",
					y: "32",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "13",
					children: label
				}),
				i < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M128 26 H134",
					stroke: "currentColor",
					strokeOpacity: "0.45"
				})
			]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "118",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "the host fetches · the model still only continues tokens"
		})]
	}),
	"horo-train": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Going train from barrel to escape",
		children: [[
			"barrel",
			"centre",
			"third",
			"fourth",
			"escape"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${16 + i * 108}, 36)`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "44",
					cy: "26",
					r: "22",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "44",
					y: "30",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "11",
					children: label
				}),
				i < 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M68 26 H84",
					stroke: "currentColor",
					strokeOpacity: "0.4"
				})
			]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "118",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "the train counts · it does not meter a second"
		})]
	}),
	"horo-escape-cycle": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Lock, unlock, impulse, lock",
		children: [[
			"lock",
			"unlock",
			"impulse",
			"lock"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${24 + i * 132}, 36)`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "118",
				height: "48",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "59",
				y: "30",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: label
			})]
		}, `${label}-${i}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "122",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "each unlock spends one tooth · the impulse keeps the oscillator alive"
		})]
	}),
	"horo-chrono-couple": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Chronograph coupling the seconds runner",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "180",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "126",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "going train"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "344",
				y: "28",
				width: "180",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "434",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "chrono runner"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "220",
				y: "44",
				width: "120",
				height: "40",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "69",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "clutch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "start couples · stop uncouples · reset hammers the heart"
			})
		]
	}),
	"mus-meter-grid": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "A 4/4 grid versus a displaced accent",
		children: [[
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: 40 + i * 60,
			y: "36",
			width: "44",
			height: "36",
			rx: "4",
			fill: i === 0 || i === 4 ? "currentColor" : "none",
			fillOpacity: i === 0 || i === 4 ? .12 : 0,
			stroke: "currentColor",
			strokeOpacity: "0.4"
		}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "110",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "the bar is a grouping · an accent can sit off the printed 1"
		})]
	}),
	"mus-voice-lead": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Common tone held while neighbors move",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "80",
				y: "40",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.65",
				children: "C"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "80",
				y: "80",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.65",
				children: "E"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "80",
				y: "120",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.65",
				children: "G"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M100 36 H240",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M100 76 H240 L260 100",
				stroke: "currentColor",
				strokeOpacity: "0.45",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M100 116 H240 L260 92",
				stroke: "currentColor",
				strokeOpacity: "0.45",
				fill: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "40",
				fill: "currentColor",
				fontSize: "12",
				children: "C"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "104",
				fill: "currentColor",
				fontSize: "12",
				children: "F"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "88",
				fill: "currentColor",
				fontSize: "12",
				children: "A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "400",
				y: "80",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "hold · step · step"
			})
		]
	}),
	"dm-riff-cell": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "A short cell sequenced and inverted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "36",
				width: "140",
				height: "48",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "98",
				y: "65",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "cell"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "204",
				y: "36",
				width: "140",
				height: "48",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "274",
				y: "65",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "sequence"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "380",
				y: "36",
				width: "140",
				height: "48",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "450",
				y: "65",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "invert"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "118",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "form starts at the cell · not at a chorus chart"
			})
		]
	}),
	"dm-two-factories": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Two founding production doctrines",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "220",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "dry · articulate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.6",
				children: "pick attack kept"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "304",
				y: "28",
				width: "220",
				height: "72",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "414",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "midrange wall"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "414",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.6",
				children: "cells smear"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "two factories · one later name"
			})
		]
	}),
	"ml-bias-var": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Bias misses the signal, variance chases noise",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "220",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "bias"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.6",
				children: "room too small"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "304",
				y: "28",
				width: "220",
				height: "72",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "414",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "variance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "414",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.6",
				children: "room fits the noise"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "both errors are about the room · not a moral"
			})
		]
	}),
	"ml-decision-boundary": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "A linear score cuts the plane",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "140",
				cy: "48",
				r: "8",
				fill: "currentColor",
				fillOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "180",
				cy: "72",
				r: "8",
				fill: "currentColor",
				fillOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "120",
				cy: "96",
				r: "8",
				fill: "currentColor",
				fillOpacity: "0.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "400",
				cy: "44",
				r: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "430",
				cy: "80",
				r: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "380",
				cy: "108",
				r: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M250 20 L310 130",
				stroke: "currentColor",
				strokeOpacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "142",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the score is a cut · a sigmoid only names the sides"
			})
		]
	}),
	"ml-neuron": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Weighted sum, bias, nonlinearity",
		children: [[
			"x",
			"w·x+b",
			"σ"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${40 + i * 170}, 32)`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "140",
					height: "52",
					rx: "8",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "70",
					y: "32",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "14",
					children: label
				}),
				i < 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M144 26 H166",
					stroke: "currentColor",
					strokeOpacity: "0.45"
				})
			]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "118",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "without σ this is still a line"
		})]
	}),
	"ml-mlp-forward": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Layered map from input to scores",
		children: [[
			"x",
			"h1",
			"h2",
			"ŷ"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${36 + i * 130}, 36)`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "104",
					height: "48",
					rx: "8",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "52",
					y: "30",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "14",
					children: label
				}),
				i < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M108 24 H126",
					stroke: "currentColor",
					strokeOpacity: "0.45"
				})
			]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "122",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "each layer is a map · the stack is the function"
		})]
	}),
	"ml-cnn-share": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "One filter reused across positions",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "32",
				width: "280",
				height: "64",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "56",
				y: "44",
				width: "52",
				height: "40",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "150",
				y: "44",
				width: "52",
				height: "40",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "244",
				y: "44",
				width: "52",
				height: "40",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "360",
				y: "32",
				width: "164",
				height: "64",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "442",
				y: "70",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "same W"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "128",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "translation reuse is the inductive bet"
			})
		]
	}),
	"ml-rnn-unroll": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "A recurrent cell unrolled in time",
		children: [[
			"t1",
			"t2",
			"t3"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${48 + i * 160}, 28)`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "120",
					height: "56",
					rx: "8",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "60",
					y: "34",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "14",
					children: label
				}),
				i < 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M124 28 H156",
					stroke: "currentColor",
					strokeOpacity: "0.45"
				})
			]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "122",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "one cell · many times · the state is the only memory"
		})]
	}),
	"ml-vanish": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "A product of small slopes dies out",
		children: [[
			"0.4",
			"0.3",
			"0.2",
			"~0"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${28 + i * 132}, 36)`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "112",
				height: "44",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: .45 - i * .08
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "56",
				y: "28",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "14",
				fillOpacity: 1 - i * .18,
				children: label
			})]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "118",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "a chain of tiny derivatives never reaches the early weights"
		})]
	}),
	"horo-keyless": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Stem positions select winding or setting",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "150",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "111",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "stem in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "206",
				y: "28",
				width: "148",
				height: "72",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "68",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "clutch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "374",
				y: "28",
				width: "150",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "449",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "wind / set"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "449",
				y: "78",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				fillOpacity: "0.6",
				children: "two jobs, one stem"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "pull height chooses the train the square drives"
			})
		]
	}),
	"horo-lever": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Escape wheel, pallet, impulse pin",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "120",
				cy: "70",
				r: "36",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "120",
				y: "74",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "wheel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "200",
				y: "46",
				width: "140",
				height: "48",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "270",
				y: "75",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "pallet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "430",
				cy: "70",
				r: "36",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "430",
				y: "74",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "pin"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "lock · unlock · impulse · the lever is the translator"
			})
		]
	}),
	"horo-balance-spring": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Balance wheel and hairspring as the timebase",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "180",
				cy: "68",
				r: "42",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "180",
				cy: "68",
				r: "18",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "180",
				y: "72",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "balance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M230 68 H310",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "310",
				y: "44",
				width: "180",
				height: "48",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "400",
				y: "73",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "hairspring"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "period lives here · the train only counts swings"
			})
		]
	}),
	"horo-positions": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Dial up, pendant positions, and rate",
		children: [[
			"DU",
			"DD",
			"PU",
			"PR"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${40 + i * 130}, 32)`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "108",
				height: "56",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "54",
				y: "34",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "14",
				children: label
			})]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "122",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "gravity loads the pivots differently · poise is the argument"
		})]
	}),
	"horo-tourbillon-cage": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Escapement rotating inside a cage",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "200",
				cy: "70",
				r: "48",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "200",
				cy: "70",
				r: "22",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "200",
				y: "74",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "11",
				children: "escape"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "300",
				y: "42",
				width: "200",
				height: "56",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "400",
				y: "75",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "rotating cage"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "averages pendant error · not a free lunch on amplitude"
			})
		]
	}),
	"horo-date-works": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Cannon pinion to date jumper",
		children: [[
			"cannon",
			"date wheel",
			"jumper"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${28 + i * 180}, 32)`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "156",
					height: "52",
					rx: "8",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "78",
					y: "32",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "13",
					children: label
				}),
				i < 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M160 26 H176",
					stroke: "currentColor",
					strokeOpacity: "0.45"
				})
			]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "118",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "midnight is a stored snap · not a smooth 24-hour crawl unless designed so"
		})]
	}),
	"mus-scale-steps": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Whole and half steps in a scale",
		children: [[
			"W",
			"W",
			"H",
			"W",
			"W",
			"W",
			"H"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${28 + i * 74}, 36)`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "62",
				height: "44",
				rx: "6",
				fill: label === "H" ? "currentColor" : "none",
				fillOpacity: label === "H" ? .12 : 0,
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "31",
				y: "28",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "14",
				children: label
			})]
		}, `${label}-${i}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "114",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "the pattern of steps is the scale · the tonic is where you sit"
		})]
	}),
	"mus-modes-tonic": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Same collection, different tonic",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "220",
				height: "72",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "same pitch set"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "146",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.6",
				children: "C D E F G A B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "304",
				y: "28",
				width: "220",
				height: "72",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "414",
				y: "58",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "new home"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "414",
				y: "80",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.6",
				children: "Dorian sits on D"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "mode is a tonic claim · not a new alphabet"
			})
		]
	}),
	"mus-triad-stack": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Root, third, and fifth stacked",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "160",
				y: "48",
				fill: "currentColor",
				fontSize: "16",
				children: "5th"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "160",
				y: "84",
				fill: "currentColor",
				fontSize: "16",
				children: "3rd"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "160",
				y: "120",
				fill: "currentColor",
				fontSize: "16",
				children: "root"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M220 44 H340",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M220 80 H340",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M220 116 H340",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "400",
				y: "84",
				fill: "currentColor",
				fontSize: "13",
				fillOpacity: "0.6",
				children: "quality lives in the third"
			})
		]
	}),
	"mus-pedal": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "A held bass under changing chords",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "72",
				width: "488",
				height: "20",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "87",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "pedal"
			}),
			[
				"I",
				"♭II",
				"iv",
				"I"
			].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: `translate(${56 + i * 120}, 24)`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "88",
					height: "32",
					rx: "6",
					fill: "none",
					stroke: "currentColor",
					strokeOpacity: "0.4"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "44",
					y: "22",
					textAnchor: "middle",
					fill: "currentColor",
					fontSize: "13",
					children: label
				})]
			}, label)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "124",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the floor stays · the room above can wander"
			})
		]
	}),
	"mus-odd-grid": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "7/8 as 2+2+3",
		children: [[
			2,
			2,
			3
		].map((n, g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
			transform: `translate(${40 + (g === 0 ? 0 : g === 1 ? 150 : 300)}, 32)`,
			children: Array.from({ length: n }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: i * 44,
				y: "8",
				width: "36",
				height: "40",
				rx: "4",
				fill: i === 0 ? "currentColor" : "none",
				fillOpacity: i === 0 ? .12 : 0,
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}, i))
		}, g)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "114",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "odd meter is additive grouping · not a broken 4"
		})]
	}),
	"mus-polymeter": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "A 3-cycle against a 4-cycle",
		children: [
			[
				0,
				1,
				2,
				3
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 48 + i * 120,
				y: "28",
				width: "88",
				height: "28",
				rx: "4",
				fill: i === 0 ? "currentColor" : "none",
				fillOpacity: i === 0 ? .12 : 0,
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}, `a-${i}`)),
			[
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 48 + i * 160,
				y: "72",
				width: "140",
				height: "28",
				rx: "4",
				fill: i === 0 ? "currentColor" : "none",
				fillOpacity: i === 0 ? .12 : 0,
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}, `b-${i}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "two meters share a pulse · they realign after the product"
			})
		]
	}),
	"mus-riff-cell-harm": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "A riff cell with a harmonic job",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "32",
				width: "160",
				height: "52",
				rx: "8",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "116",
				y: "63",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "cell"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "220",
				y: "32",
				width: "140",
				height: "52",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "290",
				y: "63",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "interval"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "384",
				y: "32",
				width: "140",
				height: "52",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "454",
				y: "63",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "function"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "118",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "the riff is a harmonic claim · not only a rhythm"
			})
		]
	}),
	"dm-branch-map": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Lineage splitting into stylistic branches",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "52",
				width: "120",
				height: "40",
				rx: "6",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "84",
				y: "77",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				children: "soil"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M144 72 H190",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}),
			[
				"brutal",
				"tech",
				"melodic"
			].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: `translate(200, ${16 + i * 40})`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M0 20 H36",
						stroke: "currentColor",
						strokeOpacity: "0.35"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "36",
						y: "4",
						width: "140",
						height: "32",
						rx: "6",
						fill: "none",
						stroke: "currentColor",
						strokeOpacity: "0.4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "106",
						y: "25",
						textAnchor: "middle",
						fill: "currentColor",
						fontSize: "12",
						children: label
					})
				]
			}, label)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "460",
				y: "80",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "doctrine, not a ranking"
			})
		]
	}),
	"dm-form": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Riff cells assembled into a form",
		children: [[
			"A",
			"A′",
			"B",
			"A"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${32 + i * 130}, 32)`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "112",
				height: "48",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "56",
				y: "30",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "16",
				children: label
			})]
		}, `${label}-${i}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "114",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "form is how cells return · not a chorus by default"
		})]
	}),
	"dm-displace": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "The same cell starting off the one",
		children: [
			[
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 40 + i * 60,
				y: "32",
				width: "44",
				height: "32",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.3"
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "160",
				y: "32",
				width: "164",
				height: "32",
				rx: "4",
				fill: "currentColor",
				fillOpacity: "0.12",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "104",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "same cell · later start · the bar line did not move"
			})
		]
	}),
	"dm-phrase-group": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 140",
		className: svg,
		"aria-label": "Odd phrase lengths against a 4-bar grid",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "28",
				width: "300",
				height: "36",
				rx: "6",
				fill: "currentColor",
				fillOpacity: "0.1",
				stroke: "currentColor",
				strokeOpacity: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "186",
				y: "52",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: "5-bar phrase"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "76",
				width: "488",
				height: "20",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "122",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "grouping can refuse the printed four"
			})
		]
	}),
	"dm-poly-riff": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Guitar cell against a blast grid",
		children: [
			[
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 40 + i * 160,
				y: "28",
				width: "140",
				height: "28",
				rx: "4",
				fill: i === 0 ? "currentColor" : "none",
				fillOpacity: i === 0 ? .12 : 0,
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}, `g-${i}`)),
			[
				0,
				1,
				2,
				3
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 40 + i * 120,
				y: "72",
				width: "100",
				height: "28",
				rx: "4",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.4"
			}, `d-${i}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "280",
				y: "132",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "12",
				fillOpacity: "0.55",
				children: "guitar cycle vs drum grid · they share a pulse, not a bar"
			})
		]
	}),
	"dm-arrange": /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 560 150",
		className: svg,
		"aria-label": "Density, contrast, and return in an arrangement",
		children: [[
			"enter",
			"stack",
			"cut",
			"return"
		].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: `translate(${24 + i * 132}, 36)`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "118",
				height: "48",
				rx: "8",
				fill: "none",
				stroke: "currentColor",
				strokeOpacity: "0.35"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "59",
				y: "30",
				textAnchor: "middle",
				fill: "currentColor",
				fontSize: "13",
				children: label
			})]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "280",
			y: "122",
			textAnchor: "middle",
			fill: "currentColor",
			fontSize: "12",
			fillOpacity: "0.55",
			children: "arrangement is when density changes · not when a solo starts"
		})]
	})
};
var SUPPORTED_PRACTICE_SCHEMA_VERSIONS = [1];
var PRACTICE_QUERY_PARAM = "practice";
var DAU_PRACTICE_RESULT_TYPE = "dau:practice-result";
var SOURCE_APP_DAU = "dead-air-university";
function ok(data) {
	return {
		ok: true,
		data
	};
}
function err(code, message) {
	return {
		ok: false,
		code,
		message
	};
}
function isSupportedSchemaVersion(version) {
	return version === 1;
}
function peekSchemaVersion(value) {
	if (value && typeof value === "object" && "schemaVersion" in value) return value.schemaVersion;
}
function versionGate(value) {
	const version = peekSchemaVersion(value);
	if (version === void 0) return null;
	if (!isSupportedSchemaVersion(version)) return err("unsupported-version", `Unsupported practice schemaVersion ${String(version)}. Supported: ${SUPPORTED_PRACTICE_SCHEMA_VERSIONS.join(", ")}.`);
	return null;
}
function formatZodError(error) {
	const first = error.issues[0];
	return `${first?.path?.length ? first.path.join(".") : "root"}: ${first?.message ?? "invalid"}`;
}
var jsonRecordSchema = record(string(), unknown());
var practiceRequestSchema = strictObject({
	schemaVersion: literal(1),
	sourceApp: string().min(1).default(SOURCE_APP_DAU),
	labId: string().min(1),
	conceptId: string().min(1),
	lessonId: string().min(1),
	practiceType: string().min(1),
	goal: string().min(1),
	initialState: jsonRecordSchema.optional(),
	parameters: jsonRecordSchema.optional(),
	allowedTools: array(string().min(1)).optional(),
	constraints: jsonRecordSchema.optional(),
	completionCriteria: jsonRecordSchema.optional()
});
function parsePracticeRequest(value) {
	const gated = versionGate(value);
	if (gated) return gated;
	const parsed = practiceRequestSchema.safeParse(value);
	if (!parsed.success) return err("invalid", formatZodError(parsed.error));
	return ok(parsed.data);
}
var primitiveMeta = union([
	string(),
	number(),
	boolean(),
	_null()
]);
strictObject({
	schemaVersion: literal(1),
	labId: string().min(1),
	conceptId: string().min(1),
	lessonId: string().min(1),
	completed: boolean(),
	attempts: number().int().nonnegative(),
	timeSpentMs: number().int().nonnegative(),
	selfRating: number().int().min(1).max(5).optional(),
	metadata: record(string().max(64), primitiveMeta).optional()
});
function matchPracticeResult(result, expected) {
	if (expected.labId && result.labId !== expected.labId) return err("mismatch", `Result labId ${result.labId} does not match expected ${expected.labId}.`);
	if (expected.conceptId && result.conceptId !== expected.conceptId) return err("mismatch", `Result conceptId ${result.conceptId} does not match expected ${expected.conceptId}.`);
	if (expected.lessonId && result.lessonId !== expected.lessonId) return err("mismatch", `Result lessonId ${result.lessonId} does not match expected ${expected.lessonId}.`);
	return ok(result);
}
function encodeJsonUrlSafe(value) {
	const json = JSON.stringify(value);
	const bytes = new TextEncoder().encode(json);
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function appendPracticeQuery(baseUrl, encoded) {
	const hashIndex = baseUrl.indexOf("#");
	const withoutHash = hashIndex >= 0 ? baseUrl.slice(0, hashIndex) : baseUrl;
	const hash = hashIndex >= 0 ? baseUrl.slice(hashIndex) : "";
	return `${withoutHash}${withoutHash.includes("?") ? "&" : "?"}${PRACTICE_QUERY_PARAM}=${encoded}${hash}`;
}
var LABS = [
	{
		labId: "chudbox",
		name: "Chudbox",
		description: "Interactive rhythm, riff, bass and drum construction.",
		status: "implemented-external",
		supportedSubjects: ["music-theory", "death-metal"],
		supportedCourseIds: [
			"mus-foundations",
			"mus-harmony",
			"mus-heavy",
			"dm-history",
			"dm-construction",
			"dm-advanced"
		],
		conceptPatterns: ["mus-*", "dm-*"],
		capabilities: [
			"rhythm",
			"riff",
			"bass",
			"drums",
			"pattern",
			"swing",
			"mutation"
		],
		launchType: "external-url",
		launchUrl: "http://localhost:8080/",
		schemaVersions: [1]
	},
	{
		labId: "movement-bench",
		name: "Movement Bench",
		description: "Interactive gear trains, escapements, regulation and complications.",
		status: "implemented-external",
		supportedSubjects: ["horology"],
		supportedCourseIds: [
			"horo-foundations",
			"horo-regulation",
			"horo-complications"
		],
		conceptPatterns: ["horo-*"],
		capabilities: [
			"movement",
			"gear-train",
			"escapement",
			"regulation"
		],
		launchType: "external-url",
		launchUrl: "http://localhost:8091/",
		schemaVersions: [1]
	},
	{
		labId: "fab-lab",
		name: "Fab Lab",
		description: "Interactive litho math, yield economics and process sequencing.",
		status: "implemented-external",
		supportedSubjects: ["semiconductors"],
		supportedCourseIds: [
			"semi-process",
			"semi-litho",
			"semi-leading"
		],
		conceptPatterns: ["semi-*"],
		capabilities: [
			"process",
			"lithography",
			"wafer"
		],
		launchType: "external-url",
		launchUrl: "http://localhost:8092/",
		schemaVersions: [1]
	},
	{
		labId: "compiler-workbench",
		name: "Compiler Workbench",
		description: "Tokens, trees, transformations and the road to machine code.",
		status: "implemented-external",
		supportedSubjects: ["compilers"],
		supportedCourseIds: [
			"cmp-frontend",
			"cmp-ir",
			"cmp-backend"
		],
		conceptPatterns: ["cmp-*"],
		capabilities: [
			"tokens",
			"ast",
			"ir",
			"optimisation",
			"codegen"
		],
		launchType: "external-url",
		launchUrl: "http://localhost:8094/",
		schemaVersions: [1]
	},
	{
		labId: "packet-lab",
		name: "Packet Lab",
		description: "Wrap headers, step handshakes, ride congestion windows, match prefixes.",
		status: "implemented-external",
		supportedSubjects: ["networking"],
		supportedCourseIds: [
			"net-foundations",
			"net-transport",
			"net-internet"
		],
		conceptPatterns: ["net-*"],
		capabilities: [
			"packets",
			"protocols",
			"topology",
			"routing"
		],
		launchType: "external-url",
		launchUrl: "http://localhost:8095/",
		schemaVersions: [1]
	},
	{
		labId: "os-lab",
		name: "OS Lab",
		description: "Schedule threads, dodge deadlocks, walk page faults, survive crashes.",
		status: "implemented-external",
		supportedSubjects: ["operating-systems"],
		supportedCourseIds: [
			"os-foundations",
			"os-concurrency",
			"os-storage"
		],
		conceptPatterns: ["os-*"],
		capabilities: [
			"scheduling",
			"concurrency",
			"virtual-memory",
			"storage"
		],
		launchType: "external-url",
		launchUrl: "http://localhost:8096/",
		schemaVersions: [1]
	},
	{
		labId: "ml-lab",
		name: "ML Lab",
		description: "Ride gradients, catch overfitting, look inside attention.",
		status: "implemented-external",
		supportedSubjects: ["machine-learning"],
		supportedCourseIds: [
			"ml-foundations",
			"ml-neural",
			"ml-transformers"
		],
		conceptPatterns: ["ml-*"],
		capabilities: [
			"gradient-descent",
			"neural-nets",
			"transformers",
			"evaluation"
		],
		launchType: "external-url",
		launchUrl: "http://localhost:8097/",
		schemaVersions: [1]
	},
	{
		labId: "pipeline-playground",
		name: "Pipeline Playground",
		description: "Step a pipeline, predict misses, schedule out of order, guess branches.",
		status: "implemented-external",
		supportedSubjects: ["cpu"],
		supportedCourseIds: [
			"cpu-foundations",
			"cpu-microarch",
			"arch-gpu"
		],
		conceptPatterns: [
			"cpu-*",
			"arch-*",
			"gpu-*"
		],
		capabilities: [
			"pipeline",
			"hazards",
			"scheduling",
			"caches",
			"simt"
		],
		launchType: "external-url",
		launchUrl: "http://localhost:8093/",
		schemaVersions: [1]
	}
];
var LAB_MAP = Object.fromEntries(LABS.map((lab) => [lab.labId, lab]));
function getLab(labId) {
	return LAB_MAP[labId];
}
function canLaunchLab(labId) {
	const lab = getLab(labId);
	if (!lab) return false;
	return lab.status === "available" || lab.status === "implemented-external";
}
function matchesConceptPattern(conceptId, pattern) {
	if (pattern.endsWith("*")) return conceptId.startsWith(pattern.slice(0, -1));
	if (pattern.startsWith("*")) return conceptId.endsWith(pattern.slice(1));
	return conceptId === pattern;
}
function getCompatibleLabs(courseId, conceptId) {
	return LABS.filter((lab) => {
		if (lab.status === "disabled") return false;
		if (lab.supportedCourseIds.includes(courseId)) return true;
		return Boolean(lab.conceptPatterns?.some((pattern) => matchesConceptPattern(conceptId, pattern)));
	});
}
var CHUDBOX_LAB_ID = "chudbox";
/**
* DAU id conventions chudbox enforces (see its DAU_INTEGRATION.md): concepts are
* `mus-*`/`dm-*`, lessons are `{conceptId}-{5|10|20|30}`.
*/
var DAU_CONCEPT_ID_RE$1 = /^(mus|dm)-[a-z0-9]+(?:-[a-z0-9]+)*$/;
var DAU_LESSON_ID_RE$1 = /^(mus|dm)-[a-z0-9]+(?:-[a-z0-9]+)*-(5|10|20|30)$/;
object({
	schemaVersion: number(),
	sourceApp: string().min(1).optional(),
	conceptId: string().min(1),
	lessonId: string().min(1),
	practiceType: string().min(1),
	goal: string().min(1),
	tempo: number().optional(),
	patternLength: number().int().positive().optional(),
	allowedTools: array(string()).optional(),
	constraints: record(string(), unknown()).optional(),
	completionCriteria: record(string(), unknown()).optional()
});
var chudboxPracticeResultSchema = object({
	conceptId: string().min(1),
	lessonId: string().min(1),
	completed: boolean(),
	attempts: number().int().nonnegative(),
	timeSpentMs: number().int().nonnegative(),
	selfRating: number().int().min(1).max(5).optional()
});
function numberParam(parameters, key) {
	const value = parameters?.[key];
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function toChudboxPayload(request) {
	const tempo = numberParam(request.parameters, "tempo");
	const patternLength = numberParam(request.parameters, "patternLength");
	return {
		schemaVersion: request.schemaVersion,
		sourceApp: "dau",
		conceptId: request.conceptId,
		lessonId: request.lessonId,
		practiceType: request.practiceType,
		goal: request.goal,
		...tempo != null ? { tempo } : {},
		...patternLength != null ? { patternLength } : {},
		...request.allowedTools ? { allowedTools: request.allowedTools } : {},
		...request.constraints ? { constraints: request.constraints } : {},
		...request.completionCriteria ? { completionCriteria: request.completionCriteria } : {}
	};
}
function encodeChudboxPracticeQuery(input) {
	const request = parsePracticeRequest(input);
	if (!request.ok) return request;
	if (request.data.labId !== "chudbox") return err("invalid", `Chudbox adapter received labId ${request.data.labId}.`);
	const validationError = validateChudboxBounds(request.data);
	if (validationError) return validationError;
	return ok(encodeJsonUrlSafe(toChudboxPayload(request.data)));
}
/**
* Pre-flight checks mirroring chudbox's published payload bounds so hosts get
* a precise error at launch time instead of a rejection inside the lab.
*/
function validateChudboxBounds(request) {
	if (!DAU_CONCEPT_ID_RE$1.test(request.conceptId)) return err("invalid", `Chudbox conceptId must be a mus-* or dm-* id, got ${request.conceptId}.`);
	if (!DAU_LESSON_ID_RE$1.test(request.lessonId) || !request.lessonId.startsWith(`${request.conceptId}-`)) return err("invalid", `Chudbox lessonId must be {conceptId}-{5|10|20|30}, got ${request.lessonId}.`);
	if (!request.allowedTools || request.allowedTools.length === 0) return err("invalid", "Chudbox requires at least one allowedTools entry.");
	const goal = request.goal.trim();
	if (goal.length < 8 || goal.length > 240) return err("invalid", `Chudbox goal must be 8-240 characters after trimming.`);
	const patternLength = numberParam(request.parameters, "patternLength");
	if (patternLength != null && (!Number.isInteger(patternLength) || patternLength < 4 || patternLength > 32)) return err("invalid", `Chudbox patternLength must be an integer between 4 and 32.`);
	const tempo = numberParam(request.parameters, "tempo");
	if (tempo != null && (!Number.isInteger(tempo) || tempo < 80 || tempo > 240)) return err("invalid", `Chudbox tempo must be an integer between 80 and 240.`);
	return null;
}
function buildChudboxLaunchUrl(baseUrl, input) {
	const encoded = encodeChudboxPracticeQuery(input);
	if (!encoded.ok) return encoded;
	return ok(appendPracticeQuery(baseUrl, encoded.data));
}
function fromChudboxResult(raw) {
	const parsed = chudboxPracticeResultSchema.safeParse(raw);
	if (!parsed.success) return err("invalid", formatZodError(parsed.error));
	return ok({
		schemaVersion: 1,
		labId: CHUDBOX_LAB_ID,
		conceptId: parsed.data.conceptId,
		lessonId: parsed.data.lessonId,
		completed: parsed.data.completed,
		attempts: parsed.data.attempts,
		timeSpentMs: parsed.data.timeSpentMs,
		...parsed.data.selfRating != null ? { selfRating: parsed.data.selfRating } : {}
	});
}
function adaptChudboxResultMessage(data, expected = {}) {
	if (!data || typeof data !== "object" || !("type" in data)) return err("malformed", "Message is not a Chudbox practice-result envelope.");
	if (data.type !== "chudbox:practice-result") return err("malformed", "Message type is not chudbox:practice-result.");
	const adapted = fromChudboxResult(data.result);
	if (!adapted.ok) return adapted;
	const matched = matchPracticeResult(adapted.data, {
		labId: CHUDBOX_LAB_ID,
		...expected
	});
	if (!matched.ok) return matched;
	return ok({
		type: DAU_PRACTICE_RESULT_TYPE,
		result: matched.data,
		adaptedFrom: "chudbox"
	});
}
var MOVEMENT_BENCH_LAB_ID = "movement-bench";
var DAU_CONCEPT_ID_RE = /^horo-[a-z0-9]+(?:-[a-z0-9]+)*$/;
var DAU_LESSON_ID_RE = /^horo-[a-z0-9]+(?:-[a-z0-9]+)*-(5|10|20|30)$/;
var MOVEMENT_BENCH_PRACTICE_TYPES = [
	"train-math",
	"regulate",
	"escapement",
	"identify",
	"complication",
	"free"
];
object({
	schemaVersion: number(),
	sourceApp: string().min(1).optional(),
	conceptId: string().min(1),
	lessonId: string().min(1),
	practiceType: _enum(MOVEMENT_BENCH_PRACTICE_TYPES),
	goal: string().min(1),
	parameters: record(string(), unknown()).optional()
});
var movementBenchResultSchema = object({
	conceptId: string().min(1),
	lessonId: string().min(1),
	completed: boolean(),
	attempts: number().int().nonnegative(),
	timeSpentMs: number().int().nonnegative(),
	selfRating: number().int().min(1).max(3).optional()
});
function toMovementBenchPayload(request) {
	return {
		schemaVersion: request.schemaVersion,
		sourceApp: "dau",
		conceptId: request.conceptId,
		lessonId: request.lessonId,
		practiceType: request.practiceType,
		goal: request.goal,
		...request.parameters ? { parameters: request.parameters } : {}
	};
}
/**
* Pre-flight checks mirroring movement-bench's published payload bounds so
* hosts get a precise error at launch time instead of a rejection inside the lab.
*/
function validateMovementBenchBounds(request) {
	if (!DAU_CONCEPT_ID_RE.test(request.conceptId)) return err("invalid", `Movement Bench conceptId must be a horo-* id, got ${request.conceptId}.`);
	if (!DAU_LESSON_ID_RE.test(request.lessonId) || !request.lessonId.startsWith(`${request.conceptId}-`)) return err("invalid", `Movement Bench lessonId must be {conceptId}-{5|10|20|30}, got ${request.lessonId}.`);
	if (!MOVEMENT_BENCH_PRACTICE_TYPES.includes(request.practiceType)) return err("invalid", `Movement Bench practiceType must be one of ${MOVEMENT_BENCH_PRACTICE_TYPES.join(", ")}, got ${request.practiceType}.`);
	const goal = request.goal.trim();
	if (goal.length < 8 || goal.length > 240) return err("invalid", `Movement Bench goal must be 8-240 characters after trimming.`);
	return null;
}
function encodeMovementBenchPracticeQuery(input) {
	const request = parsePracticeRequest(input);
	if (!request.ok) return request;
	if (request.data.labId !== "movement-bench") return err("invalid", `Movement Bench adapter received labId ${request.data.labId}.`);
	const validationError = validateMovementBenchBounds(request.data);
	if (validationError) return validationError;
	return ok(encodeJsonUrlSafe(toMovementBenchPayload(request.data)));
}
function buildMovementBenchLaunchUrl(baseUrl, input) {
	const encoded = encodeMovementBenchPracticeQuery(input);
	if (!encoded.ok) return encoded;
	return ok(appendPracticeQuery(baseUrl, encoded.data));
}
function fromMovementBenchResult(raw) {
	const parsed = movementBenchResultSchema.safeParse(raw);
	if (!parsed.success) return err("invalid", formatZodError(parsed.error));
	return ok({
		schemaVersion: 1,
		labId: MOVEMENT_BENCH_LAB_ID,
		conceptId: parsed.data.conceptId,
		lessonId: parsed.data.lessonId,
		completed: parsed.data.completed,
		attempts: parsed.data.attempts,
		timeSpentMs: parsed.data.timeSpentMs,
		...parsed.data.selfRating != null ? { selfRating: parsed.data.selfRating } : {}
	});
}
function adaptMovementBenchResultMessage(data, expected = {}) {
	if (!data || typeof data !== "object" || !("type" in data)) return err("malformed", "Message is not a Movement Bench practice-result envelope.");
	if (data.type !== "movement-bench:practice-result") return err("malformed", "Message type is not movement-bench:practice-result.");
	const adapted = fromMovementBenchResult(data.result);
	if (!adapted.ok) return adapted;
	const matched = matchPracticeResult(adapted.data, {
		labId: MOVEMENT_BENCH_LAB_ID,
		...expected
	});
	if (!matched.ok) return matched;
	return ok({
		type: DAU_PRACTICE_RESULT_TYPE,
		result: matched.data,
		adaptedFrom: "movement-bench"
	});
}
var FAB_LAB_ID = "fab-lab";
var SEMI_CONCEPT_ID_RE = /^semi-[a-z0-9]+(?:-[a-z0-9]+)*$/;
var SEMI_LESSON_ID_RE = /^semi-[a-z0-9]+(?:-[a-z0-9]+)*-(5|10|20|30)$/;
var FAB_PRACTICE_TYPES = [
	"rayleigh",
	"yield",
	"sequence",
	"identify",
	"free"
];
object({
	schemaVersion: number(),
	sourceApp: string().min(1).optional(),
	conceptId: string().min(1),
	lessonId: string().min(1),
	practiceType: _enum(FAB_PRACTICE_TYPES),
	goal: string().min(1),
	parameters: record(string(), unknown()).optional()
});
var fabResultSchema = object({
	conceptId: string().min(1),
	lessonId: string().min(1),
	completed: boolean(),
	attempts: number().int().nonnegative(),
	timeSpentMs: number().int().nonnegative(),
	selfRating: number().int().min(1).max(3).optional()
});
function toFabPayload(request) {
	return {
		schemaVersion: request.schemaVersion,
		sourceApp: "dau",
		conceptId: request.conceptId,
		lessonId: request.lessonId,
		practiceType: request.practiceType,
		goal: request.goal,
		...request.parameters ? { parameters: request.parameters } : {}
	};
}
/**
* Pre-flight checks mirroring fab-lab's published payload bounds so hosts get
* a precise error at launch time instead of a rejection inside the lab.
*/
function validateFabBounds(request) {
	if (!SEMI_CONCEPT_ID_RE.test(request.conceptId)) return err("invalid", `Fab Lab conceptId must be a semi-* id, got ${request.conceptId}.`);
	if (!SEMI_LESSON_ID_RE.test(request.lessonId) || !request.lessonId.startsWith(`${request.conceptId}-`)) return err("invalid", `Fab Lab lessonId must be {conceptId}-{5|10|20|30}, got ${request.lessonId}.`);
	if (!FAB_PRACTICE_TYPES.includes(request.practiceType)) return err("invalid", `Fab Lab practiceType must be one of ${FAB_PRACTICE_TYPES.join(", ")}, got ${request.practiceType}.`);
	const goal = request.goal.trim();
	if (goal.length < 8 || goal.length > 240) return err("invalid", `Fab Lab goal must be 8-240 characters after trimming.`);
	return null;
}
function encodeFabPracticeQuery(input) {
	const request = parsePracticeRequest(input);
	if (!request.ok) return request;
	if (request.data.labId !== "fab-lab") return err("invalid", `Fab Lab adapter received labId ${request.data.labId}.`);
	const validationError = validateFabBounds(request.data);
	if (validationError) return validationError;
	return ok(encodeJsonUrlSafe(toFabPayload(request.data)));
}
function buildFabLaunchUrl(baseUrl, input) {
	const encoded = encodeFabPracticeQuery(input);
	if (!encoded.ok) return encoded;
	return ok(appendPracticeQuery(baseUrl, encoded.data));
}
function fromFabResult(raw) {
	const parsed = fabResultSchema.safeParse(raw);
	if (!parsed.success) return err("invalid", formatZodError(parsed.error));
	return ok({
		schemaVersion: 1,
		labId: FAB_LAB_ID,
		conceptId: parsed.data.conceptId,
		lessonId: parsed.data.lessonId,
		completed: parsed.data.completed,
		attempts: parsed.data.attempts,
		timeSpentMs: parsed.data.timeSpentMs,
		...parsed.data.selfRating != null ? { selfRating: parsed.data.selfRating } : {}
	});
}
function adaptFabResultMessage(data, expected = {}) {
	if (!data || typeof data !== "object" || !("type" in data)) return err("malformed", "Message is not a Fab Lab practice-result envelope.");
	if (data.type !== "fab-lab:practice-result") return err("malformed", "Message type is not fab-lab:practice-result.");
	const adapted = fromFabResult(data.result);
	if (!adapted.ok) return adapted;
	const matched = matchPracticeResult(adapted.data, {
		labId: FAB_LAB_ID,
		...expected
	});
	if (!matched.ok) return matched;
	return ok({
		type: DAU_PRACTICE_RESULT_TYPE,
		result: matched.data,
		adaptedFrom: "fab-lab"
	});
}
var PIPELINE_LAB_ID = "pipeline-playground";
var PP_CONCEPT_ID_RE = /^(cpu|gpu|arch)-[a-z0-9]+(?:-[a-z0-9]+)*$/;
var PP_LESSON_ID_RE = /^(cpu|gpu|arch)-[a-z0-9]+(?:-[a-z0-9]+)*-(5|10|20|30)$/;
var PIPELINE_PRACTICE_TYPES = [
	"pipeline",
	"cache",
	"schedule",
	"predictor",
	"scenarios",
	"free"
];
object({
	schemaVersion: number(),
	sourceApp: string().min(1).optional(),
	conceptId: string().min(1),
	lessonId: string().min(1),
	practiceType: _enum(PIPELINE_PRACTICE_TYPES),
	goal: string().min(1),
	parameters: record(string(), unknown()).optional()
});
var pipelineResultSchema = object({
	conceptId: string().min(1),
	lessonId: string().min(1),
	completed: boolean(),
	attempts: number().int().nonnegative(),
	timeSpentMs: number().int().nonnegative(),
	selfRating: number().int().min(1).max(3).optional()
});
function toPipelinePayload(request) {
	return {
		schemaVersion: request.schemaVersion,
		sourceApp: "dau",
		conceptId: request.conceptId,
		lessonId: request.lessonId,
		practiceType: request.practiceType,
		goal: request.goal,
		...request.parameters ? { parameters: request.parameters } : {}
	};
}
function validatePipelineBounds(request) {
	if (!PP_CONCEPT_ID_RE.test(request.conceptId)) return err("invalid", `Pipeline Playground conceptId must be a cpu-*/gpu-*/arch-* id, got ${request.conceptId}.`);
	if (!PP_LESSON_ID_RE.test(request.lessonId) || !request.lessonId.startsWith(`${request.conceptId}-`)) return err("invalid", `Pipeline Playground lessonId must be {conceptId}-{5|10|20|30}, got ${request.lessonId}.`);
	if (!PIPELINE_PRACTICE_TYPES.includes(request.practiceType)) return err("invalid", `Pipeline Playground practiceType must be one of ${PIPELINE_PRACTICE_TYPES.join(", ")}, got ${request.practiceType}.`);
	const goal = request.goal.trim();
	if (goal.length < 8 || goal.length > 240) return err("invalid", `Pipeline Playground goal must be 8-240 characters after trimming.`);
	return null;
}
function encodePipelinePracticeQuery(input) {
	const request = parsePracticeRequest(input);
	if (!request.ok) return request;
	if (request.data.labId !== "pipeline-playground") return err("invalid", `Pipeline Playground adapter received labId ${request.data.labId}.`);
	const validationError = validatePipelineBounds(request.data);
	if (validationError) return validationError;
	return ok(encodeJsonUrlSafe(toPipelinePayload(request.data)));
}
function buildPipelineLaunchUrl(baseUrl, input) {
	const encoded = encodePipelinePracticeQuery(input);
	if (!encoded.ok) return encoded;
	return ok(appendPracticeQuery(baseUrl, encoded.data));
}
function fromPipelineResult(raw) {
	const parsed = pipelineResultSchema.safeParse(raw);
	if (!parsed.success) return err("invalid", formatZodError(parsed.error));
	return ok({
		schemaVersion: 1,
		labId: PIPELINE_LAB_ID,
		conceptId: parsed.data.conceptId,
		lessonId: parsed.data.lessonId,
		completed: parsed.data.completed,
		attempts: parsed.data.attempts,
		timeSpentMs: parsed.data.timeSpentMs,
		...parsed.data.selfRating != null ? { selfRating: parsed.data.selfRating } : {}
	});
}
function adaptPipelineResultMessage(data, expected = {}) {
	if (!data || typeof data !== "object" || !("type" in data)) return err("malformed", "Message is not a Pipeline Playground practice-result envelope.");
	if (data.type !== "pipeline-playground:practice-result") return err("malformed", "Message type is not pipeline-playground:practice-result.");
	const adapted = fromPipelineResult(data.result);
	if (!adapted.ok) return adapted;
	const matched = matchPracticeResult(adapted.data, {
		labId: PIPELINE_LAB_ID,
		...expected
	});
	if (!matched.ok) return matched;
	return ok({
		type: DAU_PRACTICE_RESULT_TYPE,
		result: matched.data,
		adaptedFrom: "pipeline-playground"
	});
}
var COMPILER_WORKBENCH_ID = "compiler-workbench";
var CMP_CONCEPT_ID_RE = /^cmp-[a-z0-9]+(?:-[a-z0-9]+)*$/;
var CMP_LESSON_ID_RE = /^cmp-[a-z0-9]+(?:-[a-z0-9]+)*-(5|10|20|30)$/;
var CW_PRACTICE_TYPES = [
	"tokenize",
	"parse",
	"optimize",
	"dataflow",
	"backend",
	"free"
];
object({
	schemaVersion: number(),
	sourceApp: string().min(1).optional(),
	conceptId: string().min(1),
	lessonId: string().min(1),
	practiceType: _enum(CW_PRACTICE_TYPES),
	goal: string().min(1),
	parameters: record(string(), unknown()).optional()
});
var cwResultSchema = object({
	conceptId: string().min(1),
	lessonId: string().min(1),
	completed: boolean(),
	attempts: number().int().nonnegative(),
	timeSpentMs: number().int().nonnegative(),
	selfRating: number().int().min(1).max(3).optional()
});
function toCompilerWorkbenchPayload(request) {
	return {
		schemaVersion: request.schemaVersion,
		sourceApp: "dau",
		conceptId: request.conceptId,
		lessonId: request.lessonId,
		practiceType: request.practiceType,
		goal: request.goal,
		...request.parameters ? { parameters: request.parameters } : {}
	};
}
/**
* Pre-flight checks mirroring compiler-workbench's published payload bounds so hosts get
* a precise error at launch time instead of a rejection inside the lab.
*/
function validateCwBounds(request) {
	if (!CMP_CONCEPT_ID_RE.test(request.conceptId)) return err("invalid", `Compiler Workbench conceptId must be a cmp-* id, got ${request.conceptId}.`);
	if (!CMP_LESSON_ID_RE.test(request.lessonId) || !request.lessonId.startsWith(`${request.conceptId}-`)) return err("invalid", `Compiler Workbench lessonId must be {conceptId}-{5|10|20|30}, got ${request.lessonId}.`);
	if (!CW_PRACTICE_TYPES.includes(request.practiceType)) return err("invalid", `Compiler Workbench practiceType must be one of ${CW_PRACTICE_TYPES.join(", ")}, got ${request.practiceType}.`);
	const goal = request.goal.trim();
	if (goal.length < 8 || goal.length > 240) return err("invalid", `Compiler Workbench goal must be 8-240 characters after trimming.`);
	return null;
}
function encodeCwPracticeQuery(input) {
	const request = parsePracticeRequest(input);
	if (!request.ok) return request;
	if (request.data.labId !== "compiler-workbench") return err("invalid", `Compiler Workbench adapter received labId ${request.data.labId}.`);
	const validationError = validateCwBounds(request.data);
	if (validationError) return validationError;
	return ok(encodeJsonUrlSafe(toCompilerWorkbenchPayload(request.data)));
}
function buildCwLaunchUrl(baseUrl, input) {
	const encoded = encodeCwPracticeQuery(input);
	if (!encoded.ok) return encoded;
	return ok(appendPracticeQuery(baseUrl, encoded.data));
}
function fromCompilerWorkbenchResult(raw) {
	const parsed = cwResultSchema.safeParse(raw);
	if (!parsed.success) return err("invalid", formatZodError(parsed.error));
	return ok({
		schemaVersion: 1,
		labId: COMPILER_WORKBENCH_ID,
		conceptId: parsed.data.conceptId,
		lessonId: parsed.data.lessonId,
		completed: parsed.data.completed,
		attempts: parsed.data.attempts,
		timeSpentMs: parsed.data.timeSpentMs,
		...parsed.data.selfRating != null ? { selfRating: parsed.data.selfRating } : {}
	});
}
function adaptCompilerWorkbenchResultMessage(data, expected = {}) {
	if (!data || typeof data !== "object" || !("type" in data)) return err("malformed", "Message is not a Compiler Workbench practice-result envelope.");
	if (data.type !== "compiler-workbench:practice-result") return err("malformed", "Message type is not compiler-workbench:practice-result.");
	const adapted = fromCompilerWorkbenchResult(data.result);
	if (!adapted.ok) return adapted;
	const matched = matchPracticeResult(adapted.data, {
		labId: COMPILER_WORKBENCH_ID,
		...expected
	});
	if (!matched.ok) return matched;
	return ok({
		type: DAU_PRACTICE_RESULT_TYPE,
		result: matched.data,
		adaptedFrom: "compiler-workbench"
	});
}
var PACKET_LAB_ID = "packet-lab";
var NET_CONCEPT_ID_RE = /^net-[a-z0-9]+(?:-[a-z0-9]+)*$/;
var NET_LESSON_ID_RE = /^net-[a-z0-9]+(?:-[a-z0-9]+)*-(5|10|20|30)$/;
var PL_PRACTICE_TYPES = [
	"encapsulate",
	"handshake",
	"congestion",
	"routing",
	"scenarios",
	"free"
];
object({
	schemaVersion: number(),
	sourceApp: string().min(1).optional(),
	conceptId: string().min(1),
	lessonId: string().min(1),
	practiceType: _enum(PL_PRACTICE_TYPES),
	goal: string().min(1),
	parameters: record(string(), unknown()).optional()
});
var plResultSchema = object({
	conceptId: string().min(1),
	lessonId: string().min(1),
	completed: boolean(),
	attempts: number().int().nonnegative(),
	timeSpentMs: number().int().nonnegative(),
	selfRating: number().int().min(1).max(3).optional()
});
function toPacketLabPayload(request) {
	return {
		schemaVersion: request.schemaVersion,
		sourceApp: "dau",
		conceptId: request.conceptId,
		lessonId: request.lessonId,
		practiceType: request.practiceType,
		goal: request.goal,
		...request.parameters ? { parameters: request.parameters } : {}
	};
}
/**
* Pre-flight checks mirroring packet-lab's published payload bounds so hosts get
* a precise error at launch time instead of a rejection inside the lab.
*/
function validatePlBounds(request) {
	if (!NET_CONCEPT_ID_RE.test(request.conceptId)) return err("invalid", `Packet Lab conceptId must be a net-* id, got ${request.conceptId}.`);
	if (!NET_LESSON_ID_RE.test(request.lessonId) || !request.lessonId.startsWith(`${request.conceptId}-`)) return err("invalid", `Packet Lab lessonId must be {conceptId}-{5|10|20|30}, got ${request.lessonId}.`);
	if (!PL_PRACTICE_TYPES.includes(request.practiceType)) return err("invalid", `Packet Lab practiceType must be one of ${PL_PRACTICE_TYPES.join(", ")}, got ${request.practiceType}.`);
	const goal = request.goal.trim();
	if (goal.length < 8 || goal.length > 240) return err("invalid", `Packet Lab goal must be 8-240 characters after trimming.`);
	return null;
}
function encodePlPracticeQuery(input) {
	const request = parsePracticeRequest(input);
	if (!request.ok) return request;
	if (request.data.labId !== "packet-lab") return err("invalid", `Packet Lab adapter received labId ${request.data.labId}.`);
	const validationError = validatePlBounds(request.data);
	if (validationError) return validationError;
	return ok(encodeJsonUrlSafe(toPacketLabPayload(request.data)));
}
function buildPlLaunchUrl(baseUrl, input) {
	const encoded = encodePlPracticeQuery(input);
	if (!encoded.ok) return encoded;
	return ok(appendPracticeQuery(baseUrl, encoded.data));
}
function fromPacketLabResult(raw) {
	const parsed = plResultSchema.safeParse(raw);
	if (!parsed.success) return err("invalid", formatZodError(parsed.error));
	return ok({
		schemaVersion: 1,
		labId: PACKET_LAB_ID,
		conceptId: parsed.data.conceptId,
		lessonId: parsed.data.lessonId,
		completed: parsed.data.completed,
		attempts: parsed.data.attempts,
		timeSpentMs: parsed.data.timeSpentMs,
		...parsed.data.selfRating != null ? { selfRating: parsed.data.selfRating } : {}
	});
}
function adaptPacketLabResultMessage(data, expected = {}) {
	if (!data || typeof data !== "object" || !("type" in data)) return err("malformed", "Message is not a Packet Lab practice-result envelope.");
	if (data.type !== "packet-lab:practice-result") return err("malformed", "Message type is not packet-lab:practice-result.");
	const adapted = fromPacketLabResult(data.result);
	if (!adapted.ok) return adapted;
	const matched = matchPracticeResult(adapted.data, {
		labId: PACKET_LAB_ID,
		...expected
	});
	if (!matched.ok) return matched;
	return ok({
		type: DAU_PRACTICE_RESULT_TYPE,
		result: matched.data,
		adaptedFrom: "packet-lab"
	});
}
var OS_LAB_ID = "os-lab";
var OS_CONCEPT_ID_RE = /^os-[a-z0-9]+(?:-[a-z0-9]+)*$/;
var OS_LESSON_ID_RE = /^os-[a-z0-9]+(?:-[a-z0-9]+)*-(5|10|20|30)$/;
var OS_PRACTICE_TYPES = [
	"scheduler",
	"sync",
	"vm",
	"storage",
	"scenarios",
	"free"
];
object({
	schemaVersion: number(),
	sourceApp: string().min(1).optional(),
	conceptId: string().min(1),
	lessonId: string().min(1),
	practiceType: _enum(OS_PRACTICE_TYPES),
	goal: string().min(1),
	parameters: record(string(), unknown()).optional()
});
var osResultSchema = object({
	conceptId: string().min(1),
	lessonId: string().min(1),
	completed: boolean(),
	attempts: number().int().nonnegative(),
	timeSpentMs: number().int().nonnegative(),
	selfRating: number().int().min(1).max(3).optional()
});
function toOsPayload(request) {
	return {
		schemaVersion: request.schemaVersion,
		sourceApp: "dau",
		conceptId: request.conceptId,
		lessonId: request.lessonId,
		practiceType: request.practiceType,
		goal: request.goal,
		...request.parameters ? { parameters: request.parameters } : {}
	};
}
/**
* Pre-flight checks mirroring os-lab's published payload bounds so hosts get
* a precise error at launch time instead of a rejection inside the lab.
*/
function validateOsBounds(request) {
	if (!OS_CONCEPT_ID_RE.test(request.conceptId)) return err("invalid", `Os conceptId must be a os-* id, got ${request.conceptId}.`);
	if (!OS_LESSON_ID_RE.test(request.lessonId) || !request.lessonId.startsWith(`${request.conceptId}-`)) return err("invalid", `Os lessonId must be {conceptId}-{5|10|20|30}, got ${request.lessonId}.`);
	if (!OS_PRACTICE_TYPES.includes(request.practiceType)) return err("invalid", `Os practiceType must be one of ${OS_PRACTICE_TYPES.join(", ")}, got ${request.practiceType}.`);
	const goal = request.goal.trim();
	if (goal.length < 8 || goal.length > 240) return err("invalid", `Os goal must be 8-240 characters after trimming.`);
	return null;
}
function encodeOsPracticeQuery(input) {
	const request = parsePracticeRequest(input);
	if (!request.ok) return request;
	if (request.data.labId !== "os-lab") return err("invalid", `Os adapter received labId ${request.data.labId}.`);
	const validationError = validateOsBounds(request.data);
	if (validationError) return validationError;
	return ok(encodeJsonUrlSafe(toOsPayload(request.data)));
}
function buildOsLaunchUrl(baseUrl, input) {
	const encoded = encodeOsPracticeQuery(input);
	if (!encoded.ok) return encoded;
	return ok(appendPracticeQuery(baseUrl, encoded.data));
}
function fromOsResult(raw) {
	const parsed = osResultSchema.safeParse(raw);
	if (!parsed.success) return err("invalid", formatZodError(parsed.error));
	return ok({
		schemaVersion: 1,
		labId: OS_LAB_ID,
		conceptId: parsed.data.conceptId,
		lessonId: parsed.data.lessonId,
		completed: parsed.data.completed,
		attempts: parsed.data.attempts,
		timeSpentMs: parsed.data.timeSpentMs,
		...parsed.data.selfRating != null ? { selfRating: parsed.data.selfRating } : {}
	});
}
function adaptOsResultMessage(data, expected = {}) {
	if (!data || typeof data !== "object" || !("type" in data)) return err("malformed", "Message is not a Os practice-result envelope.");
	if (data.type !== "os-lab:practice-result") return err("malformed", "Message type is not os-lab:practice-result.");
	const adapted = fromOsResult(data.result);
	if (!adapted.ok) return adapted;
	const matched = matchPracticeResult(adapted.data, {
		labId: OS_LAB_ID,
		...expected
	});
	if (!matched.ok) return matched;
	return ok({
		type: DAU_PRACTICE_RESULT_TYPE,
		result: matched.data,
		adaptedFrom: "os-lab"
	});
}
var ML_LAB_ID = "ml-lab";
var ML_CONCEPT_ID_RE = /^ml-[a-z0-9]+(?:-[a-z0-9]+)*$/;
var ML_LESSON_ID_RE = /^ml-[a-z0-9]+(?:-[a-z0-9]+)*-(5|10|20|30)$/;
var ML_PRACTICE_TYPES = [
	"gradient",
	"traineval",
	"neuron",
	"attention",
	"scenarios",
	"free"
];
object({
	schemaVersion: number(),
	sourceApp: string().min(1).optional(),
	conceptId: string().min(1),
	lessonId: string().min(1),
	practiceType: _enum(ML_PRACTICE_TYPES),
	goal: string().min(1),
	parameters: record(string(), unknown()).optional()
});
var mlResultSchema = object({
	conceptId: string().min(1),
	lessonId: string().min(1),
	completed: boolean(),
	attempts: number().int().nonnegative(),
	timeSpentMs: number().int().nonnegative(),
	selfRating: number().int().min(1).max(3).optional()
});
function toMlPayload(request) {
	return {
		schemaVersion: request.schemaVersion,
		sourceApp: "dau",
		conceptId: request.conceptId,
		lessonId: request.lessonId,
		practiceType: request.practiceType,
		goal: request.goal,
		...request.parameters ? { parameters: request.parameters } : {}
	};
}
/**
* Pre-flight checks mirroring ml-lab's published payload bounds so hosts get
* a precise error at launch time instead of a rejection inside the lab.
*/
function validateMlBounds(request) {
	if (!ML_CONCEPT_ID_RE.test(request.conceptId)) return err("invalid", `Ml conceptId must be a ml-* id, got ${request.conceptId}.`);
	if (!ML_LESSON_ID_RE.test(request.lessonId) || !request.lessonId.startsWith(`${request.conceptId}-`)) return err("invalid", `Ml lessonId must be {conceptId}-{5|10|20|30}, got ${request.lessonId}.`);
	if (!ML_PRACTICE_TYPES.includes(request.practiceType)) return err("invalid", `Ml practiceType must be one of ${ML_PRACTICE_TYPES.join(", ")}, got ${request.practiceType}.`);
	const goal = request.goal.trim();
	if (goal.length < 8 || goal.length > 240) return err("invalid", `Ml goal must be 8-240 characters after trimming.`);
	return null;
}
function encodeMlPracticeQuery(input) {
	const request = parsePracticeRequest(input);
	if (!request.ok) return request;
	if (request.data.labId !== "ml-lab") return err("invalid", `Ml adapter received labId ${request.data.labId}.`);
	const validationError = validateMlBounds(request.data);
	if (validationError) return validationError;
	return ok(encodeJsonUrlSafe(toMlPayload(request.data)));
}
function buildMlLaunchUrl(baseUrl, input) {
	const encoded = encodeMlPracticeQuery(input);
	if (!encoded.ok) return encoded;
	return ok(appendPracticeQuery(baseUrl, encoded.data));
}
function fromMlResult(raw) {
	const parsed = mlResultSchema.safeParse(raw);
	if (!parsed.success) return err("invalid", formatZodError(parsed.error));
	return ok({
		schemaVersion: 1,
		labId: ML_LAB_ID,
		conceptId: parsed.data.conceptId,
		lessonId: parsed.data.lessonId,
		completed: parsed.data.completed,
		attempts: parsed.data.attempts,
		timeSpentMs: parsed.data.timeSpentMs,
		...parsed.data.selfRating != null ? { selfRating: parsed.data.selfRating } : {}
	});
}
function adaptMlResultMessage(data, expected = {}) {
	if (!data || typeof data !== "object" || !("type" in data)) return err("malformed", "Message is not a Ml practice-result envelope.");
	if (data.type !== "ml-lab:practice-result") return err("malformed", "Message type is not ml-lab:practice-result.");
	const adapted = fromMlResult(data.result);
	if (!adapted.ok) return adapted;
	const matched = matchPracticeResult(adapted.data, {
		labId: ML_LAB_ID,
		...expected
	});
	if (!matched.ok) return matched;
	return ok({
		type: DAU_PRACTICE_RESULT_TYPE,
		result: matched.data,
		adaptedFrom: "ml-lab"
	});
}
var RIFF_TOOLS = [
	"play",
	"steps",
	"pitch",
	"lanes",
	"mute",
	"solo",
	"voices",
	"ab",
	"copyAB",
	"mutate.rotate",
	"mutate.mirror",
	"mutate.sparse"
];
var GRID_TOOLS = [
	"play",
	"steps",
	"lanes",
	"mute",
	"solo",
	"tempo"
];
var DRUM_TOOLS = [
	"play",
	"steps",
	"lanes",
	"mute",
	"solo",
	"drums.feel",
	"kick.sixteenths"
];
var GROUP_TOOLS = [
	...GRID_TOOLS,
	"group",
	"length"
];
var GROOVE_TOOLS = [
	"play",
	"steps",
	"pitch",
	"lanes",
	"mute",
	"solo",
	"voices",
	"swing",
	"tempo",
	"presets"
];
var FREE_TOOLS = ["play"];
var RIFF_VOICES = {
	riff: "chug",
	kick: "deep"
};
var KIT_VOICES = {
	kick: "click",
	snare: "sharp",
	hat: "closed"
};
function spec(partial) {
	return {
		tempo: 120,
		patternLength: 16,
		lanes: ["riff", "kick"],
		startEmpty: true,
		minHits: 4,
		requirePlay: false,
		allowedTools: RIFF_TOOLS,
		...partial
	};
}
var MODULE_BY_TYPE = {
	"riff-cell": spec({
		practiceType: "riff-cell",
		voices: RIFF_VOICES
	}),
	"rhythm-grid": spec({
		practiceType: "rhythm-grid",
		lanes: [
			"kick",
			"snare",
			"hat"
		],
		voices: KIT_VOICES,
		minHits: 8,
		allowedTools: GRID_TOOLS
	}),
	groove: spec({
		practiceType: "groove",
		seedPreset: "stomp",
		startEmpty: false,
		minHits: 0,
		requirePlay: true,
		allowedTools: GROOVE_TOOLS
	}),
	"drum-feel": spec({
		practiceType: "drum-feel",
		lanes: [
			"kick",
			"snare",
			"hat"
		],
		voices: KIT_VOICES,
		minHits: 8,
		allowedTools: DRUM_TOOLS
	}),
	grouping: spec({
		practiceType: "grouping",
		lanes: [
			"kick",
			"snare",
			"hat"
		],
		voices: KIT_VOICES,
		patternLength: 12,
		groups: [
			3,
			3,
			2
		],
		minHits: 6,
		allowedTools: GROUP_TOOLS
	}),
	free: spec({
		practiceType: "free",
		startEmpty: false,
		minHits: 0,
		requirePlay: false,
		allowedTools: FREE_TOOLS
	})
};
/** Concepts whose id would otherwise fall into the wrong bucket. */
var CONCEPT_OVERRIDES = {
	"dm-blast": spec({
		practiceType: "drum-feel",
		seedDrumFeel: "blast",
		tempo: 180,
		minHits: 12
	}),
	"dm-blast-types": spec({
		practiceType: "drum-feel",
		seedDrumFeel: "blast",
		tempo: 170,
		minHits: 12
	}),
	"dm-double-kick": spec({
		practiceType: "drum-feel",
		seedDrumFeel: "hammer",
		tempo: 160,
		minHits: 12
	}),
	"dm-double-kick-hist": spec({
		practiceType: "drum-feel",
		seedDrumFeel: "hammer",
		tempo: 150,
		minHits: 8
	}),
	"dm-drum-comp": spec({
		practiceType: "drum-feel",
		seedDrumFeel: "half-time",
		tempo: 120,
		minHits: 8
	}),
	"dm-dm-displacement": spec({
		practiceType: "rhythm-grid",
		lanes: [
			"kick",
			"snare",
			"hat"
		],
		voices: KIT_VOICES,
		minHits: 8,
		allowedTools: GRID_TOOLS
	}),
	"dm-odd-meter": spec({
		practiceType: "grouping",
		patternLength: 10,
		groups: [
			3,
			3,
			2,
			2
		],
		tempo: 130
	}),
	"dm-polymeter-dm": spec({
		practiceType: "grouping",
		patternLength: 12,
		groups: [
			3,
			3,
			2
		],
		tempo: 130
	}),
	"dm-polyrhythm-dm": spec({
		practiceType: "grouping",
		patternLength: 12,
		groups: [3, 2],
		tempo: 120
	}),
	"dm-metric-mod": spec({
		practiceType: "grouping",
		patternLength: 16,
		groups: [
			4,
			3,
			3,
			2,
			2,
			2
		],
		tempo: 120
	}),
	"mus-odd-meter": spec({
		practiceType: "grouping",
		patternLength: 7,
		groups: [
			3,
			2,
			2
		],
		tempo: 110
	}),
	"mus-polymeter": spec({
		practiceType: "grouping",
		patternLength: 12,
		groups: [
			3,
			3,
			2
		],
		tempo: 110
	}),
	"mus-hemiola": spec({
		practiceType: "grouping",
		patternLength: 12,
		groups: [3, 3],
		tempo: 100
	}),
	"mus-polyrhythm-intro": spec({
		practiceType: "grouping",
		patternLength: 12,
		groups: [3, 2],
		tempo: 100
	}),
	"dm-pick-hand": spec({
		practiceType: "riff-cell",
		tempo: 160,
		minHits: 8
	}),
	"dm-thrash-bridge": spec({
		practiceType: "groove",
		seedPreset: "gallop",
		tempo: 170
	}),
	"dm-contrast": spec({
		practiceType: "groove",
		seedPreset: "breakdown",
		tempo: 90
	})
};
/** First keyword hit wins. Ordered most-specific first. */
var KEYWORD_RULES = [
	{
		match: [
			"hist",
			"listening",
			"production",
			"scene",
			"tape",
			"lineage",
			"influence",
			"compare",
			"live-vs",
			"vocal",
			"gore",
			"ossuary",
			"regional",
			"cliche",
			"analysis",
			"notation-limit",
			"virtuosity",
			"modern-wave",
			"modern-prod",
			"prog-form",
			"prog-hist",
			"song-form",
			"arrangement",
			"grind-border",
			"guitar-tune",
			"analysis-method",
			"clef",
			"ear-interval",
			"enharmonic"
		],
		make: () => MODULE_BY_TYPE.free
	},
	{
		match: [
			"blast",
			"double-kick",
			"drum"
		],
		make: () => MODULE_BY_TYPE["drum-feel"]
	},
	{
		match: [
			"odd-meter",
			"polymeter",
			"polyrhythm",
			"hemiola",
			"metric",
			"tech-90s",
			"tech-vs-func",
			"odd-phrasing"
		],
		make: () => MODULE_BY_TYPE.grouping
	},
	{
		match: [
			"syncopation",
			"displacement",
			"rest",
			"tie-dot",
			"anacrusis",
			"beat-div",
			"tempo",
			"meter",
			"rhythm"
		],
		make: () => MODULE_BY_TYPE["rhythm-grid"]
	},
	{
		match: [
			"groove",
			"swing",
			"pocket",
			"feel"
		],
		make: () => MODULE_BY_TYPE.groove
	},
	{
		match: [
			"riff",
			"cell",
			"tremolo",
			"chromatic",
			"tritone",
			"pedal",
			"power-chord",
			"drop",
			"palm-mute",
			"string-skip",
			"sweep",
			"diminished",
			"atonal",
			"dissonant",
			"harmony",
			"bass-role",
			"motif",
			"brutal",
			"melodeath",
			"semitone",
			"interval",
			"scale",
			"mode",
			"triad",
			"seventh",
			"cadence",
			"voice-lead",
			"inversion",
			"mixture",
			"modulation",
			"neapolitan",
			"octatonic",
			"pentatonic",
			"phrygian",
			"locrian",
			"major",
			"minor",
			"key",
			"circle",
			"function",
			"progress",
			"secondary",
			"nonchord",
			"nonfunc",
			"seq-harm",
			"planing",
			"parallel",
			"reduction",
			"species",
			"tension-tone",
			"timbre",
			"sound",
			"texture",
			"phrase",
			"form",
			"octave",
			"semitone"
		],
		make: () => MODULE_BY_TYPE["riff-cell"]
	}
];
var PREFIX_DEFAULTS = {
	dm: MODULE_BY_TYPE["riff-cell"],
	mus: MODULE_BY_TYPE["rhythm-grid"]
};
/** Small deterministic tempo nudge so sibling lessons don't feel identical. */
function tempoNudge(conceptId) {
	let h = 0;
	for (let i = 0; i < conceptId.length; i += 1) h = (h * 31 + conceptId.charCodeAt(i)) % 97;
	return h % 5 * 4 - 8;
}
function moduleForConcept(conceptId) {
	const override = CONCEPT_OVERRIDES[conceptId];
	if (override) return override;
	for (const rule of KEYWORD_RULES) if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.make();
	const base = PREFIX_DEFAULTS[conceptId.split("-")[0] ?? ""] ?? MODULE_BY_TYPE.free;
	if (!base.seedPreset && !base.seedDrumFeel) return {
		...base,
		tempo: clampTempo(base.tempo + tempoNudge(conceptId))
	};
	return base;
}
function clampTempo(bpm) {
	return Math.max(80, Math.min(240, bpm));
}
/** Build the chudbox payload fields for a lesson from its module spec. */
function practiceFieldsForLesson(lesson) {
	const mod = moduleForConcept(lesson.conceptId);
	const constraints = {
		lanes: mod.lanes,
		lockTempo: mod.practiceType !== "free",
		lockLength: mod.groups != null || mod.practiceType === "grouping",
		...mod.voices ? { voices: mod.voices } : {},
		...mod.startEmpty ? { startEmpty: true } : {},
		...mod.seedPreset ? { seedPreset: mod.seedPreset } : {},
		...mod.seedDrumFeel ? { seedDrumFeel: mod.seedDrumFeel } : {},
		...mod.groups ? { groups: mod.groups } : {},
		...mod.cellSize ? { cellSize: mod.cellSize } : {}
	};
	return {
		practiceType: mod.practiceType,
		tempo: clampTempo(mod.tempo + tempoNudge(lesson.conceptId)),
		patternLength: mod.patternLength,
		allowedTools: mod.allowedTools,
		constraints,
		completionCriteria: {
			...mod.minHits > 0 ? { minHits: mod.minHits } : {},
			requirePlay: mod.requirePlay,
			selfReport: true
		}
	};
}
var HORO_OVERRIDES = {
	"horo-power-reserve-ind": {
		practiceType: "complication",
		parameters: {}
	},
	"horo-tourbillon-honest": {
		practiceType: "free",
		parameters: {}
	},
	"horo-quartz-contrast": {
		practiceType: "free",
		parameters: {}
	},
	"horo-accuracy-claim": {
		practiceType: "free",
		parameters: {}
	}
};
/** First keyword hit wins; ordered most-specific first. */
var HORO_RULES = [
	{
		match: [
			"rate",
			"regulator",
			"amplitude",
			"isochronism",
			"positional",
			"poise",
			"temp",
			"timing-machine",
			"magnet"
		],
		spec: {
			practiceType: "regulate",
			parameters: { tolerance: 5 }
		}
	},
	{
		match: [
			"beat-error",
			"lock-drop",
			"draw",
			"impulse",
			"pallet",
			"lever",
			"safety",
			"recoil",
			"escape",
			"lubrication-escape"
		],
		spec: {
			practiceType: "escapement",
			parameters: {}
		}
	},
	{
		match: [
			"ratio",
			"train-math",
			"cannon",
			"wheel-pinion",
			"beat-rate",
			"gear-train",
			"dial-train"
		],
		spec: {
			practiceType: "train-math",
			parameters: { questions: 3 }
		}
	},
	{
		match: [
			"date",
			"chrono",
			"calendar",
			"gmt",
			"moon",
			"alarm",
			"repeater",
			"rattrapante",
			"flyback",
			"column-wheel",
			"auto-winding",
			"rotor",
			"equation",
			"striking",
			"tourbillon",
			"silicon"
		],
		spec: {
			practiceType: "complication",
			parameters: { questions: 3 }
		}
	},
	{
		match: [
			"nomenclature",
			"balance",
			"hairspring",
			"barrel",
			"click",
			"jewels",
			"bridges",
			"stem",
			"keyless",
			"hands",
			"mainspring",
			"winding",
			"power-reserve",
			"movement",
			"setting",
			"endshake",
			"lubrication",
			"disassembly",
			"service",
			"finishing",
			"tools-intro",
			"texture"
		],
		spec: {
			practiceType: "identify",
			parameters: { questions: 4 }
		}
	}
];
function horoModuleForConcept(conceptId) {
	const override = HORO_OVERRIDES[conceptId];
	if (override) return override;
	for (const rule of HORO_RULES) if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
	return {
		practiceType: "identify",
		parameters: { questions: 4 }
	};
}
/** First keyword hit wins; ordered most-specific first. */
var SEMI_RULES = [
	{
		match: [
			"rayleigh",
			"k1",
			"semi-na",
			"high-na",
			"anamorphic",
			"multi-pattern",
			"pitch-split",
			"duv",
			"immersion",
			"litho",
			"mask",
			"opc",
			"pec",
			"ler",
			"focus-expose",
			"exposure",
			"overlay",
			"stochastic",
			"pellicle"
		],
		spec: {
			practiceType: "rayleigh",
			parameters: { questions: 4 }
		}
	},
	{
		match: [
			"yield",
			"defect",
			"cost-per-wafer",
			"throughput"
		],
		spec: {
			practiceType: "yield",
			parameters: { questions: 4 }
		}
	},
	{
		match: [
			"integration",
			"gate-stack",
			"well",
			"isolation",
			"oxide",
			"silicide",
			"diffusion",
			"anneal",
			"implant"
		],
		spec: {
			practiceType: "sequence",
			parameters: {}
		}
	}
];
/**
* Everything else — unit processes (CMP/CVD/PVD), materials, EUV hardware,
* advanced packaging — is part literacy on the bench.
*/
function semiModuleForConcept(conceptId) {
	for (const rule of SEMI_RULES) if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
	return {
		practiceType: "identify",
		parameters: { questions: 4 }
	};
}
/** First keyword hit wins; ordered most-specific first. */
var PP_RULES = [
	{
		match: [
			"cpu-pipeline",
			"cpu-hazards",
			"cpu-forwarding",
			"cpu-control-hazard",
			"cpu-fetch-decode"
		],
		spec: {
			practiceType: "pipeline",
			parameters: {}
		}
	},
	{
		match: [
			"cache-levels",
			"cache-miss",
			"locality",
			"tlb",
			"inclusive-cache",
			"write-policy",
			"mshr",
			"prefetch",
			"memory-wall"
		],
		spec: {
			practiceType: "cache",
			parameters: {}
		}
	},
	{
		match: [
			"ooo-schedule",
			"renaming",
			"rob",
			"wakeup-select",
			"issue-width",
			"load-store-queue",
			"memory-disambig",
			"speculative-load",
			"smt",
			"precise-exceptions"
		],
		spec: {
			practiceType: "schedule",
			parameters: { questions: 4 }
		}
	},
	{
		match: [
			"branch-prediction",
			"predictors",
			"btb",
			"ras"
		],
		spec: {
			practiceType: "predictor",
			parameters: { rounds: 10 }
		}
	}
];
/**
* Everything else — coherency/consistency scenarios, GPU execution model,
* foundations literacy — lands in the scenario deck.
*/
function ppModuleForConcept(conceptId) {
	for (const rule of PP_RULES) if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
	return {
		practiceType: "scenarios",
		parameters: { questions: 4 }
	};
}
/** First keyword hit wins; ordered most-specific first. */
var CW_RULES = [
	{
		match: [
			"token",
			"regex-lex",
			"preproc",
			"macro",
			"ambiguity",
			"ast",
			"parse-tree",
			"lr",
			"grammar-class",
			"recursive-descent",
			"error-recovery",
			"semantic-action",
			"source-loc"
		],
		spec: {
			practiceType: "parse",
			parameters: { questions: 4 }
		}
	},
	{
		match: [
			"const-fold",
			"cse",
			"dce",
			"licm",
			"loop-inv",
			"strength-red",
			"mem2reg",
			"sroa",
			"inlining",
			"ipo",
			"vectorize",
			"tailcall",
			"pass-manager",
			"ir-verify"
		],
		spec: {
			practiceType: "optimize",
			parameters: { questions: 4 }
		}
	},
	{
		match: [
			"liveness",
			"dataflow",
			"ssa",
			"phi",
			"alias",
			"call-graph"
		],
		spec: {
			practiceType: "dataflow",
			parameters: { questions: 4 }
		}
	}
];
/**
* The back end road — allocation, spill, isel, frames, linking, JIT, GC,
* plus front-end name resolution — rides the backend literacy deck.
*/
function cwModuleForConcept(conceptId) {
	for (const rule of CW_RULES) if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
	return {
		practiceType: "backend",
		parameters: { questions: 4 }
	};
}
/** First keyword hit wins; ordered most-specific first. */
var NET_RULES = [
	{
		match: [
			"handshake",
			"tcp-state",
			"reliable",
			"timeout",
			"keepalive",
			"head-of-line",
			"flow-control",
			"fast-retransmit",
			"nagle",
			"tls-place"
		],
		spec: {
			practiceType: "handshake",
			parameters: { questions: 3 }
		}
	},
	{
		match: [
			"aimd",
			"slow-start",
			"congestion",
			"ecn",
			"bbr",
			"bufferbloat",
			"fairness-tcp"
		],
		spec: {
			practiceType: "congestion",
			parameters: { questions: 4 }
		}
	},
	{
		match: [
			"longest-prefix",
			"cidr",
			"forwarding-vs-routing",
			"bgp",
			"as",
			"igp",
			"ospf",
			"anycast",
			"hijack",
			"rpki",
			"peering",
			"transit",
			"policy-route",
			"ixp",
			"sdn",
			"mpls"
		],
		spec: {
			practiceType: "routing",
			parameters: { questions: 4 }
		}
	},
	{
		match: [
			"layering",
			"packet",
			"ethernet",
			"ip",
			"mac",
			"arp",
			"checksum",
			"endian-wire",
			"mtu",
			"fragment",
			"switching",
			"wifi-vs-wired"
		],
		spec: {
			practiceType: "encapsulate",
			parameters: { questions: 4 }
		}
	}
];
/**
* Everything else — DNS, NAT, DHCP, CDN, QUIC, sockets, measurement —
* rides the scenario deck.
*/
function netModuleForConcept(conceptId) {
	for (const rule of NET_RULES) if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
	return {
		practiceType: "scenarios",
		parameters: { questions: 4 }
	};
}
var OS_RULES = [
	{
		match: [
			"os-sched",
			"os-preempt",
			"os-fairness",
			"os-priority-inv",
			"os-realtime",
			"os-latency-sched",
			"os-load-balance",
			"os-scheduler-class",
			"os-context-switch"
		],
		spec: {
			practiceType: "scheduler",
			parameters: { questions: 3 }
		}
	},
	{
		match: [
			"os-race",
			"os-lock",
			"os-semaphore",
			"os-condvar",
			"os-deadlock",
			"os-atomic",
			"os-sleep-lock",
			"os-seqcst",
			"os-fork",
			"os-cow"
		],
		spec: {
			practiceType: "sync",
			parameters: { questions: 4 }
		}
	},
	{
		match: [
			"os-vm",
			"os-page-fault",
			"os-page-table",
			"os-tlb-os",
			"os-swap",
			"os-mmap",
			"os-numa"
		],
		spec: {
			practiceType: "vm",
			parameters: { questions: 3 }
		}
	},
	{
		match: [
			"os-inode",
			"os-journal",
			"os-crash-consist",
			"os-dir",
			"os-fs-layout",
			"os-buffer-cache",
			"os-block-dev",
			"os-mount",
			"os-vfs"
		],
		spec: {
			practiceType: "storage",
			parameters: { questions: 3 }
		}
	}
];
/** The rest — syscalls, isolation, containers, devices — rides the deck. */
function osModuleForConcept(conceptId) {
	for (const rule of OS_RULES) if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
	return {
		practiceType: "scenarios",
		parameters: { questions: 5 }
	};
}
var ML_RULES = [
	{
		match: [
			"ml-gd",
			"ml-convex",
			"ml-feature-scale",
			"ml-sgd-mom",
			"ml-linear-reg",
			"ml-logistic",
			"ml-loss"
		],
		spec: {
			practiceType: "gradient",
			parameters: { questions: 3 }
		}
	},
	{
		match: [
			"ml-overfit",
			"ml-train-val-test",
			"ml-early-stop",
			"ml-regularization",
			"ml-dropout",
			"ml-crossval",
			"ml-bias-variance",
			"ml-generalization",
			"ml-metrics-class",
			"ml-baselines",
			"ml-iid"
		],
		spec: {
			practiceType: "traineval",
			parameters: { questions: 4 }
		}
	},
	{
		match: [
			"ml-neuron",
			"ml-activation",
			"ml-backprop",
			"ml-autodiff",
			"ml-vanish",
			"ml-vanishing",
			"ml-softmax",
			"ml-ce-loss",
			"ml-cnn",
			"ml-mlp",
			"ml-depth",
			"ml-init",
			"ml-batchnorm",
			"ml-emb-intro",
			"ml-word2vec",
			"ml-repr",
			"ml-transfer",
			"ml-seq-rnn"
		],
		spec: {
			practiceType: "neuron",
			parameters: { questions: 3 }
		}
	},
	{
		match: [
			"ml-qkv",
			"ml-self-attn",
			"ml-attention",
			"ml-multihead",
			"ml-positional",
			"ml-kv-cache",
			"ml-context",
			"ml-transformer",
			"ml-sparsity-attn",
			"ml-encoder-decoder"
		],
		spec: {
			practiceType: "attention",
			parameters: { questions: 4 }
		}
	}
];
/** Foundations and LLM-practice concepts ride the scenario deck. */
function mlModuleForConcept(conceptId) {
	for (const rule of ML_RULES) if (rule.match.some((keyword) => conceptId.includes(keyword))) return rule.spec;
	return {
		practiceType: "scenarios",
		parameters: { questions: 5 }
	};
}
var PRACTICE_LOG_KEY = "dau-practice-log-v1";
/** Launchable labs whose concept/course coverage matches this lesson. */
function practiceLabsForLesson(courseId, conceptId) {
	return getCompatibleLabs(courseId ?? "", conceptId).filter((lab) => canLaunchLab(lab.labId) && Boolean(lab.launchUrl));
}
function goalForLesson(lesson) {
	const base = lesson.title.trim();
	return base.length >= 8 ? `${base}.` : `${base} — hands-on practice.`;
}
/** Pure: the contract request DAU sends for this lesson, routed to its lab. */
function buildPracticeRequestForLesson(lesson) {
	if (lesson.conceptId.startsWith("os-")) {
		const mod = osModuleForConcept(lesson.conceptId);
		return {
			schemaVersion: 1,
			sourceApp: SOURCE_APP_DAU,
			labId: OS_LAB_ID,
			conceptId: lesson.conceptId,
			lessonId: lesson.id,
			practiceType: mod.practiceType,
			goal: goalForLesson(lesson),
			parameters: mod.parameters
		};
	}
	if (lesson.conceptId.startsWith("ml-")) {
		const mod = mlModuleForConcept(lesson.conceptId);
		return {
			schemaVersion: 1,
			sourceApp: SOURCE_APP_DAU,
			labId: ML_LAB_ID,
			conceptId: lesson.conceptId,
			lessonId: lesson.id,
			practiceType: mod.practiceType,
			goal: goalForLesson(lesson),
			parameters: mod.parameters
		};
	}
	if (lesson.conceptId.startsWith("net-")) {
		const mod = netModuleForConcept(lesson.conceptId);
		return {
			schemaVersion: 1,
			sourceApp: SOURCE_APP_DAU,
			labId: PACKET_LAB_ID,
			conceptId: lesson.conceptId,
			lessonId: lesson.id,
			practiceType: mod.practiceType,
			goal: goalForLesson(lesson),
			parameters: mod.parameters
		};
	}
	if (lesson.conceptId.startsWith("cmp-")) {
		const mod = cwModuleForConcept(lesson.conceptId);
		return {
			schemaVersion: 1,
			sourceApp: SOURCE_APP_DAU,
			labId: COMPILER_WORKBENCH_ID,
			conceptId: lesson.conceptId,
			lessonId: lesson.id,
			practiceType: mod.practiceType,
			goal: goalForLesson(lesson),
			parameters: mod.parameters
		};
	}
	if (lesson.conceptId.startsWith("cpu-") || lesson.conceptId.startsWith("gpu-") || lesson.conceptId.startsWith("arch-")) {
		const mod = ppModuleForConcept(lesson.conceptId);
		return {
			schemaVersion: 1,
			sourceApp: SOURCE_APP_DAU,
			labId: PIPELINE_LAB_ID,
			conceptId: lesson.conceptId,
			lessonId: lesson.id,
			practiceType: mod.practiceType,
			goal: goalForLesson(lesson),
			parameters: mod.parameters
		};
	}
	if (lesson.conceptId.startsWith("horo-")) {
		const mod = horoModuleForConcept(lesson.conceptId);
		return {
			schemaVersion: 1,
			sourceApp: SOURCE_APP_DAU,
			labId: MOVEMENT_BENCH_LAB_ID,
			conceptId: lesson.conceptId,
			lessonId: lesson.id,
			practiceType: mod.practiceType,
			goal: goalForLesson(lesson),
			parameters: mod.parameters
		};
	}
	if (lesson.conceptId.startsWith("semi-")) {
		const mod = semiModuleForConcept(lesson.conceptId);
		return {
			schemaVersion: 1,
			sourceApp: SOURCE_APP_DAU,
			labId: FAB_LAB_ID,
			conceptId: lesson.conceptId,
			lessonId: lesson.id,
			practiceType: mod.practiceType,
			goal: goalForLesson(lesson),
			parameters: mod.parameters
		};
	}
	const fields = practiceFieldsForLesson(lesson);
	return {
		schemaVersion: 1,
		sourceApp: SOURCE_APP_DAU,
		labId: CHUDBOX_LAB_ID,
		conceptId: lesson.conceptId,
		lessonId: lesson.id,
		practiceType: fields.practiceType,
		goal: goalForLesson(lesson),
		parameters: {
			tempo: fields.tempo,
			patternLength: fields.patternLength
		},
		allowedTools: fields.allowedTools,
		constraints: fields.constraints,
		completionCriteria: fields.completionCriteria
	};
}
function launchBaseForLab(labId) {
	return getLab(labId)?.launchUrl ?? "http://localhost:8080/";
}
/**
* Per-lab adapters. Adding a lab to the ecosystem means one entry here plus
* its contract adapter — no new branching in host code.
*/
var LAUNCHERS = {
	[CHUDBOX_LAB_ID]: (base, request) => buildChudboxLaunchUrl(base, request),
	[MOVEMENT_BENCH_LAB_ID]: (base, request) => buildMovementBenchLaunchUrl(base, request),
	[FAB_LAB_ID]: (base, request) => buildFabLaunchUrl(base, request),
	[PIPELINE_LAB_ID]: (base, request) => buildPipelineLaunchUrl(base, request),
	[COMPILER_WORKBENCH_ID]: (base, request) => buildCwLaunchUrl(base, request),
	[PACKET_LAB_ID]: (base, request) => buildPlLaunchUrl(base, request),
	[OS_LAB_ID]: (base, request) => buildOsLaunchUrl(base, request),
	[ML_LAB_ID]: (base, request) => buildMlLaunchUrl(base, request)
};
/** Pure: validate against the contract and build the pop-up URL. */
function launchUrlForLesson(lesson) {
	const request = buildPracticeRequestForLesson(lesson);
	const launch = LAUNCHERS[request.labId];
	if (!launch) return {
		ok: false,
		message: `No launcher registered for lab ${request.labId}.`
	};
	const built = launch(launchBaseForLab(request.labId), request);
	if (!built.ok) return {
		ok: false,
		message: built.message
	};
	return {
		ok: true,
		url: built.data
	};
}
/** Open the lab in a new tab/window. Results arrive via initPracticeResultListener. */
function openPracticeLab(lesson) {
	const launch = launchUrlForLesson(lesson);
	if (!launch.ok || !launch.url) return launch;
	if (typeof window === "undefined") return {
		ok: false,
		message: "Practice can only be launched in the browser."
	};
	window.open(launch.url, "_blank");
	return {
		ok: true,
		url: launch.url
	};
}
/**
* Listen (once) for practice results posted back by launched labs. Validates the
* sender's origin against every registered lab origin before adapting the
* envelope (chudbox and movement-bench today; more labs, more adapters).
*/
function initPracticeResultListener(onResult) {
	if (typeof window === "undefined") return () => {};
	const allowedOrigins = /* @__PURE__ */ new Set();
	for (const labId of [
		CHUDBOX_LAB_ID,
		MOVEMENT_BENCH_LAB_ID,
		FAB_LAB_ID,
		PIPELINE_LAB_ID,
		COMPILER_WORKBENCH_ID,
		PACKET_LAB_ID,
		OS_LAB_ID,
		ML_LAB_ID
	]) {
		const base = getLab(labId)?.launchUrl;
		if (!base) continue;
		try {
			allowedOrigins.add(new URL(base).origin);
		} catch {}
	}
	const handler = (event) => {
		if (allowedOrigins.size > 0 && !allowedOrigins.has(event.origin)) return;
		const chudbox = adaptChudboxResultMessage(event.data);
		const bench = chudbox.ok ? chudbox : adaptMovementBenchResultMessage(event.data);
		const fab = bench.ok ? bench : adaptFabResultMessage(event.data);
		const pp = fab.ok ? fab : adaptPipelineResultMessage(event.data);
		const cw = pp.ok ? pp : adaptCompilerWorkbenchResultMessage(event.data);
		const pl = cw.ok ? cw : adaptPacketLabResultMessage(event.data);
		const os = pl.ok ? pl : adaptOsResultMessage(event.data);
		const adapted = os.ok ? os : adaptMlResultMessage(event.data);
		if (!adapted.ok) return;
		const result = adapted.data.result;
		const entry = {
			labId: result.labId,
			conceptId: result.conceptId,
			lessonId: result.lessonId,
			completed: result.completed,
			attempts: result.attempts,
			timeSpentMs: result.timeSpentMs,
			...result.selfRating != null ? { selfRating: result.selfRating } : {},
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		persist(entry);
		onResult(entry);
	};
	window.addEventListener("message", handler);
	return () => window.removeEventListener("message", handler);
}
function persist(entry) {
	try {
		const log = readPracticeLog();
		log.push(entry);
		window.localStorage.setItem(PRACTICE_LOG_KEY, JSON.stringify(log.slice(-200)));
	} catch {}
}
function readPracticeLog() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(PRACTICE_LOG_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function LessonPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonReady, {}) });
}
function LessonReady() {
	const { lessonId } = Route$3.useParams();
	const navigate = useNavigate();
	const catalog = useCatalog();
	const lesson = catalog.lessonMap[lessonId];
	const lastMode = useProgress((s) => s.settings.lastMode);
	const lastTime = useProgress((s) => s.settings.lastTime);
	const applyVersion = useProgress((s) => s.applyLessonVersion);
	const addFeedback = useProgress((s) => s.addFeedback);
	const logGeneration = useProgress((s) => s.logGeneration);
	const archiveLesson = useProgress((s) => s.archiveLesson);
	const ai = useProgress((s) => s.ai);
	const progress = useProgress((s) => s.concepts);
	const profile = useProgress((s) => s.profile);
	const courseProgress = useProgress((s) => s.courses);
	const aiCtx = useAiContext(getLive()?.generations ?? 0);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [styleOpen, setStyleOpen] = (0, import_react.useState)(false);
	if (!lesson) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Unit not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/session",
			className: "mt-4 inline-block text-sm text-muted hover:text-fg",
			children: "Back to the router"
		})]
	});
	const unit = lesson;
	const course = courseForConcept(catalog, unit.conceptId);
	const concept = catalog.conceptMap[unit.conceptId];
	const categoryName = concept ? catalog.categoryMap[concept.category]?.name : "";
	const practiceLabs = practiceLabsForLesson(course?.id, unit.conceptId);
	const prereqNames = unit.prerequisites.map((id) => catalog.conceptMap[id]?.name ?? id).filter(Boolean);
	(0, import_react.useEffect)(() => {
		return initPracticeResultListener((entry) => {
			if (entry.completed) toast.success(`Practice logged: ${entry.lessonId}`, { description: `Chudbox take · ${Math.round(entry.timeSpentMs / 1e3)}s${entry.selfRating ? ` · rated ${entry.selfRating}/3` : ""}` });
		});
	}, []);
	function beginQuiz() {
		const live = getLive();
		if (!live || live.lessonId !== unit.id) startLive({
			lessonId: unit.id,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			mode: lastMode,
			timeBudget: lastTime
		});
		navigate({
			to: "/learn/$lessonId/quiz",
			params: { lessonId: unit.id }
		});
	}
	async function explain(style) {
		setBusy("explain");
		const result = await generateExplain(aiCtx, unit, style);
		setBusy(null);
		setStyleOpen(false);
		if (result.billable) bumpLiveGeneration();
		logGeneration(toGenerationLog("explain", result, {
			lessonId: unit.id,
			conceptId: unit.conceptId
		}));
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		applyVersion(unit.id, {
			id: `v-${Date.now()}`,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			kind: "explain-differently",
			explanation: result.value.explanation,
			example: result.value.example,
			provenance: {
				type: "ai",
				provider: result.provider,
				model: result.model,
				generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				promptVersion: PROMPT_VERSION,
				schemaVersion: 1,
				notes: `explain:${style}`
			}
		}, {
			...unit,
			explanation: result.value.explanation,
			example: result.value.example,
			custom: true
		});
		toast("Explanation rewritten.");
	}
	async function regenQuiz() {
		setBusy("quiz");
		const result = await generateQuiz(aiCtx, unit, quizContextFor(unit, makeReadinessContext(catalog, progress, profile, courseProgress), catalog, {
			journalist: useProgress.getState().settings.journalistDepth,
			history: useProgress.getState().assessmentHistory
		}));
		setBusy(null);
		if (result.billable) bumpLiveGeneration();
		logGeneration(toGenerationLog("quiz", result, {
			lessonId: unit.id,
			conceptId: unit.conceptId
		}));
		if (!result.ok) {
			toast.error(result.error);
			return;
		}
		applyVersion(unit.id, {
			id: `v-${Date.now()}`,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			kind: "quiz-regen",
			quiz: [...result.value],
			provenance: {
				type: "ai",
				provider: result.provider,
				model: result.model,
				generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				promptVersion: PROMPT_VERSION,
				schemaVersion: 1
			}
		}, {
			...unit,
			quiz: result.value,
			custom: true
		});
		toast("Quiz replaced.");
	}
	function feedback(verdict) {
		addFeedback(unit.id, verdict);
		toast(`Marked ${verdict}.`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs tracking-[0.18em] text-muted uppercase",
				children: [
					course ? course.title : categoryName,
					" · ",
					unit.durationMin,
					" min · ",
					unit.effort,
					unit.level === "journalist" ? " · journalist" : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl leading-tight tracking-tight break-words sm:text-4xl",
					children: unit.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, { lesson: unit })]
			}),
			prereqNames.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: ["Assumes: ", prereqNames.join(" · ")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProvenanceLine, { lesson: unit })
			}),
			unit.versions && unit.versions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-subtle",
				children: [
					unit.versions.length,
					" earlier version",
					unit.versions.length === 1 ? "" : "s",
					" kept"
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-6 text-[17px] leading-[1.65] break-words text-fg",
				children: unit.explanation.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 24)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonDiagram, { name: unit.diagram }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-lg bg-surface px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs tracking-[0.16em] text-muted uppercase",
					children: "Example"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[15px] leading-relaxed break-words text-fg",
					children: unit.example
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs tracking-[0.16em] text-muted uppercase",
					children: "Why it matters"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[15px] leading-relaxed break-words text-muted",
					children: unit.whyItMatters
				})]
			}),
			unit.source.sourceExcerpt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs tracking-[0.16em] text-muted uppercase",
					children: "Grounded in source"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-subtle",
					children: unit.source.sourceExcerpt
				})]
			}),
			practiceLabs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-lg bg-surface px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs tracking-[0.16em] text-muted uppercase",
						children: "Practice lab"
					}),
					practiceLabs.map((lab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[15px] text-fg",
								children: lab.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted",
								children: lab.description
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "secondary",
							onClick: () => {
								const launch = openPracticeLab({
									id: unit.id,
									conceptId: unit.conceptId,
									title: unit.title
								});
								if (!launch.ok) toast.error(launch.message ?? "Could not launch the practice lab.");
							},
							children: [
								"Practice in ",
								lab.name,
								" ↗"
							]
						})]
					}, lab.labId)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-2xs leading-relaxed text-subtle",
						children: "Opens in a new tab. When you complete a take there, the result is posted back and logged here."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "lg",
					onClick: beginQuiz,
					children: "Three questions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/session",
					className: "text-sm text-muted no-underline hover:text-fg",
					children: "Abort this gap"
				})]
			}),
			ai.enabled && ai.policy !== "off" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 border-t border-border/70 pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: "Rewrite this unit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "secondary",
							onClick: () => setStyleOpen((v) => !v),
							disabled: busy !== null,
							children: busy === "explain" ? "Rewriting…" : "Explain differently"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "secondary",
							onClick: () => void regenQuiz(),
							disabled: busy !== null,
							children: busy === "quiz" ? "Writing questions…" : "Regenerate quiz"
						})]
					}),
					styleOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-2 gap-2",
						children: [
							["analogy", "Different analogy"],
							["technical", "More technical"],
							["simpler", "Simpler"],
							["example", "Another example"]
						].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void explain(id),
							className: "min-h-11 rounded-md bg-raised px-3 text-sm text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
							children: label
						}, id))
					})
				]
			}),
			(unit.source.type === "ai" || unit.custom) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap items-center gap-2 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "This unit:" }),
					[
						"accurate",
						"unclear",
						"suspect"
					].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => feedback(v),
						className: "rounded-full bg-raised px-3 py-1.5 hover:text-fg",
						children: v
					}, v)),
					unit.custom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ml-auto text-bad",
						onClick: () => {
							archiveLesson(unit.id);
							toast("Archived.");
							navigate({ to: "/library" });
						},
						children: "Archive"
					})
				]
			})
		]
	});
}
//#endregion
export { LessonPage as component };
