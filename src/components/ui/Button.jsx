import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

    const variants = {
      primary:
        "bg-brand-primary text-white shadow-sm hover:bg-brand-hover hover:shadow-md",

      secondary:
        "bg-brand-soft text-brand-primary hover:bg-rose-100",

      outline:
        "border border-border bg-white text-text-primary hover:border-brand-primary hover:text-brand-primary",

      ghost:
        "bg-transparent text-text-secondary hover:bg-brand-soft hover:text-brand-primary",

      danger:
        "bg-error text-white shadow-sm hover:bg-red-700 hover:shadow-md",

      white:
        "bg-white text-text-primary shadow-sm hover:bg-gray-50",
    };

    const sizes = {
      sm: "min-h-9 px-3 text-sm",
      md: "min-h-11 px-5 text-sm",
      lg: "min-h-12 px-6 text-base",
    };

    const classes = twMerge(
      clsx(
        baseStyles,
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth && "w-full",
        className
      )
    );

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}

        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;