import React from "react";

const EmptyState: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  return (
    <div className="glass-card p-6 text-center">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-white/60 mt-2">{subtitle}</div>
    </div>
  );
};

export default EmptyState;
