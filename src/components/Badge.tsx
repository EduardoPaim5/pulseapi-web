import React from "react";

type BadgeProps = {
  label: string;
  tone?: "success" | "warning" | "danger" | "neutral" | "info";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  success:
    "text-emerald-50 border-emerald-100/60 bg-[linear-gradient(180deg,rgba(227,255,240,0.9)_0%,rgba(74,201,128,0.8)_100%)]",
  warning:
    "text-amber-50 border-amber-100/60 bg-[linear-gradient(180deg,rgba(255,244,214,0.9)_0%,rgba(255,171,71,0.78)_100%)]",
  danger:
    "text-rose-50 border-rose-100/60 bg-[linear-gradient(180deg,rgba(255,225,230,0.9)_0%,rgba(233,91,118,0.82)_100%)]",
  neutral:
    "text-cyan-50 border-cyan-100/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(164,223,246,0.24)_100%)]",
  info:
    "text-cyan-50 border-cyan-100/60 bg-[linear-gradient(180deg,rgba(222,252,255,0.92)_0%,rgba(79,206,240,0.8)_100%)]",
};

const Badge: React.FC<BadgeProps> = ({ label, tone = "neutral" }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_6px_12px_rgba(0,76,116,0.2)] ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
};

export default Badge;
