import React from "react";

type TopbarProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onOpenNavigation?: () => void;
  breadcrumb?: React.ReactNode;
};

const Topbar: React.FC<TopbarProps> = ({ title, subtitle, actions, onOpenNavigation, breadcrumb }) => {
  return (
    <div className="relative flex flex-col gap-4 border-b border-cyan-100/45 pb-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="pointer-events-none absolute inset-x-0 -top-2 h-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_90%)]" />
      <div className="flex items-start gap-3">
        <button
          onClick={onOpenNavigation}
          className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-100/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(171,223,245,0.24)_100%)] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] lg:hidden"
          aria-label="Abrir navegação"
        >
          <span className="text-lg leading-none">≡</span>
        </button>
        <div>
          {breadcrumb ? <div className="mb-1 text-xs text-cyan-50/70">{breadcrumb}</div> : null}
          <h1 className="text-2xl font-semibold font-display text-cyan-50">{title}</h1>
          {subtitle ? <p className="text-cyan-50/85 text-sm">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
};

export default Topbar;
