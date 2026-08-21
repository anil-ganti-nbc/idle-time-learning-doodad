import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$1, s as cn } from "./router-DocPpzdv.mjs";
import { A as moduleForConcept, B as useCatalog, P as presentQuiz, R as recordPositions, V as useProgress, c as courseForConcept } from "./use-catalog-DsTCgnv9.mjs";
import { t as HydrateGate } from "./hydrate-Ceh-ch8W.mjs";
import { t as Button } from "./button-CKDVl6lX.mjs";
import { a as getLive, o as patchLive, s as startLive } from "./live-DpxOBqbB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learn_._lessonId.quiz-DCgyOtd4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuizPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizReady, {}) });
}
function QuizReady() {
	const { lessonId } = Route$1.useParams();
	const navigate = useNavigate();
	const catalog = useCatalog();
	const lesson = catalog.lessonMap[lessonId];
	const lastMode = useProgress((s) => s.settings.lastMode);
	const lastTime = useProgress((s) => s.settings.lastTime);
	const recentPositions = useProgress((s) => s.assessmentHistory?.recentPositions ?? []);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [locked, setLocked] = (0, import_react.useState)(false);
	const [correct, setCorrect] = (0, import_react.useState)(0);
	const [items, setItems] = (0, import_react.useState)([]);
	const quiz = (0, import_react.useMemo)(() => {
		if (!lesson) return [];
		return presentQuiz(lesson.quiz, Math.random, recentPositions);
	}, [lesson?.id]);
	if (!lesson || quiz.length < 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Unit not found"
		})
	});
	const unit = lesson;
	const question = quiz[index];
	catalog.conceptMap[unit.conceptId];
	const course = courseForConcept(catalog, unit.conceptId);
	const mod = moduleForConcept(catalog, unit.conceptId);
	function confirm() {
		if (selected === null || locked) return;
		const right = selected === question.answerIndex;
		if (right) setCorrect((c) => c + 1);
		setLocked(true);
		const record = {
			at: (/* @__PURE__ */ new Date()).toISOString(),
			lessonId: unit.id,
			conceptId: unit.conceptId,
			questionId: question.id,
			courseId: course?.id,
			moduleId: mod?.id,
			objectiveIds: question.objectiveIds ?? [],
			cognitiveType: question.cognitiveType,
			difficultyTier: question.difficultyTier,
			answerIndex: selected,
			correct: right,
			generationKind: unit.source.type === "ai" ? "generated" : "seeded",
			promptVersion: unit.source.promptVersion,
			provider: unit.source.provider,
			model: unit.source.model
		};
		setItems((prev) => [...prev, record]);
	}
	function next() {
		if (index < 2) {
			setIndex((n) => n + 1);
			setSelected(null);
			setLocked(false);
			return;
		}
		const live = getLive();
		if (!live || live.lessonId !== unit.id) startLive({
			lessonId: unit.id,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			mode: lastMode,
			timeBudget: lastTime
		});
		const positions = recordPositions(quiz, recentPositions);
		patchLive({
			quizCorrect: correct,
			answered: 3,
			quizItems: items,
			positions
		});
		navigate({
			to: "/learn/$lessonId/rate",
			params: { lessonId: unit.id }
		});
	}
	const selectedRationale = locked && selected !== null && selected !== question.answerIndex ? question.distractors?.find((d) => d.text === question.choices[selected])?.rationale : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs tabular-nums text-muted",
				children: [index + 1, " / 3"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-2xl leading-snug tracking-tight break-words sm:text-3xl",
				children: question.prompt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-2",
				children: question.choices.map((choice, i) => {
					const show = locked;
					const right = i === question.answerIndex;
					const mine = i === selected;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (!locked) setSelected(i);
						},
						disabled: locked,
						className: cn("min-h-12 w-full rounded-lg px-4 py-3.5 text-left text-[15px] leading-snug break-words transition-[box-shadow,background-color] duration-150", !show && !mine && "bg-surface shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.16)]", !show && mine && "bg-raised shadow-[0_0_0_1px_rgba(255,255,255,0.18)]", show && right && "bg-ok/15 shadow-[0_0_0_1px_rgba(138,163,154,0.45)]", show && mine && !right && "bg-bad/15 shadow-[0_0_0_1px_rgba(196,137,130,0.45)]", show && !right && !mine && "bg-raised text-muted"),
						children: choice
					}) }, `${question.id}-${choice}`);
				})
			}),
			locked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: question.explanation
				}), selectedRationale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0 text-sm leading-relaxed text-muted",
					children: ["The option you picked: ", selectedRationale]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex items-center gap-3",
				children: [!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					disabled: selected === null,
					onClick: confirm,
					children: "Check answer"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
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
