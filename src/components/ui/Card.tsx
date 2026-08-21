import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = "",
      hoverEffect = false,
      padding = "md",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "bg-white border border-surface-border rounded-[6px] shadow-[0_1px_3px_rgba(43,43,43,0.04)]";

    const paddingStyles = {
      none: "",
      sm: "p-3",
      md: "p-4 sm:p-5",
      lg: "p-6 sm:p-8",
    };

    const hoverStyle = hoverEffect
      ? "transition-all duration-150 hover:border-surface-border-strong hover:shadow-[0_4px_12px_rgba(43,43,43,0.08)]"
      : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${paddingStyles[padding]} ${hoverStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
