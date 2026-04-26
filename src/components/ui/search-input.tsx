import { cn } from "@/lib/cn";
import { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
  return (
    <div className={cn("flex gap-2", containerClassName)}>
      <input
        type="search"
        className={cn(
          "flex-1 bg-neutral-bg rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primary-light transition-colors",
          className
        )}
        placeholder="Search vendors..."
        {...props}
      />
    </div>
  );
}
