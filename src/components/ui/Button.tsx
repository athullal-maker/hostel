import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      fullWidth = false,
      disabled,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer select-none rounded-md shadow-2xs";

    // Touch targets sized to the 44px (Apple HIG) / 48px (Material) minimum
    // tap-target guidance so buttons feel right on a phone, not just a mouse.
    const sizeStyles = {
      sm: "text-xs px-3 py-2 gap-1.5 min-h-[38px]",
      md: "text-sm px-4 py-2.5 gap-2 min-h-[44px]",
      lg: "text-base px-6 py-3 gap-2.5 min-h-[48px] font-bold",
    };

    // One hue, varied by shade/weight instead of color — primary is the solid
    // brand blue, danger is a deeper blue solid so destructive actions still
    // read with extra weight without introducing a second color.
    const variantStyles = {
      primary:
        "bg-primary text-white hover:bg-primary-700 active:bg-primary-800 border border-primary active:border-primary-800 shadow-sm",
      outline:
        "bg-white text-charcoal hover:bg-surface hover:border-primary hover:text-primary active:bg-surface-muted border border-surface-border-strong",
      ghost:
        "bg-transparent text-charcoal hover:bg-surface-muted hover:text-primary active:bg-surface-border border border-transparent",
      danger:
        "bg-primary-900 text-white hover:bg-primary-800 active:bg-primary-900 border border-primary-900",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
