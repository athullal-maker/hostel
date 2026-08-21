import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "neutral" | "outline" | "success" | "danger" | "warning";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "sm",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium tracking-tight rounded-sm transition-colors";

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  // One hue throughout — status is communicated by label/icon/weight, not by
  // switching color, so every variant is a shade of the same brand blue.
  const variantStyles = {
    primary: "bg-primary-50 text-primary border border-primary/20 font-semibold",
    neutral: "bg-surface-muted text-charcoal-muted border border-surface-border",
    outline: "bg-white text-charcoal-muted border border-surface-border-strong",
    success: "bg-primary-50 text-primary-700 border border-primary-500/30 font-semibold",
    danger: "bg-primary-50 text-primary-900 border border-primary-900/30 font-semibold",
    warning: "bg-primary-50 text-primary-800 border border-primary/30 font-semibold",
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
