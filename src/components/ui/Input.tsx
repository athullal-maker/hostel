import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-charcoal tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 pointer-events-none text-charcoal-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full min-h-[44px] bg-white text-charcoal text-sm placeholder:text-charcoal-subtle border ${
              error ? "border-primary-900 focus:ring-primary-900" : "border-surface-border focus:border-primary"
            } rounded-[4px] px-3 py-2 ${leftIcon ? "pl-9" : ""} ${
              rightIcon ? "pr-9" : ""
            } focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:bg-surface-muted disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 pointer-events-none text-charcoal-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-primary-900 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-charcoal-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
