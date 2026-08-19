Drop lesson JSON files here (one lesson per file).
Each file must match src/content/schema.ts (lessonFileSchema).

Accepted source shapes:

  legacy: { "author": "...", "generator": "grok"|"gpt"|"claude"|"human", "version": "1.0" }
  v2:     { "type": "seed"|"human"|"imported"|"ai", "provider": "...", "model": "...",
            "schemaVersion": 1, "promptVersion": "dau-lesson-v1", "generatedAt": "..." }

Duration may be `durationMin` or `estimated_minutes` (5 | 10 | 20 | 30).
Concept id may be `conceptId` or `concept_id`.
Quiz must be exactly three questions with four choices and an explicit answerIndex.

The app never treats AI output as canonical. Generated units are cached locally
and can be edited, regenerated, archived, or marked accurate / unclear / suspect.

Example shape is in example-euv-resist.json.
The catalog merges these files with the seeded TypeScript lessons at import time.
