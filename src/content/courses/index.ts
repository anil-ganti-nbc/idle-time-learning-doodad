import { SEEDED_COURSES } from "../curriculum/assembled";
import type { Course } from "@/lib/learning/types";

export const COURSES: Course[] = SEEDED_COURSES;
export const COURSE_MAP: Record<string, Course> = Object.fromEntries(COURSES.map((c) => [c.id, c]));

/** @deprecated Prefer COURSES.find or COURSE_MAP. Kept for older imports. */
export const ARCH_GPU_COURSE = COURSE_MAP["arch-gpu"];
