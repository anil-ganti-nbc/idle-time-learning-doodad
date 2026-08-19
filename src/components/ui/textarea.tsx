import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md bg-raised px-3 py-2 text-sm leading-relaxed text-fg shadow-[0_0_0_1px_rgba(255,255,255,0.08)] placeholder:text-subtle focus-visible:shadow-[0_0_0_1px_rgba(200,204,212,0.5)]",
        className,
      )}
      {...props}
    />
  );
}
