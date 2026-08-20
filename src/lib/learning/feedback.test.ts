import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultState } from "./defaults.ts";
import { useProgress } from "./progress.ts";
import { emptyProgress } from "./srs.ts";

describe("lesson difficulty notes", () => {
  it("records a note on the session without touching mastery", () => {
    useProgress.setState({
      ...defaultState(),
      concepts: {
        "cpu-pipeline": {
          ...emptyProgress("cpu-pipeline"),
          encountered: true,
          understanding: "got_it",
          lastQuizScore: 1,
          lastQuizCorrect: 3,
          lastQuizTotal: 3,
          timesStudied: 2,
        },
      },
      sessions: [
        {
          id: "sess-1",
          lessonId: "cpu-pipeline-10",
          conceptId: "cpu-pipeline",
          categoryId: "cpu",
          startedAt: "2026-08-20T00:00:00.000Z",
          completedAt: "2026-08-20T00:10:00.000Z",
          estimatedMinutes: 10,
          actualMinutes: 10,
          quizCorrect: 3,
          quizTotal: 3,
          understanding: "got_it",
          mode: "explore",
          timeBudget: 10,
          sourceType: "seed",
        },
      ],
    });

    useProgress.getState().noteDifficulty("sess-1", "too_easy");
    const next = useProgress.getState();
    assert.equal(next.sessions[0].difficultyNote, "too_easy");
    assert.equal(next.concepts["cpu-pipeline"].understanding, "got_it");
    assert.equal(next.concepts["cpu-pipeline"].lastQuizScore, 1);
    assert.equal(next.concepts["cpu-pipeline"].timesStudied, 2);
  });
});
