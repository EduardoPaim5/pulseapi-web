import React from "react";

type ButtonVariant = "primary" | "ghost" | "outline";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-emerald-100/80 bg-[linear-gradient(180deg,rgba(252,255,252,0.98)_0%,rgba(190,248,214,0.82)_38%,rgba(126,225,197,0.88)_62%,rgba(105,204,247,0.85)_100%)] text-[#0a3546] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_18px_rgba(28,112,105,0.3)] hover:brightness-110",
  ghost:
    "border border-cyan-100/85 bg-[linear-gradient(180deg,rgba(246,255,255,0.95)_0%,rgba(150,232,255,0.72)_52%,rgba(193,170,255,0.62)_100%)] text-[#082a3a] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_18px_rgba(63,117,156,0.26)] hover:brightness-110",
  outline:
    "border border-amber-100/85 bg-[linear-gradient(180deg,rgba(255,252,240,0.9)_0%,rgba(255,222,138,0.72)_58%,rgba(255,201,108,0.62)_100%)] text-[#3a2408] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_18px_rgba(163,105,21,0.22)] hover:brightness-110",
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
