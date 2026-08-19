import { z } from "zod";

export const curriculumSourceKindSchema = z.enum(["syllabus", "ocw", "textbook", "vendor", "notes"]);

export const curriculumSourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url().optional(),
  institution: z.string().min(1),
  kind: curriculumSourceKindSchema,
  informed: z.array(z.string().min(1)).min(1),
  notes: z.string().min(8),
});

export const manifestConceptSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(8),
  tier: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  moduleId: z.string().min(1),
  prerequisites: z.array(z.string()),
  parentId: z.string().optional(),
  objectives: z.array(z.string().min(4)).optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  sourceIds: z.array(z.string()).optional(),
});

export const manifestModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  blurb: z.string().min(4),
  order: z.number().int().nonnegative(),
  prerequisites: z.array(z.string()),
  spineIds: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string().min(4)).optional(),
  sourceIds: z.array(z.string()).optional(),
});

export const courseManifestSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  categoryId: z.string().min(1),
  description: z.string().min(20),
  curriculumVersion: z.number().int().positive(),
  orderHint: z.number().int().nonnegative(),
  difficultyRange: z.tuple([
    z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  ]),
  entryRequirements: z.array(z.string()),
  sourceReferences: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1),
      url: z.string().optional(),
      kind: curriculumSourceKindSchema,
      notes: z.string().min(4),
    }),
  ),
  modules: z.array(manifestModuleSchema).min(1),
  concepts: z.array(manifestConceptSchema).min(1),
});

export const retiredConceptSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  parentId: z.string().optional(),
  prerequisites: z.array(z.string()),
  level: z.enum(["intro", "core", "journalist"]),
  summary: z.string().min(4),
});

export type CourseManifest = z.infer<typeof courseManifestSchema>;
export type ManifestConcept = z.infer<typeof manifestConceptSchema>;
export type CurriculumSourceRecord = z.infer<typeof curriculumSourceSchema>;
