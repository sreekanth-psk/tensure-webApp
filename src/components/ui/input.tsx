import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-navy-200/80 bg-white/90 px-4 py-2 text-sm text-navy-900 shadow-sm transition-all placeholder:text-navy-400 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
