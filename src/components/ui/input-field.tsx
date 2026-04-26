import { cn } from "@/lib/cn";
import { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function InputField({ label, className, id, ...props }: InputFieldProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-xs text-neutral-secondary mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full bg-neutral-bg rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-primary-light transition-colors",
          className
        )}
        {...props}
      />
    </div>
  );
}
