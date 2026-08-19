import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Route$3 } from "./router-BLJIBKSA.mjs";
import { m as useProgress, p as useCatalog } from "./use-catalog-Be-DbnEV.mjs";
import { t as HydrateGate } from "./hydrate-NroyXG9v.mjs";
import { n as SourceBadge, t as ProvenanceLine } from "./provenance-rf1YVTy-.mjs";
import { t as Button } from "./button-WNIv-gfX.mjs";
import { a as useAiContext, i as generateQuiz, t as generateExplain } from "./use-ai-ColkSuBf.mjs";
import { i as getLive, o as startLive, t as bumpLiveGeneration } from "./live-Cdzq3AeC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learn._lessonId-BbCOaa8a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var frame = "mt-6 overflow-hidden rounded-lg bg-raised px-4 py-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]";
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
	})
};
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
	const concept = catalog.conceptMap[unit.conceptId];
	const categoryName = concept ? catalog.categoryMap[concept.category]?.name : "";
	const prereqNames = unit.prerequisites.map((id) => catalog.conceptMap[id]?.name ?? id).filter(Boolean);
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
				promptVersion: "dau-lesson-v1",
				schemaVersion: 1,
				notes: `explain:${style}`
			}
		}, {
			...unit,
			explanation: result.value.explanation,
			example: result.value.example,
			custom: true
		});
		bumpLiveGeneration();
		logGeneration({
			id: `gen-${Date.now()}`,
			at: (/* @__PURE__ */ new Date()).toISOString(),
			kind: "explain",
			provider: result.provider,
			model: result.model,
			promptVersion: "dau-lesson-v1",
			ok: true,
			lessonId: unit.id,
			conceptId: unit.conceptId
		});
		toast("Explanation rewritten.");
	}
	async function regenQuiz() {
		setBusy("quiz");
		const result = await generateQuiz(aiCtx, unit);
		setBusy(null);
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
				promptVersion: "dau-lesson-v1",
				schemaVersion: 1
			}
		}, {
			...unit,
			quiz: result.value,
			custom: true
		});
		bumpLiveGeneration();
		logGeneration({
			id: `gen-${Date.now()}`,
			at: (/* @__PURE__ */ new Date()).toISOString(),
			kind: "quiz",
			provider: result.provider,
			model: result.model,
			promptVersion: "dau-lesson-v1",
			ok: true,
			lessonId: unit.id,
			conceptId: unit.conceptId
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
					categoryName,
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
					className: "font-display text-3xl leading-tight tracking-tight sm:text-4xl",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-5 text-[17px] leading-[1.6] text-fg",
				children: unit.explanation.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 24)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonDiagram, { name: unit.diagram }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-lg bg-surface px-5 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs tracking-[0.16em] text-muted uppercase",
					children: "Example"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[15px] leading-relaxed text-fg",
					children: unit.example
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs tracking-[0.16em] text-muted uppercase",
					children: "Why it matters"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[15px] leading-relaxed text-muted",
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
