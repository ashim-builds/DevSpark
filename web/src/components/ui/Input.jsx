import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef(
  ({ className, type = "text", label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 border rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 shadow-xs",
          error ? "border-red-500 focus:ring-red-500" : "border-slate-300 hover:border-slate-400",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";

const Textarea = forwardRef(
  ({ className, label, error, rows = 4, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full px-4 py-2.5 border rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 resize-none shadow-xs",
          error ? "border-red-500 focus:ring-red-500" : "border-slate-300 hover:border-slate-400",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  ),
);
Textarea.displayName = "Textarea";

const Select = forwardRef(
  ({ className, label, error, options, placeholder, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 border rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 shadow-xs",
          error ? "border-red-500 focus:ring-red-500" : "border-slate-300 hover:border-slate-400",
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" className="bg-white text-slate-400">
            {placeholder}
          </option>
        )}
        {options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-slate-900"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  ),
);
Select.displayName = "Select";

export { Input, Textarea, Select };
export default Input;

