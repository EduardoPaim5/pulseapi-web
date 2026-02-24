import React from "react";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full border transition ${
        checked
          ? "border-emerald-100/60 bg-[linear-gradient(180deg,rgba(215,255,232,0.92)_0%,rgba(70,196,121,0.84)_100%)]"
          : "border-cyan-100/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(171,223,245,0.22)_100%)]"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#d2f6ff_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_9px_rgba(0,71,109,0.35)] transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default Toggle;
