import { A as moduleForConcept, I as recentCognitiveTypes, L as recentObjectiveIds, N as plannedMix, c as courseForConcept, g as inferTier, n as allowedKnowledge, y as isDemonstrated } from "./use-catalog-DsTCgnv9.mjs";
import { t as conceptState } from "./state-ZIUkIptt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-context-BAIWHDkr.js
function quizContextForConcept(concept, ctx, catalog, opts) {
	const course = concept ? courseForConcept(catalog, concept.id) : void 0;
	const mod = concept ? moduleForConcept(catalog, concept.id) : void 0;
	const allowed = concept ? allowedKnowledge(catalog, concept, ctx, opts?.journalist ?? false) : {
		currentConceptId: "",
		conceptIds: [],
		names: [],
		reasons: {}
	};
	const weak = allowed.names.filter((row) => {
		return conceptState(ctx.progress[row.id], ctx.profile?.knownConceptIds.includes(row.id) ?? false) === "shaky";
	});
	const demonstrated = allowed.names.filter((row) => row.id !== concept?.id && isDemonstrated(row.id, ctx, 2));
	const objectives = concept?.objectives ?? mod?.learningObjectives ?? [];
	const recentObjectives = recentObjectiveIds(opts?.history, concept?.id);
	const prioritized = objectives.filter((id) => !recentObjectives.includes(id)).slice(0, 3);
	const objectiveList = prioritized.length ? prioritized : objectives.slice(0, 3);
	const mix = plannedMix(inferTier(concept));
	return {
		subjectId: concept?.category,
		subjectName: concept ? catalog.categoryMap[concept.category]?.name : void 0,
		courseId: course?.id,
		courseTitle: course?.title,
		moduleId: mod?.id,
		moduleTitle: mod?.title,
		conceptId: concept?.id,
		tier: inferTier(concept),
		currentConcept: concept?.name ?? "",
		prerequisites: (concept?.prerequisites ?? []).map((id) => ({
			id,
			name: catalog.conceptMap[id]?.name ?? id
		})),
		demonstrated,
		weak,
		objectives: objectiveList,
		allowedKnowledge: allowed.names,
		requestedMix: mix,
		recentCognitiveTypes: recentCognitiveTypes(opts?.history, concept?.id),
		recentObjectiveIds: recentObjectives
	};
}
function quizContextFor(lesson, ctx, catalog, opts) {
	const concept = catalog.conceptMap[lesson.conceptId];
	const fromConcept = quizContextForConcept(concept, ctx, catalog, opts);
	if (concept) return fromConcept;
	return {
		...fromConcept,
		currentConcept: lesson.conceptId,
		conceptId: lesson.conceptId,
		prerequisites: lesson.prerequisites.map((id) => ({
			id,
			name: catalog.conceptMap[id]?.name ?? id
		}))
	};
}
//#endregion
export { quizContextForConcept as n, quizContextFor as t };
