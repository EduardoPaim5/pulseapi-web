import React from "react";

type ButtonVariant = "primary" | "ghost" | "outline";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-cyan-100/70 bg-[linear-gradient(180deg,rgba(240,255,255,0.95)_0%,rgba(132,227,255,0.75)_45%,rgba(72,183,229,0.92)_100%)] text-[#06405f] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_18px_rgba(0,91,130,0.35)] hover:brightness-110",
  ghost:
    "border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(178,232,251,0.26)_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] hover:brightness-110",
  outline:
    "border border-cyan-100/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.25)_0%,rgba(139,215,245,0.16)_100%)] text-white hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.4)_0%,rgba(139,215,245,0.24)_100%)]",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", loading, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold tracking-wide transition ${variantClasses[variant]} ${
          className ?? ""
        } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
