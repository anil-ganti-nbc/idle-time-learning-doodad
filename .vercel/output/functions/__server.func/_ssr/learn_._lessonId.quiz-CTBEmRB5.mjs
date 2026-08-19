import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as cn, r as Route$1 } from "./router-BLJIBKSA.mjs";
import { m as useProgress, p as useCatalog } from "./use-catalog-Be-DbnEV.mjs";
import { t as Button } from "./button-WNIv-gfX.mjs";
import { a as patchLive, i as getLive, o as startLive } from "./live-Cdzq3AeC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learn_._lessonId.quiz-CTBEmRB5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuizPage() {
	const { lessonId } = Route$1.useParams();
	const navigate = useNavigate();
	const lesson = useCatalog().lessonMap[lessonId];
	const lastMode = useProgress((s) => s.settings.lastMode);
	const lastTime = useProgress((s) => s.settings.lastTime);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [correct, setCorrect] = (0, import_react.useState)(0);
	if (!lesson) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Unit not found"
		})
	});
	const unit = lesson;
	const question = unit.quiz[index];
	const locked = picked !== null;
	function choose(i) {
		if (picked !== null) return;
		setPicked(i);
		if (i === question.answerIndex) setCorrect((c) => c + 1);
	}
	function next() {
		if (index < 2) {
			setIndex((n) => n + 1);
			setPicked(null);
			return;
		}
		const live = getLive();
		if (!live || live.lessonId !== unit.id) startLive({
			lessonId: unit.id,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			mode: lastMode,
			timeBudget: lastTime
		});
		patchLive({
			quizCorrect: correct,
			answered: 3
		});
		navigate({
			to: "/learn/$lessonId/rate",
			params: { lessonId: unit.id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs tabular-nums text-muted",
				children: [index + 1, " / 3"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-2xl leading-snug tracking-tight sm:text-3xl",
				children: question.prompt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-2",
				children: question.choices.map((choice, i) => {
					const show = locked;
					const right = i === question.answerIndex;
					const mine = i === picked;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => choose(i),
						disabled: locked,
						className: cn("w-full rounded-lg px-4 py-3.5 text-left text-[15px] leading-snug transition-[box-shadow,background-color] duration-150", !show && "bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.16)]", show && right && "bg-ok/15 shadow-[0_0_0_1px_rgba(138,163,154,0.45)]", show && mine && !right && "bg-bad/15 shadow-[0_0_0_1px_rgba(196,137,130,0.45)]", show && !right && !mine && "bg-raised text-muted"),
						children: choice
					}) }, choice);
				})
			}),
			locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm leading-relaxed text-muted",
				children: question.explanation
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					disabled: !locked,
					onClick: next,
					children: index < 2 ? "Next" : "Rate understanding"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/learn/$lessonId",
					params: { lessonId: unit.id },
					className: "text-sm text-muted no-underline hover:text-fg",
					children: "Reread"
				})]
			})
		]
	});
}
//#endregion
export { QuizPage as component };
