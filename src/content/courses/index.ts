import type { Course } from "@/lib/learning/types";
import { ARCH_GPU_COURSE } from "./arch-gpu";

export const COURSES: Course[] = [ARCH_GPU_COURSE];

export const COURSE_MAP: Record<string, Course> = Object.fromEntries(COURSES.map((c) => [c.id, c]));
