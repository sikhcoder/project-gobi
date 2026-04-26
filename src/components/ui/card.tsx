import { cn } from "@/lib/cn";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: string;
}

export function Card({ className, padding = "p-4", children, ...props }: CardProps) {
  return (
    <div
      className={cn("bg-white border border-black/10 rounded-xl", padding, className)}
      {...props}
    >
      {children}
    </div>
  );
}
